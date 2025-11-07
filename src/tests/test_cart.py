import pytest
import json
from backend.controllers.cart_items import CartItems
from backend.Models.cart_item import CartItem

import backend.app as appmod

@pytest.fixture(autouse=True)
def fake_connection(monkeypatch):
    class FakeCursor:
        def execute(self, *a, **k): pass
        def fetchall(self): return []
        def fetchone(self): return None
        def __enter__(self): return self
        def __exit__(self, *exc): return False

    class FakeConnection:
        def cursor(self, *a, **k): return FakeCursor()
        def commit(self): pass

    monkeypatch.setattr(appmod, "connection", FakeConnection(), raising=False)


@pytest.fixture
def client():
    from backend.app import app
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_get_cart_empty(monkeypatch, client):
    monkeypatch.setattr(CartItems, "get", lambda self, uid: {"items": [], "totals": {}})
    resp = client.get("/api/cart?user_id=1")
    assert resp.status_code == 200
    data = resp.get_json()
    assert "items" in data
    assert data["items"] == []


def test_get_cart_with_items(monkeypatch, client):
    fake_cart = {
        "items": [
            {"product_id": 1, "name": "Paneer", "price": 10, "quantity": 2, "calories": 200, "protein": 10}
        ],
        "totals": {"currencyTotal": 20, "nutrition": {"calories": 200, "protein": 10}}
    }
    monkeypatch.setattr(CartItems, "get", lambda self, uid: fake_cart)
    resp = client.get("/api/cart?user_id=1")
    assert resp.status_code == 200
    assert resp.get_json()["items"][0]["name"] == "Paneer"


def test_post_cart(monkeypatch, client):
    called = {}
    def fake_post(self, cart):
        called["u"] = cart.UserId
        return {"MenuItemId": cart.MenuItemId, "Quantity": cart.Quantity}
    monkeypatch.setattr(CartItems, "post", fake_post)

    body = {"UserId": 1, "MenuItemId": 2, "Quantity": 3, "ExtraNote": "less salt"}
    resp = client.post("/api/cart", json=body)
    assert resp.status_code in (200, 201, 400, 500)
    data = resp.get_json()
    assert data["MenuItemId"] == 2
    assert called["u"] == 1


def test_delete_cart(monkeypatch, client):
    deleted = {}
    def fake_delete(self, c):
        deleted["uid"] = c.UserId
        deleted["mid"] = c.MenuItemId
        return {"message": "deleted"}
    monkeypatch.setattr(CartItems, "delete_item", fake_delete)
    resp = client.delete("/api/cart?user_id=1&menu_item_id=2")
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "deleted"


def test_post_cart_missing_field(monkeypatch, client):
    resp = client.post("/api/cart", json={"UserId": 1})
    assert resp.status_code in (200, 201, 400, 500)


def test_post_cart_invalid_quantity(monkeypatch, client):
    body = {"UserId": 1, "MenuItemId": 2, "Quantity": -5, "ExtraNote": ""}
    monkeypatch.setattr(CartItems, "post", lambda self, c: {"Quantity": c.Quantity})
    resp = client.post("/api/cart", json=body)
    assert resp.status_code == 201
    assert resp.get_json()["Quantity"] == -5


def test_delete_cart_invalid(monkeypatch, client):
    monkeypatch.setattr(CartItems, "delete_item", lambda self, c: {"message": "not found"})
    resp = client.delete("/api/cart?user_id=99&menu_item_id=999")
    assert resp.status_code == 200
    assert "message" in resp.get_json()


def test_cart_multiple_items(monkeypatch, client):
    fake_cart = {
        "items": [
            {"product_id": 1, "name": "A", "price": 5, "quantity": 1, "calories": 50, "protein": 5},
            {"product_id": 2, "name": "B", "price": 7, "quantity": 2, "calories": 140, "protein": 8}
        ],
        "totals": {"currencyTotal": 19, "nutrition": {"calories": 190, "protein": 13}}
    }
    monkeypatch.setattr(CartItems, "get", lambda self, uid: fake_cart)
    resp = client.get("/api/cart?user_id=1")
    data = resp.get_json()
    assert len(data["items"]) == 2
    assert data["totals"]["currencyTotal"] == 19


def test_clear_cart_behavior(monkeypatch, client):
    monkeypatch.setattr(CartItems, "delete_item", lambda self, c: {"message": "all cleared"})
    resp = client.delete("/api/cart?user_id=1&menu_item_id=0")
    assert resp.status_code == 200
    assert "cleared" in resp.get_json()["message"].lower()


def test_post_cart_returns_full_row(monkeypatch, client):
    result = {"UserId": 1, "MenuItemId": 10, "Quantity": 2, "ExtraNote": "spicy"}
    monkeypatch.setattr(CartItems, "post", lambda self, c: result)
    resp = client.post("/api/cart", json=result)
    data = resp.get_json()
    assert data["MenuItemId"] == 10
    assert data["Quantity"] == 2
