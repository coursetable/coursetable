<?php
require_once 'includes/ProjectCommon.php';

$netId = ProjectCommon::casAuthenticate();
$smarty = ProjectCommon::createSmarty();

$mysqli = ProjectCommon::createYalePlusMysqli();
$ociMysqli = ProjectCommon::createYaleAdvancedOCIMysqli();

// Check if we are already enabled. If we are, redirect to table
$sbs = StudentBluebookSetting::findOrCreate($mysqli, $netId);
if ($sbs->info['evaluationsEnabled']) {
    header('Location: /Table');
    exit;
}

// Get 3 courses with lots of evaluations recently
$season = ProjectCommon::fetchCurrentSeason();
$year = (int) substr($season, 0, 4);
$month = substr($season, 4, 2);

$minSeason = ($year - 2) . '' . $month;

$eval = new EvaluationCourse($ociMysqli);
$eval->setColumns(['id', 'counts', 'subject', 'number', 'section', 'season', 'crn'])
    ->addCond('enrollment', 100, '>=')
    ->addCond('number', '500', '<') // Only undergrad
    ->addCond('question_id', ['YC006', 'YC306', 'YC404'])
    ->addCond('season', $minSeason, '>=')
    ->addGroupBy('id')
    ->addGroupBy('question_id')
    ->select();
$evals = array_filter($eval->getResults(), function ($evaluation) {
    $counts = json_decode($evaluation['counts'], true);
    $goodCount = $counts[2] ?? 0;
    return $goodCount > 10;
});
shuffle($evals);

// Select 3
$courses = array_slice($evals, 0, 3);
$counts = [];
foreach ($courses as &$course) {
    $courseCounts = json_decode($course['counts'], true);
    $counts[] = $courseCounts[2];
}
list($answer, $salt) = Challenge::encodeAnswer($counts);

$smarty->assign('answerHash', $answer);
$smarty->assign('answerSalt', $salt);
$smarty->assign('challengeCourses', $courses);

$smarty->display('EnableEvaluations.tpl');
