from mysql.connector import MySQLConnection
from backend.Models.cart_item import CartItem
from backend.database_utils import DatabaseUtils
from backend.queries.simple_queries import SimpleQueries

class CartItems:
    def __init__(self, connection: MySQLConnection):
        self.connection = connection
        self.cursor = connection.cursor()
        pass
    
    def get(self, user_id: int):
        return DatabaseUtils.execute(self.cursor, SimpleQueries.SELECT_USER_CART.value, [user_id])
        
    
    def post(self, cart_items: CartItem):
        with self.connection.cursor(dictionary=True) as cur:
            cur.execute(SimpleQueries.INSERT_USER_CART.value, (cart_items.UserId, cart_items.MenuItemId, cart_items.Quantity, cart_items.ExtraNote)
            )
            self.connection.commit()
            cur.execute(SimpleQueries.SELECT_USER_CART_WITH_MENU.value, (cart_items.UserId, cart_items.MenuItemId))
            row = cur.fetchone()
        return row