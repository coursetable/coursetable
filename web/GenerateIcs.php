<?php
require_once 'includes/ProjectCommon.php';

define ("FIRST_SEM_DAY", '2020-01-13');
define ("LAST_SEM_DAY", '2020-04-24');
define ("HOLIDAYS_AND_BREAKS", "");

function createRecurrenceRule($meetingTimes)
{
    $recurrenceRule = new \Eluceo\iCal\Property\Event\RecurrenceRule();
    $recurrenceRule->setFreq(\Eluceo\iCal\Property\Event\RecurrenceRule::FREQ_WEEKLY);

    $dayClassMeets = "";
    foreach ($meetingTimes as $meetingTime) {
        switch ($meetingTime) {
            case "Sunday":
                $dayClassMeets = $dayClassMeets . \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_SUNDAY . ', ';
                break;
            case "Monday":
                $dayClassMeets = $dayClassMeets . \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_MONDAY . ', ';
                break;
            case "Tuesday":
                $dayClassMeets = $dayClassMeets . \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_TUESDAY . ', ';
                break;
            case "Wednesday":
                $dayClassMeets = $dayClassMeets . \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_WEDNESDAY . ', ';
                break;
            case "Thursday":
                $dayClassMeets = $dayClassMeets . \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_THURSDAY . ', ';
                break;
            case "Friday":
                $dayClassMeets = $dayClassMeets . \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_FRIDAY . ', ';
                break;
            case "Saturday":
                $dayClassMeets = $dayClassMeets . \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_SATURDAY . ', ';
                break;
            case "Sunday":
                $dayClassMeets = $dayClassMeets . \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_SUNDAY . ', ';
                break;
        }
    }

    $recurrenceRule->setByDay($dayClassMeets);

    return $recurrenceRule;
}

/**
 * Creates calendar event from class data
 * @param $classData        array;      associateive linking 
 * @param $season           integer:    value for current academic season
 */
function createEvent($classData, $season)
{
    $event = new \Eluceo\iCal\Component\Event();
    $event->setDtStart(new DateTime(FIRST_SEM_DAY . "{$classData['']}"));
    $event->setDtEnd(new DateTime(LAST_SEM_DAY . "{$classData['']}"));

    $event->setSummary("{$classData['subject']} {$classData['number']} {$classData['section']}");
    $event->setDescription("{$classData['long_title']}" . "\n" . "http://coursetable.com/Table/" . "{$season}/" . "course/" .
    "{$classData['subject']}_{$classData['number']}_{$classData['section']}" . 
    "\n\n" . "{$classData['description']}");

    $recurrenceRule = createRecurrenceRule($classData['times']['by_day']);
    $event->setRecurrenceRule($recurrenceRule);

    return $event;
}

/**
 * Renders the ICS file to stdout from OCI IDs array
 * @param $ociIds           array;      values are course IDs to include
 * @param $ociIdData        array;      associative linking oci_id to data
 * @param $season           integer:    value for current academic season
 * @param $outputStream     resource;   handle to file to write to
 */
function createIcsFile($ociIds, $ociIdData, $season, $outputStream)
{
    // Make calendar
    $calendar = new \Eluceo\iCal\Component\Calendar('https://coursetable.com');

    // Set timezone
    $calendar->setTimezone();

    // Populate calendar with each class
    foreach ($ociIds as $ociId) {
        $event = createEvent($ociIdData[$ociId]);
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
renderIcsFile($ociIds, $ociIdData, $season, $outputStream);