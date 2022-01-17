FROM python:3.9.5-slim-buster

COPY requirements.txt /backend/requirements.txt

# Configure server
RUN set -ex \
    && pip install --upgrade pip \  
    && pip install --no-cache-dir -r /backend/requirements.txt 

# Working directory
WORKDIR /backend

ADD . .

# EXPOSE 8000

# CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "mainproject.wsgi:application"]

CMD gunicorn mainproject.wsgi:application --bind 0.0.0.0:$PORT
