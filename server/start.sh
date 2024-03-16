cd /home_server

sudo git pull origin main

cd ./server

sudo python3 package_install.py

sudo chmod +x cert.sh

sudo ./cert.sh
