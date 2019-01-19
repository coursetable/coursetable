<?php
require_once 'includes/ProjectCommon.php';

$mysqli = ProjectCommon::createYalePlusMysqli();
$netId = ProjectCommon::casAuthenticate(false);

$event = $_GET['event'];
$data = $_GET['data'];

if (empty($event) || empty($netId)) {
    exit;
}
$be = new BluebookEvent;
$be->setInfo('netId', $netId)
    ->setInfo('time', time())
    ->setInfo('event', $event)
    ->setInfo('data', $data);
$be->commit();
