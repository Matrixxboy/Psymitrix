from pydantic import BaseModel, ConfigDict, Field, EmailStr, HttpUrl, PositiveInt
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"

class Mood(str, Enum):
    EXCITED = "excited" #score 10
    HAPPY = "happy" #score 8
    CALM = "calm" #score 7
    NEUTRAL = "neutral" #score 5
    SAD = "sad" #score 3
    ANGRY = "angry" #score 2

class MoodTrend(BaseModel):
    mood_id: UUID = Field(default_factory=uuid4)
    mood: Mood
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = ConfigDict(
        json_encoders={
            UUID: lambda v: str(v),
            datetime: lambda v: v.isoformat()
        },
        from_attributes=True
    )


class TestResult(BaseModel):
    test_name: str  # e.g., "PHQ-9", "GAD-7"
    score: int
    model_config = ConfigDict(from_attributes=True)

class Session(BaseModel):
    session_id: UUID = Field(default_factory=uuid4)
    session_date: datetime = Field(default_factory=datetime.utcnow)
    tests: List["TestResult"] = Field(default_factory=list)

    model_config = ConfigDict(
        json_encoders={
            UUID: lambda v: str(v),
            datetime: lambda v: v.isoformat()
        },
        from_attributes=True
    )

class GamesData(BaseModel):
    game_id: UUID = Field(default_factory=uuid4)
    game_played: int = 0
    total_time_played: int = 0
    game_name: str
    high_score: int = 0
    total_score: int = 0
    last_played: Optional[datetime] = None

    model_config = ConfigDict(
        json_encoders={
            UUID: lambda v: str(v),
            datetime: lambda v: v.isoformat() if v else None
        },
        from_attributes=True
    )

class Games(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    games: List[GamesData] = Field(default_factory=list)
    played_date: datetime = Field(default_factory=datetime.utcnow)
    total_score: int = 0
    games_played: int = 0
    total_time_played: int = 0  # in minutes

    model_config = ConfigDict(
        json_encoders={
            UUID: lambda v: str(v),
            datetime: lambda v: v.isoformat() if v else None
        },
        from_attributes=True
    )

class achievementsData(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    achievement_name: str
    description: Optional[str] = None
    date_earned: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        json_encoders={
            UUID: lambda v: str(v),
            datetime: lambda v: v.isoformat()
        },
        from_attributes=True
    )



class User(BaseModel):
    # login data
    user_id: UUID = Field(default_factory=uuid4)
    email: EmailStr
    username: str
    hashed_password: str
    # user profile data
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    middleName: Optional[str] = None
    age: Optional[PositiveInt] = None
    gender: Optional[Gender] = None
    bloodgroup: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    occupation: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[HttpUrl] = None
    olderSiblings: Optional[int] = None
    youngerSiblings: Optional[int] = None
    parental_marital_status: Optional[str] = None
    # user stats
    score: int = 0
    interactions: int = 0
    streak: int = 0
    streak_updated_at: Optional[datetime] = None
    longest_streak: int = 0
    last_interaction: Optional[datetime] = None
    last_login: Optional[datetime] = None
    login_history: List[datetime] = []
    sessions: List[Session] = []
    games: List[Games] = []
    achievements: List[achievementsData] = []
    mood_trends: List[MoodTrend] = []
    # admin and status flags
    is_active: bool = True
    is_verified: bool = False
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        json_encoders={
            UUID: lambda v: str(v),
            datetime: lambda v: v.isoformat()
        },
        from_attributes=True
    )

class UserUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    middleName: Optional[str] = None
    age: Optional[PositiveInt] = None
    gender: Optional[Gender] = None
    bloodgroup: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    occupation: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[HttpUrl] = None
    olderSiblings: Optional[int] = None
    youngerSiblings: Optional[int] = None
    parental_marital_status: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)



