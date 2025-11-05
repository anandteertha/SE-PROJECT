import re
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager
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


# Setup the JWT manager
app.config["JWT_SECRET_KEY"] = "keep-the-user-logged-in"
jwt = JWTManager(app)

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

    # --- New Strong Password Validation ---
    if not password:
        return jsonify({"error": "Password is required"}), 400

    if len(password) < 10:
        return jsonify({"error": "Password must be at least 10 characters long"}), 400

    # Check for at least one uppercase letter
    if not re.search(r"[A-Z]", password):
        return jsonify({"error": "Password must contain at least one uppercase letter"}), 400

    # Check for at least one lowercase letter
    if not re.search(r"[a-z]", password):
        return jsonify({"error": "Password must contain at least one lowercase letter"}), 400

    # Check for at least one number
    if not re.search(r"[0-9]", password):
        return jsonify({"error": "Password must contain at least one number"}), 400

    if not re.search(r"[^a-zA-Z0-9]", password):
        return jsonify({"error": "Password must contain at least one special character"}), 400

    # --- End Validation ---

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try: 
        db_connector = Connect()
        connection = db_connector.connect()
        cursor = connection.cursor()

        cursor.execute("USE nutribite;")

        user_data = (username, email, hashed_password)
        cursor.execute(SimpleQueries.INSERT_NEW_USER.value, user_data)
        connection.commit()
        cursor.close()
        connection.close()

    except Exception as e:
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
    login_id = data.get("loginId") 
    password = data.get("password")

    try:
        db_connector = Connect()
        connection = db_connector.connect()

        # Use dictionary=True to get results as a {"column_name": "value"} dict
        cursor = connection.cursor(dictionary=True)
    
        cursor.execute("USE nutribite;")


        # Find the user by email
        cursor.execute(SimpleQueries.SELECT_USER_BY_USERNAME_OR_EMAIL.value, (login_id, login_id))
        user = cursor.fetchone() # get the first (and only) result

        # check if user exists and password is correct
        if user and bcrypt.check_password_hash(user['Password'], password):
            # Password is correct!
            print(f"Login successful for: {login_id}")

            access_token = create_access_token(identity=user['Email'])
            #close connection
            cursor.close()
            connection.close()

            #Login successful
            # sending dummy token now
            return jsonify({
                "message": "Login successful",
                "token": access_token,
                "username": user['Name']
            }), 200
        else:
            #invalid email or password
            print(f"Invalid login attempt for: {login_id}")

            #Close connection
            cursor.close()
            connection.close()

            return jsonify({"error": "Invalid email or password"}), 401
        
    except Exception as e:
        print(f"DATABASE ERROR: {e}")
        return jsonify({"error": "An error occured during the login."}), 500    


if __name__ == '__main__':
    #Connect().setup()
    app.run(debug=True) # debug=True is for development, disable in production
