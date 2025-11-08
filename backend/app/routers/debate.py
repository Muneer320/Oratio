from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List
import asyncio
from app.schemas import TurnSubmit, TurnResponse
from app.replit_auth import get_current_user
from app.database import get_db
from app.repositories import (
    Repository, RoomRepository, ParticipantRepository, 
    TurnRepository, ResultRepository, SpectatorVoteRepository
)
from app.models import DebateStatus, Room, Participant, Turn, Result, User, SpectatorVote
from app.gemini_ai import GeminiAI
from app.cache import user_cache, room_cache

router = APIRouter(prefix="/api/debate", tags=["Debate"])

# Room-level locks to prevent concurrent submission races
# (In-memory locks for atomicity)
_room_locks: Dict[int, asyncio.Lock] = {}


async def generate_debate_results(room_id: int, db: AsyncSession):
    """
    Generate comprehensive AI results after debate completes
    Calculates scores, determines winner, generates personalized feedback
    """
    room = await Repository.get_by_id(db, Room, room_id)
    if not room:
        raise ValueError("Room not found")

    # Get all participants and turns
    participants = await ParticipantRepository.get_room_participants(db, room_id)
    all_turns = await TurnRepository.get_room_turns(db, room_id)
    debaters = [p for p in participants if p.role == "debater"]

    # Calculate participant scores from turn feedback
    participant_scores = {}
    participant_feedback = {}

    for participant in debaters:
        # Get all turns for this participant
        participant_turns = [
            t for t in all_turns if t.speaker_id == participant.id]

        if not participant_turns:
            continue

        # Aggregate scores
        total_logic = 0
        total_credibility = 0
        total_rhetoric = 0
        count = 0
        all_strengths = []
        all_weaknesses = []

        for turn in participant_turns:
            feedback = turn.ai_feedback if turn.ai_feedback else {}
            if feedback:
                total_logic += feedback.get("logic", 0)
                total_credibility += feedback.get("credibility", 0)
                total_rhetoric += feedback.get("rhetoric", 0)
                count += 1

                if feedback.get("strengths"):
                    all_strengths.extend(feedback["strengths"])
                if feedback.get("weaknesses"):
                    all_weaknesses.extend(feedback["weaknesses"])

        if count > 0:
            avg_scores = {
                "logic": total_logic / count,
                "credibility": total_credibility / count,
                "rhetoric": total_rhetoric / count
            }

            # Calculate weighted total (Logic 40%, Credibility 35%, Rhetoric 25%)
            weighted_total = (
                avg_scores["logic"] * 0.4 +
                avg_scores["credibility"] * 0.35 +
                avg_scores["rhetoric"] * 0.25
            )

            participant_scores[participant.id] = {
                **avg_scores,
                "weighted_total": weighted_total,
                "total": weighted_total  # Alias for compatibility
            }

            # Store individual feedback
            participant_feedback[participant.id] = {
                # Top 5 unique strengths
                "strengths": list(set(all_strengths))[:5],
                # Top 5 unique weaknesses
                "weaknesses": list(set(all_weaknesses))[:5],
                "improvements": [
                    "Focus on providing more evidence to support your claims",
                    "Strengthen your logical structure and transitions",
                    "Enhance your rhetorical techniques for greater persuasion"
                ][:3]
            }

            # Update participant with scores
            await Repository.update_record(
                db, Participant, participant.id,
                {"score": avg_scores}
            )

    # Determine winner (highest weighted score)
    winner_id = None
    if participant_scores:
        winner_id = max(participant_scores.keys(
        ), key=lambda pid: participant_scores[pid]["weighted_total"])

    # Generate AI summary and verdict (convert Turn objects to dicts for AI)
    try:
        all_turns_data = [
            {
                "id": t.id,
                "speaker_id": t.speaker_id,
                "content": t.content,
                "round_number": t.round_number,
                "ai_feedback": t.ai_feedback
            } for t in all_turns
        ]
        room_data = {
            "id": room.id,
            "topic": room.topic,
            "description": room.description,
            "status": room.status
        }
        verdict = await GeminiAI.generate_final_verdict(
            room_data=room_data,
            all_turns=all_turns_data,
            participant_scores=participant_scores
        )

        summary = verdict.get("summary", "Debate completed successfully.")
        ai_feedback = verdict.get("feedback", {})
        
        # Ensure ai_feedback is a dict (fallback sometimes returns string)
        if not isinstance(ai_feedback, dict):
            ai_feedback = {}

        # Merge AI feedback with calculated feedback
        for pid, ai_fb in ai_feedback.items():
            if int(pid) in participant_feedback:
                participant_feedback[int(pid)]["ai_insights"] = ai_fb
    except Exception as e:
        print(f"⚠️  AI verdict generation failed: {e}")
        summary = f"Debate on '{room.topic}' has concluded. Review individual scores below."

    # Ensure ALL debaters have entries (even if they have no turns)
    for participant in debaters:
        if participant.id not in participant_scores:
            participant_scores[participant.id] = {
                "logic": 0,
                "credibility": 0,
                "rhetoric": 0,
                "weighted_total": 0,
                "total": 0
            }
        if participant.id not in participant_feedback:
            participant_feedback[participant.id] = {
                "strengths": ["Participated in the debate"],
                "weaknesses": ["Submit more turns to get detailed feedback"],
                "improvements": ["Engage more actively in future debates"]
            }

    # Create result record
    from datetime import datetime
    result = {
        "room_id": room_id,
        "winner_id": winner_id,
        "summary": summary,
        "scores_json": participant_scores,
        "feedback_json": participant_feedback,
        "created_at": datetime.utcnow()
    }

    # Save result to database
    await Repository.create(db, Result, result)

    return result


