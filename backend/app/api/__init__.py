from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.transactions import router as transactions_router
from app.api.budgets import router as budgets_router
from app.api.savings import router as savings_router
from app.api.goals import router as goals_router
from app.api.chatbot import router as chatbot_router
from app.api.education import router as education_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(transactions_router)
api_router.include_router(budgets_router)
api_router.include_router(savings_router)
api_router.include_router(goals_router)
api_router.include_router(chatbot_router)
api_router.include_router(education_router)
