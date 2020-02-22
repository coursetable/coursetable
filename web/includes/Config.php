<?php
# Credentials may specify some configuration, which should
# take precedence over the config defined here.
require_once __DIR__ . '/Credentials.php';

if (!defined('IS_DEVELOPMENT')) {
    define('IS_DEVELOPMENT', true);
}
