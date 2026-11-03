import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Report

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        # Clean up any leftover Report test records
        db.query(Report).filter(Report.problem.like("%Test Problem%")).delete()
        db.commit()
    finally:
        db.close()

    yield # The test runs here

    db = SessionLocal()
    try:
        # Clean up after the test
        db.query(Report).filter(Report.problem.like("%Test Problem%")).delete()
        db.commit() 
    finally:
        db.close()


def test_create_report():
    response = client.post(
        "/reports/logs",
        json={
            "problem": "Test Problem - Printer Offline",
            "description": "The printer on the 2nd floor is not responding.",
            "solution": "Restarted the printer service.",
            "reported_by": "Test User"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["problem"] == "Test Problem - Printer Offline"
    assert data["reported_by"] == "Test User"
    assert "id" in data
    assert "date" in data # Ensure the DB generated the date


def test_update_report():
    # 1. Create a record
    create_res = client.post(
        "/reports/logs",
        json={
            "problem": "Test Problem - Monitor Flickering",
            "description": "The monitor in the conference room is flickering.",
            "solution": "Pending",
            "reported_by": "Test User"
        }
    )
    report_id = create_res.json()["id"]

    # 2. Update ONLY the solution
    update_res = client.put(
        f"/reports/logs/{report_id}",
        json={"solution": "Replaced the HDMI cable."}
    )

    # 3. Assert the update worked and other fields stayed the same
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["solution"] == "Replaced the HDMI cable."
    assert data["problem"] == "Test Problem - Monitor Flickering" # Should remain unchanged!


def test_update_non_existent_report():
    response = client.put(
        "/reports/logs/9999",
        json={"solution": "Ghost solution"}
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "No Report Found"


def test_get_reports_filters():
    # 1. Create two records
    client.post(
        "/reports/logs",
        json={
            "problem": "Test Problem - Internet Down",
            "description": "No internet in the office.",
            "solution": "Restarted the router.",
            "reported_by": "Ms. Cheska"
        }
    )
    client.post(
        "/reports/logs",
        json={
            "problem": "Test Problem - Slow PC",
            "description": "The accounting PC is very slow.",
            "solution": "Cleared the temp files.",
            "reported_by": "Sir Andre"
        }
    )

    # 2. Search by reported_by (partial match)
    response_by = client.get("/reports/logs?reported_by=Cheska")
    assert response_by.status_code == 200
    data_by = response_by.json()
    # Using `any` to ignore leftover dummy data
    assert any(r["problem"] == "Test Problem - Internet Down" for r in data_by)

    # 3. Search by solution keyword
    response_sol = client.get("/reports/logs?solution=temp")
    assert response_sol.status_code == 200
    data_sol = response_sol.json()
    assert any(r["problem"] == "Test Problem - Slow PC" for r in data_sol)