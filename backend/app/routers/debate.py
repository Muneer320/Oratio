from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import Dict, Any, List
from app.schemas import TurnSubmit, TurnResponse
from app.replit_auth import get_current_user
from app.replit_db import ReplitDB, Collections
from app.gemini_ai import GeminiAI
from app.models import DebateStatus
from app.cache import user_cache, room_cache

router = APIRouter(prefix="/api/debate", tags=["Debate"])


async def check_and_analyze_round(room: Dict[str, Any], round_number: int):
    """
    Check if round is complete and trigger batch AI analysis
    A round is complete when all debaters have submitted their turns
    """
    # Get all participants who are debaters
    participants = ReplitDB.find(Collections.PARTICIPANTS, {"room_id": room["id"]})
    debater_count = len([p for p in participants if p.get("role") == "debater"])
    
    if debater_count == 0:
        debater_count = 2  # Default to 2 if no debaters found
    
    # Get all turns for this round
    all_turns = ReplitDB.find(Collections.TURNS, {"room_id": room["id"]})
    round_turns = [t for t in all_turns if t["round_number"] == round_number]
    
    # Check if round is complete
    if len(round_turns) >= debater_count:
        print(f"🎯 Round {round_number} complete! Analyzing {len(round_turns)} turns...")
        
        # Analyze each turn in the round
        for turn in round_turns:
            if turn.get("ai_feedback") is None:  # Only analyze if not already analyzed
                try:
                    ai_feedback = await GeminiAI.analyze_debate_turn(
                        turn_content=turn["content"],
                        context=room.get("topic")
                    )
                    
                    # Update turn with AI feedback
                    ReplitDB.update(
                        Collections.TURNS,
                        turn["id"],
                        {"ai_feedback": ai_feedback}
                    )
                    print(f"✅ Analyzed turn {turn['id']}")
                except Exception as e:
                    print(f"⚠️  Failed to analyze turn {turn['id']}: {e}")
        
        print(f"✅ Round {round_number} analysis complete!")
        
        # Check if ALL rounds are now complete and auto-end the debate
        total_rounds = room.get("rounds", 3)
        expected_total_turns = total_rounds * debater_count
        
        if len(all_turns) >= expected_total_turns and room.get("status") == "ongoing":
            print(f"🏁 All {total_rounds} rounds complete ({len(all_turns)}/{expected_total_turns} turns)! Auto-ending debate...")
            ReplitDB.update(Collections.ROOMS, room["id"], {"status": "completed"})
            print("✅ Debate automatically ended")


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
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room["status"] == DebateStatus.UPCOMING.value:
        ReplitDB.update(Collections.ROOMS, room_id, {"status": DebateStatus.ONGOING.value})
        room["status"] = DebateStatus.ONGOING.value
    
    if room["status"] != DebateStatus.ONGOING.value:
        raise HTTPException(status_code=400, detail="Debate has ended or was cancelled")
    
    participant = ReplitDB.find_one(
        Collections.PARTICIPANTS,
        {"user_id": current_user["id"], "room_id": room["id"]}
    )
    if not participant:
        raise HTTPException(status_code=403, detail="Not a participant in this debate")
    
    # TURN-BASED ENFORCEMENT: Check if this user/team can submit now
    all_turns = ReplitDB.find(Collections.TURNS, {"room_id": room["id"]})
    if all_turns:
        # Sort by timestamp to get the most recent turn
        sorted_turns = sorted(all_turns, key=lambda x: x.get("timestamp", ""), reverse=True)
        last_turn = sorted_turns[0]
        
        # Check if the same participant submitted the last turn
        if last_turn["speaker_id"] == participant["id"]:
            raise HTTPException(
                status_code=400, 
                detail="You cannot submit consecutive turns. Please wait for another participant to respond."
            )
        
        # For team debates, check if same team submitted the last turn
        if room.get("format") == "team" and participant.get("team"):
            last_speaker = ReplitDB.get(Collections.PARTICIPANTS, last_turn["speaker_id"])
            if last_speaker and last_speaker.get("team") == participant.get("team"):
                raise HTTPException(
                    status_code=400, 
                    detail="Your team cannot submit consecutive turns. Please wait for the other team to respond."
                )
    
    from datetime import datetime
    
    new_turn = {
        "room_id": room["id"],
        "speaker_id": participant["id"],
        "content": turn_data.content,
        "audio_url": None,
        "round_number": turn_data.round_number,
        "turn_number": turn_data.turn_number,
        "ai_feedback": None,  # Will be analyzed in batch after round completion
        "timestamp": datetime.utcnow().isoformat()
    }
    
    turn = ReplitDB.insert(Collections.TURNS, new_turn)
    
    # Invalidate caches for this room (new data available)
    room_cache.delete(f"debate_status_{room_id}")
    room_cache.delete(f"transcript_{room_id}")
    
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
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room["status"] == DebateStatus.UPCOMING.value:
        ReplitDB.update(Collections.ROOMS, room_id, {"status": DebateStatus.ONGOING.value})
        room["status"] = DebateStatus.ONGOING.value
    
    if room["status"] != DebateStatus.ONGOING.value:
        raise HTTPException(status_code=400, detail="Debate has ended or was cancelled")
    
    participant = ReplitDB.find_one(
        Collections.PARTICIPANTS,
        {"user_id": current_user["id"], "room_id": room["id"]}
    )
    if not participant:
        raise HTTPException(status_code=403, detail="Not a participant in this debate")
    
    # TURN-BASED ENFORCEMENT: Check if this user/team can submit now
    all_turns = ReplitDB.find(Collections.TURNS, {"room_id": room["id"]})
    if all_turns:
        # Sort by timestamp to get the most recent turn
        sorted_turns = sorted(all_turns, key=lambda x: x.get("timestamp", ""), reverse=True)
        last_turn = sorted_turns[0]
        
        # Check if the same participant submitted the last turn
        if last_turn["speaker_id"] == participant["id"]:
            raise HTTPException(
                status_code=400, 
                detail="You cannot submit consecutive turns. Please wait for another participant to respond."
            )
        
        # For team debates, check if same team submitted the last turn
        if room.get("format") == "team" and participant.get("team"):
            last_speaker = ReplitDB.get(Collections.PARTICIPANTS, last_turn["speaker_id"])
            if last_speaker and last_speaker.get("team") == participant.get("team"):
                raise HTTPException(
                    status_code=400, 
                    detail="Your team cannot submit consecutive turns. Please wait for the other team to respond."
                )
    
    # Save audio file
    import os
    os.makedirs("uploads/audio", exist_ok=True)
    audio_path = f"uploads/audio/{room_id}_{participant['id']}_{turn_number}.webm"
    
    # Read and save audio file
    audio_content = await audio.read()
    with open(audio_path, "wb") as f:
        f.write(audio_content)
    
    # Transcribe audio using Gemini AI
    transcription = await GeminiAI.transcribe_audio(audio_path)
    
    # Use transcription as content (or combine with provided text)
    final_content = content.strip() if content.strip() else transcription
    if content.strip() and transcription and transcription not in ["[Audio transcription unavailable]", "[Audio transcription failed - please try again]"]:
        final_content = f"{content.strip()}\n\n[Transcription]: {transcription}"
    
    from datetime import datetime
    
    # Create turn with audio and transcription
    new_turn = {
        "room_id": room["id"],
        "speaker_id": participant["id"],
        "content": final_content,
        "audio_url": audio_path,
        "round_number": round_number,
        "turn_number": turn_number,
        "ai_feedback": None,  # Will be analyzed in batch after round completion
        "timestamp": datetime.utcnow().isoformat()
    }
    
    turn = ReplitDB.insert(Collections.TURNS, new_turn)
    
    # Invalidate caches for this room (new data available)
    room_cache.delete(f"debate_status_{room_id}")
    room_cache.delete(f"transcript_{room_id}")
    
    # Check if round is complete and trigger batch analysis
    await check_and_analyze_round(room, round_number)
    
    return turn


