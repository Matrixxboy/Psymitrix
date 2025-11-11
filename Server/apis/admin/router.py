from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from models.admin_model import Admin, AdminLogin, AdminCreate, AdminRole
from Database.db_connection import get_mongo_db
from utils.response_helper import make_response
from utils.http_constants import HTTP_CODE, HTTP_STATUS
from .admin_auth import admin_login as perform_admin_login, get_current_admin, create_admin as create_new_admin
from .analytics import (
    get_user_analytics,
    get_assessment_analytics,
    get_mood_analytics,
    get_wellness_analytics
)
from .vector_db_management import (
    upload_and_index_document,
    remove_document_from_vector_db,
    list_vector_db_documents,
    search_vector_db,
    clear_vector_db
)
from typing import Optional

router = APIRouter(prefix="/admin", tags=["Admin"])

# ==================== AUTHENTICATION ====================

@router.post("/login")
async def admin_login_route(
    login_data: AdminLogin,
    db = Depends(get_mongo_db)
):
    """Admin login endpoint"""
    try:
        access_token, admin = await perform_admin_login(
            email=login_data.email,
            password=login_data.password,
            db=db
        )
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Admin login successful",
            data={
                "access_token": access_token,
                "token_type": "Bearer",
                "admin": {
                    "admin_id": str(admin.admin_id),
                    "email": admin.email,
                    "username": admin.username,
                    "first_name": admin.first_name,
                    "last_name": admin.last_name,
                    "role": admin.role.value,
                    "permissions": [p.value for p in admin.permissions]
                }
            }
        )
    except HTTPException as e:
        return make_response(
            status_code=e.status_code,
            code=HTTP_CODE.get("UNAUTHORIZED", "UNAUTHORIZED"),
            message=e.detail,
            data={}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Login error",
            data={"error": str(e)}
        )

@router.post("/create-admin")
async def create_admin_route(
    admin_data: AdminCreate,
    current_admin: Admin = Depends(get_current_admin),
    db = Depends(get_mongo_db)
):
    """Create a new admin (Super Admin only)"""
    try:
        if current_admin.role != AdminRole.SUPER_ADMIN:
            return make_response(
                status_code=HTTP_STATUS["FORBIDDEN"],
                code=HTTP_CODE["FORBIDDEN"],
                message="Only Super Admins can create new admins",
                data={}
            )
        
        new_admin = await create_new_admin(admin_data.dict(), db=db, current_admin=current_admin)
        
        return make_response(
            status_code=HTTP_STATUS["CREATED"],
            code=HTTP_CODE["CREATED"],
            message="Admin created successfully",
            data={
                "admin_id": str(new_admin.admin_id),
                "email": new_admin.email,
                "username": new_admin.username,
                "role": new_admin.role.value
            }
        )
    except HTTPException as e:
        return make_response(
            status_code=e.status_code,
            code=HTTP_CODE.get("ERROR", "ERROR"),
            message=e.detail,
            data={}
        )

@router.get("/me")
async def get_current_admin_info(
    current_admin: Admin = Depends(get_current_admin)
):
    """Get current admin information"""
    return make_response(
        status_code=HTTP_STATUS["OK"],
        code=HTTP_CODE["OK"],
        message="Admin info retrieved",
        data={
            "admin_id": str(current_admin.admin_id),
            "email": current_admin.email,
            "username": current_admin.username,
            "first_name": current_admin.first_name,
            "last_name": current_admin.last_name,
            "role": current_admin.role.value,
            "permissions": [p.value for p in current_admin.permissions],
            "last_login": current_admin.last_login.isoformat() if current_admin.last_login else None
        }
    )

# ==================== ANALYTICS ====================

@router.get("/analytics/users")
async def get_users_analytics(
    date_range: int = 30,
    current_admin: Admin = Depends(get_current_admin),
    db = Depends(get_mongo_db)
):
    """Get user analytics and statistics"""
    try:
        analytics = await get_user_analytics(db, date_range_days=date_range)
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="User analytics retrieved",
            data=analytics
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Error retrieving analytics",
            data={"error": str(e)}
        )

@router.get("/analytics/assessments")
async def get_assessments_analytics(
    assessment_type: Optional[str] = None,
    date_range: int = 30,
    current_admin: Admin = Depends(get_current_admin),
    db = Depends(get_mongo_db)
):
    """Get assessment analytics"""
    try:
        analytics = await get_assessment_analytics(db, assessment_type=assessment_type, date_range_days=date_range)
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Assessment analytics retrieved",
            data=analytics
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Error retrieving analytics",
            data={"error": str(e)}
        )

