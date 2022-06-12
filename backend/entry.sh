#!/bin/sh
exec gunicorn -b :5001 --access-logfile - --error-logfile - app:app - --timeout=3000
