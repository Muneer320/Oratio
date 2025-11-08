from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from app.schemas import UserCreate, UserLogin, UserResponse, UserUpdate, Token
from app.replit_auth import ReplitAuth, get_current_user, REPLIT_AUTH_AVAILABLE
from app.database import get_db
from app.repositories import Repository
from app.models import User
from app.badge_service import BadgeService
from typing import List

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user
    """
    try:
        result = ReplitAuth.simple_auth_register(
            username=user_data.username,
            email=user_data.email,
            password=user_data.password
        )
        return {"access_token": result["token"], "token_type": "bearer"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Login user and return access token
    """
    try:
        result = ReplitAuth.simple_auth_login(
            email=credentials.email,
            password=credentials.password
        )
        return {"access_token": result["token"], "token_type": "bearer"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current authenticated user
    """
    user = await Repository.get_by_id(db, User, int(current_user["id"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/update", response_model=UserResponse)
async def update_user(
    user_update: UserUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user's profile
    """
    user_id = int(current_user["id"])

    update_data = user_update.model_dump(exclude_unset=True)

    updated_user = await Repository.update_record(db, User, user_id, update_data)

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user


@router.delete("/logout")
async def logout(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Logout user (invalidate token)
    """
    return {"message": "Logged out successfully"}


@router.get("/badges")
async def get_user_badges(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user's badges with earned status
    Returns all available badges with 'earned' flag
    """
    user = await Repository.get_by_id(db, User, int(current_user["id"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_badges = user.badges if user.badges else []
    formatted_badges = BadgeService.format_badges_for_profile(user_badges)
    
    return {
        "badges": formatted_badges,
        "total_earned": len(user_badges),
        "total_available": len(BadgeService.get_all_badges())
    }


@router.get("/stats")
async def get_user_stats(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user's debate statistics
    Returns participation count, win/loss record, average LCR scores, level info
    """
    from app.repositories import ParticipantRepository, ResultRepository
    from app.models import Participant, Result
    
    user_id = int(current_user["id"])
    user = await Repository.get_by_id(db, User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    participations = await Repository.find_all(db, Participant, {"user_id": user_id}, limit=1000)
    debater_participations = [p for p in participations if p.role == "debater"]
    
    total_debates = len(debater_participations)
    wins = 0
    losses = 0
    total_logic = 0
    total_credibility = 0
    total_rhetoric = 0
    scored_debates = 0
    
    for participation in debater_participations:
        result = await ResultRepository.get_by_room(db, participation.room_id)
        if result:
            if result.winner_id == participation.id:
                wins += 1
            elif result.winner_id is not None:
                losses += 1
        
        score = participation.score if participation.score else {}
        if score and isinstance(score, dict):
            logic = score.get("logic", 0)
            credibility = score.get("credibility", 0)
            rhetoric = score.get("rhetoric", 0)
            
            if logic > 0 or credibility > 0 or rhetoric > 0:
                total_logic += logic
                total_credibility += credibility
                total_rhetoric += rhetoric
                scored_debates += 1
    
    avg_logic = round(total_logic / scored_debates, 1) if scored_debates > 0 else 0
    avg_credibility = round(total_credibility / scored_debates, 1) if scored_debates > 0 else 0
    avg_rhetoric = round(total_rhetoric / scored_debates, 1) if scored_debates > 0 else 0
    win_rate = round((wins / total_debates) * 100, 1) if total_debates > 0 else 0
    
    level = user.xp // 500 + 1
    xp_in_level = user.xp % 500
    xp_to_next = 500
    level_progress = round((xp_in_level / xp_to_next) * 100, 1)
    
    return {
        "total_debates": total_debates,
        "wins": wins,
        "losses": losses,
        "win_rate": win_rate,
        "avg_logic": avg_logic,
        "avg_credibility": avg_credibility,
        "avg_rhetoric": avg_rhetoric,
        "total_xp": user.xp,
        "level": level,
        "xp_in_level": xp_in_level,
        "xp_to_next": xp_to_next,
        "level_progress": level_progress
    }


@router.get("/debate-history")
async def get_debate_history(
    filter_type: str = "all",
    limit: int = 20,
    offset: int = 0,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user's debate history
    filter_type: 'all', 'won', 'lost'
    Returns list of debates with results and scores
    """
    from app.repositories import ParticipantRepository, ResultRepository
    from app.models import Participant, Result, Room
    from sqlalchemy import select, desc
    
    user_id = int(current_user["id"])
    
    query = select(Participant).where(
        Participant.user_id == user_id,
        Participant.role == "debater"
    ).order_by(desc(Participant.joined_at))
    
    result = await db.execute(query)
    all_participations = list(result.scalars().all())
    
    debates = []
    for participation in all_participations:
        room = await Repository.get_by_id(db, Room, participation.room_id)
        if not room:
            continue
        
        debate_result = await ResultRepository.get_by_room(db, participation.room_id)
        
        won = False
        if debate_result and debate_result.winner_id == participation.id:
            won = True
        
        if filter_type == "won" and not won:
            continue
        if filter_type == "lost" and (won or not debate_result):
            continue
        
        score = participation.score if participation.score else {}
        
        debates.append({
            "id": room.id,
            "topic": room.topic,
            "date": room.scheduled_time.isoformat() if room.scheduled_time else room.created_at.isoformat(),
            "status": room.status,
            "result": "Won" if won else "Lost" if debate_result else "No Result",
            "won": won,
            "logic": score.get("logic", 0) if isinstance(score, dict) else 0,
            "credibility": score.get("credibility", 0) if isinstance(score, dict) else 0,
            "rhetoric": score.get("rhetoric", 0) if isinstance(score, dict) else 0,
            "has_result": debate_result is not None
        })
    
    paginated = debates[offset:offset + limit]
    
    return {
        "debates": paginated,
        "total": len(debates),
        "has_more": len(debates) > offset + limit
    }
