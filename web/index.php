<?php
require_once 'includes/ProjectCommon.php';

$smarty = ProjectCommon::createSmarty();
$forceLogin = isset($_GET['forcelogin']);
$successUrl = $_GET['successurl'];
$logout  = isset($_GET['logout']);

// Logout
if ($logout) {
}

$netId = ProjectCommon::getID();
$yalePlusMysqli = ProjectCommon::createYalePlusMysqli();
$yaleAdvancedOciMysqli = ProjectCommon::createYaleAdvancedOciMysqli();

// If we got here and it's forcelogin, take it straight to the Bluebook
$authorizationState = ProjectCommon::getStudentAuthorizationState($netId, $yalePlusMysqli);
if ($netId && $authorizationState == 'authorized') {
    if ($successUrl) {
        header('Location: /'.$successUrl);
    } else {
        header('Location: /');
    }
}

$sbs = new StudentBluebookSetting($yalePlusMysqli);
if ($sbs->retrieve('netId', $netId, array('seenDisclaimer'))) {
    $showDisclaimer = !$sbs->info['seenDisclaimer'];
} else {
    $showDisclaimer = true;
}

$keyValueStore = new MysqlTable($yaleAdvancedOciMysqli, 'key_value_store');
if ($keyValueStore->retrieve('key', 'Splash page message', array('value'))) {
    $smarty->assign('splashMessage', $keyValueStore->info['value']);
}

$smarty->assign('netId', $netId);
$smarty->assign('authorizationState', $authorizationState);
$smarty->assign('showDisclaimer', $showDisclaimer);
$smarty->assign('loginUrl', '/?forcelogin=1');

$smarty->display('NewSplash.tpl');
