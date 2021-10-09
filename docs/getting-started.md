# Getting Started with CourseTable

Thanks for taking the initiative to get started with CourseTable! Here are a few reasons why you made the right choice:

- It was super satisfying to build something that our friends on campus could use
- We also found a ton of courses that we loved, and taking good classes definitely made Yale a better experience

We hope you’ll enjoy building something your friends can use as well!

## Initial Development Environment Setup

<details>
  <summary><strong>Initial setup for Windows only</strong></summary>

Cause Windows is a special little baby, there's some things we got to do to get this working correctly.

1. Install [Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/get-started)

1. Install [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) (Ubuntu 20.04 LTS)

   Follow Steps 1 - 6 at the link above.

   For Step 6, download [Ubuntu 20.04 LTS](https://www.microsoft.com/en-us/p/ubuntu-2004-lts/9n6svws3rx71?rtc=1).

</details>

---

**For Everyone**

1. Install [Visual Studio Code](https://code.visualstudio.com/Download)

   > **For Windows**: When installing, make sure `Add to PATH (requires shell restart)` option is checked. You can make sure that it was added by going to Control Panel -> System and Security -> System -> Advanced System Settings -> Environment Variables... -> Under your user variables double-click `Path`. Here you should see an entry that looks like `C:\Users\<your-user-name-here>\AppData\Local\Programs\Microsoft VS Code\bin`. If you don't, click `New` and add it here.

   Once installed, open VSCode and install the following extensions:

   - [Remote - WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) (only needed for Windows)
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

   > **For Windows**: In the Extensions tab in VSCode, you should see a `LOCAL - INSTALLED` section and a `WSL: UBUNTU-20.04 - INSTALLED` section. VSCode separates the extensions you've installed locally on your Windows system and remotely on your WSL Ubuntu system. When installing new extensions, make sure to click `Install in WSL: Ubuntu-20.04`.

2. Join our GitHub organization and clone the repository

   Make sure that you're added to the [CourseTable GitHub organization](https://github.com/coursetable).

   Clone the [coursetable/coursetable repository](https://github.com/coursetable/coursetable) by running `git clone https://github.com/coursetable/coursetable.git`.

   > **For Windows**: Make sure to clone the repository in your Linux filesystem in Ubuntu using Windows Terminal (NOT your Windows filesystem). This will allow React hot reloading to work.
   > After cloning, cd to the repository. Open the repository in VSCode by running the command `code .`. This should open it using WSL, and you should see a green bar on the bottom left of your VSCode editor that says `WSL: Ubuntu-20.04`. Also, make sure that the bar in the bottom right says `LF` and not `CRLF`.

3. Install Doppler (and make sure you've been added to the organization there – if not, contact one of the project leads): see https://docs.doppler.com/docs/enclave-installation. We use Doppler to manage our secrets such as API keys.

4. Install Docker

   - Mac or Windows: Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

     > **For Windows**: Make sure `Enable WSL 2 Windows Features` is checked during installation.

   - Linux: Install [Docker CE](https://docs.docker.com/engine/install/)
     and [Docker Compose](https://docs.docker.com/compose/install/)
     
5. Install Node: see [here](https://nodejs.org/en/download/) for downloadable installer.

## Aside: a quick explainer on docker-compose

`docker-compose` is a tool we use to orchestrate a bunch of different things, all running in parallel. It also enables us to avoid most cross-platform compatibility issues.

Our setup is declared in the [docker-compose.yml](../docker/docker-compose.yml) file.

Some useful commands:

- `docker-compose up` starts all the services
- `docker-compose up -d` starts everything in the background
- `docker-compose ps` tells you what services are running
- `docker-compose stop` stops everything
- `docker-compose down` stops and removes everything
- `docker-compose restart` restarts everything
- `docker-compose logs -f` gets and "follows" (via `-f`) the logs from all the services. It's totally safe to control-C on this command - it won't stop anything
- `docker-compose logs -f <service>` gets the logs for a specific service. For example, `docker-compose logs -f api` gets the logs for the backend API.
- `docker-compose build` builds all the services. This probably won't be necessary for our development environment, since we're building everything on the fly

## Running CourseTable

Note: if you run into issues, check the troubleshooting section at the bottom.

1. `cd` to the cloned coursetable root directory

   > **For Windows**: Make sure you are in Ubuntu in Windows Terminal

2. Initialize Doppler.

   ```bash
   # log in
   # 	- select "Scope login to current directory if you're using Doppler elsewhere"
   #  - select the 'dev' config
   doppler login
   ```

3. Start the backend:

   ```sh
   cd docker
   ./start.sh
   ```

4. Wait ~2-3 minutes. If you’re curious, here's what's going on:

   - Installing Node.js module dependencies
   - Setting up the database schema
   - Generating some JSON data files

5. Start again:

   Not everything comes up the first time because of our inter-service dependencies. Run these commands. You might need to do this a couple times.

   ```sh
   # kill the docker-compose logs -f command from above using Cmd (Ctrl) + C
   
   # first, enter an environment with Doppler secrets injected so docker is happy
   doppler run --command "/bin/sh"
   
   docker-compose up
   docker-compose logs -f
   
   # exit the Doppler environment
   exit
   ```

6. Start the frontend (first `cd` to `frontend`)

   ```sh
   ./start.sh
   ```

7. Navigate to https://localhost:3000.

   You should have a working CourseTable site! You'll have to click ignore on a “self-signed certificate” error in your browser (we include this just to HTTPS works, which we need to test Facebook locally)

8. Make some changes!

   Most changes you make (i.e. to the API server or frontend) will automatically get picked up - all you'll need to do is save the changed file(s) and reload the page.

## Troubleshooting

- `Windows: “Hardware assisted virtualization and data execution protection must be enabled in the BIOS”`

  Just follow the docs from Docker. You'll need to modify your BIOS settings.

- `Chrome: privacy error`

  Go to [chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost) and enable the setting.

  For more details, see https://stackoverflow.com/questions/35531347/localhost-blocked-on-chrome-with-privacy-error.

## Installing packages

<details>
  <summary><strong>Windows or Linux</strong></summary>

To be honest, I haven't tried this on Linux but it should technically be the same as WSL right? If you're having problems, let us know.

1. Install [nvm, node.js, and npm](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-wsl2#install-nvm-nodejs-and-npm)

   Follow Steps 1 - 9 at the link above.

   > For Windows: If you get an error that looks like this `bash: /mnt/c/Program Files/nodejs/npm: /bin/sh^M: bad interpreter: No such file or directory`, then try following the instructions [here](https://hackmd.io/@badging/wsl2#Troubleshooting-PATH).

1. Run `npm install --global yarn`

1. Make sure you're in the correct subdirectory (e.g. `/frontend`)

1. Install your package by running `yarn add <package>`

</details>

<details>
  <summary><strong>MacOS</strong></summary>

1. Run `brew install yarn` (Why's it so easy for Mac users this isn't fair.)

1. Make sure you're in the correct subdirectory (e.g. `/frontend`)

1. Install your package by running `yarn add <package>`

</details>

## [stale] CourseTable Development Guide

Our old development instructions can be found [here](https://docs.google.com/document/d/1M0Gp8Qtaik8roGYYknDDEzAAOwP3YBj0mX1pvCy-uOI/edit?usp=sharing).

The document includes instructions on how to:

1.  Set up the dev environment
2.  Learn about the code
3.  Make your first changes
