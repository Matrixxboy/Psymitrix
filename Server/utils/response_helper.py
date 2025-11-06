# utils/response_helper.py

from fastapi.responses import JSONResponse
from typing import Any, Optional
from bson import ObjectId
from uuid import UUID
from datetime import datetime


def remove_backslashes(obj):
    """ 
    Recursively removes backslashes from strings in a dictionary or list.
    TODO: Investigate the root cause of the backslashes and remove this function.
    """ 
    if isinstance(obj, dict):
        return {k: remove_backslashes(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [remove_backslashes(elem) for elem in obj]
    elif isinstance(obj, str):
        return obj.replace('\\', '')
    else:
        return obj

def serialize_mongo_response(obj: Any) -> Any:
    """
    Recursively traverses a dictionary or list and converts MongoDB ObjectId, UUID and datetime to string.
    """
    if isinstance(obj, dict):
        return {k: serialize_mongo_response(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [serialize_mongo_response(elem) for elem in obj]
    elif isinstance(obj, (ObjectId, UUID)):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return obj

def make_response(status_code: int, code: str, message: str, data: Optional[Any] = None):
    """Standardized JSON response wrapper"""
    response_body = {
        "http_status": status_code,
        "http_code": code,
        "message": message,
    }
    if data is not None:
        response_body["data"] = data

    # Serialize MongoDB ObjectIds and then remove backslashes
    serialized_data = serialize_mongo_response(response_body)
    cleaned_response = remove_backslashes(serialized_data)

    return JSONResponse(status_code=status_code, content=cleaned_response)
