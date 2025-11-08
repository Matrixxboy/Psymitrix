
from fastapi import APIRouter
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE

router = APIRouter()

@router.get("/ai/status")
def get_ai_status():
    return make_response(
        HTTP_STATUS["OK"],
        HTTP_CODE["OK"],
        "AI Base Work API is working",
        {}
    )
