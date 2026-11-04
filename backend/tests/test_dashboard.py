import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Employee, Tiktok, Fedex, Report, Purchases, Deadline, StatusEnum, DepartmentEnum
from datetime import date

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        # Clean up test data before each test
        db.query(Employee).filter(Employee.employee_email.like("%@test.com")).delete()
        db.query(Tiktok).filter(Tiktok.hosts.like("%Test Dashboard%")).delete()
        db.query(Fedex).filter(Fedex.visit_reason.like("%Test Dashboard%")).delete()
        db.query(Report).filter(Report.problem.like("%Test Dashboard%")).delete()
        db.query(Purchases).filter(Purchases.item.like("%Test Dashboard%")).delete()
        db.query(Deadline).filter(Deadline.title.like("%Test Dashboard%")).delete()
        db.commit()
    finally:
        db.close()

    yield

    db = SessionLocal()
    try:
        db.query(Employee).filter(Employee.employee_email.like("%@test.com")).delete()
        db.query(Tiktok).filter(Tiktok.hosts.like("%Test Dashboard%")).delete()
        db.query(Fedex).filter(Fedex.visit_reason.like("%Test Dashboard%")).delete()
        db.query(Report).filter(Report.problem.like("%Test Dashboard%")).delete()
        db.query(Purchases).filter(Purchases.item.like("%Test Dashboard%")).delete()
        db.query(Deadline).filter(Deadline.title.like("%Test Dashboard%")).delete()
        db.commit() 
    finally:
        db.close()


def test_dashboard_employees():
    # Create 2 IT employees and 1 HR employee
    client.post("/directory/employees", json={"employee_name": "Test 1", "employee_department": "IT", "employee_email": "t1@test.com", "contact_no": "1", "employee_password": "p"})
    client.post("/directory/employees", json={"employee_name": "Test 2", "employee_department": "IT", "employee_email": "t2@test.com", "contact_no": "2", "employee_password": "p"})
    
    # Use the exact Value from the Enum, not the Name!
    client.post("/directory/employees", json={"employee_name": "Test 3", "employee_department": "Admin/HR", "employee_email": "t3@test.com", "contact_no": "3", "employee_password": "p"})

    response = client.get("/dashboard/employees")
    data = response.json()

    assert response.status_code == 200
    assert data["count_active"] >= 1
    
    # Use .get() with a default of 0 to prevent crashes if the key doesn't exist
    it_count = data["count_per_dept"].get("IT", 0)
    admin_count = data["count_per_dept"].get("Admin/HR", 0) or data["count_per_dept"].get("ADMIN", 0)
    
    assert it_count >= 2
    assert admin_count >= 1


def test_dashboard_tiktok():
    # Create TikTok data for the current year and month
    current_month_str = date.today().strftime("%Y-%m-%d")
    
    client.post("/tiktok/history", json={"live_date": current_month_str, "hosts": "Test Dashboard Host", "no_applicants": 50})
    client.post("/tiktok/history", json={"live_date": current_month_str, "hosts": "Test Dashboard Host 2", "no_applicants": 30})
    
    # Create a "No Live" day (0 applicants)
    client.post("/tiktok/history", json={"live_date": current_month_str, "hosts": "Test Dashboard No Live", "no_applicants": 0})

    response = client.get("/dashboard/tiktok")
    assert response.status_code == 200
    data = response.json()

    # Total lives should ignore the 0 applicant one
    assert data["count_tiktok_lives"] >= 2
    
    # Current month applicants should be 50 + 30 = 80 (plus whatever is in your dummy data)
    assert data["count_applicants_current_month"] >= 80
    
    # The dictionary should have keys for months
    assert isinstance(data["count_applicants_per_month"], dict)


def test_dashboard_fedex():
    # Create a FedEx visit
    client.post("/fedex/history", json={
        "visit_date": "2026-11-01",
        "visit_reason": "Test Dashboard Reason",
        "companions": "None",
        "departure_office": "9:00 AM",
        "arrival_fedex": "10:00 AM",
        "departure_fedex": "11:00 AM",
        "arrival_office": "12:00 PM"
    })

    response = client.get("/dashboard/fedex")
    assert response.status_code == 200
    data = response.json()

    assert data["count_visits"] >= 1
    assert data["recent_visit_reason"] is not None


def test_dashboard_reports():
    # Create a Report, a Purchase, and a Pending Deadline
    client.post("/reports/logs", json={"problem": "Test Dashboard Problem", "description": "Desc", "solution": "Sol", "reported_by": "Me"})
    
    client.post("/purchases/history", json={"purchase_date": "2026-11-01", "source": "Shopee", "item": "Test Dashboard Item", "price": 100, "beneficiary": "Me"})
    
    client.post("/deadlines/items", json={"due_date": "2026-11-01", "title": "Test Dashboard Deadline", "beneficiary": "Me"}) # Defaults to completed=False

    response = client.get("/dashboard/reports")
    assert response.status_code == 200
    data = response.json()

    # Because we have dummy data, we use >=
    assert data["count_reports"] >= 1 
    assert data["count_purchases"] >= 1
    assert data["pending"] >= 1