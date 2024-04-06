from utils import *
from sys import argv

try:
    assert(len(argv) > 3)
except AssertionError as ae:
    print("Not en")

configFn = "./config.json"

config = readFile(configFn)

template = f"""from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
"""

...
