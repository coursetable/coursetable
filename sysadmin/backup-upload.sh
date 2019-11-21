#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

CURRENT_DATE=$(date +"%Y-%m-%d")
BACKUP_FILE="backups-$CURRENT_DATE.tar.gz"
BACKUP_PATH="/tmp/$BACKUP_FILE"

# Create and upload the backup
bash "$DIR/backup.sh" "$BACKUP_PATH"
s3cmd put "$BACKUP_PATH" "s3://coursetable-backup/$BACKUP_FILE"
rm -f "$BACKUP_PATH"

# Deleting all backups from 6 months or longer ago, except the ones from the
# first of the month
SIX_MONTHS_STR=$(date +"%Y-%m" --date='-6 months')
s3cmd ls s3://coursetable-backup | awk '{ print $4 }' \
  | grep "backups-$SIX_MONTHS_STR" \
  | grep -v "backups-$SIX_MONTHS_STR-01" \
  | xargs --no-run-if-empty s3cmd del
