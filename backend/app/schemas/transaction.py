from typing import Optional, Union, Dict, Any
from enum import Enum
import datetime
from pydantic import BaseModel, Field, ConfigDict


class TransactionTypeEnum(str, Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"
    GOAL_TRANSFER = "GOAL_TRANSFER"


class TransactionBase(BaseModel):
    type: TransactionTypeEnum
    amount: float = Field(..., gt=0, description="Amount must be positive")
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    payment_method: Optional[str] = "UPI"
    date: datetime.date = Field(default_factory=datetime.date.today)


class TransactionCreate(TransactionBase):
    goal_id: Optional[Union[int, str]] = None


class TransactionUpdate(BaseModel):
    type: Optional[TransactionTypeEnum] = None
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    description: Optional[str] = None
    payment_method: Optional[str] = None
    date: Optional[datetime.date] = None


class TransactionOut(TransactionBase):
    id: Union[int, str]
    user_id: Union[int, str]
    goal_id: Optional[Union[int, str]] = None
    created_at: Optional[datetime.datetime] = None
    allocation_result: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

