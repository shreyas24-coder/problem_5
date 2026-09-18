import json
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.education import SecurityChatLog
from app.schemas.chatbot import ChatRequest, ChatResponse, ScamRiskLevelEnum
from app.services.auth_service import get_current_user
from app.services.gemini_service import analyze_security_message

router = APIRouter(prefix="/security-chat", tags=["Financial Security Chatbot"])


@router.post("/", response_model=ChatResponse)
async def chat_security_advisor(
    chat_in: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Financial Security & Scam Guidance Chatbot powered by Google Gemini API:
    - Analyzes potential scam situations, SMS messages, UPI requests, or suspicious links.
    - Evaluates Risk Level (LOW, MEDIUM, HIGH).
    - Identifies Red Flags and supplies actionable recommendations.
    - Explicitly acts as an educational guidance tool for digital transaction safety.
    """
    result = await analyze_security_message(
        message=chat_in.message,
        conversation_history=chat_in.conversation_history,
        db=db,
        user_id=current_user.id,
    )

    # Log into Supabase scam_logs table
    try:
        from app.services.supabase_service import SupabaseService
        score_map = {"HIGH": 90, "MEDIUM": 60, "LOW": 15}
        score = score_map.get(str(result["risk_level"]).upper(), 50)
        SupabaseService.log_scam(raw_content=chat_in.message, risk_score=score, source_type="SMS")
    except Exception:
        pass

    return ChatResponse(
        reply=result["reply"],
        risk_level=result["risk_level"],
        red_flags=result["red_flags"],
        recommendations=result["recommendations"],
    )


@router.get("/history")
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve user's past scam consultation history."""
    logs = (
        db.query(SecurityChatLog)
        .filter(SecurityChatLog.user_id == current_user.id)
        .order_by(SecurityChatLog.created_at.desc())
        .limit(20)
        .all()
    )

    return [
        {
            "id": log.id,
            "user_message": log.user_message,
            "bot_response": log.bot_response,
            "risk_level": log.risk_level,
            "red_flags": json.loads(log.red_flags_json) if log.red_flags_json else [],
            "created_at": log.created_at,
        }
        for log in logs
    ]
