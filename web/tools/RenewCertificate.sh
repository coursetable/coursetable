#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
letsencrypt certonly --keep-until-expiring --webroot --webroot-path "$DIR/.." -d coursetable.com -d www.coursetable.com
