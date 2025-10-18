import mysql.connector
import os
from dotenv import load_dotenv

from backend.queries.simple_queries import SimpleQueries


class Connect:
    def __init__(self):
        load_dotenv()
        pass
    
    def connect(self, db: str = None):
        return mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            database=db
        )
    
    def create_database_and_connect(self):
        connection = self.connect()
        cursor = connection.cursor()

        # create database if not exists..
        cursor.execute(SimpleQueries.CREATE_DATABASE_IF_NOT_EXISTS.value)
        
        cursor.close()
        connection.close()
        
        return self.connect("nutribite")