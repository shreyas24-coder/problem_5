import datetime


def test_goal_wallet_transfer_mechanic(client, auth_headers):
    today = str(datetime.date.today())

    # 1. Create a goal: "MacBook Pro M3", target: 80,000
    goal_res = client.post(
        "/api/goals/",
        headers=auth_headers,
        json={
            "title": "MacBook Pro M3",
            "description": "For development and college projects",
            "target_amount": 80000.0,
            "category": "Specific Purchase",
        },
    )
    assert goal_res.status_code == 201
    goal = goal_res.json()
    goal_id = goal["id"]
    assert goal["current_amount"] == 0.0
    assert goal["progress_percentage"] == 0.0

    # 2. Try to deposit without income -> Insufficient funds 400 error!
    dep_fail = client.post(
        f"/api/goals/{goal_id}/deposit",
        headers=auth_headers,
        json={"amount": 10000.0},
    )
    assert dep_fail.status_code == 400
    assert "Insufficient General Available Savings" in dep_fail.json()["detail"]

    # 3. Add income of 50,000 and expense of 10,000
    # Under 50/30/20 auto-allocation:
    # 20% of 50,000 (₹10,000) is automatically deposited into the active goal!
    # Liquid available = 50,000 - 10,000 (expense) - 10,000 (auto-allocated goal deposit) = 30,000.
    inc_res = client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "INCOME", "amount": 50000.0, "category": "Salary", "date": today},
    )
    assert inc_res.status_code == 201
    inc_data = inc_res.json()
    assert inc_data.get("allocation_result") is not None
    assert inc_data["allocation_result"]["allocations"]["Savings & Investments"] == 10000.0

    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "EXPENSE", "amount": 10000.0, "category": "Rent", "date": today},
    )

    # Check dashboard before additional manual transfer
    dash_res1 = client.get("/api/dashboard/", headers=auth_headers)
    assert dash_res1.json()["net_balance"] == 30000.0
    assert dash_res1.json()["general_available_savings"] == 30000.0
    assert dash_res1.json()["locked_goal_savings"] == 10000.0

    # 4. Deposit additional 15,000 into MacBook goal (total in goal becomes 25,000)
    dep_ok = client.post(
        f"/api/goals/{goal_id}/deposit",
        headers=auth_headers,
        json={"amount": 15000.0},
    )
    assert dep_ok.status_code == 200
    dep_data = dep_ok.json()
    assert dep_data["new_goal_balance"] == 25000.0
    assert dep_data["general_available_savings"] == 15000.0

    # Verify dashboard reflects the lockbox split.
    # Under Model A accounting, net_balance is the TRUE liquid balance:
    #   50,000 income - 10,000 expense - 25,000 goal deposit = 15,000
    dash_res2 = client.get("/api/dashboard/", headers=auth_headers)
    assert dash_res2.json()["net_balance"] == 15000.0          # True liquid balance (goal deposit deducted)
    assert dash_res2.json()["locked_goal_savings"] == 25000.0  # Funds locked in goal
    assert dash_res2.json()["general_available_savings"] == 15000.0  # Equals net_balance in Model A

    # Verify GOAL_TRANSFER transactions were recorded in transaction history (auto-transfer + manual)
    txns_res = client.get("/api/transactions/?type=GOAL_TRANSFER", headers=auth_headers)
    assert txns_res.status_code == 200
    txns = txns_res.json()
    assert len(txns) == 2

    # 5. Withdraw 5,000 back to general savings
    with_ok = client.post(
        f"/api/goals/{goal_id}/withdraw",
        headers=auth_headers,
        json={"amount": 5000.0},
    )
    assert with_ok.status_code == 200
    with_data = with_ok.json()
    assert with_data["new_goal_balance"] == 20000.0
    assert with_data["general_available_savings"] == 20000.0

    # 6. Try to withdraw more than locked balance -> 400 error!
    with_fail = client.post(
        f"/api/goals/{goal_id}/withdraw",
        headers=auth_headers,
        json={"amount": 30000.0},
    )
    assert with_fail.status_code == 400
    assert "Only" in with_fail.json()["detail"]
