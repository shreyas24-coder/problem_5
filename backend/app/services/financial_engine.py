import datetime
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from fastapi import HTTPException, status

from app.models.transaction import Transaction
from app.models.budget import BudgetBoundary
from app.models.goal import FinancialGoal
from app.models.user import User
from app.schemas.budget import BudgetAlertOut, BudgetStatusEnum

# ---------------------------------------------------------------------------
# ACCOUNTING MODEL (Model A — Wallet-Transfer):
#
# Goal deposits are REAL outflows from the user's liquid pool. When a user
# locks money into a goal, their available balance decreases immediately.
# The wallet-transfer mechanic creates a GOAL_TRANSFER transaction for each
# deposit (category="Goal Allocation") and each withdrawal
# (category="Goal Withdrawal"). These are summed here to compute the true
# liquid net_balance.
#
# Formula:
#   net_balance = total_income - total_expenses
#                 - total_goal_deposits + total_goal_withdrawals
#
# general_available_savings == net_balance   (no further subtraction needed;
# the GOAL_TRANSFER deductions already account for locked funds)
#
# locked_goal_savings = sum(goal.current_amount) for non-cancelled goals
#   — This is the canonical source of truth for what is locked.
#   — It should always equal (total_goal_deposits - total_goal_withdrawals).
#
# IMPORTANT: Do NOT subtract locked_goal_savings from net_balance again.
#            That would double-count the deduction.
# ---------------------------------------------------------------------------


def get_user_financial_totals(db: Session, user_id: int) -> Dict[str, float]:
    """
    Calculate high-level financial balances using Model A (Wallet-Transfer) accounting.

    Returns:
        total_income              — sum of all INCOME transactions
        total_expenses            — sum of all EXPENSE transactions
        total_goal_deposits       — sum of all GOAL_TRANSFER "Goal Allocation" outflows
        net_balance               — liquid available money (income - expenses - goal deposits + goal withdrawals)
        locked_goal_savings       — sum of goal.current_amount for active/completed goals
        general_available_savings — equals net_balance (provided for frontend convenience)
    """
    income = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(Transaction.user_id == user_id, Transaction.type == "INCOME")
        .scalar()
    ) or 0.0

    expense = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(Transaction.user_id == user_id, Transaction.type == "EXPENSE")
        .scalar()
    ) or 0.0

    # Goal deposits: funds locked away from liquid pool into specific goals.
    # These are created exclusively by deposit_to_goal() — never by the user directly.
    goal_deposits = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "GOAL_TRANSFER",
            Transaction.category == "Goal Allocation",
        )
        .scalar()
    ) or 0.0

    # Goal withdrawals: funds unlocked from goals back into the liquid pool.
    # These are created exclusively by withdraw_from_goal() — never by the user directly.
    goal_withdrawals = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0.0))
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "GOAL_TRANSFER",
            Transaction.category == "Goal Withdrawal",
        )
        .scalar()
    ) or 0.0

    # locked_goal_savings: canonical source of truth of funds held in active goals
    locked_savings = (
        db.query(func.coalesce(func.sum(FinancialGoal.current_amount), 0.0))
        .filter(FinancialGoal.user_id == user_id, FinancialGoal.status != "CANCELLED")
        .scalar()
    ) or 0.0

    total_goal_lock = max(float(locked_savings), float(goal_deposits) - float(goal_withdrawals))

    # net_balance = true liquid money (what's actually spendable right now, with goals deducted)
    net_balance = float(income) - float(expense) - total_goal_lock

    # In Model A, net_balance IS the general available savings.
    general_savings = net_balance

    return {
        "total_income": float(income),
        "total_expenses": float(expense),
        "total_goal_deposits": float(total_goal_lock),
        "net_balance": round(net_balance, 2),
        "locked_goal_savings": float(locked_savings),
        "general_available_savings": round(general_savings, 2),
        "total_savings": round(max(0.0, general_savings) + locked_savings, 2),
    }


