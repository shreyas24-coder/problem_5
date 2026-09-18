import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class DailyShort(Base):
    __tablename__ = "daily_shorts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, default="Budgeting Tip")  # Budgeting Tip, Scam Alert, Investing 101, Credit Rule
    tag = Column(String, default="#SaveSmart")
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=False)  # Budgeting, Digital Security, Investing Basics, Credit Cards
    read_time_minutes = Column(Integer, default=3)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_topic = Column(String, nullable=False, index=True)  # e.g. "Digital Fraud Awareness", "Budgeting 101"
    question = Column(Text, nullable=False)
    options_json = Column(Text, nullable=False)  # JSON-encoded array of options
    correct_option_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=False)


class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    quiz_topic = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    submitted_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="quiz_submissions")


class SecurityChatLog(Base):
    __tablename__ = "security_chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    user_message = Column(Text, nullable=False)
    bot_response = Column(Text, nullable=False)
    risk_level = Column(String, nullable=False)  # LOW, MEDIUM, HIGH
    red_flags_json = Column(Text, nullable=True)  # JSON list
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User", back_populates="chat_logs")
