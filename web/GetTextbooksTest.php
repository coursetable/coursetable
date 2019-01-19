<?php
require_once 'includes/ProjectCommon.php';

header('Content-Type: application/json');

$mysqli = ProjectCommon::createMysqli('yale_advanced_oci');

$amazon = ProjectCommon::createAmazon();

// Get the actual Amazon prices
$curl = new AmazonCurl;
$curl->fetchByASINs(array('1118828070'));
