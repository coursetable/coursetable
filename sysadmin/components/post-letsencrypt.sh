#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Restore the initial state
cd /etc/nginx/sites-available
mv /tmp/nginx-config/* .
cd /etc/nginx/sites-enabled
mv /tmp/nginx-config-enabled/* .
rm -rf /tmp/nginx-config
rm -rf /tmp/nginx-config-enabled

if [ ! -f /etc/ssl/certs/dhparam.pem ]; then
  openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
fi
systemctl restart nginx
