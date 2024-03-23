#!/bin/bash

# Define your project base directories
NODEJS_DIR="/home_server/server/"
DOKUWIKI_DIR="/home_server/dokuwiki/"
SSL_CERT="/home_server/server/server.cert"
SSL_KEY="/home_server/server/server.key"

# Function to list permissions and ownership
list_permissions() {
    echo "Listing permissions and ownership for: $1"
    ls -l $1
    echo ""
}

# Function to fix permissions and ownership
fix_permissions() {
    # Fix permissions for DokuWiki
    echo "Fixing permissions for DokuWiki..."
    sudo chown -R www-data:www-data $DOKUWIKI_DIR
    sudo chmod -R 755 $DOKUWIKI_DIR

    # Ensure Node.js application files are accessible
    echo "Ensuring Node.js application files are accessible..."
    sudo chown -R $USER:www-data $NODEJS_DIR
    sudo chmod -R 755 $NODEJS_DIR

    # Secure SSL certificate and key
    echo "Securing SSL certificate and key..."
    sudo chown root:root $SSL_CERT $SSL_KEY
    sudo chmod 644 $SSL_CERT
    sudo chmod 600 $SSL_KEY

    echo "Permissions and ownership fixed."
}

# Main execution starts here

# List current permissions and ownership
list_permissions $NODEJS_DIR
list_permissions $DOKUWIKI_DIR
list_permissions $SSL_CERT
list_permissions $SSL_KEY

# Fix permissions and ownership
fix_permissions

# List new permissions and ownership
list_permissions $NODEJS_DIR
list_permissions $DOKUWIKI_DIR
list_permissions $SSL_CERT
list_permissions $SSL_KEY
