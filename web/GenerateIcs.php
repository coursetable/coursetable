<?php
require_once 'includes/ProjectCommon.php';

function createEvent()
{
    $event = new \Eluceo\iCal\Component\Event();
    $event->setDtStart(new \DateTime('2019-11-18'));
    $event->setDtEnd(new \DateTime('2019-11-18'));
    $event->setNoTime(true);
    $event->setSummary('Christmas');
}

function addImportantEvents()
{
}

/**
 * Renders the ICS file to stdout from OCI IDs array
 * @param $ociIds           array; values are course IDs to include
 * @param $ociIdData        array; associative linking oci_id to data
 * @param $outputStream     resource; handle to file to write to
 */
function createIcsFile($ociIds, $ociIdData, $outputStream)
{
    // Set timezone
    date_default_timezone_set();

    // Make calendar
    $calendar = new \Eluceo\iCal\Component\Calendar('https://coursetable.com');

    // Populate calendar with each event corresponding to each class
    foreach ($ociIds as $ociId) {
        $event = createEvent();
        $calendar->addComponent($event);
    }

    // Output calendar to stdout
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
renderIcsFile($ociIds, $ociIdData, $outputStream);