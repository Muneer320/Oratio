from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websockets import manager
from app.replit_db import DB, Collections
import json

router = APIRouter()


@router.websocket("/ws/debate/{room_id}")
async def debate_websocket(websocket: WebSocket, room_id: str):
    """
    WebSocket endpoint for real-time debate updates
    """
    await manager.connect(websocket, room_id)

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            event_type = message.get("type")

            if event_type == "turn_submitted":
                await manager.broadcast({
                    "type": "new_turn",
                    "turn": message.get("turn"),
                    "speaker_id": message.get("speaker_id"),
                    "timestamp": message.get("timestamp")
                }, room_id)

            elif event_type == "participant_joined":
                await manager.broadcast({
                    "type": "participant_update",
                    "action": "joined",
                    "participant": message.get("participant")
                }, room_id)

            elif event_type == "participant_ready":
                await manager.broadcast({
                    "type": "participant_update",
                    "action": "ready",
                    "participant_id": message.get("participant_id")
                }, room_id)

            elif event_type == "debate_started":
                await manager.broadcast({
                    "type": "debate_status",
                    "status": "ongoing",
                    "room_id": room_id
                }, room_id)

            elif event_type == "debate_ended":
                await manager.broadcast({
                    "type": "debate_status",
                    "status": "completed",
                    "result": message.get("result")
                }, room_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        await manager.broadcast({
            "type": "participant_update",
            "action": "left",
            "timestamp": None
        }, room_id)
