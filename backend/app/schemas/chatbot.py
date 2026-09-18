from typing import List, Optional, Dict
from enum import Enum
import datetime
from pydantic import BaseModel, Field


class ScamRiskLevelEnum(str, Enum):
    LOW = "LOW"          # Unlikely to be a scam / general financial query
    MEDIUM = "MEDIUM"    # Suspicious elements detected, caution required
    HIGH = "HIGH"        # Clear signs of fraud / scam


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User's query or suspicious situation description")
    conversation_history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    reply: str
    risk_level: ScamRiskLevelEnum
    red_flags: List[str] = []
    recommendations: List[str] = []
    disclaimer: str = (
        "Disclaimer: This chatbot is an educational awareness and guidance tool developed for "
        "Technofora '26. It does not provide certified legal advice or guaranteed fraud detection. "
        "Always verify directly with your official banking provider or cybercrime authority."
    )
    analyzed_at: datetime.datetime = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc))
