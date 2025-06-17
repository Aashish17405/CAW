from flask import request, jsonify, Flask

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello_world():
    return jsonify({'message': 'Hello World!'})

@app.route('/s', methods=['POST'])
def super():
    data = request.get_json()

if __name__ == '__main__':
    app.run(debug=True)