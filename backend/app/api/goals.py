from typing import List, Optional, Union, Dict, Any
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.goal import FinancialGoal
from app.models.transaction import Transaction
from app.schemas.goal import (
    GoalCreate,
    GoalUpdate,
    GoalOut,
    GoalDailyStatusOut,
    GoalTransferRequest,
    GoalTransferResponse,
    GoalStatusEnum,
)
from app.services.auth_service import get_current_user
from app.services.financial_engine import deposit_to_goal, withdraw_from_goal

router = APIRouter(prefix="/goals", tags=["Personal Financial Goals & Lockboxes"])


def _calculate_goal_daily_metrics(
    target_amount: float,
    current_amount: float,
    target_date_val: Optional[Union[datetime.date, str]],
    txns: List[Any],
    goal_id: Union[int, str]
) -> Dict[str, Any]:
    """
    Calculates:
    - daily_target: (target_amount - current_amount) / days_remaining_until_target_date
    - saved_today: sum of all GOAL_TRANSFER transactions linked to this goal today
    """
    remaining = max(0.0, float(target_amount) - float(current_amount))

    # Parse target_date
    target_d = None
    if isinstance(target_date_val, datetime.date):
        target_d = target_date_val
    elif isinstance(target_date_val, str) and target_date_val.strip():
        try:
            target_d = datetime.date.fromisoformat(target_date_val.split("T")[0].strip())
        except Exception:
            target_d = None

    today = datetime.date.today()
    days_remaining = None
    daily_target = 0.0

    if remaining <= 0:
        daily_target = 0.0
        days_remaining = 0
    elif target_d:
        days_remaining = (target_d - today).days
        if days_remaining <= 0:
            # Target date is today or passed; full remaining amount is needed today
            daily_target = round(remaining, 2)
            days_remaining = max(0, days_remaining)
        else:
            daily_target = round(remaining / days_remaining, 2)
    else:
        daily_target = 0.0

    # Calculate saved_today from GOAL_TRANSFER transactions linked to this goal
    today_str = today.isoformat()
    saved_today = 0.0
    for t in txns:
        if isinstance(t, dict):
            t_goal_id = str(t.get("linked_goal_id") or t.get("goal_id") or "")
            t_type = str(t.get("type", "")).upper()
            t_cat = str(t.get("category", "")).lower()
            ts = str(t.get("timestamp") or t.get("date") or t.get("created_at") or "")
            amt = float(t.get("amount", 0.0))
        else:
            t_goal_id = str(getattr(t, "goal_id", "") or getattr(t, "linked_goal_id", ""))
            t_type = str(getattr(t, "type", "")).upper()
            t_cat = str(getattr(t, "category", "")).lower()
            t_date = getattr(t, "date", None)
            ts = t_date.isoformat() if t_date else str(getattr(t, "created_at", ""))
            amt = float(getattr(t, "amount", 0.0))

        if t_goal_id == str(goal_id):
            if t_type in ["GOAL_TRANSFER"] or ("savings goal" in t_cat and t_type == "EXPENSE"):
                if ts.startswith(today_str):
                    saved_today += amt

    saved_today = round(saved_today, 2)
    is_daily_target_met = (saved_today >= daily_target) if daily_target > 0 else (remaining <= 0)

    return {
        "target_date": target_d,
        "daily_target": daily_target,
        "saved_today": saved_today,
        "days_remaining": days_remaining,
        "is_daily_target_met": is_daily_target_met,
    }


