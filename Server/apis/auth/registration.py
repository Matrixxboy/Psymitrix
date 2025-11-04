import os
import sys
from fastapi import APIRouter, Depends, HTTPException
from bson.binary import Binary

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Database.db_connection import get_mongo_db
from models.user_auth_models import UserRegister
from models.user_model import User
from utils.hashing import hash_password
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from utils.response_helper import make_response

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
async def register_user(user_data: UserRegister, db=Depends(get_mongo_db)):
    try:
        if user_data.email is None or user_data.password is None or user_data.username is None:
            return make_response(
                status_code=HTTP_STATUS["BAD_REQUEST"],
                message="Email, password, and username are required",
                data={"msg": "Email, password, and username cannot be empty"},
                code=HTTP_CODE["INVALID_INPUT"]
            )
        existing_user = db.users.find_one({"email": user_data.email})
        existing_user_name = db.users.find_one({"username": user_data.username})
        if existing_user:
            return make_response(
                status_code=HTTP_STATUS["USER_ALREADY_EXISTS"],
                message="email already registered",
                data={"msg": "Some other user is registered with this email"},
                code=HTTP_CODE["USER_ALREADY_EXISTS"]
            )
        
        if existing_user_name:
            return make_response(
                status_code=HTTP_STATUS["USERNAME_ALREADY_EXISTS"],
                message="Username already taken",
                data={"msg": "Username already taken"},
                code=HTTP_CODE["USERNAME_ALREADY_EXISTS"]
            )
        hashed_pwd = hash_password(user_data.password)
        
        # Create a new user with default values
        new_user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_pwd
        )
        
        user_dict = new_user.dict()
        user_dict["user_id"] = Binary.from_uuid(new_user.user_id)
        db.users.insert_one(user_dict)
        
        return make_response(
            status_code=HTTP_STATUS["CREATED"], 
            message="User registered successfully", 
            data={"msg": "User registered successfully", "user_id": str(new_user.user_id)}, 
            code=HTTP_CODE["CREATED"]
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="An error occurred during registration",
            data={"api": "registration", "error": str(e)}
        )