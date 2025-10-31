from backend.connect_to_database import Connect
from backend.queries.simple_queries import SimpleQueries
from backend.setup_database import SetupDatabase


class PostStaticData:
    def __init__(self):
        try:
            self.get_connection()
            self.drop_database()
            self.get_connection()
        except Exception as e:
            print(e)
            return
    
    def get_connection(self):
        connect = Connect()
        self.connection = connect.create_database_and_connect()
        self.setupDatabase = SetupDatabase(self.connection)
        self.setupDatabase.setup()
        self.cursor = self.setupDatabase.cursor
    
    def drop_database(self):
        self.cursor.execute(SimpleQueries.DROP_DATABASE.value)
        print("Database dropped..")
        pass
    
    def dietary_preferences(self):
        self.cursor.execute(SimpleQueries.INSERT_DIETARY_PREFERENCES.value)
        print("Added static data for dietary preferences..")
        pass
    
    def menu_categories(self):
        self.cursor.execute(SimpleQueries.INSERT_MENU_CATEGORIES.value)
        print("Added static data for menu categories..")
        pass
  
    def menu_items(self):
        self.cursor.execute(SimpleQueries.INSERT_MENU_ITEMS.value)
        print("Added static data for menu items..")
        pass
    
    def mock_user(self):
        self.cursor.execute(SimpleQueries.INSERT_MOCK_USER.value)
        print("Added mock user..")
        pass
    
    def execute(self):
        self.dietary_preferences()
        self.mock_user()
        self.menu_categories()
        self.menu_items()
        self.connection.commit()
        self.cursor.close()
        self.connection.close()
    
if __name__ == '__main__':
  PostStaticData().execute()