from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from app.schemas import TrainerAnalyze, TrainerProgress, ChallengeStart, ChallengeSubmit, TrainerRecommendation
from app.replit_auth import get_current_user
from app.replit_db import ReplitDB, Collections
from app.replit_ai import ReplitAI
import secrets

router = APIRouter(prefix="/api/trainer", tags=["AI Trainer"])


@router.post("/analyze")
async def analyze_user_performance(
    data: TrainerAnalyze,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Analyze user's debate performance and generate feedback
    """
    if data.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Can only analyze your own performance")
    
    participations = ReplitDB.find(Collections.PARTICIPANTS, {"user_id": data.user_id})
    
    if data.debate_ids:
        participations = [p for p in participations if p["room_id"] in data.debate_ids]
    
    total_logic = 0
    total_credibility = 0
    total_rhetoric = 0
    debate_count = 0
    
    strengths = []
    weaknesses = []
    
    for participation in participations:
        if participation["role"] == "debater":
            score = participation.get("score", {})
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
    
    feedback = ReplitDB.find_one(Collections.TRAINER_FEEDBACK, {"user_id": data.user_id})
    
    if feedback:
        ReplitDB.update(Collections.TRAINER_FEEDBACK, str(feedback["id"]), {
            "metrics_json": {
                **metrics,
                "strengths": strengths,
                "weaknesses": weaknesses
            }
        })
    else:
        ReplitDB.insert(Collections.TRAINER_FEEDBACK, {
            "user_id": data.user_id,
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
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get personalized training recommendations
    """
    if str(user_id) != str(current_user["id"]):
        raise HTTPException(status_code=403, detail="Can only view your own recommendations")
    
    feedback = ReplitDB.find_one(Collections.TRAINER_FEEDBACK, {"user_id": user_id})
    
    if not feedback:
        return {"recommendations": [], "message": "No feedback available yet"}
    
    metrics = feedback.get("metrics_json", {})
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
    
    ReplitDB.update(Collections.TRAINER_FEEDBACK, str(feedback["id"]), {
        "recommendations": recommendations
    })
    
    return {"recommendations": recommendations}


@router.post("/challenge/start")
async def start_challenge(
    data: ChallengeStart,
    current_user: Dict[str, Any] = Depends(get_current_user)
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
    
    prompt = challenges.get(data.exercise_type, "Practice your debating skills.")
    
    return {
        "challenge_id": challenge_id,
        "exercise_type": data.exercise_type,
        "prompt": prompt,
        "status": "active"
    }


@router.post("/challenge/submit")
async def submit_challenge(
    data: ChallengeSubmit,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Submit response to a training challenge
    """
    analysis = await ReplitAI.analyze_debate_turn(
        turn_content=data.response,
        context=f"Training exercise: {data.challenge_id}"
    )
    
    xp_earned = int(analysis.get("logic", 0) + analysis.get("credibility", 0) + analysis.get("rhetoric", 0))
    
    feedback = ReplitDB.find_one(Collections.TRAINER_FEEDBACK, {"user_id": current_user["id"]})
    if feedback:
        current_xp = feedback.get("xp", 0)
        ReplitDB.update(Collections.TRAINER_FEEDBACK, str(feedback["id"]), {
            "xp": current_xp + xp_earned
        })
        
        user = ReplitDB.get(Collections.USERS, str(current_user["id"]))
        if user:
            ReplitDB.update(Collections.USERS, str(current_user["id"]), {
                "xp": user.get("xp", 0) + xp_earned
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
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get user's training progress
    """
    if str(user_id) != str(current_user["id"]):
        raise HTTPException(status_code=403, detail="Can only view your own progress")
    
    feedback = ReplitDB.find_one(Collections.TRAINER_FEEDBACK, {"user_id": user_id})
    
    if not feedback:
        return {
            "user_id": user_id,
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
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update user's training progress
    """
    if str(user_id) != str(current_user["id"]):
        raise HTTPException(status_code=403, detail="Can only update your own progress")
    
    feedback = ReplitDB.find_one(Collections.TRAINER_FEEDBACK, {"user_id": user_id})
    
    if not feedback:
        raise HTTPException(status_code=404, detail="No training feedback found")
    
    current_xp = feedback.get("xp", 0)
    new_xp = current_xp + xp_delta
    
    ReplitDB.update(Collections.TRAINER_FEEDBACK, str(feedback["id"]), {"xp": new_xp})
    
    return {"user_id": user_id, "xp": new_xp}
