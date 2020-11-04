#!/bin/sh

echo 'Howdy, Docker!'

flask db init
flask db revision -m "autocreate migrations"

echo 'applying migrations'
flask db upgrade

flask run --host=0.0.0.0 --port=8000