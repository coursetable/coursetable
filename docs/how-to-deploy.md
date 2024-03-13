# How to deploy

## Bootstrapping a new server

### Dependencies

- Install [`docker`](https://docs.docker.com/engine/install/ubuntu/)

- Install [`docker-compose`](https://docs.docker.com/compose/install/#install-compose)

- Install [`sentry-cli`](https://docs.sentry.io/product/cli/installation/)

- Install [`doppler`](https://docs.doppler.com/docs/install-cli)

### Setup

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
23 7 * * * bash -l -c "source $HOME/.profile && cd $HOME/infra/mysql && ./cron_script.sh" 2>&1
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

## Deploying to the server

> [!IMPORTANT]
> On the current CourseTable server, `~` refers to `/home/app`. If you logged in using any other user, you'll need to change the paths below.

The following instructions are only for manual deployments. Only use this in the case that the [GitHub Actions CD workflow](https://github.com/coursetable/coursetable/actions/workflows/cd.yml) fails.

```sh
# Run these on the prod server.
cd ~/coursetable/api
git pull # Get changes onto server
./start.sh -p # Deploy the new version in prod
```
