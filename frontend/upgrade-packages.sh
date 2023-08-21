#!/bin/bash

# get a list of all packages from package.json
packages=$(jq -r '.dependencies | keys | .[]' package.json)

# iterate over each package
for package in $packages
do
  echo "Upgrading $package"
  
  # upgrade the package
  yarn upgrade $package
  
  # run start script, but stop it after 7 seconds, save the output to a log file
  timeout 7s ./start.sh > log.txt 2>&1

  # check if the log file contains "Vite Error"
  if grep -q "Error" log.txt; then
    echo "Error encountered with package $package"
    exit 1
  fi
done