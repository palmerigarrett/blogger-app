from flask import jsonify
from flask_bcrypt import check_password_hash

from flask_jwt_extended import create_access_token
from .models import db
import datetime

def get_all(model):
    data = model.query.order_by(model.created_at).all()
    data_list = [d.serialize for d in data]
    return data_list
    
def get_user_all(model, email):
    data = model.query.filter_by(email=email).order_by(model.created_at)
    data_list = [d.serialize for d in data]
    return data_list

def get_one(model, id):
    item = model.query.filter_by(id=id).one()
    serialized_item = item.serialize
    return jsonify(serialized_item)

def get_user(model, email):
    user = model.query.filter_by(email=email).first()
    serialized_user = user.serialize
    return serialized_user

def create_item(model, **kwargs):
    item = model(**kwargs)
    db.session.add(item)
    commit_changes()
    serialized_item = item.serialize
    return jsonify(serialized_item)

def edit_item(model, id, **kwargs):
    item = model.query.filter_by(id=id).one()
    for attribute, updated_value in kwargs.items():
        if (updated_value):
            setattr(item, attribute, updated_value)
    commit_changes()
    serialized_item = item.serialize
    return jsonify(serialized_item)

def delete_item(model, id):
    item = model.query.filter_by(id=id).one()
    db.session.delete(item)
    commit_changes()
    deleted_blogpost = f'Blogpost Number {id}'
    response = {'deleted': deleted_blogpost}
    return jsonify(response)

def add_user(model, **kwargs):
    user = model(**kwargs)
    user.hash_password()
    db.session.add(user)
    commit_changes()
    serialized_item = user.serialize
    return serialized_item

def edit_user(model, email_address, **kwargs):
    item = model.query.filter_by(email=email_address).first()
    for attribute, updated_value in kwargs.items():
        if (updated_value):
            setattr(item, attribute, updated_value)
            if (attribute == 'password'):
                # item.hash_password()
                continue
    commit_changes()
    serialized_item = item.serialize
    return serialized_item

def login_user(model, email_address, password):
    user = model.query.filter_by(email=email_address).first()
    authorized = check_password_hash(user.password, password)
    
    if not email_address:
        return False, "Missing email parameter"
    if not password:
        return False, "Missing password parameter"
    if not authorized:
        return False, "Email or password invalid"

    # Identity can be any data that is json serializable
    expires = datetime.timedelta(days=7)
    access_token = create_access_token(identity=email_address, expires_delta=expires)
    return True, access_token
def validate_user(model, email_address, id):
    if not email_address:
        return False
    editor = email_address
    blogpost = model.query.filter_by(id=id).one()
    author = blogpost.email
    if (editor != author):
        return False
    return True

def edit_user_password(model, email, password, new_password):
    user = model.query.filter_by(email=email).first()
    if (not user):
        return "This user does not exist in our application", False
    
    authorized = check_password_hash(user.password, password) 
    is_valid = False
    
    if (not email):
        return "Missing email input", is_valid
    if (not password):
        return "Missing password input", is_valid
    if (not authorized):
        return "Email or password is invalid", is_valid
    else:
        is_valid = True
        setattr(user, "password", new_password)
        user.hash_password()
        commit_changes()
        return '', is_valid

def commit_changes():
    db.session.commit()