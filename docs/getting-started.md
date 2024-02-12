# Getting Started with CourseTable

Thanks for taking the initiative to get started with CourseTable! Here are a few reasons why you made the right choice:

- It was super satisfying to build something that our friends on campus could use
- We also found a ton of courses that we loved, and taking good classes definitely made Yale a better experience

We hope you’ll enjoy building something your friends can use as well!

## Initial Development Environment Setup

<details>
  <summary><strong>Initial setup for Windows only (CLICK HERE)</strong></summary>

Cause Windows is a special little baby, there's some things we got to do to get this working correctly.

1. Install [Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/get-started)

1. Install [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) by using the `wsl --install -d Ubuntu-20.04` command.

   If you already have WSL, make sure it is WSL2 by using the `wsl -l -v` command.

   If it is not version 2, then use the `wsl --set-version <distribution-name> 2` and use the distribution name that shows up from the command above.

</details>

---

**For Everyone**

1. Install [Visual Studio Code](https://code.visualstudio.com/Download)

   > **For Windows**: When installing, make sure `Add to PATH (requires shell restart)` option is checked. You can make sure that it was added by going to Control Panel -> System and Security -> System -> Advanced System Settings -> Environment Variables... -> Under your user variables double-click `Path`. Here you should see an entry that looks like `C:\Users\<your-user-name-here>\AppData\Local\Programs\Microsoft VS Code\bin`. If you don't, click `New` and add it here.

1. Join our GitHub organization and clone the repository

   Make sure that you're added to the [CourseTable GitHub organization](https://github.com/coursetable).

   Open up a terminal.

   > **For Windows**: Make sure to clone the repository in your Linux filesystem in Ubuntu using Windows Terminal (NOT your Windows filesystem). This means your terminal signature should look something like `user@machine-name:~$` not `user@machine-name:/mnt/c$`. This will allow React hot reloading to work.

   Clone the [coursetable/coursetable repository](https://github.com/coursetable/coursetable) by running `git clone https://github.com/coursetable/coursetable.git`.

   After cloning, cd to the repository. Open the repository in VSCode by running the command `code .`.

   > **For Windows**: This should open it using WSL, and you should see a green bar on the bottom left of your VSCode editor that says `WSL: Ubuntu-20.04`. Also, make sure that the bar in the bottom right says `LF` and not `CRLF`.

   Then, install the following extensions:

   - [Remote - WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) (only needed for Windows)
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

   > **For Windows**: In the Extensions tab in VSCode, you should see a `LOCAL - INSTALLED` section and a `WSL: UBUNTU-20.04 - INSTALLED` section. VSCode separates the extensions you've installed locally on your Windows system and remotely on your WSL Ubuntu system. When installing new extensions, make sure to click `Install in WSL: Ubuntu-20.04`.

1. Install Doppler

   Make sure you've been added to the organization there – if not, contact one of the project leads. (We typically invite your _Yale email_, so make sure to login to Doppler with your Yale email (with Google) instead of with GitHub or some other personal email.

   Follow the instructions [here](https://docs.doppler.com/docs/enclave-installation).

   We use Doppler to manage our secrets such as API keys.

   > **For Windows**: Make sure to use the `Debian/Ubuntu` installation instructions.

1. Install Docker

   - Mac or Windows: Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

     > **For Windows**: Make sure `Enable WSL 2 Windows Features` is checked during installation. After installation, open up Docker Desktop and go to Settings. Click on `Resources` and go to `WSL Integration`. You should see `Enable integration with additional distros:` and switch on your Ubuntu distribution. Then, click `Apply & Restart`.

   - Linux: Install [Docker CE](https://docs.docker.com/engine/install/)
     and [Docker Compose](https://docs.docker.com/compose/install/)

1. Install Node/NPM

   - Mac or Linux: Install Node: see [here](https://nodejs.org/en/download/) for downloadable installer.

   - Windows: Install [nvm, node.js, and npm](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-wsl2#install-nvm-nodejs-and-npm). Follow Steps 1 - 9 at the link to the left.

   > **For Windows**: If you get an error that looks like this `bash: /mnt/c/Program Files/nodejs/npm: /bin/sh^M: bad interpreter: No such file or directory`, then try following the instructions [here](https://hackmd.io/@badging/wsl2#Troubleshooting-PATH).

1. Install Bun

   - Run `curl -fsSL https://bun.sh/install | bash`

## Aside: a quick explainer on docker-compose

`docker-compose` is a tool we use to orchestrate a bunch of different things, all running in parallel. It also enables us to avoid most cross-platform compatibility issues.

Our setup is declared in the [docker-compose.yml](../api/docker-compose.yml) file.

- The dev environment is defined in combination with the [dev-compose.yml](../api/dev-compose.yml) file.
- The production environment is defined in combination with the [prod-compose.yml](../api/prod-compose.yml) file.

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

1. Open Docker Desktop.

   Ensure that Docker Desktop is up and running.

   > **Windows**: In Settings -> Resources -> WSL Integration, make sure "Enable integration with my default WSL distro" is checked.

1. `cd` to the cloned coursetable root directory.

   > **For Windows**: Make sure you are in Ubuntu in Windows Terminal

1. Install dependencies in the root directory.

   ```sh
   bun install
   ```

   This installs dependencies needed by all projects in this monorepo. You should not need to install dependencies in any subdirectory. (But, new dependencies should generally be installed to subfolders instead of the root, unless it's a linting dependency.)

1. Initialize Doppler.

   ```sh
   # log in
   # 	- select "Scope login to current directory if you're using Doppler elsewhere"
   #  - select the 'dev' config
   doppler login
   ```

   This only needs to be run once, and doppler will remember you in the future.

1. Start the backend:

   ```sh
   cd api
   ./start.sh -d
   ```

   Optionally, to overwrite your cached catalogs:

   ```sh
   cd api
   ./start.sh -d -o
   # Ctrl + C to exit after catalogs refresh
   ./start.sh -d # start normally
   ```

1. Wait ~2-3 minutes. If you’re curious, here's what's going on:

   - Installing Node.js module dependencies
   - Setting up the database schema
   - Generating some JSON data files

   You should see something like `api_1 | {"message":"Insecure API listening on port 4096","level":"info","timestamp":"2021-10-09 21:24:01:241"}`. You can test that the API is working by going to http://localhost:4096/api/ping which should show you a page that says "pong".

1. In a seperate terminal window, start the frontend:

   ```sh
   cd ../frontend
   ./start.sh
   ```

1. Navigate to https://localhost:3000.

   You should have a working CourseTable site! You'll have to click ignore on a “self-signed certificate” error in your browser (we need to deploy the site in HTTPS, so that all web APIs work).

1. Make some changes!

   Most changes you make (i.e. to the API server or frontend) will automatically get picked up - all you'll need to do is save the changed file(s) and reload the page.

1. When you are done, make sure to safely exit both the **_frontend and backend_**.

   > Use Ctrl+C in each terminal (frontend & backend) to safely exit.

## Troubleshooting

- `Windows: “Hardware assisted virtualization and data execution protection must be enabled in the BIOS”`

  Just follow the docs from Docker. You'll need to modify your BIOS settings.

- `Chrome: privacy error`

  Go to [chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost) and enable the setting.

  For more details, see https://stackoverflow.com/questions/35531347/localhost-blocked-on-chrome-with-privacy-error.

- ```
  Unable to install the latest Doppler CLI
  Doppler Error: exit status 2
  ```

  Try using `sudo doppler update`.

## Adding packages

1. Ensure bun is installed by running `bun -v`

1. Make sure you're in the correct subdirectory (e.g. `/frontend`)

1. Add your package by running `bun install <package>`

## Updating packages

1. Ensure bun is installed by running `bun -v`

1. Make sure you're in the correct subdirectory (e.g. `/frontend`)

1. Add your package by running `bun update --save`

</details>

&nbsp;

## Fixing linting errors

We have a bunch of linting infrastructure to help you write clean and maintainable code. When you submit a PR, a GitHub action runs all checks and fails if there are any errors. All linting infrastructure is defined in the root `package.json`. You can run the following command:

```sh
bun checks
```

This runs the following checks:

1. There are no unused dependencies declared in `package.json`
2. The code is appropriately formatted using [Prettier](https://prettier.io/)
3. The code follows our [ESLint](https://eslint.org/) rules
4. The CSS code follows our [stylelint](https://stylelint.io/) rules
5. Images in `frontend/src/images/headshots` are properly scaled
6. The code type-checks

If you get any errors, you can run the following command to fix them:

```sh
bun checks:fix
```

- Problems reported by `depcheck`: if the dependency is actually unused, remove it from `package.json` and run `bun install`. If the dependency is actually used but it's not imported by any code (for example, it's only used in command line), add it to the `ignores` list in `.depcheckrc`.
- Problems reported by `prettier`: they will all be automatically fixed by `checks:fix`.
- Problems reported by `eslint`: some will be automatically fixed by `checks:fix`. For the rest, you can check the respective documentation for the rule if you are unsure what to do (your editor's error popup should display a link).
- Problems reported by `stylelint`: some will be automatically fixed by `checks:fix`. For the rest, fix them manually.
- Problems reported by `resize-image`: they will all be automatically fixed by `checks:fix`.
- Problems reported by `tsc`: you'll have to fix them manually. You can ask someone for help if you are unsure what to do.
