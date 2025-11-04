import os
import sys
from fastapi import APIRouter
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Database.db_connection import mongo_db

router = APIRouter()

@router.get("/database_connection/status")
def get_database_connection_status():
    if mongo_db is None:
        return make_response(
            HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            HTTP_CODE["DB_CONNECTION_FAILED"],
            "Database connection failed",
            {}
        )
    return make_response(
        HTTP_STATUS["OK"],
        HTTP_CODE["OK"],
        "Database Connection API is working",
        {}
    )

@router.get("/support/status")
def get_support_status():
    return make_response(
        HTTP_STATUS["OK"],
        HTTP_CODE["OK"],
        "Support API is working",
        {}
    )
