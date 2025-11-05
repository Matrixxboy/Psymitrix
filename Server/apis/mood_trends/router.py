from fastapi import APIRouter, Depends, Query
from fastapi.encoders import jsonable_encoder
from Database.db_connection import get_mongo_db
from models.user_model import User, MoodTrend
from apis.auth.authentication import get_current_user
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from datetime import datetime, timedelta
from typing import List

router = APIRouter(prefix="/mood_trends", tags=["Mood Trends"])

@router.post("/store")
async def create_mood_trend(mood_trend: MoodTrend, current_user: User = Depends(get_current_user), db = Depends(get_mongo_db)):
    try:
        encoded_mood_trend = jsonable_encoder(mood_trend)
        db.users.update_one(
            {"email": current_user.email},
            {"$push": {"mood_trends": encoded_mood_trend}}
        )

        return make_response(
            status_code=HTTP_STATUS.CREATED,
            code=HTTP_CODE["CREATED"],
            message="Mood trend created successfully",
            data=jsonable_encoder(mood_trend)
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS.INTERNAL_SERVER_ERROR,
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to create mood trend",
            data={"error": str(e)},
        )

@router.get("/", response_model=List[MoodTrend])
async def get_mood_trends(
    current_user: User = Depends(get_current_user),
    timeframe: str = Query("week", enum=["week", "month", "year"])
):
    """
    Retrieves mood trends for the current user based on the specified timeframe.
    """
    try:
        now = datetime.utcnow()
        if timeframe == "week":
            start_date = now - timedelta(days=7)
        elif timeframe == "month":
            start_date = now - timedelta(days=30)
        elif timeframe == "year":
            start_date = now - timedelta(days=365)
        else:
            start_date = now - timedelta(days=7)

        mood_trends = [
            MoodTrend(**trend)
            for trend in current_user.mood_trends
            if trend["created_at"] >= start_date
        ]

        return make_response(
            status_code=HTTP_STATUS.OK,
            code=HTTP_CODE["OK"],
            message="Mood trends fetched successfully",
            data=jsonable_encoder(mood_trends)
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS.INTERNAL_SERVER_ERROR,
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to fetch mood trends",
            data={"api": "get_mood_trends", "error": str(e)}
        )
