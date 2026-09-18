from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, SessionLocal, Base
import app.models  # Ensure all SQLAlchemy models are registered
from app.api import api_router
from app.seed_data import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan event handler:
    - Automatically creates database schema tables if not present.
    - Seeds default educational content (shorts, articles, quizzes, demo scenario).
    """
    Base.metadata.create_all(bind=engine)
    
    # Run database seed
    db = SessionLocal()
    try:
        seed_database(db, create_demo_user=True)
    finally:
        db.close()

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
# Technofora '26 — FinTech Track Backend API
## Smart Personal Finance & Secure Digital Transactions

Modular backend delivering:
1. **Interactive Financial Dashboard**: Dynamic metrics, 6-month trends, category breakdowns, and real-time budget boundary alerts.
2. **Transactions History & Management**: Manual logging, searching, category tagging, and CRUD of financial transactions.
3. **Savings Tracker**: Expected vs actual savings tracking with General Available Savings vs Locked Goal Savings split.
4. **Financial Security Chatbot**: Gemini API powered digital fraud analysis, scam pattern detection, and safety guidance.
5. **Personal Financial Goals**: Specific purchase lockboxes with the **Wallet-Transfer mechanic**.
6. **Financial Education Hub & Daily Shorts**: Bite-sized shorts, daily streak tracker, beginner-friendly articles, and weekend quizzes.
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": "/docs",
        "status": "operational",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
