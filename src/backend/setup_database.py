from mysql.connector import MySQLConnection
from backend.queries.simple_queries import SimpleQueries


class SetupDatabase:
    def __init__(self, connection: MySQLConnection):
        self.connection = connection
        self.cursor = self.connection.cursor()
        pass

    def create_database(self):
        self.cursor.execute(SimpleQueries.CREATE_DATABASE_IF_NOT_EXISTS.value)
        print("CREATED DATABASE..")
        pass

    def use_database(self):
        self.cursor.execute("USE nutribite;")
        print("USING DATABASE nutribite..")
        pass    

    def create_dietary_preference_table(self):
        self.cursor.execute(SimpleQueries.CREATE_DIETARY_PREFERENCE_TABLE.value)
        print("CREATED DIETARY PREFERENCE TABLE..")
        pass
    
    def create_user_authentication_table(self):
        self.cursor.execute(SimpleQueries.CREATE_USER_AUTHENTICATION_TABLE.value)
        print("CREATED USER TABLE..")
        pass
    
    def create_menu_categories_table(self):
        self.cursor.execute(SimpleQueries.CREATE_MENU_CATEGORIES_TABLE.value)
        print("CREATED MENU CATEGORIES TABLE..")
        pass
    
    def create_menu_items_table(self):
        self.cursor.execute(SimpleQueries.CREATE_MENU_ITEMS_TABLE.value)
        print("CREATED MENU ITEMS TABLE..")
        pass
    
    def create_user_cart_table(self):
        self.cursor.execute(SimpleQueries.CREATE_USER_CART_TABLE.value)
        print("CREATE USER CART TABLE..")
        pass
    
    def create_user_menu_settings_table(self):
        self.cursor.execute(SimpleQueries.CREATE_USER_MENU_SETTINGS.value)
        print("CREATE USER MENU SETTINGS TABLE..")
        pass

    def setup(self):
        self.create_database()
        self.use_database()
        self.create_dietary_preference_table()
        self.create_user_authentication_table()
        self.create_menu_categories_table()
        self.create_menu_items_table()
        self.create_user_cart_table()
        self.create_user_menu_settings_table()
        pass