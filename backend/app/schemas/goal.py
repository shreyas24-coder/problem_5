from typing import Optional, Union
from enum import Enum
import datetime
from pydantic import BaseModel, Field, ConfigDict


class GoalStatusEnum(str, Enum):
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class GoalBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = None
    category: Optional[str] = "Specific Purchase"
    target_amount: float = Field(..., gt=0, description="Target savings amount")
    target_date: Optional[datetime.date] = None


class GoalCreate(GoalBase):
    initial_deposit: Optional[float] = Field(default=0.0, ge=0, description="Initial funds to lock into this goal upon creation")


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    target_amount: Optional[float] = Field(None, gt=0)
    target_date: Optional[datetime.date] = None
    status: Optional[GoalStatusEnum] = None


class GoalTransferRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Amount to deposit or withdraw")


class GoalTransferResponse(BaseModel):
    message: str
    goal_id: Union[int, str]
    transferred_amount: float
    new_goal_balance: float
    general_available_savings: float
    goal_status: GoalStatusEnum


class GoalDailyStatusOut(BaseModel):
    goal_id: Union[int, str]
    title: str
    target_amount: float
    current_amount: float
    remaining_amount: float
    target_date: Optional[datetime.date] = None
    days_remaining: Optional[int] = None
    daily_target: float = 0.0
    saved_today: float = 0.0
    is_daily_target_met: bool = False


class GoalOut(GoalBase):
    id: Union[int, str]
    user_id: Union[int, str]
    current_amount: float
    status: GoalStatusEnum
    progress_percentage: float = 0.0
    remaining_amount: float = 0.0
    daily_target: Optional[float] = 0.0
    saved_today: Optional[float] = 0.0
    days_remaining: Optional[int] = None
    is_daily_target_met: Optional[bool] = False
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None

    model_config = ConfigDict(from_attributes=True)
