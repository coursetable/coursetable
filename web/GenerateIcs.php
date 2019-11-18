<?php
require_once 'includes/ProjectCommon.php';

function addEventToCalendar()
{
    
}

function addImportantEvents()
{

}

function createIcsFile($ociIds, $ociIdData, $outputStream)
{
    $calendar = new \Eluceo\iCal\Component\Calendar('https://coursetable.com');
    $event = new \Eluceo\iCal\Component\Event();
    $event->setDtStart(new \DateTime('2019-11-18'));
    $event->setDtEnd(new \DateTime('2019-11-18'));
    $event->setNoTime(true);
    $event->setSummary('Christmas');
    $calendar->addComponent($event);
    echo $calendar->render();
}

ini_set('memory_limit', '256M');

// Actually process the data and request
$ociIds = explode(',', $_GET['ociIds']);
foreach ($ociIds as &$ociId) {
    $ociId = (int) $ociId;
}

$netId = ProjectCommon::casAuthenticate(true);
$season = (int)$_GET['season'];

$mysqli = ProjectCommon::createYaleplusMysqli();

$sbs = StudentBluebookSetting::findOrCreate($mysqli, $netId, ['evaluationsEnabled']);
$data = ProjectCommon::jsonDataForSeason($season, $sbs->info['evaluationsEnabled']);

$ociIdData = array();
foreach ($data as $entry) {
    $ociIdData[$entry['oci_id']] = $entry;
}
unset($data);

header('Content-Encoding: UTF-8');

if (!isset($_GET['debug'])) {
    header('Content-Type: text/calendar; charset=UTF-8');
    header('Content-Disposition: attachment; filename=Courses.ics');
}

$outputStream = fopen('php://output', 'w');
renderIcsFile($ociIds, $ociIdData, $season, $outputStream);