#!/bin/sh
PHPMYADMIN_PATH="/home/web/phpmyadmin"

cd "$PHPMYADMIN_PATH"
git checkout .
git pull -q origin STABLE
composer update --no-dev
