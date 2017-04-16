from flask import Flask
from flask_cors import CORS, cross_origin
from movies.route.controller import main
from movies.config import configure
from movies.models.models import db
from movies.middleware import PrefixMiddleware

app = Flask(__name__, static_url_path="", static_folder='static', template_folder='static')
app.wsgi_app = PrefixMiddleware(app.wsgi_app, prefix='/javier')

configure(app)
db.init_app(app)
CORS(app)

with app.app_context():
  db.create_all()

app.register_blueprint(main, url_prefix='/')
