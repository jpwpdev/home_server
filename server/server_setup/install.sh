#!/bin/bash

# Update and install Nginx and Node.js
sudo apt update
sudo apt install -y nginx nodejs npm

# Install DokuWiki
wget https://download.dokuwiki.org/src/dokuwiki/dokuwiki-stable.tgz
tar -xvzf dokuwiki-stable.tgz
DOKU_DIR=$(ls | grep dokuwiki | grep -v tgz)
sudo mv $DOKU_DIR /var/www/dokuwiki

# Set permissions
sudo chown -R www-data:www-data /var/www/dokuwiki
sudo chmod -R 755 /var/www/dokuwiki

# Install Certbot
sudo apt install -y software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot -y
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

echo "Installation completed. Please configure your Nginx and run certbot."
