from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from app.schemas import SpectatorJoin, SpectatorReward, SpectatorStats, ParticipantResponse
from app.replit_auth import get_current_user, get_current_user_optional
from app.database import get_db
from app.repositories import Repository, RoomRepository, ParticipantRepository, SpectatorVoteRepository
from app.models import Room, Participant, SpectatorVote
from app.cache import room_cache

router = APIRouter(prefix="/api/spectators", tags=["Spectators"])


@router.post("/join", response_model=ParticipantResponse)
async def join_as_spectator(
    join_data: SpectatorJoin,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Join a debate room as a spectator
    """

    room = await RoomRepository.get_by_code(db, join_data.room_code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    existing = await ParticipantRepository.get_by_user_and_room(
        db, int(current_user["id"]), room.id
    )
    if existing:
        return existing

    new_spectator = {
        "user_id": int(current_user["id"]),
        "room_id": room.id,
        "team": None,
        "role": "spectator",
        "is_ready": True,
        "score": {},
        "xp_earned": 0
    }

    spectator = await Repository.create(db, Participant, new_spectator)

    # Invalidate debate status cache so spectator join is immediately visible
    room_cache.delete(f"debate_status_{room.id}")

    return spectator


@router.post("/{room_id}/reward")
async def reward_participant(
    room_id: str,
    reward_data: SpectatorReward,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Spectator rewards a participant with a reaction
    """
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    participant = await Repository.get_by_id(db, Participant, int(reward_data.target_id))
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    vote = {
        "room_id": room.id,
        "spectator_id": int(current_user["id"]),
        "target_id": int(reward_data.target_id),
        "reaction_type": reward_data.reaction_type
    }

    vote_record = await Repository.create(db, SpectatorVote, vote)
    return {"message": "Reaction recorded", "vote": vote_record}


@router.get("/{room_id}/stats", response_model=SpectatorStats)
async def get_spectator_stats(
    room_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get spectator statistics for a room
    """
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    spectators = await ParticipantRepository.get_room_participants(
        db, room.id, role="spectator"
    )

    votes = await SpectatorVoteRepository.get_room_votes(db, room.id)

    reactions = {}
    for vote in votes:
        target_id = vote.target_id
        if target_id not in reactions:
            reactions[target_id] = []
        reactions[target_id].append(vote.reaction_type)

    total_votes = len(votes)
    support_percentages = {}
    for target_id, vote_list in reactions.items():
        support_percentages[target_id] = (
            len(vote_list) / total_votes * 100) if total_votes > 0 else 0

    return {
        "room_id": room.id,
        "total_spectators": len(spectators),
        "reactions": reactions,
        "support_percentages": support_percentages
    }


@router.delete("/{spectator_id}/leave")
async def leave_as_spectator(
    spectator_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Leave room as spectator
    """
    spectator = await Repository.get_by_id(db, Participant, int(spectator_id))
    if not spectator:
        raise HTTPException(status_code=404, detail="Spectator not found")

    if str(spectator.user_id) != str(current_user["id"]):
        raise HTTPException(status_code=403, detail="Not authorized")

    room_id = spectator.room_id
    await Repository.delete_record(db, Participant, int(spectator_id))

    # Invalidate debate status cache so spectator leave is immediately visible
    room_cache.delete(f"debate_status_{room_id}")

    return {"message": "Left room as spectator successfully"}
