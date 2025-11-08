import socketio
from app.replit_db import DB, Collections

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=False
)

@sio.event
async def connect(sid, environ):
    """Handle client connection"""
    print(f"✅ Socket.IO client connected: {sid}")

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    print(f"❌ Socket.IO client disconnected: {sid}")

@sio.event
async def join_room(sid, data):
    """Join a debate room"""
    room_id = data.get('room_id')
    if room_id:
        await sio.enter_room(sid, f"room_{room_id}")
        print(f"👥 Client {sid} joined room {room_id}")
        await sio.emit('joined', {'room_id': room_id}, room=sid)

@sio.event
async def leave_room(sid, data):
    """Leave a debate room"""
    room_id = data.get('room_id')
    if room_id:
        await sio.leave_room(sid, f"room_{room_id}")
        print(f"👋 Client {sid} left room {room_id}")

async def broadcast_to_room(room_id: str, event: str, data: dict):
    """Broadcast event to all clients in a room"""
    await sio.emit(event, data, room=f"room_{room_id}")
    print(f"📢 Broadcast '{event}' to room {room_id}")
