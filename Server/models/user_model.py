from pydantic import BaseModel, ConfigDict, Field, EmailStr, HttpUrl, PositiveInt
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime , date
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

class NotificationStatus(str, Enum):
    completed = "completed"
    incomplete = "incomplete"

class NotificationType(str, Enum):
    PROFILE_COMPLETE = "Profile_Complete"
    PROFILE_INCOMPLETE = "Profile_Incomplete"
    NEW_MESSAGE = "New_Message"
    FRIEND_REQUEST = "Friend_Request"
    ACHIEVEMENT_UNLOCKED = "Achievement_Unlocked"

class NotificationData(BaseModel):
    notification_id: UUID = Field(default_factory=uuid4)
    notification_name: str
    type: NotificationType
    date: datetime = Field(default_factory=datetime.utcnow)
    message: str
    seen: bool = False
    status: NotificationStatus = NotificationStatus.incomplete
    
    model_config = ConfigDict(
        json_encoders={
            UUID: lambda v: str(v),
            datetime: lambda v: v.isoformat()
        },
        from_attributes=True
    )

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

class ChatMessage(BaseModel):
    message_id: UUID = Field(default_factory=uuid4)
    sender: str  # 'user' or 'bot'
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        json_encoders={
            UUID: lambda v: str(v),
            datetime: lambda v: v.isoformat()
        },
        from_attributes=True
    )

class AssessmentResult(BaseModel):
    assessment_type: str  # 'PHQ-9' or 'GAD-7'
    score: int
    severity_level: str  # 'minimal', 'mild', 'moderate', 'moderately_severe', 'severe'
    date: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        json_encoders={
            datetime: lambda v: v.isoformat()
        },
        from_attributes=True
    )

class WellnessMetric(BaseModel):
    date: datetime = Field(default_factory=datetime.utcnow)
    daily_wellness_score: Optional[int] = None  # 0-100
    activity_minutes: Optional[int] = None  # minutes of physical activity
    sleep_hours: Optional[float] = None  # hours of sleep
    stress_level: Optional[int] = None  # 1-10 scale
    water_intake: Optional[int] = None  # glasses of water
    meditation_minutes: Optional[int] = None  # meditation practice

    model_config = ConfigDict(
        json_encoders={
            datetime: lambda v: v.isoformat()
        },
        from_attributes=True
    )

class MentalHealthProfile(BaseModel):
    mental_health_history: Optional[str] = None  # e.g., "Depression, Anxiety, past therapy"
    preferred_support_style: Optional[str] = None  # e.g., "empathetic", "solution-focused", "psychoeducational"
    therapy_goals: Optional[List[str]] = Field(default_factory=list)  # ["Sleep improvement", "Anxiety management"]
    past_diagnoses: Optional[List[str]] = Field(default_factory=list)
    current_medications: Optional[List[str]] = Field(default_factory=list)
    assessment_results: List[AssessmentResult] = Field(default_factory=list)
    last_assessment_date: Optional[datetime] = None
    wellness_metrics: List[WellnessMetric] = Field(default_factory=list)

    model_config = ConfigDict(
        json_encoders={
            datetime: lambda v: v.isoformat() if v else None
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
    birthdate: Optional[datetime]=None
    age: Optional[PositiveInt] = None
    gender: Optional[Gender] = None
    bloodgroup: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    occupation: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[HttpUrl] = None
    olderSiblings: Optional[int] = 0
    youngerSiblings: Optional[int] = 0
    parental_marital_status: Optional[str] = None
    # user stats
    score: int = 0
    interactions: int = 0
    streak: PositiveInt = 0
    streak_updated_at: Optional[datetime] = None
    longest_streak: PositiveInt = 0
    last_interaction: Optional[datetime] = None
    last_login: Optional[datetime] = None
    login_history: List[datetime] = []
    sessions: List[Session] = []
    sessions_chat_history: List[ChatMessage] = []
    games: List[Games] = []
    achievements: List[achievementsData] = []
    mood_trends: List[MoodTrend] = []

    # mental health profile
    mental_health_profile: MentalHealthProfile = Field(default_factory=MentalHealthProfile)

    # notifications
    notifications: List[NotificationData] = []
    notifications_enabled: bool = True

    # admin and status flags
    is_active: bool = True
    is_verified: bool = False
    is_superuser: bool = False
    is_edited_by_user: bool = False
    # timestamps
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
    birthdate: Optional[datetime] = None
    olderSiblings: Optional[int] = None
    youngerSiblings: Optional[int] = None
    parental_marital_status: Optional[str] = None
    is_edited_by_user: bool = False
    model_config = ConfigDict(from_attributes=True)
