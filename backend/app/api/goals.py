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
    Create a new Personal Financial Goal in Supabase or local test DB.
    """
    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15

    if is_supabase_user:
        from app.services.supabase_service import SupabaseService
        supa_goal = SupabaseService.create_goal(
            user_id=str(current_user.id),
            title=goal_in.title,
            target_amount=goal_in.target_amount,
            goal_type=goal_in.category
        )
        return GoalOut(
            id=str(supa_goal["id"]),
            user_id=str(supa_goal["user_id"]),
            title=supa_goal["title"],
            description=goal_in.description or "",
            category=goal_in.category or "Specific Purchase",
            target_amount=float(supa_goal["target_amount"]),
            current_amount=float(supa_goal.get("current_amount", 0.0)),
            target_date=goal_in.target_date,
            status=GoalStatusEnum.IN_PROGRESS,
            progress_percentage=0.0,
            remaining_amount=float(supa_goal["target_amount"]),
            created_at=None,
            updated_at=None,
        )

    # Local DB for non-Supabase test users
    uid_int = int(current_user.id)
    goal = FinancialGoal(
        user_id=uid_int,
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
    """List all user goals from Supabase with calculated progress."""
    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15

    if is_supabase_user:
        from app.services.supabase_service import SupabaseService
        supa_goals = SupabaseService.get_goals(str(current_user.id))
        out_list = []
        for g in supa_goals:
            cur = float(g.get("current_amount", 0.0))
            tgt = float(g.get("target_amount", 1.0))
            pct = (cur / tgt * 100.0) if tgt > 0 else 0.0
            rem = max(0.0, tgt - cur)
            out_list.append(
                GoalOut(
                    id=str(g["id"]),
                    user_id=str(g["user_id"]),
                    title=g["title"],
                    description="",
                    category="Specific Purchase",
                    target_amount=tgt,
                    current_amount=cur,
                    target_date=None,
                    status=GoalStatusEnum.COMPLETED if cur >= tgt else GoalStatusEnum.IN_PROGRESS,
                    progress_percentage=round(min(100.0, pct), 1),
                    remaining_amount=round(rem, 2),
                    created_at=None,
                    updated_at=None,
                )
            )
        return out_list

    goals = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.user_id == current_user.id)
        .order_by(FinancialGoal.created_at.desc())
        .all()
    )
    return [_to_goal_out(g) for g in goals]


@router.get("/{goal_id}", response_model=GoalOut)
def get_goal(
    goal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get single goal details from Supabase or local DB."""
    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15

    if is_supabase_user:
        from app.services.supabase_service import SupabaseService
        supa_goals = SupabaseService.get_goals(str(current_user.id))
        for g in supa_goals:
            if str(g["id"]) == str(goal_id):
                cur = float(g.get("current_amount", 0.0))
                tgt = float(g.get("target_amount", 1.0))
                pct = (cur / tgt * 100.0) if tgt > 0 else 0.0
                return GoalOut(
                    id=str(g["id"]),
                    user_id=str(g["user_id"]),
                    title=g["title"],
                    description="",
                    category="Specific Purchase",
                    target_amount=tgt,
                    current_amount=cur,
                    target_date=None,
                    status=GoalStatusEnum.COMPLETED if cur >= tgt else GoalStatusEnum.IN_PROGRESS,
                    progress_percentage=round(min(100.0, pct), 1),
                    remaining_amount=round(max(0.0, tgt - cur), 2),
                    created_at=None,
                    updated_at=None,
                )
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financial goal not found.")

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
    goal_id: str,
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
    goal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a goal from Supabase and local DB."""
    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15

    if is_supabase_user:
        from app.services.supabase_service import SupabaseService
        SupabaseService.delete_goal(str(current_user.id), str(goal_id))
        return None

    gid_int = int(goal_id)
    goal = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.id == gid_int, FinancialGoal.user_id == current_user.id)
        .first()
    )
    if goal:
        db.delete(goal)
        db.commit()
    return None


@router.post("/{goal_id}/deposit", response_model=GoalTransferResponse)
def transfer_deposit(
    goal_id: str,
    req: GoalTransferRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    THE WALLET-TRANSFER MECHANIC:
    Allocates funds from General Available Savings into this specific purchase lockbox in Supabase.
    """
    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15

    if is_supabase_user:
        try:
            from app.services.supabase_service import SupabaseService
            updated_goal = SupabaseService.deposit_to_goal(str(current_user.id), str(goal_id), req.amount)
            summary = SupabaseService.get_dashboard_summary(str(current_user.id))
            cur = float(updated_goal.get("current_amount", 0.0))
            tgt = float(updated_goal.get("target_amount", 1.0))
            st = GoalStatusEnum.COMPLETED if cur >= tgt else GoalStatusEnum.IN_PROGRESS
            return GoalTransferResponse(
                message=f"Successfully allocated ₹{req.amount:.2f} to '{updated_goal.get('title', 'Goal')}'.",
                goal_id=str(goal_id),
                transferred_amount=req.amount,
                new_goal_balance=cur,
                general_available_savings=summary["general_available_savings"],
                goal_status=st,
            )
        except ValueError as ve:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))

    # Local SQLite for test users
    try:
        gid_int = int(goal_id)
        goal, new_avail_savings = deposit_to_goal(db, current_user, gid_int, req.amount)
        return GoalTransferResponse(
            message=f"Successfully allocated ₹{req.amount:.2f} to '{goal.title}'.",
            goal_id=goal.id,
            transferred_amount=req.amount,
            new_goal_balance=goal.current_amount,
            general_available_savings=new_avail_savings,
            goal_status=GoalStatusEnum(goal.status),
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))


@router.post("/{goal_id}/withdraw", response_model=GoalTransferResponse)
def transfer_withdraw(
    goal_id: str,
    req: GoalTransferRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Unlocks funds from this purchase goal back into General Available Savings in Supabase.
    """
    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15

    if is_supabase_user:
        try:
            from app.services.supabase_service import SupabaseService
            updated_goal = SupabaseService.withdraw_from_goal(str(current_user.id), str(goal_id), req.amount)
            summary = SupabaseService.get_dashboard_summary(str(current_user.id))
            cur = float(updated_goal.get("current_amount", 0.0))
            tgt = float(updated_goal.get("target_amount", 1.0))
            st = GoalStatusEnum.COMPLETED if cur >= tgt else GoalStatusEnum.IN_PROGRESS
            return GoalTransferResponse(
                message=f"Successfully unlocked ₹{req.amount:.2f} from '{updated_goal.get('title', 'Goal')}' back to General Savings.",
                goal_id=str(goal_id),
                transferred_amount=req.amount,
                new_goal_balance=cur,
                general_available_savings=summary["general_available_savings"],
                goal_status=st,
            )
        except ValueError as ve:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))

    # Local SQLite for test users
    try:
        gid_int = int(goal_id)
        goal, new_avail_savings = withdraw_from_goal(db, current_user, gid_int, req.amount)
        return GoalTransferResponse(
            message=f"Successfully unlocked ₹{req.amount:.2f} from '{goal.title}' back to General Savings.",
            goal_id=goal.id,
            transferred_amount=req.amount,
            new_goal_balance=goal.current_amount,
            general_available_savings=new_avail_savings,
            goal_status=GoalStatusEnum(goal.status),
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
