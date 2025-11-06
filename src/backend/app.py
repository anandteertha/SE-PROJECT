import re
from flask import Flask, jsonify, request
from backend.Models.cart_item import CartItem
from backend.Models.user_detail import UserDetail
from backend.controllers.cart_items import CartItems
from backend.controllers.menu_items import MenuItems
from backend.connect_to_database import Connect
from backend.controllers.user_details import UserDetails
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager
from backend.queries.simple_queries import SimpleQueries



app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config["JWT_SECRET_KEY"] = "keep-the-user-logged-in"
jwt = JWTManager(app)

@app.route('/')
def home():
    return "Hello from Flask Backend!"

@app.route('/api/data')
def get_data():
    data = {"message": "This is some data from your Flask API"}
    return jsonify(data)


@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.get_json()
    username = data.get("Name")
    email = data.get("Email")
    password = data.get("Password")
    if not password:
        return jsonify({"error": "Password is required"}), 400

    if len(password) < 10:
        return jsonify({"error": "Password must be at least 10 characters long"}), 400

    if not re.search(r"[A-Z]", password):
        return jsonify({"error": "Password must contain at least one uppercase letter"}), 400

    if not re.search(r"[a-z]", password):
        return jsonify({"error": "Password must contain at least one lowercase letter"}), 400

    if not re.search(r"[0-9]", password):
        return jsonify({"error": "Password must contain at least one number"}), 400

    if not re.search(r"[^a-zA-Z0-9]", password):
        return jsonify({"error": "Password must contain at least one special character"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    user_detail = UserDetail()
    user_detail.Name = username
    user_detail.Email = email
    user_detail.Password = hashed_password
    return jsonify(UserDetails(connection).post(user_detail)), 201

@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.get_json()
    try:
        user_detail = UserDetail()
        user_detail.Name = data.get("Name")
        user_detail.Email = data.get("Email")
        user_detail.Password = data.get("Password")
        user = UserDetails(connection).get_by_user_details(user_detail)
        if user and bcrypt.check_password_hash(user['Password'], user_detail.Password):

            access_token = create_access_token(identity=user['Email'])
            return jsonify({
                "message": "Login successful",
                "token": access_token,
                "username": user_detail.Name,
                "id": user["Id"],
                "email": user['Email']
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        print(f"DATABASE ERROR: {e}")
        return jsonify({"error": "An error occured during the login."}), 500    


@app.route('/api/menu-items')
def get_menu_items():
    user_id = int(request.args.get('user_id'))
    return jsonify(MenuItems(connection).get(user_id)), 200

@app.post('/api/cart')
def post_cart_items():
    data = request.get_json()
    cart_items = CartItem()
    cart_items.UserId  = data.get('UserId')
    cart_items.MenuItemId  = data.get('MenuItemId')
    cart_items.Quantity = data.get('Quantity')
    cart_items.ExtraNote = data.get('ExtraNote')
    return jsonify(CartItems(connection).post(cart_items)), 201

@app.get('/api/cart')
def get_cart_items():
    user_id = int(request.args.get('user_id'))
    return jsonify(CartItems(connection).get(user_id)), 200

@app.get('/api/user/details')
def get_user_details():
    user_id = int(request.args.get('user_id'))
    return jsonify(UserDetails(connection).get(user_id)), 200

@app.patch('/api/user/preferences')
def update_user_preferences():
    data = request.get_json()
    user_details = UserDetail()
    user_details.DietaryPreference = data.get('DietaryPreference')
    user_details.Email = data.get('Email')
    user_details.Id = data.get('Id')
    user_details.Name = data.get('Name')
    user_details.Password = data.get('Password')
    user_details.Salt = data.get('Salt')
    user_details.Spiciness = data.get('Spiciness')
    user_details.Sweetness = data.get('Sweetness')
    
    return jsonify(UserDetails(connection).patch(user_details)), 200

if __name__ == '__main__':
    connection = Connect().setup()
    app.run(debug=True) # debug=True is for development, disable in production
