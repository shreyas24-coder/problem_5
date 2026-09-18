import datetime
from sqlalchemy.orm import Session
from app.models.user import UserStreak


def record_user_check_in(db: Session, user_id: int) -> dict:
    """
    Records daily engagement check-in, maintaining streak continuity.
    - If checked in today: returns current streak without change.
    - If checked in yesterday: increments streak by 1.
    - If broken or first time: resets streak to 1.
    """
    today = datetime.date.today()
    streak = db.query(UserStreak).filter(UserStreak.user_id == user_id).first()

    if not streak:
        streak = UserStreak(
            user_id=user_id,
            current_streak=1,
            longest_streak=1,
            last_check_in=today,
        )
        db.add(streak)
        db.commit()
        db.refresh(streak)
        return {
            "message": "Welcome! You started your daily financial learning streak!",
            "current_streak": 1,
            "longest_streak": 1,
            "already_checked_in": False,
            "last_check_in": today,
        }

    # If already checked in today
    if streak.last_check_in == today:
        return {
            "message": "You're already checked in for today! Keep up the great work!",
            "current_streak": streak.current_streak,
            "longest_streak": streak.longest_streak,
            "already_checked_in": True,
            "last_check_in": today,
        }

    yesterday = today - datetime.timedelta(days=1)
    if streak.last_check_in == yesterday:
        streak.current_streak += 1
        msg = f"Awesome! Streak extended to {streak.current_streak} days in a row! 🔥"
    else:
        # Streak was broken
        streak.current_streak = 1
        msg = "Daily streak reset. New day, new learning streak started! 🚀"

    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak

    streak.last_check_in = today
    db.commit()
    db.refresh(streak)

    return {
        "message": msg,
        "current_streak": streak.current_streak,
        "longest_streak": streak.longest_streak,
        "already_checked_in": False,
        "last_check_in": today,
    }


def get_user_streak(db: Session, user_id: int) -> dict:
    """Retrieve current streak stats without updating check-in."""
    streak = db.query(UserStreak).filter(UserStreak.user_id == user_id).first()
    if not streak:
        return {
            "current_streak": 0,
            "longest_streak": 0,
            "last_check_in": None,
        }
    return {
        "current_streak": streak.current_streak,
        "longest_streak": streak.longest_streak,
        "last_check_in": streak.last_check_in,
    }