@router.get("/{room_id}/transcript", response_model=List[TurnResponse])
async def get_transcript(room_id: str):
    """
    Get full debate transcript with caching
    """
    # Try cache first (15 second TTL for transcript)
    cache_key = f"transcript_{room_id}"
    cached_transcript = room_cache.get(cache_key)
    if cached_transcript:
        return cached_transcript
    
    # Fetch from database
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    turns = ReplitDB.find(Collections.TURNS, {"room_id": room["id"]}, limit=1000)
    sorted_turns = sorted(turns, key=lambda x: (x["round_number"], x["turn_number"]))
    
    # Cache for 15 seconds
    room_cache.set(cache_key, sorted_turns, ttl_seconds=15)
    
    return sorted_turns


@router.post("/{room_id}/end")
async def end_debate(
    room_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    End a debate and trigger final AI judging
    """
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if str(room["host_id"]) != str(current_user["id"]):
        raise HTTPException(status_code=403, detail="Only the host can end the debate")
    
    if room["status"] != DebateStatus.ONGOING.value:
        raise HTTPException(status_code=400, detail="Debate is not ongoing")
    
    ReplitDB.update(Collections.ROOMS, room_id, {"status": DebateStatus.COMPLETED.value})
    
    participants = ReplitDB.find(Collections.PARTICIPANTS, {"room_id": room["id"]})
    turns = ReplitDB.find(Collections.TURNS, {"room_id": room["id"]})
    
    participant_scores = {}
    for participant in participants:
        if participant["role"] == "debater":
            participant_scores[participant["id"]] = participant.get("score", {})
    
    final_verdict = await GeminiAI.generate_final_verdict(
        room_data=room,
        all_turns=turns,
        participant_scores=participant_scores
    )
    
    spectator_votes = ReplitDB.find(Collections.SPECTATOR_VOTES, {"room_id": room["id"]})
    spectator_influence = {}
    for vote in spectator_votes:
        target_id = str(vote["target_id"])
        if target_id not in spectator_influence:
            spectator_influence[target_id] = 0
        spectator_influence[target_id] += 1
    
    result = {
        "room_id": room["id"],
        "winner_id": final_verdict.get("winner_id"),
        "scores_json": participant_scores,
        "feedback_json": final_verdict.get("feedback", {}),
        "summary": final_verdict.get("summary", "Debate concluded."),
        "report_url": None,
        "spectator_influence": spectator_influence
    }
    
    ReplitDB.insert(Collections.RESULTS, result)
    
    return {"message": "Debate ended", "result": result}


@router.get("/{room_id}/status")
async def get_debate_status(room_id: str):
    """
    Get current debate status with caching for performance
    """
    # Try cache first (15 second TTL for debate status)
    cache_key = f"debate_status_{room_id}"
    cached_status = room_cache.get(cache_key)
    if cached_status:
        return cached_status
    
    # Fetch from database
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    participants = ReplitDB.find(Collections.PARTICIPANTS, {"room_id": room["id"]})
    turns = ReplitDB.find(Collections.TURNS, {"room_id": room["id"]})
    
    # Enrich participants with user information (username) - cached
    enriched_participants = []
    for participant in participants:
        cache_key_user = f"user_{participant['user_id']}"
        user = user_cache.get(cache_key_user)
        
        if user is None:
            user = ReplitDB.get(Collections.USERS, participant["user_id"])
            if user:
                user_cache.set(cache_key_user, user)
        
        if user:
            participant["username"] = user.get("username", "Unknown")
            participant["name"] = user.get("full_name") or user.get("username", "Unknown")
        enriched_participants.append(participant)
    
    status_response = {
        "room": room,
        "participants": enriched_participants,
        "turn_count": len(turns),
        "status": room["status"]
    }
    
    # Cache for 15 seconds (balance between freshness and performance)
    room_cache.set(cache_key, status_response, ttl_seconds=15)
    
    return status_response
