from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websockets import manager
import json

router = APIRouter()


@router.websocket("/ws/trainer/{user_id}")
async def trainer_websocket(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint for AI trainer real-time updates
    """
    trainer_room = f"trainer_{user_id}"
    await manager.connect(websocket, trainer_room)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            event_type = message.get("type")
            
            if event_type == "progress_update":
                await manager.broadcast({
                    "type": "progress_changed",
                    "xp": message.get("xp"),
                    "badges": message.get("badges")
                }, trainer_room)
            
            elif event_type == "new_recommendation":
                await manager.broadcast({
                    "type": "recommendation",
                    "recommendation": message.get("recommendation")
                }, trainer_room)
            
            elif event_type == "challenge_completed":
                await manager.broadcast({
                    "type": "challenge_result",
                    "result": message.get("result"),
                    "xp_earned": message.get("xp_earned")
                }, trainer_room)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, trainer_room)
