# Coursetable

Coursetable is made of two big parts:

1.  **Website**: this is the site you see when you go to [coursetable.com](https://coursetable.com). The code for this is in the `web` directory.
2.  **Crawler**: these are the scripts behind the scenes that actually get all the data from Yale’s websites. The code for this is in the `crawler` directory.

## How to develop

The latest development instructions are now maintained in a Google Doc called the [CourseTable development guide](https://docs.google.com/document/d/1M0Gp8Qtaik8roGYYknDDEzAAOwP3YBj0mX1pvCy-uOI/edit?usp=sharing).

The document includes instructions on how to:

1.  Set up the dev environment
2.  Learn about the code
3.  Make your first changes

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
