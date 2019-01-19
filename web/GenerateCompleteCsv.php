<?php
require_once 'includes/ProjectCommon.php';

/**
 * Renders a row from the given data.
 * @param $rowData          array; associative array of data in the ray
 * @param $tableHeaders     array of array; each sub-array has fields 'field' and 'title'
 * @param $fieldRenderers   array of function; renderers to transform data to a single string
 * @param $outputStream     resource; handle to file to write to
 */
function renderRowFromData(&$rowData, &$tableHeaders, &$fieldRenderers, &$outputStream)
{
    $rowFields = array();
    foreach ($tableHeaders as &$tableHeader) {
        $field = $tableHeader['field'];
        if (isset($fieldRenderers[$field])) {
            $value = $fieldRenderers[$field]($rowData, $field);
        } elseif (is_array($rowData[$field])) {
            $value = implode(', ', $rowData[$field]);
        } else {
            $value = $rowData[$field];
        }
        $rowFields[] = (string) $value;
    }
    $rowFields[] = "http://coursetable.com/Table/course/" .
        "{$rowData['subject']}_{$rowData['number']}_{$rowData['section']}";
    fputcsv($outputStream, $rowFields);
}

/**
 * Renders the CSV table to STDOUT from OCI IDs array.
 * @param $ociIds           array; values are IDs to include
 * @param $ociIdData        array; associative linking oci_id to data
 * @param $tableHeaders     array of array; each sub-array has fields 'field' and 'title'
 * @param $fieldRenderers   array of function; renderers to transform data to a single string
 * @param $outputStream     resource; handle to file to write to
 */
function renderCsvTable(&$ociIds, &$ociIdData, &$tableHeaders, &$fieldRenderers, &$outputStream)
{
    $headers = array();
    foreach ($tableHeaders as &$tableHeader) {
        $headers[] = $tableHeader['title'];
    }
    $headers[] = 'Link';
    fputcsv($outputStream, $headers);

    foreach ($ociIds as &$ociId) {
        if (!isset($ociIdData[$ociId])) {
            continue;
        }
        renderRowFromData($ociIdData[$ociId], $tableHeaders, $fieldRenderers, $outputStream);
    }
}

// Initialization with settings
$tableHeaders =  array(
    array('field' => 'row', 'title' => 'Row'),
    //array('field' => 'worksheet', 'title' => 'WS'),
    array('field' => 'subject', 'title' => 'Subject'),
    array('field' => 'number', 'title' => 'Number'),
    array('field' => 'section', 'title' => 'Section'),
    array('field' => 'title', 'title' => 'Name'),
    array('field' => 'times', 'title' => 'Times'),
    array('field' => 'num_students', 'title' => '# Students'),
    array('field' => 'same_both_average', 'title' => 'Rating'),
    array('field' => 'same_class_average', 'title' => 'Class Rating'),
    array('field' => 'same_professors_average', 'title' => 'Prof Rating'),
    array('field' => 'skills', 'title' => 'Skills'),
    array('field' => 'areas', 'title' => 'Areas'),
    array('field' => 'difficulty_average', 'title' => 'Work'),
    array('field' => 'locations_summary', 'title' => 'Location'),
    array('field' => 'professors', 'title' => 'Professors'),
    array('field' => 'exam_timestamp', 'title' => 'Exam')
);

$fieldRenderers = array();

$floatRenderer = function ($rowData, $field) {
    if (empty($rowData[$field])) {
        return '';
    }
    return round($rowData[$field], 2);
};

$fieldRenderers['times'] = function ($rowData, $field) {
    return $rowData['times']['summary'];
};

$fieldRenderers['num_students'] = function ($rowData, $field) {
    $sameBothEvaluations = $rowData['evaluations']['same_both'];
    if (!empty($sameBothEvaluations)) {
        return $sameBothEvaluations[0]['num_students'];
    }
    $sameClassEvaluations = $rowData['evaluations']['same_class'];
    if (!empty($sameClassEvaluations)) {
        return $sameClassEvaluations[0]['num_students'];
    }
    return '';
};

$fieldRenderers['exam_timestamp'] = function ($rowData, $field) {
    $examGroup = (int) $rowData['exam_group'];
    if ($examGroup === 0) {
        return '';
    } elseif ($examGroup === 1) {
        return 'TBD';
    }
    $examDate = DateTime::createFromFormat('YmdHis', $rowData['exam_timestamp']);
    return $examDate->format('jS ga');
};

$fieldRenderers['same_both_average'] = $floatRenderer;
$fieldRenderers['same_class_average'] = $floatRenderer;
$fieldRenderers['same_professors_average'] = $floatRenderer;
$fieldRenderers['difficulty_average'] = $floatRenderer;

ini_set('memory_limit', '256M');

// Actually process the data and request
$netId = ProjectCommon::casAuthenticate(true);
$season = (int)$_GET['season'];

if (!$season) {
    exit;
}

$dataFile = StudentBluebookSetting::jsonFile($netId, $season);
$data = json_decode(file_get_contents($dataFile), true);

$ociIdData = array();
$ociIds = array();
foreach ($data as $entry) {
    $ociIdData[$entry['oci_id']] = $entry;
    $ociIds[] = $entry['oci_id'];
}
unset($data);
//print_r($ociIdData);

header('Content-Encoding: UTF-8');

if (!$_GET['debug']) {
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename=Courses.csv');
}

$outputStream = fopen('php://output', 'w');
renderCsvTable($ociIds, $ociIdData, $tableHeaders, $fieldRenderers, $outputStream);
