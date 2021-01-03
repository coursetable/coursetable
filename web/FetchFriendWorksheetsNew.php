<?php
require_once 'includes/ProjectCommon.php';

/**
 * Checks that the environment is good and that the student had linked Facebook.
 * @param $netId    string
 * @return bool
 */
function checkArguments($netId)
{
    global $yalePlusMysqli;

    if ($netId === null) {
        echo json_encode(
            array(
            'success' => false,
            'message' => 'You are not logged in via CAS; try refreshing the page to log in again'
            )
        );
        return false;
    }

    $student = new Student($yalePlusMysqli);
    $student->retrieve('netId', $netId, array('facebookId', 'coursesTakenPrompted'));
    if (empty($student->info['facebookId'])) {
        echo json_encode(
            array(
            'success' => false,
            'message' => 'You must link your Facebook account first'
            )
        );
        return false;
    }

    return $student;
}

/**
 * Finds the users's friends who are using the service.
 * @param $netId
 * @param $netIdsToNames  array of string => string mapping NetIDs to names
 * @return array of string  Friend NetIDs
 */
function findFriendNetIds($netId, &$friendInfo)
{
    global $yalePlusMysqli;
    $studentFacebookFriend = new StudentFacebookFriend($yalePlusMysqli);
    $studentFacebookFriend->setColumns(array('name', 'facebookId', 'friendNetId'))
        ->addCond('netId', $netId)
        ->select();

    $friendNetIds = array();
    while ($studentFacebookFriend->nextItem()) {
        $netId = $studentFacebookFriend->info['friendNetId'];
        $friendNetIds[] = $netId;
        if ($friendInfo !== null) {
            $friendInfo[$netId] = array(
                'name' => $studentFacebookFriend->info['name'],
                'facebookId' => $studentFacebookFriend->info['facebookId']
            );
        }
    }
    return $friendNetIds;
}

/**
 * Get the worksheets for all your friends.
 * @param $friendNetIds     array of string netIDs to look for
 * @return array of array in form 'net_id' => list of oci_ids
 */
function retrieveFriendWorksheets($friendNetIds, $season = null)
{
    global $mysqli;

    if (empty($friendNetIds)) {
        return array();
    }

    $worksheetCourse = new MysqlTable($mysqli, 'worksheet_courses');
    $worksheetCourse->setColumns(array('net_id', 'season', 'oci_id'))
        ->addCond('net_id', $friendNetIds);
    if (isset($season)) {
        $worksheetCourse->addCond('season', $season);
    }
    $worksheetCourse->select();

    $friendCourses = array();
    while ($worksheetCourse->nextItem()) {
        $netId = $worksheetCourse->info['net_id'];
        $courseSeason = $worksheetCourse->info['season'];
        $ociId = $worksheetCourse->info['oci_id'];

        if (!isset($friendCourses[$netId])) {
            $friendCourses[$netId] = array();
        }
        $friendCourses[$netId][] = array($courseSeason, $ociId);
    }

    ksort($friendCourses);
    return $friendCourses;
}

/**
 * Get the courses that each friend has taken in the past.
 * @param $friendNetIds     array of string netIDs to look for
 * @return array of array 'net_id' => array(array('CPSC', 112, 2013, 'Fall'), ...)
 */
function retrieveFriendPastCourses($friendNetIds)
{
    global $yalePlusMysqli;
    $coursesTaken = new MysqlTable($yalePlusMysqli, 'StudentCoursesTaken');
    $coursesTaken->setColumns(array('netId', 'subject', 'number', 'season'))
        ->addCond('netId', $friendNetIds)
        ->select();
    
    $courses = array();
    
    while ($coursesTaken->nextItem()) {
        $netId = $coursesTaken->info['netId'];
        if (!isset($courses[$netId])) {
            $courses[$netId] = array();
        }
        
        $courses[$netId][] = array(
            $coursesTaken->info['subject'],
            $coursesTaken->info['number'],
            $coursesTaken->info['season']
        );
    }
    
    return $courses;
}
 
/**
 * Print the JSON response given the response components.
 */
function printJsonResponse($friendCourses, $friendInfo, $pastCourses)
{
    echo json_encode(
        array(
        'success' => true,
        'worksheets' => $friendCourses,
        'friendInfo' => $friendInfo,
        'pastCourses' => $pastCourses
        )
    );
    return true;
}

$mysqli = ProjectCommon::createYaleAdvancedOciMysqli();
$yalePlusMysqli = ProjectCommon::createYalePlusMysqli();

if (isset($argv)) {
    $netId = 'hzy2';
} else {
    $netId = $_GET['id'];
}
$season = $_GET['season'];

$log = ProjectCommon::createLog('FetchFriendWorksheets.txt');

$student = checkArguments($netId);

if (!$student) {
    exit;
}

$friendInfo = array();
$friendNetIds = findFriendNetIds($netId, $friendInfo);
$friendWorksheets = retrieveFriendWorksheets($friendNetIds, $season);
$pastCourses = null;
if ($student->info['coursesTakenPrompted'] == 'Shared') {
    $pastCourses = retrieveFriendPastCourses($friendNetIds);
}
printJsonResponse($friendWorksheets, $friendInfo, $pastCourses);
