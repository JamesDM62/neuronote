#!/usr/bin/env bash

# Apply migrations
flask db upgrade

# Start the app using Gunicorn (production-ready WSGI server)
exec gunicorn -w 4 -b 0.0.0.0:8000 'app:create_app()'
