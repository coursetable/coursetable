#/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create databases and grants permissions to the coursetable user
MYSQL_PASSWORD="$1"

if [ -z "$MYSQL_PASSWORD" ]; then
  echo 'Please enter the MySQL coursetable user password'
  read -e MYSQL_PASSWORD

  if [ -z "$MYSQL_PASSWORD" ]; then
    echo 'No password entered; exiting'
    exit
  fi
fi

mysql -e "CREATE USER 'coursetable'@'%' IDENTIFIED BY '$MYSQL_PASSWORD'"
mysql -e "CREATE DATABASE yale_advanced_oci CHARACTER SET utf8 COLLATE utf8_general_ci"
mysql -e "CREATE DATABASE yaleplus CHARACTER SET utf8 COLLATE utf8_general_ci"
mysql -e "GRANT ALL PRIVILEGES ON yale_advanced_oci.* TO 'coursetable'@'%'"
mysql -e "GRANT ALL PRIVILEGES ON yaleplus.* TO 'coursetable'@'%'"
