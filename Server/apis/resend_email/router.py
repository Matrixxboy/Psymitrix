
from fastapi import APIRouter
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE

router = APIRouter()

@router.get("/resend_email/status")
def get_resend_email_status():
    return make_response(
        HTTP_STATUS["OK"],
        HTTP_CODE["OK"],
        "Resend Email API is working",
        {}
    )
