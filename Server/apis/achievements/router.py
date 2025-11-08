from fastapi import APIRouter
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE

router = APIRouter(prefix="/achievements", tags=["Achievements"])

@router.get("/status")
def get_achievements_status():
    return make_response(
        status_code=HTTP_STATUS.OK,
        code=HTTP_CODE["OK"],
        message="Achievements API is working",
        data={}
    )
