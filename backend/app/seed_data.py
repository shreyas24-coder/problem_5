import json
import datetime
from sqlalchemy.orm import Session

from app.models.education import DailyShort, Article, QuizQuestion
from app.models.user import User, UserStreak
from app.models.transaction import Transaction
from app.models.budget import BudgetBoundary
from app.models.goal import FinancialGoal
from app.services.auth_service import hash_password

DAILY_SHORTS = [
    {
        "title": "The 50/30/20 Budgeting Rule",
        "content": "Divide your monthly income into 3 buckets: 50% for Needs (rent, groceries, bills), 30% for Wants (dining out, entertainment), and 20% for Savings or Debt Payoff. Simple and powerful.",
        "category": "Budgeting Tip",
        "tag": "#503020Rule",
    },
    {
        "title": "Golden Rule of UPI QR Codes",
        "content": "Scanning a QR code is ONLY required to PAY money out of your account. You NEVER need to scan a QR code or enter your UPI PIN to RECEIVE funds.",
        "category": "Scam Alert",
        "tag": "#FraudWatch",
    },
    {
        "title": "The Power of Starting at 20",
        "content": "Investing ₹2,000/month at 12% returns from age 20 gives you over ₹2.3 Crores by age 55. Waiting until 30 cuts that figure by more than half. Time is your greatest asset!",
        "category": "Investing 101",
        "tag": "#Compounding",
    },
    {
        "title": "The 3-Month Emergency Cushion",
        "content": "Before investing in stocks or buying luxury items, stash away 3-6 months of basic living expenses into a liquid savings account. This shields you from debt during emergencies.",
        "category": "Emergency Fund",
        "tag": "#SafetyFirst",
    },
    {
        "title": "Spotting Phishing SMS & Links",
        "content": "Banks will never send SMS with shortened links (like bit.ly) claiming your account or PAN is blocked. Always open your verified mobile banking app directly.",
        "category": "Scam Alert",
        "tag": "#CyberSecurity",
    },
    {
        "title": "Credit Cards: Friend or Foe?",
        "content": "Credit cards are free 30-day loans with rewards IF you pay the full statement balance every single month. Paying only the 'minimum due' triggers 36-45% annualized interest!",
        "category": "Credit Smart",
        "tag": "#CreditScore",
    },
]

ARTICLES = [
    {
        "title": "A Beginner's Guide to Smart Budgeting for College Students",
        "summary": "Mastering cash flow with limited allowances or stipends without giving up your social life.",
        "category": "Budgeting",
        "read_time_minutes": 4,
        "content": """Budgeting does not mean giving up on the things that bring you joy; it means making conscious decisions about where your money goes.

1. Track Before You Restrict
Before imposing strict rules, record every expense for 30 days. You will likely uncover 'money leaks' — small recurring expenses like unused subscriptions or impulse snacks that quietly add up to thousands each month.

2. Fixed vs. Variable Expenses
Separate fixed needs (room rent, tuition, transit passes) from variable wants (eating out, tech upgrades). Ensure fixed commitments are met the day your allowance or paycheck arrives.

3. The Dedicated Purchase Lockbox
If there is a high-ticket item you desire (such as a gaming laptop or concert ticket), do not dip into your general emergency buffer. Create a designated goal lockbox and transfer surplus savings systematically. When you reach the target, you buy it guilt-free!""",
    },
    {
        "title": "Recognizing Modern Digital Fraud & Cyber Scams in 2026",
        "summary": "A deep dive into social engineering, fake work-from-home tasks, and how scammers exploit urgency.",
        "category": "Digital Security",
        "read_time_minutes": 5,
        "content": """Digital payments in India and across the globe have made moving money seamless, but scammers have evolved beyond crude emails into psychological manipulation.

1. The Urgency Trap
Scammers always create high pressure: 'Your electricity will be cut in 2 hours', or 'Your account will be suspended today'. They do this so you act on impulse before consulting someone you trust.

2. The Part-Time Job / Telegram Task Trap
You receive a WhatsApp message promising ₹3,000 to ₹8,000 daily for liking YouTube videos or rating Google maps. At first, they pay you ₹200 to build trust. Then they require you to deposit ₹5,000 into a 'VIP prepaid task' to withdraw your profits. Once you transfer the money, they demand more or disappear.

3. Screen-Sharing Applications
Fraudsters posing as bank support or courier delivery agents ask you to install apps like AnyDesk, TeamViewer, or RustDesk to 'resolve a failed KYC or delivery issue'. These apps beam your screen live, allowing the scammer to capture your OTP as it arrives.

The Golden Defense:
Never share OTPs, never scan a QR code to receive money, and never install screen-sharing software at the request of an unknown caller.""",
    },
    {
        "title": "Demystifying Investments: From Savings to Mutual Funds",
        "summary": "Learn how inflation erodes idle cash and how young adults can begin index investing.",
        "category": "Investing Basics",
        "read_time_minutes": 6,
        "content": """Leaving your savings purely in a standard savings account earning 3% per annum while inflation sits at 6% means you are steadily losing purchasing power.

1. Understanding Inflation
If a cup of coffee costs ₹100 today, next year it may cost ₹106. Money sitting under your mattress buys less every single year.

2. Systematic Investment Plans (SIPs)
An SIP is an automated approach to investing a fixed sum (as little as ₹500/month) into mutual funds regularly. By investing across market peaks and troughs, you benefit from rupee-cost averaging without needing to time the market.

3. Low-Cost Index Funds
For beginners, Broad Market Index Funds (like Nifty 50 or S&P 500) provide instant diversification across the country's top corporations with minimal expense ratios.""",
    },
]

