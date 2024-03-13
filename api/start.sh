#!/bin/bash

set -euo pipefail

trap ctrl_c INT

function ctrl_c() {
  doppler run --command "docker compose -f compose/docker-compose.yml -f compose/dev-compose.yml -p api kill"
}

ENV=""
OVERWRITE=false

for ARGS in "$@"; do
shift
    case "$ARGS" in
        "--dev") set -- "$@" "-d" ;;
        "--staging") set -- "$@" "-s" ;;
        "--prod") set -- "$@" "-p" ;;
        "--overwrite") set -- "$@" "-o" ;;
        *) set -- "$@" "$ARGS"
    esac
done

while getopts 'dspo' flag; do
    case "${flag}" in
        d) ENV="dev" ;;
        s) ENV="staging" ;;
        p) ENV="prod" ;;
        o) OVERWRITE=true ;;
    esac
done

if [[ $ENV == "" ]]
then
    echo "Please use either '--dev', '--prod', or '--staging', assuming '--dev' for this run."
    ENV="dev"
fi

if [[ $ENV == 'dev' ]]
then
    if [[ $OVERWRITE == true ]]
    then
        export OVERWRITE_CATALOG='true'
    fi
    export HOT_RELOAD='true'
    doppler setup -p coursetable -c dev

    doppler run --command "docker-compose -f compose/docker-compose.yml -f compose/dev-compose.yml -p api up --remove-orphans --build -d"
    doppler run --command "docker-compose -f compose/docker-compose.yml -f compose/dev-compose.yml -p api logs -f"

    # build debug
    # doppler run --command "docker-compose -f docker-compose.yml -f dev-compose.yml build --no-cache &> logs.txt"
    
elif [[ $ENV == 'prod' || $ENV == 'staging' ]]
then
    if [[ $ENV == 'staging' ]]
    then
        export CFG_ENV=prod_staging
        export SENTRY_ENVIRONMENT=staging
        export DOCKER_PROJECT_NAME=api-staging
        export ADDITIONAL_DOCKER_COMPOSE_FILE="-f compose/staging-compose.yml"
    else
        export CFG_ENV=prod
        export SENTRY_ENVIRONMENT=production
        export DOCKER_PROJECT_NAME=api
        export ADDITIONAL_DOCKER_COMPOSE_FILE="-f compose/prod-compose.yml"
    fi

    doppler setup -p coursetable -c $CFG_ENV

    VERSION=`sentry-cli releases propose-version`
    export SENTRY_ORG=coursetable
    export SENTRY_PROJECT=api

    export SENTRY_RELEASE_VERSION=${VERSION}

    sentry-cli releases new "$VERSION"
    sentry-cli releases set-commits "$VERSION" --auto

    doppler run --command "docker-compose -f compose/docker-compose.yml -f compose/prod-base-compose.yml $ADDITIONAL_DOCKER_COMPOSE_FILE -p $DOCKER_PROJECT_NAME build"
    sentry-cli releases finalize "$VERSION"

    doppler run --command "docker-compose -f compose/docker-compose.yml -f compose/prod-base-compose.yml $ADDITIONAL_DOCKER_COMPOSE_FILE -p $DOCKER_PROJECT_NAME up -d"
    sentry-cli releases deploys "$VERSION" new -e $SENTRY_ENVIRONMENT
fi
