import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    type = Column(String, nullable=False)  # INCOME, EXPENSE, GOAL_TRANSFER
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)  # Salary, Food, Shopping, Transport, Goal Contribution, etc.
    description = Column(Text, nullable=True)
    payment_method = Column(String, default="UPI")  # Cash, UPI, Card, NetBanking, Transfer
    date = Column(Date, default=datetime.date.today, nullable=False)
    goal_id = Column(Integer, ForeignKey("financial_goals.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    # Relationships
    user = relationship("User", back_populates="transactions")
    goal = relationship("FinancialGoal", back_populates="transactions")
