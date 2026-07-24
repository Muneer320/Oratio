from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import Dict, Any, List
import asyncio
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4
from fastapi.responses import FileResponse
from app.schemas import TurnSubmit, TurnResponse
from app.replit_auth import get_current_user
from app.replit_db import DB, Collections
from app.gemini_ai import GeminiAI, GEMINI_AVAILABLE
from app.models import DebateStatus
from app.cache import user_cache, room_cache
from app.socketio_app import broadcast_to_room
from app.scoring import aggregate_debate_scores, valid_feedback
from app.room_access import require_room_access

router = APIRouter(prefix="/api/debate", tags=["Debate"])
AUDIO_DIR = Path(__file__).resolve().parents[2] / "uploads" / "audio"

# Room-level locks to prevent concurrent submission races
# (ReplitDB doesn't support atomic operations, so we use in-memory locks)
_room_locks: Dict[str, asyncio.Lock] = {}


async def generate_debate_results(room_id: str):
    """Store one result schema for both manual and automatic endings."""
    room = DB.get(Collections.ROOMS, str(room_id))
    if not room:
        raise ValueError("Room not found")
    participants = DB.find(Collections.PARTICIPANTS, {"room_id": room["id"]}, limit=None)
    turns = DB.find(Collections.TURNS, {"room_id": room["id"]}, limit=None)
    scores, feedback, judged, winner_id = aggregate_debate_scores(participants, turns)
    for participant_id, score in scores.items():
        DB.update(Collections.PARTICIPANTS, participant_id, {"score": score})

    verdict = await GeminiAI.generate_final_verdict(room, turns, scores) if judged else None
    if verdict:
        summary = verdict.get("summary", "Debate completed.")
        for participant_id, insight in verdict.get("feedback", {}).items():
            if str(participant_id) in feedback:
                feedback[str(participant_id)]["ai_insights"] = insight
    elif judged:
        summary = "Debate completed. Scores are based on analyzed turns; summary unavailable."
    else:
        summary = "Debate completed without a full AI evaluation. No winner was selected."

    votes = DB.find(Collections.SPECTATOR_VOTES, {"room_id": room["id"]}, limit=None)
    spectator_influence = {}
    for vote in votes:
        target = str(vote.get("target_id"))
        spectator_influence[target] = spectator_influence.get(target, 0) + 1

    result = {
        "room_id": room["id"],
        "winner_id": winner_id,
        "judged": judged,
        "scores": scores,
        "feedback": feedback,
        "summary": summary,
        "spectator_influence": spectator_influence,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    existing = DB.find_one(Collections.RESULTS, {"room_id": room["id"]})
    if existing:
        return DB.update(Collections.RESULTS, str(existing["id"]), result)
    return DB.insert(Collections.RESULTS, result)

async def _generate_ai_turn(room: Dict[str, Any], ai_participant: Dict[str, Any], round_number: int, turn_number: int, previous_turns: List[Dict]):
    """
    Generate an AI opponent's turn using Gemini AI
    """
    try:
        # Get context from previous turns
        context = f"Topic: {room.get('topic')}\n\n"
        if previous_turns:
            context += "Previous arguments:\n"
            for t in previous_turns[-3:]:  # Last 3 turns for context
                context += f"- {t.get('content', '')}\n"
        
        # Generate AI argument
        prompt = f"""You are debating on: {room.get('topic')}

{context}

Generate a compelling debate argument (2-3 paragraphs). Be persuasive, use logic and evidence, and respond to previous points if any."""
        
        ai_content = await GeminiAI.generate_debate_argument(prompt)
        if not ai_content:
            return None
        
        # Create AI turn
        ai_turn = {
            "room_id": room["id"],
            "speaker_id": ai_participant["id"],
            "speaker_name": "AI Opponent",
            "round_number": round_number,
            "turn_number": turn_number,
            "content": ai_content,
            "audio_url": None,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "is_ai": True
        }
        
        new_turn = DB.insert(Collections.TURNS, ai_turn)
        print(f"🤖 AI Opponent submitted turn {turn_number} in round {round_number}")
        
        # Broadcast Socket.IO notification
        try:
            await broadcast_to_room(room["id"], "new_turn", {
                "turn": new_turn,
                "speaker_id": ai_participant["id"],
                "speaker_name": "AI Opponent",
                "timestamp": new_turn.get("timestamp")
            })
        except Exception as error:
            print(f"AI turn broadcast failed: {error}")
        return new_turn
    except Exception as e:
        print(f"⚠️  AI turn generation failed: {e}")
        return None


async def respond_in_training(room: Dict[str, Any], round_number: int):
    """Generate the AI response immediately after the human turn."""
    if not room.get("is_training"):
        return True
    participants = DB.find(Collections.PARTICIPANTS, {"room_id": room["id"]})
    ai_participant = next((p for p in participants if p.get("is_ai")), None)
    if not ai_participant:
        return False
    turns = DB.find(Collections.TURNS, {"room_id": room["id"]}, limit=None)
    round_turns = [turn for turn in turns if turn.get("round_number") == round_number]
    if any(str(turn.get("speaker_id")) == str(ai_participant["id"])
           for turn in round_turns):
        return True
    generated = await _generate_ai_turn(room, ai_participant, round_number,
                                        len(round_turns) + 1, turns)
    if not generated:
        await broadcast_to_room(room["id"], "ai_unavailable",
                                {"message": "AI opponent could not respond"})
        return False
    return True


async def _analyze_round_background(room: Dict[str, Any], round_number: int, round_turns: List[Dict], all_turns: List[Dict], debater_count: int):
    """
    Background task: Analyze all turns in a round in parallel
    PERFORMANCE FIX: Uses asyncio.gather() for parallel AI analysis
    """
    total_rounds = room.get("rounds", 3)
    expected_total_turns = total_rounds * debater_count
    is_final_round = len(all_turns) >= expected_total_turns
    turns_to_analyze = all_turns if is_final_round else round_turns
    print(f"🎯 Round {round_number} complete! Analyzing {len(turns_to_analyze)} turns in parallel...")

    # PERFORMANCE FIX: Analyze all turns in parallel using asyncio.gather()
    async def analyze_turn(turn):
        if turn.get("ai_feedback") is None:
            try:
                earlier = [item.get("content", "") for item in all_turns
                           if int(item["id"]) < int(turn["id"])]
                ai_feedback = await GeminiAI.analyze_debate_turn(
                    turn_content=turn["content"],
                    context=room.get("topic"),
                    previous_turns=earlier,
                )
                if valid_feedback(ai_feedback):
                    DB.update(Collections.TURNS, turn["id"],
                              {"ai_feedback": ai_feedback})
            except Exception as e:
                print(f"⚠️  Failed to analyze turn {turn['id']}: {e}")

    # Analyze all turns in parallel
    await asyncio.gather(*[analyze_turn(turn) for turn in turns_to_analyze])
    print(f"✅ Round {round_number} analysis complete!")
    analyzed = [DB.get(Collections.TURNS, str(turn["id"])) for turn in round_turns]
    await broadcast_to_room(room["id"], "round_scored", {
        "round_number": round_number,
        "judged": all(turn and valid_feedback(turn.get("ai_feedback")) for turn in analyzed),
    })
    
    # Check if ALL rounds are now complete and auto-end the debate
    current_room = DB.get(Collections.ROOMS, str(room["id"]))
    if current_room and is_final_round and current_room.get("status") == "ongoing":
        print(f"🏁 All {total_rounds} rounds complete ({len(all_turns)}/{expected_total_turns} turns)! Auto-ending debate...")
        try:
            result = await generate_debate_results(room["id"])
            DB.update(Collections.ROOMS, str(room["id"]), {"status": "completed"})
            room_cache.delete(f"debate_status_{room['id']}")
            room_cache.delete(f"transcript_{room['id']}")
            room_cache.delete(f"room_code_{room.get('room_code', '').upper()}")
            await broadcast_to_room(room["id"], "debate_ended", {"result": result})
            _room_locks.pop(str(room["id"]), None)
            print("✅ Debate automatically ended with results")
        except Exception as e:
            print(f"⚠️  Failed to generate results: {e}")


async def recover_pending_debates():
    """Finish rounds interrupted by a server restart."""
    for room in DB.find(Collections.ROOMS, {"status": "ongoing"}, limit=None):
        participants = DB.find(Collections.PARTICIPANTS, {"room_id": room["id"]}, limit=None)
        debater_count = sum(p.get("role") == "debater" for p in participants)
        if debater_count < 2:
            continue
        turns = DB.find(Collections.TURNS, {"room_id": room["id"]}, limit=None)
        completed_rounds = [round_number for round_number in range(1, room.get("rounds", 3) + 1)
                            if sum(t.get("round_number") == round_number for t in turns) >= debater_count]
        if not completed_rounds:
            continue
        if len(turns) >= room.get("rounds", 3) * debater_count:
            round_number = completed_rounds[-1]
            round_turns = [t for t in turns if t.get("round_number") == round_number]
            await _analyze_round_background(room, round_number, round_turns, turns, debater_count)
        else:
            for round_number in completed_rounds:
                round_turns = [t for t in turns if t.get("round_number") == round_number]
                if any(not valid_feedback(t.get("ai_feedback")) for t in round_turns):
                    await _analyze_round_background(room, round_number, round_turns, turns, debater_count)


async def check_and_analyze_round(room: Dict[str, Any], round_number: int):
    """
    Check if round is complete and trigger FIRE-AND-FORGET batch AI analysis
    PERFORMANCE FIX: Does NOT block submission response
    """
    # Get all participants who are debaters
    participants = DB.find(Collections.PARTICIPANTS, {"room_id": room["id"]})
    debater_count = len([p for p in participants if p.get("role") == "debater"])

    if debater_count == 0:
        return

    # Get all turns for this round
    all_turns = DB.find(Collections.TURNS, {"room_id": room["id"]}, limit=None)
    round_turns = [t for t in all_turns if t["round_number"] == round_number]

    # Check if round is complete
    if len(round_turns) >= debater_count:
        # PERFORMANCE FIX: Fire-and-forget AI analysis (don't await)
        import asyncio
        asyncio.create_task(_analyze_round_background(
            room, round_number, round_turns, all_turns, debater_count
        ))
        # Return immediately without waiting for AI analysis


@router.post("/{room_id}/submit-turn", response_model=TurnResponse)
async def submit_turn(
    room_id: str,
    turn_data: TurnSubmit,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Submit a debate turn (text argument)
    AI analysis happens in batch after round completion
    """
    room = DB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if room.get("is_training") and not GEMINI_AVAILABLE:
        raise HTTPException(status_code=503, detail="AI opponent is unavailable")

    if room["status"] == DebateStatus.UPCOMING.value:
        DB.update(Collections.ROOMS, room_id, {
                  "status": DebateStatus.ONGOING.value})
        room["status"] = DebateStatus.ONGOING.value
        
        # Invalidate caches when debate starts
        room_cache.delete(f"debate_status_{room_id}")
        room_cache.delete(f"room_code_{room.get('room_code', '').upper()}")

    if room["status"] != DebateStatus.ONGOING.value:
        raise HTTPException(
            status_code=400, detail="Debate has ended or was cancelled")
    
    # VALIDATION: Reject submissions with invalid round numbers
    total_rounds = room.get("rounds", 3)
    if turn_data.round_number > total_rounds:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid round number. Debate has only {total_rounds} rounds."
        )

    participant = DB.find_one(
        Collections.PARTICIPANTS,
        {"user_id": current_user["id"], "room_id": room["id"]}
    )
    if not participant:
        raise HTTPException(
            status_code=403, detail="Not a participant in this debate")
    if participant.get("role") != "debater":
        raise HTTPException(status_code=403, detail="Only debaters may submit turns")

    # PERFORMANCE FIX: Only fetch last turn for enforcement (not all turns)
    all_turns = DB.find(Collections.TURNS, {"room_id": room["id"]}, limit=None)
    
    # CRITICAL VALIDATION: Reject submissions when round already has enough turns
    participants_list = DB.find(Collections.PARTICIPANTS, {"room_id": room["id"]})
    debater_count = len([p for p in participants_list if p.get("role") == "debater"])
    round_turns = [t for t in all_turns if t.get("round_number") == turn_data.round_number]
    
    if len(round_turns) >= debater_count:
        raise HTTPException(
            status_code=400,
            detail=f"Round {turn_data.round_number} already has {debater_count} turns. Wait for next round."
        )
    if all_turns:
        # Sort by timestamp to get the most recent turn (only need one)
        last_turn = max(all_turns, key=lambda x: x.get("timestamp", ""))

        # Check if the same participant submitted the last turn
        if last_turn["speaker_id"] == participant["id"]:
            raise HTTPException(
                status_code=400,
                detail="You cannot submit consecutive turns. Please wait for another participant to respond."
            )

        # For team debates, check if same team submitted the last turn
        if room.get("format") == "team" and participant.get("team"):
            last_speaker = DB.get(Collections.PARTICIPANTS,
                                  last_turn["speaker_id"])
            if last_speaker and last_speaker.get("team") == participant.get("team"):
                raise HTTPException(
                    status_code=400,
                    detail="Your team cannot submit consecutive turns. Please wait for the other team to respond."
                )

    # CRITICAL: Acquire room lock to prevent concurrent submission races
    if room["id"] not in _room_locks:
        _room_locks[room["id"]] = asyncio.Lock()
    
    async with _room_locks[room["id"]]:
        if DB.get(Collections.ROOMS, room_id).get("status") != DebateStatus.ONGOING.value:
            raise HTTPException(status_code=409, detail="Debate has ended")
        # Re-validate ALL constraints immediately before insert (inside lock for atomicity)
        all_turns_final = DB.find(Collections.TURNS, {"room_id": room["id"]}, limit=None)
        round_turns_final = [t for t in all_turns_final if t.get("round_number") == turn_data.round_number]
        
        # Check round capacity
        if len(round_turns_final) >= debater_count:
            raise HTTPException(
                status_code=400,
                detail=f"Round {turn_data.round_number} already has {debater_count} turns. Wait for next round."
            )
        
        # Re-check consecutive turn enforcement (critical for fairness)
        if all_turns_final:
            last_turn_locked = max(all_turns_final, key=lambda x: x.get("timestamp", ""))
            
            if last_turn_locked["speaker_id"] == participant["id"]:
                raise HTTPException(
                    status_code=400,
                    detail="You cannot submit consecutive turns. Please wait for another participant to respond."
                )
            
            if room.get("format") == "team" and participant.get("team"):
                last_speaker_locked = DB.get(Collections.PARTICIPANTS, last_turn_locked["speaker_id"])
                if last_speaker_locked and last_speaker_locked.get("team") == participant.get("team"):
                    raise HTTPException(
                        status_code=400,
                        detail="Your team cannot submit consecutive turns. Please wait for the other team to respond."
                    )
        
        new_turn = {
            "room_id": room["id"],
            "speaker_id": participant["id"],
            "content": turn_data.content,
            "audio_url": None,
            "round_number": turn_data.round_number,
            "turn_number": len(round_turns_final) + 1,
            "ai_feedback": None,  # Will be analyzed in batch after round completion
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        turn = DB.insert(Collections.TURNS, new_turn)

    # Invalidate caches for this room (new data available)
    room_cache.delete(f"debate_status_{room_id}")
    room_cache.delete(f"transcript_{room_id}")
    
    # Broadcast Socket.IO notification for real-time updates
    try:
        await broadcast_to_room(room["id"], "new_turn", {
            "turn": turn,
            "speaker_id": participant["id"],
            "speaker_name": current_user.get("username", "Anonymous"),
            "timestamp": turn.get("timestamp")
        })
    except Exception as ws_error:
        print(f"⚠️  Socket.IO broadcast failed: {ws_error}")

    if not await respond_in_training(room, turn_data.round_number):
        DB.delete(Collections.TURNS, str(turn["id"]))
        room_cache.delete(f"transcript_{room_id}")
        await broadcast_to_room(room["id"], "turn_removed", {"turn_id": turn["id"]})
        raise HTTPException(status_code=503, detail="AI opponent could not respond; retry your turn")

    # Check if round is complete and trigger batch analysis
    await check_and_analyze_round(room, turn_data.round_number)

    return turn


@router.post("/{room_id}/submit-audio", response_model=TurnResponse)
async def submit_audio(
    room_id: str,
    audio: UploadFile = File(...),
    round_number: int = Form(1),
    turn_number: int = Form(1),
    content: str = Form(""),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Submit a debate turn with audio (and optional text)
    """
    room = DB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if room.get("is_training") and not GEMINI_AVAILABLE:
        raise HTTPException(status_code=503, detail="AI opponent is unavailable")

    if room["status"] == DebateStatus.UPCOMING.value:
        DB.update(Collections.ROOMS, room_id, {
                  "status": DebateStatus.ONGOING.value})
        room["status"] = DebateStatus.ONGOING.value
        
        # Invalidate caches when debate starts
        room_cache.delete(f"debate_status_{room_id}")
        room_cache.delete(f"room_code_{room.get('room_code', '').upper()}")

    if room["status"] != DebateStatus.ONGOING.value:
        raise HTTPException(
            status_code=400, detail="Debate has ended or was cancelled")
    
    # VALIDATION: Reject submissions with invalid round numbers
    total_rounds = room.get("rounds", 3)
    if round_number > total_rounds:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid round number. Debate has only {total_rounds} rounds."
        )

    participant = DB.find_one(
        Collections.PARTICIPANTS,
        {"user_id": current_user["id"], "room_id": room["id"]}
    )
    if not participant:
        raise HTTPException(
            status_code=403, detail="Not a participant in this debate")
    if participant.get("role") != "debater":
        raise HTTPException(status_code=403, detail="Only debaters may submit turns")

    # Use an opaque filename so repeated turns cannot overwrite recordings.
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    audio_path = AUDIO_DIR / f"{uuid4().hex}.webm"
    audio_content = await audio.read()
    if not audio_content or len(audio_content) > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Audio must be 1 byte to 50 MB")
    audio_path.write_bytes(audio_content)

    # Transcribe audio using Gemini AI (LONG OPERATION)
    transcription = await GeminiAI.transcribe_audio(str(audio_path))

    # Use transcription as content (or combine with provided text)
    final_content = content.strip() if content.strip() else transcription
    if not final_content:
        audio_path.unlink(missing_ok=True)
        raise HTTPException(status_code=503, detail="Audio transcription is unavailable")
    if content.strip() and transcription:
        final_content = f"{content.strip()}\n\n[Transcription]: {transcription}"

    # CRITICAL: Validate IMMEDIATELY BEFORE INSERT to close race window
    # Re-fetch turns to get latest state after long audio operations
    all_turns = DB.find(Collections.TURNS, {"room_id": room["id"]}, limit=None)
    participants_list = DB.find(Collections.PARTICIPANTS, {"room_id": room["id"]})
    debater_count = len([p for p in participants_list if p.get("role") == "debater"])
    round_turns = [t for t in all_turns if t.get("round_number") == round_number]
    
    # Check round capacity
    if len(round_turns) >= debater_count:
        raise HTTPException(
            status_code=400,
            detail=f"Round {round_number} already has {debater_count} turns. Wait for next round."
        )
    
    # Check consecutive turn enforcement
    if all_turns:
        last_turn = max(all_turns, key=lambda x: x.get("timestamp", ""))
        
        if last_turn["speaker_id"] == participant["id"]:
            raise HTTPException(
                status_code=400,
                detail="You cannot submit consecutive turns. Please wait for another participant to respond."
            )
        
        if room.get("format") == "team" and participant.get("team"):
            last_speaker = DB.get(Collections.PARTICIPANTS, last_turn["speaker_id"])
            if last_speaker and last_speaker.get("team") == participant.get("team"):
                raise HTTPException(
                    status_code=400,
                    detail="Your team cannot submit consecutive turns. Please wait for the other team to respond."
                )

    # CRITICAL: Acquire room lock to prevent concurrent submission races
    if room["id"] not in _room_locks:
        _room_locks[room["id"]] = asyncio.Lock()
    
    async with _room_locks[room["id"]]:
        if DB.get(Collections.ROOMS, room_id).get("status") != DebateStatus.ONGOING.value:
            raise HTTPException(status_code=409, detail="Debate has ended")
        # Re-validate ALL constraints immediately before insert (inside lock for atomicity)
        all_turns_final = DB.find(Collections.TURNS, {"room_id": room["id"]}, limit=None)
        round_turns_final = [t for t in all_turns_final if t.get("round_number") == round_number]
        
        # Check round capacity
        if len(round_turns_final) >= debater_count:
            raise HTTPException(
                status_code=400,
                detail=f"Round {round_number} already has {debater_count} turns. Wait for next round."
            )
        
        # Re-check consecutive turn enforcement (critical for fairness)
        if all_turns_final:
            last_turn_locked = max(all_turns_final, key=lambda x: x.get("timestamp", ""))
            
            if last_turn_locked["speaker_id"] == participant["id"]:
                raise HTTPException(
                    status_code=400,
                    detail="You cannot submit consecutive turns. Please wait for another participant to respond."
                )
            
            if room.get("format") == "team" and participant.get("team"):
                last_speaker_locked = DB.get(Collections.PARTICIPANTS, last_turn_locked["speaker_id"])
                if last_speaker_locked and last_speaker_locked.get("team") == participant.get("team"):
                    raise HTTPException(
                        status_code=400,
                        detail="Your team cannot submit consecutive turns. Please wait for the other team to respond."
                    )
        
        # Create turn with audio and transcription
        new_turn = {
            "room_id": room["id"],
            "speaker_id": participant["id"],
            "content": final_content,
            "audio_path": str(audio_path),
            "audio_url": None,
            "round_number": round_number,
            "turn_number": len(round_turns_final) + 1,
            "ai_feedback": None,  # Will be analyzed in batch after round completion
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        turn = DB.insert(Collections.TURNS, new_turn)
        turn = DB.update(Collections.TURNS, str(turn["id"]), {
            "audio_url": f"/api/debate/{room['id']}/audio/{turn['id']}"
        })

    # Invalidate caches for this room (new data available)
    room_cache.delete(f"debate_status_{room_id}")
    room_cache.delete(f"transcript_{room_id}")

    await broadcast_to_room(room["id"], "new_turn", {"turn": turn})
    if not await respond_in_training(room, round_number):
        DB.delete(Collections.TURNS, str(turn["id"]))
        room_cache.delete(f"transcript_{room_id}")
        audio_path.unlink(missing_ok=True)
        await broadcast_to_room(room["id"], "turn_removed", {"turn_id": turn["id"]})
        raise HTTPException(status_code=503, detail="AI opponent could not respond; retry your turn")

    # Check if round is complete and trigger batch analysis
    await check_and_analyze_round(room, round_number)

    return turn


@router.get("/{room_id}/audio/{turn_id}")
async def get_turn_audio(room_id: str, turn_id: str,
                         current_user: Dict[str, Any] = Depends(get_current_user)):
    room = require_room_access(room_id, current_user["id"])
    turn = DB.get(Collections.TURNS, turn_id)
    if not turn or str(turn.get("room_id")) != str(room["id"]):
        raise HTTPException(status_code=404, detail="Audio turn not found")
    path = Path(turn.get("audio_path") or "")
    if not path.is_file() or not path.resolve().is_relative_to(AUDIO_DIR.resolve()):
        raise HTTPException(status_code=404, detail="Audio unavailable")
    return FileResponse(path, media_type="audio/webm")


@router.get("/{room_id}/transcript", response_model=List[TurnResponse])
async def get_transcript(room_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get full debate transcript with caching
    """
    room = require_room_access(room_id, current_user["id"])
    # Try cache first (15 second TTL for transcript)
    cache_key = f"transcript_{room_id}"
    cached_transcript = room_cache.get(cache_key)
    if cached_transcript:
        return cached_transcript

    # Fetch from database
    turns = DB.find(Collections.TURNS, {"room_id": room["id"]}, limit=None)
    sorted_turns = sorted(turns, key=lambda x: (
        x["round_number"], x["turn_number"]))

    # Cache for 60 seconds (aggressive caching to reduce DB load)
    room_cache.set(cache_key, sorted_turns, ttl_seconds=60)

    return sorted_turns


@router.post("/{room_id}/end")
async def end_debate(
    room_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    End a debate and trigger final AI judging
    """
    room = DB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if str(room["host_id"]) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Only the host can end the debate")

    if room["status"] != DebateStatus.ONGOING.value:
        raise HTTPException(status_code=400, detail="Debate is not ongoing")

    lock = _room_locks.setdefault(str(room["id"]), asyncio.Lock())
    async with lock:
        if DB.get(Collections.ROOMS, room_id).get("status") != DebateStatus.ONGOING.value:
            raise HTTPException(status_code=409, detail="Debate has ended")
        result = await generate_debate_results(room["id"])
        DB.update(Collections.ROOMS, room_id, {
                  "status": DebateStatus.COMPLETED.value})

    # Invalidate all caches for this room (status changed to completed)
    room_cache.delete(f"debate_status_{room_id}")
    room_cache.delete(f"transcript_{room_id}")
    room_cache.delete(f"room_code_{room.get('room_code', '').upper()}")

    _room_locks.pop(str(room["id"]), None)
    await broadcast_to_room(room["id"], "debate_ended", {"result": result})
    return {"message": "Debate ended", "result": result}


@router.get("/{room_id}/status")
async def get_debate_status(room_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get current debate status with caching and optimized payload
    """
    room = require_room_access(room_id, current_user["id"])
    # Try cache first (60 second TTL for debate status)
    cache_key = f"debate_status_{room_id}"
    cached_status = room_cache.get(cache_key)
    if cached_status:
        return cached_status

    # Fetch from database
    participants = DB.find(Collections.PARTICIPANTS, {"room_id": room["id"]})
    turns = DB.find(Collections.TURNS, {"room_id": room["id"]})

    # Batch fetch all unique users (single DB query per unique user, using cache)
    user_ids = list(set(p["user_id"] for p in participants))
    user_map = {}
    for user_id in user_ids:
        cache_key_user = f"user_{user_id}"
        user = user_cache.get(cache_key_user)
        if user is None:
            user = DB.get(Collections.USERS, user_id)
            if user:
                user_cache.set(cache_key_user, user)
        if user:
            user_map[user_id] = user

    # Enrich participants with minimal user info
    enriched_participants = []
    for participant in participants:
        user = user_map.get(participant['user_id'])
        # Only include essential fields to reduce payload size
        enriched_participants.append({
            "id": participant["id"],
            "user_id": participant["user_id"],
            "username": user.get("username", "Unknown") if user else participant.get("username", "Unknown"),
            "name": (user.get("full_name") or user.get("username", "Unknown")) if user else participant.get("username", "Unknown"),
            "team": participant.get("team"),
            "role": participant["role"],
            "is_ready": participant.get("is_ready", False),
            "score": participant.get("score", {})
        })

    # Minimize room data in response (only essential fields)
    status_response = {
        "room": {
            "id": room["id"],
            "topic": room.get("topic"),
            "status": room["status"],
            "rounds": room.get("rounds", 3),
            "mode": room.get("mode"),
            "type": room.get("type"),
            "room_code": room.get("room_code"),
            "host_id": room.get("host_id")
        },
        "participants": enriched_participants,
        "turn_count": len(turns),
        "status": room["status"]
    }

    # Cache for 60 seconds (aggressive caching to reduce DB load)
    room_cache.set(cache_key, status_response, ttl_seconds=60)

    return status_response
