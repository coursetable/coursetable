<?php
require_once 'includes/ProjectCommon.php';

/**
 * Checks that the user is logged in and has passed an OCI ID
 * @param $netId    string or null
 * @param $ociId    string
 * @param $action   string
 * @return bool
 */
function checkArguments($netId, $ociId, $action, $season)
{
    if (empty($netId)) {
        echo json_encode(
            array(
            'success' => false,
            'message' => 'You are not logged in via CAS; try refreshing the page to log in again'
            )
        );
        return false;
    }

    if (!in_array($action, array('add', 'remove', 'get'))) {
        echo json_encode(
            array(
            'success' => false,
            'message' => 'The action must be one of add, remove, or get'
            )
        );
        return false;
    }

    if (($action === 'add' || $action === 'remove') && (empty($ociId) || empty($season))) {
        echo json_encode(
            array(
            'success' => false,
            'message' => 'No course or season was selected to add or remove!'
            )
        );
        return false;
    }

    return true;
}

/**
 * Checks that the course with the given ociId exists in the database
 * @param $ociId    string; must be non-empty
 * @return bool     Success
 */
function checkCourseExists($ociId)
{
    global $log, $mysqli;
    /*
    $course = new Course($mysqli);
    $course->retrieve('oci_id', $ociId, array('id'));
    if (empty($course->info['id'])) {
        echo json_encode(array(
            'success' => false,
            'message' => "You're trying to add a course that doesn't exist"
        ));
        $log->write("Add {$ociId} non-existent", E_WARNING, 0);
        return false;
    }
    */
    return true;
}

/**
 * Retrieves and outputs the worksheet's OCI ID and outputs an error if it's a problem.
 * @param $netId
 * @return array    Array of the user's OCI ID's
 */
function retrieveWorksheetOciIds($netId, $season = null)
{
    global $mysqli;
    $worksheet = new MysqlTable($mysqli, 'worksheet_courses');
    $worksheet->setColumns(array('oci_id'));
    $worksheet->addCond('net_id', $netId);
    if (isset($season)) {
        $worksheet->addCond('season', $season);
    }
    $worksheet->addOrderBy('oci_id', 'ASC');
    $worksheet->select();

    $worksheetData = array();
    while ($worksheet->nextItem()) {
        $worksheetData[] = $worksheet->info['oci_id'];
    }

    return $worksheetData;
}

/**
 * Actually add the course to the worksheet.
 * @param $netId
 * @param $ociId
 * @return bool     Success
 */
function addToWorksheet($netId, $ociId, $season)
{
    global $mysqli, $log;
    $worksheet = new MysqlTable($mysqli, 'worksheet_courses');
    $worksheet->setInfoArray(array('net_id' => $netId, 'oci_id' => $ociId, 'season' => $season));
    if (!$worksheet->commit()) {
        echo json_encode(
            array(
            'success' => false,
            'message' => "Something went wrong! It's been logged and we'll be looking into it",
            )
        );
        $log->write("Add to database {$netId} -> {$ociId} failed: {$worksheet->lastQuery}", E_ERROR, 0);
        return false;
    }

    echo json_encode(
        array(
        'success' => true,
        'message' => 'Successfully added course to worksheet',
        'data' => retrieveWorksheetOciIds($netId, $season)
        )
    );
    return true;
}

/**
 * Removes a course from the worksheet.
 * @param $netId
 * @param $ociId
 * @return bool     Success
 */
function removeFromWorksheet($netId, $ociId, $season)
{
    global $mysqli, $log;
    $worksheet = new MysqlTable($mysqli, 'worksheet_courses');
    $worksheet->addCond('oci_id', $ociId)
        ->addCond('net_id', $netId)
        ->addCond('season', $season);
    if (!$worksheet->delete()) {
        echo json_encode(
            array(
            'success' => false,
            'message' => "Something went wrong! It's been logged and we'll be looking into it"
            )
        );
        $log->write("Delete from database {$netId} -> {$ociId} failed: {$worksheet->lastQuery}", E_ERROR, 0);
        return false;
    }

    echo json_encode(
        array(
        'success' => true,
        'message' => 'Successfully removed course from worksheet',
        'data' => retrieveWorksheetOciIds($netId, $season)
        )
    );
    return true;
}

function retrieveWorksheetOciIdsJson($netId, $season)
{
    echo json_encode(
        array(
        'success' => true,
        'data' => retrieveWorksheetOciIds($netId, $season)
        )
    );
    return true;
}

$log = ProjectCommon::createLog('WorksheetAddRemove');
$mysqli = ProjectCommon::createYaleAdvancedOciMysqli();

$netId = ProjectCommon::casAuthenticate(false);
$action = (string) $_GET['action'];
$season = $_GET['season'];

$success = checkArguments($netId, $ociId, $action, $season)
    && ($action == 'get' || checkCourseExists($ociId));

if ($success) {
    if ($action === 'add') {
        $ociId = (string) $_GET['ociId'];
        addToWorksheet($netId, $ociId, $season);
    } elseif ($action === 'remove') {
        $ociId = (string) $_GET['ociId'];
        removeFromWorksheet($netId, $ociId, $season);
    } else {
        retrieveWorksheetOciIdsJson($netId, $season);
    }
}
