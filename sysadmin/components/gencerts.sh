#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

apt-get install -y letsencrypt

# Move our temporary nginx configuration in
mkdir -p /tmp/nginx-config
cd /etc/nginx/sites-available
mv * /tmp/nginx-config
cp "$DIR/../install-scripts/nginx/initial" default
mkdir -p /home/web/nginx
systemctl restart nginx

# Main site
letsencrypt certonly -a webroot --webroot-path=/home/web/nginx \
  -d coursetable.com -d www.coursetable.com \
  --email 'peter@myrtlelime.com' --agree-tos

# PHPMyAdmin
letsencrypt certonly -a webroot --webroot-path=/home/web/nginx \
  -d thisispma.coursetable.com \
  --email 'peter@myrtlelime.com' --agree-tos

# Restore the initial state
cd /etc/nginx/sites-available
mv /tmp/nginx-config/* .
rm -rf /tmp/nginx-config
systemctl restart nginx

openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
