import datetime


def test_create_income_and_expense_transactions(client, auth_headers):
    # Create income
    income_payload = {
        "type": "INCOME",
        "amount": 25000.0,
        "category": "Stipend",
        "description": "Monthly college internship stipend",
        "payment_method": "UPI",
        "date": str(datetime.date.today()),
    }
    res_inc = client.post("/api/transactions/", headers=auth_headers, json=income_payload)
    assert res_inc.status_code == 201
    inc_data = res_inc.json()
    assert inc_data["amount"] == 25000.0
    assert inc_data["type"] == "INCOME"

    # Create expense
    expense_payload = {
        "type": "EXPENSE",
        "amount": 1500.0,
        "category": "Food & Dining",
        "description": "Dinner at cafe",
        "payment_method": "UPI",
        "date": str(datetime.date.today()),
    }
    res_exp = client.post("/api/transactions/", headers=auth_headers, json=expense_payload)
    assert res_exp.status_code == 201
    exp_data = res_exp.json()
    assert exp_data["amount"] == 1500.0
    assert exp_data["type"] == "EXPENSE"


def test_list_and_filter_transactions(client, auth_headers):
    today = str(datetime.date.today())
    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "INCOME", "amount": 10000.0, "category": "Salary", "date": today},
    )
    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "EXPENSE", "amount": 2000.0, "category": "Food", "date": today},
    )
    client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "EXPENSE", "amount": 1500.0, "category": "Transport", "date": today},
    )

    # Filter by type
    res_type = client.get("/api/transactions/?type=EXPENSE", headers=auth_headers)
    assert res_type.status_code == 200
    assert len(res_type.json()) == 2

    # Filter by category
    res_cat = client.get("/api/transactions/?category=Food", headers=auth_headers)
    assert res_cat.status_code == 200
    assert len(res_cat.json()) == 1
    assert res_cat.json()[0]["category"] == "Food"


def test_update_and_delete_transaction(client, auth_headers):
    today = str(datetime.date.today())
    create_res = client.post(
        "/api/transactions/",
        headers=auth_headers,
        json={"type": "EXPENSE", "amount": 500.0, "category": "Books", "date": today},
    )
    txn_id = create_res.json()["id"]

    # Update
    update_res = client.put(
        f"/api/transactions/{txn_id}",
        headers=auth_headers,
        json={"amount": 750.0, "description": "Updated book purchase"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["amount"] == 750.0
    assert update_res.json()["description"] == "Updated book purchase"

    # Delete
    del_res = client.delete(f"/api/transactions/{txn_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Verify not found
    get_res = client.get(f"/api/transactions/{txn_id}", headers=auth_headers)
    assert get_res.status_code == 404
