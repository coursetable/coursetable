# Getting Started with CourseTable

Thanks for taking the initiative to get started with CourseTable!

- It was super satisfying to build something that our friends on campus could use
- We also found a ton of courses that we loved, and taking good classes definitely made Yale a better experience

We hope you’ll enjoy building something your friends can use as well!

## Development Environment Setup

**Docker**

- Mac or Windows: Install Docker Desktop from https://www.docker.com/products/docker-desktop.
  - On Windows: make sure you do not check the box “Use Windows containers…” during installation
  - Mac OS X should be similarly straightforward.
- Linux
  - Install Docker CE via https://docs.docker.com/engine/install/.
  - Install Docker Compose via https://docs.docker.com/compose/install/.

**Editor**

We recommend you use Visual Studio Code as your editor. WebStorm is pretty good as well and is free for students.

If you use VS Code, we recommend these plugins:

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

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

1. Clone the repository with `git clone git@github.com:coursetable/coursetable.git`.
2. Run `cd coursetable`.
3. Create the `facebook.env` file with the following contents. The app secret should be replaced by the actual value - reach out to us to get this. Alternatively, if you don't intend to test anything related to the Facebook integration, you can just leave that value empty.
   ```sh
   FACEBOOK_APP_ID=185745958145518
   FACEBOOK_APP_SECRET=<redacted>
   ```
4. Start coursetable:
   ```sh
   cd docker
   docker-compose up -d
   docker-compose logs -f
   ```
5. Wait ~10 minutes. If you’re curious, here's what's going on:
   - Installing Node.js module dependencies
   - Installing PHP (Composer) packages
   - Setting up the database schema
   - Generating some JSON data files
6. Not everything comes up the first time because of our inter-service dependencies. Run these commands. You might need to do this a couple times.
   ```sh
   # kill the docker-compose logs -f command from above.
   docker-compose up -d
   docker-compose logs -f
   ```
7. Navigate to https://localhost:8080.
   You should have a working CourseTable site!
   You will have to click ignore on a “self-signed certificate” error in your browser.
8. Make some changes! Most changes you make will automatically get picked up - all you'll need to do is reload.

## Troubleshooting

#### Fatal error: Uncaught SmartyException: unable to write file

Execute `chmod -R 777 web/gen` in your terminal.

#### Windows: “Hardware assisted virtualization and data execution protection must be enabled in the BIOS”

Just follow the docs from Docker. You'll need to modify your BIOS settings.

#### Chrome: privacy error

Go to [chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost) and enable the setting.

For more details, see https://stackoverflow.com/questions/35531347/localhost-blocked-on-chrome-with-privacy-error.

#### Fatal error: Uncaught Error: Failed opening required '/usr/share/nginx/html/web/includes/../../vendor/autoload.php'

This means that PHP hasn't installed all its dependencies yet. Try running `docker-compose restart` and check again.

## [stale] CourseTable Development Guide

The latest development instructions are now maintained in a Google Doc called the [CourseTable development guide](https://docs.google.com/document/d/1M0Gp8Qtaik8roGYYknDDEzAAOwP3YBj0mX1pvCy-uOI/edit?usp=sharing).

The document includes instructions on how to:

1.  Set up the dev environment
2.  Learn about the code
3.  Make your first changes
