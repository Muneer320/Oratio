from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.models import User, Participant, Room, Turn, Result
from app.repositories import Repository

BADGE_DEFINITIONS = [
    {
        "id": "first_debate",
        "name": "First Debate",
        "icon": "🎯",
        "description": "Participated in first debate",
        "criteria": "Complete your first debate"
    },
    {
        "id": "winning_streak",
        "name": "Winning Streak",
        "icon": "🔥",
        "description": "Won 3 debates in a row",
        "criteria": "Win 3 consecutive debates"
    },
    {
        "id": "logic_master",
        "name": "Logic Master",
        "icon": "🧠",
        "description": "Achieved Logic score >8.5 in a debate",
        "criteria": "Score above 8.5 in Logic"
    },
    {
        "id": "rhetoric_expert",
        "name": "Rhetoric Expert",
        "icon": "🎭",
        "description": "Achieved Rhetoric score >8.5 in a debate",
        "criteria": "Score above 8.5 in Rhetoric"
    },
    {
        "id": "credibility_champion",
        "name": "Credibility Champion",
        "icon": "✨",
        "description": "Achieved Credibility score >8.5 in a debate",
        "criteria": "Score above 8.5 in Credibility"
    },
    {
        "id": "debate_veteran",
        "name": "Debate Veteran",
        "icon": "🎖️",
        "description": "Completed 10+ debates",
        "criteria": "Complete 10 or more debates"
    },
    {
        "id": "perfect_score",
        "name": "Perfect Score",
        "icon": "💎",
        "description": "Achieved 9.0+ overall score in a debate",
        "criteria": "Score 9.0 or higher overall"
    },
    {
        "id": "quick_thinker",
        "name": "Quick Thinker",
        "icon": "⚡",
        "description": "Submitted turn in <30 seconds",
        "criteria": "Submit a debate turn in under 30 seconds"
    },
    {
        "id": "debate_legend",
        "name": "Debate Legend",
        "icon": "👑",
        "description": "Won 25+ debates",
        "criteria": "Win 25 or more debates"
    }
]


class BadgeService:
    """Service for managing user badges and achievements"""

    @staticmethod
    def get_all_badges() -> List[Dict[str, Any]]:
        """Get all badge definitions"""
        return BADGE_DEFINITIONS

    @staticmethod
    def get_badge_by_id(badge_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific badge definition by ID"""
        for badge in BADGE_DEFINITIONS:
            if badge["id"] == badge_id:
                return badge
        return None

    @staticmethod
    async def check_and_award_badges(
        db: AsyncSession,
        user_id: int,
        participant_id: Optional[int] = None,
        recent_scores: Optional[Dict[str, float]] = None
    ) -> List[str]:
        """
        Check which badges user has earned and update their profile
        Returns list of newly awarded badge IDs
        """
        user = await Repository.get_by_id(db, User, user_id)
        if not user:
            return []

        current_badges = user.badges if user.badges else []
        newly_awarded = []

        # Get user's participation data
        result = await db.execute(
            select(Participant)
            .join(Room, Participant.room_id == Room.id)
            .where(
                and_(
                    Participant.user_id == user_id,
                    Room.status == "completed"
                )
            )
        )
        completed_participations = result.scalars().all()
        total_debates = len(completed_participations)

        # Count wins
        result = await db.execute(
            select(Result)
            .join(Room, Result.room_id == Room.id)
            .join(Participant, Result.winner_id == Participant.id)
            .where(Participant.user_id == user_id)
        )
        wins = result.scalars().all()
        total_wins = len(wins)

        # Check each badge
        # 1. First Debate
        if "first_debate" not in current_badges and total_debates >= 1:
            current_badges.append("first_debate")
            newly_awarded.append("first_debate")

        # 2. Winning Streak (check last 3 debates)
        if "winning_streak" not in current_badges:
            if await BadgeService._check_winning_streak(db, user_id, 3):
                current_badges.append("winning_streak")
                newly_awarded.append("winning_streak")

        # 3-5. Score-based badges (Logic, Rhetoric, Credibility Master)
        if recent_scores:
            if "logic_master" not in current_badges and recent_scores.get("logic", 0) > 8.5:
                current_badges.append("logic_master")
                newly_awarded.append("logic_master")

            if "rhetoric_expert" not in current_badges and recent_scores.get("rhetoric", 0) > 8.5:
                current_badges.append("rhetoric_expert")
                newly_awarded.append("rhetoric_expert")

            if "credibility_champion" not in current_badges and recent_scores.get("credibility", 0) > 8.5:
                current_badges.append("credibility_champion")
                newly_awarded.append("credibility_champion")

            # 7. Perfect Score
            if "perfect_score" not in current_badges and recent_scores.get("weighted_total", 0) >= 9.0:
                current_badges.append("perfect_score")
                newly_awarded.append("perfect_score")

        # 6. Debate Veteran
        if "debate_veteran" not in current_badges and total_debates >= 10:
            current_badges.append("debate_veteran")
            newly_awarded.append("debate_veteran")

        # 8. Quick Thinker (check recent turn if participant_id provided)
        if "quick_thinker" not in current_badges and participant_id:
            if await BadgeService._check_quick_thinker(db, participant_id):
                current_badges.append("quick_thinker")
                newly_awarded.append("quick_thinker")

        # 9. Debate Legend
        if "debate_legend" not in current_badges and total_wins >= 25:
            current_badges.append("debate_legend")
            newly_awarded.append("debate_legend")

        # Update user badges if there are new ones
        if newly_awarded:
            await Repository.update_record(
                db,
                User,
                user_id,
                {"badges": current_badges}
            )

        return newly_awarded

    @staticmethod
    async def _check_winning_streak(db: AsyncSession, user_id: int, streak_length: int) -> bool:
        """Check if user has a winning streak of specified length"""
        # Get last N debates with results
        result = await db.execute(
            select(Participant, Result)
            .join(Room, Participant.room_id == Room.id)
            .outerjoin(Result, Result.room_id == Room.id)
            .where(
                and_(
                    Participant.user_id == user_id,
                    Room.status == "completed"
                )
            )
            .order_by(Participant.joined_at.desc())
            .limit(streak_length)
        )
        
        recent_debates = result.all()
        
        if len(recent_debates) < streak_length:
            return False

        # Check if user won all of them
        wins = 0
        for participant, debate_result in recent_debates:
            if debate_result and debate_result.winner_id == participant.id:
                wins += 1
            else:
                break

        return wins >= streak_length

    @staticmethod
    async def _check_quick_thinker(db: AsyncSession, participant_id: int) -> bool:
        """Check if user submitted a turn in under 30 seconds"""
        # Get turns for this participant
        result = await db.execute(
            select(Turn)
            .where(Turn.speaker_id == participant_id)
            .order_by(Turn.timestamp.desc())
            .limit(10)
        )
        
        turns = result.scalars().all()
        
        # Check if any consecutive turns were within 30 seconds
        for i in range(len(turns) - 1):
            time_diff = (turns[i].timestamp - turns[i+1].timestamp).total_seconds()
            if 0 < time_diff < 30:
                return True
        
        return False

    @staticmethod
    def format_badges_for_profile(user_badges: List[str]) -> List[Dict[str, Any]]:
        """
        Format badges for profile display with earned status
        Returns all badges with 'earned' flag
        """
        formatted_badges = []
        
        for badge_def in BADGE_DEFINITIONS:
            badge_data = {
                **badge_def,
                "earned": badge_def["id"] in user_badges
            }
            formatted_badges.append(badge_data)
        
        return formatted_badges
