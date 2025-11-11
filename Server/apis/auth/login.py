from fastapi import APIRouter, Depends
from Database.db_connection import get_mongo_db
from models.user_auth_models import UserLogin
from models.user_model import User
from utils.hashing import verify_password, create_access_token
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from utils.response_helper import make_response
from datetime import datetime, timedelta
from apis.notifications.utils import check_and_add_notifications

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
async def login_user(user: UserLogin, db=Depends(get_mongo_db)):
    try:
        existing_user_data = db.users.find_one({"email": user.email})
        if not existing_user_data:
            return make_response(
                status_code=HTTP_STATUS.BAD_REQUEST,
                code=HTTP_CODE["INVALID_INPUT"],
                message="Invalid credentials",
                data={}
            )
        
        stored_hashed_pwd = existing_user_data["hashed_password"]
        if not verify_password(user.password, stored_hashed_pwd):
            return make_response(
                status_code=HTTP_STATUS.BAD_REQUEST,
                code=HTTP_CODE["INVALID_INPUT"],
                message="Invalid credentials",
                data={}
            )

        # Initialize missing fields
        if "achievements" not in existing_user_data:
            existing_user_data["achievements"] = []
        if "notifications" not in existing_user_data:
            existing_user_data["notifications"] = []

        existing_user = User(**existing_user_data)

        now = datetime.utcnow()
        today = now.date()

        # Streak logic
        if existing_user.last_login:
            last_login_date = existing_user.last_login.date()
            if last_login_date < today:
                if last_login_date == today - timedelta(days=1):
                    existing_user.streak += 1
                else:
                    existing_user.streak = 1
                existing_user.longest_streak = max(existing_user.longest_streak, existing_user.streak)
                existing_user.streak_updated_at = now
        else:
            existing_user.streak = 1
            existing_user.longest_streak = 1
            existing_user.streak_updated_at = now
        
        existing_user.last_login = now
        if not existing_user.login_history:
            existing_user.login_history = []
        existing_user.login_history.append(now)

        # Check for achievements and other notifications
        check_and_add_notifications(existing_user)

        # Prepare data for DB update
        update_data = {
            "last_login": existing_user.last_login,
            "login_history": existing_user.login_history,
            "streak": existing_user.streak,
            "longest_streak": existing_user.longest_streak,
            "streak_updated_at": existing_user.streak_updated_at,
            "achievements": [ach.model_dump() for ach in existing_user.achievements],
            "notifications": [notif.model_dump() for notif in existing_user.notifications]
        }

        db.users.update_one(
            {"email": existing_user.email},
            {"$set": update_data}
        )

        access_token = create_access_token(data={"sub": user.email})
        return make_response(
            data={"access_token": access_token, "token_type": "bearer"},
            status_code=HTTP_STATUS.OK,
            code=HTTP_CODE["OK"],
            message="Login successful"
        )
    except Exception as e:
        return make_response(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="An error occurred during login",
            data={"api": "login", "error": str(e)}
        )