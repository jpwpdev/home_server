#!/bin/bash

if [[ ! -f /home_server/server.key || ! -f /home_server/server.cert ]]; then
    sudo openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj "/C=US/ST=YourState/L=YourCity/O=YourOrganization/CN=yourdomain.com"
fi

if [[ ! -f /home_server/server.log ]]; then
    touch ./server.log
fi

sudo pm2 startup
cd /home_server/server || exit
sudo pm2 start server.js -i 4
cd /home_server || exit
# cd /home_server/server && sudo npm run start && cd /home_server
# sudo pm2 start server.js --name myapp
