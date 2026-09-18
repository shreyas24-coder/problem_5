def test_security_chatbot_detects_high_risk_scam(client, auth_headers):
    # Suspicious prompt with OTP and immediate account block
    payload = {
        "message": "Someone claiming to be from my bank called saying my account is suspended and asked me to immediately share the OTP I just received.",
    }
    res = client.post("/api/security-chat/", headers=auth_headers, json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_level"] == "HIGH"
    assert len(data["red_flags"]) > 0
    assert len(data["recommendations"]) > 0
    assert "Disclaimer" in data["disclaimer"]


def test_security_chatbot_detects_qr_code_scam(client, auth_headers):
    payload = {
        "message": "A buyer on OLX asked me to scan a QR code to receive money for my old textbook.",
    }
    res = client.post("/api/security-chat/", headers=auth_headers, json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_level"] == "HIGH"
    assert any("QR" in rf for rf in data["red_flags"])


def test_security_chatbot_safe_query(client, auth_headers):
    payload = {
        "message": "What is the 50/30/20 rule and how does compounding interest work for my savings?",
    }
    res = client.post("/api/security-chat/", headers=auth_headers, json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_level"] == "LOW"


def test_security_chat_history(client, auth_headers):
    client.post(
        "/api/security-chat/",
        headers=auth_headers,
        json={"message": "I received an SMS claiming I won 10 lakh lottery."},
    )
    history_res = client.get("/api/security-chat/history", headers=auth_headers)
    assert history_res.status_code == 200
    history = history_res.json()
    assert len(history) >= 1
    assert "lottery" in history[0]["user_message"]
