from pydantic import BaseModel, ConfigDict, Field, EmailStr
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum

class AdminRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MODERATOR = "moderator"

class AdminPermission(str, Enum):
    MANAGE_USERS = "manage_users"
    MANAGE_CONTENT = "manage_content"
    MANAGE_VECTOR_DB = "manage_vector_db"
    VIEW_ANALYTICS = "view_analytics"
    MANAGE_ADMINS = "manage_admins"
    ALL = "all"

class Admin(BaseModel):
    admin_id: UUID = Field(default_factory=uuid4)
    user_type:str="admin"
    email: EmailStr
    username: str
    hashed_password: str
    role: AdminRole = AdminRole.ADMIN
    permissions: List[AdminPermission] = Field(default_factory=list)
    
    # Profile Info
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Status
    is_active: bool = True
    is_verified: bool = False
    
    # Security
    last_login: Optional[datetime] = None
    login_history: List[datetime] = Field(default_factory=list)
    failed_login_attempts: int = 0
    last_failed_login: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[UUID] = None  # Admin who created this admin
    
    model_config = ConfigDict(
        json_encoders={
            UUID: lambda v: str(v),
            datetime: lambda v: v.isoformat(),
            AdminRole: lambda v: v.value,
            AdminPermission: lambda v: v.value,
        },
        from_attributes=True
    )

class AdminCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: AdminRole = AdminRole.ADMIN
    permissions: List[AdminPermission] = Field(default_factory=list)
    
    model_config = ConfigDict(from_attributes=True)

class AdminUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[AdminRole] = None
    permissions: Optional[List[AdminPermission]] = None
    is_active: Optional[bool] = None
    
    model_config = ConfigDict(from_attributes=True)

class AdminLogin(BaseModel):
    email: EmailStr
    password: str
    
    model_config = ConfigDict(from_attributes=True)

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str
    admin: dict
    
    model_config = ConfigDict(from_attributes=True)
