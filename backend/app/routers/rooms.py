from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List, Optional
import secrets
from datetime import datetime
from app.schemas import RoomCreate, RoomUpdate, RoomResponse
from app.replit_auth import get_current_user
from app.database import get_db
from app.repositories import Repository, RoomRepository
from app.models import DebateStatus, Room, User
from app.cache import user_cache, room_cache

router = APIRouter(prefix="/api/rooms", tags=["Rooms"])


async def generate_room_code(db: AsyncSession) -> str:
    """Generate a unique 6-character room code"""
    while True:
        code = secrets.token_hex(3).upper()
        existing = await RoomRepository.code_exists(db, code)
        if not existing:
            return code


async def enrich_room_with_host(room: Room, db: AsyncSession) -> Dict[str, Any]:
    """Add host_name to room data by looking up the host user (cached)"""
    room_dict = {
        "id": room.id,
        "topic": room.topic,
        "description": room.description,
        "scheduled_time": room.scheduled_time.isoformat() if room.scheduled_time else None,
        "duration_minutes": room.duration_minutes,
        "mode": room.mode,
        "type": room.type,
        "visibility": room.visibility,
        "rounds": room.rounds,
        "status": room.status,
        "host_id": room.host_id,
        "resources": room.resources,
        "room_code": room.room_code,
        "created_at": room.created_at.isoformat() if room.created_at else None,
        "updated_at": room.updated_at.isoformat() if room.updated_at else None
    }
    
    if room and room.host_id:
        cache_key = f"user_{room.host_id}"
        host = user_cache.get(cache_key)

        if host is None:
            host_obj = await Repository.get_by_id(db, User, room.host_id)
            if host_obj:
                host = {
                    "id": host_obj.id,
                    "username": host_obj.username,
                    "email": host_obj.email
                }
                user_cache.set(cache_key, host)

        room_dict["host_name"] = host.get("username", "Anonymous") if host else "Anonymous"
    
    return room_dict


@router.post("/create", response_model=RoomResponse)
async def create_room(
    room_data: RoomCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new debate room
    """
    room_code = await generate_room_code(db)

    new_room = {
        "topic": room_data.topic,
        "description": room_data.description,
        "scheduled_time": room_data.scheduled_time,
        "duration_minutes": room_data.duration_minutes,
        "mode": room_data.mode.value,
        "type": room_data.type.value,
        "visibility": room_data.visibility.value,
        "rounds": room_data.rounds,
        "status": DebateStatus.UPCOMING.value,
        "host_id": int(current_user["id"]),
        "resources": room_data.resources or [],
        "room_code": room_code
    }

    room = await Repository.create(db, Room, new_room)
    return await enrich_room_with_host(room, db)


@router.get("/list", response_model=List[RoomResponse])
async def list_rooms(
    status: Optional[str] = None,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """
    List all public debate rooms, optionally filtered by status
    """
    rooms = await RoomRepository.get_public_rooms(db, status=status, limit=limit)
    return [await enrich_room_with_host(room, db) for room in rooms]


@router.get("/code/{room_code}", response_model=RoomResponse)
async def get_room_by_code(
    room_code: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a room by its room code with caching for performance
    """
    code_upper = room_code.upper()
    cache_key = f"room_code_{code_upper}"

    # Check cache first
    cached_room = room_cache.get(cache_key)
    if cached_room:
        return cached_room

    # Fetch from database
    room = await RoomRepository.get_by_code(db, code_upper)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    enriched_room = await enrich_room_with_host(room, db)

    # Cache for 90 seconds (aggressive caching to reduce DB load)
    room_cache.set(cache_key, enriched_room, ttl_seconds=90)

    return enriched_room


@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(
    room_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get details of a specific room
    """
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return await enrich_room_with_host(room, db)


@router.put("/{room_id}/update", response_model=RoomResponse)
async def update_room(
    room_id: str,
    room_update: RoomUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update room details (host only)
    """
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if str(room.host_id) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Only the host can update the room")

    update_data = {}
    for key, value in room_update.model_dump(exclude_unset=True).items():
        if value is not None:
            if isinstance(value, datetime):
                update_data[key] = value
            elif hasattr(value, 'value'):
                update_data[key] = value.value
            else:
                update_data[key] = value

    updated_room = await Repository.update_record(db, Room, int(room_id), update_data)
    
    # Invalidate caches when room is updated
    room_cache.delete(f"debate_status_{room_id}")
    room_cache.delete(f"room_code_{room.room_code.upper()}")
    
    return await enrich_room_with_host(updated_room, db)


@router.delete("/{room_id}")
async def delete_room(
    room_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a room (host only)
    """
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if str(room.host_id) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Only the host can delete the room")

    room_code_upper = room.room_code.upper()
    
    await Repository.delete_record(db, Room, int(room_id))
    
    # Invalidate all caches when room is deleted
    room_cache.delete(f"debate_status_{room_id}")
    room_cache.delete(f"transcript_{room_id}")
    room_cache.delete(f"room_code_{room_code_upper}")
    
    return {"message": "Room deleted successfully"}
