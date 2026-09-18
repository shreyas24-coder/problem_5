# Technofora '26 — FinTech Track Backend
## Smart Personal Finance & Secure Digital Transactions

Backend API built with **FastAPI**, designed specifically for young adults and first-time budgeters. It integrates money tracking, savings goals, purchase lockboxes, daily financial literacy shorts, and an AI-driven digital fraud security chatbot into one unified platform.

---

## 🌟 Core Features

### 1. Interactive Financial Dashboard (`/api/dashboard`)
- Real-time aggregated financial position: Total Income, Total Expenses, Net Balance.
- **Dynamic Lockbox Split**: Separates **General Available Savings** (unallocated funds ready for daily use) from **Locked Goal Savings** (funds reserved for specific purchases).
- **Budget Status & Expenditure Alerts**: Real-time evaluation against user-defined limits (`NORMAL` < 80%, `APPROACHING` 80-100%, `EXCEEDED` ≥ 100%).
- **Visual Breakdown & Trends**: 6-month historical trends (income vs expense) and category-wise spending distributions for charts.
- **Daily Streak Badge**: Current and longest learning streak counts.

### 2. Transactions History & Management (`/api/transactions`)
- Manual transaction recording: `INCOME`, `EXPENSE`, and `GOAL_TRANSFER`.
- Filter by transaction type, category, date range, and free-text search.
- Full CRUD support (view, edit, and delete entries to correct errors).

### 3. Savings Tracker (`/api/savings`)
- Compares expected/planned monthly savings against actual accumulated savings.
- Clear split view: General Available Savings vs Locked Goal Savings.
- Savings rate calculation (% of income saved) and variance tracking.

### 4. Financial Security Chatbot (`/api/security-chat`)
- Powered by **Google Gemini API** (strictly isolated to fraud awareness and guidance).
- Detects digital scam patterns (OTP fraud, UPI QR code scams, urgency threats, fake job/task offers, phishing links).
- Returns Risk Level (`LOW`, `MEDIUM`, `HIGH`), detected Red Flags, and actionable safety recommendations.
- Features an intelligent rule-based offline fallback when no API key is supplied.
- Explicitly positioned as an awareness and guidance tool rather than a guaranteed fraud detector.

### 5. Personal Financial Goals & Purchase Lockboxes (`/api/goals`)
- Create milestone or specific purchase goals (e.g. "MacBook Air M3", "Emergency Fund").
- **The "Wallet-Transfer" Mechanic**:
  - `POST /api/goals/{id}/deposit`: Validates that requested funds do not exceed General Available Savings, moves funds into the goal, locks the balance, and logs a `GOAL_TRANSFER` transaction.
  - `POST /api/goals/{id}/withdraw`: Unlocks money back into General Available Savings.
- Automatic progress tracking and completion status.

### 6. Financial Education Hub & Daily Shorts (`/api/education`)
- **Daily Shorts**: Bite-sized financial tips (e.g. 50/30/20 rule, compounding, emergency cushions).
- **Daily Streak Tracker**: `POST /api/education/check-in` records consecutive engagement and maintains streaks.
- **Educational Articles**: Categorized guides on Budgeting, Digital Security, and Investing Basics.
- **Weekend Quizzes**: Interactive multiple-choice questionnaires with scoring and educational answer explanations.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Git (optional)

### 1. Setup Virtual Environment
```powershell
# Navigate to the backend directory
cd C:\Users\HP\.gemini\antigravity\scratch\fintech-backend

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
Key variables in `.env`:
- `DATABASE_URL`: Defaults to `sqlite:///./fintech.db` for instant local execution.
  To connect to **Supabase (PostgreSQL)**, set:
  `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API key. If left blank, the built-in offline fraud rule engine handles all scam queries automatically.
- `CORS_ORIGINS`: Comma-separated list of allowed frontend URLs (defaults to `http://localhost:3000,*`).

### 4. Run the Server
```powershell
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc Documentation: `http://127.0.0.1:8000/redoc`

---

## 🧑‍💻 Preloaded Demo Account

The database automatically initializes with sample data and a demonstration account:
- **Email:** `demo@technofora.com`
- **Password:** `Demo@12345`
- Preloaded with:
  - Income & Expense transactions (internship stipend, freelance, rent, dining)
  - Active goals ("MacBook Air M3", "Emergency Buffer")
  - Budget boundaries with active consumption alerts
  - A 5-day learning streak
  - Educational articles, daily shorts, and fraud awareness quizzes

---

## 🧪 Running Automated Tests

Run the complete test suite with `pytest`:
```powershell
pytest -v
```
All 18 tests cover:
- Authentication & JWT Authorization
- Transaction CRUD & filtering
- The Wallet-Transfer mechanic & overdraft protection
- Dashboard aggregations & 3-tier budget alerts (`NORMAL`, `APPROACHING`, `EXCEEDED`)
- Security chatbot scam detection
- Daily shorts, streak incrementation, and quiz scoring

---

## 📡 Key API Endpoints Summary

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register new user account |
| | `POST` | `/api/auth/login` | Log in and receive JWT token |
| | `GET` | `/api/auth/me` | Get current user profile |
| **Dashboard** | `GET` | `/api/dashboard/` | Full home screen aggregation & alerts |
| **Transactions** | `POST` | `/api/transactions/` | Create income/expense entry |
| | `GET` | `/api/transactions/` | List and filter transactions |
| | `PUT` | `/api/transactions/{id}` | Edit transaction details |
| | `DELETE` | `/api/transactions/{id}` | Delete transaction |
| **Budgets** | `POST` | `/api/budgets/` | Set or update budget limit |
| | `GET` | `/api/budgets/` | List budgets with spent % |
| | `GET` | `/api/budgets/alerts` | Get current month budget alerts |
| **Savings** | `GET` | `/api/savings/` | Expected vs actual savings tracking |
| **Goals** | `POST` | `/api/goals/` | Create specific purchase goal |
| | `GET` | `/api/goals/` | List all goals with progress % |
| | `POST` | `/api/goals/{id}/deposit` | **Wallet-Transfer**: Lock savings into goal |
| | `POST` | `/api/goals/{id}/withdraw` | Unlock funds back to general savings |
| **Chatbot** | `POST` | `/api/security-chat/` | Gemini AI fraud detection analysis |
| | `GET` | `/api/security-chat/history` | User past scam consultation history |
| **Education** | `GET` | `/api/education/shorts` | List daily learning shorts |
| | `GET` | `/api/education/shorts/today` | Today's featured short |
| | `POST` | `/api/education/check-in` | Record daily learning streak |
| | `GET` | `/api/education/articles` | List financial literacy articles |
| | `GET` | `/api/education/quizzes/{topic}` | Get quiz questions (answers hidden) |
| | `POST` | `/api/education/quizzes/submit` | Submit answers and receive score |

---

## 🛡️ Financial Security Chatbot Disclaimer

The Financial Security Chatbot is designed as an educational awareness and guidance tool for young adults. It is not a certified legal advisor or a guaranteed fraud detection system. Users are reminded never to share OTPs, PINs, or passwords with anyone.
