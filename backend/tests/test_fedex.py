import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Fedex

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        # Clean up any leftover FedEx test records
        db.query(Fedex).filter(Fedex.visit_reason.like("%Test Reason%")).delete()
        db.commit()
    finally:
        db.close()

    yield # The test runs here

    db = SessionLocal()
    try:
        # Clean up after the test
        db.query(Fedex).filter(Fedex.visit_reason.like("%Test Reason%")).delete()
        db.commit() 
    finally:
        db.close()


def test_create_fedex_event():
    response = client.post(
        "/fedex/history",
        json={
            "visit_date": "2026-10-24",
            "visit_reason": "Test Reason - Training",
            "companions": "John Doe, Jane Doe",
            "departure_office": "3:00 AM",
            "arrival_fedex": "7:00 AM",
            "departure_fedex": "3:00 PM",
            "arrival_office": "7:00 PM"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["visit_reason"] == "Test Reason - Training"
    assert data["companions"] == "John Doe, Jane Doe"
    assert "id" in data

def test_update_fedex_event():
    # 1. Create a record
    create_res = client.post(
        "/fedex/history",
        json={
            "visit_date": "2026-10-24",
            "visit_reason": "Test Reason - Initial",
            "companions": "Bob",
            "departure_office": "3:00 AM",
            "arrival_fedex": "7:00 AM",
            "departure_fedex": "3:00 PM",
            "arrival_office": "7:00 PM"
        }
    )
    event_id = create_res.json()["id"]

    # 2. Update ONLY the reason
    update_res = client.put(
        f"/fedex/history/{event_id}",
        json={"visit_reason": "Test Reason - Updated"}
    )

    # 3. Assert the update worked and other fields stayed the same
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["visit_reason"] == "Test Reason - Updated"
    assert data["companions"] == "Bob" # Should remain unchanged!

def test_update_non_existent_fedex_event():
    response = client.put(
        "/fedex/history/9999",
        json={"visit_reason": "Test Reason - Ghost"}
    )

    assert response.status_code == 404
    # Asserting the exact detail message from your fedex.py route
    assert response.json()["detail"] == "No Event found"

def test_get_fedex_history_filter():
    # 1. Create two records
    client.post(
        "/fedex/history",
        json={
            "visit_date": "2026-10-24",
            "visit_reason": "Test Reason - Training",
            "companions": "Alice",
            "departure_office": "3:00 AM",
            "arrival_fedex": "7:00 AM",
            "departure_fedex": "3:00 PM",
            "arrival_office": "7:00 PM"
        }
    )
    client.post(
        "/fedex/history",
        json={
            "visit_date": "2026-10-25",
            "visit_reason": "Test Reason - Testing",
            "companions": "Bob",
            "departure_office": "3:00 AM",
            "arrival_fedex": "7:00 AM",
            "departure_fedex": "3:00 PM",
            "arrival_office": "7:00 PM"
        }
    )

    # 2. Search by reason
    response = client.get("/fedex/history?reason=Testing")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["visit_reason"] == "Test Reason - Testing"