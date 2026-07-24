"""Access checks shared by HTTP routes and Socket.IO."""

from fastapi import HTTPException

from app.replit_db import DB, Collections


def can_view_room(room, user_id):
    if str(room.get("host_id")) == str(user_id):
        return True
    return DB.find_one(Collections.PARTICIPANTS, {
        "room_id": room["id"], "user_id": str(user_id)
    }) is not None


def require_room_access(room_id, user_id):
    room = DB.get(Collections.ROOMS, str(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if not can_view_room(room, user_id):
        raise HTTPException(status_code=403, detail="Join the room to view its debate")
    return room
