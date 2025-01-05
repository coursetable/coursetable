# Deployment setup

All CI/CD pipelines are implemented as GitHub workflow actions in `.github/workflows`. Details regarding the deployed infrastructure is available at [coursetable/infra](https://github.com/coursetable/infra).

Available Environments:

- Preview
  - PR-specific frontend deployments that use the `Staging` backend environment.
  - URL: `[branch-name].preview.coursetable.com`
- Staging
  - `master` tracking frontend and Docker backend deployments.
    <!-- TODO: User DB is overwritten by production user data daily. -->
  - URL:
    - Frontend: [staging.coursetable.com](https://staging.coursetable.com)
    - Backend: [api-staging.coursetable.com](https://api.staging.coursetable.com/ping)
- Production
  - Asynchronously tracking deploys of `master` on approval from a team lead.
  - URL:
    - Frontend: [coursetable.com](https://coursetable.com)
    - Backend: [api.coursetable.com](https://api.coursetable.com/ping)

## [CI](../.github/workflows/ci.yml)

Runs formatting, linting, and dependency checks. Required as a check for merging PRs.

- Trigger: PR and `master` commit
- Environment: Preview, Staging, Production

## [Preview CD](../.github/workflows/preview_cd.yml)

Deploys **frontend only** to Cloudflare pages and assigns unique preview link to each commit and each PR. Required as a check for merging PRs.

- Trigger: PR commit
- Environment: Preview

## [Staging CD](../.github/workflows/staging_cd.yml)

Deploys both frontend to Cloudflare pages and backend to the staging API Docker Network. Builds latest Docker images and refreshes containers in-place. Allows for sanity-checking and robust testing of new commits before deploying to production.

- Trigger: `master` commit
- Environment: Staging

## [Production CD](../.github/workflows/cd.yml)

Deploys both frontend to Cloudflare pages and backend to production API Docker Network. Builds latest Docker images and refreshes containers in-place.

- Trigger: `master` commit with team lead approval
- Environment: Production

## Manual deployment

### Bootstrapping a new server

- Install [`docker`](https://docs.docker.com/engine/install/ubuntu/)
- Install [`docker-compose`](https://docs.docker.com/compose/install/#install-compose)
- Install [`sentry-cli`](https://docs.sentry.io/product/cli/installation/)
- Install [`doppler`](https://docs.doppler.com/docs/install-cli)

Ensure that `doppler` is properly configured with access to the environment configs. We assume that all following commands will be run with `root` unless otherwise specified.

```sh
# Fetch everything.
git clone git@github.com:coursetable/coursetable.git
git clone git@github.com:coursetable/infra.git

# Setup infra.
pushd infra
./deploy.sh
popd

# Setup coursetable.
cd coursetable/api
./start.sh -p

# Setup cron.
echo This should be the contents of the crontab:
cat <<EOF
23 7 * * * bash -l -c "source $HOME/.profile && cd $HOME/infra/db && ./cron_script.sh" 2>&1
EOF
read -p "Add to crontab. Press [enter] when done..."
```

### GitHub Actions Self-Hosted Runner

```sh
# Create new user that GitHub Actions assumes as an identity
useradd -m app
usermod -aG sudo app
passwd app

# Make sure to install the self-hosted runner application as the `app` user
su app
```

Setup the new server as a self-hosted runner for GitHub Actions by following the instructions provided when adding a new self-hosted runner. Be sure to [install the runner application as a service](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service) as well.

### Deploying to the server

> [!IMPORTANT]
> On the current CourseTable server, `~` refers to `/home/app`. **Always log in with `app` user**, because our automatic CD uses `app` to run `git pull`, so if another user changed the `.git` folder, the CD will fail.

The following instructions are only for manual deployments. Only use this in the case that the [GitHub Actions CD workflow](https://github.com/coursetable/coursetable/actions/workflows/cd.yml) fails, or if there are manual changes that need to be made (e.g. DB schema).

```sh
# Run these on the prod server. Make sure you log in as `app`.
cd ~/coursetable/api
git pull # Get changes onto server
./start.sh -p # Deploy the new version in prod
```

## Troubleshooting deployment

If the API server is not responding, check the logs, and go into the container to debug if necessary:

```sh
docker logs -f express-prod
docker exec -it express-prod bash
```

You can also restart it with `./start.sh -p`, or force-recreate the container with `./start.sh -p -o`.

In the case of prolonged downtime, you can put up the "under maintenance" page by manually triggering the "under maintenance" GitHub Action workflow.
