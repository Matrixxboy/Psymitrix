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
                status_code=HTTP_STATUS["BAD_REQUEST"],
                message="Email, password, and username are required",
                data={"msg": "Email, password, and username cannot be empty"},
                code=HTTP_CODE["INVALID_INPUT"]
            )
        existing_user = db.users.find_one({"email": user.email})
        existing_user_name = db.users.find_one({"username": user.username})
        if existing_user_name:
            return make_response(
                status_code=HTTP_STATUS["CONFLICT"],
                message="Username already taken",
                data={"msg": "Username already taken"},
                code=HTTP_CODE["USERNAME_ALREADY_EXISTS"]
            )
        if existing_user:
            return make_response(
                status_code=HTTP_STATUS["CONFLICT"],
                message="User with this email already exists",
                data={"msg": "User with this email already exists"},
                code=HTTP_CODE["USER_ALREADY_EXISTS"]
            )
        # Registration logic here
        hashed_pwd = hash_password(user.password)
        db.users.insert_one({"email": user.email, "password": hashed_pwd, "username": user.username})
        return make_response(status_code=HTTP_STATUS["CREATED"], message="User registered successfully", data={"msg": "User registered successfully"}, code=HTTP_CODE["CREATED"])
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="An error occurred during registration",
            data={"api": "registration", "error": str(e)}
        )