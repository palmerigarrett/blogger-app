FROM python:3.6

# update container
RUN apt-get update

# create and set workdir
RUN mkdir /app
WORKDIR /app

# set env variable
ENV FLASK_ENV development
ENV FLASK_APP app.py

# copy current directory's contents into app
COPY . /app

# install necessary packages
RUN pip install --no-cache-dir -r requirements.txt

# Make entrypoint executable
RUN chmod +x /app/api-entrypoint.sh

CMD ["/bin/bash", "/app/api-entrypoint.sh"]
EXPOSE 8000