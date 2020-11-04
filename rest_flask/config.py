import os
# host should reference the postgres container name locally, NOT "localhost"
user = os.environ.get('POSTGRES_USER', 'pg user not found')
password = os.environ.get('POSTGRES_PASSWORD', 'pg password not found')
host = os.environ.get('POSTGRES_HOST', 'pg host not found')
database = os.environ.get('POSTGRES_DB', 'pg database not found')
port = os.environ.get('POSTGRES_PORT', 'pg port not found')

SQLALCHEMY_DATABASE_URI = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'secret key not found')