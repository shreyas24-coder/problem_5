from typing import List, Optional
import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import extract, func

from app.database import get_db
from app.models.user import User
from app.models.budget import BudgetBoundary
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetOut, BudgetAlertOut, BudgetStatusEnum
from app.services.auth_service import get_current_user
from app.services.financial_engine import get_budget_alerts

router = APIRouter(prefix="/budgets", tags=["Budgets & Alerts"])


@router.post("/", response_model=BudgetOut, status_code=status.HTTP_201_CREATED)
def set_or_update_budget_boundary(
    budget_in: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Define or update a budget boundary (either overall monthly spending or category-specific).
    """
    existing = (
        db.query(BudgetBoundary)
        .filter(
            BudgetBoundary.user_id == current_user.id,
            BudgetBoundary.category == budget_in.category,
            BudgetBoundary.month == budget_in.month,
            BudgetBoundary.year == budget_in.year,
        )
        .first()
    )

    if existing:
        existing.limit_amount = budget_in.limit_amount
        db.commit()
        db.refresh(existing)
        target = existing
    else:
        new_budget = BudgetBoundary(
            user_id=current_user.id,
            category=budget_in.category,
            limit_amount=budget_in.limit_amount,
            month=budget_in.month,
            year=budget_in.year,
        )
        db.add(new_budget)
        db.commit()
        db.refresh(new_budget)
        target = new_budget

    # Compute current spent
    query = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "EXPENSE",
        extract("month", Transaction.date) == target.month,
        extract("year", Transaction.date) == target.year,
    )
    if target.category:
        query = query.filter(Transaction.category == target.category)
    spent = float(query.scalar() or 0.0)
    pct = (spent / target.limit_amount * 100.0) if target.limit_amount > 0 else 0.0
    rem = float(target.limit_amount - spent)

    if spent >= target.limit_amount:
        status_val = BudgetStatusEnum.EXCEEDED
        alert_msg = f"Budget exceeded by ₹{abs(rem):.2f}!"
    elif pct >= 80.0:
        status_val = BudgetStatusEnum.APPROACHING
        alert_msg = f"Warning: {pct:.1f}% of budget consumed!"
    else:
        status_val = BudgetStatusEnum.NORMAL
        alert_msg = f"Budget safe: {pct:.1f}% consumed."

    return BudgetOut(
        id=target.id,
        user_id=target.user_id,
        category=target.category,
        limit_amount=target.limit_amount,
        month=target.month,
        year=target.year,
        spent_amount=spent,
        remaining_amount=rem,
        percentage=round(pct, 1),
        status=status_val,
        alert_message=alert_msg,
        created_at=target.created_at,
    )


@router.get("/", response_model=List[BudgetOut])
def list_budgets(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2020, le=2100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List defined budget boundaries with current consumption stats."""
    query = db.query(BudgetBoundary).filter(BudgetBoundary.user_id == current_user.id)
    if month:
        query = query.filter(BudgetBoundary.month == month)
    if year:
        query = query.filter(BudgetBoundary.year == year)

    budgets = query.all()
    results = []
    for b in budgets:
        q = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "EXPENSE",
            extract("month", Transaction.date) == b.month,
            extract("year", Transaction.date) == b.year,
        )
        if b.category:
            q = q.filter(Transaction.category == b.category)
        spent = float(q.scalar() or 0.0)
        pct = (spent / b.limit_amount * 100.0) if b.limit_amount > 0 else 0.0
        rem = float(b.limit_amount - spent)

        if spent >= b.limit_amount:
            status_val = BudgetStatusEnum.EXCEEDED
            msg = f"Budget exceeded by ₹{abs(rem):.2f}!"
        elif pct >= 80.0:
            status_val = BudgetStatusEnum.APPROACHING
            msg = f"Warning: {pct:.1f}% of budget consumed!"
        else:
            status_val = BudgetStatusEnum.NORMAL
            msg = f"Budget safe: {pct:.1f}% consumed."

        results.append(
            BudgetOut(
                id=b.id,
                user_id=b.user_id,
                category=b.category,
                limit_amount=b.limit_amount,
                month=b.month,
                year=b.year,
                spent_amount=spent,
                remaining_amount=rem,
                percentage=round(pct, 1),
                status=status_val,
                alert_message=msg,
                created_at=b.created_at,
            )
        )
    return results


@router.get("/alerts", response_model=List[BudgetAlertOut])
def get_current_alerts(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve expenditure alerts for the specified or current month/year."""
    now = datetime.date.today()
    m = month or now.month
    y = year or now.year
    return get_budget_alerts(db, current_user.id, m, y)


@router.get("/{budget_id}", response_model=BudgetOut)
def get_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve a single budget boundary with its current consumption stats."""
    b = (
        db.query(BudgetBoundary)
        .filter(BudgetBoundary.id == budget_id, BudgetBoundary.user_id == current_user.id)
        .first()
    )
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget boundary not found.")

    query = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "EXPENSE",
        extract("month", Transaction.date) == b.month,
        extract("year", Transaction.date) == b.year,
    )
    if b.category:
        query = query.filter(Transaction.category == b.category)
    spent = float(query.scalar() or 0.0)
    pct = (spent / b.limit_amount * 100.0) if b.limit_amount > 0 else 0.0
    rem = float(b.limit_amount - spent)

    if spent >= b.limit_amount:
        status_val = BudgetStatusEnum.EXCEEDED
        alert_msg = f"Budget exceeded by ₹{abs(rem):.2f}!"
    elif pct >= 80.0:
        status_val = BudgetStatusEnum.APPROACHING
        alert_msg = f"Warning: {pct:.1f}% of budget consumed!"
    else:
        status_val = BudgetStatusEnum.NORMAL
        alert_msg = f"Budget safe: {pct:.1f}% consumed."

    return BudgetOut(
        id=b.id,
        user_id=b.user_id,
        category=b.category,
        limit_amount=b.limit_amount,
        month=b.month,
        year=b.year,
        spent_amount=spent,
        remaining_amount=rem,
        percentage=round(pct, 1),
        status=status_val,
        alert_message=alert_msg,
        created_at=b.created_at,
    )


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a budget boundary."""
    b = (
        db.query(BudgetBoundary)
        .filter(BudgetBoundary.id == budget_id, BudgetBoundary.user_id == current_user.id)
        .first()
    )
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget boundary not found.")
    db.delete(b)
    db.commit()
    return None
