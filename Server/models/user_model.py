from pydantic import BaseModel,ConfigDict ,Field
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime

class TestResult(BaseModel):
    test_name: str  # e.g., "PHQ-9", "GAD-7"
    score: int
    # We can add more fields here later, like the full answers
    # full_results: Optional[dict] = None

class Session(BaseModel):
    session_id: UUID = Field(default_factory=uuid4)
    session_date: datetime = Field(default_factory=datetime.utcnow)
    tests: List["TestResult"] = Field(default_factory=list)

    # ✅ Pydantic v2 style config
    model_config = ConfigDict(
        json_encoders={
            UUID: lambda v: str(v),
            datetime: lambda v: v.isoformat()
        },
        from_attributes=True  # replaces orm_mode=True
    )


class User(BaseModel):
    user_id: UUID = Field(default_factory=uuid4)
    email: str
    username: str
    hashed_password: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    middleName: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    bloodgroup: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    occupation: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    olderSiblings: Optional[int] = None
    youngerSiblings: Optional[int] = None
    parental_marital_status: Optional[str] = None
    score: int = 0
    interactions: int = 0
    sessions: List[Session] = []

    class Config:
        json_encoders = {
            UUID: lambda v: str(v),
        }



