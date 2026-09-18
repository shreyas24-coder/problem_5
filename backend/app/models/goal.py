import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class FinancialGoal(Base):
    __tablename__ = "financial_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String, nullable=False)  # e.g. "M3 MacBook Air", "Emergency Fund"
    description = Column(Text, nullable=True)
    category = Column(String, default="Specific Purchase")  # Specific Purchase, Milestone, Emergency
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0, nullable=False)  # Locked Savings in this goal
    target_date = Column(Date, nullable=True)
    status = Column(String, default="IN_PROGRESS")  # IN_PROGRESS, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    # Relationships
    user = relationship("User", back_populates="goals")
    transactions = relationship("Transaction", back_populates="goal")
