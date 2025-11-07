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

