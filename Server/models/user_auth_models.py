from pydantic import BaseModel, EmailStr, ConfigDict

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False
    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    model_config = ConfigDict(from_attributes=True)

class TokenData(BaseModel):
    email: str | None = None
    model_config = ConfigDict(from_attributes=True)