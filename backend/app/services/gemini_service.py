import re
import json
import logging
from typing import Dict, Any, List, Optional
import httpx
from sqlalchemy.orm import Session

from app.config import settings
from app.models.education import SecurityChatLog
from app.schemas.chatbot import ScamRiskLevelEnum, ChatMessage

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are the 'Technofora '26 Financial Security Assistant', an AI designed to protect young adults and students from digital scams, fraud, and deceptive financial schemes.

Your task is to analyze user queries, SMS alerts, UPI requests, emails, or messages for signs of fraud or digital security risks.

Assess the situation objectively and respond strictly in JSON format matching this schema:
{
  "reply": "Clear, friendly, empathetic explanation written for a young adult or student.",
  "risk_level": "LOW" | "MEDIUM" | "HIGH",
  "red_flags": ["List", "of", "detected", "warning", "signs"],
  "recommendations": ["Clear", "actionable", "safety", "steps"]
}

Guidelines:
- HIGH RISK: Clear scam indicators like requesting OTP/PIN, urgent threats (account blocked, electricity cut), claims of winning unentered lotteries, paying fees to unlock part-time jobs/crypto, or scanning a QR code to 'receive' money.
- MEDIUM RISK: Unsolicited offers with unverified links, vague job offers, unusual payment requests from acquaintances, requests to download screen sharing apps.
- LOW RISK: Genuine financial concepts (how SIP works, standard bank notification guidelines, budgeting questions, safe transaction practices).
- Never guarantee safety. Always include standard security vigilance.
"""


def _rule_based_security_analyzer(message: str) -> Dict[str, Any]:
    """
    Intelligent offline fallback rule-based analyzer when Gemini API key is not configured.
    Detects common fraud vectors targeting young adults.
    """
    msg_lower = message.lower()
    red_flags: List[str] = []
    recommendations: List[str] = []
    risk_score = 0

    # 1. OTP / PIN / Credentials
    if re.search(r"\b(otp|one[-\s]?time[-\s]?password|upi[-\s]?pin|mpin|cvv|atm[-\s]?pin|password)\b", msg_lower):
        if re.search(r"\b(share|send|enter|provide|verify|tell)\b", msg_lower):
            risk_score += 4
            red_flags.append("Requesting OTP, UPI PIN, or confidential security credentials.")
            recommendations.append("NEVER share your OTP, UPI PIN, or CVV with anyone. Banks and genuine companies never ask for them.")

    # 2. QR Code to receive money scam
    if re.search(r"\b(scan\s+(this\s+)?qr|qr\s+code)\b", msg_lower) and re.search(r"\b(receive|collect|accept|refund|credit)\b", msg_lower):
        risk_score += 4
        red_flags.append("Scanning a QR code is ONLY used to SEND money, never to RECEIVE money.")
        recommendations.append("Do NOT scan any QR code sent to you to receive money. Entering your UPI PIN will deduct money from your account.")

    # 3. Urgency & Threats
    if re.search(r"\b(immediately|urgent|within\s+\d+\s+(hour|hr|min)|blocked|suspended|disconnected|cut[-\s]?off|deactivate|arrest|police)\b", msg_lower):
        risk_score += 3
        red_flags.append("Artificial sense of urgency or coercive threats (account blocked / electricity disconnection).")
        recommendations.append("Scammers create panic to prevent logical thinking. Stop, take a deep breath, and do not act immediately.")

    # 4. Lottery / Cash prize / Reward scams
    if re.search(r"\b(won|lottery|prize|reward|winner|jackpot|crore|lakh|cashback\s+of\s+rs|bonus)\b", msg_lower):
        risk_score += 3
        red_flags.append("Unsolicited promise of easy money, lottery, or excessive rewards.")
        recommendations.append("If you didn't buy a lottery ticket or participate in an official contest, you didn't win. Avoid clicking links.")

    # 5. Remote Access Software
    if re.search(r"\b(anydesk|teamviewer|quicksupport|rustdesk|screen\s*share|apk\s*file)\b", msg_lower):
        risk_score += 4
        red_flags.append("Request to install remote desktop / screen-sharing application.")
        recommendations.append("Never install AnyDesk or remote control apps on instruction from a caller. It grants full access to your phone.")

    # 6. Part-time Job / Telegram Task Scams
    if re.search(r"\b(part[-\s]?time\s+job|work\s+from\s+home|like\s+youtube|telegram\s+group|review\s+hotel|daily\s+income\s+\d+)\b", msg_lower):
        risk_score += 3
        red_flags.append("Classic 'like YouTube videos / rating tasks' prepaid job scam.")
        recommendations.append("Real companies do not hire via anonymous Telegram messages or demand initial deposits to release earnings.")

    # 7. Phishing / Shortened Links
    if re.search(r"(bit\.ly|tinyurl|is\.gd|cutt\.ly|t\.co|ngrok|\.xyz|\.top|\.click|\.club)", msg_lower):
        risk_score += 2
        red_flags.append("Suspicious or shortened URL detected.")
        recommendations.append("Do not click links received in SMS or WhatsApp. Visit the official website or banking app directly.")

    # Evaluate risk level
    if risk_score >= 4:
        risk_level = ScamRiskLevelEnum.HIGH
        reply = (
            "🚨 HIGH SCAM ALERT! The message or situation you described shows critical red flags of a digital fraud attempt. "
            "Please DO NOT send any money, DO NOT click any links, and DO NOT share any credentials or OTPs."
        )
    elif risk_score >= 2:
        risk_level = ScamRiskLevelEnum.MEDIUM
        reply = (
            "⚠️ CAUTION ADVISED. There are suspicious indicators in this situation that match common scam behaviors. "
            "Proceed with extreme vigilance and verify the party through independent, official channels."
        )
    else:
        risk_level = ScamRiskLevelEnum.LOW
        reply = (
            "✅ This inquiry does not display immediate high-risk scam patterns. "
            "Always follow healthy digital hygiene: ensure websites use HTTPS, verify payment recipients before confirming, "
            "and keep your 2-Factor Authentication active."
        )
        recommendations.append("Keep your banking apps updated and enable biometric or two-factor login.")

    if not recommendations:
        recommendations.append("When in doubt, contact your bank's official toll-free customer support.")

    return {
        "reply": reply,
        "risk_level": risk_level,
        "red_flags": red_flags,
        "recommendations": recommendations,
    }


async def analyze_security_message(
    message: str,
    conversation_history: Optional[List[ChatMessage]] = None,
    db: Optional[Session] = None,
    user_id: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Analyze potential scam or security situation using Gemini API,
    falling back seamlessly to rule-based evaluation if the API key is not configured.
    """
    result: Optional[Dict[str, Any]] = None

    if settings.GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
            
            # Format history
            contents = []
            if conversation_history:
                for msg in conversation_history[-4:]:  # last few messages
                    contents.append({
                        "role": "user" if msg.role == "user" else "model",
                        "parts": [{"text": msg.content}]
                    })
            contents.append({
                "role": "user",
                "parts": [{"text": f"Analyze this message/situation for financial scam indicators:\n\n{message}"}]
            })

            payload = {
                "system_instruction": {
                    "parts": [{"text": SYSTEM_PROMPT}]
                },
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.2,
                    "response_mime_type": "application/json"
                }
            }

            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    parsed = json.loads(raw_text)
                    
                    risk_level_str = parsed.get("risk_level", "MEDIUM").upper()
                    if risk_level_str not in ["LOW", "MEDIUM", "HIGH"]:
                        risk_level_str = "MEDIUM"
                    
                    result = {
                        "reply": parsed.get("reply", "Analysis complete."),
                        "risk_level": ScamRiskLevelEnum(risk_level_str),
                        "red_flags": parsed.get("red_flags", []),
                        "recommendations": parsed.get("recommendations", []),
                    }
                else:
                    logger.warning(f"Gemini API returned status {res.status_code}: {res.text}. Falling back to rule engine.")
        except Exception as e:
            logger.warning(f"Error calling Gemini API: {e}. Falling back to rule engine.")

    # Fallback if Gemini wasn't called or failed
    if not result:
        result = _rule_based_security_analyzer(message)

    # Persist log if db is available
    if db:
        try:
            log_entry = SecurityChatLog(
                user_id=user_id,
                user_message=message,
                bot_response=result["reply"],
                risk_level=result["risk_level"].value if hasattr(result["risk_level"], "value") else str(result["risk_level"]),
                red_flags_json=json.dumps(result["red_flags"]),
            )
            db.add(log_entry)
            db.commit()
        except Exception as db_err:
            logger.warning(f"Failed to log security chat interaction: {db_err}")
            db.rollback()

    return result
