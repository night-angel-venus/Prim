import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Employee

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        # Clean up any leftover test users before the test
        db.query(Employee).filter(Employee.employee_email.like("%@test.com")).delete()
        db.commit()
    finally:
        db.close()

    yield # The test runs here

    db = SessionLocal()
    try:
        # Clean up test users after the test
        db.query(Employee).filter(Employee.employee_email.like("%@test.com")).delete()
        db.commit() 
    finally:
        db.close()


def test_create_employee():
    response = client.post(
        "/directory/employees",
        json={
            "employee_name": "John Doe",
            "employee_department": "IT",
            "employee_email": "john@test.com",
            "contact_no": "09123456789",
            "employee_password": "password123"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["employee_name"] == "John Doe"
    assert data["status"] == "Active" # Should auto-default to Active
    assert "id" in data

def test_create_duplicate_employee():
    client.post(
        "/directory/employees",
        json={
            "employee_name": "Jane Doe",
            "employee_department": "IT",
            "employee_email": "jane@test.com",
            "contact_no": "09999999999",
            "employee_password": "password123"
        }
    )

    response = client.post(
        "/directory/employees",
        json={
            "employee_name": "Jane Clone",
            "employee_department": "Operations",
            "employee_email": "jane@test.com", # <--- SAME EMAIL
            "contact_no": "00000000000",
            "employee_password": "password456"
        }
    )

    # 3. Assert it fails with a 400 Bad Request
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_update_employee():
    create_res = client.post(
        "/directory/employees",
        json={
            "employee_name": "Bob",
            "employee_department": "Operations",
            "employee_email": "bob@test.com",
            "contact_no": "123",
            "employee_password": "password123"
        }
    )
    employee_id = create_res.json()["id"]


    update_res = client.put(
        f"/directory/employees/{employee_id}",
        json={
            "employee_name": "Robert",
            "employee_department": "IT"
        }
    )

    assert update_res.status_code == 200
    data = update_res.json()
    assert data["employee_name"] == "Robert"
    assert data["employee_department"] == "IT"
    assert data["employee_email"] == "bob@test.com" # Should remain unchanged!

def test_update_non_existent_employee():
    response = client.put(
        "/directory/employees/9999",
        json={"employee_name": "Ghost"}
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Employee not found"

def test_archive_employee():
    create_res = client.post(
        "/directory/employees",
        json={
            "employee_name": "To Be Fired",
            "employee_department": "Operations",
            "employee_email": "fired@test.com",
            "contact_no": "00000000000",
            "employee_password": "password123"
        }
    )
    employee_id = create_res.json()["id"]

    archive_res = client.put(f"/directory/archive/{employee_id}")

    assert archive_res.status_code == 200
    
    data = archive_res.json()
    assert data["status"] == "Archived"
    assert data["employee_name"] == "To Be Fired" # Ensure other data is intact