def get_budget_alerts(
    db: Session, user_id: int, month: int, year: int
) -> List[BudgetAlertOut]:
    """
    Evaluates spending against user-defined budget boundaries.
    Alerts:
    - NORMAL: < 80% of limit
    - APPROACHING: >= 80% and < 100% of limit
    - EXCEEDED: >= 100% of limit
    """
    budgets = (
        db.query(BudgetBoundary)
        .filter(
            BudgetBoundary.user_id == user_id,
            BudgetBoundary.month == month,
            BudgetBoundary.year == year,
        )
        .all()
    )

    alerts: List[BudgetAlertOut] = []

    for b in budgets:
        query = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
            Transaction.user_id == user_id,
            Transaction.type == "EXPENSE",
            extract("month", Transaction.date) == month,
            extract("year", Transaction.date) == year,
        )

        if b.category:
            query = query.filter(Transaction.category == b.category)

        spent = float(query.scalar() or 0.0)
        percentage = (spent / b.limit_amount * 100.0) if b.limit_amount > 0 else 0.0
        remaining = float(b.limit_amount - spent)

        label = f"'{b.category}'" if b.category else "overall monthly"

        if spent >= b.limit_amount:
            status_enum = BudgetStatusEnum.EXCEEDED
            msg = f"Alert: You have exceeded your {label} budget by ₹{abs(remaining):.2f}! ({percentage:.1f}% used)"
        elif percentage >= 80.0:
            status_enum = BudgetStatusEnum.APPROACHING
            msg = f"Warning: You have reached {percentage:.1f}% of your {label} budget limit. ₹{remaining:.2f} remaining."
        else:
            status_enum = BudgetStatusEnum.NORMAL
            msg = f"On Track: {percentage:.1f}% of your {label} budget used. ₹{remaining:.2f} remaining."

        alerts.append(
            BudgetAlertOut(
                category=b.category,
                limit_amount=b.limit_amount,
                spent_amount=spent,
                remaining_amount=remaining,
                percentage=round(percentage, 1),
                status=status_enum,
                message=msg,
            )
        )

    return alerts


def deposit_to_goal(db: Session, user: User, goal_id: int, amount: float) -> Tuple[FinancialGoal, float]:
    """
    Wallet-Transfer Mechanic:
    Allocates funds from General Savings into a specific purchase goal.
    Locks the funds and creates a GOAL_TRANSFER transaction.
    """
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transfer amount must be greater than zero.",
        )

    goal = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.id == goal_id, FinancialGoal.user_id == user.id)
        .first()
    )
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial goal not found.",
        )

    if goal.status == "CANCELLED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deposit funds into a cancelled goal.",
        )

    totals = get_user_financial_totals(db, user.id)
    if totals["general_available_savings"] < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Insufficient General Available Savings. "
                f"You have ₹{totals['general_available_savings']:.2f} available, but requested ₹{amount:.2f}."
            ),
        )

    # Increment goal amount
    goal.current_amount += amount
    if goal.current_amount >= goal.target_amount:
        goal.status = "COMPLETED"

    # Record the GOAL_TRANSFER transaction
    transfer_txn = Transaction(
        user_id=user.id,
        type="GOAL_TRANSFER",
        amount=amount,
        category="Goal Allocation",
        description=f"Locked funds into goal: '{goal.title}'",
        payment_method="Internal Transfer",
        date=datetime.date.today(),
        goal_id=goal.id,
    )
    db.add(transfer_txn)
    db.commit()
    db.refresh(goal)

    new_totals = get_user_financial_totals(db, user.id)
    return goal, new_totals["general_available_savings"]


def withdraw_from_goal(db: Session, user: User, goal_id: int, amount: float) -> Tuple[FinancialGoal, float]:
    """
    Unlocks funds from a goal back to General Available Savings.
    """
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Withdrawal amount must be greater than zero.",
        )

    goal = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.id == goal_id, FinancialGoal.user_id == user.id)
        .first()
    )
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Financial goal not found.",
        )

    if goal.current_amount < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Cannot withdraw ₹{amount:.2f}. "
                f"Only ₹{goal.current_amount:.2f} is currently locked in this goal."
            ),
        )

    goal.current_amount -= amount
    if goal.status == "COMPLETED" and goal.current_amount < goal.target_amount:
        goal.status = "IN_PROGRESS"

    # Record the unlock transaction
    transfer_txn = Transaction(
        user_id=user.id,
        type="GOAL_TRANSFER",
        amount=amount,
        category="Goal Withdrawal",
        description=f"Unlocked funds from goal: '{goal.title}' to General Savings",
        payment_method="Internal Transfer",
        date=datetime.date.today(),
        goal_id=goal.id,
    )
    db.add(transfer_txn)
    db.commit()
    db.refresh(goal)

    new_totals = get_user_financial_totals(db, user.id)
    return goal, new_totals["general_available_savings"]


# ---------------------------------------------------------------------------
# AUTOMATIC 50/30/20 INCOME ALLOCATION ENGINE
# ---------------------------------------------------------------------------
INCOME_ALLOCATION_RATIOS = {
    "Food & Dining": 0.25,          # 25% Essentials
    "Bills & Utilities": 0.15,      # 15% Essentials
    "Commute & Travel": 0.10,       # 10% Essentials
    "Shopping & Tech": 0.15,        # 15% Wants
    "Social & Entertainment": 0.15, # 15% Wants
    "Savings & Investments": 0.20,  # 20% Savings & Goals
}


