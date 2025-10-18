import mysql.connector
from mysql.connector import MySQLConnection
import os
from dotenv import load_dotenv
from backend.queries.simple_queries import SimpleQueries
from backend.setup_database import SetupDatabase


class Connect:
    def __init__(self):
        load_dotenv()
        pass
    
    def connect(self, db: str = None) -> MySQLConnection:
        return mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            database=db
        )
    
    def create_database_and_connect(self):
        connection = self.connect()
        cursor = connection.cursor()
        cursor.execute(SimpleQueries.CREATE_DATABASE_IF_NOT_EXISTS.value)
        print("CREATED DATABASE..")
        cursor.close()
        connection.close()
        return self.connect("nutribite")
    
    def setup(self):
        try:
            connection = self.create_database_and_connect()
            SetupDatabase(connection).setup()
        except Exception as e:
            print(e)
            return