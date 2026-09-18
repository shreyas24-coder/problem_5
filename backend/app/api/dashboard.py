import datetime
from calendar import month_name
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, desc

from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.dashboard import DashboardSummaryOut, CategorySpending, MonthlyTrendPoint
from app.schemas.transaction import TransactionOut
from app.services.auth_service import get_current_user
from app.services.financial_engine import get_user_financial_totals, get_budget_alerts
from app.services.streak_service import get_user_streak

router = APIRouter(prefix="/dashboard", tags=["Interactive Financial Dashboard"])


@router.get("/", response_model=DashboardSummaryOut)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Main home screen endpoint:
    Aggregates financial position, budget alerts, streak stats, category breakdowns, and trends.
    """
    today = datetime.date.today()
    totals = get_user_financial_totals(db, current_user.id)
    streak_data = get_user_streak(db, current_user.id)
    budget_alerts = get_budget_alerts(db, current_user.id, today.month, today.year)

    # Current month's actual savings
    cur_income = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "INCOME",
            extract("month", Transaction.date) == today.month,
            extract("year", Transaction.date) == today.year,
        )
        .scalar()
    ) or 0.0

    cur_expense = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "EXPENSE",
            extract("month", Transaction.date) == today.month,
            extract("year", Transaction.date) == today.year,
        )
        .scalar()
    ) or 0.0

    actual_month_savings = float(cur_income - cur_expense)
    expected_savings = current_user.expected_monthly_savings or 0.0
    savings_variance = actual_month_savings - expected_savings

    # Recent transactions
    recent_txns = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .order_by(desc(Transaction.date), desc(Transaction.id))
        .limit(5)
        .all()
    )

    # Category-wise expenses
    cat_rows = (
        db.query(
            Transaction.category,
            func.coalesce(func.sum(Transaction.amount), 0.0).label("total"),
        )
        .filter(Transaction.user_id == current_user.id, Transaction.type == "EXPENSE")
        .group_by(Transaction.category)
        .all()
    )

    total_expense = totals["total_expenses"]
    category_spending: List[CategorySpending] = []
    for cat, amount in cat_rows:
        pct = (amount / total_expense * 100.0) if total_expense > 0 else 0.0
        category_spending.append(
            CategorySpending(
                category=cat,
                total_amount=round(float(amount), 2),
                percentage=round(pct, 1),
            )
        )
    category_spending.sort(key=lambda x: x.total_amount, reverse=True)

    # 6-Month historical trend
    monthly_trend: List[MonthlyTrendPoint] = []
    for i in range(5, -1, -1):
        # Calculate target month and year
        m = today.month - i
        y = today.year
        while m <= 0:
            m += 12
            y -= 1

        inc = (
            db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
            .filter(
                Transaction.user_id == current_user.id,
                Transaction.type == "INCOME",
                extract("month", Transaction.date) == m,
                extract("year", Transaction.date) == y,
            )
            .scalar()
        ) or 0.0

        exp = (
            db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
            .filter(
                Transaction.user_id == current_user.id,
                Transaction.type == "EXPENSE",
                extract("month", Transaction.date) == m,
                extract("year", Transaction.date) == y,
            )
            .scalar()
        ) or 0.0

        monthly_trend.append(
            MonthlyTrendPoint(
                month_name=month_name[m][:3],
                month=m,
                year=y,
                income=round(float(inc), 2),
                expense=round(float(exp), 2),
                net_savings=round(float(inc - exp), 2),
            )
        )

    return DashboardSummaryOut(
        total_income=totals["total_income"],
        total_expenses=totals["total_expenses"],
        net_balance=totals["net_balance"],
        general_available_savings=totals["general_available_savings"],
        locked_goal_savings=totals["locked_goal_savings"],
        expected_monthly_savings=expected_savings,
        actual_current_month_savings=actual_month_savings,
        savings_variance=round(savings_variance, 2),
        current_streak=streak_data["current_streak"],
        longest_streak=streak_data["longest_streak"],
        budget_alerts=budget_alerts,
        recent_transactions=[TransactionOut.model_validate(t) for t in recent_txns],
        category_spending=category_spending,
        monthly_trend=monthly_trend,
    )
