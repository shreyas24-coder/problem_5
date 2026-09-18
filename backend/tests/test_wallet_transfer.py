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

    # 3. Add income of 50,000 and expense of 10,000 -> General available = 40,000
    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "INCOME", "amount": 50000.0, "category": "Salary", "date": today},
    )
    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "EXPENSE", "amount": 10000.0, "category": "Rent", "date": today},
    )

    # Check dashboard before transfer
    dash_res1 = client.get("/api/dashboard/", headers=auth_headers)
    assert dash_res1.json()["net_balance"] == 40000.0
    assert dash_res1.json()["general_available_savings"] == 40000.0
    assert dash_res1.json()["locked_goal_savings"] == 0.0

    # 4. Deposit 25,000 into MacBook goal
    dep_ok = client.post(
        f"/api/goals/{goal_id}/deposit",
        headers=auth_headers,
        json={"amount": 25000.0},
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


    # Verify a GOAL_TRANSFER transaction was recorded in transaction history
    txns_res = client.get("/api/transactions/?type=GOAL_TRANSFER", headers=auth_headers)
    assert txns_res.status_code == 200
    txns = txns_res.json()
    assert len(txns) == 1
    assert txns[0]["type"] == "GOAL_TRANSFER"
    assert txns[0]["amount"] == 25000.0

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
