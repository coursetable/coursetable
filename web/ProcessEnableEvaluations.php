<?php
require_once 'includes/ProjectCommon.php';

$mysqli = ProjectCommon::createYalePlusMysqli();

// Force login
$netId = ProjectCommon::casAuthenticate();

// Check if student's tried too many times already
$sbs = StudentBluebookSetting::findOrCreate($mysqli, $netId, ['challengeTries', 'evaluationsEnabled']);

if ($sbs->info['challengeTries'] >= 10) {
    echo json_encode(
        array(
        'success' => false,
        'messages' => array('You\'ve tried the challenges too many times! Please wait a week ' .
            'or <a href="mailto:peter@yaleplus.com">email us</a>')
        )
    );
    exit;
}

$ratings = array_filter((array)$_POST['ratings']);
if (count($ratings) < 3) {
    echo json_encode(
        array(
        'success' => false,
        'messages' => array('Please answer all the challenges with non-zero answers')
        )
    );
    exit;
}

// Try the hash
if (Challenge::checkAnswer($ratings, $_POST['salt'], $_POST['answer'])) {
    $sbs->setInfo('challengeTries', 0);
    $sbs->setInfo('evaluationsEnabled', 1);
    $sbs->commit();

    echo json_encode(
        array(
        'success' => true,
        'messages' => array('Correct! <a href="/Table">Start using CourseTable now</a>')
        )
    );
} else {
    echo json_encode(
        array(
        'success' => false,
        'messages' => array('Your answers weren\'t correct! Please try again. You have a limited number of tries.')
        )
    );

    $sbs->setInfo('challengeTries', $sbs->info['challengeTries'] + 1);
    $sbs->commit();

    exit;
}
