#!/bin/bash

# Update and install Nginx and PHP
sudo apt update
sudo apt install -y nginx php-fpm php-cli php-mbstring php-xml php-gd

# Create /home_server if it does not exist
sudo mkdir -p /home_server

# Download and extract DokuWiki
cd /home_server
sudo wget https://download.dokuwiki.org/src/dokuwiki/dokuwiki-stable.tgz -O dokuwiki.tgz
sudo tar -xzf dokuwiki.tgz
sudo rm dokuwiki.tgz
DOKU_DIR=$(sudo ls | grep dokuwiki | grep -v tgz)
sudo mv $DOKU_DIR dokuwiki

# Set proper permissions for DokuWiki
sudo chown -R www-data:www-data /home_server/dokuwiki
sudo chmod -R 755 /home_server/dokuwiki

echo "Installation of Nginx, PHP, and DokuWiki completed."
