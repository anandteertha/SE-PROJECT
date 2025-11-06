from mysql.connector import MySQLConnection
from backend.Models.user_detail import UserDetail
from backend.database_utils import DatabaseUtils
from backend.queries.simple_queries import SimpleQueries

class UserDetails:
    def __init__(self, connection: MySQLConnection):
        self.connection = connection
        self.cursor = connection.cursor()
        pass
    
    def get_by_user_details(self, user_details: UserDetail):
        return DatabaseUtils.execute(self.cursor, SimpleQueries.SELECT_USER_BY_USERNAME_OR_EMAIL.value, [user_details.Name, user_details.Email])[0]
    
    def get(self, user_id: int):
        return DatabaseUtils.execute(self.cursor, SimpleQueries.SELECT_USER_DETAILS.value, [user_id])[0]
    
    def post(self, user_details: UserDetail):
        with self.connection.cursor() as cursor:
            cursor.execute(SimpleQueries.INSERT_NEW_USER.value, (user_details.Name, user_details.Email, user_details.Password))
            self.connection.commit()
        return {}
    
    def patch(self, user_details: UserDetail):
        with self.connection.cursor() as cursor:
            cursor.execute(SimpleQueries.UPDATE_USER.value, (user_details.Name, user_details.Password, user_details.Email, user_details.Spiciness, user_details.Sweetness, user_details.Salt, user_details.DietaryPreference, user_details.Id))
            self.connection.commit()
        return {}