def _to_goal_out(goal: FinancialGoal, txns: Optional[List[Any]] = None) -> GoalOut:
    pct = (goal.current_amount / goal.target_amount * 100.0) if goal.target_amount > 0 else 0.0
    rem = max(0.0, goal.target_amount - goal.current_amount)
    metrics = _calculate_goal_daily_metrics(
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date_val=goal.target_date,
        txns=txns or [],
        goal_id=goal.id
    )
    return GoalOut(
        id=goal.id,
        user_id=goal.user_id,
        title=goal.title,
        description=goal.description,
        category=goal.category,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date=metrics["target_date"],
        status=GoalStatusEnum(goal.status),
        progress_percentage=round(min(100.0, pct), 1),
        remaining_amount=round(rem, 2),
        daily_target=metrics["daily_target"],
        saved_today=metrics["saved_today"],
        days_remaining=metrics["days_remaining"],
        is_daily_target_met=metrics["is_daily_target_met"],
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
            goal_type=goal_in.category,
            target_date=str(goal_in.target_date) if goal_in.target_date else None
        )
        init_dep = float(goal_in.initial_deposit or 0.0)
        cur_amt = 0.0
        if init_dep > 0:
            try:
                up_g = SupabaseService.deposit_to_goal(str(current_user.id), str(supa_goal["id"]), init_dep)
                cur_amt = float(up_g.get("current_amount", init_dep))
            except Exception:
                pass

        rem = max(0.0, float(supa_goal["target_amount"]) - cur_amt)
        today = datetime.date.today()
        days_rem = (goal_in.target_date - today).days if goal_in.target_date else None
        daily_tgt = round(rem / days_rem, 2) if (days_rem and days_rem > 0) else (rem if days_rem == 0 else 0.0)

        return GoalOut(
            id=str(supa_goal["id"]),
            user_id=str(supa_goal["user_id"]),
            title=supa_goal["title"],
            description=goal_in.description or "",
            category=goal_in.category or "Specific Purchase",
            target_amount=float(supa_goal["target_amount"]),
            current_amount=cur_amt,
            target_date=goal_in.target_date,
            status=GoalStatusEnum.COMPLETED if cur_amt >= float(supa_goal["target_amount"]) else GoalStatusEnum.IN_PROGRESS,
            progress_percentage=round((cur_amt / float(supa_goal["target_amount"])) * 100.0, 1) if float(supa_goal["target_amount"]) > 0 else 0.0,
            remaining_amount=rem,
            daily_target=daily_tgt,
            saved_today=cur_amt,
            days_remaining=days_rem,
            is_daily_target_met=daily_tgt > 0 and cur_amt >= daily_tgt,
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

    init_dep = float(goal_in.initial_deposit or 0.0)
    if init_dep > 0:
        try:
            deposit_to_goal(db, current_user, goal.id, init_dep)
            db.refresh(goal)
        except Exception:
            pass

    txns = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    return _to_goal_out(goal, txns)


@router.get("/", response_model=List[GoalOut])
def list_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all user goals from Supabase with calculated daily targets and progress."""
    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15

    if is_supabase_user:
        from app.services.supabase_service import SupabaseService
        supa_goals = SupabaseService.get_goals(str(current_user.id))
        txns = SupabaseService.get_transactions(str(current_user.id), limit=500)
        out_list = []
        for g in supa_goals:
            cur = float(g.get("current_amount", 0.0))
            tgt = float(g.get("target_amount", 1.0))
            pct = (cur / tgt * 100.0) if tgt > 0 else 0.0
            rem = max(0.0, tgt - cur)
            metrics = _calculate_goal_daily_metrics(
                target_amount=tgt,
                current_amount=cur,
                target_date_val=g.get("target_date"),
                txns=txns,
                goal_id=g["id"]
            )
            out_list.append(
                GoalOut(
                    id=str(g["id"]),
                    user_id=str(g["user_id"]),
                    title=g["title"],
                    description=g.get("description", "") or "",
                    category=g.get("goal_type") or "Specific Purchase",
                    target_amount=tgt,
                    current_amount=cur,
                    target_date=metrics["target_date"],
                    status=GoalStatusEnum.COMPLETED if cur >= tgt else GoalStatusEnum.IN_PROGRESS,
                    progress_percentage=round(min(100.0, pct), 1),
                    remaining_amount=round(rem, 2),
                    daily_target=metrics["daily_target"],
                    saved_today=metrics["saved_today"],
                    days_remaining=metrics["days_remaining"],
                    is_daily_target_met=metrics["is_daily_target_met"],
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
    txns = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .all()
    )
    return [_to_goal_out(g, txns) for g in goals]


@router.get("/{goal_id}/daily-status", response_model=GoalDailyStatusOut)
def get_goal_daily_status(
    goal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get suggested daily savings target and tracker for a specific goal:
    - daily_target: (target_amount - current_amount) / days_remaining_until_target_date
    - saved_today: sum of all GOAL_TRANSFER transactions linked to this goal today
    """
    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15

    if is_supabase_user:
        from app.services.supabase_service import SupabaseService
        supa_goals = SupabaseService.get_goals(str(current_user.id))
        target_goal = next((g for g in supa_goals if str(g["id"]) == str(goal_id)), None)
        if not target_goal:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financial goal not found.")

        txns = SupabaseService.get_transactions(str(current_user.id), limit=500)
        cur = float(target_goal.get("current_amount", 0.0))
        tgt = float(target_goal.get("target_amount", 1.0))
        metrics = _calculate_goal_daily_metrics(
            target_amount=tgt,
            current_amount=cur,
            target_date_val=target_goal.get("target_date"),
            txns=txns,
            goal_id=target_goal["id"]
        )
        return GoalDailyStatusOut(
            goal_id=str(target_goal["id"]),
            title=target_goal.get("title", "Goal"),
            target_amount=tgt,
            current_amount=cur,
            remaining_amount=round(max(0.0, tgt - cur), 2),
            target_date=metrics["target_date"],
            days_remaining=metrics["days_remaining"],
            daily_target=metrics["daily_target"],
            saved_today=metrics["saved_today"],
            is_daily_target_met=metrics["is_daily_target_met"],
        )

    # Local SQLite
    gid_int = int(goal_id) if goal_id.isdigit() else 0
    goal = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.id == gid_int, FinancialGoal.user_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financial goal not found.")

    txns = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .all()
    )
    metrics = _calculate_goal_daily_metrics(
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date_val=goal.target_date,
        txns=txns,
        goal_id=goal.id
    )
    return GoalDailyStatusOut(
        goal_id=goal.id,
        title=goal.title,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        remaining_amount=round(max(0.0, goal.target_amount - goal.current_amount), 2),
        target_date=metrics["target_date"],
        days_remaining=metrics["days_remaining"],
        daily_target=metrics["daily_target"],
        saved_today=metrics["saved_today"],
        is_daily_target_met=metrics["is_daily_target_met"],
    )


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
                txns = SupabaseService.get_transactions(str(current_user.id), limit=500)
                metrics = _calculate_goal_daily_metrics(
                    target_amount=tgt,
                    current_amount=cur,
                    target_date_val=g.get("target_date"),
                    txns=txns,
                    goal_id=g["id"]
                )
                return GoalOut(
                    id=str(g["id"]),
                    user_id=str(g["user_id"]),
                    title=g["title"],
                    description=g.get("description", "") or "",
                    category=g.get("goal_type") or "Specific Purchase",
                    target_amount=tgt,
                    current_amount=cur,
                    target_date=metrics["target_date"],
                    status=GoalStatusEnum.COMPLETED if cur >= tgt else GoalStatusEnum.IN_PROGRESS,
                    progress_percentage=round(min(100.0, pct), 1),
                    remaining_amount=round(max(0.0, tgt - cur), 2),
                    daily_target=metrics["daily_target"],
                    saved_today=metrics["saved_today"],
                    days_remaining=metrics["days_remaining"],
                    is_daily_target_met=metrics["is_daily_target_met"],
                    created_at=None,
                    updated_at=None,
                )
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financial goal not found.")

    gid_int = int(goal_id) if goal_id.isdigit() else 0
    goal = (
        db.query(FinancialGoal)
        .filter(FinancialGoal.id == gid_int, FinancialGoal.user_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Financial goal not found.")
    txns = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .all()
    )
    return _to_goal_out(goal, txns)



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
