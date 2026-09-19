# Technofora '26 — Problem Statement 5 (FinTech)
## MONEYCRAFT — Smart Personal Finance & Secure Digital Transactions

MONEYCRAFT is a modern, mobile-first money copilot designed for India's digital-payment generation. It connects spending tracking, goal-based saving with the **Wallet-Transfer** lockbox mechanic, beginner-friendly financial education, and real-time AI pre-transaction fraud defense.

![Status](https://img.shields.io/badge/Status-Full%20Stack%20Integrated-success)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%203-38bdf8)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-Flash-orange)

---

## 👥 Team
1. Meet Madhwani
2. Shreyas Patel
3. Sulay Shah
4. Marut Patel
5. Sahaj Vala

---

## 🌟 The 6 Core Features (System Architecture Compliant)

1. **Interactive Financial Dashboard (`/dashboard`)**:
   - Real-time aggregates: liquid balance, income, expenses, and savings rate %.
   - Dynamic category allocation bar graph.
   - 6-month historical trajectory pulse.
   - User-defined budget boundary warning alerts.
   - Daily learning streak counter.

2. **Transactions History & Management (`/spend`)**:
   - Complete manual logging of inflows and outflows.
   - Full CRUD support (Add, View, Edit, Delete).
   - Category and type filtering.

3. **Savings Tracker (`/save`)**:
   - **General Available Savings** (liquid cash) vs. **Locked Goal Savings** (funds earmarked for specific goals).
   - Planned vs. actual savings comparison gauge with on-track indicator.
   - AutoPay Mandate Auditor to identify and cancel recurring subscription leaks.

4. **Financial Security Chatbot & Scam Shield (`/shield`, `/chat`)**:
   - Pre-transaction heuristic fraud checker stopping QR scams, deceptive collect requests, and fake refund links.
   - Powered by **Google Gemini API** with intelligent rule-based offline fallback.
   - Evaluates Risk Level (HIGH / MEDIUM / LOW), detected Red Flags, and actionable safety recommendations.

5. **Personal Financial Goals (`/goals`)**:
   - Milestone and "Specific Purchase" goal lockboxes.
   - **The Wallet-Transfer Mechanic**: Depositing money into a goal strictly deducts that exact sum from General Available Savings.
   - Real-time balance validation preventing deposits when unallocated savings are insufficient.
   - One-tap withdrawal returning funds back to liquid wallet.

6. **Financial Education Hub & Daily Shorts (`/quiz`)**:
   - Bite-sized Daily Shorts (50/30/20 rule, UPI QR golden rules, compounding power).
   - Interactive daily/weekend financial IQ quizzes.
   - Automatic score calculation and daily streak tracking.

---

## 🚀 Running the Full Stack Application

### 1. Backend (FastAPI)
```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs (Swagger UI): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Alternative ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 2. Frontend (React + Vite)
```powershell
cd frontend
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)
- Automatically proxies API requests to `http://127.0.0.1:8000`.

---

## ⚡ Instant Demo Credentials
For presentations, click **"⚡ Auto-Login Demo Profile"** on the login page or use:
- **Email:** `demo@technofora.com`
- **Password:** `Demo@12345`
- Pre-seeded with Alex Rivera's profile, a 5-day learning streak, MacBook Air M3 goal with ₹35,000 locked, and monthly budget boundaries.

---

## 🤖 Gemini API Key Setup (Optional)
The chatbot already operates with an offline heuristic analyzer. To enable live Google Gemini 2.5 Flash responses:
1. Open [`backend/.env`](file:///c:/Users/Meet%20Madhwani/OneDrive/Desktop/Technofora26/backend/.env)
2. Set your key:
   ```ini
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
3. Restart the backend server.
