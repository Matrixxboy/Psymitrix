from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from enum import Enum

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class ActivityType(str, Enum):
    MEDITATION = "meditation"
    EXERCISE = "exercise"
    WALKING = "walking"
    READING = "reading"
    JOURNALING = "journaling"
    THERAPY = "therapy"

# User Models
class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class User(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserInDB(User):
    password: str

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    
    class Config:
        allow_population_by_field_name = True

# Session Models
class SessionBase(BaseModel):
    user_id: PyObjectId
    token: str
    expires_at: datetime
    device_info: Optional[str] = None
    last_active: datetime = Field(default_factory=datetime.utcnow)

class SessionCreate(SessionBase):
    pass

class Session(SessionBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Mood Models
class MoodBase(BaseModel):
    score: int = Field(..., ge=0, le=100)
    note: Optional[str] = Field(None, max_length=500)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MoodCreate(MoodBase):
    pass

class Mood(MoodBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class MoodResponse(BaseModel):
    id: str = Field(alias="_id")
    score: int
    note: Optional[str]
    timestamp: datetime
    created_at: datetime
    
    class Config:
        allow_population_by_field_name = True

# Activity Models
class ActivityBase(BaseModel):
    type: ActivityType
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    duration: Optional[int] = Field(None, ge=0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ActivityResponse(BaseModel):
    id: str = Field(alias="_id")
    type: str
    name: str
    description: Optional[str]
    duration: Optional[int]
    timestamp: datetime
    created_at: datetime
    
    class Config:
        allow_population_by_field_name = True

# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
