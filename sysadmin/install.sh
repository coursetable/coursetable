#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#
# Prompts
#
cd "$DIR"
if [ ! -d "$DIR/install-scripts" ]; then
  git clone -b v20170730 git@gitlab.com:myrtlelime/install-scripts.git
fi

MYSQL_ROOT_PASSWORD=''
echo 'Please enter the MySQL root user password'
read -e MYSQL_ROOT_PASSWORD

MYSQL_COURSETABLE_PASSWORD=''
echo 'Please enter the MySQL coursetable user password'
read -e MYSQL_COURSETABLE_PASSWORD

# Make apt not use ipv6
sed -i 's@#precedence ::ffff:0:0/96  100@precedence ::ffff:0:0/96  100@' /etc/gai.conf

# Set timezone
ln -sf /usr/share/zoneinfo/US/Eastern /etc/localtime
dpkg-reconfigure --frontend noninteractive tzdata

# Install components
bash "$DIR/install-scripts/components/updates.sh"
bash "$DIR/install-scripts/components/mariadb.sh" "$MYSQL_ROOT_PASSWORD"
bash "$DIR/install-scripts/components/nginx.sh"
bash "$DIR/install-scripts/components/phpmyadmin.sh"
bash "$DIR/install-scripts/components/nodejs.sh"
bash "$DIR/components/php.sh"
bash "$DIR/components/db.sh" "$MYSQL_COURSETABLE_PASSWORD"

sed -i 's@DOMAIN.com@coursetable.com@gi' /etc/nginx/sites-available/phpmyadmin
