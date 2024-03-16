#!/bin/bash

# Define variables for certificate files
SSL_DIR="/etc/nginx/ssl"
DOMAIN="localhost"
KEY_FILE="${SSL_DIR}/${DOMAIN}.key"
CERT_FILE="${SSL_DIR}/${DOMAIN}.cert"

# Create SSL directory
sudo mkdir -p ${SSL_DIR}

# Generate a self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ${KEY_FILE} -out ${CERT_FILE} \
    -subj "/C=US/ST=YourState/L=YourCity/O=YourOrganization/CN=${DOMAIN}"

# Adjust Nginx configuration to use the self-signed certificate
sudo sed -i "s|listen 80;|listen 443 ssl;|g" /etc/nginx/sites-available/myapp
sudo sed -i "s|server_name your_domain.com;|server_name ${DOMAIN};|g" /etc/nginx/sites-available/myapp
sudo sed -i "/server_name ${DOMAIN};/a ssl_certificate ${CERT_FILE};" /etc/nginx/sites-available/myapp
sudo sed -i "/ssl_certificate ${CERT_FILE};/a ssl_certificate_key ${KEY_FILE};" /etc/nginx/sites-available/myapp

# Reload Nginx to apply changes
sudo nginx -t && sudo systemctl reload nginx

echo "Self-signed SSL setup complete. Nginx has been reloaded."
