from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.schemas import AIAnalyzeTurn, AIFactCheck, AIFinalScore
from app.replit_db import DB, Collections
from app.gemini_ai import GeminiAI
from app.replit_auth import get_current_user
from app.room_access import require_room_access
from app.scoring import valid_feedback

router = APIRouter(prefix="/api/ai", tags=["AI Judging"])


@router.post("/analyze-turn")
async def analyze_turn(data: AIAnalyzeTurn, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Analyze a specific debate turn using AI
    """
    turn = DB.get(Collections.TURNS, str(data.turn_id))
    if not turn:
        raise HTTPException(status_code=404, detail="Turn not found")

    room = require_room_access(str(data.room_id), current_user["id"])
    if str(turn.get("room_id")) != str(room["id"]):
        raise HTTPException(status_code=400, detail="Turn is in another room")

    previous_turns = DB.find(
        Collections.TURNS,
        {"room_id": data.room_id},
        limit=None
    )

    analysis = await GeminiAI.analyze_debate_turn(
        turn_content=turn["content"],
        context=room.get("topic"),
        previous_turns=[t["content"] for t in previous_turns if str(t["id"]) != str(turn["id"])]
    )
    if not valid_feedback(analysis):
        raise HTTPException(status_code=503, detail="AI judging is unavailable")
    DB.update(Collections.TURNS, str(data.turn_id), {"ai_feedback": analysis})

    return {"analysis": analysis, "turn_id": data.turn_id}


@router.post("/fact-check")
async def fact_check(data: AIFactCheck, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Fact-check a statement using web search
    """
    result = await GeminiAI.fact_check(
        statement=data.statement,
        context=data.context
    )

    return {
        "statement": data.statement,
        "fact_check_result": result
    }


@router.post("/final-score")
async def calculate_final_score(data: AIFinalScore, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Calculate final scores for all participants
    """
    room = require_room_access(str(data.room_id), current_user["id"])
    result = DB.find_one(Collections.RESULTS, {"room_id": room["id"]})
    if not result:
        raise HTTPException(status_code=404, detail="Debate results are unavailable")
    return {"room_id": room["id"], "scores": result.get("scores", {}),
            "judged": result.get("judged", False)}


@router.get("/summary/{room_id}")
async def get_ai_summary(room_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get AI-generated summary of debate
    """
    room = require_room_access(room_id, current_user["id"])
    result = DB.find_one(Collections.RESULTS, {"room_id": room["id"]})
    if not result:
        raise HTTPException(
            status_code=404, detail="No results found for this debate")

    return {
        "room_id": room_id,
        "summary": result.get("summary"),
        "winner_id": result.get("winner_id"),
        "judged": result.get("judged", False),
        "scores": result.get("scores"),  # Use 'scores' directly
        "feedback": result.get("feedback")  # Use 'feedback' directly
    }


@router.get("/report/{room_id}")
async def get_detailed_report(room_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get detailed AI report for debate
    """
    room = require_room_access(room_id, current_user["id"])

    result = DB.find_one(Collections.RESULTS, {"room_id": room_id})
    participants = DB.find(Collections.PARTICIPANTS, {"room_id": room_id})
    turns = DB.find(Collections.TURNS, {"room_id": room_id})

    participant_details = []
    for participant in participants:
        if participant["role"] == "debater":
            user = DB.get(Collections.USERS, str(participant["user_id"]))
            participant_turns = [
                t for t in turns if str(t["speaker_id"]) == str(participant["id"])]

            participant_details.append({
                "participant_id": participant["id"],
                "username": user.get("username") if user else participant.get("username", "Unknown"),
                "team": participant.get("team"),
                "scores": participant.get("score"),
                "turn_count": len(participant_turns),
                "feedback": result.get("feedback", {}).get(str(participant["id"]), {}) if result else {}
            })

    return {
        "room": room,
        "result": result,
        "participants": participant_details,
        "total_turns": len(turns)
    }
