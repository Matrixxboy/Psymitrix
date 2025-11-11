from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from utils.http_constants import HTTP_STATUS, HTTP_CODE
from utils.response_helper import make_response

# Import routers
from apis.auth.router import router as auth_router
from apis.user_crud_ai.router import router as user_crud_ai_router
from apis.interaction_crud_ai.router import router as interaction_crud_ai_router
from apis.ai_base_work.router import router as ai_base_work_router
from apis.database_connection.router import router as database_connection_router
from apis.subscription.router import router as subscription_router
from apis.google_login.router import router as google_login_router
from apis.support.router import router as support_router
from apis.resend_email.router import router as resend_email_router
from apis.sessions.router import router as sessions_router
from apis.games.router import router as games_router
from apis.mood_trends.router import router as mood_trends_router
from apis.achievements.router import router as achievements_router
from apis.notifications.router import router as notifications_router
from apis.ai_chat.router import router as ai_chat_router
from apis.assessments.router import router as assessments_router
from apis.mental_health_reports.router import router as mental_health_reports_router
from apis.ai_analytics.router import router as ai_analytics_router
from apis.ai_recommendations.router import router as ai_recommendations_router
from apis.admin.router import router as admin_router

app = FastAPI()

#the migration script
# uncomment the line below to run the migration once
# from Database.migration import migrate_users
# migrate_users()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(database_connection_router, prefix="/api/v1")
app.include_router(user_crud_ai_router, prefix="/api/v1")
app.include_router(achievements_router, prefix="/api/v1")
app.include_router(sessions_router, prefix="/api/v1")
app.include_router(games_router, prefix="/api/v1")
app.include_router(mood_trends_router, prefix="/api/v1")
app.include_router(notifications_router, prefix="/api/v1")
app.include_router(ai_chat_router, prefix="/api/v1")
app.include_router(assessments_router, prefix="/api/v1")
app.include_router(mental_health_reports_router, prefix="/api/v1")
app.include_router(ai_analytics_router, prefix="/api/v1")
app.include_router(ai_recommendations_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")

#future routers
# will be completed later on phase 2
app.include_router(ai_base_work_router, prefix="/api/v1")
app.include_router(interaction_crud_ai_router, prefix="/api/v1")
app.include_router(subscription_router, prefix="/api/v1")
app.include_router(google_login_router, prefix="/api/v1")
app.include_router(support_router, prefix="/api/v1")
app.include_router(resend_email_router, prefix="/api/v1")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Convert FastAPI’s validation error into your standard structure
    error_messages = []
    print(request)
    for err in exc.errors():
        loc = " -> ".join(map(str, err.get("loc", [])))
        msg = err.get("msg", "")
        error_messages.append(f"{loc}: {msg}")

    return make_response(
        status_code=HTTP_STATUS["BAD_REQUEST"],
        code=HTTP_CODE["VALIDATION"],
        message="Validation error",
        data={"errors": error_messages}
    )

@app.get("/")
def read_root():
    return make_response(
        status_code=HTTP_STATUS["OK"],
        code=HTTP_CODE["OK"],
        message="Server is running 🚀",
        data={"Message": "Welcome to the Psymitrix Server"}
    )
