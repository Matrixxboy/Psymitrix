from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from models.user_model import User
from apis.auth.authentication import get_current_user
from Database.db_connection import get_mongo_db
from .report_generator import generate_mental_health_report
import tempfile
import os
from utils.response_helper import make_response
from utils.http_constants import HTTP_CODE , HTTP_STATUS

router = APIRouter(prefix="/reports", tags=["Mental Health Reports"])

class ReportRequest(BaseModel):
    include_assessments: bool = True
    include_mood_trends: bool = True
    include_recommendations: bool = True
    date_range_days: Optional[int] = 30

@router.post("/generate")
async def generate_report(
    request: ReportRequest,
    current_user: User = Depends(get_current_user),
    db=Depends(get_mongo_db)
):
    """
    Generate a comprehensive mental health report based on user data
    """
    try:
        # Generate PDF report
        pdf_file = generate_mental_health_report(
            user=current_user,
            include_assessments=request.include_assessments,
            include_mood_trends=request.include_mood_trends,
            include_recommendations=request.include_recommendations,
            date_range_days=request
        )
        
        return {
            "status_code": 200,
            "code": "OK",
            "message": "Report generated successfully",
            "data": {
                "file_name": os.path.basename(pdf_file),
                "file_path": pdf_file,
                "generated_at": datetime.utcnow().isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{file_name}")
async def download_report(
    file_name: str,
    current_user: User = Depends(get_current_user)
):
    """
    Download a generated mental health report
    """
    try:
        file_path = os.path.join(tempfile.gettempdir(), file_name)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Report file not found")
        
        return FileResponse(
            path=file_path,
            filename=file_name,
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analysis")
async def get_mental_health_analysis(
    current_user: User = Depends(get_current_user)
):
    """
    Get mental health analysis and insights without PDF
    """
    try:
        from .report_generator import calculate_mental_health_analysis
        
        analysis = calculate_mental_health_analysis(current_user)
        
        return make_response(
            status_code=HTTP_STATUS.OK,
            code= HTTP_CODE["OK"],
            message="Mental health analysis retrieved",
            data= analysis
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS.INTERNAL_SERVER_ERROR,
            code= HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Mental health analysis error",
            data=f"error : {e}"
        )
