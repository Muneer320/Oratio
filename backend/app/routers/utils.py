from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from app.schemas import HealthResponse, LeaderboardEntry, FeedbackSubmit
from app.supabase_db import DatabaseWrapper as DB, Collections
from app.config import settings

router = APIRouter(prefix="/api/utils", tags=["Utilities"])


@router.get("/config")
async def get_config():
    """
    Get public configuration
    """
    return {
        "max_file_size_mb": settings.MAX_FILE_SIZE_MB,
        "allowed_file_extensions": settings.ALLOWED_FILE_EXTENSIONS,
        "replit_features": {
            "database": True,
            "ai": True,
            "auth": True
        },
        "websocket_url": f"ws://{settings.WS_HOST}:{settings.WS_PORT}",
        "environment": settings.API_ENV
    }


@router.post("/feedback")
async def submit_feedback(feedback: FeedbackSubmit):
    """
    Submit user feedback
    """
    if len(feedback.message) > 5000:
        raise HTTPException(
            status_code=400, detail="Feedback message too long (max 5000 characters)")

    feedback_record = {
        "message": feedback.message,
        "category": feedback.category or "general",
        "timestamp": datetime.utcnow().isoformat()
    }

    saved_feedback = DB.insert(Collections.FEEDBACK, feedback_record)

    return {
        "message": "Feedback received and saved",
        "status": "success",
        "feedback_id": saved_feedback.get("id")
    }


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(limit: int = 10):
    """
    Get global leaderboard
    """
    users = DB.find(Collections.USERS, limit=1000)

    leaderboard = []
    for user in users:
        participations = DB.find(
            Collections.PARTICIPANTS,
            {"user_id": user["id"], "role": "debater"}
        )

        results = DB.find(Collections.RESULTS, limit=1000)

        wins = 0
        total_score = 0
        count = 0

        for result in results:
            if result.get("winner_id") and str(result["winner_id"]) in [str(p["id"]) for p in participations]:
                wins += 1

            for participant in participations:
                score = participant.get("score", {})
                if score:
                    weighted = (
                        score.get("logic", 0) * 0.4 +
                        score.get("credibility", 0) * 0.35 +
                        score.get("rhetoric", 0) * 0.25
                    )
                    total_score += weighted
                    count += 1

        avg_score = (total_score / count) if count > 0 else 0

        leaderboard.append({
            "user_id": user["id"],
            "username": user.get("username", "Unknown"),
            "xp": user.get("xp", 0),
            "badges": user.get("badges", []),
            "debates_won": wins,
            "avg_score": round(avg_score, 2)
        })

    leaderboard.sort(key=lambda x: x["xp"], reverse=True)

    return leaderboard[:limit]


@router.get("/search-topics")
async def search_topics(query: str = "", limit: int = 10):
    """
    Search debate topics
    """
    rooms = DB.find(Collections.ROOMS, limit=1000)

    if query:
        filtered_rooms = [
            r for r in rooms
            if query.lower() in r.get("topic", "").lower() or
            query.lower() in r.get("description", "").lower()
        ]
    else:
        filtered_rooms = rooms

    topics = []
    for room in filtered_rooms[:limit]:
        topics.append({
            "room_id": room["id"],
            "topic": room.get("topic"),
            "description": room.get("description"),
            "status": room.get("status"),
            "scheduled_time": room.get("scheduled_time")
        })

    return {"topics": topics, "total": len(filtered_rooms)}
