sudo apt-get update
sudo apt-get upgrade

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

sudo usermod -aG docker pi

sudo apt-get install -y libffi-dev libssl-dev python3-dev python3 python3-pip
sudo pip3 install docker-compose

docker pull arm32v7/python:3-slim
