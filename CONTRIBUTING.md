# Contributing to CourseTable

Thanks for taking the initiative to get started with CourseTable! Here are a few reasons why you made the right choice:

- It was super satisfying to build something that our friends on campus could use
- We also found a ton of courses that we loved, and taking good classes definitely made Yale a better experience

We hope you’ll enjoy building something your friends can use as well!

## Setting up the development environment

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

1. Install Node/npm

   - Mac or Linux: Install Node: see [here](https://nodejs.org/en/download/) for downloadable installer.

   - Windows: Install [nvm, node.js, and npm](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-wsl2#install-nvm-nodejs-and-npm). Follow Steps 1 - 9 at the link to the left.

   > **For Windows**: If you get an error that looks like this `bash: /mnt/c/Program Files/nodejs/npm: /bin/sh^M: bad interpreter: No such file or directory`, then try following the instructions [here](https://hackmd.io/@badging/wsl2#Troubleshooting-PATH).

1. Install Bun

   - Run `curl -fsSL https://bun.sh/install | bash`

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

   Note that there are two other relevant flags:

   - On first setup, run with `--ferry_seed` (or `-f`) to seed your local Postgres database: `./start.sh -d -f`. You can run this command again to refresh the course data.
   - To overwrite your cached catalogs, run with `--overwrite` (or `-o`): `./start.sh -d -o`. This flag is implied by the `-f` flag.

1. Wait ~2-3 minutes. If you’re curious, here's what's going on:

   - Installing Node.js module dependencies
   - Setting up the database schema
   - Generating some JSON data files

   You should see something like `express         | {"level":"info","message":"Sitemap index generated at static/sitemaps/sitemap_index.xml","timestamp":"2024-11-23 17:14:10:1410"}`. You can test that the API is working by going to https://localhost:3001/api/ping which should show you a page that says "pong".

1. In a separate terminal window, connect to the `express` container's execution context and seed the Postgres DB:

   ```sh
   docker exec -it express sh
   # Inside the express container's terminal
   cd api && npm run db:push
   ```

   Make sure to complete any confirmation dialogs that appear. Remember that any changes to `api/drizzle/schema.ts` will require running this step again.

1. In a separate terminal window, start the frontend:

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

### Troubleshooting

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

- `relation "studentBluebookSettings" does not exist`

  Make sure to seed the Postgres database (`npm run db:push`) after starting the containers.

## Running offline

You may be a super dedicated developer and want to contribute to CourseTable from remote mountains or under the sea. Don't worry -- we have you covered. Developing on CourseTable offline is easy once you have followed all the above steps. From the `api` folder, just run:

```
docker pull oven/bun:slim
docker pull node:slim
./start.sh --dev --offline
```

## Contributing

1. Create a branch for your feature. This can usually be done with `git checkout -b <username>/<feature_name>`
2. _Make changes._
3. Create some commits and push your changes to the origin.
4. Create a pull request and add a few reviewers. In the pull request, be sure to reference any relevant issue numbers.
5. Once the pull request has been approved, merge it into the master branch.

### Semantic commit messages

We use semantic commit messages to help us keep track of the code history. The format looks like: `<type>: <subject>`. There is also a scope, but because significant changes are usually not scoped to one particular part, we don't use it.

The various types of commits:

- `feat`: a new API or behavior **for the end user**.
- `fix`: a bug fix **for the end user**.
- `docs`: a change to other Markdown documents in our repo.
- `refactor`: a change to production code that leads to no behavior difference, e.g. splitting files, renaming internal variables, improving code style...
- `test`: adding missing tests, refactoring tests; no production code change.
- `chore`: upgrading dependencies, releasing new versions... Chores that are **regularly done** for maintenance purposes.
- `misc`: anything else that doesn't change production code, yet is not `test` or `chore`. e.g. updating GitHub actions workflow.

Do not get too stressed about PR titles, however. Your PR will be squash-merged and your commit to the `master` branch will get the title of your PR, so commits within a branch don't need to be semantically named. Others can rename your PR title when they merge it.

Example:

```
fix: sort past syllabi in chronological order
^--^ ^------------^
|    |
|    +-> Summary in present tense. Use lower case not title case!
|
+-------> Type: see above for the list we use.
```

### Looking for something to work on?

We use [GitHub issues](https://github.com/coursetable/coursetable/issues) to keep track of issues that the team has interest in pursuing. This should be your first point of reference.

Team members can also look at the [Canny board](https://coursetable.canny.io/) and identify new feature requests that have value in pursuing. You should triage these requests as "Under review" or "Planned", and then create a linked GitHub issue for them.

## Development quick references

### Managing dependencies

Please read the [Bun documentation](https://bun.sh/docs/cli/install) for how to install, update, and remove dependencies. Because we use a monorepo, make sure that you install dependencies in the project that actually depends on it.

On the frontend, we minimize the number and size of dependencies we use. You can check the [bundle map](https://coursetable.com/bundle-map.html) on our live website to find the largest dependencies in the main bundle (`entry-index-xxxxx.js`). If you really need to use heavy dependencies, make sure they are code-split and only loaded when necessary (such as the graphiql library which only loads when you open the GraphQL Playground).

### Debugging API

You will notice that the Express server runs on a Bun runtime. Debugging is enabled in development through [Bun's web debugger](https://bun.sh/guides/runtime/web-debugger).

Please note the following when debugging Bun in Docker (see [`oven/bun #7225`](https://github.com/oven-sh/bun/issues/7225)):

- Bun will log `https://debug.bun.sh/#0.0.0.0:6499/forcingPrefix` as the web debugger
- Use `https://debug.bun.sh/#localhost:6499/forcingPrefix` instead

### Fixing linting errors

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
- Problems reported by `eslint` and `stylelint`: some will be automatically fixed by `checks:fix`. For the rest, you can check the respective documentation for the rule if you are unsure what to do (your editor's error popup should display a link).
- Problems reported by `resize-image`: they will all be automatically fixed by `checks:fix`.
- Problems reported by `tsc`: you'll have to fix them manually. You can ask someone for help if you are unsure what to do.
