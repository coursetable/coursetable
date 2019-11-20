#!/bin/sh

MYSQL_ROOT_PASSWORD="$1"
if [ -z "$MYSQL_ROOT_PASSWORD" ]; then
  echo 'Please enter a password for the MySQL root user'
  read -e MYSQL_ROOT_PASSWORD
fi

# Install MariaDB
sudo apt-get install -y software-properties-common
sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
sudo add-apt-repository 'deb [arch=amd64,arm64,ppc64el] http://nyc2.mirrors.digitalocean.com/mariadb/repo/10.4/ubuntu bionic main'
apt-get update
debconf-set-selections <<< "mariadb-server mysql-server/root_password password $MYSQL_ROOT_PASSWORD"
debconf-set-selections <<< "mariadb-server mysql-server/root_password_again password $MYSQL_ROOT_PASSWORD"

cat > /root/.my.cnf <<END
[client]
user = root
password = $MYSQL_ROOT_PASSWORD
END
chmod 600 /root/.my.cnf

apt-get install mariadb-server mariadb-client -y
