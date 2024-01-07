# Coursetable

[![Maintainability](https://api.codeclimate.com/v1/badges/95184f4df3900fd39f04/maintainability)](https://codeclimate.com/github/coursetable/coursetable/maintainability)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/coursetable/coursetable?style=flat-square)](https://github.com/coursetable/coursetable/pulls)
[![GitHub contributors](https://img.shields.io/github/contributors/coursetable/coursetable?style=flat-square)](https://github.com/coursetable/coursetable/graphs/contributors)
[![HitCount](http://hits.dwyl.com/coursetable/coursetable.svg)](http://hits.dwyl.com/coursetable/coursetable)
![healthchecks](https://healthchecks.io/badge/abfa6868-dc8b-41b8-a225-877c73/2kvk7-26-2.svg)

[![Production CD](https://github.com/coursetable/coursetable/actions/workflows/cd.yml/badge.svg?branch=master)](https://github.com/coursetable/coursetable/actions/workflows/cd.yml)
[![Staging CD](https://github.com/coursetable/coursetable/actions/workflows/staging_cd.yml/badge.svg?branch=master)](https://github.com/coursetable/coursetable/actions/workflows/staging_cd.yml)


Coursetable is made of two big parts:

1.  **Website**: The site you see when you go to [coursetable.com](https://coursetable.com). The code for this – the front-end site as well as the various back-end scripts that handle user actions – is contained within this repository.
2.  **Crawler**: The scripts behind the scenes that actually get all the data from Yale’s websites. The code for this is in our [ferry](https://github.com/coursetable/ferry) repository.

## Repository Layout

The various functions of the website are compartmentalized as follows:

- [`/api`](https://github.com/coursetable/coursetable/blob/master/docs/api.md): Source code for Express server with Docker Compose configuration for backend logic.
- `/frontend`: The current face of the site, built with React.
- `/sysadmin`: Administration scripts and bootstrapping tools.

## How to develop

Check out [the getting started guide](docs/getting-started.md).

## Contributing

**Contributing code:**

1. Create a branch for your feature. This can usually be done with `git checkout -b <username>/<feature_name>`
2. _make changes._
3. Create some commits and push your changes to the origin.
4. Create a pull request and add a few reviewers. In the pull request, be sure to reference any relevant issue numbers.
5. Once the pull request has been approved, merge it into the master branch.

**Style:**

TypeScript & JavaScript: We use [prettier](https://prettier.io/) to automatically format the code. Make sure you use your editor's integration!

We have automated checks set up that will run for every commit and pull request.

**Roadmap:**

We use GitHub issues to track bugs and feature requests: https://github.com/coursetable/coursetable/issues.

We use GitHub pull requests for active feature development: https://github.com/coursetable/coursetable/pulls.

## Setting up and deploying to prod

Check out [How to deploy](docs/how-to-deploy.md).

[![powered-by-vercel](/frontend/src/images/powered-by-vercel.svg)](https://vercel.com/?utm_source=coursetable&utm_campaign=oss)
