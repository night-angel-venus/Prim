import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Tiktok

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        # Clean up any leftover TikTok test records
        db.query(Tiktok).filter(Tiktok.hosts.like("%Test Host%")).delete()
        db.commit()
    finally:
        db.close()

    yield # The test runs here

    db = SessionLocal()
    try:
        # Clean up after the test
        db.query(Tiktok).filter(Tiktok.hosts.like("%Test Host%")).delete()
        db.commit() 
    finally:
        db.close()


def test_create_tiktok_event():
    response = client.post(
        "/tiktok/history",
        json={
            "live_date": "2026-10-24",
            "hosts": "Test Host A, Test Host B",
            "no_applicants": 50
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["hosts"] == "Test Host A, Test Host B"
    assert data["no_applicants"] == 50
    assert "id" in data

def test_update_tiktok_event():
    # 1. Create a record
    create_res = client.post(
        "/tiktok/history",
        json={
            "live_date": "2026-10-24",
            "hosts": "Test Host Original",
            "no_applicants": 20
        }
    )
    event_id = create_res.json()["id"]

    # 2. Update ONLY the hosts
    update_res = client.put(
        f"/tiktok/history/{event_id}",
        json={"hosts": "Test Host Updated"}
    )

    # 3. Assert the update worked and other fields stayed the same
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["hosts"] == "Test Host Updated"
    assert data["no_applicants"] == 20 # Should remain unchanged!
    assert data["live_date"] == "2026-10-24" # Should remain unchanged!

def test_update_non_existent_tiktok_event():
    response = client.put(
        "/tiktok/history/9999",
        json={"hosts": "Test Host Ghost"}
    )

    assert response.status_code == 404
    # Asserting the exact detail message from your tiktok.py route
    assert response.json()["detail"] == "TikTok Live event not found"

def test_get_tiktok_history_filters():
    # 1. Create three records (one with 0 applicants to test the boolean filter)
    client.post(
        "/tiktok/history",
        json={
            "live_date": "2026-10-24",
            "hosts": "Test Host A",
            "no_applicants": 15
        }
    )
    client.post(
        "/tiktok/history",
        json={
            "live_date": "2026-10-25",
            "hosts": "Test Host B",
            "no_applicants": 30
        }
    )
    client.post(
        "/tiktok/history",
        json={
            "live_date": "2026-10-26",
            "hosts": "No Live",
            "no_applicants": 0
        }
    )

    # 2. Search by host
    response = client.get("/tiktok/history?hosts=Test Host A")
    assert response.status_code == 200
    data = response.json()
    assert data[0]["hosts"] == "Test Host A"

    # 3. Filter for "No Live" days (applicants == 0)
    response_no_live = client.get("/tiktok/history?no_live_day=true")
    assert response_no_live.status_code == 200
    data_no_live = response_no_live.json()
    assert data_no_live[0]["no_applicants"] == 0

    # 4. Filter for "Successful Live" days (applicants > 0)
    response_live = client.get("/tiktok/history?no_live_day=false")
    assert response_live.status_code == 200