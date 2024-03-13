sudo apt install nginx php-fpm php-cli php-mbstring php-xml php-gd -y
sudo wget https://download.dokuwiki.org/src/dokuwiki/dokuwiki-stable.tgz
sudo tar -xvzf dokuwiki-stable.tgz
sudo mv dokuwiki-20XX-XX-XX /var/www/dokuwiki
sudo ln -s ./home_server /etc/nginx/sites-enabled/
sudo systemctl reload nginx
sudo chown -R www-data:www-data /var/www/dokuwiki
sudo chmod -R 755 /var/www/dokuwiki
