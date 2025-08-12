from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel

from models import UserInDB
from auth import get_current_active_user
from database import get_database

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    id: str
    user_id: str
    session_id: str
    message: str
    response: str
    timestamp: datetime

@router.post("/")
async def send_message(chat_data: ChatMessage, current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    # For now, we'll create a simple echo response
    # In a real implementation, this would integrate with an AI service
    ai_response = f"I understand you're saying: {chat_data.message}. How can I help you with that?"
    
    # Create or get session
    session_id = chat_data.session_id
    if not session_id:
        # Create new chat session
        session_doc = {
            "user_id": current_user.id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "title": f"Chat started at {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"
        }
        session_result = await db.chat_sessions.insert_one(session_doc)
        session_id = str(session_result.inserted_id)
    
    # Store the chat message
    chat_doc = {
        "user_id": current_user.id,
        "session_id": ObjectId(session_id),
        "message": chat_data.message,
        "response": ai_response,
        "timestamp": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.chats.insert_one(chat_doc)
    
    return {
        "id": str(result.inserted_id),
        "user_id": str(current_user.id),
        "session_id": session_id,
        "message": chat_data.message,
        "response": ai_response,
        "timestamp": chat_doc["timestamp"]
    }

@router.get("/sessions")
async def get_chat_sessions(current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    cursor = db.chat_sessions.find({"user_id": current_user.id}).sort("created_at", -1)
    sessions = await cursor.to_list(length=None)
    
    return [
        {
            "id": str(session["_id"]),
            "title": session.get("title", "Chat Session"),
            "created_at": session["created_at"],
            "updated_at": session["updated_at"]
        }
        for session in sessions
    ]

@router.get("/sessions/{session_id}")
async def get_chat_history(session_id: str, current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    try:
        object_id = ObjectId(session_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    # Verify session belongs to user
    session = await db.chat_sessions.find_one({"_id": object_id, "user_id": current_user.id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get chat messages for this session
    cursor = db.chats.find({"session_id": object_id}).sort("timestamp", 1)
    messages = await cursor.to_list(length=None)
    
    return {
        "session": {
            "id": str(session["_id"]),
            "title": session.get("title", "Chat Session"),
            "created_at": session["created_at"]
        },
        "messages": [
            {
                "id": str(msg["_id"]),
                "message": msg["message"],
                "response": msg["response"],
                "timestamp": msg["timestamp"]
            }
            for msg in messages
        ]
    }

@router.delete("/sessions/{session_id}")
async def delete_chat_session(session_id: str, current_user: UserInDB = Depends(get_current_active_user)):
    db = await get_database()
    
    try:
        object_id = ObjectId(session_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    # Delete session and associated messages
    session_result = await db.chat_sessions.delete_one({"_id": object_id, "user_id": current_user.id})
    await db.chats.delete_many({"session_id": object_id})
    
    if session_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {"message": "Chat session deleted successfully"}
