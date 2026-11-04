import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Accounts

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        db.query(Accounts).filter(Accounts.account.like("%Test Account%")).delete()
        db.commit()
    finally:
        db.close()

    yield

    db = SessionLocal()
    try:
        db.query(Accounts).filter(Accounts.account.like("%Test Account%")).delete()
        db.commit() 
    finally:
        db.close()


def test_create_account():
    response = client.post(
        "/accounts/admin",
        json={
            "account": "Test Account - Facebook",
            "username_email": "admin@test.com",
            "password": "testpassword123",
            "category": "General" # <--- Changed to Value format
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["account"] == "Test Account - Facebook"
    assert "id" in data

def test_update_account():
    create_res = client.post(
        "/accounts/admin",
        json={
            "account": "Test Account - Shopee",
            "username_email": "shopee@test.com",
            "password": "shopee123",
            "category": "General" # <--- Changed
        }
    )
    account_id = create_res.json()["id"]

    update_res = client.put(
        f"/accounts/admin/{account_id}",
        json={"password": "newpassword456"}
    )

    assert update_res.status_code == 200
    data = update_res.json()
    assert data["password"] == "newpassword456"
    assert data["account"] == "Test Account - Shopee"

def test_update_non_existent_account():
    response = client.put(
        "/accounts/admin/9999",
        json={"password": "ghost"}
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Account not found"

def test_get_accounts_filters():
    client.post(
        "/accounts/admin",
        json={
            "account": "Test Account - Network Admin",
            "username_email": "network@test.com",
            "password": "net123",
            "category": "Network" # <--- Changed
        }
    )
    client.post(
        "/accounts/admin",
        json={
            "account": "Test Account - Accounting",
            "username_email": "accounting@test.com",
            "password": "acc123",
            "category": "Accounting" # <--- Changed
        }
    )

    # Query using the Value format
    response_category = client.get("/accounts/admin?category=Network") # <--- Changed
    assert response_category.status_code == 200
    data_category = response_category.json()
    
    assert any(c["account"] == "Test Account - Network Admin" for c in data_category)
    assert not any(c["account"] == "Test Account - Accounting" for c in data_category)