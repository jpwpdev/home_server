sudo apt update && sudo apt upgrade -y
sudo apt install wireguard -y
wg genkey | tee /etc/wireguard/privatekey | wg pubkey > /etc/wireguard/publickey
sudo nano /etc/wireguard/wg0.conf
