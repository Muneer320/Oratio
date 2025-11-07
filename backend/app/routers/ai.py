from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.schemas import AIAnalyzeTurn, AIFactCheck, AIFinalScore
from app.replit_db import ReplitDB, Collections
from app.replit_ai import ReplitAI

router = APIRouter(prefix="/api/ai", tags=["AI Judging"])


@router.post("/analyze-turn")
async def analyze_turn(data: AIAnalyzeTurn):
    """
    Analyze a specific debate turn using AI
    """
    turn = ReplitDB.get(Collections.TURNS, str(data.turn_id))
    if not turn:
        raise HTTPException(status_code=404, detail="Turn not found")
    
    room = ReplitDB.get(Collections.ROOMS, str(data.room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    previous_turns = ReplitDB.find(
        Collections.TURNS,
        {"room_id": data.room_id},
        limit=10
    )
    
    analysis = await ReplitAI.analyze_debate_turn(
        turn_content=turn["content"],
        context=room.get("topic"),
        previous_turns=[t["content"] for t in previous_turns]
    )
    
    ReplitDB.update(Collections.TURNS, str(data.turn_id), {"ai_feedback": analysis})
    
    return {"analysis": analysis, "turn_id": data.turn_id}


@router.post("/fact-check")
async def fact_check(data: AIFactCheck):
    """
    Fact-check a statement using web search
    """
    result = await ReplitAI.fact_check(
        statement=data.statement,
        context=data.context
    )
    
    return {
        "statement": data.statement,
        "fact_check_result": result
    }


@router.post("/final-score")
async def calculate_final_score(data: AIFinalScore):
    """
    Calculate final scores for all participants
    """
    room = ReplitDB.get(Collections.ROOMS, str(data.room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    participants = ReplitDB.find(Collections.PARTICIPANTS, {"room_id": data.room_id})
    turns = ReplitDB.find(Collections.TURNS, {"room_id": data.room_id})
    
    participant_scores = {}
    for participant in participants:
        if participant["role"] == "debater":
            participant_turns = [t for t in turns if t["speaker_id"] == participant["id"]]
            
            total_logic = 0
            total_credibility = 0
            total_rhetoric = 0
            count = 0
            
            for turn in participant_turns:
                feedback = turn.get("ai_feedback", {})
                total_logic += feedback.get("logic", 0)
                total_credibility += feedback.get("credibility", 0)
                total_rhetoric += feedback.get("rhetoric", 0)
                count += 1
            
            if count > 0:
                avg_scores = {
                    "logic": total_logic / count,
                    "credibility": total_credibility / count,
                    "rhetoric": total_rhetoric / count
                }
                
                weighted_score = (
                    avg_scores["logic"] * 0.4 +
                    avg_scores["credibility"] * 0.35 +
                    avg_scores["rhetoric"] * 0.25
                )
                
                participant_scores[participant["id"]] = {
                    **avg_scores,
                    "weighted_total": weighted_score
                }
                
                ReplitDB.update(
                    Collections.PARTICIPANTS,
                    str(participant["id"]),
                    {"score": avg_scores}
                )
    
    return {
        "room_id": data.room_id,
        "scores": participant_scores
    }


@router.get("/summary/{room_id}")
async def get_ai_summary(room_id: str):
    """
    Get AI-generated summary of debate
    """
    result = ReplitDB.find_one(Collections.RESULTS, {"room_id": room_id})
    if not result:
        raise HTTPException(status_code=404, detail="No results found for this debate")
    
    return {
        "room_id": room_id,
        "summary": result.get("summary"),
        "winner_id": result.get("winner_id"),
        "scores": result.get("scores_json"),
        "feedback": result.get("feedback_json")
    }


@router.get("/report/{room_id}")
async def get_detailed_report(room_id: str):
    """
    Get detailed AI report for debate
    """
    room = ReplitDB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    result = ReplitDB.find_one(Collections.RESULTS, {"room_id": room_id})
    participants = ReplitDB.find(Collections.PARTICIPANTS, {"room_id": room_id})
    turns = ReplitDB.find(Collections.TURNS, {"room_id": room_id})
    
    participant_details = []
    for participant in participants:
        if participant["role"] == "debater":
            user = ReplitDB.get(Collections.USERS, str(participant["user_id"]))
            participant_turns = [t for t in turns if t["speaker_id"] == participant["id"]]
            
            participant_details.append({
                "participant_id": participant["id"],
                "username": user.get("username") if user else "Unknown",
                "team": participant.get("team"),
                "scores": participant.get("score"),
                "turn_count": len(participant_turns),
                "feedback": result.get("feedback_json", {}).get(str(participant["id"]), {}) if result else {}
            })
    
    return {
        "room": room,
        "result": result,
        "participants": participant_details,
        "total_turns": len(turns)
    }
