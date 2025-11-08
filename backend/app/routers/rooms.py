from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List, Optional
import secrets
from datetime import datetime
from app.schemas import RoomCreate, RoomUpdate, RoomResponse
from app.replit_auth import get_current_user
from app.supabase_db import DatabaseWrapper as DB, Collections
from app.models import DebateStatus
from app.cache import user_cache, room_cache

router = APIRouter(prefix="/api/rooms", tags=["Rooms"])


def generate_room_code() -> str:
    """Generate a unique 6-character room code"""
    while True:
        code = secrets.token_hex(3).upper()
        existing = DB.find_one(Collections.ROOMS, {"room_code": code})
        if not existing:
            return code


def enrich_room_with_host(room: Dict[str, Any]) -> Dict[str, Any]:
    """Add host_name to room data by looking up the host user (cached)"""
    if room and "host_id" in room:
        cache_key = f"user_{room['host_id']}"
        host = user_cache.get(cache_key)

        if host is None:
            host = DB.get(Collections.USERS, room["host_id"])
            if host:
                user_cache.set(cache_key, host)

        room["host_name"] = host.get(
            "username", "Anonymous") if host else "Anonymous"
    return room


@router.post("/create", response_model=RoomResponse)
async def create_room(
    room_data: RoomCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Create a new debate room
    """
    room_code = generate_room_code()

    new_room = {
        "topic": room_data.topic,
        "description": room_data.description,
        "scheduled_time": room_data.scheduled_time.isoformat(),
        "duration_minutes": room_data.duration_minutes,
        "mode": room_data.mode.value,
        "type": room_data.type.value,
        "visibility": room_data.visibility.value,
        "rounds": room_data.rounds,
        "status": DebateStatus.UPCOMING.value,
        "host_id": current_user["id"],
        "resources": room_data.resources or [],
        "room_code": room_code
    }

    room = DB.insert(Collections.ROOMS, new_room)
    return enrich_room_with_host(room)


@router.get("/list", response_model=List[RoomResponse])
async def list_rooms(
    status: Optional[str] = None,
    limit: int = 100
):
    """
    List all public debate rooms, optionally filtered by status
    """
    filter_criteria = {"visibility": "public"}
    if status:
        filter_criteria["status"] = status

    rooms = DB.find(Collections.ROOMS, filter_criteria, limit=limit)
    return [enrich_room_with_host(room) for room in rooms]


@router.get("/code/{room_code}", response_model=RoomResponse)
async def get_room_by_code(room_code: str):
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
    room = DB.find_one(Collections.ROOMS, {"room_code": code_upper})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    enriched_room = enrich_room_with_host(room)

    # Cache for 30 seconds
    room_cache.set(cache_key, enriched_room, ttl_seconds=30)

    return enriched_room


@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(room_id: str):
    """
    Get details of a specific room
    """
    room = DB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return enrich_room_with_host(room)


@router.put("/{room_id}/update", response_model=RoomResponse)
async def update_room(
    room_id: str,
    room_update: RoomUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update room details (host only)
    """
    room = DB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if str(room["host_id"]) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Only the host can update the room")

    update_data = {}
    for key, value in room_update.model_dump(exclude_unset=True).items():
        if value is not None:
            if isinstance(value, datetime):
                update_data[key] = value.isoformat()
            elif hasattr(value, 'value'):
                update_data[key] = value.value
            else:
                update_data[key] = value

    updated_room = DB.update(Collections.ROOMS, room_id, update_data)
    return updated_room


@router.delete("/{room_id}")
async def delete_room(
    room_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Delete a room (host only)
    """
    room = DB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if str(room["host_id"]) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Only the host can delete the room")

    DB.delete(Collections.ROOMS, room_id)
    return {"message": "Room deleted successfully"}
