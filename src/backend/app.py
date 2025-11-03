from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from backend.connect_to_database import Connect
from backend.setup_database import SetupDatabase
from backend.queries.static_data import PostStaticData

# Set up the database

try:
    db_connector = Connect()    # 1. Create your connector
    connection = db_connector.connect()    # 2. Get the raw connection from it
    
    setup = SetupDatabase(connection)    # 3. Pass the connection to SetupDatabase
    setup.setup()          # 4. Call the 'setup()' method
except Exception as e:
    print(f"DATABASE SETUP FAILED: {e}")

app = Flask(__name__)
# CORS(app)

@app.route('/')
def home():
    return "Hello from Flask Backend!"

@app.route('/api/data')
def get_data():
    data = {"message": "This is some data from your Flask API"}
    return jsonify(data)


@app.route("/register", methods=["POST"])
@cross_origin(origins="http://localhost:4200", allow_headers=["Content-Type"])
def register_user():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    print(f"RECEIVED DATA: Username={username}, Email={email}")

    # ---
    # TODO: Add password strength check (AC 4)
    # TODO: Hash the password (for security)
    # TODO: Save the new user to the database
    # ---

    return jsonify({"message": f"User {username} registered successfully"}), 201


@app.route("/login", methods=["POST"])
@cross_origin(origins="http://localhost:4200", allow_headers=["Content-Type"])
def login_user():
    # Get the data from the frontend's request
    data = request.json
    email = data.get("email")
    password = data.get("password")

    print(f"RECEIVED DATA: Email={email}")

    # ---
    # TODO: Find the user in the database
    # TODO: Check if the password matches
    # TODO: Create and return a session token (JWT)
    # ---

    # send back a dummy success message
    return jsonify({"message": "Login successful", "token": "dummy-token-123"}), 200

if __name__ == '__main__':
    Connect().setup()
    app.run(debug=True) # debug=True is for development, disable in production
