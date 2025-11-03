from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from backend.connect_to_database import Connect
from backend.setup_database import SetupDatabase
from backend.queries.static_data import PostStaticData
from backend.queries.simple_queries import SimpleQueries


try:
    print("SETTING UP DATABASE...")
    db_connector = Connect()
    connection = db_connector.connect()
    
    setup = SetupDatabase(connection)
    setup.setup()  # run create_database(), use_database(), etc.
    
    # After setup, close this initial connection
    connection.close()
    print("DATABASE SETUP COMPLETE.")
except Exception as e:
    print(f"FATAL DATABASE SETUP FAILED: {e}")


app = Flask(__name__)
bcrypt = Bcrypt(app)
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

    # --- Password Validation ---
    if not password or len(password) < 8:
        return jsonify({"error" : "Password must be atleast 8 character long"}), 400


    #Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # -- Database logic --

    try: 
        # getting new db connection and cursor for this request
        db_connector = Connect()
        connection = db_connector.connect()
        cursor = connection.cursor()

        # Use the nutribite database
        cursor.execute("USE nutribite;")

        # define the data to insert
        user_data = (username, email, hashed_password)

        # Execute the query
        cursor.execute(SimpleQueries.INSERT_NEW_USER.value, user_data)

        # Commit (save) the changes to the database
        connection.commit()

        # Close the connection
        cursor.close()
        connection.close()

    except Exception as e:
        #Handle errors
        print(f"DATABASE ERROR: {e}")
        return jsonify({"error": "Failed to register user. Email may already exist."}), 500
    
    print(f"Successfully registered: Username={username}, Email={email}")

    return jsonify({
        "message": f"User {username} registered successfully",
        "username": username,
        "email": email
    }), 201


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
    #Connect().setup()
    app.run(debug=True) # debug=True is for development, disable in production
