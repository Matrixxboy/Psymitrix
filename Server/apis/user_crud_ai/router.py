from fastapi import APIRouter, Depends
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from models.user_model import User, UserUpdate, SleepData, WellnessMetric
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db
from apis.database_connection.cleanup import cleanup_user_chromadb_collection
import json 
from datetime import datetime

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
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Current user fetched successfully",
            data=json.loads(current_user.model_dump_json())
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to fetch current user",
            data={"api": "read_current_user", "error": str(e)}
        )


@router.put("/user/update", response_model=User)
async def update_user_data(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Updates one or more fields for the currently authenticated user,
    preserving existing datatypes and safely formatting strings.
    """
    try:
        # Extract provided fields only
        update_data = user_update.model_dump(exclude_unset=True)
        
        if not update_data:
            return make_response(
                status_code=HTTP_STATUS["BAD_REQUEST"],
                code=HTTP_CODE["BAD_REQUEST"],
                message="No update data provided",
                data={}
            )

        # Fetch the existing user to preserve field data types
        existing_user = db.users.find_one({"email": current_user.email})
        if not existing_user:
            return make_response(
                status_code=HTTP_STATUS["NOT_FOUND"],
                code=HTTP_CODE["NOT_FOUND"],
                message="User not found",
                data={}
            )

        LOWERCASE_FIELDS = {"email", "gender", "bloodgroup", "parental_marital_status", "occupation", "firstName", "lastName", "middleName"}  # only lowercase these safely

        update_fields = {}
        for k, v in update_data.items():
            if v is None:
                continue  # skip nulls or empty

            existing_value = existing_user.get(k)

            # Preserve type based on current DB field
            if isinstance(existing_value, int):
                try:
                    v = int(v)
                except (ValueError, TypeError):
                    pass

            elif isinstance(existing_value, float):
                try:
                    v = float(v)
                except (ValueError, TypeError):
                    pass

            elif isinstance(existing_value, bool):
                if isinstance(v, str):
                    v = v.lower() in {"true", "1", "yes", "on"}

            elif isinstance(v, str):
                v = v.strip()
                if k in LOWERCASE_FIELDS:
                    v = v.lower()

            update_fields[k] = v

        # Mark that user has edited their data
        update_fields["is_edited_by_user"] = True

        # ✅ Perform the update
        db.users.update_one({"email": current_user.email}, {"$set": update_fields})

        # Fetch updated data
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

import os
import shutil
from fastapi import UploadFile, File, HTTPException
from PIL import Image # Import Image from Pillow
from io import BytesIO # Import BytesIO

UPLOAD_DIRECTORY = "public/profile_pictures"

@router.post("/user/profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Uploads a profile picture for the currently authenticated user.
    Converts the uploaded image to PNG format.
    """
    try:
        # Ensure upload directory exists
        os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

        # Read the uploaded file content
        file_content = await file.read()
        
        # Open the image using Pillow
        image = Image.open(BytesIO(file_content))
        
        # Convert to RGB if necessary (e.g., for PNGs with alpha channel)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")

        # Generate a unique filename using user_id and .png extension
        filename = f"{current_user.user_id}.png"
        file_path = os.path.join(UPLOAD_DIRECTORY, filename)

        # Save the image as PNG
        image.save(file_path, "PNG")

        # Construct the URL for the profile picture
        profile_picture_url = f"/profile_pictures/{filename}"

        # Update user's profile_picture_url in the database
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"profile_picture_url": profile_picture_url}}
        )

        # Fetch updated user data to return
        updated_user_data = db.users.find_one({"email": current_user.email})
        updated_user = User(**updated_user_data)

        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Profile picture uploaded successfully",
            data={"profile_picture_url": updated_user.profile_picture_url}
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to upload profile picture",
            data={"api": "upload_profile_picture", "error": str(e)}
        )

@router.post("/user/wellness/sleep")
async def add_sleep_data(
    sleep_data: SleepData,
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Adds sleep data to the current user's wellness metrics.
    """
    try:
        # Fetch the existing user
        existing_user_data = db.users.find_one({"email": current_user.email})
        if not existing_user_data:
            return make_response(
                status_code=HTTP_STATUS["NOT_FOUND"],
                code=HTTP_CODE["NOT_FOUND"],
                message="User not found",
                data={}
            )
        
        # Convert existing user data to User model to ensure proper structure
        existing_user = User(**existing_user_data)

        # Create a new WellnessMetric object for sleep
        new_wellness_metric = WellnessMetric(
            date=sleep_data.date,
            sleep_hours=sleep_data.sleep_hours
        )

        # Append the new metric to the wellness_metrics list
        existing_user.mental_health_profile.wellness_metrics.append(new_wellness_metric)

        # Update the user in the database
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"mental_health_profile.wellness_metrics": [wm.model_dump() for wm in existing_user.mental_health_profile.wellness_metrics]}}
        )

        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Sleep data added successfully",
            data={"sleep_hours": sleep_data.sleep_hours, "date": sleep_data.date.isoformat()}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to add sleep data",
            data={"api": "add_sleep_data", "error": str(e)}
        )

@router.delete("/user/delete")
async def delete_user(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Deletes the currently authenticated user's account and all associated data.
    """
    try:
        user_id = str(current_user.user_id)
        
        # Delete user from MongoDB
        delete_result = db.users.delete_one({"email": current_user.email})
        
        if delete_result.deleted_count == 0:
            return make_response(
                status_code=HTTP_STATUS["NOT_FOUND"],
                code=HTTP_CODE["NOT_FOUND"],
                message="User not found for deletion",
                data={}
            )
            
        # Cleanup ChromaDB data
        cleanup_user_chromadb_collection(user_id)
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="User account deleted successfully",
            data={}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to delete user account",
            data={"api": "delete_user", "error": str(e)}
        )