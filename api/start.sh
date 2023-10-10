#!/bin/bash

set -euo pipefail

if [ -n "${1-}" ]
then
    if [ "$1" == 'dev' ]
    then
        doppler setup -p coursetable -c dev
        doppler run --command "docker-compose -f docker-compose.yml -f dev-compose.yml up --remove-orphans --build"
    elif [ "$1" == 'prod' ]
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
else
    echo "Please use either 'dev' or 'prod', assuming 'dev' for this run."
    doppler setup -p coursetable -c dev
    doppler run --command "docker-compose -f docker-compose.yml -f dev-compose.yml up --remove-orphans --build"
fi
