from typing import List
from pydantic import BaseModel
from app.schemas.transaction import TransactionOut
from app.schemas.budget import BudgetAlertOut


class CategorySpending(BaseModel):
    category: str
    total_amount: float
    percentage: float                   # % of total expenses (fallback when no budget set)
    budget_limit: float = 0.0           # Budget boundary for this category this month (0 = not set)
    budget_used_pct: float = 0.0        # (spent / budget_limit * 100) if budget set, else same as percentage


class MonthlyTrendPoint(BaseModel):
    month_name: str
    month: int
    year: int
    income: float
    expense: float
    net_savings: float
    goal_deposits: float = 0.0          # Sum of GOAL_TRANSFER "Goal Allocation" outflows this month


class DashboardSummaryOut(BaseModel):
    total_income: float
    total_expenses: float
    total_goal_deposits: float          # Total ever locked into goals (Model A accounting)
    net_balance: float                  # True liquid available balance (income - expenses - goal deposits + withdrawals)
    general_available_savings: float    # Equals net_balance in Model A
    locked_goal_savings: float
    total_savings: float = 0.0          # Combined total savings (Liquid Available Balance + Locked Goal Savings)
    expected_monthly_savings: float
    actual_current_month_savings: float
    savings_variance: float
    current_streak: int
    longest_streak: int
    budget_alerts: List[BudgetAlertOut]
    recent_transactions: List[TransactionOut]
    category_spending: List[CategorySpending]
    monthly_trend: List[MonthlyTrendPoint]

