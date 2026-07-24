from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.schemas import ParticipantJoin, ParticipantResponse
from app.replit_auth import get_current_user
from app.replit_db import DB, Collections
from app.cache import room_cache

router = APIRouter(prefix="/api/participants", tags=["Participants"])


@router.post("/join", response_model=ParticipantResponse)
async def join_room(
    join_data: ParticipantJoin,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Join a debate room as a participant
    """
    room = DB.find_one(Collections.ROOMS, {"room_code": join_data.room_code})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    existing = DB.find_one(
        Collections.PARTICIPANTS,
        {"user_id": current_user["id"], "room_id": room["id"]}
    )
    if existing:
        return existing

    if room.get("status") in ("completed", "cancelled"):
        raise HTTPException(status_code=409, detail="This debate is closed")
    debaters = [participant for participant in DB.find(
        Collections.PARTICIPANTS, {"room_id": room["id"]}, limit=None
    ) if participant.get("role") == "debater"]
    capacity = 4 if room.get("type") == "team" else 2
    if len(debaters) >= capacity:
        raise HTTPException(status_code=409, detail="This debate is full")
    if room.get("type") == "team":
        if join_data.team not in ("for", "against"):
            raise HTTPException(status_code=400, detail="Choose the for or against team")
        if sum(p.get("team") == join_data.team for p in debaters) >= 2:
            raise HTTPException(status_code=409, detail="That team is full")
    elif join_data.team:
        raise HTTPException(status_code=400, detail="Individual debates have no teams")

    new_participant = {
        "user_id": current_user["id"],
        "room_id": room["id"],
        "team": join_data.team,
        "role": "debater",
        "is_ready": False,
        "score": {"logic": 0, "credibility": 0, "rhetoric": 0},
        "xp_earned": 0
    }

    participant = DB.insert(Collections.PARTICIPANTS, new_participant)

    # Invalidate debate status cache so join is immediately visible
    room_cache.delete(f"debate_status_{room['id']}")

    return participant


@router.get("/{participant_id}", response_model=ParticipantResponse)
async def get_participant(participant_id: str):
    """
    Get participant details
    """
    participant = DB.get(Collections.PARTICIPANTS, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return participant


@router.put("/{participant_id}/ready", response_model=ParticipantResponse)
async def mark_ready(
    participant_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Mark participant as ready
    """
    participant = DB.get(Collections.PARTICIPANTS, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    if str(participant["user_id"]) != str(current_user["id"]):
        raise HTTPException(status_code=403, detail="Not authorized")

    updated = DB.update(Collections.PARTICIPANTS,
                        participant_id, {"is_ready": True})

    # Invalidate debate status cache so ready status is immediately visible
    room_cache.delete(f"debate_status_{participant['room_id']}")

    return updated


@router.delete("/{participant_id}/leave")
async def leave_room(
    participant_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Leave a debate room
    """
    participant = DB.get(Collections.PARTICIPANTS, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    if str(participant["user_id"]) != str(current_user["id"]):
        raise HTTPException(status_code=403, detail="Not authorized")

    room_id = participant["room_id"]
    DB.delete(Collections.PARTICIPANTS, participant_id)

    # Invalidate debate status cache so leave is immediately visible
    room_cache.delete(f"debate_status_{room_id}")

    return {"message": "Left room successfully"}
