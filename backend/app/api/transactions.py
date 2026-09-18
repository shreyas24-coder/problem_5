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
    Manually record an income or expenditure entry.
    Supports young adults logging daily transactions.
    """
    txn = Transaction(
        user_id=current_user.id,
        type=txn_in.type.value,
        amount=txn_in.amount,
        category=txn_in.category,
        description=txn_in.description,
        payment_method=txn_in.payment_method or "UPI",
        date=txn_in.date,
        goal_id=txn_in.goal_id,
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
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetch user transaction history with filtering and search capabilities.
    """
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
        .offset(skip)
        .limit(limit)
        .all()
    )
    return transactions


@router.get("/{txn_id}", response_model=TransactionOut)
def get_transaction(
    txn_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve detailed information for a single transaction."""
    txn = (
        db.query(Transaction)
        .filter(Transaction.id == txn_id, Transaction.user_id == current_user.id)
        .first()
    )
    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")
    return txn


@router.put("/{txn_id}", response_model=TransactionOut)
def update_transaction(
    txn_id: int,
    txn_update: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Edit and correct an existing transaction record."""
    txn = (
        db.query(Transaction)
        .filter(Transaction.id == txn_id, Transaction.user_id == current_user.id)
        .first()
    )
    if not txn:
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
    txn_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a transaction record."""
    txn = (
        db.query(Transaction)
        .filter(Transaction.id == txn_id, Transaction.user_id == current_user.id)
        .first()
    )
    if not txn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")

    db.delete(txn)
    db.commit()
    return None
