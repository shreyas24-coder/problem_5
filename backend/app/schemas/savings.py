from typing import Optional
from pydantic import BaseModel


class SavingsTrackerOut(BaseModel):
    total_income: float
    total_expenses: float
    net_accumulated_balance: float
    general_available_savings: float
    locked_goal_savings: float
    expected_monthly_savings: float
    actual_monthly_savings: float
    savings_rate_percentage: float
    savings_variance: float
    is_on_track: bool
    active_goals_count: int
    completed_goals_count: int
