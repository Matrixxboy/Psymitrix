import fastapi
from fastapi import APIRouter , Depends
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from models.user_model import User
from notifications.utils import complete_profile_notification
# from datetime import datetime
# from typing import List


router = APIRouter(prefix="/notifications", tags=["User Notifications"])

@router.get("/status")
def get_notifications_status():
    return make_response(
        status_code=HTTP_STATUS["OK"],
        code=HTTP_CODE["OK"],
        message="User Notifications API is working",
        data={}
    )

@router.post("/enable")
def enable_notifications(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        # Enable notifications for the user
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"notifications_enabled": True}}
        )
        # Fetch the updated user data
        updated_user = db.users.find_one({"email": current_user.email})
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Notifications enabled successfully",
            data={"user": updated_user}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to enable notifications",
            data={"api": "enable_notifications", "error": str(e)}
        )

@router.post("/disable")
def disable_notifications(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        # Disable notifications for the user
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"notifications_enabled": False}}
        )
        # Fetch the updated user data
        updated_user = db.users.find_one({"email": current_user.email})
       
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Notifications disabled successfully",
            data={"user": updated_user}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to enable notifications",
            data={"api": "enable_notifications", "error": str(e)}
        )
    

@router.post("/add")
def add_notification(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        # Add a sample notification to the user's notifications list
        notification_call = complete_profile_notification(current_user)
        # Update the user in the database
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"notifications": notification_call}}
        )

        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Notification added successfully",
            data={"notification": notification_call}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to add notification",
            data={"api": "add_notification", "error": str(e)}
        )
    
@router.get("/get")
def get_notifications(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    pass

@router.post("/clear")
def clear_notifications(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    
    pass