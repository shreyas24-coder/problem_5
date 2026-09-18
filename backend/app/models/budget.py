import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class BudgetBoundary(Base):
    __tablename__ = "budget_boundaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    category = Column(String, nullable=True)  # None for overall total budget, or specific category like "Food"
    limit_amount = Column(Float, nullable=False)
    month = Column(Integer, nullable=False)  # 1-12
    year = Column(Integer, nullable=False)   # e.g. 2026
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    # Unique constraint so a user has only 1 overall or category limit per month/year
    __table_args__ = (
        UniqueConstraint("user_id", "category", "month", "year", name="uq_user_budget_category_month_year"),
    )

    user = relationship("User", back_populates="budgets")
