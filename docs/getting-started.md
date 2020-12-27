# Getting Started with CourseTable

Thanks for taking the initiative to get started with CourseTable! Here are a few reasons why you made the right choice:

- It was super satisfying to build something that our friends on campus could use
- We also found a ton of courses that we loved, and taking good classes definitely made Yale a better experience

We hope you’ll enjoy building something your friends can use as well!

## Development Environment Setup

<details>
  <summary><strong>Mac or Linux</strong></summary>

  1. Install Docker
      - Mac: Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
      - Linux: Install [Docker CE](https://docs.docker.com/engine/install/)
 and [Docker Compose](https://docs.docker.com/compose/install/)

  2. Install a text editor

      We recommend you use [Visual Studio Code](https://code.visualstudio.com/Download) as your editor. WebStorm is pretty good as well and is free for students.

      If you use VS Code, we recommend these extensions:

      - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
      - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
      - [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

  3. Join our GitHub organization and clone the repository

      Make sure that you're added to the [CourseTable GitHub organization](https://github.com/coursetable).

      Clone the [coursetable/coursetable repository](https://github.com/coursetable/coursetable) by running `git clone git@github.com:coursetable/coursetable.git`.

  4. Create `facebook.env`
  
      Create the `facebook.env` file with the following contents.

      ```sh
      FACEBOOK_APP_ID=185745958145518
      FACEBOOK_APP_SECRET=<redacted>
      ```

      The app secret should be replaced by the actual value - reach out to us to get this. Alternatively, if you don't intend to test anything related to the Facebook integration, you can just leave that value empty.
</details>

<details>
  <summary><strong>Windows</strong></summary>

  Cause Windows is a special little baby, there's a lot of things we got to do to get this working correctly.

  1. Install [Visual Studio Code](https://code.visualstudio.com/Download)

      When installing, make sure `Add to PATH (requires shell restart)` option is checked. You can make sure that it was added by going to Control Panel -> System and Security -> System -> Advanced System Settings -> Environment Variables... -> Under your user variables double-click `Path`. Here you should see an entry that looks like `C:\Users\<your-user-name-here>\AppData\Local\Programs\Microsoft VS Code\bin`. If you don't, click `New` and add it here.

      Once installed, open VSCode and install the following extensions:

      - [Remote - WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)
      - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
      - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
      - [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)
  
  2. Install [Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/get-started)

  3. Install [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) (Ubuntu 20.04 LTS)

      Follow Steps 1 - 6 at the link above.

      For Step 6, download [Ubuntu 20.04 LTS](https://www.microsoft.com/en-us/p/ubuntu-2004-lts/9n6svws3rx71?rtc=1).

  4. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
      
      Make sure “Enable WSL 2 Windows Features” is checked during installation.

  5. Install [GitHub Desktop](https://desktop.github.com/)

      Make sure that you're added to the [CourseTable GitHub organization](https://github.com/coursetable).
      
      Once installed, open GitHub Desktop and clone the [coursetable/coursetable repository](https://github.com/coursetable/coursetable).

      Then, cd to the repository in Ubuntu using Windows Terminal. Open the repository in VSCode by running the command `code .`. This should open it using WSL, and you should see a green bar on the bottom left of your VSCode editor that says `WSL: Ubuntu-20.04`.
  
  6. Change CRLF to LF

      Since Linux uses LF (and Windows uses CRLF) for line endings, run the following commands in the coursetable root directory.

      ```
      git config core.autocrlf false 
      git rm --cached -r . 
      git reset --hard
      ```

      If you get permission errors, then run the commands again with `sudo` at the beginning of each line.

      Make sure that it changed correctly by opening the repository in VSCode and looking at the bar in the bottom right for `LF`.

  7. Create `facebook.env`

      In the coursetable root directory, create a `facebook.env` file with the following contents.

      ```sh
      FACEBOOK_APP_ID=185745958145518
      FACEBOOK_APP_SECRET=<redacted>
      ```

      The app secret should be replaced by the actual value - reach out to us to get this. Alternatively, if you don't intend to test anything related to the Facebook integration, you can just leave that value empty.

  8. Restart Windows Terminal

      Close and reopen Windows Terminal.

      Then, cd back to the repository in Ubuntu.

  9. Go to [Running CourseTable](#running-coursetable)
</details>

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

1. Cd to the cloned coursetable root directory

2. Start coursetable

    ```sh
    cd docker
    docker-compose up -d
    docker-compose logs -f
    ```

3. Wait ~10 minutes. If you’re curious, here's what's going on:

    - Installing Node.js module dependencies
    - Installing PHP (Composer) packages
    - Setting up the database schema
    - Generating some JSON data files

4. Start again

    Not everything comes up the first time because of our inter-service dependencies. Run these commands. You might need to do this a couple times.

    ```sh
    # kill the docker-compose logs -f command from above using Cmd (Ctrl) + C
    docker-compose up -d
    docker-compose logs -f
    ```

5. Navigate to https://localhost:8080.

    You should have a working CourseTable site! You will have to click ignore on a “self-signed certificate” error in your browser.

6. Make some changes!

    Most changes you make will automatically get picked up - all you'll need to do is reload.

    > For Windows: You will need to restart the docker_frontend_1 container which you can do in the Docker Desktop app.

## Troubleshooting

- `Fatal error: Uncaught SmartyException: unable to write file`

  Execute `chmod -R 777 web/gen` in your terminal.

- `Windows: “Hardware assisted virtualization and data execution protection must be enabled in the BIOS”`

  Just follow the docs from Docker. You'll need to modify your BIOS settings.

- `Chrome: privacy error`

  Go to [chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost) and enable the setting.

  For more details, see https://stackoverflow.com/questions/35531347/localhost-blocked-on-chrome-with-privacy-error.

- `Fatal error: Uncaught Error: Failed opening required '/usr/share/nginx/html/web/includes/../../vendor/autoload.php'`

  This means that PHP hasn't installed all its dependencies yet. Try running `docker-compose restart` and check again.

## [stale] CourseTable Development Guide

Our old development instructions can be found [here](https://docs.google.com/document/d/1M0Gp8Qtaik8roGYYknDDEzAAOwP3YBj0mX1pvCy-uOI/edit?usp=sharing).

The document includes instructions on how to:

1.  Set up the dev environment
2.  Learn about the code
3.  Make your first changes
