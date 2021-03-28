<?php
require_once 'includes/ProjectCommon.php';

$mysqli = ProjectCommon::createYaleAdvancedOciMysqli();

$course = new Course('id', $argv[1], array('long_title', 'description', 'requirements'));
var_dump(ord($course->info['description'][0]));
