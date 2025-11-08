from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from sqlalchemy.orm import selectinload
from typing import Optional, List, Dict, Any, Type, TypeVar
from datetime import datetime
from app.models import (
    User, Room, Participant, Turn, SpectatorVote, 
    Result, TrainerFeedback, UploadedFile
)

T = TypeVar('T')


class Repository:
    """
    Async repository for database operations.
    Replaces ReplitDB operations with PostgreSQL queries.
    """

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        model: Type[T],
        id: int
    ) -> Optional[T]:
        """
        Get a single record by ID.
        Replaces: DB.get(collection, id)
        """
        result = await db.execute(select(model).where(model.id == id))
        return result.scalar_one_or_none()

    @staticmethod
    async def find_all(
        db: AsyncSession,
        model: Type[T],
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[T]:
        """
        Find all records matching filters.
        Replaces: DB.find(collection, filters, limit)
        """
        query = select(model)
        
        if filters:
            for key, value in filters.items():
                if hasattr(model, key):
                    query = query.where(getattr(model, key) == value)
        
        query = query.limit(limit).offset(offset)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def find_one(
        db: AsyncSession,
        model: Type[T],
        filters: Dict[str, Any]
    ) -> Optional[T]:
        """
        Find a single record matching filters.
        Replaces: DB.find_one(collection, filters)
        """
        query = select(model)
        
        for key, value in filters.items():
            if hasattr(model, key):
                query = query.where(getattr(model, key) == value)
        
        result = await db.execute(query.limit(1))
        return result.scalar_one_or_none()

    @staticmethod
    async def create(
        db: AsyncSession,
        model: Type[T],
        data: Dict[str, Any]
    ) -> T:
        """
        Create a new record.
        Replaces: DB.insert(collection, data)
        """
        # Only add created_at if the model has that column and it's not already provided
        if "created_at" not in data and hasattr(model, "created_at"):
            data["created_at"] = datetime.utcnow()
        
        instance = model(**data)
        db.add(instance)
        await db.flush()
        await db.refresh(instance)
        return instance

    @staticmethod
    async def update_record(
        db: AsyncSession,
        model: Type[T],
        id: int,
        data: Dict[str, Any]
    ) -> Optional[T]:
        """
        Update an existing record.
        Replaces: DB.update(collection, id, data)
        """
        instance = await Repository.get_by_id(db, model, id)
        if not instance:
            return None
        
        data["updated_at"] = datetime.utcnow()
        
        for key, value in data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
        
        await db.flush()
        await db.refresh(instance)
        return instance

    @staticmethod
    async def delete_record(
        db: AsyncSession,
        model: Type[T],
        id: int
    ) -> bool:
        """
        Delete a record by ID.
        Replaces: DB.delete(collection, id)
        """
        instance = await Repository.get_by_id(db, model, id)
        if not instance:
            return False
        
        await db.delete(instance)
        await db.flush()
        return True

    @staticmethod
    async def count(
        db: AsyncSession,
        model: Type[T],
        filters: Optional[Dict[str, Any]] = None
    ) -> int:
        """
        Count records matching filters.
        Replaces: DB.count(collection, filters)
        """
        query = select(func.count()).select_from(model)
        
        if filters:
            for key, value in filters.items():
                if hasattr(model, key):
                    query = query.where(getattr(model, key) == value)
        
        result = await db.execute(query)
        return result.scalar_one()


class UserRepository:
    """Specialized repository for User operations"""

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """Get user by email"""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_username(db: AsyncSession, username: str) -> Optional[User]:
        """Get user by username"""
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()

    @staticmethod
    async def email_exists(db: AsyncSession, email: str) -> bool:
        """Check if email already exists"""
        result = await db.execute(select(func.count()).select_from(User).where(User.email == email))
        return result.scalar_one() > 0

    @staticmethod
    async def username_exists(db: AsyncSession, username: str) -> bool:
        """Check if username already exists"""
        result = await db.execute(select(func.count()).select_from(User).where(User.username == username))
        return result.scalar_one() > 0


class RoomRepository:
    """Specialized repository for Room operations"""

    @staticmethod
    async def get_by_code(db: AsyncSession, room_code: str) -> Optional[Room]:
        """Get room by room code"""
        result = await db.execute(
            select(Room).where(Room.room_code == room_code.upper())
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_public_rooms(
        db: AsyncSession, 
        status: Optional[str] = None,
        limit: int = 100
    ) -> List[Room]:
        """Get all public rooms, optionally filtered by status"""
        query = select(Room).where(Room.visibility == "public")
        
        if status:
            query = query.where(Room.status == status)
        
        query = query.order_by(Room.created_at.desc()).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def code_exists(db: AsyncSession, room_code: str) -> bool:
        """Check if room code exists"""
        result = await db.execute(
            select(func.count()).select_from(Room).where(Room.room_code == room_code.upper())
        )
        return result.scalar_one() > 0


class ParticipantRepository:
    """Specialized repository for Participant operations"""

    @staticmethod
    async def get_by_user_and_room(
        db: AsyncSession,
        user_id: int,
        room_id: int
    ) -> Optional[Participant]:
        """Get participant by user and room"""
        result = await db.execute(
            select(Participant).where(
                Participant.user_id == user_id,
                Participant.room_id == room_id
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_room_participants(
        db: AsyncSession,
        room_id: int,
        role: Optional[str] = None
    ) -> List[Participant]:
        """Get all participants in a room, optionally filtered by role"""
        query = select(Participant).where(Participant.room_id == room_id)
        
        if role:
            query = query.where(Participant.role == role)
        
        result = await db.execute(query)
        return list(result.scalars().all())


class TurnRepository:
    """Specialized repository for Turn operations"""

    @staticmethod
    async def get_room_turns(
        db: AsyncSession,
        room_id: int,
        limit: int = 100
    ) -> List[Turn]:
        """Get all turns in a room, ordered by timestamp"""
        result = await db.execute(
            select(Turn)
            .where(Turn.room_id == room_id)
            .order_by(Turn.timestamp.asc())
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_speaker_turns(
        db: AsyncSession,
        speaker_id: int
    ) -> List[Turn]:
        """Get all turns by a specific speaker"""
        result = await db.execute(
            select(Turn)
            .where(Turn.speaker_id == speaker_id)
            .order_by(Turn.timestamp.asc())
        )
        return list(result.scalars().all())


class ResultRepository:
    """Specialized repository for Result operations"""

    @staticmethod
    async def get_by_room(db: AsyncSession, room_id: int) -> Optional[Result]:
        """Get result by room ID"""
        result = await db.execute(
            select(Result).where(Result.room_id == room_id)
        )
        return result.scalar_one_or_none()


class SpectatorVoteRepository:
    """Specialized repository for SpectatorVote operations"""

    @staticmethod
    async def get_room_votes(db: AsyncSession, room_id: int) -> List[SpectatorVote]:
        """Get all spectator votes for a room"""
        result = await db.execute(
            select(SpectatorVote).where(SpectatorVote.room_id == room_id)
        )
        return list(result.scalars().all())


class TrainerFeedbackRepository:
    """Specialized repository for TrainerFeedback operations"""

    @staticmethod
    async def get_by_user(db: AsyncSession, user_id: int) -> Optional[TrainerFeedback]:
        """Get trainer feedback by user ID"""
        result = await db.execute(
            select(TrainerFeedback).where(TrainerFeedback.user_id == user_id)
        )
        return result.scalar_one_or_none()
