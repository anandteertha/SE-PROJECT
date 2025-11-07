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
    
    def delete_item(self, cart_items: CartItem):
        with self.connection.cursor(dictionary=True) as cur:
            cur.execute(SimpleQueries.DELETE_CART_ITEM.value, [cart_items.UserId, cart_items.MenuItemId])
        return {}

    def delete_all_item(self, cart_items: CartItem):
        with self.connection.cursor(dictionary=True) as cur:
            result = cur.execute(SimpleQueries.CLEAR_CART.value, [cart_items.UserId])
            print(result)
        return {}
    
    def patch(self, cart_items: CartItem):
        with self.connection.cursor(dictionary=True) as cur:
            cur.execute(SimpleQueries.UPDATE_USER_CART.value, (cart_items.Quantity, cart_items.ExtraNote, cart_items.UserId, cart_items.MenuItemId)
            )
            self.connection.commit()
            cur.execute(SimpleQueries.SELECT_USER_CART_WITH_MENU.value, (cart_items.UserId, cart_items.MenuItemId))
            row = cur.fetchone()
            print('now row is', row)
        return {}
    
    def post(self, cart_items: CartItem):
        with self.connection.cursor(dictionary=True) as cur:
            cur.execute(SimpleQueries.INSERT_USER_CART.value, (cart_items.UserId, cart_items.MenuItemId, cart_items.Quantity, cart_items.ExtraNote)
            )
            self.connection.commit()
            cur.execute(SimpleQueries.SELECT_USER_CART_WITH_MENU.value, (cart_items.UserId, cart_items.MenuItemId))
            row = cur.fetchone()
        return row