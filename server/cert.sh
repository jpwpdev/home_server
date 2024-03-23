#!/bin/bash

if [[ ! -f server.key || ! -f server.cert ]]; then
    sudo openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj "/C=US/ST=YourState/L=YourCity/O=YourOrganization/CN=yourdomain.com"
fi

cd /server && sudo npm run start && cd ..
# sudo pm2 start server.js --name myapp
