import datetime


def test_budget_boundaries_and_alerts(client, auth_headers):
    today = datetime.date.today()
    today_str = str(today)

    # 1. Set a total monthly budget limit of 10,000
    b_res = client.post(
        "/api/budgets/",
        headers=auth_headers,
        json={
            "category": None,
            "limit_amount": 10000.0,
            "month": today.month,
            "year": today.year,
        },
    )
    assert b_res.status_code == 201
    assert b_res.json()["status"] == "NORMAL"

    # 2. Add an expense of 5,000 -> 50% consumed -> NORMAL
    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "EXPENSE", "amount": 5000.0, "category": "Rent", "date": today_str},
    )
    alerts_1 = client.get("/api/budgets/alerts", headers=auth_headers).json()
    assert len(alerts_1) == 1
    assert alerts_1[0]["status"] == "NORMAL"
    assert alerts_1[0]["percentage"] == 50.0

    # 3. Add an expense of 3,500 -> total 8,500 -> 85% consumed -> APPROACHING
    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "EXPENSE", "amount": 3500.0, "category": "Shopping", "date": today_str},
    )
    alerts_2 = client.get("/api/budgets/alerts", headers=auth_headers).json()
    assert alerts_2[0]["status"] == "APPROACHING"
    assert alerts_2[0]["percentage"] == 85.0

    # 4. Add an expense of 2,000 -> total 10,500 -> 105% consumed -> EXCEEDED
    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "EXPENSE", "amount": 2000.0, "category": "Food", "date": today_str},
    )
    alerts_3 = client.get("/api/budgets/alerts", headers=auth_headers).json()
    assert alerts_3[0]["status"] == "EXCEEDED"
    assert alerts_3[0]["percentage"] == 105.0


def test_savings_tracker_endpoint(client, auth_headers):
    today = str(datetime.date.today())
    # User's expected monthly savings is 10,000 (from conftest fixture)

    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "INCOME", "amount": 30000.0, "category": "Salary", "date": today},
    )
    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "EXPENSE", "amount": 12000.0, "category": "Utilities", "date": today},
    )

    savings_res = client.get("/api/savings/", headers=auth_headers)
    assert savings_res.status_code == 200
    data = savings_res.json()
    assert data["total_income"] == 30000.0
    assert data["total_expenses"] == 12000.0
    assert data["actual_monthly_savings"] == 18000.0
    assert data["expected_monthly_savings"] == 10000.0
    assert data["is_on_track"] is True
    assert data["savings_variance"] == 8000.0
