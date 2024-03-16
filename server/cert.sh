#!/bin/bash

if [[ ! -f server.key || ! -f server.cert ]]; then
    sudo openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj "/C=US/ST=YourState/L=YourCity/O=YourOrganization/CN=yourdomain.com"
fi

# sudo npm run start
sudo pm2 start server.js --name myapp
