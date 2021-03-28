<?php
require_once 'includes/ProjectCommon.php';

$smarty = ProjectCommon::createSmarty();

$smarty->display('Blog.tpl');
