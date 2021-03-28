<?php
require_once 'includes/ProjectCommon.php';

$success = false;

$yalePlusMysqli = ProjectCommon::createYalePlusMysqli();
$netId = ProjectCommon::getID();
$evaluationsEnabled = 0;

if (!empty($netId)) {
    $sbsColumns = array('evaluationsEnabled');
    $sbs = StudentBluebookSetting::findOrCreate($yalePlusMysqli, $netId, $sbsColumns);

    $evaluationsEnabled = (bool) $sbs->info['evaluationsEnabled'];
    $success = true;
}

header('Content-type: application/json');
echo json_encode(array(
    'success' => $success,
    'netId' => $netId,
    'evaluationsEnabled' => $evaluationsEnabled,
));
