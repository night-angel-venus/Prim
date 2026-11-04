import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        # Clean up any leftover test users before the test
        db.query(User).filter(User.email.like("%@test.com")).delete()
        db.commit()
    finally:
        db.close()

    yield # The test runs here

    db = SessionLocal()
    try:
        # Clean up test users after the test
        db.query(User).filter(User.email.like("%@test.com")).delete()
        db.commit() 
    finally:
        db.close()


def test_register():
    response = client.post(
        "/auth/register",
        json={
            "username": "Nien",
            "email": "nien@test.com",
            "name": "Nien",
            "password": "nien",
        }
    )

    # 1. Fixed status code (Register returns 201 Created)
    assert response.status_code == 201

    data = response.json()

    assert data["username"] == "Nien"
    assert data["email"] == "nien@test.com"
    assert "id" in data
    # Ensure password is NOT returned
    assert "password" not in data 


def test_login():
    # Register the user first
    reg_response = client.post(
        "/auth/register",
        json={
            "username": "Naky",
            "email": "naky@test.com",
            "name": "Nakyoung",
            "password": "naky",
        }
    )
    # Safety check to ensure the user was created before we try to log in
    assert reg_response.status_code == 201 

    # 2. Fixed login credentials (using username, not email)
    login_response = client.post(
        "/auth/login",
        data={
            "username": "Naky", 
            "password": "naky"
        }
    )

    assert login_response.status_code == 200
    data = login_response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
    # Optional but highly recommended: Assert that the user object is returned correctly
    assert data["user"]["username"] == "Naky"