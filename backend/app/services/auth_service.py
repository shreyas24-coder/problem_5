import datetime
from typing import Optional
import bcrypt
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User

# Security scheme
security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored bcrypt hash."""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.now(datetime.timezone.utc) + expires_delta
    else:
        expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


class SupabaseUser:
    """Wrapper around Supabase users table row that provides an interface identical to SQLAlchemy User."""
    def __init__(self, data: dict):
        self.id = str(data.get("id"))
        self.name = data.get("name") or data.get("full_name") or "Alex Rivera"
        self.full_name = self.name
        self.email = data.get("email")
        self.monthly_income = float(data.get("monthly_income") or 0.0)
        self.monthly_budget_cap = float(data.get("monthly_budget_cap") or 0.0)
        self.daily_expense_budget = self.monthly_budget_cap / 30.0 if self.monthly_budget_cap > 0 else 500.0
        exp_sav = data.get("expected_monthly_savings")
        if exp_sav is not None:
            self.expected_monthly_savings = float(exp_sav)
        elif self.monthly_income > self.monthly_budget_cap and self.monthly_budget_cap > 0:
            self.expected_monthly_savings = float(self.monthly_income - self.monthly_budget_cap)
        else:
            self.expected_monthly_savings = 10000.0
        ts = data.get("created_at")
        if ts:
            try:
                self.created_at = datetime.datetime.fromisoformat(ts.replace("Z", "+00:00"))
            except Exception:
                self.created_at = datetime.datetime.now(datetime.timezone.utc)
        else:
            self.created_at = datetime.datetime.now(datetime.timezone.utc)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
):
    """FastAPI dependency to extract and authenticate the current user via JWT."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not credentials:
        raise credentials_exception

    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # 1. Look up in Supabase first
    try:
        from app.services.supabase_service import SupabaseService
        supa_user = SupabaseService.get_user_by_id(user_id_str)
        if supa_user:
            return SupabaseUser(supa_user)
    except Exception:
        pass

    # 2. Local fallback if int
    try:
        user_id_int = int(user_id_str)
        user = db.query(User).filter(User.id == user_id_int).first()
        if user:
            return user
    except Exception:
        pass

    raise credentials_exception
