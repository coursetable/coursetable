#!/bin/sh
# This should be run when we have the database installed
# and ported over
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
bash "$DIR/components/build-app.sh"

crontab "$DIR/root.crontab"
