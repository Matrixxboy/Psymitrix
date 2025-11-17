import json
from uuid import UUID
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from models.user_model import User
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db
from utils.response_helper import make_response
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from .ai_service import generate_report
from .report_formate import generate_personality_pdf

router = APIRouter(prefix="/ai_report", tags=["AI Report"])

@router.post("/ai_generate_report")
async def ai_report(
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    try:
        username = f"{current_user.firstName}_{current_user.lastName}"
        filename = f"{username}_Personality_Report_by_PsyMitrix.pdf"
        report_data_str = await generate_report(current_user)
        report_data = json.loads(report_data_str)
        
        pdf_buffer = generate_personality_pdf(filename=filename,data=report_data,person_name=current_user.firstName,generated_by=current_user.firstName)
        
        headers = {
            'Content-Disposition': f'attachment; filename="{filename}"'
        }
        
        return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)

    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS.INTERNAL_SERVER_ERROR,
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message=f"Error Making report: {str(e)}",
            data={}
        )

