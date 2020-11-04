from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import generate_password_hash, check_password_hash

db = SQLAlchemy()

class BlogPost(db.Model):
    __tablename__ = 'blog_post'

    # primary_key means that the id will be unique for each object
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), db.ForeignKey('user.email'), nullable=False)
    description = db.Column(db.String(500))
    # when a blogpost is created, date field will default to the current time
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_on = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp()
    )

    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'email': self.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'description': self.description,
            'created_at': self.created_at,
            'updated_on': self.updated_on,
        }

class User(db.Model):
    email = db.Column(db.String(100), primary_key=True, unique=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(1000), nullable=False)
    blogposts = db.relationship('BlogPost',
                                backref='user',
                                lazy=True)
                                # order_by='Blogpost.created_at')

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @property
    def serialize(self):
        return {
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'password': self.password,
        }