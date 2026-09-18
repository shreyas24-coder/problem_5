def test_register_success(client):
    payload = {
        "email": "student@college.edu",
        "password": "SecurePassword123!",
        "full_name": "Rohan Patel",
        "expected_monthly_savings": 5000.0,
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "student@college.edu"
    assert data["user"]["full_name"] == "Rohan Patel"


def test_register_duplicate_email_fails(client):
    payload = {
        "email": "duplicate@test.com",
        "password": "Pass12345Password!",
    }
    res1 = client.post("/api/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]


def test_login_flow(client):
    payload = {
        "email": "loginuser@test.com",
        "password": "CorrectPassword123!",
    }
    client.post("/api/auth/register", json=payload)

    # Login with correct password
    res_ok = client.post(
        "/api/auth/login",
        json={"email": "loginuser@test.com", "password": "CorrectPassword123!"},
    )
    assert res_ok.status_code == 200
    assert "access_token" in res_ok.json()

    # Login with wrong password
    res_wrong = client.post(
        "/api/auth/login",
        json={"email": "loginuser@test.com", "password": "WrongPassword!"},
    )
    assert res_wrong.status_code == 401


def test_get_current_user_profile(client, auth_headers):
    res = client.get("/api/auth/me", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "testuser@example.com"
    assert data["expected_monthly_savings"] == 10000.0


def test_update_profile(client, auth_headers):
    res = client.put(
        "/api/auth/me",
        headers=auth_headers,
        json={"full_name": "Updated Name", "expected_monthly_savings": 12000.0},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["full_name"] == "Updated Name"
    assert data["expected_monthly_savings"] == 12000.0
