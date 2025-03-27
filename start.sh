#!/bin/sh
echo "Diesel run migration starting..."
diesel migration run --database-url "postgres://ib_usr:ib_pwd@db:5432/ib_db" --migration-dir ./migrations
echo "Diesel run migration finished..."
/app/ib-backend &  # Run the backend in the background
serve -s /app/inkblink -l 3000  # Run the frontend in the foreground
