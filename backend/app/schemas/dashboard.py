from typing import List
from pydantic import BaseModel
from app.schemas.transaction import TransactionOut
from app.schemas.budget import BudgetAlertOut


class CategorySpending(BaseModel):
    category: str
    total_amount: float
    percentage: float


class MonthlyTrendPoint(BaseModel):
    month_name: str
    month: int
    year: int
    income: float
    expense: float
    net_savings: float


class DashboardSummaryOut(BaseModel):
    total_income: float
    total_expenses: float
    net_balance: float
    general_available_savings: float
    locked_goal_savings: float
    expected_monthly_savings: float
    actual_current_month_savings: float
    savings_variance: float
    current_streak: int
    longest_streak: int
    budget_alerts: List[BudgetAlertOut]
    recent_transactions: List[TransactionOut]
    category_spending: List[CategorySpending]
    monthly_trend: List[MonthlyTrendPoint]