@router.get("/analytics/mood")
async def get_moods_analytics(
    date_range: int = 30,
    current_admin: Admin = Depends(get_current_admin),
    db = Depends(get_mongo_db)
):
    """Get mood tracking analytics"""
    try:
        analytics = await get_mood_analytics(db, date_range_days=date_range)
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Mood analytics retrieved",
            data=analytics
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Error retrieving analytics",
            data={"error": str(e)}
        )

@router.get("/analytics/wellness")
async def get_wellness_analytics_route(
    date_range: int = 30,
    current_admin: Admin = Depends(get_current_admin),
    db = Depends(get_mongo_db)
):
    """Get wellness metrics analytics"""
    try:
        analytics = await get_wellness_analytics(db, date_range_days=date_range)
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Wellness analytics retrieved",
            data=analytics
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Error retrieving analytics",
            data={"error": str(e)}
        )

@router.get("/analytics/dashboard")
async def get_dashboard_analytics(
    date_range: int = 30,
    current_admin: Admin = Depends(get_current_admin),
    db = Depends(get_mongo_db)
):
    """Get comprehensive dashboard analytics"""
    try:
        user_analytics = await get_user_analytics(db, date_range_days=date_range)
        assessment_analytics = await get_assessment_analytics(db, date_range_days=date_range)
        mood_analytics = await get_mood_analytics(db, date_range_days=date_range)
        wellness_analytics = await get_wellness_analytics(db, date_range_days=date_range)
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Dashboard analytics retrieved",
            data={
                "users": user_analytics,
                "assessments": assessment_analytics,
                "mood": mood_analytics,
                "wellness": wellness_analytics,
                "date_range": date_range
            }
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Error retrieving dashboard analytics",
            data={"error": str(e)}
        )

# ==================== VECTOR DB MANAGEMENT ====================

@router.post("/vector-db/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: Optional[str] = Form(None),
    current_admin: Admin = Depends(get_current_admin)
):
    """Upload a document to vector DB"""
    try:
        result = await upload_and_index_document(file, document_type=document_type)
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Document uploaded and indexed successfully",
            data=result
        )
    except HTTPException as e:
        return make_response(
            status_code=e.status_code,
            code=HTTP_CODE.get("ERROR", "ERROR"),
            message=e.detail,
            data={}
        )
    except Exception as e:
        return make_response(
            status_code=HTTP_STATUS["INTERNAL_SERVER_ERROR"],
            code=HTTP_CODE["INTERNAL_SERVER_ERROR"],
            message="Error uploading document",
            data={"error": str(e)}
        )

@router.get("/vector-db/documents")
async def list_documents(
    current_admin: Admin = Depends(get_current_admin)
):
    """List all documents in vector DB"""
    try:
        documents = await list_vector_db_documents()
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Documents retrieved",
            data=documents
        )
    except HTTPException as e:
        return make_response(
            status_code=e.status_code,
            code=HTTP_CODE.get("ERROR", "ERROR"),
            message=e.detail,
            data={}
        )

@router.delete("/vector-db/documents/{document_name}")
async def delete_document(
    document_name: str,
    current_admin: Admin = Depends(get_current_admin)
):
    """Remove a document from vector DB"""
    try:
        result = await remove_document_from_vector_db(document_name)
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Document removed successfully",
            data=result
        )
    except HTTPException as e:
        return make_response(
            status_code=e.status_code,
            code=HTTP_CODE.get("ERROR", "ERROR"),
            message=e.detail,
            data={}
        )

@router.post("/vector-db/search")
async def search_documents(
    query: str,
    limit: int = 5,
    current_admin: Admin = Depends(get_current_admin)
):
    """Search vector DB"""
    try:
        results = await search_vector_db(query, limit=limit)
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Search completed",
            data=results
        )
    except HTTPException as e:
        return make_response(
            status_code=e.status_code,
            code=HTTP_CODE.get("ERROR", "ERROR"),
            message=e.detail,
            data={}
        )

@router.delete("/vector-db/clear")
async def clear_db(
    current_admin: Admin = Depends(get_current_admin)
):
    """Clear all documents from vector DB"""
    try:
        if current_admin.role != AdminRole.SUPER_ADMIN:
            return make_response(
                status_code=HTTP_STATUS["FORBIDDEN"],
                code=HTTP_CODE["FORBIDDEN"],
                message="Only Super Admins can clear the vector DB",
                data={}
            )
        
        result = await clear_vector_db()
        
        return make_response(
            status_code=HTTP_STATUS["OK"],
            code=HTTP_CODE["OK"],
            message="Vector DB cleared",
            data=result
        )
    except HTTPException as e:
        return make_response(
            status_code=e.status_code,
            code=HTTP_CODE.get("ERROR", "ERROR"),
            message=e.detail,
            data={}
        )
