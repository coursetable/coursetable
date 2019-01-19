#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

apt-get install -y default-jre
# Java needed to pack stuff

cd "$DIR/../../web/libs"
composer install

cd "$DIR/../../crawler"
composer install

bash RegenerateDataFiles.sh

cp "$DIR/../nginx/default" /etc/nginx/sites-available/default
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Rebuild packed JS/CSS
npm install -g uglify-js
php "$DIR/../../web/tools/Build.php"
