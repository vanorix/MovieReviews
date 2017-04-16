from movies.models.models import db
import os

class BaseConfig(object):
  basedir = os.path.abspath(os.path.dirname(__file__))
  DEBUG = False
  TESTING = False
  SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
  SECRET_KEY = 'mysecretkey'

class DevelopmentConfig(BaseConfig):
  DEBUG = True
  TESTING = False
  SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BaseConfig.basedir, 'app.db')
  SECRET_KEY = 'mysecretkey'

config = {
  "default": "movies.config.DevelopmentConfig",
  "development": "movies.config.DevelopmentConfig"
}

def configure(app):
  config_name = os.getenv('FLASK_CONFIGURATION', 'default')
  app.config.from_object(config[config_name])