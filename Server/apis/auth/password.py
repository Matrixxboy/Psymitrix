from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from Database.db_connection import get_mongo_db
from models.user_model import User
from utils.hashing import verify_password, hash_password
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from utils.response_helper import make_response
from apis.auth.authentication import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    db=Depends(get_mongo_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Verify current password
        if not verify_password(request.current_password, current_user.hashed_password):
            return make_response(
                status_code=HTTP_STATUS.BAD_REQUEST,
                code=HTTP_CODE["INVALID_INPUT"],
                message="Incorrect current password",
                data={}
            )

        # Hash new password
        hashed_new_password = hash_password(request.new_password)

        # Update password in the database
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"hashed_password": hashed_new_password}}
        )

        return make_response(
            status_code=HTTP_STATUS.OK,
            code=HTTP_CODE["OK"],
            message="Password changed successfully",
            data={}
        )
    except Exception as e:
        return make_response(
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="An error occurred while changing password",
            data={"api": "change-password", "error": str(e)}
        )
