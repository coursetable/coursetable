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

### Releases that change the database schema

Staging CD and Production CD pause both the API and frontend deployments when
`api/drizzle/schema.ts` changes. This prevents a new frontend from reaching an
API that does not support its requests. Shared code and root dependency changes
trigger both builds, and the frontend waits for a successful API deployment and
health check whenever the API is being deployed.

For the personal-block feature, the schema change adds the non-null JSONB
`worksheets.personalBlocks` column with an empty-array default. Existing
worksheets and courses are preserved; saved searches are unchanged. The
equivalent SQL is in `api/drizzle/personal-blocks.sql`. CI tests that SQL against
existing data and runs it twice to check that it is safe to repeat.

Use the following rollout order, selecting the same Git revision throughout:

1. Run the **DB Migration** workflow with **Staging** selected. Review any
   proposed schema changes before proceeding. This workflow runs Drizzle's
   schema push; SQL files are not applied automatically.
2. Manually run **Staging CD**, selecting the API and frontend and checking
   **Database migration has been applied for this revision**. The API must
   deploy and pass its health check before the frontend can deploy.
3. Verify existing worksheets and course bookmarks, then create, edit, and
   delete personal commitments. Reload the page to confirm persistence, check
   conflict warnings, and confirm friends' worksheets do not expose personal
   commitments.
4. After staging verification and maintainer approval, run **DB Migration**
   with **Production** selected, then manually run **Production CD** with the
   same selections and migration confirmation.
5. Repeat the worksheet and commitment smoke checks on production.

Only confirm the migration after it succeeds in the selected environment for
the revision being deployed. The confirmation does not perform the migration.
Frontend-only PR previews use the existing staging API; commitment saves cannot
be tested there until staging has the corresponding database and API changes.

If a frontend rollback is needed, retain the updated API and database column so
existing commitments remain protected. The pre-feature API can delete a main
worksheet when its last course is removed, even if it contains commitments.

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
