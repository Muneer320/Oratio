from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import Dict, Any, List
from app.schemas import TurnSubmit, TurnResponse
from app.replit_auth import get_current_user
from app.replit_db import ReplitDB, Collections
from app.replit_ai import ReplitAI
from app.models import DebateStatus

router = APIRouter(prefix="/api/debate", tags=["Debate"])


@router.post("/{room_id}/submit-turn", response_model=TurnResponse)
async def submit_turn(
    room_id: str,
    turn_data: TurnSubmit,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Submit a debate turn (text argument)
    """
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room["status"] != DebateStatus.ONGOING.value:
        raise HTTPException(status_code=400, detail="Debate is not ongoing")
    
    participant = ReplitDB.find_one(
        Collections.PARTICIPANTS,
        {"user_id": current_user["id"], "room_id": room["id"]}
    )
    if not participant:
        raise HTTPException(status_code=403, detail="Not a participant in this debate")
    
    ai_feedback = await ReplitAI.analyze_debate_turn(
        turn_content=turn_data.content,
        context=room.get("topic")
    )
    
    new_turn = {
        "room_id": room["id"],
        "speaker_id": participant["id"],
        "content": turn_data.content,
        "audio_url": None,
        "round_number": turn_data.round_number,
        "turn_number": turn_data.turn_number,
        "ai_feedback": ai_feedback
    }
    
    turn = ReplitDB.insert(Collections.TURNS, new_turn)
    return turn


@router.post("/{room_id}/submit-audio")
async def submit_audio(
    room_id: str,
    audio: UploadFile = File(...),
    round_number: int = 1,
    turn_number: int = 1,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Submit a debate turn with audio
    """
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room["status"] != DebateStatus.ONGOING.value:
        raise HTTPException(status_code=400, detail="Debate is not ongoing")
    
    participant = ReplitDB.find_one(
        Collections.PARTICIPANTS,
        {"user_id": current_user["id"], "room_id": room["id"]}
    )
    if not participant:
        raise HTTPException(status_code=403, detail="Not a participant in this debate")
    
    audio_path = f"uploads/audio/{room_id}_{participant['id']}_{turn_number}.wav"
    
    return {
        "message": "Audio upload feature in development",
        "audio_path": audio_path,
        "status": "placeholder"
    }


@router.get("/{room_id}/transcript", response_model=List[TurnResponse])
async def get_transcript(room_id: str):
    """
    Get full debate transcript
    """
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    turns = ReplitDB.find(Collections.TURNS, {"room_id": room["id"]}, limit=1000)
    return sorted(turns, key=lambda x: (x["round_number"], x["turn_number"]))


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
    
    final_verdict = await ReplitAI.generate_final_verdict(
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
    Get current debate status
    """
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    participants = ReplitDB.find(Collections.PARTICIPANTS, {"room_id": room["id"]})
    turns = ReplitDB.find(Collections.TURNS, {"room_id": room["id"]})
    
    return {
        "room": room,
        "participants": participants,
        "turn_count": len(turns),
        "status": room["status"]
    }
