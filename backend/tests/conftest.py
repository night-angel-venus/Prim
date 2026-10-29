import os
import pytest
from app.database import Base, engine

os.environ["TEST_MODE"] = "true"

@pytest.fixture(autouse=True)
def set_test_mode():
    os.environ["TEST_MODE"] = "true"
    yield

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # Create all tables from models
    Base.metadata.create_all(bind=engine)
    yield