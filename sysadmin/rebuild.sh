#!/bin/sh
# This should be run when we have the database installed, with data loaded.
# This will refetch the latest repositories and build them
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd /home/web/app
git fetch && git reset --hard origin/master
cd /home/web/app/crawler
git fetch && git reset --hard origin/master
bash "$DIR/components/build-app.sh"

crontab "$DIR/root.crontab"
