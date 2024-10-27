#!/bin/bash

set -euo pipefail

trap ctrl_c INT

function ctrl_c() {
  doppler run --command "docker compose -f compose/docker-compose.yml -f compose/dev-compose.yml -p api kill"
}

ENV=""
OVERWRITE=false
FERRY_SEED=false

for ARGS in "$@"; do
shift
    case "$ARGS" in
        "--dev") set -- "$@" "-d" ;;
        "--staging") set -- "$@" "-s" ;;
        "--prod") set -- "$@" "-p" ;;
        "--overwrite") set -- "$@" "-o" ;;
        "--ferry_seed") set -- "$@" "-f" ;;
        *) set -- "$@" "$ARGS"
    esac
done

while getopts 'dspof' flag; do
    case "${flag}" in
        d) ENV="dev" ;;
        s) ENV="staging" ;;
        p) ENV="prod" ;;
        o) OVERWRITE=true ;;
        f) FERRY_SEED=true ;;
    esac
done

if [[ $ENV == "" ]]
then
    echo "Please use either '--dev', '--prod', or '--staging', assuming '--dev' for this run."
    ENV="dev"
fi

if [[ $ENV == 'dev' ]]
then
    export HOT_RELOAD='true'
    export SENTRY_ENVIRONMENT=development
    doppler setup -p coursetable -c dev
    if [[ $OVERWRITE == true ]]
    then
        export OVERWRITE_CATALOG='true'
    fi
    if [[ $FERRY_SEED == true ]]
    then
        doppler run --command 'curl "$FERRY_DUMP_URL" -o ./postgres/init/a.sql'
        export OVERWRITE_CATALOG='true'
    fi

    doppler run --command "docker compose -f compose/docker-compose.yml -f compose/dev-compose.yml -p api up --remove-orphans -d --build --pull always"

    doppler run --command "docker compose -f compose/docker-compose.yml -f compose/dev-compose.yml -p api logs -f"
    
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

    if [[ $OVERWRITE == true ]]
    then
        export FORCE_RECREATE="--force-recreate"
    else
        export FORCE_RECREATE=""
    fi

    doppler setup -p coursetable -c $CFG_ENV

    VERSION=`sentry-cli releases propose-version`
    export SENTRY_ORG=coursetable
    export SENTRY_PROJECT=api

    export SENTRY_RELEASE_VERSION=${VERSION}

    sentry-cli releases new "$VERSION"
    sentry-cli releases set-commits "$VERSION" --auto

    doppler run --command "docker compose -f compose/docker-compose.yml -f compose/prod-base-compose.yml $ADDITIONAL_DOCKER_COMPOSE_FILE -p $DOCKER_PROJECT_NAME up -d --build --pull always $FORCE_RECREATE"
    
    sentry-cli releases finalize "$VERSION"
    sentry-cli releases deploys "$VERSION" new -e $SENTRY_ENVIRONMENT
fi
