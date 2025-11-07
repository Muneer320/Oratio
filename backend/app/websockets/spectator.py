from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websockets import manager
import json

router = APIRouter()


@router.websocket("/ws/spectator/{room_id}")
async def spectator_websocket(websocket: WebSocket, room_id: str):
    """
    WebSocket endpoint for spectators to receive real-time updates
    """
    spectator_room = f"spectator_{room_id}"
    await manager.connect(websocket, spectator_room)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            event_type = message.get("type")
            
            if event_type == "reaction":
                await manager.broadcast({
                    "type": "new_reaction",
                    "target_id": message.get("target_id"),
                    "reaction": message.get("reaction"),
                    "spectator_id": message.get("spectator_id")
                }, spectator_room)
            
            elif event_type == "support_update":
                await manager.broadcast({
                    "type": "support_stats",
                    "stats": message.get("stats")
                }, spectator_room)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, spectator_room)
