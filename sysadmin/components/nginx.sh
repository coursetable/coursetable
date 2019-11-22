#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

apt-get install -y nginx
mkdir -p /home/web/nginx # Used only for letsencrypt renewals

cp -f /etc/nginx/nginx.conf /etc/nginx/nginx.conf.save
cp -f "$DIR/../nginx/nginx.conf" /etc/nginx/nginx.conf
cp "$DIR/../nginx/default" /etc/nginx/sites-available/default
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

cp "$DIR/../nginx/ssl-params.conf" /etc/nginx/snippets/ssl-params.conf

# The default init.d script doesn't remove sockets during `systemctl stop`
# or `systemctl restart`, and causes an error on the next start.
# This script fixes it:
# from https://unix.stackexchange.com/questions/164866/nginx-leaves-old-socket
# and https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=821111
sed -i 's@--retry QUIT/5 --pidfile@--retry TERM/5/QUIT/5/KILL/5 --pidfile@' /lib/systemd/system/nginx.service
sed -i 's@STOP_SCHEDULE="\${STOP_SCHEDULE:-QUIT/5/TERM/5/KILL/5}@STOP_SCHEDULE="${STOP_SCHEDULE:-TERM/5/QUIT/5/KILL/5}@' /etc/init.d/nginx
systemctl daemon-reload
