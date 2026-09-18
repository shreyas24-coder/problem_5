from typing import Optional
from enum import Enum
import datetime
from pydantic import BaseModel, Field, ConfigDict


class BudgetStatusEnum(str, Enum):
    NORMAL = "NORMAL"          # < 80%
    APPROACHING = "APPROACHING"  # 80% to 99.9%
    EXCEEDED = "EXCEEDED"        # >= 100%


class BudgetBase(BaseModel):
    category: Optional[str] = Field(None, description="Category name, or None for total monthly budget")
    limit_amount: float = Field(..., gt=0, description="Spending limit")
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2020, le=2100)


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    limit_amount: float = Field(..., gt=0)


class BudgetAlertOut(BaseModel):
    category: Optional[str] = None
    limit_amount: float
    spent_amount: float
    remaining_amount: float
    percentage: float
    status: BudgetStatusEnum
    message: str


class BudgetOut(BudgetBase):
    id: int
    user_id: int
    spent_amount: float = 0.0
    remaining_amount: float = 0.0
    percentage: float = 0.0
    status: BudgetStatusEnum = BudgetStatusEnum.NORMAL
    alert_message: str = ""
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
