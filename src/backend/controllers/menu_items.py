from mysql.connector import MySQLConnection
from backend.database_utils import DatabaseUtils
from backend.Models.menu_data import MenuData
from backend.queries.simple_queries import SimpleQueries

class MenuItems:
    def __init__(self, connection: MySQLConnection):
        self.connection = connection
        self.cursor = connection.cursor()
        pass
        
    def get(self, user_id: int):
        menu_data = MenuData()
        menu_data.menu_items = DatabaseUtils.execute(self.cursor, SimpleQueries.SELECT_MENU_ITEMS.value)
        menu_data.menu_categories = DatabaseUtils.execute(self.cursor, SimpleQueries.SELECT_MENU_CATEGORIES.value)
        menu_data.cart_items = DatabaseUtils.execute(self.cursor, SimpleQueries.SELECT_USER_CART.value, [user_id])
        menu_data.dietary_preferences = DatabaseUtils.execute(self.cursor, SimpleQueries.SELECT_DIETARY_PREFERENCE.value)
        menu_data.user_menu_settings = DatabaseUtils.execute(self.cursor, SimpleQueries.SELECT_ONE_USER_MENU_SETTINGS.value, [user_id])
        return menu_data.__dict__