async def _analyze_round_background(room: Room, round_number: int, round_turns: List[Turn], all_turns: List[Turn], debater_count: int, db: AsyncSession):
    """
    Background task: Analyze all turns in a round in parallel
    PERFORMANCE FIX: Uses asyncio.gather() for parallel AI analysis
    """
    print(f"🎯 Round {round_number} complete! Analyzing {len(round_turns)} turns in parallel...")

    # PERFORMANCE FIX: Analyze all turns in parallel using asyncio.gather()
    async def analyze_turn(turn):
        if turn.ai_feedback is None:
            try:
                ai_feedback = await GeminiAI.analyze_debate_turn(
                    turn_content=turn.content,
                    context=room.topic
                )
                await Repository.update_record(
                    db, Turn, turn.id,
                    {"ai_feedback": ai_feedback}
                )
                print(f"✅ Analyzed turn {turn.id}")
            except Exception as e:
                print(f"⚠️  Failed to analyze turn {turn.id}: {e}")

    # Analyze all turns in parallel
    await asyncio.gather(*[analyze_turn(turn) for turn in round_turns])
    print(f"✅ Round {round_number} analysis complete!")

    # Check if ALL rounds are now complete and auto-end the debate
    total_rounds = room.rounds if room.rounds else 3
    expected_total_turns = total_rounds * debater_count

    if len(all_turns) >= expected_total_turns and room.status == "ongoing":
        print(f"🏁 All {total_rounds} rounds complete ({len(all_turns)}/{expected_total_turns} turns)! Auto-ending debate...")
        await Repository.update_record(db, Room, room.id, {"status": "completed"})
        
        # Invalidate all caches for this room (auto-ended)
        room_cache.delete(f"debate_status_{room.id}")
        room_cache.delete(f"transcript_{room.id}")
        room_cache.delete(f"room_code_{room.room_code.upper()}")
        
        print("✅ Debate automatically ended")

        # Generate comprehensive AI results
        try:
            await generate_debate_results(room.id, db)
            print("✅ AI results generated successfully")
        except Exception as e:
            print(f"⚠️  Failed to generate results: {e}")


