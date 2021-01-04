<?php
require_once 'includes/ProjectCommon.php';

// Force authentication
$netId = ProjectCommon::getID();

$smarty = ProjectCommon::createSmarty();
$mysqli = ProjectCommon::createYaleAdvancedOciMysqli();

// Originally: /Timetable[/semester]
// Parts:
// 0: ''
// 1: 'Bluebook'
// 2: course or semester
// 3: course
$urlParts = explode('/', $_SERVER['REQUEST_URI']);
$season = ProjectCommon::fetchCurrentSeason();
$allSeasons = ProjectCommon::fetchAllSeasons();
foreach ($urlParts as $part) {
    $part = preg_replace('/\?.*/', '', $part); // Replace any querystrings
    if (in_array($part, $allSeasons)) {
        $season = $part;
        break;
    }
}

// Get the student's courses for that season/semester
$wc = new CourseName($mysqli);
$wc->setColumns(array('course_id'))
    ->addCond('net_id', $netId)
    ->addCond('season', $season)
    ->select();
$courseIds = Base::flattenResults($wc->getResults(), 'course_id');
if (empty($courseIds)) {
    $courseIds = array(-1); // Dummy for following conditions
}

// Get all courses
$cj = new CourseJson($mysqli);
$cj->setColumns(array('id', 'json'))
    ->addCond('id', $courseIds)
    ->select();

$jsonCourses = array();

while ($cj->nextItem()) {
    $jsonCourses[] = json_decode($cj->info['json'], true);
}

$coursesByDay = array();

// Group courses by sessions
foreach ($jsonCourses as $course) {
    foreach ($course['times']['by_day'] as $weekday => $sessions) {
        if ($weekday === 'HTBA') {
            continue;
        }

        foreach ($sessions as $session) {
            if (!isset($coursesByDay[$weekday])) {
                $coursesByDay[$weekday] = array();
            }
            $coursesByDay[$weekday][] = array(
                'session' => $session,
                'course' => $course
            );
        }
    }
}

// Sort courses by session time
foreach ($coursesByDay as &$courses) {
    usort(
        $courses,
        function ($a, $b) {
            list($startTimeA, $endTimeA, $locationA) = $a['session'];
            list($startTimeB, $endTimeB, $locationB) = $b['session'];

            $startTimeA = (float)$startTimeA;
            $startTimeB = (float)$startTimeB;


            $endTimeA = (float)$endTimeA;
            $endTimeB = (float)$endTimeB;

            return $startTimeA === $startTimeB ? ($endTimeA < $endTimeB ? -1 : 1) :
            ($startTimeA < $startTimeB ? -1 : 1);
        }
    );
}

// Default back to mobile after user visits here again
unset($_SESSION['forceFull']);

$smarty->assign('season', $season);
$smarty->assign('courses', $coursesByDay);
$smarty->assign('availableSeasons', $allSeasons);
$smarty->assign('netId', $netId);

// while ($cj->nextItem()) {
    // print_r($cj->info);
// }

// print_r($cj);

$smarty->display('Timetable.tpl');
