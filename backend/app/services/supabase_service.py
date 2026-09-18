import datetime
import calendar
from typing import Optional, List, Dict, Any
from app.supabase_client import supabase


class SupabaseService:
    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        """Fetch user by email from Supabase users table."""
        res = supabase.table("users").select("*").eq("email", email.lower().strip()).limit(1).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        """Fetch user by UUID from Supabase users table."""
        res = supabase.table("users").select("*").eq("id", str(user_id)).limit(1).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]
        return None

    @staticmethod
    def create_user(
        email: str,
        password: str,
        full_name: str,
        monthly_income: float = 0.0,
        monthly_budget_cap: float = 0.0
    ) -> Dict[str, Any]:
        """Create user in Supabase Auth and public.users table."""
        clean_email = email.lower().strip()
        auth_res = supabase.auth.admin.create_user({
            "email": clean_email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {"name": full_name}
        })
        user_id = auth_res.user.id

        user_row = {
            "id": user_id,
            "name": full_name,
            "email": clean_email,
            "monthly_income": float(monthly_income),
            "monthly_budget_cap": float(monthly_budget_cap)
        }
        res = supabase.table("users").insert(user_row).execute()
        return res.data[0] if res.data else user_row

    @staticmethod
    def update_user_profile(
        user_id: str,
        name: Optional[str] = None,
        monthly_income: Optional[float] = None,
        monthly_budget_cap: Optional[float] = None
    ) -> Dict[str, Any]:
        """Update user profile in Supabase."""
        updates: Dict[str, Any] = {}
        if name is not None:
            updates["name"] = name
        if monthly_income is not None:
            updates["monthly_income"] = float(monthly_income)
        if monthly_budget_cap is not None:
            updates["monthly_budget_cap"] = float(monthly_budget_cap)

        if updates:
            res = supabase.table("users").update(updates).eq("id", str(user_id)).execute()
            if res.data:
                return res.data[0]
        return SupabaseService.get_user_by_id(user_id) or {}

    # --- TRANSACTIONS ---

    @staticmethod
    def get_transactions(
        user_id: str,
        txn_type: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Fetch transactions from Supabase for a given user."""
        query = supabase.table("transactions").select("*").eq("user_id", str(user_id))
        if txn_type:
            query = query.eq("type", txn_type.upper())
        if category:
            query = query.eq("category", category)
        res = query.order("timestamp", desc=True).limit(limit).execute()
        return res.data or []

    @staticmethod
    def create_transaction(
        user_id: str,
        amount: float,
        txn_type: str,
        merchant_name: str,
        category: str = "General",
        linked_goal_id: Optional[str] = None,
        timestamp: Optional[str] = None
    ) -> Dict[str, Any]:
        """Insert a transaction into Supabase."""
        # Normalize type to UPPERCASE
        clean_type = "INCOME" if txn_type.upper() in ["INCOME", "INFLOW", "CREDIT"] else "EXPENSE"
        
        row = {
            "user_id": str(user_id),
            "amount": float(amount),
            "type": clean_type,
            "merchant_name": merchant_name.strip(),
            "category": category.strip(),
            "linked_goal_id": str(linked_goal_id) if linked_goal_id else None,
            "timestamp": timestamp or datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        res = supabase.table("transactions").insert(row).execute()
        return res.data[0] if res.data else row

    @staticmethod
    def delete_transaction(user_id: str, txn_id: str) -> bool:
        """Delete a transaction from Supabase."""
        res = supabase.table("transactions").delete().eq("id", str(txn_id)).eq("user_id", str(user_id)).execute()
        return bool(res.data and len(res.data) > 0)

    # --- SAVINGS GOALS ---

    @staticmethod
    def get_goals(user_id: str) -> List[Dict[str, Any]]:
        """Fetch all savings goals from Supabase for a given user."""
        res = supabase.table("savings_goals").select("*").eq("user_id", str(user_id)).order("created_at", desc=False).execute()
        return res.data or []

    @staticmethod
    def create_goal(
        user_id: str,
        title: str,
        target_amount: float,
        goal_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a savings goal in Supabase."""
        # Allowed values for goal_type constraint: 'SPECIFIC_PURCHASE', 'GENERAL', or None
        clean_type = "SPECIFIC_PURCHASE"
        if goal_type:
            gt_upper = goal_type.upper()
            if "PURCHASE" in gt_upper or "SPECIFIC" in gt_upper:
                clean_type = "SPECIFIC_PURCHASE"
            elif "GENERAL" in gt_upper:
                clean_type = "GENERAL"

        row = {
            "user_id": str(user_id),
            "title": title.strip(),
            "target_amount": float(target_amount),
            "current_amount": 0.0,
            "goal_type": clean_type
        }
        res = supabase.table("savings_goals").insert(row).execute()
        return res.data[0] if res.data else row

    @staticmethod
    def deposit_to_goal(user_id: str, goal_id: str, amount: float) -> Dict[str, Any]:
        """Deposit money into a goal (wallet-transfer mechanic)."""
        # 1. Fetch current goal
        g_res = supabase.table("savings_goals").select("*").eq("id", str(goal_id)).eq("user_id", str(user_id)).single().execute()
        if not g_res.data:
            raise ValueError("Goal not found")
        goal = g_res.data

        # 2. Check general available savings
        summary = SupabaseService.get_dashboard_summary(user_id)
        available_savings = summary["general_available_savings"]
        if amount > available_savings:
            raise ValueError(f"Insufficient general available savings (Available: ₹{available_savings:,.2f})")

        new_amt = float(goal.get("current_amount", 0.0)) + float(amount)
        # 3. Update goal
        up_res = supabase.table("savings_goals").update({"current_amount": new_amt}).eq("id", str(goal_id)).execute()
        updated_goal = up_res.data[0] if up_res.data else goal

        # 4. Record wallet transfer transaction
        SupabaseService.create_transaction(
            user_id=user_id,
            amount=amount,
            txn_type="EXPENSE",
            merchant_name=f"Goal Lockbox: {goal.get('title', 'Goal')}",
            category="Savings Goal",
            linked_goal_id=goal_id
        )

        return updated_goal

    @staticmethod
    def withdraw_from_goal(user_id: str, goal_id: str, amount: float) -> Dict[str, Any]:
        """Withdraw money from a goal back to available wallet."""
        g_res = supabase.table("savings_goals").select("*").eq("id", str(goal_id)).eq("user_id", str(user_id)).single().execute()
        if not g_res.data:
            raise ValueError("Goal not found")
        goal = g_res.data

        cur_amt = float(goal.get("current_amount", 0.0))
        if amount > cur_amt:
            raise ValueError(f"Cannot withdraw ₹{amount:,.2f}; goal only has ₹{cur_amt:,.2f} locked.")

        new_amt = max(0.0, cur_amt - float(amount))
        up_res = supabase.table("savings_goals").update({"current_amount": new_amt}).eq("id", str(goal_id)).execute()
        updated_goal = up_res.data[0] if up_res.data else goal

        # Record wallet transfer transaction back as Income / Inflow
        SupabaseService.create_transaction(
            user_id=user_id,
            amount=amount,
            txn_type="INCOME",
            merchant_name=f"Goal Release: {goal.get('title', 'Goal')}",
            category="Goal Withdrawal",
            linked_goal_id=goal_id
        )

        return updated_goal

    @staticmethod
    def delete_goal(user_id: str, goal_id: str) -> bool:
        """Delete a savings goal."""
        res = supabase.table("savings_goals").delete().eq("id", str(goal_id)).eq("user_id", str(user_id)).execute()
        return bool(res.data and len(res.data) > 0)

    # --- SCAM LOGS ---

    @staticmethod
    def log_scam(raw_content: str, risk_score: int, source_type: Optional[str] = "SMS") -> Dict[str, Any]:
        """Insert scan result into Supabase scam_logs table."""
        # Only 'SMS' or None is accepted by check constraint
        clean_source = "SMS" if (source_type and "SMS" in source_type.upper()) else None
        row = {
            "source_type": clean_source,
            "raw_content": raw_content[:500],
            "risk_score": int(risk_score)
        }
        res = supabase.table("scam_logs").insert(row).execute()
        return res.data[0] if res.data else row

    # --- DASHBOARD & METRICS ---

    @staticmethod
    def get_dashboard_summary(user_id: str) -> Dict[str, Any]:
        """Calculate complete financial dashboard summary directly from Supabase."""
        txns = SupabaseService.get_transactions(user_id, limit=500)
        goals = SupabaseService.get_goals(user_id)
        user_info = SupabaseService.get_user_by_id(user_id) or {}

        # Income vs Expenses
        total_income = sum(float(t["amount"]) for t in txns if t.get("type") == "INCOME")
        total_expenses = sum(float(t["amount"]) for t in txns if t.get("type") == "EXPENSE")
        total_goal_deposits = sum(float(g.get("current_amount", 0.0)) for g in goals)

        # Accounting Model:
        # Liquid Balance = total_income - total_expenses
        net_balance = max(0.0, total_income - total_expenses)
        general_available_savings = net_balance

        savings_rate = 0.0
        if total_income > 0:
            savings_rate = round((total_goal_deposits / total_income) * 100.0, 1)

        # Category Breakdown
        cat_totals: Dict[str, float] = {}
        for t in txns:
            if t.get("type") == "EXPENSE":
                c = t.get("category") or "General"
                cat_totals[c] = cat_totals.get(c, 0.0) + float(t["amount"])

        category_spending = []
        for c, amt in sorted(cat_totals.items(), key=lambda x: x[1], reverse=True):
            pct = round((amt / total_expenses * 100.0), 1) if total_expenses > 0 else 0.0
            category_spending.append({
                "category": c,
                "total_amount": round(amt, 2),
                "percentage": pct
            })

        # 6-Month Monthly Trends
        now = datetime.datetime.now(datetime.timezone.utc)
        monthly_trends = []
        for i in range(5, -1, -1):
            m = now.month - i
            y = now.year
            while m <= 0:
                m += 12
                y -= 1

            # Filter txns for that month/year
            m_inc = 0.0
            m_exp = 0.0
            for t in txns:
                ts = t.get("timestamp")
                if ts:
                    try:
                        dt = datetime.datetime.fromisoformat(ts.replace("Z", "+00:00"))
                        if dt.month == m and dt.year == y:
                            if t.get("type") == "INCOME":
                                m_inc += float(t["amount"])
                            elif t.get("type") == "EXPENSE":
                                m_exp += float(t["amount"])
                    except Exception:
                        pass

            monthly_trends.append({
                "month_name": calendar.month_name[m][:3],
                "month": m,
                "year": y,
                "income": round(m_inc, 2),
                "expense": round(m_exp, 2),
                "net_savings": round(m_inc - m_exp, 2)
            })

        return {
            "net_balance": round(net_balance, 2),
            "general_available_savings": round(general_available_savings, 2),
            "locked_goal_savings": round(total_goal_deposits, 2),
            "total_income": round(total_income, 2),
            "total_expenses": round(total_expenses, 2),
            "total_goal_deposits": round(total_goal_deposits, 2),
            "savings_rate_pct": savings_rate,
            "current_streak": 3,
            "category_spending": category_spending,
            "monthly_trend": monthly_trends,
            "budget_alerts": []
        }
