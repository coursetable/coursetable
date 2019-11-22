# Paste the contents of this file into your shell to create the preinstall.sh
# Then, run it via `bash preinstall.sh`

cat > preinstall.sh <<'EOS'
#!/bin/sh
apt-get update

#
# This script creates the account for web and pulls
# the code to bootstrap installation of everything else
#

if [ ! -f ~/.ssh/id_rsa ]; then
  ssh-keygen -t rsa -N '' -f ~/.ssh/id_rsa
fi

# Randomly generate a password for the web account, since
# we only use `su` to access the account
# https://unix.stackexchange.com/questions/230673/how-to-generate-a-random-string
NODE_WEB_PASS=$(</dev/urandom tr -dc 'A-Za-z0-9!"#$%&'\''()*+,-./:;<=>?@[\]^_`{|}~' | head -c 32 ; echo)

useradd --home /home/web --shell /bin/bash --create-home web
echo "web:$NODE_WEB_PASS" | chpasswd

cd /home/web
git clone https://github.com/coursetable/coursetable.git app
cd /home/web/app

EOS
