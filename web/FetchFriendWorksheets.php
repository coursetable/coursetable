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
    $student->retrieve('netId', $netId, array('facebookId'));
    if (empty($student->info['facebookId'])) {
        echo json_encode(
            array(
            'success' => false,
            'message' => 'You must link your Facebook account first'
            )
        );
        return false;
    }

    return true;
}

/**
 * Finds the users's friends who are using the service.
 * @param $netId
 * @param $netIdsToNames  array of string => string mapping NetIDs to names
 * @return array of string  Friend NetIDs
 */
function findFriendNetIds($netId, &$netIdsToNames)
{
    global $yalePlusMysqli;
    $studentFacebookFriend = new StudentFacebookFriend($yalePlusMysqli);
    $studentFacebookFriend->setColumns(array('name', 'friendNetId'))
        ->addCond('netId', $netId)
        ->select();

    $friendNetIds = array();
    while ($studentFacebookFriend->nextItem()) {
        $netId = $studentFacebookFriend->info['friendNetId'];
        $friendNetIds[] = $netId;
        if ($netIdsToNames !== null) {
            $netIdsToNames[$netId] = $studentFacebookFriend->info['name'];
        }
    }
    return $friendNetIds;
}

/**
 * Get the worksheets for all your friends.
 * @param $friendNetIds     array of string netIDs to look for
 * @param $netIdsToNames    array of string => string mapping NetIDs to names
 * @return array of array in form 'net_id' => list of oci_ids
 */
function retrieveFriendWorksheets($friendNetIds, $netIdsToNames, $season = null)
{
    global $mysqli;

    if (empty($friendNetIds)) {
        return array();
    }

    $worksheetCourse = new MysqlTable($mysqli, 'worksheet_courses');
    $worksheetCourse->setColumns(array('net_id', 'oci_id'))
        ->addCond('net_id', $friendNetIds);
    if (isset($season)) {
        $worksheetCourse->addCond('season', $season);
    }
    $worksheetCourse->select();

    $friendCourses = array();
    while ($worksheetCourse->nextItem()) {
        $netId = $worksheetCourse->info['net_id'];
        $ociId = $worksheetCourse->info['oci_id'];
        $name = $netIdsToNames[$netId];

        if (!isset($friendCourses[$name])) {
            $friendCourses[$name] = array();
        }
        $friendCourses[$name][] = $ociId;
    }

    ksort($friendCourses);
    return $friendCourses;
}

/**
 * Constructs the JSON response with the data.
 * @param $friendCourses
 * @return bool
 */
function constructJsonResponse($friendCourses)
{
    echo json_encode(
        array(
        'success' => true,
        'data' => $friendCourses
        )
    );
    return true;
}

$mysqli = ProjectCommon::createYaleAdvancedOciMysqli();
$yalePlusMysqli = ProjectCommon::createYalePlusMysqli();

if (isset($argv)) {
    $netId = 'hzy2';
} else {
    $netId = ProjectCommon::casAuthenticate(false);
}
$season = $_GET['season'];

$log = ProjectCommon::createLog('FetchFriendWorksheets.txt');

$success = checkArguments($netId);

if (!$success) {
    exit;
}

$netIdsToNames = array();
$friendNetIds = findFriendNetIds($netId, $netIdsToNames);
$friendWorksheets = retrieveFriendWorksheets($friendNetIds, $netIdsToNames, $season);
constructJsonResponse($friendWorksheets);
