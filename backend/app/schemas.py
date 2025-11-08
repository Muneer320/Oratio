from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models import DebateMode, DebateType, DebateStatus, Visibility


# ==================== User Schemas ====================

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    xp: int
    badges: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


# ==================== Room Schemas ====================

class RoomBase(BaseModel):
    topic: str
    description: Optional[str] = None
    scheduled_time: datetime
    duration_minutes: int = 30
    mode: DebateMode = DebateMode.TEXT
    type: DebateType = DebateType.INDIVIDUAL
    visibility: Visibility = Visibility.PUBLIC
    rounds: int = 3


class RoomCreate(RoomBase):
    resources: Optional[List[str]] = []


class RoomUpdate(BaseModel):
    topic: Optional[str] = None
    description: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    mode: Optional[DebateMode] = None
    visibility: Optional[Visibility] = None
    status: Optional[DebateStatus] = None


class RoomResponse(BaseModel):
    id: int
    topic: str
    description: Optional[str] = None
    scheduled_time: str
    duration_minutes: int
    mode: str
    type: str
    visibility: str
    rounds: int
    status: str
    host_id: int
    room_code: str
    resources: List[str]
    created_at: str

    class Config:
        from_attributes = True


# ==================== Participant Schemas ====================

class ParticipantJoin(BaseModel):
    room_code: str
    team: Optional[str] = None  # For team debates


class ParticipantResponse(BaseModel):
    id: int
    user_id: int
    room_id: int
    team: Optional[str]
    role: str
    is_ready: bool
    score: Dict[str, Any]
    xp_earned: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Turn Schemas ====================

class TurnSubmit(BaseModel):
    content: str
    round_number: int
    turn_number: int


class TurnResponse(BaseModel):
    id: int
    room_id: int
    speaker_id: int
    content: str
    audio_url: Optional[str]
    round_number: int
    turn_number: int
    ai_feedback: Optional[Dict[str, Any]] = None
    timestamp: datetime

    class Config:
        from_attributes = True


# ==================== Spectator Schemas ====================

class SpectatorJoin(BaseModel):
    room_code: str


class SpectatorReward(BaseModel):
    target_id: int  # Participant ID
    reaction_type: str  # "👏", "🔥", "❤️", etc.


class SpectatorStats(BaseModel):
    room_id: int
    total_spectators: int
    reactions: Dict[int, List[str]]  # participant_id -> list of reactions
    support_percentages: Dict[int, float]  # participant_id -> percentage


# ==================== Result Schemas ====================

class ResultResponse(BaseModel):
    id: int
    room_id: int
    winner_id: Optional[int]
    scores_json: Dict[str, Any]
    feedback_json: Dict[str, Any]
    summary: str
    report_url: Optional[str]
    spectator_influence: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== AI Schemas ====================

class AIAnalyzeTurn(BaseModel):
    room_id: int
    turn_id: int


class AIFactCheck(BaseModel):
    statement: str
    context: Optional[str] = None


class AIFinalScore(BaseModel):
    room_id: int


# ==================== Trainer Schemas ====================

class TrainerAnalyze(BaseModel):
    user_id: int
    debate_ids: Optional[List[int]] = None


class TrainerRecommendation(BaseModel):
    exercise_type: str
    prompt: str
    difficulty: str


class TrainerProgress(BaseModel):
    user_id: int
    metrics_json: Dict[str, Any]
    recommendations: List[TrainerRecommendation]
    xp: int
    badges: List[str]

    class Config:
        from_attributes = True


class ChallengeStart(BaseModel):
    exercise_type: str  # "refute", "fact_check", "rephrase", etc.


class ChallengeSubmit(BaseModel):
    challenge_id: str
    response: str


# ==================== Upload Schemas ====================

class UploadResponse(BaseModel):
    id: int
    room_id: int
    file_name: str
    file_path: str
    file_type: str
    file_size: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Utility Schemas ====================

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: datetime


class LeaderboardEntry(BaseModel):
    user_id: int
    username: str
    xp: int
    badges: List[str]
    debates_won: int
    avg_score: float


class FeedbackSubmit(BaseModel):
    message: str
    category: Optional[str] = None
