from flask import Flask, jsonify, request
from backend.Models.cart_item import CartItem
from backend.Models.user_detail import UserDetail
from backend.controllers.cart_items import CartItems
from backend.controllers.menu_items import MenuItems
from backend.connect_to_database import Connect
from backend.controllers.user_details import UserDetails

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello from Flask Backend!"

@app.route('/api/data')
def get_data():
    data = {"message": "This is some data from your Flask API"}
    return jsonify(data)

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