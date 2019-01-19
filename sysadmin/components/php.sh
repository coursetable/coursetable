#!/bin/sh
# Install all the PHP libraries we need
apt-get install -y php-mbstring php-mcrypt php-mysql php-sqlite3 \
  php-json php-xml php-curl composer unzip php-fpm php-bcmath
