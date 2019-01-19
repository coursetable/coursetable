<?php
require_once 'includes/ProjectCommon.php';

$netId = ProjectCommon::casAuthenticate();

$smarty = ProjectCommon::createSmarty();

$smarty->display('UpdateCoursesTaken.tpl');
