#!/bin/bash
# Gets certificates for a included domain
#
# Usually, you want to run this with only one domain at a time. Otherwise it'll
# write the certificates for all domains into one file
#
# Assumes that we've already set up a stub port 80 server for it
#
# One of ../nginx/initial and ../nginx/initial-single need to be enabled for
# this to work
apt install -y certbot

LETSENCRYPT_DOMAINS="$@"
if [ -z "$LETSENCRYPT_DOMAINS" ]; then
  echo 'Please enter domain(s) (separated by spaces) to get certificates for:'
  read -e LETSENCRYPT_DOMAINS
fi

DOMAIN_FLAGS=()
# We don't use quotes around LETSENCRYPT_DOMAINS to split them up
for DOMAIN in $LETSENCRYPT_DOMAINS; do
  DOMAIN_FLAGS+=('-d')
  DOMAIN_FLAGS+=("$DOMAIN")
done

certbot --non-interactive certonly --authenticator webroot --webroot-path /home/web/nginx --email 'peter@myrtlelime.com' --agree-tos ${DOMAIN_FLAGS[*]}

# Add letsencrypt renew to crontab if it's not there
if ! `crontab -l 2> /dev/null | grep -q letsencrypt`; then
  (crontab -l 2>/dev/null; echo "23 3 * * * letsencrypt renew && systemctl reload nginx")| crontab -
fi
