#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

MYSQL_PASSWORD="$1"

if [ -z "$MYSQL_PASSWORD" ]; then
  echo 'Please enter the MySQL coursetable user password'
  read -e MYSQL_PASSWORD

  if [ -z "$MYSQL_PASSWORD" ]; then
    echo 'No password entered; exiting'
    exit
  fi
fi

apt install -y 
cd /home/web/app


# Grant permissions for the web server user to write to the templates_c
chown www-data:www-data -R web/gen/smarty/templates_c

# Add the Github key; based on https://serverfault.com/a/701637
# Note this is very slightly insecure since the answer tells you to verify the
# signatures, but not a big threat to us
ssh-keyscan github.com >> /tmp/githubKey
cat /root/.ssh/known_hosts /tmp/githubKey > /root/.ssh/known_hosts

# Clone the crawler
cd "$DIR/../../.." # /home/web
git clone git@github.com:hsheth2/coursetable-crawler.git coursetable-crawler

# Set the main server MySQL server to itself
cd "$DIR/../.."
sed -i "s@'MYSQL_HOST', '[^']*'@'MYSQL_HOST', 'localhost'@g" web/includes/Credentials.php
sed -i "s@'MYSQL_PASSWORD', '[^']*'@'MYSQL_PASSWORD', '$MYSQL_PASSWORD'@g" web/includes/Credentials.php

cd "$DIR/../../../coursetable-crawler"
sed -i "s@'MYSQL_HOST', '[^']*'@'MYSQL_HOST', 'localhost'@g" includes/Constants.php
sed -i "s@'MYSQL_PASSWORD', '[^']*'@'MYSQL_PASSWORD', '$MYSQL_PASSWORD'@g" includes/Constants.php
