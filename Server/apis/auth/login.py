import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fastapi import APIRouter, Depends, HTTPException
from Database.db_connection import get_mongo_db
from models.user_auth_models import UserLogin
from utils.hashing import verify_password, create_access_token
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from utils.response_helper import make_response

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
async def login_user(user: UserLogin, db=Depends(get_mongo_db)):
    # Login logic here
    try:
        existing_user = db.users.find_one({"email": user.email})
        if not existing_user:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        # Fetch user from DB
        stored_hashed_pwd = existing_user["hashed_password"]
        if not verify_password(user.password, stored_hashed_pwd):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        access_token = create_access_token(data={"sub": user.email})
        data = {
            "access_token": access_token,
            "token_type": "bearer"
        }
        return make_response(data=data, status_code=HTTP_STATUS["OK"], code=HTTP_CODE["OK"], message="Login successful")
    except Exception as e:
        return make_response(
            HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            HTTP_CODE["INTERNAL_SERVER_ERROR"],
            "An error occurred during login",
            {"api": "login", "error": str(e)}
        )