# Coursetable

Coursetable is made of two big parts:

1.  **Website**: this is the site you see when you go to [coursetable.com](https://coursetable.com). The code for this is in the `web` directory.
2.  **Crawler**: these are the scripts behind the scenes that actually get all the data from Yale’s websites. The code for this is in the `crawler` directory.

## How to develop

### Website

To develop the web site, you’ll need to install a PHP-enabled web server locally. The easiest way to do this involves installing XAMPP:

#### Before you start

1. Open Terminal and `git clone` this repository to somewhere on your local computer, and remember where you put it!

   ```
   # On Mac: example
   cd /Users/<your username>
   git clone git@gitlab.com:coursetable/coursetable.git
   ```

   **Note**: on Macs, if you clone it to within _Documents_, _Downloads_, or another folder other than just `/Users/yourusername`, you'll need to run

   ```
   # Example: for Documents
   chmod +x /Users/<your username>/Documents
   # Example: for Downloads
   chmod +x /Users/<your username>/Downloads
   ```

2. Download the database dump from https://app.box.com/folder/64364397861

#### Install dependencies (XAMPP, Node.js, Yarn)

1.  **XAMPP**: Visit https://www.apachefriends.org/download.html, and install the Windows/Mac version depending on your computer.
    - If you're on a Mac, make sure you download the version that's **not XAMPP-VM**
2.  **Node.js**: Visit https://nodejs.org/en/download/ and install the latest LTS version of Node.js for your machine. This also includes `npm`, the Node package manager.

#### Configure XAMPP

1.  Open up Terminal on Mac or a Command Prompt on Windows, and navigate to where you put Coursetable.

    ```
    # On Macs
    cd /Users/yourusername/coursetable

    # On Windows
    C:\Users\yourusername\Documents\coursetable
    ```

2.  Run the install script:

    ```
    npm install
    node dev/install.js
    ```

    It will prompt you to enter where you installed XAMPP, and then edit the configuration scripts and import the database.

#### Build certain files

1.  In the folder where you cloned this Git repository, run:

    ```
    cd web
    npm install
    npm run webpack
    ```

    to install needed Node.JS packages and build certain Javascript files

2.  (Macs only) Make sure that the server has the needed permissions: run:

    ```
    chmod -R 777 web/gen
    ```

3.  Visit http://localhost/Table?debug=true. You should now see a working version of Coursetable!

    - [/Table](http://localhost/Table) uses a minified version of Javascript, etc: you generally don't want to use this while developing Coursetable.

4.  If you're changing Javascript files, make sure you run:
    ```
    npm run webpack --watch
    ```
    and leave it running. This will keep re-building/compiling your Javascript as your work.

## Style

For different languages:

- Javascript: We use `prettier` to automatically format the code. Make sure you use your editor's integration!
- PHP: We use PHP CodeSniffer to maintain coding standards; generally, it's 4 spaces for tabs, camelCase for variables, and follow whatever else that's in use right now.

## (Mostly for Peter and Harry) Steps for rolling out a new server

1.  Create a SSH key, and add it as a deploy key for both this repository and
    `install-scripts`.
2.  Run `cd /home/web && git clone git@gitlab.com:myrtlelime/coursetable.git app`
3.  Run `install.sh`
4.  Run `components/gencerts.sh` to generate certificates if needed
5.  Load the database locally, if needed
6.  Run `finish-install.sh`

## To rebuild JS on main site

`cd web/tools` and run `php Build.php`

## Steps for setting up debugging on Windows

1.  Change `web/includes/ProjectCommon.php` to point to a remote database
2.  Run `composer install` in `web/libs` and in `crawler`
3.  In your php.ini, make sure cURL, MySQLi, SQLite3 are enabled
4.  Run `php Build.php` in `web/tools`
5.  Run `php RegenerateDataFiles.php` in `crawler` to either generate the JSON locally
