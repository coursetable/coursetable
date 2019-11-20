#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -z "$1" ]; then
  INSTALL_PATH="/home/web/phpmyadmin"
else
  INSTALL_PATH="$1"
fi

DOMAIN="$2"

# Install PHPMyAdmin
# https://davejamesmiller.com/blog/automatic-upgrades-for-phpmyadmin
apt-get install -y php-fpm php-mbstring php-mysql php-json php-xml php-curl composer unzip
git clone --depth=1 --branch=STABLE git://github.com/phpmyadmin/phpmyadmin.git /home/web/phpmyadmin
cd "$INSTALL_PATH"

# Create a tmp directory so phpMyAdmin can cache templates
mkdir tmp
chown -R www-data:www-data tmp

# Don't run composer as root, as it triggers a warning
chown -R web:web .
su web -c 'composer update --no-dev'

cp "$DIR/../phpmyadmin/config.inc.php" "$INSTALL_PATH/config.inc.php"
cp "$DIR/../nginx/phpmyadmin" /etc/nginx/sites-available/phpmyadmin

if [ -n "$DOMAIN" ]; then
  sed -i "s@DOMAIN.com@$DOMAIN@g" /etc/nginx/sites-available/phpmyadmin
fi

ln -sf /etc/nginx/sites-available/phpmyadmin /etc/nginx/sites-enabled/phpmyadmin
systemctl restart nginx
systemctl restart php7.2-fpm
