# Bootstrapping a new server

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
(cd mysql && docker-compose up -d)
(cd analytics && docker-compose up -d)
(cd posthog && docker-compose up -d)
popd

# Setup ferry.
pushd ferry
docker-compose up -d
./refresh_courses.sh
popd

# Setup coursetable.
cd coursetable/docker
./deploy.sh
TODO migrate database over

# Setup cron.
echo This should be the contents of the crontab:
cat <<EOF
44 7 * * * bash -l -c "cd $HOME/ferry && ./cron_script.sh" 2>&1
23 7 * * * bash -l -c "source $HOME/.profile && cd $HOME/infra/mysql && ./cron_script.sh" 2>&1
EOF
read -p "Add those to crontab. Press [enter] when done..."
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

**beta**

```sh
cd ~/beta
git pull
cd docker
docker-compose -f beta-frontend.yml up -d --build
```

