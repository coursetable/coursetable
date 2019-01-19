# Coursetable

Coursetable is made of two big parts:

1.  **Website**: this is the site you see when you go to [coursetable.com](https://coursetable.com). The code for this is in the `web` directory.
2.  **Crawler**: these are the scripts behind the scenes that actually get all the data from Yale’s websites. The code for this is in the `crawler` directory.

## How to develop

### Website

To develop the web site, you’ll need to install a PHP-enabled web server locally. The easiest way to do this involves installing XAMPP:

#### Install and configure XAMPP (PHP, Apache, MySQL)

1.  Find and install the latest XAMPP package for your platform at [https://www.apachefriends.org/download.html]
2.  Copy the file in `dev/httpd.conf` to `<WHERE YOU INSTALLED XAMPP>/apache/conf/httpd.conf`.
3.  Edit the `httpd.conf`, and replace `D:/Documents/Code/coursetable/web` with the path where your CourseTable `web` directory lives.
4.  Copy `web/includes/Credentials.sample.php` to `web/includes/Credentials.php`
5.  Open XAMPP Control (on Windows, this is at `<WHERE YOU INSTALLED XAMPP>/xampp-control.exe`) and start Apache and MySQL.
6.  Make it easier for yourself to run PHP scripts by adding `php` to your `PATH` variable:
    - On Windows 10: https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/
      1. Search "Environment variables" in the Start menu
      2. Click the "Environment variables" button in the dialog that appears
      3. Select "Path" in "User variables"
      4. Click "Edit"
      5. In the new dialog, click "New" and enter `<WHERE YOU INSTALLED XAMPP>\php`
    - On a Mac: (https://www.architectryan.com/2012/10/02/add-to-the-path-on-mac-os-x-mountain-lion/)
      1. Open Terminal
      2. Enter `sudo nano /etc/paths`
      3. Add `<WHERE YOU INSTALLED XAMPP>/php` as a new line to the file

#### Install other dependencies

1.  **Node.js**: Visit https://nodejs.org/en/download/ and install the latest LTS version of Node.js for your machine.
2.  **Yarn**: Visit https://yarnpkg.com/en/docs/install and install the latest Stable version of Yarn, a Node.js package manager, for your machine.

#### Import the development database

1.  Visit https://app.box.com/folder/64364397861 and download the `coursetable.sql` file
2.  Open up terminal or the command line, and run `<WHERE YOU INSTALLED XAMPP>/mysql/bin/mysql -h 127.0.0.1 -u root < (where you downloaded)/coursetable.sql`
3.  Wait a minute or two until the command finishes.
4.  Visit http://localhost/phpmyadmin, where you should now see the `yaleplus` and `yale_advanced_oci` databases.

#### Build and generate data files

1.  `cd web`, and then run `yarn install` to install needed Node.JS packages
2.  Build other Javascript/CSS files at by running `php web/tools/Build.php`
3.  Generate the needed data files by running `php crawler/RegenerateDataFiles.php`
4.  Visit http://localhost/Table?debug=true. You should now see a working version of Coursetable!
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
