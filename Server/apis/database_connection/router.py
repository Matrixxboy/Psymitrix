from fastapi import APIRouter
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from Database.db_connection import check_database_connection, get_mongo_db

router = APIRouter()

@router.get("/database/status", tags=["Database"])
def get_database_status():
    """
    Checks the status of the MongoDB connection.
    Returns a success response if connected, otherwise a failure response.
    """
    db = get_mongo_db()
    if check_database_connection():
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Database connection is healthy.",
            data={"database_name": db.name if db is not None else "N/A"}
        )
    else:
        return make_response(
            status_code=HTTP_STATUS["SERVICE_UNAVAILABLE"],
            code=HTTP_CODE["DATABASE_CONNECTION_FAILED"],
            message="Database connection failed or is not available.",
            data={}
        )
