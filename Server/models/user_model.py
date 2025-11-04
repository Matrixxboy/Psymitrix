from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID, uuid4

class User(BaseModel):
    user_id: UUID = Field(default_factory=uuid4)
    email: str
    username: str
    hashed_password: str
    age: Optional[int] = None
    gender: Optional[str] = None
    bloodgroup: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    occupation: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    score: int = 0
    interactions: int = 0
    tests_taken: List[str] = []

