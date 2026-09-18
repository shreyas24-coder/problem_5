from typing import Optional
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
    pass


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
    goal_id: int
    transferred_amount: float
    new_goal_balance: float
    general_available_savings: float
    goal_status: GoalStatusEnum


class GoalOut(GoalBase):
    id: int
    user_id: int
    current_amount: float
    status: GoalStatusEnum
    progress_percentage: float = 0.0
    remaining_amount: float = 0.0
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
