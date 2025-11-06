import json
import types

def test_home(client):
    r = client.get("/")
    assert r.status_code == 200
    assert b"Hello" in r.data

def test_menu_items(client, monkeypatch):
    from backend.controllers.menu_items import MenuItems
    sample = {
        "cart_items": [{"MenuItemId": 1, "Quantity": 2, "UserId": 1}],
        "dietary_preferences": [{"Name": "VEG"}],
        "menu_items": [{"Id": 1, "Name": "Paneer", "Description": "spicy", "DietType": "VEG", "Category": "Curry", "ImageUrl": "p.png", "Cost": 10, "CalorieCount": 100, "ProteinCount": 8}],
        "user_menu_settings": [],
        "menu_categories": [{"Name": "Curry"}],
    }
    monkeypatch.setattr(MenuItems, "get", lambda self, user_id: sample)
    r = client.get("/api/menu-items?user_id=1")
    assert r.status_code == 200
    data = r.get_json()
    assert "menu_items" in data and data["menu_items"][0]["Name"] == "Paneer"

def test_post_cart(client, monkeypatch):
    from backend.controllers.cart_items import CartItems
    called = {}
    def _post(self, cart):
        called["payload"] = {"UserId": cart.UserId, "MenuItemId": cart.MenuItemId, "Quantity": cart.Quantity, "ExtraNote": cart.ExtraNote}
        return {"UserId": cart.UserId, "MenuItemId": cart.MenuItemId, "Quantity": cart.Quantity, "ExtraNote": cart.ExtraNote}
    monkeypatch.setattr(CartItems, "post", _post)
    body = {"UserId": 1, "MenuItemId": 2, "Quantity": 3, "ExtraNote": "less salt"}
    r = client.post("/api/cart", json=body)
    assert r.status_code in (200, 201)
    assert r.get_json()["MenuItemId"] == 2
    assert called["payload"]["ExtraNote"] == "less salt"

def test_get_user_details(client, monkeypatch):
    from backend.controllers.user_details import UserDetails
    monkeypatch.setattr(UserDetails, "get", lambda self, uid: {"Id": uid, "Name": "Test", "Email": "t@e.com", "Password": "x", "Spiciness": 10, "Sweetness": 20, "Salt": "Medium", "DietaryPreference": "VEG"})
    r = client.get("/api/user/details?user_id=1")
    assert r.status_code == 200
    assert r.get_json()["Id"] == 1

def test_patch_user_prefs(client, monkeypatch):
    from backend.controllers.user_details import UserDetails
    captured = {}
    def _patch(self, ud):
        captured["ud"] = ud
        return {}
    monkeypatch.setattr(UserDetails, "patch", _patch)
    body = {"Id": 1, "DietaryPreference": "VEG", "Email": "t@e.com", "Name": "T", "Password": "x", "Salt": "High", "Spiciness": 30, "Sweetness": 40}
    r = client.patch("/api/user/preferences", json=body)
    assert r.status_code in (200, 204)
    assert r.get_json() in ({}, None) or r.get_json() == {}
