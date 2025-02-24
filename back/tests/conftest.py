import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from back.database import Base, get_db
from back.main import app
from fastapi.testclient import TestClient

# Test uchun vaqtinchalik database yaratamiz
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  # Yoki PostgreSQL: postgresql://user:pass@localhost/test_db

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
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
