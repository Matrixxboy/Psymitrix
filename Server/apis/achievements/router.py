from fastapi import APIRouter, Depends
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db
from models.user_model import User

router = APIRouter(prefix="/achievements", tags=["Achievements"])

@router.get("/")
def get_user_achievements(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        user_data = db.users.find_one({"email": current_user.email})
        if user_data:
            achievements = user_data.get("achievements", [])
            return make_response(
                status_code=HTTP_STATUS.OK,
                code=HTTP_CODE["OK"],
                message="User achievements fetched successfully",
                data={"achievements": achievements}
            )
        return make_response(
            status_code=HTTP_STATUS.NOT_FOUND,
            code=HTTP_CODE["NOT_FOUND"],
            message="User not found",
            data={}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS.INTERNAL_SERVER_ERROR,
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to fetch user achievements",
            data={"api": "get_user_achievements", "error": str(e)}
        )

@router.get("/status")
def get_achievements_status():
    return make_response(
        status_code=HTTP_STATUS.OK,
        code=HTTP_CODE["OK"],
        message="Achievements API is working",
        data={}
    )
