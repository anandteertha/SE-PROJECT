from flask import Flask, jsonify
from backend.connect_to_database import Connect

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello from Flask Backend!"

@app.route('/api/data')
def get_data():
    data = {"message": "This is some data from your Flask API"}
    return jsonify(data)

if __name__ == '__main__':
    Connect().setup()
    app.run(debug=True) # debug=True is for development, disable in production