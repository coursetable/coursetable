<?php
require_once 'includes/ProjectCommon.php';
header('Content-Type: application/json');

$netId = ProjectCommon::casAuthenticate();

$courseDb = ProjectCommon::createYaleAdvancedOciMysqli();
$evalDb = $courseDb;

// Get the subject and number
$courseIds = $_GET['evaluationIds'];

$evaluationColumns = array('id', 'title', 'season', 'enrollment');

$evalCourseIdBySeasonCrn = [];
if (!empty($courseIds)) {
    $ec = new EvaluationCourse($evalDb);
    $ec->setColumns($evaluationColumns)
        ->addCond('id', $courseIds)
        ->addOrderBy('id', 'DESC')
        ->select();

    $courses = $ec->getResults('id');
}

$courseIds = array_keys($courses);
$questionIds = [];

/**
 * Add a bunch of 'OR' conditions, one for each season/CRN pair,
 * to a query
 *
 * @param $obj                      SQLTableBase-based object to add conditions
 * @param $evalCourseIdBySeasonCrn  course ID for season and CRN
 */
function addCrnSeasonCond(&$obj, $evalCourseIdBySeasonCrn)
{
    $i = 1;
    foreach ($evalCourseIdBySeasonCrn as $season => $rest) {
        foreach ($rest as $crn => $_) {
            $obj->addCond('season', $season, '=', 'AND' . $i);
            // AND
            $obj->addCond('oci_id', $crn, '=', 'AND' . $i);
            $i++;
        }
        // OR
    }
}

if (!empty($courseIds)) {
    // Get names
    $ecn = new EvaluationCourseName($evalDb);
    $ecn->setColumns(array('course_id', 'subject', 'number', 'section', 'season', 'crn'))
        ->addCond('course_id', $courseIds)
        ->select();

    while ($ecn->nextitem()) {
        $id = $ecn->info['course_id'];
        $courses[$id]['names'][] = array(
            'subject' => $ecn->info['subject'],
            'number' => $ecn->info['number'],
            'section' => $ecn->info['section']
        );
        $season = $ecn->info['season'];
        $crn = $ecn->info['crn'];
        $evalCourseIdBySeasonCrn[$season][$crn] = $id;
    }

    // Get professors (map them back from the courses)
    $cp = new CourseProfessor($courseDb);
    $cp->setColumns(array('season', 'oci_id', 'professor'))
        ->addGroupBy('course_id')
        ->addGroupBy('professor');
    addCrnSeasonCond($cp, $evalCourseIdBySeasonCrn);
    $cp->select();

    while ($cp->nextitem()) {
        $id = $evalCourseIdBySeasonCrn[$cp->info['season']][$cp->info['oci_id']];
        $courses[$id]['professors'][] = $cp->info['professor'];
    }

    // Get courses for long_title
    $c = new Course($courseDb);
    $c->setColumns(array('id', 'long_title', 'season', 'oci_id'));
    addCrnSeasonCond($c, $evalCourseIdBySeasonCrn);
    $c->select();

    while ($c->nextItem()) {
        $id = $evalCourseIdBySeasonCrn[$c->info['season']][$c->info['oci_id']];
        $courses[$id]['long_title'] = $c->info['long_title'];
    }

    $commentTypesMap = EvaluationConstants::$commentTypesMap;

    $eco = new EvaluationComment($evalDb);
    $eco->setColumns(array('course_id', 'question_id', 'comment'))
        ->addCond('course_id', $courseIds)
        ->select();
    while ($eco->nextItem()) {
        $id = $eco->info['course_id'];
        $questionId = $eco->info['question_id'];
        if (isset($commentTypesMap[$questionId])) {
            $type = $commentTypesMap[$questionId];
            $courses[$id]['comments'][$type][] = $eco->info['comment'];
        }
    }

    // Get ratings for the evaluations
    $ratingTypesMap = EvaluationConstants::$ratingTypesMap;
    $er = new EvaluationRatings($evalDb);
    $er->setColumns(array('course_id', 'question_id', 'counts'))
        ->addCond('course_id', $courseIds)
        ->select();
    while ($er->nextItem()) {
        $id = $er->info['course_id'];
        $questionId = $er->info['question_id'];
        if (isset($ratingTypesMap[$questionId])) {
            $type = $ratingTypesMap[$questionId];
            $courses[$id]['ratings'][$type] = json_decode($er->info['counts'], true);
        }
    }
}

echo json_encode([
    'success' => true,
    'data' => $courses,
]);
