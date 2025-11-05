from fastapi import APIRouter, Depends
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from models.user_model import User, UserUpdate
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db

router = APIRouter(prefix="/user_crud", tags=["User CRUD+AI"])

@router.get("/user/status")
def get_user_status():
    return make_response(
        status_code=HTTP_STATUS["OK"],
        code=HTTP_CODE["OK"],
        message="User CRUD+AI API is working",
        data={}
    )

@router.get("/user/me", response_model=User)
async def read_current_user(current_user: User = Depends(get_current_user)):
    """
    Fetches the complete data for the currently authenticated user.
    """
    try:
        # The `current_user` object is already a Pydantic model.
        # FastAPI will automatically handle the JSON serialization, including the sessions.
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Current user fetched successfully",
            data=current_user.model_dump_json()
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to fetch current user",
            data={"api": "read_current_user", "error": str(e)}
        )
        
@router.put("/user/update", response_model=User)
async def update_user_data(user_update: UserUpdate, current_user: User = Depends(get_current_user), db=Depends(get_mongo_db)):
    """
    Updates one or more fields for the currently authenticated user.
    """
    try:
        # Get the update data, excluding any fields that were not set in the request
        update_data = user_update.model_dump(exclude_unset=True)
        
        if not update_data:
            return make_response(
                status_code=HTTP_STATUS["BAD_REQUEST"],
                code=HTTP_CODE["BAD_REQUEST"],
                message="No update data provided",
                data={}
            )

        # Update the user in the database
        db.users.update_one(
            {"email": current_user.email},
            {"$set": update_data}
        )

        # Fetch the updated user from the database
        updated_user = db.users.find_one({"email": current_user.email})

        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="User data updated successfully",
            data=User(**updated_user).model_dump_json()
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to update user data",
            data={"api": "update_user_data", "error": str(e)}
        )