from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List
from app.schemas import TrainerAnalyze, TrainerProgress, ChallengeStart, ChallengeSubmit, TrainerRecommendation
from app.replit_auth import get_current_user
from app.database import get_db
from app.repositories import Repository, ParticipantRepository, TrainerFeedbackRepository
from app.models import Participant, TrainerFeedback, User
from app.gemini_ai import GeminiAI
import secrets

router = APIRouter(prefix="/api/trainer", tags=["AI Trainer"])


@router.post("/analyze")
async def analyze_user_performance(
    data: TrainerAnalyze,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Analyze user's debate performance and generate feedback
    """
    if str(data.user_id) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Can only analyze your own performance")

    participations = await Repository.find_all(
        db, Participant, {"user_id": int(data.user_id)}
    )

    if data.debate_ids:
        participations = [
            p for p in participations if p.room_id in [int(did) for did in data.debate_ids]]

    total_logic = 0
    total_credibility = 0
    total_rhetoric = 0
    debate_count = 0

    strengths = []
    weaknesses = []

    for participation in participations:
        if participation.role == "debater":
            score = participation.score if participation.score else {}
            if score:
                total_logic += score.get("logic", 0)
                total_credibility += score.get("credibility", 0)
                total_rhetoric += score.get("rhetoric", 0)
                debate_count += 1

    if debate_count > 0:
        avg_logic = total_logic / debate_count
        avg_credibility = total_credibility / debate_count
        avg_rhetoric = total_rhetoric / debate_count

        if avg_logic >= 7:
            strengths.append("Strong logical reasoning")
        elif avg_logic < 5:
            weaknesses.append("Needs improvement in logical argumentation")

        if avg_credibility >= 7:
            strengths.append("Good use of evidence and facts")
        elif avg_credibility < 5:
            weaknesses.append("Should incorporate more credible sources")

        if avg_rhetoric >= 7:
            strengths.append("Persuasive communication style")
        elif avg_rhetoric < 5:
            weaknesses.append("Delivery and rhetoric need work")

        metrics = {
            "logic": avg_logic,
            "credibility": avg_credibility,
            "rhetoric": avg_rhetoric,
            "debates_participated": debate_count
        }
    else:
        metrics = {
            "logic": 0,
            "credibility": 0,
            "rhetoric": 0,
            "debates_participated": 0
        }
        weaknesses.append("No debate history yet")

    feedback = await TrainerFeedbackRepository.get_by_user(db, int(data.user_id))

    if feedback:
        await Repository.update_record(db, TrainerFeedback, feedback.id, {
            "metrics_json": {
                **metrics,
                "strengths": strengths,
                "weaknesses": weaknesses
            }
        })
    else:
        await Repository.create(db, TrainerFeedback, {
            "user_id": int(data.user_id),
            "metrics_json": {
                **metrics,
                "strengths": strengths,
                "weaknesses": weaknesses
            },
            "recommendations": [],
            "xp": 0,
            "badges": []
        })

    return {
        "metrics": metrics,
        "strengths": strengths,
        "weaknesses": weaknesses
    }


@router.get("/recommendations/{user_id}")
async def get_recommendations(
    user_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get personalized training recommendations
    """
    if str(user_id) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Can only view your own recommendations")

    feedback = await TrainerFeedbackRepository.get_by_user(db, int(user_id))

    if not feedback:
        return {"recommendations": [], "message": "No feedback available yet"}

    metrics = feedback.metrics_json if feedback.metrics_json else {}
    recommendations = []

    if metrics.get("logic", 0) < 6:
        recommendations.append({
            "exercise_type": "logic_practice",
            "prompt": "Practice identifying logical fallacies in arguments",
            "difficulty": "medium"
        })

    if metrics.get("credibility", 0) < 6:
        recommendations.append({
            "exercise_type": "fact_checking",
            "prompt": "Learn to support claims with credible sources",
            "difficulty": "medium"
        })

    if metrics.get("rhetoric", 0) < 6:
        recommendations.append({
            "exercise_type": "persuasion",
            "prompt": "Practice persuasive speaking techniques",
            "difficulty": "easy"
        })

    await Repository.update_record(db, TrainerFeedback, feedback.id, {
        "recommendations": recommendations
    })

    return {"recommendations": recommendations}


@router.post("/challenge/start")
async def start_challenge(
    data: ChallengeStart,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Start a training challenge
    """
    challenge_id = secrets.token_hex(8)

    challenges = {
        "refute": "Refute the following argument: 'Social media has no negative effects on society.'",
        "fact_check": "Fact-check this claim: 'The majority of scientific studies are reproducible.'",
        "rephrase": "Rephrase this argument more persuasively: 'We should recycle because it helps the environment.'"
    }

    prompt = challenges.get(
        data.exercise_type, "Practice your debating skills.")

    return {
        "challenge_id": challenge_id,
        "exercise_type": data.exercise_type,
        "prompt": prompt,
        "status": "active"
    }


@router.post("/challenge/submit")
async def submit_challenge(
    data: ChallengeSubmit,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Submit response to a training challenge
    """
    analysis = await GeminiAI.analyze_debate_turn(
        turn_content=data.response,
        context=f"Training exercise: {data.challenge_id}"
    )

    xp_earned = int(analysis.get("logic", 0) +
                    analysis.get("credibility", 0) + analysis.get("rhetoric", 0))

    feedback = await TrainerFeedbackRepository.get_by_user(db, int(current_user["id"]))
    if feedback:
        current_xp = feedback.xp if feedback.xp else 0
        await Repository.update_record(db, TrainerFeedback, feedback.id, {
            "xp": current_xp + xp_earned
        })

        user = await Repository.get_by_id(db, User, int(current_user["id"]))
        if user:
            await Repository.update_record(db, User, int(current_user["id"]), {
                "xp": user.xp + xp_earned
            })

    return {
        "challenge_id": data.challenge_id,
        "feedback": analysis.get("feedback"),
        "xp_earned": xp_earned,
        "analysis": analysis
    }


@router.get("/progress/{user_id}", response_model=TrainerProgress)
async def get_progress(
    user_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user's training progress
    """
    if str(user_id) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Can only view your own progress")

    feedback = await TrainerFeedbackRepository.get_by_user(db, int(user_id))

    if not feedback:
        return {
            "user_id": int(user_id),
            "metrics_json": {},
            "recommendations": [],
            "xp": 0,
            "badges": []
        }

    return feedback


@router.put("/progress/{user_id}")
async def update_progress(
    user_id: str,
    xp_delta: int = 0,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update user's training progress
    """
    if str(user_id) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Can only update your own progress")

    feedback = await TrainerFeedbackRepository.get_by_user(db, int(user_id))

    if not feedback:
        raise HTTPException(
            status_code=404, detail="No training feedback found")

    current_xp = feedback.xp if feedback.xp else 0
    new_xp = current_xp + xp_delta

    await Repository.update_record(db, TrainerFeedback, feedback.id, {"xp": new_xp})

    return {"user_id": user_id, "xp": new_xp}
