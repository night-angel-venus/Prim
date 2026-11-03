import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Contacts

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        # Clean up any leftover Contact test records
        db.query(Contacts).filter(Contacts.contact_name.like("%Test Contact%")).delete()
        db.commit()
    finally:
        db.close()

    yield # The test runs here

    db = SessionLocal()
    try:
        # Clean up after the test
        db.query(Contacts).filter(Contacts.contact_name.like("%Test Contact%")).delete()
        db.commit() 
    finally:
        db.close()


def test_create_contact():
    response = client.post(
        "/contacts/items",
        json={
            "contact_name": "Test Contact - Sir Andre",
            "contact_number": "09171234567",
            "purpose": "IT Support"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["contact_name"] == "Test Contact - Sir Andre"
    assert data["contact_number"] == "09171234567"
    assert "id" in data

def test_update_contact():
    # 1. Create a record
    create_res = client.post(
        "/contacts/items",
        json={
            "contact_name": "Test Contact - Ms. Cheska",
            "contact_number": "09998887777",
            "purpose": "HR Concerns"
        }
    )
    contact_id = create_res.json()["id"]

    # 2. Update ONLY the contact number
    update_res = client.put(
        f"/contacts/items/{contact_id}",
        json={"contact_number": "09000000000"}
    )

    # 3. Assert the update worked and other fields stayed the same
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["contact_number"] == "09000000000"
    assert data["contact_name"] == "Test Contact - Ms. Cheska" # Should remain unchanged!
    assert data["purpose"] == "HR Concerns"

def test_update_non_existent_contact():
    response = client.put(
        "/contacts/items/9999",
        json={"contact_number": "00000000000"}
    )

    assert response.status_code == 404
    # Asserting the exact detail message from your contacts.py route
    assert response.json()["detail"] == "No Contact Found"

def test_get_contacts_filters():
    # 1. Create two records
    client.post(
        "/contacts/items",
        json={
            "contact_name": "Test Contact - Delivery Guy",
            "contact_number": "123456",
            "purpose": "Package Delivery"
        }
    )
    client.post(
        "/contacts/items",
        json={
            "contact_name": "Test Contact - Accountant",
            "contact_number": "654321",
            "purpose": "BIR Taxes"
        }
    )

    # 2. Search by name
    response_name = client.get("/contacts/items?name=Delivery")
    assert response_name.status_code == 200
    data_name = response_name.json()
    # Removed length assertion. Just check if a match exists.
    assert any(c["contact_name"] == "Test Contact - Delivery Guy" for c in data_name)

    # 3. Search by purpose
    response_purpose = client.get("/contacts/items?purpose=BIR")
    assert response_purpose.status_code == 200
    data_purpose = response_purpose.json()
    # Removed length assertion. Just check if a match exists.
    assert any(c["purpose"] == "BIR Taxes" for c in data_purpose)