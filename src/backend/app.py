from flask import Flask, jsonify, request
from .connect_to_database import Connect
from flask import Response
from backend.queries.simple_queries import SimpleQueries
import math

app = Flask(__name__)

def fetchall_try(cur, sqls):
    for sql in sqls:
        try:
            cur.execute(sql)
            return cur.fetchall()
        except Exception as _:
            continue
    raise Exception("No compatible menu table found (menu_item or menu_items)")

def execute_try(cur, sqls, params):
    for sql in sqls:
        try:
            cur.execute(sql, params)
            return True
        except Exception as _:
            continue
    raise Exception("No compatible cart table found (cart/user_cart)")

# ---------- GET /api/menu ----------
@app.route('/api/menu', methods=['GET'])
def get_menu():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        rows = fetchall_try(cur, [
            """
            SELECT 
              Id           AS product_id,
              Name         AS name,
              Description  AS description,
              Cost         AS price,
              CalorieCount AS calories,
              ProteinCount AS protein,
              0            AS carbs,
              0            AS fat,
              ImageUrl     AS image_url,
              Category     AS category
            FROM menu_item
            ORDER BY Name ASC
            """,
            """
            SELECT 
              product_id, name, description, price, calories, protein,
              COALESCE(carbs,0) AS carbs, COALESCE(fat,0) AS fat,
              image_url, category
            FROM menu_items
            ORDER BY name ASC
            """
        ])
        items = [{
            "productId": r.get("product_id"),
            "name": r.get("name"),
            "description": r.get("description"),
            "price": float(r.get("price")),
            "imageUrl": r.get("image_url"),
            "category": r.get("category"),
            "nutrition": {
                "calories": int(r.get("calories") or 0),
                "protein": float(r.get("protein") or 0),
                "carbs": float(r.get("carbs") or 0),
                "fat": float(r.get("fat") or 0)
            }
        } for r in rows]
        return jsonify(items)
    finally:
        cur.close()

# ---------- POST /api/cart/items ----------
@app.route('/api/cart/items', methods=['POST'])
def add_to_cart():
    user_id = current_user_id()
    data = request.get_json(silent=True) or {}
    product_id = data.get('productId')
    quantity = data.get('quantity', 1)

    if product_id is None or quantity is None:
        return jsonify({"ok": False, "message": "productId and quantity required"}), 400
    try:
        quantity = int(quantity)
        if quantity <= 0:
            return jsonify({"ok": False, "message": "quantity must be > 0"}), 400
    except:
        return jsonify({"ok": False, "message": "quantity must be integer"}), 400

    conn = get_db()
    cur = conn.cursor()

    try:
        ok = execute_try(cur, [
            """
            INSERT INTO cart (UserId, MenuItemId, Quantity)
            VALUES (%s,
                    -- if client sent a string product_id, map it to Id via menu_items/menu_item
                    CASE WHEN %s REGEXP '^[0-9]+$' THEN %s
                         ELSE (SELECT Id FROM menu_item WHERE Name = %s OR Id = %s LIMIT 1)
                    END,
                    %s)
            ON DUPLICATE KEY UPDATE Quantity = Quantity + VALUES(Quantity)
            """,
            """
            INSERT INTO user_cart (user_id, product_id, quantity)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
            """
        ], (user_id, str(product_id), product_id, str(product_id), product_id, quantity))

        conn.commit()
        return jsonify({"ok": True}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"ok": False, "message": str(e)}), 500
    finally:
        cur.close()


@app.after_request
def add_cors_headers(resp):
    resp.headers["Access-Control-Allow-Origin"] = "http://localhost:4200"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,PATCH,DELETE,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    resp.headers["Access-Control-Allow-Credentials"] = "true"
    return resp

# (optional) handle preflight
@app.route("/api/<path:subpath>", methods=["OPTIONS"])
def cors_preflight(subpath):
    return ("", 204)

def current_user_id() -> str:
    # TODO: Replace with real user from auth (JWT/session). For now static user.
    return "demo-user-123"

def compute_totals(rows):
    currency_total = 0.0
    nutrition = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
    for r in rows:
        line_total = float(r["price"]) * int(r["quantity"])
        currency_total += line_total
        nutrition["calories"] += int(r["calories"]) * int(r["quantity"])
        nutrition["protein"]  += int(r["protein"])  * int(r["quantity"])
        nutrition["carbs"]    += int(r["carbs"])    * int(r["quantity"])
        nutrition["fat"]      += int(r["fat"])      * int(r["quantity"])
    return {
        "currencyTotal": round(currency_total, 2),
        "nutrition": nutrition
    }

def get_db():
    # Uses your Connect class to ensure DB exists & return a connection to 'nutribite'
    conn = Connect().create_database_and_connect()
    return conn

@app.route('/')
def home():
    return "Hello from Flask Backend!"

@app.route('/api/data')
def get_data():
    data = {"message": "This is some data from your Flask API"}
    return jsonify(data)

@app.get("/api/cart")
def get_cart():
    user_id = current_user_id()
    conn = get_db()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(SimpleQueries.SELECT_CART_JOINED.value, (user_id,))
        rows = cur.fetchall()
        cur.close()

        items = [{
            "productId": r["product_id"],
            "name": r["name"],
            "price": float(r["price"]),
            "quantity": int(r["quantity"]),
            "nutrition": {
                "calories": int(r["calories"]),
                "protein": int(r["protein"]),
                "carbs": int(r["carbs"]),
                "fat": int(r["fat"])
            }
        } for r in rows]

        totals = compute_totals(rows)
        return jsonify({"items": items, "totals": totals})
    finally:
        conn.close()

@app.patch("/api/cart/items/<product_id>")
def set_quantity(product_id):
    user_id = current_user_id()
    body = request.get_json(silent=True) or {}
    q = body.get("quantity", None)

    if q is None or not isinstance(q, (int, float)) or q < 0 or math.isnan(float(q)):
        return jsonify({"error": "quantity must be a non-negative number"}), 400

    qty = int(math.floor(float(q)))
    conn = get_db()
    try:
        cur = conn.cursor(dictionary=True)
        if qty == 0:
            # Delete item
            cur.execute(SimpleQueries.DELETE_CART_ITEM.value, (user_id, product_id))
        else:
            # Upsert quantity
            cur.execute(SimpleQueries.UPSERT_CART_ITEM.value, (user_id, product_id, qty))
        conn.commit()
        cur.close()
    finally:
        conn.close()
    # Return updated cart
    return get_cart()

@app.delete("/api/cart/items/<product_id>")
def remove_item(product_id):
    user_id = current_user_id()
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(SimpleQueries.DELETE_CART_ITEM.value, (user_id, product_id))
        changed = cur.rowcount > 0
        conn.commit()
        cur.close()
    finally:
        conn.close()
    resp = get_cart().get_json()
    resp["changed"] = changed
    return jsonify(resp)

@app.post("/api/checkout")
def checkout_stub():
    # In a real app: create order, charge, etc.
    # Here: clear cart, return message
    user_id = current_user_id()
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(SimpleQueries.CLEAR_CART.value, (user_id,))
        conn.commit()
        cur.close()
    finally:
        conn.close()
    return jsonify({"ok": True, "message": "Checkout complete (stub). Cart cleared."})


if __name__ == '__main__':
    Connect().setup()
    app.run(debug=True, port=4000) # debug=True is for development, disable in production