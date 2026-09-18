# Kavach — Digital Money Copilot for Bharat's UPI Generation

Kavach is an accessible, mobile-first money copilot designed for India's first digital-payment generation. It provides pre-transaction scam detection, irregular income budgeting, and micro-mandate audits.

![Kavach Preview](https://img.shields.io/badge/Status-Live%20Demo%20Ready-success)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%203-38bdf8)
![WCAG](https://img.shields.io/badge/Accessibility-WCAG%20AA-emerald)

---

## 🌟 Key Features

### 1. Pre-Transaction Heuristic Scanner (Hero Interactive Demo)
- **Real-Time Detection:** Evaluates payment links and text requests for known collect request traps and VPA spoofing in under 3 seconds.
- **Mock Threat Logic:** Testing with `"Urgent: Claim your ₹4,999 refund here"` triggers a 2-second real-time verification sequence followed by a high-contrast Red DANGER card explaining collect request mechanics:
  > *"This is a collect request. Approving it takes money from you. Refunds are never collect requests."*
- **One-Click Demo Fill:** Built-in presenter test chip allows 1-tap population of test cases for presentations and live demo recordings.

### 2. The Three Core Pillars
- **🛡️ SHIELD:** Pre-transaction scam checks in under 3 seconds, blocking fake OLX buyer QR codes and deceptive cashback intents.
- **💼 SPEND:** Tracks irregular income, college stipends, and freelance gig payouts rather than assuming fixed 30-day corporate salaries.
- **💰 SAVE:** Discovers forgotten ₹99 AutoPay mandates from expired free trials and channels them directly into automated savings goals.

### 3. Impact & Trust
- **FY26 UPI Intelligence:** Highlights the critical context: *"₹805 crore was lost to UPI fraud up to November of FY26. Kavach stops the tap before the money leaves."*
- **Zero-Storage Privacy:** Non-custodial architecture with zero UPI PIN storage and 256-bit client-side sandboxing.

---

## 🚀 Getting Started

### Option 1: Instant Browser Preview (Zero Installation)
Simply open `index.html` in any modern web browser, or launch a local server:

```bash
# Using Python
python -m http.server 3000

# Using Node / npx
npx serve .
```
Navigate to `http://localhost:3000` in your browser.

### Option 2: React Component
Import `App.jsx` into your Vite, Next.js, or Create React App project with `tailwindcss` and `lucide-react` installed:

```bash
npm install lucide-react
```

---

## ♿ Accessibility & Design Standards
- **WCAG AA Compliance:** Minimum 4.5:1 (up to 9:1) text contrast on high-visibility alert states.
- **Touch-First Navigation:** Minimum `48px` to `56px` tap targets for all buttons and interactive controls.
- **Legible Typography:** 16px minimum font size for body and form fields to prevent mobile browser zoom bugs.
- **Bilingual Toggle:** Seamless English and हिन्दी (Hindi) switcher.