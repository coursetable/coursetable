#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Ensure main server has right info & build main server JS
chown -R web:web /home/web/app
cd "$DIR/../.."
chown -R web:web .
su web -c 'composer install'
npm install
node_modules/.bin/webpack

# Regenerate files
cd "$DIR/../../crawler"
php RegenerateDataFiles.php
