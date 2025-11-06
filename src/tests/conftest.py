import os
import sys
import types
import importlib

# Provide a minimal mysql connector stub if it's missing so tests don't require the real package.
try:
    import mysql  # noqa: F401
    import mysql.connector  # noqa: F401
    from mysql.connector.cursor import MySQLCursor  # noqa: F401
except Exception:  # pragma: no cover
    mysql = types.ModuleType("mysql")
    connector = types.ModuleType("mysql.connector")
    cursor_mod = types.ModuleType("mysql.connector.cursor")
    class MySQLConnection: ...
    class MySQLCursor: ...
    connector.MySQLConnection = MySQLConnection
    cursor_mod.MySQLCursor = MySQLCursor
    sys.modules["mysql"] = mysql
    sys.modules["mysql.connector"] = connector
    sys.modules["mysql.connector.cursor"] = cursor_mod

import pytest

@pytest.fixture(scope="session")
def app_module():
    os.environ.setdefault("FLASK_ENV", "testing")
    # Ensure the project root (containing 'backend') is importable
    sys.path.insert(0, os.getcwd())
    import backend.app as appmod
    appmod.app.testing = True
    # Provide a fake connection attribute if not present
    if not hasattr(appmod, "connection"):
        class _FakeConn:
            def cursor(self, *a, **k): 
                class _C: 
                    description = []
                    def execute(self, *a, **k): pass
                    def fetchall(self): return []
                    def __enter__(self): return self
                    def __exit__(self, *exc): return False
                return _C()
        appmod.connection = _FakeConn()
    return appmod

@pytest.fixture()
def client(app_module):
    return app_module.app.test_client()
