<?php
require_once 'includes/ProjectCommon.php';

/**
 * Checks that the environment is good and that the student had linked Facebook.
 * @param $netId    string
 * @return bool
 */
function checkArguments($netId, $courses)
{
    global $log;

    if ($netId === null) {
        echo json_encode(
            array(
            'success' => false,
            'message' => 'You are not logged in via CAS; try refreshing the page to log in again'
            )
        );
        return false;
    }
    
    $coursesValid = true;
    if (!is_array($courses)) {
        $coursesValid = false;
    }
    
    $coursesCount = 0;
    if ($coursesValid) {
        foreach ($courses as $season => $courseCodes) {
            $year = (int) ($season / 100);
            $semester = (int) ($season % 100);
            if ($year <= 2009 || $year > (int) date('Y') + 1 || $semester < 1 || $semester > 3) {
                $coursesValid = false;
                break;
            }
            
            foreach ($courseCodes as $courseCode) {
                if (preg_match('@^([A-Z&]{3,4}) ([A-Z]?[0-9]{2,5}[A-Z]?)$@', $courseCode) !== 1) {
                    $coursesValid = false;
                    break;
                }
                
                ++$coursesCount;
            }
            
            if (!$coursesValid) {
                break;
            }
        }
    }
    
    $coursesValid = $coursesCount <= 80;
    
    if (!$coursesValid) {
        echo json_encode(
            array(
            'success' => false,
            'message' => 'The courses you sent have errors'
            )
        );
        $log->write("{$netId} failed with courses " . json_encode($courses), E_WARNING, false);
        
        return false;
    }

    return true;
}


$log = ProjectCommon::createLog('SendCoursesTaken.txt');

if (isset($argv)) {
    $netId = 'hzy2';
} else {
    $netId = ProjectCommon::casAuthenticate(false);
}

$courses = json_decode($_POST['courses'], true);
$success = checkArguments($netId, $courses);

if (!$success) {
    exit;
}

$mysqli = ProjectCommon::createYalePlusMysqli();

$escapedNetId = $mysqli->escape_string($netId);

$coursesTaken = new MysqlTable($mysqli, 'StudentCoursesTaken');
$coursesTaken->addCond('netId', $netId);
$coursesTaken->delete();

$student = new MysqlTable($mysqli, 'Students');
$student->setInfo('netId', $netId);
if (!empty($courses)) {
    $student->setInfo('coursesTakenPrompted', 'Shared');
} else {
    $student->setInfo('coursesTakenPrompted', 'Skipped');
}
$student->commit();

foreach ($courses as $season => $courseList) {
    foreach ($courseList as $course) {
        list($subject, $number) = explode(' ', $course);
        $coursesTaken = new MysqlTable($mysqli, 'StudentCoursesTaken');
        $coursesTaken->setInfoArray(
            array('netId' => $netId, 'subject' => $subject,
                                     'number' => $number, 'season' => $season)
        );
        $coursesTaken->commit();
    }
}

echo json_encode(
    array(
    'success' => true,
    'message' => "The courses that you've taken have been updated"
    )
);
