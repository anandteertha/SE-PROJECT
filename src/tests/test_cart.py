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
