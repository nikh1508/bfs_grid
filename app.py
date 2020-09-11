from flask import Flask, render_template, request, Response, send_from_directory
from flask_cors import CORS
import numpy as np
import os
import sys
import json
import logging

debug = os.environ['FLASK_ENV'] == 'development'
log = logging.getLogger('werkzeug')
log.setLevel(logging.DEBUG if debug else logging.ERROR)
fh = logging.FileHandler('server.log')
log.addHandler(fh)
if debug:
    sh = logging.StreamHandler(sys.stdout)
    log.addHandler(sh)

app = Flask(__name__)
CORS(app)

if debug:
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
path = os.environ['SERVER_PATH']


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/')
def index():
    return render_template('index.html', path=path if path != '/' else '')


@app.route('/get_random_matrix')
def rand_matrix():
    OBSTACLE_BIAS = float(request.args['bias'])
    matrix = np.random.choice([0, 1], int(request.args['x']) * int(request.args['y']), p=[
        1-OBSTACLE_BIAS, OBSTACLE_BIAS])
    matrix = [int(x) for x in matrix]
    return Response(json.dumps(list(matrix)), mimetype='application/json')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ['FLASK_RUN_PORT'])