QUIZ_QUESTIONS = [
    {
        "quiz_topic": "Digital Fraud Awareness",
        "question": "A buyer on an online marketplace says they want to pay you ₹5,000. They send you a UPI QR code and ask you to scan it and enter your PIN to receive the money. What should you do?",
        "options_json": json.dumps([
            "Scan the QR code and enter PIN quickly to collect funds.",
            "Refuse and report them. Scanning a QR code and entering PIN is strictly for debiting your account.",
            "Send them an OTP instead.",
            "Ask them to send a different QR code.",
        ]),
        "correct_option_index": 1,
        "explanation": "You NEVER enter your UPI PIN or scan a QR code to receive money. UPI PIN is exclusively used for authorizing payments outgoing from your account.",
    },
    {
        "quiz_topic": "Digital Fraud Awareness",
        "question": "You receive an SMS: 'Your bank account will be blocked within 2 hours due to pending KYC. Click http://bit.ly/bank-kyc-update to verify immediately.' What is the safest response?",
        "options_json": json.dumps([
            "Click the link and fill out the details immediately to avoid account suspension.",
            "Forward the link to friends to check if it's real.",
            "Ignore the link, report the SMS as spam, and open your bank's official app or call customer care to check.",
            "Reply to the SMS asking for bank officer credentials.",
        ]),
        "correct_option_index": 2,
        "explanation": "Banks never send shortened URLs like bit.ly warning of immediate account blocks. This is a classic phishing lure designed to steal credentials.",
    },
    {
        "quiz_topic": "Digital Fraud Awareness",
        "question": "A caller claiming to be from customer support asks you to download 'AnyDesk' or 'RustDesk' on your phone to resolve a refund issue. Should you comply?",
        "options_json": json.dumps([
            "Yes, customer support needs to see the screen to fix payment bugs.",
            "No! Remote desktop applications allow callers to view your screen and steal incoming OTPs.",
            "Yes, but only if they promise not to look at your passwords.",
            "Yes, if they sound polite and professional.",
        ]),
        "correct_option_index": 1,
        "explanation": "Remote access apps allow fraudsters to view your full mobile screen, including 2FA SMS and banking OTPs. Legitimate institutions never ask you to install screen-sharing software.",
    },
    {
        "quiz_topic": "First-Time Budgeting",
        "question": "According to the 50/30/20 budgeting framework, what percentage of your income should ideally go toward savings and debt reduction?",
        "options_json": json.dumps([
            "50%",
            "30%",
            "20%",
            "5%",
        ]),
        "correct_option_index": 2,
        "explanation": "The 50/30/20 rule allocates 50% to essential Needs, 30% to discretionary Wants, and 20% to Savings, investments, and debt paydown.",
    },
    {
        "quiz_topic": "First-Time Budgeting",
        "question": "What is the primary advantage of a dedicated 'Purchase Lockbox' goal over keeping all savings in one general balance?",
        "options_json": json.dumps([
            "It pays a higher interest rate from the bank.",
            "It mentally and digitally reserves funds so they are not accidentally spent on daily discretionary items.",
            "It prevents taxes from being calculated.",
            "It automatically buys the item once target is reached.",
        ]),
        "correct_option_index": 1,
        "explanation": "Segregating money into a locked goal ring-fences your savings, preventing lifestyle inflation or accidental spending of unallocated funds.",
    },
]


