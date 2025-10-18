
from fastapi import APIRouter
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE

router = APIRouter()

@router.get("/auth/status")
def get_auth_status():
    return make_response(
        HTTP_STATUS["OK"],
        HTTP_CODE["OK"],
        "Auth API is working",
        {}
    )
