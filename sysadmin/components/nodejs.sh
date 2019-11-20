#!/bin/sh
# Set up node
# Based on https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
apt-get install -y curl

curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
apt-get install -y nodejs git bc make g++ libssl-dev
# All the remainder are used for building certain native packages
# (e.g., node-sass, ursa)

# Set up PM2
npm -g install pm2 gulp
pm2 startup ubuntu -u web --hp /home/web
