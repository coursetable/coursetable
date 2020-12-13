#!/bin/bash

set -euo pipefail

VERSION=`sentry-cli releases propose-version`
export SENTRY_ORG=coursetable
export SENTRY_PROJECT=coursetable

export COMPOSE_FILE=prod-compose.yml
export SENTRY_RELEASE_VERSION=${VERSION}

sentry-cli releases new "$VERSION"
sentry-cli releases set-commits "$VERSION" --auto

docker-compose build
sentry-cli releases finalize "$VERSION"

docker-compose up -d
sentry-cli releases deploys "$VERSION" new -e production
