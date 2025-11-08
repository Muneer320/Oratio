from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from app.schemas import AIAnalyzeTurn, AIFactCheck, AIFinalScore
from app.database import get_db
from app.repositories import Repository, TurnRepository, ResultRepository, ParticipantRepository
from app.models import Turn, Room, Participant, Result, User
from app.gemini_ai import GeminiAI

router = APIRouter(prefix="/api/ai", tags=["AI Judging"])


@router.post("/analyze-turn")
async def analyze_turn(
    data: AIAnalyzeTurn,
    db: AsyncSession = Depends(get_db)
):
    """
    Analyze a specific debate turn using AI
    """
    turn = await Repository.get_by_id(db, Turn, int(data.turn_id))
    if not turn:
        raise HTTPException(status_code=404, detail="Turn not found")

    room = await Repository.get_by_id(db, Room, int(data.room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    previous_turns = await Repository.find_all(
        db, Turn, {"room_id": int(data.room_id)}, limit=10
    )

    analysis = await GeminiAI.analyze_debate_turn(
        turn_content=turn.content,
        context=room.topic,
        previous_turns=[t.content for t in previous_turns]
    )

    await Repository.update_record(db, Turn, int(data.turn_id), {"ai_feedback": analysis})

    return {"analysis": analysis, "turn_id": data.turn_id}


@router.post("/fact-check")
async def fact_check(
    data: AIFactCheck,
    db: AsyncSession = Depends(get_db)
):
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
async def calculate_final_score(
    data: AIFinalScore,
    db: AsyncSession = Depends(get_db)
):
    """
    Calculate final scores for all participants
    """
    room = await Repository.get_by_id(db, Room, int(data.room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    participants = await ParticipantRepository.get_room_participants(db, int(data.room_id))
    turns = await TurnRepository.get_room_turns(db, int(data.room_id))

    participant_scores = {}
    for participant in participants:
        if participant.role == "debater":
            participant_turns = [
                t for t in turns if t.speaker_id == participant.id]

            total_logic = 0
            total_credibility = 0
            total_rhetoric = 0
            count = 0

            for turn in participant_turns:
                feedback = turn.ai_feedback if turn.ai_feedback else {}
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

                participant_scores[participant.id] = {
                    **avg_scores,
                    "weighted_total": weighted_score
                }

                await Repository.update_record(
                    db, Participant, participant.id,
                    {"score": avg_scores}
                )

    return {
        "room_id": data.room_id,
        "scores": participant_scores
    }


@router.get("/summary/{room_id}")
async def get_ai_summary(
    room_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get AI-generated summary of debate
    """
    result = await ResultRepository.get_by_room(db, int(room_id))
    if not result:
        raise HTTPException(
            status_code=404, detail="No results found for this debate")

    return {
        "room_id": room_id,
        "summary": result.summary,
        "winner_id": result.winner_id,
        "scores": result.scores_json,
        "feedback": result.feedback_json
    }


@router.get("/report/{room_id}")
async def get_detailed_report(
    room_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get detailed AI report for debate
    """
    room = await Repository.get_by_id(db, Room, int(room_id))
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    result = await ResultRepository.get_by_room(db, int(room_id))
    participants = await ParticipantRepository.get_room_participants(db, int(room_id))
    turns = await TurnRepository.get_room_turns(db, int(room_id))

    participant_details = []
    for participant in participants:
        if participant.role == "debater":
            user = await Repository.get_by_id(db, User, participant.user_id)
            participant_turns = [
                t for t in turns if t.speaker_id == participant.id]

            participant_details.append({
                "participant_id": participant.id,
                "username": user.username if user else "Unknown",
                "team": participant.team,
                "scores": participant.score,
                "turn_count": len(participant_turns),
                "feedback": result.feedback_json.get(str(participant.id), {}) if result and result.feedback_json else {}
            })

    return {
        "room": room,
        "result": result,
        "participants": participant_details,
        "total_turns": len(turns)
    }
