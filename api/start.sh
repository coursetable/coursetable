#!/bin/bash

set -euo pipefail

ENV=""
OVERWRITE=false

for ARGS in "$@"; do
shift
    case "$ARGS" in
        "--dev") set -- "$@" "-d" ;;
        "--prod") set -- "$@" "-p" ;;
        "--overwrite") set -- "$@" "-o" ;;
        *) set -- "$@" "$ARGS"
    esac
done

while getopts 'dpo' flag; do
    case "${flag}" in
        d) ENV="dev" ;;
        p) ENV="prod" ;;
        o) OVERWRITE=true ;;
    esac
done

if [ $ENV == "" ]
then
    echo "Please use either '--dev' or '--prod', assuming '--dev' for this run."
    ENV="dev"
fi

if [ $ENV == 'dev' ]
then
    if [ $OVERWRITE == true ] 
    then
        export OVERWRITE_CATALOG='true'
    fi
    doppler setup -p coursetable -c dev
    doppler run --command "docker-compose -f docker-compose.yml -f dev-compose.yml up --remove-orphans --build"
elif [ $ENV == 'prod' ]
then
    doppler setup -p coursetable -c prd

    VERSION=`sentry-cli releases propose-version`
    export SENTRY_ORG=coursetable
    export SENTRY_PROJECT=frontend

    export SENTRY_RELEASE_VERSION=${VERSION}

    sentry-cli releases new "$VERSION"
    sentry-cli releases set-commits "$VERSION" --auto

    doppler run --command "docker-compose -f docker-compose.yml -f prod-compose.yml build"
    sentry-cli releases finalize "$VERSION"

    doppler run --command "docker-compose -f docker-compose.yml -f prod-compose.yml up -d"
    sentry-cli releases deploys "$VERSION" new -e production
fi
