from typing import List, Optional
import datetime
from pydantic import BaseModel, ConfigDict


class DailyShortOut(BaseModel):
    id: int
    title: str
    content: str
    category: str
    tag: str

    model_config = ConfigDict(from_attributes=True)


class StreakCheckInResponse(BaseModel):
    message: str
    current_streak: int
    longest_streak: int
    already_checked_in: bool
    last_check_in: Optional[datetime.date] = None


class UserStreakOut(BaseModel):
    current_streak: int
    longest_streak: int
    last_check_in: Optional[datetime.date] = None


class ArticleOut(BaseModel):
    id: int
    title: str
    summary: str
    content: str
    category: str
    read_time_minutes: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class QuizQuestionOut(BaseModel):
    id: int
    quiz_topic: str
    question: str
    options: List[str]


class QuizAnswerSubmission(BaseModel):
    question_id: int
    selected_option_index: int


class QuizSubmissionRequest(BaseModel):
    quiz_topic: str
    answers: List[QuizAnswerSubmission]


class QuizQuestionResult(BaseModel):
    question_id: int
    question: str
    selected_option: int
    correct_option: int
    is_correct: bool
    explanation: str


class QuizResultOut(BaseModel):
    quiz_topic: str
    score: int
    total_questions: int
    percentage: float
    results: List[QuizQuestionResult]
