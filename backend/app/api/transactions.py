from typing import List, Optional
import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionOut,
    TransactionTypeEnum,
)
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions History & Management"])


@router.post("/", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def create_transaction(
    txn_in: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Manually record an income or expenditure entry in Supabase.
    """
    if txn_in.type == TransactionTypeEnum.GOAL_TRANSFER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GOAL_TRANSFER transactions are managed internally. Use POST /goals/{goal_id}/deposit instead.",
        )

    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15

    # 1. Insert into Supabase for Supabase users
    if is_supabase_user:
        try:
            from app.services.supabase_service import SupabaseService
            supa_txn = SupabaseService.create_transaction(
                user_id=str(current_user.id),
                amount=txn_in.amount,
                txn_type=txn_in.type.value,
                merchant_name=txn_in.description or "Manual Entry",
                category=txn_in.category,
                linked_goal_id=str(txn_in.goal_id) if txn_in.goal_id else None,
                timestamp=datetime.datetime.combine(txn_in.date, datetime.time.min).replace(tzinfo=datetime.timezone.utc).isoformat()
            )
            return TransactionOut(
                id=str(supa_txn["id"]),
                user_id=str(supa_txn["user_id"]),
                type=supa_txn["type"],
                amount=float(supa_txn["amount"]),
                category=supa_txn["category"],
                description=supa_txn["merchant_name"],
                payment_method="UPI",
                date=txn_in.date,
                goal_id=supa_txn.get("linked_goal_id"),
                created_at=None
            )
        except Exception:
            pass

    # 2. Local DB insert
    uid_int = int(current_user.id)
    gid_int = int(txn_in.goal_id) if txn_in.goal_id else None
    txn = Transaction(
        user_id=uid_int,
        type=txn_in.type.value,
        amount=txn_in.amount,
        category=txn_in.category,
        description=txn_in.description,
        payment_method=txn_in.payment_method or "UPI",
        date=txn_in.date,
        goal_id=gid_int,
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


@router.get("/", response_model=List[TransactionOut])
def list_transactions(
    type: Optional[TransactionTypeEnum] = None,
    category: Optional[str] = None,
    start_date: Optional[datetime.date] = None,
    end_date: Optional[datetime.date] = None,
    search: Optional[str] = None,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List transactions directly from Supabase for Supabase users or local DB for tests."""
    is_supabase_user = isinstance(current_user.id, str) and len(str(current_user.id)) > 15
    if is_supabase_user:
        try:
            from app.services.supabase_service import SupabaseService
            supa_list = SupabaseService.get_transactions(
                user_id=str(current_user.id),
                txn_type=type.value if type else None,
                category=category,
                limit=limit
            )
            if supa_list:
                out_list = []
                for t in supa_list:
                    d = datetime.date.today()
                    if t.get("timestamp"):
                        try:
                            d = datetime.datetime.fromisoformat(t["timestamp"].replace("Z", "+00:00")).date()
                        except Exception:
                            pass
                    out_list.append(
                        TransactionOut(
                            id=str(t["id"]),
                            user_id=str(t["user_id"]),
                            type=t["type"],
                            amount=float(t["amount"]),
                            category=t.get("category", "General"),
                            description=t.get("merchant_name", "Transaction"),
                            payment_method="UPI",
                            date=d,
                            goal_id=t.get("linked_goal_id"),
                            created_at=None
                        )
                    )
                return out_list
        except Exception:
            pass

    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

    if type:
        query = query.filter(Transaction.type == type.value)
    if category:
        query = query.filter(Transaction.category.ilike(f"%{category}%"))
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Transaction.description.ilike(search_pattern))
            | (Transaction.category.ilike(search_pattern))
        )

    transactions = (
        query.order_by(desc(Transaction.date), desc(Transaction.id))
        .offset(offset)
        .limit(limit)
        .all()
    )
    return transactions


