#!/bin/sh
apt-get install -y unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
sed -i 's@.*Unattended-Upgrade::Remove-Unused-Dependencies.*@Unattended-Upgrade::Remove-Unused-Dependencies "true";@i' /etc/apt/apt.conf.d/50unattended-upgrades
