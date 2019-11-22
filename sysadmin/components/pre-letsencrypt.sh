#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

apt-get install -y certbot

# Move our temporary nginx configuration in
mkdir -p /tmp/nginx-config
mkdir -p /tmp/nginx-config-enabled
mv /etc/nginx/sites-available/* /tmp/nginx-config
mv /etc/nginx/sites-enabled/* /tmp/nginx-config-enabled
cp "$DIR/../nginx/initial" /etc/nginx/sites-available/default
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
mkdir -p /home/web/nginx
systemctl restart nginx
