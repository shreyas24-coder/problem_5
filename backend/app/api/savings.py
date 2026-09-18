import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.database import get_db
from app.models.user import User
from app.models.goal import FinancialGoal
from app.models.transaction import Transaction
from app.schemas.savings import SavingsTrackerOut
from app.services.auth_service import get_current_user
from app.services.financial_engine import get_user_financial_totals

router = APIRouter(prefix="/savings", tags=["Savings Tracker"])


@router.get("/", response_model=SavingsTrackerOut)
@router.get("/tracker", response_model=SavingsTrackerOut)
def get_savings_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Savings Tracker View:
    - Compares expected vs actual savings
    - Split view: General Available Savings vs Locked Goal Savings from Supabase
    - Monthly savings rate and progress indicators
    """
    # 1. Supabase calculation for Supabase users
    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15
    if is_supabase_user:
        try:
            from app.services.supabase_service import SupabaseService
            supa_summary = SupabaseService.get_dashboard_summary(str(current_user.id))
            supa_goals = SupabaseService.get_goals(str(current_user.id))

            active_cnt = sum(1 for g in supa_goals if float(g.get("current_amount", 0)) < float(g.get("target_amount", 1)))
            comp_cnt = sum(1 for g in supa_goals if float(g.get("current_amount", 0)) >= float(g.get("target_amount", 1)))
            
            expected_sav = float(getattr(current_user, "expected_monthly_savings", 5000.0) or 5000.0)
            actual_sav = supa_summary["net_balance"]
            variance = round(actual_sav - expected_sav, 2)
            rate = supa_summary["savings_rate_pct"]

            return SavingsTrackerOut(
                total_income=supa_summary["total_income"],
                total_expenses=supa_summary["total_expenses"],
                total_goal_deposits=supa_summary["total_goal_deposits"],
                net_accumulated_balance=supa_summary["net_balance"],
                general_available_savings=supa_summary["general_available_savings"],
                locked_goal_savings=supa_summary["locked_goal_savings"],
                expected_monthly_savings=expected_sav,
                actual_monthly_savings=actual_sav,
                savings_rate_percentage=rate,
                savings_variance=variance,
                is_on_track=actual_sav >= expected_sav,
                active_goals_count=active_cnt,
                completed_goals_count=comp_cnt,
            )
        except Exception:
            pass
    totals = get_user_financial_totals(db, current_user.id)
    today = datetime.date.today()

    # Current month's income and expenses
    current_month_income = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "INCOME",
            extract("month", Transaction.date) == today.month,
            extract("year", Transaction.date) == today.year,
        )
        .scalar()
    ) or 0.0

    current_month_expense = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "EXPENSE",
            extract("month", Transaction.date) == today.month,
            extract("year", Transaction.date) == today.year,
        )
        .scalar()
    ) or 0.0

    actual_monthly_savings = float(current_month_income - current_month_expense)
    expected_savings = current_user.expected_monthly_savings or 0.0
    savings_variance = actual_monthly_savings - expected_savings
    is_on_track = actual_monthly_savings >= expected_savings

    savings_rate = (
        (actual_monthly_savings / current_month_income * 100.0)
        if current_month_income > 0
        else 0.0
    )

    active_goals_count = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.user_id == current_user.id, FinancialGoal.status == "IN_PROGRESS")
        .count()
    )
    completed_goals_count = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.user_id == current_user.id, FinancialGoal.status == "COMPLETED")
        .count()
    )

    return SavingsTrackerOut(
        total_income=totals["total_income"],
        total_expenses=totals["total_expenses"],
        total_goal_deposits=totals["total_goal_deposits"],
        net_accumulated_balance=totals["net_balance"],
        general_available_savings=totals["general_available_savings"],
        locked_goal_savings=totals["locked_goal_savings"],
        expected_monthly_savings=expected_savings,
        actual_monthly_savings=actual_monthly_savings,
        savings_rate_percentage=round(savings_rate, 1),
        savings_variance=round(savings_variance, 2),
        is_on_track=is_on_track,
        active_goals_count=active_goals_count,
        completed_goals_count=completed_goals_count,
    )

