#!/bin/sh
mysqldump yale_advanced_oci > yale_advanced_oci.sql
mysqldump yaleplus --ignore-table=yaleplus.BluebookEvents > yaleplus1.sql
mysqldump yaleplus BluebookEvents --no-data > yaleplus2.sql

ALL_FILES="yale_advanced_oci.sql yaleplus1.sql yaleplus2.sql"

# ALL_FILES is intentionally not put in double quotes because we want the 3
# files to be 3 arguments, not 1 argument
tar -czf backups.tar.gz $ALL_FILES
rm -f $ALL_FILES
