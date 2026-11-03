import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Deadline

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        # Clean up any leftover Deadline test records
        db.query(Deadline).filter(Deadline.title.like("%Test Deadline%")).delete()
        db.commit()
    finally:
        db.close()

    yield # The test runs here

    db = SessionLocal()
    try:
        # Clean up after the test
        db.query(Deadline).filter(Deadline.title.like("%Test Deadline%")).delete()
        db.commit() 
    finally:
        db.close()


def test_create_deadline():
    response = client.post(
        "/deadlines/items",
        json={
            "due_date": "2026-11-15",
            "title": "Test Deadline - Renew Hosting",
            "beneficiary": "IT Department"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Deadline - Renew Hosting"
    assert data["beneficiary"] == "IT Department"
    assert data["completed"] is False # Should auto-default to False
    assert "id" in data


def test_update_deadline():
    # 1. Create a record
    create_res = client.post(
        "/deadlines/items",
        json={
            "due_date": "2026-11-20",
            "title": "Test Deadline - Buy Flash Drive",
            "beneficiary": "Accounting"
        }
    )
    deadline_id = create_res.json()["id"]

    # 2. Update ONLY the title
    update_res = client.put(
        f"/deadlines/items/{deadline_id}",
        json={"title": "Test Deadline - Buy 2 Flash Drives"}
    )

    # 3. Assert the update worked and other fields stayed the same
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["title"] == "Test Deadline - Buy 2 Flash Drives"
    assert data["beneficiary"] == "Accounting" # Should remain unchanged!


def test_update_non_existent_deadline():
    response = client.put(
        "/deadlines/items/9999",
        json={"title": "Ghost Deadline"}
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "No Deadline Found"


def test_complete_deadline():
    # 1. Create a record
    create_res = client.post(
        "/deadlines/items",
        json={
            "due_date": "2026-11-25",
            "title": "Test Deadline - Submit Report",
            "beneficiary": "Boss"
        }
    )
    deadline_id = create_res.json()["id"]
    
    # Assert it starts as False
    assert create_res.json()["completed"] is False

    # 2. Mark as completed (True)
    complete_res = client.put(
        f"/deadlines/complete/{deadline_id}",
        json={"completed": True}
    )
    assert complete_res.status_code == 200
    assert complete_res.json()["completed"] is True

    # 3. Unmark as completed (False)
    uncomplete_res = client.put(
        f"/deadlines/complete/{deadline_id}",
        json={"completed": False}
    )
    assert uncomplete_res.status_code == 200
    assert uncomplete_res.json()["completed"] is False


def test_get_deadlines_filters():
    # 1. Create two records
    client.post(
        "/deadlines/items",
        json={
            "due_date": "2026-11-30",
            "title": "Test Deadline - Fix Printer",
            "beneficiary": "Admin"
        }
    )
    client.post(
        "/deadlines/items",
        json={
            "due_date": "2026-12-01",
            "title": "Test Deadline - Order Ink",
            "beneficiary": "Admin"
        }
    )

    # 2. Search by keyword in title
    response_keyword = client.get("/deadlines/items?keyword=Printer")
    assert response_keyword.status_code == 200
    data_keyword = response_keyword.json()
    assert any(d["title"] == "Test Deadline - Fix Printer" for d in data_keyword)

    # 3. Search by beneficiary
    response_beneficiary = client.get("/deadlines/items?beneficiary=Admin")
    assert response_beneficiary.status_code == 200
    data_beneficiary = response_beneficiary.json()
    assert any(d["title"] == "Test Deadline - Fix Printer" for d in data_beneficiary)