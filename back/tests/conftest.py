import pytest
import os
import sys

# back papkasini PYTHONPATH’ga qo‘shish
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db  # "back." prefiksi olib tashlandi
from main import app  # "back." prefiksi olib tashlandi
from fastapi.testclient import TestClient

# Test uchun vaqtinchalik database yaratamiz
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://myuser:mypassword@postgres:5432/mydatabase")

# SQLAlchemy engine sozlamasi
engine = create_engine(DATABASE_URL)  # SQLite uchun "check_same_thread" shart emas, PostgreSQL uchun olib tashlandi
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)  # Jadval yaratish
    session = TestingSessionLocal()
    yield session  # Test ishlaydi
    session.close()
    Base.metadata.drop_all(bind=engine)  # Testdan keyin tozalash

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)