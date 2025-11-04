
from fastapi import APIRouter
from . import registration, login

router = APIRouter()

router.include_router(registration.router)
router.include_router(login.router)
