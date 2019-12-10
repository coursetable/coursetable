<?php
require_once 'includes/ProjectCommon.php';

const FIRST_SEM_DAY =  '2020-01-13';
const LAST_SEM_DAY = '2020-04-24';

const HOLIDAYS_AND_BREAKS = [
    '20200120',
    '20200309',
    '20200310',
    '20200311',
    '20200312',
    '20200313',
    '20200316',
    '20200317',
    '20200318',
    '20200319',
    '20200320'
];

const FIRST_WEEK_OF_CLASSES = [
    'Monday' => '2020-01-13',
    'Tuesday' => '2020-01-14',
    'Wednesday' => '2020-01-15',
    'Thursday' => '2020-01-16',
    'Friday' => '2020-01-17',
    'Saturday' => '2020-01-18',
    'Sunday' => '2020-01-19'
];

/**
 * Creates rule to determine when/how to repeat class event
 * @param $meetingTimes   array:        associative array linking the day class
 *                                      meets with time on that day
 */
function createRecurrenceRule($meetingTimes)
{
    $recurrenceRule = new \Eluceo\iCal\Property\Event\RecurrenceRule();
    $recurrenceRule->setFreq(\Eluceo\iCal\Property\Event\RecurrenceRule::FREQ_WEEKLY);
    $recurrenceRule->setInterval(1);
    $recurrenceRule->setUntil(new DateTime(LAST_SEM_DAY));

    $dayClassMeets = "";
    foreach ($meetingTimes as $day => $time) {
        switch ($day) {
            case "Sunday":
                $dayClassMeets = $dayClassMeets .
                    \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_SUNDAY . ',';
                break;
            case "Monday":
                $dayClassMeets = $dayClassMeets .
                    \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_MONDAY . ',';
                break;
            case "Tuesday":
                $dayClassMeets = $dayClassMeets .
                    Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_TUESDAY . ',';
                break;
            case "Wednesday":
                $dayClassMeets = $dayClassMeets .
                    \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_WEDNESDAY . ',';
                break;
            case "Thursday":
                $dayClassMeets = $dayClassMeets .
                    \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_THURSDAY . ',';
                break;
            case "Friday":
                $dayClassMeets = $dayClassMeets .
                    \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_FRIDAY . ',';
                break;
            case "Saturday":
                $dayClassMeets = $dayClassMeets .  
                    \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_SATURDAY . ',';
                break;
            case "Sunday":
                $dayClassMeets = $dayClassMeets .
                    \Eluceo\iCal\Property\Event\RecurrenceRule::WEEKDAY_SUNDAY . ',';
                break;
        }
    }

    $recurrenceRule->setByDay($dayClassMeets);

    return $recurrenceRule;
}

/**
 * Parses json data to separate start/end hour+min
 * @param $meetingSummary   string:     days then times
 */
function parseStartAndEndTimes($meetingSummary)
{
    $explodedSummary = explode(' ', $meetingSummary);
    $explodedTimes = explode('-', $explodedSummary[1]);
    $startTime = explode('.', $explodedTimes[0]);
    $endTime = explode('.', $explodedTimes[1]);
    
    $classTimes = [
        'startHour' => $startTime[0],
        'startMin' => $startTime[1],
        'endHour' => $endTime[0],
        'endMin' => $endTime[1]
    ];

    return $classTimes;
}

/**
 * Determines date of first time class meets
 * @param $meetingTimes   array:        associative array linking the day class
 *                                      meets with time on that day
 */
function determineFirstDayClassMeets($meetingTimes)
{
    $firstDay = array_key_first($meetingTimes);
    return FIRST_WEEK_OF_CLASSES[$firstDay];
}

/**
 * Creates calendar event from class data
 * @param $classData        array:      json data for single class
 * @param $season           integer:    value for current academic season
 */
function createEvent($classData, $season)
{
    $event = new \Eluceo\iCal\Component\Event();
    $event->setUseTimezone(true);
    $event->setTimezoneString('America/New_York');

    $classTimes = parseStartAndEndTimes($classData['times']['long_summary']);
    $firstClassDay = determineFirstDayClassMeets($classData['times']['by_day']);

    $event->setDtStart(new DateTime($firstClassDay . ' '
        . $classTimes['startHour'] . ':' . $classTimes['startMin']));
    $event->setDtEnd(new DateTime($firstClassDay . ' '
        . $classTimes['endHour'] . ':' . $classTimes['endMin']));

    $event->setSummary("{$classData['subject']} {$classData['number']} {$classData['section']}");
    $event->setDescription("{$classData['long_title']}" . "\n" .
        "http://coursetable.com/Table/" . "{$season}/" . "course/" .
        "{$classData['subject']}_{$classData['number']}_{$classData['section']}" .
        "\n\n" . "{$classData['description']}");

    $recurrenceRule = createRecurrenceRule($classData['times']['by_day']);
    $event->setRecurrenceRule($recurrenceRule);

    // Remove classes that occur during holiday / break
    foreach (HOLIDAYS_AND_BREAKS as $holiday) {
        $event->addExDate(new DateTime($holiday . ' ' . $classTimes['startHour'] .
            ':' . $classTimes['startMin']));
    }

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

    // Populate calendar with each class
    foreach ($ociIds as $ociId) {
        $event = createEvent($ociIdData[$ociId], $season);
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
createIcsFile($ociIds, $ociIdData, $season, $outputStream);
