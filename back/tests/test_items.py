import pytest
from fastapi.testclient import TestClient
from main import app  # main.py dan FastAPI app obyektini import qilish

client = TestClient(app)

def test_create_item(client):
    response = client.post(
        "/items",
        json={"id": 1, "name": "Laptop", "description": "Gaming laptop", "price": 1500, "on_offer": False},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Laptop"
    assert data["price"] == 1500

def test_get_items(client):
    response = client.get("/items")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_item_by_id(client):
    client.post("/items", json={"id": 2, "name": "Phone", "description": "Smartphone", "price": 500, "on_offer": True})
    response = client.get("/items/2")
    assert response.status_code == 200
    assert response.json()["name"] == "Phone"

def test_update_item(client):
    client.post("/items", json={"id": 3, "name": "Tablet", "description": "Android tablet", "price": 300, "on_offer": False})
    response = client.put("/items/3", json={"id": 3, "name": "Updated Tablet", "description": "Updated Android tablet", "price": 350, "on_offer": True})
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Tablet"

def test_delete_item(client):
    client.post("/items", json={"id": 4, "name": "Watch", "description": "Smart watch", "price": 200, "on_offer": False})
    response = client.delete("/items/4")
    assert response.status_code == 200
    assert response.json() == {"message": "Item deleted"}
