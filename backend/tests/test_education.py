def test_daily_shorts_and_streak_check_in(client, auth_headers):
    # 1. Fetch daily shorts
    shorts_res = client.get("/api/education/shorts")
    assert shorts_res.status_code == 200
    shorts = shorts_res.json()
    assert len(shorts) > 0

    # 2. Fetch today's short
    today_short = client.get("/api/education/shorts/today")
    assert today_short.status_code == 200
    assert "title" in today_short.json()

    # 3. Perform daily check-in
    check_in_res1 = client.post("/api/education/check-in", headers=auth_headers)
    assert check_in_res1.status_code == 200
    data1 = check_in_res1.json()
    assert data1["current_streak"] == 1
    assert data1["already_checked_in"] is False

    # 4. Same day second check-in
    check_in_res2 = client.post("/api/education/check-in", headers=auth_headers)
    assert check_in_res2.status_code == 200
    data2 = check_in_res2.json()
    assert data2["current_streak"] == 1
    assert data2["already_checked_in"] is True


def test_articles_endpoints(client):
    # List articles
    res = client.get("/api/education/articles")
    assert res.status_code == 200
    articles = res.json()
    assert len(articles) > 0

    first_art_id = articles[0]["id"]
    detail_res = client.get(f"/api/education/articles/{first_art_id}")
    assert detail_res.status_code == 200
    assert "content" in detail_res.json()


def test_quiz_workflow(client, auth_headers):
    # 1. List topics
    topics_res = client.get("/api/education/quizzes/topics")
    assert topics_res.status_code == 200
    topics = topics_res.json()
    assert "Digital Fraud Awareness" in topics

    # 2. Get questions for topic
    q_res = client.get("/api/education/quizzes/Digital Fraud Awareness")
    assert q_res.status_code == 200
    questions = q_res.json()
    assert len(questions) > 0
    # Crucial security check: answers are NOT leaked to the client
    assert "correct_option_index" not in questions[0]
    assert "explanation" not in questions[0]

    # 3. Submit answers
    submission_payload = {
        "quiz_topic": "Digital Fraud Awareness",
        "answers": [
            {
                "question_id": questions[0]["id"],
                "selected_option_index": 1,  # correct answer for question 1 in seed data
            }
        ],
    }
    sub_res = client.post("/api/education/quizzes/submit", headers=auth_headers, json=submission_payload)
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert sub_data["total_questions"] == 1
    assert sub_data["score"] == 1
    assert sub_data["percentage"] == 100.0
    assert len(sub_data["results"]) == 1
    assert sub_data["results"][0]["is_correct"] is True
