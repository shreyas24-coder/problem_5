import json
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.education import DailyShort, Article, QuizQuestion, QuizSubmission
from app.schemas.education import (
    DailyShortOut,
    StreakCheckInResponse,
    ArticleOut,
    QuizQuestionOut,
    QuizSubmissionRequest,
    QuizResultOut,
    QuizQuestionResult,
)
from app.services.auth_service import get_current_user
from app.services.streak_service import record_user_check_in

router = APIRouter(prefix="/education", tags=["Financial Education Hub & Daily Shorts"])


# --- DAILY SHORTS & STREAKS ---

@router.get("/shorts", response_model=List[DailyShortOut])
def get_daily_shorts(
    category: Optional[str] = None,
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Retrieve bite-sized financial learning shorts."""
    query = db.query(DailyShort)
    if category:
        query = query.filter(DailyShort.category.ilike(f"%{category}%"))
    return query.limit(limit).all()


@router.get("/shorts/today", response_model=DailyShortOut)
def get_today_short(db: Session = Depends(get_db)):
    """Fetch today's featured daily financial short."""
    count = db.query(DailyShort).count()
    if count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No daily shorts available.")
    
    # Pick a rotating item based on the day of the year
    day_of_year = datetime.date.today().timetuple().tm_yday
    index = day_of_year % count
    short = db.query(DailyShort).offset(index).first()
    if not short:
        short = db.query(DailyShort).first()
    return short


@router.post("/check-in", response_model=StreakCheckInResponse)
def perform_daily_check_in(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Check-in to maintain daily financial learning streak.
    Increments consecutive streak or resets if broken.
    """
    result = record_user_check_in(db, current_user.id)
    return StreakCheckInResponse(**result)


# --- ARTICLES ---

@router.get("/articles", response_model=List[ArticleOut])
def list_articles(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List educational articles covering Budgeting, Credit, Scam Protection, and Investing."""
    query = db.query(Article)
    if category:
        query = query.filter(Article.category.ilike(f"%{category}%"))
    return query.order_by(Article.created_at.desc()).all()


@router.get("/articles/{article_id}", response_model=ArticleOut)
def get_article(article_id: int, db: Session = Depends(get_db)):
    """Read full content of an educational article."""
    art = db.query(Article).filter(Article.id == article_id).first()
    if not art:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found.")
    return art


# --- QUIZZES ---

@router.get("/quizzes/topics", response_model=List[str])
def list_quiz_topics(db: Session = Depends(get_db)):
    """List available quiz topics/categories."""
    topics = db.query(QuizQuestion.quiz_topic).distinct().all()
    return [t[0] for t in topics]


@router.get("/quizzes/{quiz_topic}", response_model=List[QuizQuestionOut])
def get_quiz_by_topic(quiz_topic: str, db: Session = Depends(get_db)):
    """
    Get all questions for a specific quiz topic.
    NOTE: Correct answers are omitted to maintain integrity.
    """
    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_topic == quiz_topic).all()
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No quiz found for topic '{quiz_topic}'.",
        )

    return [
        QuizQuestionOut(
            id=q.id,
            quiz_topic=q.quiz_topic,
            question=q.question,
            options=json.loads(q.options_json),
        )
        for q in questions
    ]


@router.post("/quizzes/submit", response_model=QuizResultOut)
def submit_quiz_answers(
    sub_in: QuizSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submit answers for a quiz.
    Scores answers, provides explanations, and saves progress.
    """
    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_topic == sub_in.quiz_topic).all()
    if not questions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz topic not found.")

    question_map = {q.id: q for q in questions}
    score = 0
    results: List[QuizQuestionResult] = []

    for ans in sub_in.answers:
        q = question_map.get(ans.question_id)
        if not q:
            continue

        is_correct = (ans.selected_option_index == q.correct_option_index)
        if is_correct:
            score += 1

        results.append(
            QuizQuestionResult(
                question_id=q.id,
                question=q.question,
                selected_option=ans.selected_option_index,
                correct_option=q.correct_option_index,
                is_correct=is_correct,
                explanation=q.explanation,
            )
        )

    total_q = len(results)
    percentage = (score / total_q * 100.0) if total_q > 0 else 0.0

    # Record submission
    submission = QuizSubmission(
        user_id=current_user.id,
        quiz_topic=sub_in.quiz_topic,
        score=score,
        total_questions=total_q,
    )
    db.add(submission)
    db.commit()

    return QuizResultOut(
        quiz_topic=sub_in.quiz_topic,
        score=score,
        total_questions=total_q,
        percentage=round(percentage, 1),
        results=results,
    )
