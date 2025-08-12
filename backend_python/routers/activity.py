from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId

from models import ActivityCreate, ActivityResponse, UserInDB
from auth import get_current_active_user
from database import get_database

router = APIRouter()

@router.post("/", response_model=dict)
async def create_activity(activity_data: ActivityCreate, current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    activity_doc = {
        "user_id": current_user.id,
        "type": activity_data.type,
        "name": activity_data.name,
        "description": activity_data.description,
        "duration": activity_data.duration,
        "timestamp": activity_data.timestamp,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.activities.insert_one(activity_doc)
    
    return {
        "id": str(result.inserted_id),
        "type": activity_data.type,
        "name": activity_data.name,
        "description": activity_data.description,
        "duration": activity_data.duration,
        "timestamp": activity_data.timestamp,
        "message": "Activity logged successfully"
    }

@router.get("/", response_model=List[ActivityResponse])
async def get_activities(current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    cursor = db.activities.find({"user_id": current_user.id}).sort("timestamp", -1)
    activities = await cursor.to_list(length=None)
    
    return [
        ActivityResponse(
            _id=str(activity["_id"]),
            type=activity["type"],
            name=activity["name"],
            description=activity.get("description"),
            duration=activity.get("duration"),
            timestamp=activity["timestamp"],
            created_at=activity["created_at"]
        )
        for activity in activities
    ]

@router.get("/{activity_id}")
async def get_activity(activity_id: str, current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    try:
        object_id = ObjectId(activity_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid activity ID")
    
    activity = await db.activities.find_one({"_id": object_id, "user_id": current_user.id})
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return ActivityResponse(
        _id=str(activity["_id"]),
        type=activity["type"],
        name=activity["name"],
        description=activity.get("description"),
        duration=activity.get("duration"),
        timestamp=activity["timestamp"],
        created_at=activity["created_at"]
    )

@router.put("/{activity_id}")
async def update_activity(activity_id: str, activity_data: ActivityCreate, current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    try:
        object_id = ObjectId(activity_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid activity ID")
    
    update_doc = {
        "$set": {
            "type": activity_data.type,
            "name": activity_data.name,
            "description": activity_data.description,
            "duration": activity_data.duration,
            "timestamp": activity_data.timestamp,
            "updated_at": datetime.utcnow()
        }
    }
    
    result = await db.activities.update_one({"_id": object_id, "user_id": current_user.id}, update_doc)
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return {"message": "Activity updated successfully"}

@router.delete("/{activity_id}")
async def delete_activity(activity_id: str, current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    try:
        object_id = ObjectId(activity_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid activity ID")
    
    result = await db.activities.delete_one({"_id": object_id, "user_id": current_user.id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return {"message": "Activity deleted successfully"}
