import fastapi
from fastapi import APIRouter , Depends
from pydantic import BaseModel
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from models.user_model import User, NotificationType, NotificationStatus
from .utils import complete_profile_notification, create_notification, update_notification_as_seen

router = APIRouter(prefix="/notifications", tags=["User Notifications"])

class NotificationRequest(BaseModel):
    type: NotificationType
    notification_name: str
    message: str
    status: NotificationStatus = NotificationStatus.incomplete

class SeenRequest(BaseModel):
    NotificationID: str

@router.get("/")
def get_notifications(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        user = db.users.find_one({"email": current_user.email})
        notifications = user.get("notifications", [])
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Notifications fetched successfully",
            data={"notifications": notifications}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to fetch notifications",
            data={"api": "get_notifications", "error": str(e)}
        )

@router.get("/status")
def get_notifications_status():
    return make_response(
        status_code=HTTP_STATUS["OK"],
        code=HTTP_CODE["OK"],
        message="User Notifications API is working",
        data={}
    )

# working
@router.post("/enable")
def enable_notifications(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"notifications_enabled": True}}
        )
        updated_user = db.users.find_one({"email": current_user.email})
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Notifications enabled successfully",
            data={"notifications_enabled": updated_user["notifications_enabled"]}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to enable notifications",
            data={"api": "enable_notifications", "error": str(e)}
        )

# working
@router.post("/disable")
def disable_notifications(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"notifications_enabled": False}}
        )
        updated_user = db.users.find_one({"email": current_user.email})
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Notifications disabled successfully",
            data={"notifications_disabled": updated_user["notifications_enabled"]}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to disable notifications",
            data={"api": "disable_notifications", "error": str(e)}
        )

@router.post("/add")
def add_notification(
    request: NotificationRequest,
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        notifications = create_notification(
            user=current_user,
            type=request.type,
            notification_name=request.notification_name,
            message=request.message,
            status=request.status
        )
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"notifications": notifications}}
        )
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Notification added successfully",
            data={"notifications": notifications}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to add notification",
            data={"api": "add_notification", "error": str(e)}
        )

@router.post("/clear")
def clear_notifications(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    pass

@router.post("/notifications-seen")
def mark_notifications_as_seen(
    request: SeenRequest,
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        notification_call = update_notification_as_seen(current_user, request.NotificationID)
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"notifications": notification_call}}
        )
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Notification marked as seen successfully",
            data={"notification": notification_call}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to mark notification as seen",
            data={"api": "mark_notifications_as_seen", "error": str(e)}
        )

#working
@router.post("/add_profile_notification")
def add_profile_notification(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        notification_call = complete_profile_notification(current_user)
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"notifications": notification_call}}
        )
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Profile notification added successfully",
            data={"notification": notification_call}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to add profile notification",
            data={"api": "add_profile_notification", "error": str(e)}
        )
