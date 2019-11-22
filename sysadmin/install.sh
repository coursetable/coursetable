#!/bin/sh
# Installs the server for the first time
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#
# Prompts
#
cd "$DIR"

MYSQL_ROOT_PASSWORD=''
echo 'Please enter the MySQL root user password'
read -e MYSQL_ROOT_PASSWORD

MYSQL_COURSETABLE_PASSWORD=''
echo 'Please enter the MySQL coursetable user password'
read -e MYSQL_COURSETABLE_PASSWORD

# Set timezone
ln -sf /usr/share/zoneinfo/US/Eastern /etc/localtime
dpkg-reconfigure --frontend noninteractive tzdata

sudo hostnamectl set-hostname coursetable.com

# Install components
bash "$DIR/components/updates.sh"
bash "$DIR/components/mariadb.sh" "$MYSQL_ROOT_PASSWORD"
bash "$DIR/components/nginx.sh"
bash "$DIR/components/phpmyadmin.sh" /home/web/phpmyadmin coursetable.com
bash "$DIR/components/pre-letsencrypt.sh"
bash "$DIR/components/letsencrypt.sh" coursetable.com thisispma.coursetable.com
bash "$DIR/components/post-letsencrypt.sh"
bash "$DIR/components/nodejs.sh"
bash "$DIR/components/php.sh"
bash "$DIR/components/db.sh" "$MYSQL_COURSETABLE_PASSWORD"
bash "$DIR/components/s3backup.sh"
bash "$DIR/components/install-app.sh" "$MYSQL_COURSETABLE_PASSWORD"
