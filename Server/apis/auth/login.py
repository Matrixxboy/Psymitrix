from fastapi import APIRouter, Depends
from Database.db_connection import get_mongo_db
from models.user_auth_models import UserLogin
from models.user_model import User
from utils.hashing import verify_password, create_access_token
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from utils.response_helper import make_response
from datetime import datetime, timedelta
from apis.achievements.utils import check_and_add_first_login_achievement

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
async def login_user(user: UserLogin, db=Depends(get_mongo_db)):
    # Login logic here
    try:
        existing_user_data = db.users.find_one({"email": user.email})
        if not existing_user_data:
            return make_response(
                status_code=HTTP_STATUS.BAD_REQUEST,
                code=HTTP_CODE["INVALID_INPUT"],
                message="Invalid credentials",
                data={}
            )
        # Fetch user from DB
        stored_hashed_pwd = existing_user_data["hashed_password"]
        if not verify_password(user.password, stored_hashed_pwd):
            return make_response(
                status_code=HTTP_STATUS.BAD_REQUEST,
                code=HTTP_CODE["INVALID_INPUT"],
                message="Invalid credentials",
                data={}
            )

        if "achievements" not in existing_user_data:
            existing_user_data["achievements"] = []

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

        # Check and add achievements
        check_and_add_first_login_achievement(existing_user)

        existing_user.last_login = now
        if not existing_user.login_history:
            existing_user.login_history = []
        existing_user.login_history.append(now)

        update_data = existing_user.model_dump(exclude_unset=True)
        update_data["achievements"] = [ach.model_dump() for ach in existing_user.achievements]

        db.users.update_one(
            {"email": existing_user.email},
            {"$set": update_data}
        )

        access_token = create_access_token(data={"sub": user.email})
        data = {
            "access_token": access_token,
            "token_type": "bearer"
        }
        return make_response(data=data, status_code=HTTP_STATUS.OK, code=HTTP_CODE["OK"], message="Login successful")
    except Exception as e:
        return make_response(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="An error occurred during login",
            data={"api": "login", "error": str(e)}
        )