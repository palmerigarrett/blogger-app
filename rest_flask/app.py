from flask import Flask, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

import logging

from .db_funcs import (
    add_user,
    get_user,
    create_item,
    delete_item,
    edit_item,
    get_all,
    get_user_all,
    get_one,
    login_user,
    validate_user,
    edit_user,
    edit_user_password
)
from .models import BlogPost, User
from . import create_app, db

logging.basicConfig(level=logging.DEBUG)

app = create_app()
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# /blog routes are protected, /blogposts are not

@app.route('/')
@app.route('/blogposts', methods=['GET'])
def blogposts_func():
    if request.method == 'GET':
        blogposts = get_all(BlogPost)
        # app.logger.info(f"blogposts: {blogposts}")
        return jsonify({"blogposts": blogposts})

@app.route('/blogpost/<int:blogpost_id>', methods=['GET'])
def blogpost_id_func(blogpost_id):
    if request.method == 'GET':
        return get_one(BlogPost, blogpost_id)

@app.route('/home/blogposts', methods=['GET'])
@jwt_required
def home_blogposts_func():
    if request.method == 'GET':
        email_address = get_jwt_identity()
        app.logger.info(f"email: {email_address}")
        if not email_address:
            return jsonify({"msg": "Missing authentication parameter"}), 400
        blogposts = get_user_all(BlogPost, email_address)
        return jsonify({"blogposts": blogposts})

@app.route('/blog', methods=['POST'])
@jwt_required
def blog_func():
    if request.method == 'POST':
        request_body = request.get_json()
        email_address = get_jwt_identity()
        if not email_address:
            return jsonify({"msg": "Missing authentication parameter"}), 400
        title = request_body.get('title', '')
        description = request_body.get('description', '')
        return create_item(BlogPost, title=title, email=email_address, description=description)

@app.route('/blog/<int:blogpost_id>', methods=['PUT', 'DELETE'])
@jwt_required
def blog_id_func(blogpost_id):
    email_address = get_jwt_identity()
    valid = validate_user(BlogPost, email_address, blogpost_id)
    if (valid == False):
        return jsonify({"error": "Resource does not exist for this user"}), 400
    if request.method == 'PUT':
        request_body = request.get_json()
        new_title = request_body.get('title', '')
        new_description = request_body.get('description', '')
        return edit_item(BlogPost, blogpost_id, title=new_title, description=new_description)
    elif request.method == 'DELETE':
        if not email_address:
            return jsonify({"msg": "Missing authentication parameter"}), 400
        return delete_item(BlogPost, blogpost_id)

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        request_body = request.get_json()

        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400

        email = request.json.get('email', '')
        password = request.json.get('password', '')
        app.logger.info(f"password:  {password}")
        is_valid, res = login_user(User, email, password)
        
        if (is_valid is False):
            return jsonify({"error": res}), 400
            
        else:
            return jsonify({"token": res})

@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        request_body = request.get_json()
        email = request_body.get('email', '')
        first_name = request_body.get('first_name', '')
        last_name = request_body.get('last_name', '')
        password = request_body.get('password', '')
        app.logger.info(email)
        new_user = add_user(User, email=email, first_name=first_name, last_name=last_name, password=password)
        # login_user(User, email, password)
        return jsonify({"new_user": new_user})
        # return {'id': str(id)}, 200

@app.route('/account', methods=['GET'])
@jwt_required
def get_account_info():
    if request.method == 'GET':
        
        email = get_jwt_identity()
        app.logger.info(email)
        user = get_user(User, email)
        
        return jsonify({"user": user}), 200

@app.route('/edit', methods=['PUT', 'DELETE'])
@jwt_required
def edit_account_info():
    if request.method == 'PUT':
        user = get_jwt_identity()
        request_body = request.get_json()
        new_first_name = request_body.get('first_name', '')
        new_last_name = request_body.get('last_name', '')
        new_email = request_body.get('email', '')
        new_password = request_body.get('password', '')
        return edit_user(
            User,
            user,
            first_name=new_first_name,
            last_name=new_last_name,
            email=new_email,
            password=new_password
        )
    if request.method == 'DELETE':
        user = get_jwt_identity()
        request_body = request.get_json()
        email_to_delete = request_body.get('email', '')
        return delete_item(User, email_to_delete)

@app.route('/verify', methods=['POST'])
def verify_user_func():
    if request.method == 'POST':
        app.logger.info("Verifying")
        request_body = request.get_json()
        email = request_body.get('email', '')
        password = request_body.get('password', '')
        app.logger.info("email")
        app.logger.info(email)
        app.logger.info("password")
        app.logger.info(password)
        is_valid, message = login_user(User, email, password)
        if (is_valid == True):
            return jsonify({"valid": True})
        else:
            return jsonify({"error": message}), 400

@app.route('/reset', methods=['PUT'])
def admin_reset_func():
    if request.method == 'PUT':
        request_body = request.get_json()
        email = request_body.get('email', '')
        password = request_body.get('password', '')
        new_password = request_body.get('new_password', '')
        app.logger.info("email")
        app.logger.info(email)
        app.logger.info("password")
        app.logger.info(password)
        app.logger.info("new_password")
        app.logger.info(new_password)
        message, is_valid = edit_user_password(User, email, password, new_password)
        if (is_valid == True):
            return jsonify({"valid": True})
        else:
            return jsonify({"error": message}), 400