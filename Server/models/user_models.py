from pydantic import BaseModel

class UserRegister(BaseModel):
    email: str
    password: str
    username: str