async def check_and_analyze_round(room: Room, round_number: int, db: AsyncSession):
    """
    Check if round is complete and trigger FIRE-AND-FORGET batch AI analysis
    PERFORMANCE FIX: Does NOT block submission response
    """
    # Get all participants who are debaters
    participants = await ParticipantRepository.get_room_participants(db, room.id, role="debater")
    debater_count = len(participants)

    if debater_count == 0:
        debater_count = 2  # Default to 2 if no debaters found

    # Get all turns for this round
    all_turns = await TurnRepository.get_room_turns(db, room.id)
    round_turns = [t for t in all_turns if t.round_number == round_number]

    # Check if round is complete
    if len(round_turns) >= debater_count:
        # PERFORMANCE FIX: Fire-and-forget AI analysis (don't await)
        import asyncio
        asyncio.create_task(_analyze_round_background(
            room, round_number, round_turns, all_turns, debater_count, db
        ))
        # Return immediately without waiting for AI analysis


@router.post("/{room_id}/submit-turn", response_model=TurnResponse)
async def submit_turn(
    room_id: str,
    turn_data: TurnSubmit,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Submit a debate turn (text argument)
    AI analysis happens in batch after round completion
    """
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if room.status == DebateStatus.UPCOMING.value:
        await Repository.update_record(db, Room, int(room_id), {
                  "status": DebateStatus.ONGOING.value})
        room.status = DebateStatus.ONGOING.value
        
        # Invalidate caches when debate starts
        room_cache.delete(f"debate_status_{room_id}")
        room_cache.delete(f"room_code_{room.room_code.upper()}")

    if room.status != DebateStatus.ONGOING.value:
        raise HTTPException(
            status_code=400, detail="Debate has ended or was cancelled")
    
    # VALIDATION: Reject submissions with invalid round numbers
    total_rounds = room.rounds if room.rounds else 3
    if turn_data.round_number > total_rounds:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid round number. Debate has only {total_rounds} rounds."
        )

    participant = await ParticipantRepository.get_by_user_and_room(
        db, int(current_user["id"]), room.id
    )
    if not participant:
        raise HTTPException(
            status_code=403, detail="Not a participant in this debate")

    # PERFORMANCE FIX: Only fetch last turn for enforcement (not all turns)
    all_turns = await TurnRepository.get_room_turns(db, room.id)
    
    # CRITICAL VALIDATION: Reject submissions when round already has enough turns
    participants_list = await ParticipantRepository.get_room_participants(db, room.id)
    debater_count = len([p for p in participants_list if p.role == "debater"])
    round_turns = [t for t in all_turns if t.round_number == turn_data.round_number]
    
    if len(round_turns) >= debater_count:
        raise HTTPException(
            status_code=400,
            detail=f"Round {turn_data.round_number} already has {debater_count} turns. Wait for next round."
        )
    if all_turns:
        # Sort by timestamp to get the most recent turn (only need one)
        last_turn = max(all_turns, key=lambda x: x.timestamp if x.timestamp else "")

        # Check if the same participant submitted the last turn
        if last_turn.speaker_id == participant.id:
            raise HTTPException(
                status_code=400,
                detail="You cannot submit consecutive turns. Please wait for another participant to respond."
            )

        # For team debates, check if same team submitted the last turn
        if room.mode == "team" and participant.team:
            last_speaker = await Repository.get_by_id(db, Participant, last_turn.speaker_id)
            if last_speaker and last_speaker.team == participant.team:
                raise HTTPException(
                    status_code=400,
                    detail="Your team cannot submit consecutive turns. Please wait for the other team to respond."
                )

    from datetime import datetime

    # CRITICAL: Acquire room lock to prevent concurrent submission races
    if room.id not in _room_locks:
        _room_locks[room.id] = asyncio.Lock()
    
    async with _room_locks[room.id]:
        # Re-validate ALL constraints immediately before insert (inside lock for atomicity)
        all_turns_final = await TurnRepository.get_room_turns(db, room.id)
        round_turns_final = [t for t in all_turns_final if t.round_number == turn_data.round_number]
        
        # Check round capacity
        if len(round_turns_final) >= debater_count:
            raise HTTPException(
                status_code=400,
                detail=f"Round {turn_data.round_number} already has {debater_count} turns. Wait for next round."
            )
        
        # Re-check consecutive turn enforcement (critical for fairness)
        if all_turns_final:
            last_turn_locked = max(all_turns_final, key=lambda x: x.timestamp if x.timestamp else "")
            
            if last_turn_locked.speaker_id == participant.id:
                raise HTTPException(
                    status_code=400,
                    detail="You cannot submit consecutive turns. Please wait for another participant to respond."
                )
            
            if room.mode == "team" and participant.team:
                last_speaker_locked = await Repository.get_by_id(db, Participant, last_turn_locked.speaker_id)
                if last_speaker_locked and last_speaker_locked.team == participant.team:
                    raise HTTPException(
                        status_code=400,
                        detail="Your team cannot submit consecutive turns. Please wait for the other team to respond."
                    )
        
        new_turn = {
            "room_id": room.id,
            "speaker_id": participant.id,
            "content": turn_data.content,
            "audio_url": None,
            "round_number": turn_data.round_number,
            "turn_number": turn_data.turn_number,
            "ai_feedback": None,
            "timestamp": datetime.utcnow()
        }

        turn = await Repository.create(db, Turn, new_turn)

    # Invalidate caches for this room (new data available)
    room_cache.delete(f"debate_status_{room_id}")
    room_cache.delete(f"transcript_{room_id}")

    # Check if round is complete and trigger batch analysis
    await check_and_analyze_round(room, turn_data.round_number, db)

    return turn


@router.post("/{room_id}/submit-audio", response_model=TurnResponse)
async def submit_audio(
    room_id: str,
    audio: UploadFile = File(...),
    round_number: int = Form(1),
    turn_number: int = Form(1),
    content: str = Form(""),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Submit a debate turn with audio (and optional text)
    """
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if room.status == DebateStatus.UPCOMING.value:
        await Repository.update_record(db, Room, int(room_id), {
                  "status": DebateStatus.ONGOING.value})
        room.status = DebateStatus.ONGOING.value
        
        # Invalidate caches when debate starts
        room_cache.delete(f"debate_status_{room_id}")
        room_cache.delete(f"room_code_{room.room_code.upper()}")

    if room.status != DebateStatus.ONGOING.value:
        raise HTTPException(
            status_code=400, detail="Debate has ended or was cancelled")
    
    # VALIDATION: Reject submissions with invalid round numbers
    total_rounds = room.rounds if room.rounds else 3
    if round_number > total_rounds:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid round number. Debate has only {total_rounds} rounds."
        )

    participant = await ParticipantRepository.get_by_user_and_room(
        db, int(current_user["id"]), room.id
    )
    if not participant:
        raise HTTPException(
            status_code=403, detail="Not a participant in this debate")

    # Save audio file FIRST (before any validation that could race)
    import os
    os.makedirs("uploads/audio", exist_ok=True)
    audio_path = f"uploads/audio/{room_id}_{participant.id}_{turn_number}.webm"

    # Read and save audio file (LONG OPERATION)
    audio_content = await audio.read()
    with open(audio_path, "wb") as f:
        f.write(audio_content)

    # Transcribe audio using Gemini AI (LONG OPERATION)
    transcription = await GeminiAI.transcribe_audio(audio_path)

    # Use transcription as content (or combine with provided text)
    final_content = content.strip() if content.strip() else transcription
    if content.strip() and transcription and transcription not in ["[Audio transcription unavailable]", "[Audio transcription failed - please try again]"]:
        final_content = f"{content.strip()}\n\n[Transcription]: {transcription}"

    # CRITICAL: Validate IMMEDIATELY BEFORE INSERT to close race window
    # Re-fetch turns to get latest state after long audio operations
    all_turns = await TurnRepository.get_room_turns(db, room.id)
    participants_list = await ParticipantRepository.get_room_participants(db, room.id)
    debater_count = len([p for p in participants_list if p.role == "debater"])
    round_turns = [t for t in all_turns if t.round_number == round_number]
    
    # Check round capacity
    if len(round_turns) >= debater_count:
        raise HTTPException(
            status_code=400,
            detail=f"Round {round_number} already has {debater_count} turns. Wait for next round."
        )
    
    # Check consecutive turn enforcement
    if all_turns:
        last_turn = max(all_turns, key=lambda x: x.timestamp if x.timestamp else "")
        
        if last_turn.speaker_id == participant.id:
            raise HTTPException(
                status_code=400,
                detail="You cannot submit consecutive turns. Please wait for another participant to respond."
            )
        
        if room.mode == "team" and participant.team:
            last_speaker = await Repository.get_by_id(db, Participant, last_turn.speaker_id)
            if last_speaker and last_speaker.team == participant.team:
                raise HTTPException(
                    status_code=400,
                    detail="Your team cannot submit consecutive turns. Please wait for the other team to respond."
                )

    from datetime import datetime

    # CRITICAL: Acquire room lock to prevent concurrent submission races
    if room.id not in _room_locks:
        _room_locks[room.id] = asyncio.Lock()
    
    async with _room_locks[room.id]:
        # Re-validate ALL constraints immediately before insert (inside lock for atomicity)
        all_turns_final = await TurnRepository.get_room_turns(db, room.id)
        round_turns_final = [t for t in all_turns_final if t.round_number == round_number]
        
        # Check round capacity
        if len(round_turns_final) >= debater_count:
            raise HTTPException(
                status_code=400,
                detail=f"Round {round_number} already has {debater_count} turns. Wait for next round."
            )
        
        # Re-check consecutive turn enforcement (critical for fairness)
        if all_turns_final:
            last_turn_locked = max(all_turns_final, key=lambda x: x.timestamp if x.timestamp else "")
            
            if last_turn_locked.speaker_id == participant.id:
                raise HTTPException(
                    status_code=400,
                    detail="You cannot submit consecutive turns. Please wait for another participant to respond."
                )
            
            if room.mode == "team" and participant.team:
                last_speaker_locked = await Repository.get_by_id(db, Participant, last_turn_locked.speaker_id)
                if last_speaker_locked and last_speaker_locked.team == participant.team:
                    raise HTTPException(
                        status_code=400,
                        detail="Your team cannot submit consecutive turns. Please wait for the other team to respond."
                    )
        
        # Create turn with audio and transcription
        new_turn = {
            "room_id": room.id,
            "speaker_id": participant.id,
            "content": final_content,
            "audio_url": audio_path,
            "round_number": round_number,
            "turn_number": turn_number,
            "ai_feedback": None,  # Will be analyzed in batch after round completion
            "timestamp": datetime.utcnow()
        }

        turn = await Repository.create(db, Turn, new_turn)

    # Invalidate caches for this room (new data available)
    room_cache.delete(f"debate_status_{room_id}")
    room_cache.delete(f"transcript_{room_id}")

    # Check if round is complete and trigger batch analysis
    await check_and_analyze_round(room, round_number, db)

    return turn


