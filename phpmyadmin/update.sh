#!/bin/sh
PHPMYADMIN_PATH="/home/web/phpmyadmin"

cd "$PHPMYADMIN_PATH"
git checkout .
git pull -q origin STABLE
chown -R web:web .
chown -R www-data:www-data tmp
su web -c 'composer update --no-dev'
