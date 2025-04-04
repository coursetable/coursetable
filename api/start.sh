#!/bin/bash

set -euo pipefail

trap ctrl_c INT

function ctrl_c() {
  doppler run --command "docker compose -f compose/docker-compose.yml -f compose/dev-compose.yml -p api kill"
}

ENV=""
OVERWRITE=false
FERRY_SEED=false
OFFLINE=false 

for ARGS in "$@"; do
  shift
  case "$ARGS" in
      "--dev") set -- "$@" "-d" ;;
      "--staging") set -- "$@" "-s" ;;
      "--prod") set -- "$@" "-p" ;;
      "--overwrite") set -- "$@" "-o" ;;
      "--ferry_seed") set -- "$@" "-f" ;;
      "--offline") set -- "$@" "-x" ;;
      *) set -- "$@" "$ARGS"
  esac
done

while getopts 'dspofx' flag; do
  case "${flag}" in
    d) ENV="dev" ;;
    s) ENV="staging" ;;
    p) ENV="prod" ;;
    o) OVERWRITE=true ;;
    f) FERRY_SEED=true ;;
    x) OFFLINE=true ;;
  esac
done

if [[ $ENV == "" ]]
then
    echo "Please use either '--dev', '--prod', or '--staging', assuming '--dev' for this run."
    ENV="dev"
fi

if [[ $ENV == 'dev' ]]
then
    export SENTRY_ENVIRONMENT=development
    doppler setup -p coursetable -c dev
    if [[ $OVERWRITE == true ]]
    then
        export OVERWRITE_CATALOG='true'
    fi
    if [[ $FERRY_SEED == true ]]
    then
        doppler run --command 'curl "$FERRY_DUMP_URL" -o ./postgres/init/02-ferry-dump.sql'
        export OVERWRITE_CATALOG='true'
        rm -rf postgres/data/
    fi

    # Set PULL_ALWAYS based on OFFLINE flag
    if [[ $OFFLINE == true ]]; then
      echo "Offline mode: skipping Docker pull from registry"
      PULL_ALWAYS=""
    else
      PULL_ALWAYS="--pull always"
    fi

    doppler run --command "docker compose -f compose/docker-compose.yml -f compose/dev-compose.yml -p api up --remove-orphans -d --build $PULL_ALWAYS"

    if [[ $FERRY_SEED == true ]]
    then
        docker exec -it express /bin/bash -c "cd api && npm run db:push"
    fi

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


    # Set PULL_ALWAYS based on OFFLINE flag
    if [[ $OFFLINE == true ]]; then
      echo "Offline mode: skipping Docker pull from registry"
      PULL_ALWAYS=""
    else
      PULL_ALWAYS="--pull always"
    fi
    doppler setup -p coursetable -c $CFG_ENV

    VERSION=`sentry-cli releases propose-version`
    export SENTRY_ORG=coursetable
    export SENTRY_PROJECT=api

    export SENTRY_RELEASE_VERSION=${VERSION}

    if [[ $OFFLINE == false ]]; then
      sentry-cli releases new "$VERSION"
      sentry-cli releases set-commits "$VERSION" --auto
    else
      echo "Offline mode: skipping Sentry release creation"
    fi

    

    doppler run --command \
      "docker compose -f compose/docker-compose.yml -f compose/prod-base-compose.yml $ADDITIONAL_DOCKER_COMPOSE_FILE -p $DOCKER_PROJECT_NAME up -d --build $PULL_ALWAYS $FORCE_RECREATE"

    if [[ $OFFLINE == false ]]; then
      sentry-cli releases finalize "$VERSION"
      sentry-cli releases deploys "$VERSION" new -e $SENTRY_ENVIRONMENT
    else
      echo "Offline mode: skipping Sentry finalize/deploy steps"
    fi
fi
