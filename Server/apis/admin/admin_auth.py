from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from pydantic import EmailStr
from models.admin_model import Admin, AdminRole
from Database.db_connection import get_mongo_db
from utils.hashing import hash_password, verify_password
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from dotenv import load_dotenv
import os

load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer()

def create_access_token(admin_id: str, expires_delta: Optional[timedelta] = None):
    """Create JWT access token for admin"""
    if expires_delta is None:
        expires_delta = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    
    expire = datetime.utcnow() + expires_delta
    to_encode = {
        "admin_id": admin_id,
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "admin"
    }
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id: str = payload.get("admin_id")
        token_type: str = payload.get("type")
        
        if admin_id is None or token_type != "admin":
            return None
        
        return admin_id
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None

async def get_current_admin(
    credentials: HTTPAuthCredentials = Depends(security),
    db = Depends(get_mongo_db)
) -> Admin:
    """Get current authenticated admin"""
    token = credentials.credentials
    admin_id = verify_token(token)
    
    if admin_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        admins_collection = db["admins"]
        from bson import ObjectId
        try:
            admin_data = admins_collection.find_one({"admin_id": admin_id})
        except:
            admin_data = admins_collection.find_one({"_id": ObjectId(admin_id)})
        
        if admin_data is None:
            raise HTTPException(status_code=404, detail="Admin not found")
        
        # Check if admin is active
        if not admin_data.get("is_active", False):
            raise HTTPException(status_code=403, detail="Admin account is inactive")
        
        return Admin(**admin_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def admin_login(
    email: EmailStr,
    password: str,
    db = Depends(get_mongo_db)
) -> tuple:
    """Authenticate admin and return token"""
    try:
        admins_collection = db["admins"]
        admin_data = admins_collection.find_one({"email": email.lower()})
        
        if not admin_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not verify_password(password, admin_data.get("hashed_password", "")):
            # Update failed login attempts
            admins_collection.update_one(
                {"email": email.lower()},
                {
                    "$inc": {"failed_login_attempts": 1},
                    "$set": {"last_failed_login": datetime.utcnow()}
                }
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not admin_data.get("is_active", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin account is inactive"
            )
        
        # Reset failed login attempts and update last login
        admin_id = str(admin_data.get("admin_id"))
        admins_collection.update_one(
            {"email": email.lower()},
            {
                "$set": {
                    "last_login": datetime.utcnow(),
                    "failed_login_attempts": 0
                },
                "$push": {"login_history": datetime.utcnow()}
            }
        )
        
        # Create access token
        access_token = create_access_token(admin_id)
        
        return access_token, Admin(**admin_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def create_admin(
    admin_data: dict,
    db = Depends(get_mongo_db),
    current_admin: Admin = Depends(get_current_admin)
) -> Admin:
    """Create a new admin (requires SUPER_ADMIN role)"""
    
    # Check permissions
    if current_admin.role != AdminRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Super Admins can create new admins"
        )
    
    try:
        admins_collection = db["admins"]
        
        # Check if email already exists
        existing = admins_collection.find_one({"email": admin_data["email"].lower()})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_pwd = hash_password(admin_data["password"])
        
        new_admin = {
            "admin_id": str(Admin().admin_id),
            "email": admin_data["email"].lower(),
            "username": admin_data.get("username", admin_data["email"].split("@")[0]),
            "hashed_password": hashed_pwd,
            "role": admin_data.get("role", "admin"),
            "permissions": admin_data.get("permissions", []),
            "first_name": admin_data.get("first_name"),
            "last_name": admin_data.get("last_name"),
            "is_active": True,
            "is_verified": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": str(current_admin.admin_id),
            "login_history": [],
            "failed_login_attempts": 0
        }
        
        result = admins_collection.insert_one(new_admin)
        new_admin["_id"] = result.inserted_id
        
        return Admin(**new_admin)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
