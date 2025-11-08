from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from models.user_model import User, ChatMessage
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db
from .ai_service import get_ai_response, initialize_vector_store
import json

router = APIRouter(prefix="/ai_chat", tags=["AI Chat"])

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    message_id: str
    user_message: str
    ai_response: str
    timestamp: str
    analysis: Optional[dict] = None

@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Send a message to the AI psychiatrist and get a contextual response
    """
    try:
        # Initialize vector store with user's mental health context
        user_context = {
            "user_id": str(current_user.user_id),
            "mental_health_history": current_user.mental_health_profile.mental_health_history or "Not specified",
            "recent_mood": current_user.mood_trends[-1].mood if current_user.mood_trends else "Not recorded",
            "age": current_user.age,
            "gender": current_user.gender,
            "occupation": current_user.occupation,
            "recent_assessments": [
                {
                    "type": a.assessment_type,
                    "score": a.score,
                    "severity": a.severity_level,
                    "date": a.date.isoformat()
                }
                for a in current_user.mental_health_profile.assessment_results[-3:]
            ]
        }
        
        # Get AI response with context
        ai_response, analysis = await get_ai_response(
            user_message=request.message,
            user_context=user_context,
            conversation_history=[
                {"role": msg.sender, "content": msg.message}
                for msg in current_user.sessions_chat_history[-10:]
            ]
        )
        
        # Create chat message objects
        user_msg = ChatMessage(
            sender="user",
            message=request.message,
            timestamp=datetime.utcnow()
        )
        
        ai_msg = ChatMessage(
            sender="bot",
            message=ai_response,
            timestamp=datetime.utcnow()
        )
        
        # Save to database
        current_user.sessions_chat_history.append(user_msg)
        current_user.sessions_chat_history.append(ai_msg)
        current_user.interactions += 1
        current_user.updated_at = datetime.utcnow()
        
        db.users.update_one(
            {"email": current_user.email},
            {
                "$set": {
                    "sessions_chat_history": [
                        json.loads(msg.model_dump_json())
                        for msg in current_user.sessions_chat_history
                    ],
                    "interactions": current_user.interactions,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return ChatResponse(
            message_id=str(ai_msg.message_id),
            user_message=request.message,
            ai_response=ai_response,
            timestamp=ai_msg.timestamp.isoformat(),
            analysis=analysis
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing message: {str(e)}"
        )

@router.get("/history")
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    limit: int = 50
):
    """
    Retrieve chat history for the current user
    """
    try:
        chat_history = [
            {
                "message_id": str(msg.message_id),
                "sender": msg.sender,
                "message": msg.message,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in current_user.sessions_chat_history[-limit:]
        ]
        
        return {
            "status_code": 200,
            "code": "OK",
            "message": "Chat history retrieved successfully",
            "data": {"messages": chat_history}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/history")
async def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Clear chat history for the current user
    """
    try:
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"sessions_chat_history": []}}
        )
        
        return {
            "status_code": 200,
            "code": "OK",
            "message": "Chat history cleared successfully",
            "data": {}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
