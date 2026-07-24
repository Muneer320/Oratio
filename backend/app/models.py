"""Shared debate enum values for the key-value backed application."""

from enum import Enum


class DebateMode(str, Enum):
    TEXT = "text"
    AUDIO = "audio"
    BOTH = "both"


class DebateType(str, Enum):
    INDIVIDUAL = "individual"
    TEAM = "team"


class DebateStatus(str, Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Visibility(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"
