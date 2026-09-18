from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.goal import FinancialGoal
from app.schemas.goal import (
    GoalCreate,
    GoalUpdate,
    GoalOut,
    GoalTransferRequest,
    GoalTransferResponse,
    GoalStatusEnum,
)
from app.services.auth_service import get_current_user
from app.services.financial_engine import deposit_to_goal, withdraw_from_goal

router = APIRouter(prefix="/goals", tags=["Personal Financial Goals & Lockboxes"])


def _to_goal_out(goal: FinancialGoal) -> GoalOut:
    pct = (goal.current_amount / goal.target_amount * 100.0) if goal.target_amount > 0 else 0.0
    rem = max(0.0, goal.target_amount - goal.current_amount)
    return GoalOut(
        id=goal.id,
        user_id=goal.user_id,
        title=goal.title,
        description=goal.description,
        category=goal.category,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date=goal.target_date,
        status=GoalStatusEnum(goal.status),
        progress_percentage=round(min(100.0, pct), 1),
        remaining_amount=round(rem, 2),
        created_at=goal.created_at,
        updated_at=goal.updated_at,
    )


@router.post("/", response_model=GoalOut, status_code=status.HTTP_201_CREATED)
def create_goal(
    goal_in: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new Personal Financial Goal or Specific Purchase Lockbox.
    Example: Saving ₹90,000 for a MacBook Air.
    """
    goal = FinancialGoal(
        user_id=current_user.id,
        title=goal_in.title,
        description=goal_in.description,
        category=goal_in.category or "Specific Purchase",
        target_amount=goal_in.target_amount,
        current_amount=0.0,
        target_date=goal_in.target_date,
        status=GoalStatusEnum.IN_PROGRESS.value,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return _to_goal_out(goal)


@router.get("/", response_model=List[GoalOut])
def list_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all user goals with calculated progress and remaining amounts."""
    goals = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.user_id == current_user.id)
        .order_by(FinancialGoal.created_at.desc())
        .all()
    )
    return [_to_goal_out(g) for g in goals]


@router.get("/{goal_id}", response_model=GoalOut)
def get_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get single goal details."""
    goal = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.id == goal_id, FinancialGoal.user_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financial goal not found.")
    return _to_goal_out(goal)


@router.put("/{goal_id}", response_model=GoalOut)
def update_goal(
    goal_id: int,
    updates: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update goal attributes or target status."""
    goal = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.id == goal_id, FinancialGoal.user_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financial goal not found.")

    if updates.title is not None:
        goal.title = updates.title
    if updates.description is not None:
        goal.description = updates.description
    if updates.category is not None:
        goal.category = updates.category
    if updates.target_amount is not None:
        goal.target_amount = updates.target_amount
    if updates.target_date is not None:
        goal.target_date = updates.target_date
    if updates.status is not None:
        goal.status = updates.status.value

    db.commit()
    db.refresh(goal)
    return _to_goal_out(goal)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a goal. (Any locked amount is naturally unreserved back to general savings)."""
    goal = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.id == goal_id, FinancialGoal.user_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financial goal not found.")

    db.delete(goal)
    db.commit()
    return None


@router.post("/{goal_id}/deposit", response_model=GoalTransferResponse)
def transfer_deposit(
    goal_id: int,
    req: GoalTransferRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    THE WALLET-TRANSFER MECHANIC:
    Allocates funds from General Available Savings into this specific purchase lockbox.
    Deducts from available unallocated savings and locks funds inside the goal.
    """
    goal, new_avail_savings = deposit_to_goal(db, current_user, goal_id, req.amount)
    return GoalTransferResponse(
        message=f"Successfully allocated ₹{req.amount:.2f} to '{goal.title}'.",
        goal_id=goal.id,
        transferred_amount=req.amount,
        new_goal_balance=goal.current_amount,
        general_available_savings=new_avail_savings,
        goal_status=GoalStatusEnum(goal.status),
    )


@router.post("/{goal_id}/withdraw", response_model=GoalTransferResponse)
def transfer_withdraw(
    goal_id: int,
    req: GoalTransferRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Unlocks funds from this purchase goal back into General Available Savings.
    """
    goal, new_avail_savings = withdraw_from_goal(db, current_user, goal_id, req.amount)
    return GoalTransferResponse(
        message=f"Successfully unlocked ₹{req.amount:.2f} from '{goal.title}' back to General Savings.",
        goal_id=goal.id,
        transferred_amount=req.amount,
        new_goal_balance=goal.current_amount,
        general_available_savings=new_avail_savings,
        goal_status=GoalStatusEnum(goal.status),
    )