@router.get("/{txn_id}", response_model=TransactionOut)
def get_transaction(
    txn_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve detailed information for a single transaction."""
    try:
        from app.services.supabase_service import SupabaseService
        supa_txns = SupabaseService.get_transactions(str(current_user.id))
        for t in supa_txns:
            if str(t["id"]) == str(txn_id):
                d = datetime.date.today()
                if t.get("timestamp"):
                    try:
                        d = datetime.datetime.fromisoformat(t["timestamp"].replace("Z", "+00:00")).date()
                    except Exception:
                        pass
                return TransactionOut(
                    id=str(t["id"]),
                    user_id=str(t["user_id"]),
                    type=t["type"],
                    amount=float(t["amount"]),
                    category=t.get("category", "General"),
                    description=t.get("merchant_name", "Transaction"),
                    payment_method="UPI",
                    date=d,
                    goal_id=t.get("linked_goal_id"),
                    created_at=None
                )
    except Exception:
        pass

    try:
        tid_int = int(txn_id)
        uid_int = int(current_user.id)
        txn = db.query(Transaction).filter(Transaction.id == tid_int, Transaction.user_id == uid_int).first()
        if txn:
            return txn
    except Exception:
        pass
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")


@router.put("/{txn_id}", response_model=TransactionOut)
def update_transaction(
    txn_id: str,
    txn_update: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Edit and correct an existing transaction record."""
    # Prevent changing any transaction's type to GOAL_TRANSFER — that type is
    # reserved for internal wallet-transfer operations only.
    if txn_update.type == TransactionTypeEnum.GOAL_TRANSFER:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot set transaction type to GOAL_TRANSFER. This type is reserved for internal goal allocations.",
        )

    txn = None
    try:
        tid_int = int(txn_id)
        uid_int = int(current_user.id)
        txn = (
            db.query(Transaction)
            .filter(Transaction.id == tid_int, Transaction.user_id == uid_int)
            .first()
        )
    except Exception:
        pass

    if not txn:
        # Update in Supabase
        try:
            from app.supabase_client import supabase
            up_data = {}
            if txn_update.amount is not None:
                up_data["amount"] = float(txn_update.amount)
            if txn_update.description is not None:
                up_data["merchant_name"] = txn_update.description
            if txn_update.category is not None:
                up_data["category"] = txn_update.category
            if txn_update.type is not None:
                up_data["type"] = txn_update.type.value

            res = supabase.table("transactions").update(up_data).eq("id", str(txn_id)).execute()
            if res.data:
                t = res.data[0]
                d = datetime.date.today()
                return TransactionOut(
                    id=str(t["id"]),
                    user_id=str(t["user_id"]),
                    type=t["type"],
                    amount=float(t["amount"]),
                    category=t.get("category", "General"),
                    description=t.get("merchant_name", "Transaction"),
                    payment_method="UPI",
                    date=d,
                    goal_id=t.get("linked_goal_id"),
                    created_at=None
                )
        except Exception:
            pass
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")

    if txn_update.type is not None:
        txn.type = txn_update.type.value
    if txn_update.amount is not None:
        txn.amount = txn_update.amount
    if txn_update.category is not None:
        txn.category = txn_update.category
    if txn_update.description is not None:
        txn.description = txn_update.description
    if txn_update.payment_method is not None:
        txn.payment_method = txn_update.payment_method
    if txn_update.date is not None:
        txn.date = txn_update.date

    db.commit()
    db.refresh(txn)
    return txn


@router.delete("/{txn_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    txn_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a transaction record from Supabase and local DB."""
    # 1. Supabase delete
    deleted = False
    try:
        from app.services.supabase_service import SupabaseService
        deleted = SupabaseService.delete_transaction(str(current_user.id), str(txn_id))
    except Exception:
        pass

    # 2. Local DB delete
    try:
        uid_int = int(current_user.id)
        tid_int = int(txn_id)
        txn = db.query(Transaction).filter(Transaction.id == tid_int, Transaction.user_id == uid_int).first()
        if txn:
            db.delete(txn)
            db.commit()
            deleted = True
    except Exception:
        pass

    if not deleted:
        # If already deleted or not found
        return None
    return None
