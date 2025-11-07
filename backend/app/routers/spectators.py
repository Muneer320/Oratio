from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.schemas import SpectatorJoin, SpectatorReward, SpectatorStats, ParticipantResponse
from app.replit_auth import get_current_user, get_current_user_optional
from app.replit_db import ReplitDB, Collections

router = APIRouter(prefix="/api/spectators", tags=["Spectators"])


@router.post("/join", response_model=ParticipantResponse)
async def join_as_spectator(
    join_data: SpectatorJoin,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Join a debate room as a spectator
    """
    
    room = ReplitDB.find_one(Collections.ROOMS, {"room_code": join_data.room_code})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    existing = ReplitDB.find_one(
        Collections.PARTICIPANTS,
        {"user_id": current_user["id"], "room_id": room["id"]}
    )
    if existing:
        return existing
    
    new_spectator = {
        "user_id": current_user["id"],
        "room_id": room["id"],
        "team": None,
        "role": "spectator",
        "is_ready": True,
        "score": {},
        "xp_earned": 0
    }
    
    spectator = ReplitDB.insert(Collections.PARTICIPANTS, new_spectator)
    return spectator


@router.post("/{room_id}/reward")
async def reward_participant(
    room_id: str,
    reward_data: SpectatorReward,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Spectator rewards a participant with a reaction
    """
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    participant = ReplitDB.get(Collections.PARTICIPANTS, str(reward_data.target_id))
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    vote = {
        "room_id": room["id"],
        "spectator_id": current_user["id"],
        "target_id": reward_data.target_id,
        "reaction_type": reward_data.reaction_type
    }
    
    vote_record = ReplitDB.insert(Collections.SPECTATOR_VOTES, vote)
    return {"message": "Reaction recorded", "vote": vote_record}


@router.get("/{room_id}/stats", response_model=SpectatorStats)
async def get_spectator_stats(room_id: str):
    """
    Get spectator statistics for a room
    """
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    spectators = ReplitDB.find(
        Collections.PARTICIPANTS,
        {"room_id": room["id"], "role": "spectator"}
    )
    
    votes = ReplitDB.find(Collections.SPECTATOR_VOTES, {"room_id": room["id"]})
    
    reactions = {}
    for vote in votes:
        target_id = vote["target_id"]
        if target_id not in reactions:
            reactions[target_id] = []
        reactions[target_id].append(vote["reaction_type"])
    
    total_votes = len(votes)
    support_percentages = {}
    for target_id, vote_list in reactions.items():
        support_percentages[target_id] = (len(vote_list) / total_votes * 100) if total_votes > 0 else 0
    
    return {
        "room_id": room["id"],
        "total_spectators": len(spectators),
        "reactions": reactions,
        "support_percentages": support_percentages
    }


@router.delete("/{spectator_id}/leave")
async def leave_as_spectator(
    spectator_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Leave room as spectator
    """
    spectator = ReplitDB.get(Collections.PARTICIPANTS, spectator_id)
    if not spectator:
        raise HTTPException(status_code=404, detail="Spectator not found")
    
    if str(spectator["user_id"]) != str(current_user["id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    ReplitDB.delete(Collections.PARTICIPANTS, spectator_id)
    return {"message": "Left room as spectator successfully"}
