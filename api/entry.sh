#!/bin/sh

# Use hot reload env var to determine if we should run the server in hot reload mode
if [ "$HOT_RELOAD" = "true" ]; then
  # Run the server in hot reload mode
  npm run start
else
  # Run the server in production mode
  npm run start:prod
fi
