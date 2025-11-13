from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from models.user_model import User, ChatMessage
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db
from .ai_service import get_ai_response
import json
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE

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
    Handle user → AI psychiatrist messages.
    Optimized for speed, safety, and low database overhead.
    """
    print("SEND_MESSAGE ENDPOINT CALLED")

    try:
        user_id = str(current_user.user_id)

        # ============================
        # BUILD USER CONTEXT
        # ============================
        assessments = current_user.mental_health_profile.assessment_results[-3:]
        assessments_data = [
            {
                "type": a.assessment_type,
                "score": a.score,
                "severity": a.severity_level,
                "date": a.date.isoformat()
            }
            for a in assessments
        ]

        user_context = {
            "user_id": user_id,
            "mental_health_history": current_user.mental_health_profile.mental_health_history or "Not specified",
            "recent_mood": current_user.mood_trends[-1].mood if current_user.mood_trends else "Not recorded",
            "age": current_user.age,
            "gender": current_user.gender,
            "occupation": current_user.occupation,
            "recent_assessments": assessments_data
        }

        # ============================
        # PREPARE SHORT CHAT HISTORY
        # ============================
        recent_history = [
            {"role": msg.sender, "content": msg.message}
            for msg in current_user.sessions_chat_history[-10:]
        ]

        # ============================
        # GET AI RESPONSE
        # ============================
        ai_response, analysis = await get_ai_response(
            user_id=user_id,
            user_message=request.message,
            user_context=user_context,
            conversation_history=recent_history
        )
        print(ai_response)
        # ============================
        # UPDATE SESSION HISTORY (in RAM)
        # ============================
        timestamp = datetime.utcnow()

        user_msg = ChatMessage(
            sender="user",
            message=request.message,
            timestamp=timestamp
        )

        ai_msg = ChatMessage(
            sender="bot",
            message=ai_response,
            timestamp=timestamp
        )

        # Append to memory
        current_user.sessions_chat_history.append(user_msg)
        current_user.sessions_chat_history.append(ai_msg)
        current_user.interactions += 1
        current_user.updated_at = timestamp

        # Limit chat history (prevents DB bloat)
        if len(current_user.sessions_chat_history) > 300:
            current_user.sessions_chat_history = current_user.sessions_chat_history[-200:]

        # ============================
        # WRITE TO DATABASE (FAST)
        # ============================
        db.users.update_one(
            {"email": current_user.email},
            {
                "$set": {
                    "sessions_chat_history": [
                        json.loads(msg.model_dump_json())
                        for msg in current_user.sessions_chat_history
                    ],
                    "interactions": current_user.interactions,
                    "updated_at": timestamp
                }
            }
        )

        # ============================
        # RETURN RESPONSE
        # ============================
        return make_response(
            status_code=200,
            code="OK",
            message="AI response generated successfully",
            data=ChatResponse(
                message_id=str(ai_msg.message_id),
                user_message=request.message,
                ai_response=ai_response,
                timestamp=timestamp.isoformat(),
                analysis=analysis
            ).model_dump()
        )

    except Exception as e:
        print("[CRITICAL ERROR in send_message]:", e)
        return make_response(
            status_code=500,
            code="ERROR",
            message=f"Error processing message: {str(e)}",
            data={}
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
