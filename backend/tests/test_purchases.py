import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Purchases

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        # Clean up any leftover Purchase test records
        db.query(Purchases).filter(Purchases.item.like("%Test Item%")).delete()
        db.commit()
    finally:
        db.close()

    yield # The test runs here

    db = SessionLocal()
    try:
        # Clean up after the test
        db.query(Purchases).filter(Purchases.item.like("%Test Item%")).delete()
        db.commit() 
    finally:
        db.close()


def test_create_purchase():
    response = client.post(
        "/purchases/history",
        json={
            "purchase_date": "2026-10-24",
            "source": "Shopee",
            "item": "Test Item - Keyboard",
            "price": 1500,
            "beneficiary": "My PC"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["source"] == "Shopee"
    assert data["item"] == "Test Item - Keyboard"
    assert data["price"] == 1500
    assert "id" in data

def test_update_purchase():
    # 1. Create a record
    create_res = client.post(
        "/purchases/history",
        json={
            "purchase_date": "2026-10-24",
            "source": "TikTok Shop",
            "item": "Test Item - Mouse",
            "price": 500,
            "beneficiary": "Accounting PC"
        }
    )
    purchase_id = create_res.json()["id"]

    # 2. Update ONLY the price
    update_res = client.put(
        f"/purchases/history/{purchase_id}",
        json={"price": 450}
    )

    # 3. Assert the update worked and other fields stayed the same
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["price"] == 450
    assert data["item"] == "Test Item - Mouse" # Should remain unchanged!
    assert data["beneficiary"] == "Accounting PC" # Should remain unchanged!

def test_update_non_existent_purchase():
    response = client.put(
        "/purchases/history/9999",
        json={"price": 100}
    )

    assert response.status_code == 404
    # Asserting the exact detail message from your purchases.py route
    assert response.json()["detail"] == "No Purchase Found"

def test_get_purchases_filters():
    # 1. Create two records with different sources and items
    client.post(
        "/purchases/history",
        json={
            "purchase_date": "2026-10-24",
            "source": "Shopee",
            "item": "Test Item - Monitor",
            "price": 8000,
            "beneficiary": "All PCs"
        }
    )
    client.post(
        "/purchases/history",
        json={
            "purchase_date": "2026-10-25",
            "source": "TikTok Shop",
            "item": "Test Item - Cable",
            "price": 200,
            "beneficiary": "My PC"
        }
    )

    # 2. Filter by source
    response_source = client.get("/purchases/history?source=Shopee")
    assert response_source.status_code == 200
    data_source = response_source.json()
    assert data_source[2]["item"] == "Test Item - Monitor"

    # 3. Filter by beneficiary text
    # "My PC" is the beneficiary of the second record
    response_beneficiary = client.get("/purchases/history?beneficiary=My PC")
    assert response_beneficiary.status_code == 200
    data_beneficiary = response_beneficiary.json()
    assert data_beneficiary[0]["item"] == "Test Item - Cable"