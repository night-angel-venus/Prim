import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Phrasebank

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_db():
    db = SessionLocal()
    try:
        # Clean up any leftover Phrasebank test records
        db.query(Phrasebank).filter(Phrasebank.phrase_title.like("%Test Phrase%")).delete()
        db.commit()
    finally:
        db.close()

    yield # The test runs here

    db = SessionLocal()
    try:
        # Clean up after the test
        db.query(Phrasebank).filter(Phrasebank.phrase_title.like("%Test Phrase%")).delete()
        db.commit() 
    finally:
        db.close()


def test_create_phrase():
    response = client.post(
        "/phrasebank/items",
        json={
            "phrase_title": "Test Phrase - Welcome",
            "phrase": "Welcome to the team! We are glad to have you."
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["phrase_title"] == "Test Phrase - Welcome"
    assert data["phrase"] == "Welcome to the team! We are glad to have you."
    assert "id" in data

def test_update_phrase():
    # 1. Create a record
    create_res = client.post(
        "/phrasebank/items",
        json={
            "phrase_title": "Test Phrase - Initial",
            "phrase": "This is the original text."
        }
    )
    phrase_id = create_res.json()["id"]

    # 2. Update ONLY the phrase text
    update_res = client.put(
        f"/phrasebank/items/{phrase_id}",
        json={"phrase": "This is the updated text."}
    )

    # 3. Assert the update worked and other fields stayed the same
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["phrase"] == "This is the updated text."
    assert data["phrase_title"] == "Test Phrase - Initial" # Should remain unchanged!

def test_update_non_existent_phrase():
    response = client.put(
        "/phrasebank/items/9999",
        json={"phrase": "Ghost text"}
    )

    assert response.status_code == 404
    # Asserting the exact detail message from your phrasebank.py route
    assert response.json()["detail"] == "No Phrase Found"

def test_get_phrasebank_filters():
    # 1. Create two records
    client.post(
        "/phrasebank/items",
        json={
            "phrase_title": "Test Phrase - Welcome",
            "phrase": "Welcome to the company!"
        }
    )
    client.post(
        "/phrasebank/items",
        json={
            "phrase_title": "Test Phrase - Farewell",
            "phrase": "Goodbye and good luck."
        }
    )

    # 2. Search by keyword that matches the title
    response_title = client.get("/phrasebank/items?keyword=Welcome")
    assert response_title.status_code == 200
    data_title = response_title.json()
    assert data_title[0]["phrase_title"] == "Test Phrase - Welcome"

    # 3. Search by keyword that matches the phrase text (not the title)
    # "Goodbye" is in the phrase, but not in the title
    response_text = client.get("/phrasebank/items?keyword=Goodbye")
    assert response_text.status_code == 200
    data_text = response_text.json()
    assert data_text[0]["phrase_title"] == "Test Phrase - Farewell"