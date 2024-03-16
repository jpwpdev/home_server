#!/bin/bash

# Create an Nginx server block file
cat << EOF | sudo tee /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade; # Escape $ with \$
        proxy_set_header Connection 'upgrade'; # No need to escape single quotes
        proxy_set_header Host \$host; # Escape $ with \$
        proxy_cache_bypass \$http_upgrade; # Escape $ with \$
    }

    location /wiki {
        alias /var/www/dokuwiki;
        index doku.php;

        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php7.4-fpm.sock; # Make sure this matches your PHP-FPM socket path
            fastcgi_param SCRIPT_FILENAME \$request_filename; # Escape $ with \$
        }
    }
}
EOF

# Enable the configuration
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo unlink /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo "Nginx has been configured."
