from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from app.replit_auth import get_current_user
from app.replit_db import DB, Collections
from app.models import User

router = APIRouter(prefix="/api/user", tags=["User"])


@router.get("/stats")
async def get_user_stats(current_user: User = Depends(get_current_user)):
    """
    Get comprehensive user statistics including debates joined, hosted, win rate, etc.
    """
    user_id = str(current_user.id)
    
    # Get all rooms where user participated
    all_participants = DB.find(Collections.PARTICIPANTS, {"user_id": user_id})
    
    # Get all rooms
    all_rooms = DB.find(Collections.ROOMS, {})
    rooms_map = {r["id"]: r for r in all_rooms}
    
    debates_joined = 0
    debates_hosted = 0
    debates_won = 0
    total_debates = 0
    total_xp = 0
    
    # Calculate stats
    for participant in all_participants:
        room_id = participant.get("room_id")
        room = rooms_map.get(room_id)
        
        if not room:
            continue
            
        # Count debates joined
        if participant.get("role") == "debater":
            debates_joined += 1
            
            # Only count completed debates
            if room.get("status") == "completed":
                total_debates += 1
                
                # Check if user won
                results = DB.find_one(Collections.RESULTS, {"room_id": room_id})
                if results and results.get("winner_id") == participant.get("id"):
                    debates_won += 1
                
                # Calculate XP from scores
                if participant.get("score"):
                    score_avg = (
                        participant["score"].get("logic", 0) +
                        participant["score"].get("credibility", 0) +
                        participant["score"].get("rhetoric", 0)
                    ) / 3
                    total_xp += int(score_avg * 10)  # Convert score to XP
        
        # Count debates hosted
        if room.get("host_id") == user_id:
            debates_hosted += 1
    
    # Calculate win rate
    win_rate = round((debates_won / total_debates * 100), 1) if total_debates > 0 else 0
    
    # Calculate level from XP (100 XP per level)
    level = max(1, total_xp // 100)
    xp_progress = total_xp % 100
    
    # Get average scores across all completed debates
    all_turns = []
    for participant in all_participants:
        if participant.get("role") == "debater":
            turns = DB.find(Collections.TURNS, {"speaker_id": participant["id"]})
            all_turns.extend(turns)
    
    total_logic = 0
    total_credibility = 0
    total_rhetoric = 0
    scored_turns = 0
    
    for turn in all_turns:
        feedback = turn.get("ai_feedback", {})
        if feedback:
            total_logic += feedback.get("logic", 0)
            total_credibility += feedback.get("credibility", 0)
            total_rhetoric += feedback.get("rhetoric", 0)
            scored_turns += 1
    
    avg_logic = round(total_logic / scored_turns) if scored_turns > 0 else 0
    avg_credibility = round(total_credibility / scored_turns) if scored_turns > 0 else 0
    avg_rhetoric = round(total_rhetoric / scored_turns) if scored_turns > 0 else 0
    
    # Calculate badges earned
    badges_earned = []
    if scored_turns >= 50:
        badges_earned.append("fact_finder")
    if avg_rhetoric >= 90:
        badges_earned.append("rhetoric_master")
    if avg_logic >= 95:
        badges_earned.append("logic_legend")
    if debates_won >= 50:
        badges_earned.append("debate_champion")
    if debates_joined >= 100:
        badges_earned.append("marathon_debater")
    if level >= 10:
        badges_earned.append("rising_star")
    if avg_credibility >= 95:
        badges_earned.append("credibility_expert")
    if debates_won >= 10:
        badges_earned.append("quick_thinker")
    
    return {
        "user_id": user_id,
        "username": current_user.username or current_user.name,
        "level": level,
        "xp": total_xp,
        "xp_progress": xp_progress,
        "debates_joined": debates_joined,
        "debates_hosted": debates_hosted,
        "debates_won": debates_won,
        "win_rate": win_rate,
        "avg_scores": {
            "logic": avg_logic,
            "credibility": avg_credibility,
            "rhetoric": avg_rhetoric
        },
        "badges_earned": badges_earned,
        "total_turns": len(all_turns)
    }


@router.get("/history")
async def get_user_history(current_user: User = Depends(get_current_user)):
    """
    Get user's debate history with detailed information
    """
    user_id = str(current_user.id)
    
    # Get all participations
    all_participants = DB.find(Collections.PARTICIPANTS, {"user_id": user_id})
    
    history = []
    for participant in all_participants:
        if participant.get("role") != "debater":
            continue
            
        room_id = participant.get("room_id")
        room = DB.get(Collections.ROOMS, str(room_id))
        
        if not room:
            continue
        
        # Get result if available
        result = DB.find_one(Collections.RESULTS, {"room_id": room_id})
        
        won = False
        if result and result.get("winner_id") == participant.get("id"):
            won = True
        
        history.append({
            "room_id": room_id,
            "room_code": room.get("room_code"),
            "topic": room.get("topic"),
            "status": room.get("status"),
            "created_at": room.get("created_at"),
            "won": won,
            "score": participant.get("score"),
            "turn_count": participant.get("turn_count", 0)
        })
    
    # Sort by created_at descending
    history.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    return {
        "user_id": user_id,
        "history": history
    }
