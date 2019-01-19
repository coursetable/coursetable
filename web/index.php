<?php
require_once 'includes/ProjectCommon.php';

$smarty = ProjectCommon::createSmarty();
$forceLogin = isset($_GET['forcelogin']);

$netId = ProjectCommon::casAuthenticate($forceLogin);
$yalePlusMysqli = ProjectCommon::createYalePlusMysqli();

// If we got here and it's forcelogin, take it straight to the Bluebook
$authorizationState = ProjectCommon::getStudentAuthorizationState($netId, $yalePlusMysqli);
if ($netId && $authorizationState == 'authorized') {
    header('Location: /Table');
}

$sbs = new StudentBluebookSetting($yalePlusMysqli);
if ($sbs->retrieve('netId', $netId, array('seenDisclaimer'))) {
    $showDisclaimer = !$sbs->info['seenDisclaimer'];
} else {
    $showDisclaimer = true;
}

$smarty->assign('netId', $netId);
$smarty->assign('authorizationState', $authorizationState);
$smarty->assign('showDisclaimer', $showDisclaimer);
$smarty->assign('loginUrl', '/?forcelogin=1');

$smarty->display('NewSplash.tpl');
