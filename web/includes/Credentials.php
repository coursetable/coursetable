<?php
if (file_exists(__DIR__ . '/CredentialsOverride.php')) {
    // We use the override credentials if they exist
    require_once __DIR__ . '/CredentialsOverride.php';
}

/** Only define if the variable hasn't been set */
function maybe_define($name, $value)
{
    if (defined($name)) {
        return;
    }
    define($name, $value);
}

// This is a sample database credentials file. The settings here are perfect
// for developing locally with Docker
maybe_define('MYSQL_HOST', 'mysql'); // e.g. define('MYSQL_HOST', 'example.com');
maybe_define('MYSQL_USERNAME', 'root');
maybe_define('MYSQL_PASSWORD', 'GoCourseTable');
maybe_define('MYSQL_DATABASE', 'yale_advanced_oci');

maybe_define('FACEBOOK_APP_ID', getenv('FACEBOOK_APP_ID'));
maybe_define('FACEBOOK_APP_SECRET', getenv('FACEBOOK_APP_SECRET'));
