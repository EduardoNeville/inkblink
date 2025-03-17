#!/bin/sh
/app/ib-backend &  # Run the backend in the background
serve -s /app/inkblink -l 3000  # Run the frontend in the foreground
