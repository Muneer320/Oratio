from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class DebateMode(str, enum.Enum):
    TEXT = "text"
    AUDIO = "audio"
    BOTH = "both"


class DebateType(str, enum.Enum):
    INDIVIDUAL = "individual"
    TEAM = "team"


class DebateStatus(str, enum.Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Visibility(str, enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    xp = Column(Integer, default=0)
    badges = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    # Relationships
    hosted_rooms = relationship(
        "Room", back_populates="host", foreign_keys="Room.host_id")
    participations = relationship("Participant", back_populates="user")
    trainer_feedback = relationship(
        "TrainerFeedback", back_populates="user", uselist=False)


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    scheduled_time = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=30)
    mode = Column(SQLEnum(DebateMode), default=DebateMode.TEXT)
    type = Column(SQLEnum(DebateType), default=DebateType.INDIVIDUAL)
    visibility = Column(SQLEnum(Visibility), default=Visibility.PUBLIC)
    rounds = Column(Integer, default=3)
    status = Column(SQLEnum(DebateStatus), default=DebateStatus.UPCOMING)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resources = Column(JSON, default=list)  # List of uploaded file references
    room_code = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    # Relationships
    host = relationship(
        "User", back_populates="hosted_rooms", foreign_keys=[host_id])
    participants = relationship(
        "Participant", back_populates="room", cascade="all, delete-orphan")
    turns = relationship("Turn", back_populates="room",
                         cascade="all, delete-orphan")
    spectator_votes = relationship(
        "SpectatorVote", back_populates="room", cascade="all, delete-orphan")
    result = relationship("Result", back_populates="room",
                          uselist=False, cascade="all, delete-orphan")


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    team = Column(String, nullable=True)  # "A", "B", or team name
    role = Column(String, default="debater")  # "debater" or "spectator"
    is_ready = Column(Boolean, default=False)
    # {"logic": 0, "credibility": 0, "rhetoric": 0}
    score = Column(JSON, default=dict)
    xp_earned = Column(Integer, default=0)
    joined_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="participations")
    room = relationship("Room", back_populates="participants")
    turns = relationship("Turn", back_populates="speaker")


class Turn(Base):
    __tablename__ = "turns"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    speaker_id = Column(Integer, ForeignKey("participants.id"), nullable=False)
    content = Column(Text, nullable=False)
    audio_url = Column(String, nullable=True)
    round_number = Column(Integer, nullable=False)
    turn_number = Column(Integer, nullable=False)
    ai_feedback = Column(JSON, default=dict)  # Inline AI feedback
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    room = relationship("Room", back_populates="turns")
    speaker = relationship("Participant", back_populates="turns")


class SpectatorVote(Base):
    __tablename__ = "spectator_votes"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    spectator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_id = Column(Integer, ForeignKey("participants.id"),
                       nullable=False)  # Player being rewarded
    reaction_type = Column(String, nullable=False)  # "👏", "🔥", "❤️", etc.
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    room = relationship("Room", back_populates="spectator_votes")


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"),
                     unique=True, nullable=False)
    winner_id = Column(Integer, ForeignKey("participants.id"), nullable=True)
    # Full LCR scores for all participants
    scores_json = Column(JSON, nullable=False)
    # AI feedback for each participant
    feedback_json = Column(JSON, nullable=False)
    summary = Column(Text, nullable=False)
    report_url = Column(String, nullable=True)
    spectator_influence = Column(JSON, default=dict)  # Audience support data
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    room = relationship("Room", back_populates="result")


class TrainerFeedback(Base):
    __tablename__ = "trainer_feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"),
                     unique=True, nullable=False)
    metrics_json = Column(JSON, default=dict)  # Strengths/weaknesses breakdown
    # AI-generated training exercises
    recommendations = Column(JSON, default=list)
    xp = Column(Integer, default=0)
    badges = Column(JSON, default=list)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="trainer_feedback")


class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # "pdf", "audio", "url"
    file_size = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
