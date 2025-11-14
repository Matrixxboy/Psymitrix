
from fastapi import APIRouter
from . import registration, login, password

router = APIRouter()

router.include_router(registration.router)
router.include_router(login.router)
router.include_router(password.router)
