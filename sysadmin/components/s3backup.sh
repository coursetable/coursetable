#!/bin/sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

apt install -y s3cmd
cp -f "$DIR/../s3backup/.s3cfg" /root
