from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from Database.db_connection import get_mongo_db
from models.user_model import User, Session
from apis.auth.authentication import get_current_user
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE

router = APIRouter(prefix="/sessions", tags=["Sessions"])

@router.post("/store")
async def create_session(session: Session, current_user: User = Depends(get_current_user), db = Depends(get_mongo_db)):
    try:
        # Add the new session to the user's sessions list
        if current_user.sessions is None:
            current_user.sessions = []
        current_user.sessions.append(session)

        # Encode the sessions list to be JSON-serializable
        encoded_sessions = jsonable_encoder(current_user.sessions)

        # Update the user in the database
        db.users.update_one(
            {"email": current_user.email},
            {"$set": {"sessions": encoded_sessions}}
        )

        return make_response(
            status_code=HTTP_STATUS["CREATED"],
            code=HTTP_CODE["CREATED"],
            message="Session created successfully",
            data=jsonable_encoder(session)
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Failed to create session",
            data={"error": str(e)},
        )
