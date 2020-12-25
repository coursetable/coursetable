# (Mostly for Harshal) Bootstrapping a new server

### Server Setup

```sh
# Give admins access to the server. Modify this as necessary.
ssh-import-id-gh hsheth2
ssh-import-id-gh kevinhu

# Create SSH key.
ssh-keygen -t ed25519 -C "github-bot@harshal.sheth.io"
cat ~/.ssh/id_ed25519.pub
read -p "Add this key to the hsheth2-bot GitHub account. Press [enter] when done..."
```

### Dependencies

```sh
# Install docker.
pushd /tmp
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
popd

# Install docker-compose.
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install deps for ferry.
TODO see ferry repo

# Sentry CLI.
curl -sL https://sentry.io/get-cli/ | bash
```

### Setup

Note that many of these commands will fail. You'll need to create a number
of `.env` files to make it all work.

```sh
# Fetch everything.
git clone git@github.com:coursetable/coursetable.git
git clone --recurse-submodules git@github.com:coursetable/ferry.git
git clone git@github.com:coursetable/infra.git

# Setup infra.
pushd infra
(cd traefik && docker-compose up -d)
(cd under-maintenance && docker-compose up -d)
(cd old_proxy && docker-compose up -d)
(cd mysql && docker-compose up -d)
(cd analytics && docker-compose up -d)
(cd posthog && docker-compose up -d)
popd

# Setup ferry.
pushd ferry
docker-compose up -d
./refresh_courses.sh
read -p "Add ./cron_script.sh to crontab. Press [enter] when done..."
popd

# Setup coursetable.
cd coursetable/docker
./deploy.sh
TODO migrate database over
```

# Deploying to the server

**coursetable**

```sh
# Run these on the prod server.
cd ~/coursetable/docker
git pull # Get changes onto server
./deploy.sh # Deploy the new version
```

**ferry**

```sh
# Run these on the prod server.
cd ~/ferry
git pull # Get changes onto server
./refresh_courses.sh # Rerun the pipeline
```
