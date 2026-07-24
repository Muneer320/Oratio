import socketio
from app.replit_db import DB, Collections
from app.replit_auth import ReplitAuth
from app.room_access import can_view_room
from app.config import settings

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=settings.CORS_ORIGINS,
    logger=True,
    engineio_logger=False
)

@sio.event
async def connect(sid, environ, auth):
    """Handle client connection"""
    token = auth.get('token') if isinstance(auth, dict) else None
    user = ReplitAuth.get_user_from_token(token) if token else None
    if not user:
        return False
    await sio.save_session(sid, {'user_id': str(user['id'])})
    print(f"✅ Socket.IO client connected: {sid}")

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    print(f"❌ Socket.IO client disconnected: {sid}")

@sio.event
async def join_room(sid, data):
    """Join a debate room"""
    room_id = str(data.get('room_id')) if isinstance(data, dict) else ''
    session = await sio.get_session(sid)
    room = DB.get(Collections.ROOMS, room_id) if room_id else None
    if room and can_view_room(room, session['user_id']):
        await sio.enter_room(sid, f"room_{room_id}")
        print(f"👥 Client {sid} joined room {room_id}")
        await sio.emit('joined', {'room_id': room_id}, room=sid)
    else:
        await sio.emit('join_error', {'message': 'Join the room first'}, room=sid)

@sio.event
async def leave_room(sid, data):
    """Leave a debate room"""
    room_id = str(data.get('room_id')) if isinstance(data, dict) else ''
    if room_id:
        await sio.leave_room(sid, f"room_{room_id}")
        print(f"👋 Client {sid} left room {room_id}")

async def broadcast_to_room(room_id: str, event: str, data: dict):
    """Broadcast event to all clients in a room"""
    await sio.emit(event, data, room=f"room_{room_id}")
    print(f"📢 Broadcast '{event}' to room {room_id}")
