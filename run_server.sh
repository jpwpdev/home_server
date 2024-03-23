#!/bin/bash

# Define the base directory
BASE_DIR="/home_server"

# Copy the Nginx configuration into sites-available and create a symbolic link in sites-enabled
sudo cp ${BASE_DIR}/home_server.conf /etc/nginx/sites-available/home_server.conf
sudo ln -sf /etc/nginx/sites-available/home_server.conf /etc/nginx/sites-enabled/home_server.conf

# Test Nginx configuration and reload if successful
sudo nginx -t && sudo systemctl reload nginx

# Start the Node.js server using the provided start.sh script
# cd ./server/ && sudo sh ${BASE_DIR}/server/start.sh
sudo sh ${BASE_DIR}/server/start.sh

echo "DokuWiki and Node.js server are running."
