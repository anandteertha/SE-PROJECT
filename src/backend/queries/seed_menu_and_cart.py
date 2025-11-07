from connect_to_database import Connect
from backend.queries.simple_queries import SimpleQueries

def seed():
    conn = Connect().create_database_and_connect()
    try:
        cur = conn.cursor()
        # Seed menu items
        cur.execute("""
            INSERT INTO menu_items (product_id, name, price, calories, protein, carbs, fat)
            VALUES
            ('banana-bowl', 'Banana Protein Bowl', 8.50, 350, 20, 45, 8),
            ('green-salad', 'Green Salad', 6.00, 200, 6, 18, 10)
            ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price),
                calories=VALUES(calories), protein=VALUES(protein),
                carbs=VALUES(carbs), fat=VALUES(fat);
        """)
        # Seed cart
        cur.execute("""
            INSERT INTO user_cart (user_id, product_id, quantity) VALUES
            ('demo-user-123', 'banana-bowl', 2),
            ('demo-user-123', 'green-salad', 1)
            ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);
        """)
        conn.commit()
        cur.close()
        print("✅ Seeded menu items and cart for demo-user-123")
    finally:
        conn.close()

if __name__ == "__main__":
    seed()