@router.get("/{room_id}/transcript", response_model=List[TurnResponse])
async def get_transcript(room_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get full debate transcript with caching
    PERFORMANCE: 120s cache + strict limit
    """
    # Try cache first (120 second TTL for transcript)
    cache_key = f"transcript_{room_id}"
    cached_transcript = room_cache.get(cache_key)
    if cached_transcript:
        return cached_transcript

    # Fetch from database with strict limit
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # PERFORMANCE: Limit to 50 turns max (3 rounds × 4 debaters × 4 turns = 48 max typical)
    turns = await TurnRepository.get_room_turns(db, room.id, limit=50)
    sorted_turns = sorted(turns, key=lambda x: (
        x.round_number, x.turn_number))

    # Cache for 120 seconds (ultra-aggressive caching)
    room_cache.set(cache_key, sorted_turns, ttl_seconds=120)

    return sorted_turns


@router.post("/{room_id}/end")
async def end_debate(
    room_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    End a debate and trigger final AI judging
    """
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if str(room.host_id) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Only the host can end the debate")

    if room.status != DebateStatus.ONGOING.value:
        raise HTTPException(status_code=400, detail="Debate is not ongoing")

    await Repository.update_record(db, Room, int(room_id), {
              "status": DebateStatus.COMPLETED.value})

    # Invalidate all caches for this room (status changed to completed)
    room_cache.delete(f"debate_status_{room_id}")
    room_cache.delete(f"transcript_{room_id}")
    room_cache.delete(f"room_code_{room.room_code.upper()}")

    participants = await ParticipantRepository.get_room_participants(db, room.id)
    turns = await TurnRepository.get_room_turns(db, room.id)

    participant_scores = {}
    for participant in participants:
        if participant.role == "debater":
            participant_scores[participant.id] = participant.score if participant.score else {}

    # Convert ORM objects to dicts for AI
    room_data = {
        "id": room.id,
        "topic": room.topic,
        "description": room.description,
        "status": room.status
    }
    turns_data = [
        {
            "id": t.id,
            "speaker_id": t.speaker_id,
            "content": t.content,
            "round_number": t.round_number,
            "ai_feedback": t.ai_feedback
        } for t in turns
    ]

    final_verdict = await GeminiAI.generate_final_verdict(
        room_data=room_data,
        all_turns=turns_data,
        participant_scores=participant_scores
    )

    spectator_votes = await SpectatorVoteRepository.get_room_votes(db, room.id)
    spectator_influence = {}
    for vote in spectator_votes:
        target_id = str(vote.target_id)
        if target_id not in spectator_influence:
            spectator_influence[target_id] = 0
        spectator_influence[target_id] += 1

    result = {
        "room_id": room.id,
        "winner_id": final_verdict.get("winner_id"),
        "scores_json": participant_scores,
        "feedback_json": final_verdict.get("feedback", {}),
        "summary": final_verdict.get("summary", "Debate concluded."),
        "report_url": None,
        "spectator_influence": spectator_influence
    }

    await Repository.create(db, Result, result)

    return {"message": "Debate ended", "result": result}


@router.get("/{room_id}/status")
async def get_debate_status(room_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get current debate status with caching and optimized payload
    PERFORMANCE: 120s cache + strict limits
    """
    # Try cache first (120 second TTL for debate status)
    cache_key = f"debate_status_{room_id}"
    cached_status = room_cache.get(cache_key)
    if cached_status:
        return cached_status

    # Fetch from database with strict limits
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # PERFORMANCE: Limit queries to reduce DB load
    participants = await ParticipantRepository.get_room_participants(db, room.id)
    turns = await TurnRepository.get_room_turns(db, room.id, limit=50)

    # Batch fetch all unique users (single DB query per unique user, using cache)
    user_ids = list(set(p.user_id for p in participants))
    user_map = {}
    for user_id in user_ids:
        cache_key_user = f"user_{user_id}"
        user = user_cache.get(cache_key_user)
        if user is None:
            user_obj = await Repository.get_by_id(db, User, user_id)
            if user_obj:
                # Cache as dict for compatibility
                user = {
                    "id": user_obj.id,
                    "username": user_obj.username,
                    "full_name": user_obj.full_name
                }
                user_cache.set(cache_key_user, user)
        if user:
            user_map[user_id] = user

    # Enrich participants with minimal user info
    enriched_participants = []
    for participant in participants:
        user = user_map.get(participant.user_id)
        # Only include essential fields to reduce payload size
        enriched_participants.append({
            "id": participant.id,
            "user_id": participant.user_id,
            "username": user.get("username", "Unknown") if user else "Unknown",
            "name": (user.get("full_name") or user.get("username", "Unknown")) if user else "Unknown",
            "team": participant.team,
            "role": participant.role,
            "is_ready": participant.is_ready if participant.is_ready is not None else False,
            "score": participant.score if participant.score else {}
        })

    # Minimize room data in response (only essential fields)
    status_response = {
        "room": {
            "id": room.id,
            "topic": room.topic,
            "status": room.status,
            "rounds": room.rounds if room.rounds else 3,
            "mode": room.mode,
            "type": room.type,
            "room_code": room.room_code,
            "host_id": room.host_id
        },
        "participants": enriched_participants,
        "turn_count": len(turns),
        "status": room.status
    }

    # Cache for 120 seconds (ultra-aggressive caching)
    room_cache.set(cache_key, status_response, ttl_seconds=120)

    return status_response
