import os
import sys
from fastapi import APIRouter, Depends, HTTPException

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Database.db_connection import get_mongo_db
from models.user_models import UserRegister
from utils.hashing import hash_password
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from utils.response_helper import make_response

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
async def register_user(user: UserRegister, db=Depends(get_mongo_db)):
    try:
        if user.email is None or user.password is None or user.username is None:
            return make_response(
                HTTP_STATUS["BAD_REQUEST"],
                HTTP_CODE["INVALID_INPUT"],
                "Email ,password , username are required",
                {"msg": "Email ,password , username cannot be empty"}
            )
        existing_user = db.users.find_one({"email": user.email})
        existing_user_name = db.users.find_one({"username": user.username})
        if existing_user_name:
            return make_response(
                HTTP_STATUS["CONFLICT"],
                HTTP_CODE["USERNAME_ALREADY_EXISTS"],
                "Username already taken",
                {"msg": "Username already taken"}
            )
        if existing_user:
            return make_response(
                HTTP_STATUS["CONFLICT"],
                HTTP_CODE["USER_ALREADY_EXISTS"],
                "User with this email already exists",
                {"msg": "User with this email already exists"}
            )
        # Registration logic here
        hashed_pwd = hash_password(user.password)
        db.users.insert_one({"email": user.email, "password": hashed_pwd})
        return make_response(data={"msg": "User registered successfully"}, status_code=HTTP_STATUS["CREATED"], code=HTTP_CODE["CREATED"], message="User registered successfully")
    except Exception as e:
        return make_response(
            HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            HTTP_CODE["SERVER_ERROR"],
            "An error occurred during registration",
            {"api": "registration", "error": str(e)}
        )