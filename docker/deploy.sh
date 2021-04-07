#!/bin/bash

set -euo pipefail

doppler setup -p coursetable -c prd

VERSION=`sentry-cli releases propose-version`
export SENTRY_ORG=coursetable
export SENTRY_PROJECT=frontend

export COMPOSE_FILE=prod-compose.yml
export SENTRY_RELEASE_VERSION=${VERSION}

sentry-cli releases new "$VERSION"
sentry-cli releases set-commits "$VERSION" --auto

doppler run --command "docker-compose build"
sentry-cli releases finalize "$VERSION"

doppler run --command "docker-compose up -d --build"
sentry-cli releases deploys "$VERSION" new -e production
