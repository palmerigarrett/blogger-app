from flask import Flask
from flask_migrate import Migrate
from .models import db
from . import config
import logging

migrate = Migrate()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
    app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    logging.basicConfig(level=logging.DEBUG)
    app.logger.info("Starting Flask App")
    app.logger.info(app.config['SQLALCHEMY_DATABASE_URI'])
    app.app_context().push()
    db.init_app(app)
    # db.drop_all()
    migrate.init_app(app, db)
    # # TIP: should be taken care of by migrationsdb.create_all() # Create sql tables for our data models
    # with app.app_context():

    #     # Migration
    #     migrate.init_app(app, db)

    #     # No need for this
    #     # Should be taken care of by migrate
    #     # Create tables for our models

    return app
