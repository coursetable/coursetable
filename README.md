# Coursetable

[![Maintainability](https://api.codeclimate.com/v1/badges/95184f4df3900fd39f04/maintainability)](https://codeclimate.com/github/coursetable/coursetable/maintainability)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/coursetable/coursetable?style=flat-square)](https://github.com/coursetable/coursetable/pulls)
[![GitHub contributors](https://img.shields.io/github/contributors/coursetable/coursetable?style=flat-square)](https://github.com/coursetable/coursetable/graphs/contributors)
[![HitCount](http://hits.dwyl.com/coursetable/coursetable.svg)](http://hits.dwyl.com/coursetable/coursetable)

[![Production CD](https://github.com/coursetable/coursetable/actions/workflows/cd.yml/badge.svg?branch=master)](https://github.com/coursetable/coursetable/actions/workflows/cd.yml)
[![Staging CD](https://github.com/coursetable/coursetable/actions/workflows/staging_cd.yml/badge.svg?branch=master)](https://github.com/coursetable/coursetable/actions/workflows/staging_cd.yml)
[![Ferry Run](https://github.com/coursetable/ferry/actions/workflows/ferry.yml/badge.svg)](https://github.com/coursetable/ferry/actions/workflows/ferry.yml)

Coursetable is made of two big parts:

1.  **Website**: The site you see when you go to [coursetable.com](https://coursetable.com). The code for this – the front-end site as well as the back-end server that handle user actions – is contained within this repository.
2.  **Crawler**: The scripts behind the scenes that actually get all the data from Yale’s websites. The code for this is in our [ferry](https://github.com/coursetable/ferry) repository.

## Repository Layout

The various functions of the website are compartmentalized as follows:

- [`/api`](https://github.com/coursetable/coursetable/blob/master/docs/api.md): Source code for API server with Docker Compose configuration for backend logic.
- `/frontend`: The current face of the site, built with React.

## How to develop

Check out [our contributing guide](CONTRIBUTING.md).

## How to deploy

Deployments are automatically handled via GitHub Actions workflows (see [`docs/ci-cd.md`](docs/ci-cd.md)).

For manual deployments and boostrapping a new server, see [`docs/how-to-deploy.md`](docs/how-to-deploy.md).

[![powered-by-vercel](/frontend/src/images/powered-by-vercel.svg)](https://vercel.com/?utm_source=coursetable&utm_campaign=oss)