def auto_allocate_income(
    db: Session,
    user: User,
    income_amount: float,
    txn_date: Optional[datetime.date] = None,
) -> Dict[str, Any]:
    """
    Automated 50/30/20 Income Allocation Engine:
    When an income transaction is entered, dynamically creates or expands
    budget boundaries for the current month across categories and deposits
    the 20% savings portion into the user's primary active financial goal.
    """
    if income_amount <= 0:
        return {}

    date_obj = txn_date or datetime.date.today()
    month = date_obj.month
    year = date_obj.year

    is_supabase_user = isinstance(user.id, str) and len(str(user.id)) > 15
    target_user_id = user.id
    if is_supabase_user and hasattr(user, "email") and user.email:
        local_u = db.query(User).filter(User.email == user.email.lower().strip()).first()
        if local_u:
            target_user_id = local_u.id

    allocations = {}
    for category, ratio in INCOME_ALLOCATION_RATIOS.items():
        allocated_amt = round(income_amount * ratio, 2)
        allocations[category] = allocated_amt

        boundary = (
            db.query(BudgetBoundary)
            .filter(
                BudgetBoundary.user_id == target_user_id,
                BudgetBoundary.category == category,
                BudgetBoundary.month == month,
                BudgetBoundary.year == year,
            )
            .first()
        )
        if boundary:
            boundary.limit_amount = round(boundary.limit_amount + allocated_amt, 2)
        else:
            boundary = BudgetBoundary(
                user_id=target_user_id,
                category=category,
                limit_amount=allocated_amt,
                month=month,
                year=year,
            )
            db.add(boundary)

    # Also update overall total budget boundary (category=None)
    overall_boundary = (
        db.query(BudgetBoundary)
        .filter(
            BudgetBoundary.user_id == target_user_id,
            BudgetBoundary.category == None,
            BudgetBoundary.month == month,
            BudgetBoundary.year == year,
        )
        .first()
    )
    if overall_boundary:
        overall_boundary.limit_amount = round(overall_boundary.limit_amount + income_amount, 2)
    else:
        overall_boundary = BudgetBoundary(
            user_id=target_user_id,
            category=None,
            limit_amount=income_amount,
            month=month,
            year=year,
        )
        db.add(overall_boundary)

    db.commit()

    # Automatic Savings Allocation (20% to Goal)
    savings_amt = allocations.get("Savings & Investments", 0.0)
    deposited_goal = None
    if savings_amt > 0:
        if is_supabase_user:
            try:
                from app.services.supabase_service import SupabaseService
                goals = SupabaseService.get_goals(str(user.id))
                active_goal = next(
                    (g for g in goals if float(g.get("current_amount", 0.0)) < float(g.get("target_amount", 1.0))),
                    None
                )
                if active_goal:
                    needed = max(0.0, float(active_goal["target_amount"]) - float(active_goal.get("current_amount", 0.0)))
                    deposit_amt = min(savings_amt, needed)
                    if deposit_amt > 0:
                        up_goal = SupabaseService.deposit_to_goal(str(user.id), str(active_goal["id"]), deposit_amt)
                        deposited_goal = {
                            "id": up_goal.get("id"),
                            "title": up_goal.get("title"),
                            "deposited_amount": deposit_amt,
                            "current_amount": up_goal.get("current_amount"),
                            "target_amount": up_goal.get("target_amount"),
                            "progress_percentage": round((float(up_goal.get("current_amount", 0)) / float(up_goal.get("target_amount", 1))) * 100, 1),
                        }
            except Exception:
                pass
        else:
            active_goal = (
                db.query(FinancialGoal)
                .filter(
                    FinancialGoal.user_id == user.id,
                    FinancialGoal.status != "CANCELLED",
                    FinancialGoal.status != "COMPLETED",
                )
                .order_by(FinancialGoal.created_at.asc())
                .first()
            )
            if active_goal:
                needed = max(0.0, active_goal.target_amount - active_goal.current_amount)
                totals = get_user_financial_totals(db, user.id)
                avail = max(0.0, totals.get("general_available_savings", 0.0))
                deposit_amt = min(savings_amt, needed, avail)
                if deposit_amt > 0:
                    try:
                        goal_obj, _ = deposit_to_goal(db, user, active_goal.id, deposit_amt)
                        deposited_goal = {
                            "id": goal_obj.id,
                            "title": goal_obj.title,
                            "deposited_amount": deposit_amt,
                            "current_amount": goal_obj.current_amount,
                            "target_amount": goal_obj.target_amount,
                            "progress_percentage": round((goal_obj.current_amount / goal_obj.target_amount) * 100, 1),
                        }
                    except Exception:
                        pass

    return {
        "income_amount": income_amount,
        "allocations": allocations,
        "deposited_goal": deposited_goal,
    }

