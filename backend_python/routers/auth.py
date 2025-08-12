from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timedelta
from bson import ObjectId

from models import RegisterRequest, LoginRequest, Token, UserResponse, UserCreate, User, UserInDB, SessionCreate
from auth import authenticate_user, create_access_token, get_password_hash, get_current_active_user, get_user_by_email
from database import get_database

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(user_data: RegisterRequest):
    db = await get_database()
    
    # Check if user already exists
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already in use."
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user document
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert user
    result = await db.users.insert_one(user_doc)
    
    # Return response
    return {
        "user": {
            "_id": str(result.inserted_id),
            "name": user_data.name,
            "email": user_data.email
        },
        "message": "User registered successfully."
    }

@router.post("/login", response_model=dict)
async def login(login_data: LoginRequest):
    db = await get_database()
    
    # Authenticate user
    user = await authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    
    # Create access token
    access_token_expires = timedelta(hours=24)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    # Create session
    expires_at = datetime.utcnow() + access_token_expires
    session_doc = {
        "user_id": user.id,
        "token": access_token,
        "expires_at": expires_at,
        "device_info": None,  # You can get this from request headers
        "last_active": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.sessions.insert_one(session_doc)
    
    return {
        "user": {
            "_id": str(user.id),
            "name": user.name,
            "email": user.email
        },
        "token": access_token,
        "message": "Login successful"
    }

@router.post("/logout")
async def logout(current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    # Here you would typically invalidate the token
    # For now, we'll just delete sessions for this user
    await db.sessions.delete_many({"user_id": current_user.id})
    
    return {"message": "Logged out successfully"}

@router.get("/me")
async def get_current_user_info(current_user: UserInDB = Depends(get_current_active_user)):
    return {
        "user": {
            "_id": str(current_user.id),
            "name": current_user.name,
            "email": current_user.email
        }
    }