def seed_database(db: Session, create_demo_user: bool = True):
    """Seed initial daily shorts, articles, quizzes, and demo data if not already present."""
    # Seed Daily Shorts
    if db.query(DailyShort).count() == 0:
        for s in DAILY_SHORTS:
            db.add(DailyShort(**s))
        db.commit()

    # Seed Articles
    if db.query(Article).count() == 0:
        for a in ARTICLES:
            db.add(Article(**a))
        db.commit()

    # Seed Quizzes
    if db.query(QuizQuestion).count() == 0:
        for q in QUIZ_QUESTIONS:
            db.add(QuizQuestion(**q))
        db.commit()

    # Seed Demo User
    if create_demo_user:
        demo_email = "demo@technofora.com"
        demo_user = db.query(User).filter(User.email == demo_email).first()
        if not demo_user:
            demo_user = User(
                email=demo_email,
                hashed_password=hash_password("Demo@12345"),
                full_name="Alex Rivera",
                expected_monthly_savings=15000.0,
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            # Streak
            streak = UserStreak(
                user_id=demo_user.id,
                current_streak=5,
                longest_streak=7,
                last_check_in=datetime.date.today(),
            )
            db.add(streak)

            # Goals
            laptop_goal = FinancialGoal(
                user_id=demo_user.id,
                title="MacBook Air M3",
                description="Laptop upgrade for coding and design coursework",
                category="Specific Purchase",
                target_amount=95000.0,
                current_amount=35000.0,
                target_date=datetime.date.today() + datetime.timedelta(days=120),
                status="IN_PROGRESS",
            )
            db.add(laptop_goal)
            db.commit()
            db.refresh(laptop_goal)

            emergency_goal = FinancialGoal(
                user_id=demo_user.id,
                title="Emergency Buffer",
                description="3 months living expense buffer",
                category="Emergency",
                target_amount=40000.0,
                current_amount=20000.0,
                target_date=datetime.date.today() + datetime.timedelta(days=90),
                status="IN_PROGRESS",
            )
            db.add(emergency_goal)
            db.commit()

            today = datetime.date.today()
            # Budget Boundaries
            total_budget = BudgetBoundary(
                user_id=demo_user.id,
                category=None,
                limit_amount=30000.0,
                month=today.month,
                year=today.year,
            )
            food_budget = BudgetBoundary(
                user_id=demo_user.id,
                category="Food & Dining",
                limit_amount=10000.0,
                month=today.month,
                year=today.year,
            )
            db.add_all([total_budget, food_budget])

            # Sample Transactions
            transactions = [
                Transaction(
                    user_id=demo_user.id,
                    type="INCOME",
                    amount=50000.0,
                    category="Salary / Stipend",
                    description="Monthly internship stipend",
                    payment_method="NetBanking",
                    date=today - datetime.timedelta(days=15),
                ),
                Transaction(
                    user_id=demo_user.id,
                    type="INCOME",
                    amount=35000.0,
                    category="Freelance",
                    description="Web design freelance project",
                    payment_method="UPI",
                    date=today - datetime.timedelta(days=5),
                ),
                Transaction(
                    user_id=demo_user.id,
                    type="EXPENSE",
                    amount=12000.0,
                    category="Rent & Utilities",
                    description="Shared apartment rent",
                    payment_method="UPI",
                    date=today - datetime.timedelta(days=14),
                ),
                Transaction(
                    user_id=demo_user.id,
                    type="EXPENSE",
                    amount=8450.0,
                    category="Food & Dining",
                    description="Groceries & weekend dining with friends",
                    payment_method="UPI",
                    date=today - datetime.timedelta(days=3),
                ),
                Transaction(
                    user_id=demo_user.id,
                    type="EXPENSE",
                    amount=2200.0,
                    category="Transportation",
                    description="Metro monthly smart card recharge",
                    payment_method="Card",
                    date=today - datetime.timedelta(days=12),
                ),
                Transaction(
                    user_id=demo_user.id,
                    type="GOAL_TRANSFER",
                    amount=35000.0,
                    category="Goal Contribution",
                    description="Allocated to goal: 'MacBook Air M3'",
                    payment_method="Internal Transfer",
                    date=today - datetime.timedelta(days=4),
                    goal_id=laptop_goal.id,
                ),
            ]
            db.add_all(transactions)
            db.commit()
