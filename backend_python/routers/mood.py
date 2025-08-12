from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId

from models import MoodCreate, MoodResponse, UserInDB
from auth import get_current_active_user
from database import get_database

router = APIRouter()

@router.post("/", response_model=dict)
async def create_mood(mood_data: MoodCreate, current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    mood_doc = {
        "user_id": current_user.id,
        "score": mood_data.score,
        "note": mood_data.note,
        "timestamp": mood_data.timestamp,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.moods.insert_one(mood_doc)
    
    return {
        "id": str(result.inserted_id),
        "score": mood_data.score,
        "note": mood_data.note,
        "timestamp": mood_data.timestamp,
        "message": "Mood logged successfully"
    }

@router.get("/", response_model=List[MoodResponse])
async def get_moods(current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    cursor = db.moods.find({"user_id": current_user.id}).sort("timestamp", -1)
    moods = await cursor.to_list(length=None)
    
    return [
        MoodResponse(
            _id=str(mood["_id"]),
            score=mood["score"],
            note=mood.get("note"),
            timestamp=mood["timestamp"],
            created_at=mood["created_at"]
        )
        for mood in moods
    ]

@router.get("/latest")
async def get_latest_mood(current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    mood = await db.moods.find_one(
        {"user_id": current_user.id},
        sort=[("timestamp", -1)]
    )
    
    if not mood:
        return {"message": "No mood entries found"}
    
    return {
        "id": str(mood["_id"]),
        "score": mood["score"],
        "note": mood.get("note"),
        "timestamp": mood["timestamp"]
    }

@router.delete("/{mood_id}")
async def delete_mood(mood_id: str, current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    try:
        object_id = ObjectId(mood_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid mood ID")
    
    result = await db.moods.delete_one({"_id": object_id, "user_id": current_user.id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Mood not found")
    
    return {"message": "Mood deleted successfully"}
