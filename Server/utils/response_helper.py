# utils/response_helper.py

import json
from fastapi.responses import JSONResponse
from typing import Any, Optional

def remove_backslashes(obj):
    if isinstance(obj, dict):
        return {k: remove_backslashes(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [remove_backslashes(elem) for elem in obj]
    elif isinstance(obj, str):
        return obj.replace('\\', '')
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

    cleaned_response = remove_backslashes(response_body)

    return JSONResponse(status_code=status_code, content=cleaned_response)
