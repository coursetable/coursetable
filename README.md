# Coursetable

Coursetable is made of two big parts:

1.  **Website**: this is the site you see when you go to [coursetable.com](https://coursetable.com). The code for this is in the `web` directory.
2.  **Crawler**: these are the scripts behind the scenes that actually get all the data from Yale’s websites. The code for this is in the `crawler` directory.

## How to develop

### Website

To develop the web site, you’ll need to install a PHP-enabled web server locally. The easiest way to do this involves installing XAMPP:

#### Before you start

`git clone` this repository to somewhere on your local computer, and remember where you put it!

```
# On Mac: example
cd /Users/<your username>
git clone git@gitlab.com:coursetable/coursetable.git
```

**Note**: on Macs, if you clone it to within *Documents*, you'll need to run `chmod +x /Users/<your username>/Documents`.

#### Install and configure XAMPP (PHP, Apache, MySQL)

1.  Find and install the latest XAMPP package for your platform at https://www.apachefriends.org/download.html
    - If you're on a Mac, make sure you download the version that's **not XAMPP-VM**

2.  Configure Apache for XAMPP:
    1. Open up the `httpd.conf` file
        - **On Windows**: Open the XAMPP Control Panel, then click *Config* > *Apache (httpd.conf)*

          ![Screenshot for Windows](https://i.imgur.com/jBZhv7j.png)

        - **On Mac**: Open up *XAMPP* and *manager-osx* in Applications, and click *Manage servers* > *Apache Web Server* > *Configure* > *Open Conf File*, and press yes to the "Advanced users only" dialog that appears.

          ![Screenshot for Mac](https://i.imgur.com/yn4YPIM.png)

    2. Find the lines that read:
       ```
       # Windows
       DocumentRoot "C:/xampp/htdocs"
       <Directory "C:/xampp/htdocs">
       # Mac
       DocumentRoot "/Applications/XAMPP/xamppfiles/htdocs"
       <Directory "/Applications/XAMPP/xamppfiles/htdocs">
       ```
       and change it to the `web` subdirectory where you cloned this Git repository:
       ```
       DocumentRoot "<PATH_TO_YOUR_COURSETABLE>/web"
       <Directory "<PATH_TO_YOUR_COURSETABLE>/web">
       ```
    3. Farther down in the file, just before the next `</Directory>`, add the following two lines:
       ```
       RewriteEngine On
       # Change all requests without .php to .php
       RewriteRule ^([\d\w]+)(/[\d\w/]+)?$ /$1\.php$2 [L]
       ```

3. Configure PHP:
    - On a **Mac**: open `/Applications/XAMPP/xamppfiles/etc/php.ini`
    - On **Windows**: open `C:\xampp\php\php.ini`

    Then, first search for `error_reporting`, and change the line:
    ```
    Before:
    error_reporting=E_ALL & ~E_DEPRECATED & ~E_STRICT

    After:
    error_reporting=E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING & ~E_NOTICE
    ```

    Then:

    * For Windows ONLY, search for `extension=sqlite` in the same file and uncomment the line by removing the leading `;`

      ```
      Before (Windows):
      ;extension=sqlite3

      After (Windows):
      extension=sqlite3
      ```
    * For Mac, skip this step! You already have sqlite3 enabled for running scripts.

3.  Start the Apache and MySQL services in XAMPP (or restart them if you've done it already)
4.  Make it easier for yourself to run PHP scripts by adding `php` to your `PATH` variable:
    - On Windows 10: https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/
      1. Search "Environment variables" in the Start menu
      2. Click the "Environment variables" button in the dialog that appears
      3. Select "Path" in "User variables"
      4. Click "Edit"
      5. In the new dialog, click "New" and enter `<WHERE YOU INSTALLED XAMPP>\php`
    - On a Mac, you don't need to do anything! Macs come with a built-in version of PHP that works well enough for most scripts.

#### Install other dependencies

1.  **Node.js**: Visit https://nodejs.org/en/download/ and install the latest LTS version of Node.js for your machine.
2.  **Yarn**: Visit https://yarnpkg.com/en/docs/install and install the latest Stable version of Yarn, a Node.js package manager, for your machine.

#### Import the development database

1.  Visit https://app.box.com/folder/64364397861 and download the `coursetable.sql` file
2.  Open up terminal or the command line, and run:
    - On Windows:

      ```
      C:\xampp\mysql\bin\mysql -h 127.0.0.1 -u root < (where you downloaded)/coursetable.sql
      ```

    - On Mac:
      ```
      /Applications/XAMPP/xamppfiles/bin/mysql -h 127.0.0.1 -u root < (where you downloaded)/coursetable.sql
      ```

3.  Wait up to a minute until the command finishes.
4.  Visit http://localhost/phpmyadmin, where you should now see the `yaleplus` and `yale_advanced_oci` databases.

#### Build and generate data files

1.  In the folder where you cloned this Git repository, run:
    ```
    cd web
    yarn install
    yarn webpack
    ```
    to install needed Node.JS packages and build certain Javascript files
2.  Copy `crawler/includes/Credentials.sample.php` to `crawler/includes/Credentials.php`
3.  Build other Javascript/CSS files at by running `php web/tools/Build.php`
4.  Generate the needed data files by running `php crawler/RegenerateDataFiles.php`
5.  (Macs only) Make sure that the server has the needed permissions: run:

    ```
    chmod -R 777 web/gen
    ```

5.  Visit http://localhost/Table?debug=true. You should now see a working version of Coursetable!
    - [/Table](http://localhost/Table) uses a minified version of Javascript, etc: you generally don't want to use this while developing Coursetable.

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
