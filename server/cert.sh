#!/bin/bash

cd /home_server/server || exit

if [[ ! -f ./server.key || ! -f ./server.cert ]]; then
    sudo openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj "/C=US/ST=IL/L=Mundelein/O=FoxHomeNetwork/CN=homenetwork.com"
    echo created key
fi

if [[ ! -f ./server.log ]]; then
    touch ./server.log
    echo created log
fi

# sudo pm2 startup
echo running pm2
sudo pm2 start server.js -i 4
echo pm2 started
cd /home_server || exit
# cd /home_server/server && sudo npm run start && cd /home_server
# sudo pm2 start server.js --name myapp
