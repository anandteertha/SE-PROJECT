from mysql.connector.cursor import MySQLCursor

class DatabaseUtils:
    @staticmethod
    def execute(cursor: MySQLCursor, query, param=None):
        if param is None:
            cursor.execute(query)
        else:
            cursor.execute(query, param)
        items = cursor.fetchall()
        columns = [d[0] for d in cursor.description]
        return [dict(zip(columns, r)) for r in items]