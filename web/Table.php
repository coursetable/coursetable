<?php
require_once 'includes/ProjectCommon.php';

$smarty = ProjectCommon::createSmarty();

// Logout if needed
if (isset($_GET['logout'])) {
    ProjectCommon::casLogout();
}

$netId = ProjectCommon::casAuthenticate();


$log = ProjectCommon::createLog('NetIds.txt');

$yalePlusMysqli = ProjectCommon::createYalePlusMysqli();
$yaleAdvancedOciMysqli = ProjectCommon::createYaleAdvancedOciMysqli();

// Disconnect Facebook if requested
if (isset($_GET['disconnect_facebook'])) {
    $student = new Student($yalePlusMysqli);
    $student->setInfoArray(
        array(
            'netId' => $netId,
            'facebookId' => 0,
            'facebookDataJson' => ''
        )
    );
    $friends = new StudentFacebookFriend($yalePlusMysqli);
    $friends->setInfoArray(
        array(
            'id' => 0,
            'netid' => $netId,
            'name' => '',
            'facebookId' => 0
        )
    );
    if (!$student->commit()) {
        $log->write("facebook disconnect failed for {$netid} on: {$student->lastquery}", e_error, 0);
    }
}

if (ProjectCommon::getStudentAuthorizationState($netId, $yalePlusMysqli) !== 'authorized' &&
    !isset($_GET['noFacebook'])) {
    header('Location: /');
    $log->write("{$netId} attempted but not in Facebook", E_NOTICE, false);
    exit;
}

$smarty->assign('title', 'CourseTable');

$keyValueStore = new MysqlTable($yaleAdvancedOciMysqli, 'key_value_store');
$keyValueStore->retrieve('key', 'Last updated', array('value'));
$lastUpdatedTime = strtotime($keyValueStore->info['value']);
$lastUpdatedString = date('n/j', $lastUpdatedTime);

// Ensure that the student is of Yale College
// Side-effect: fetches the Student data so that it's 100% in DB

$student = new Student($yalePlusMysqli);
$student->retrieve('netId', $netId, array('netId', 'facebookId', 'coursesTakenPrompted'));

/**
if ($student->info['coursesTakenPrompted'] === 'Not prompted') {
    header('Location: /UpdateCoursesTaken.php');
    exit;
}
*/

$sbsColumns = array('seenDisclaimer', 'shareCoursesEnabled', 'noticeLastSeen', 'timesNoticeSeen', 'viewException', 'facebookLastUpdated', 'evaluationsEnabled');
$sbs = StudentBluebookSetting::findOrCreate($yalePlusMysqli, $netId, $sbsColumns);
$sbs->setInfo('seenDisclaimer', 1); // If they got here they've seen the disclaimer

$showNotice = $sbs->info['timesNoticeSeen'] == 0 || isset($_GET['showNotice']); //time() - $sbs->info['noticeLastSeen'] > 60 * 60 * 24;
if ($showNotice) {
    $sbs->setInfo('timesNoticeSeen', $sbs->info['timesNoticeSeen'] + 1);
    $sbs->setInfo('noticeLastSeen', time());
}

$sbs->commit();

$log->write($netId, E_NOTICE, false);

$shareCoursesEnabled = !empty($student->info['facebookId']) && (int) $sbs->info['shareCoursesEnabled'] === 1;

// Seasons: which are available, which to display
$availableSeasons = ProjectCommon::fetchAllSeasons();

$urlParts = explode('/', $_SERVER['REQUEST_URI']);

// Originally: /Bluebook[[/semester]/course]
// Parts:
// 0: ''
// 1: 'Bluebook'
// 2: course or semester
// 3: course
$season = ProjectCommon::fetchCurrentSeason();
foreach ($urlParts as $part) {
    $part = preg_replace('/\?.*/', '', $part); // Replace any querystrings
    if (in_array($part, $availableSeasons)) {
        $season = $part;
        break;
    }
}

$smarty->assign('updated', $lastUpdatedString);
$smarty->assign('season', $season);
$smarty->assign('facebookDataRetrieved', $shareCoursesEnabled);
$smarty->assign(
    'facebookNeedsUpdate',
    $sbs->info['facebookLastUpdated'] <
    time() - DAYS_BETWEEN_FACEBOOK_UPDATES * 24 * 60 * 60
);
$smarty->assign('showNotice', $showNotice);
$smarty->assign('availableSeasons', $availableSeasons);
$smarty->assign('coursesTakenPrompted', $student->info['coursesTakenPrompted'] ?? false);
$smarty->assign('netId', $netId);
$smarty->assign('evaluationsEnabled', $sbs->info['evaluationsEnabled'] || IS_DEVELOPMENT);

$forceFull = false;
if (isset($_GET['forceFull']) || isset($_SESSION['forceFull'])) {
    // Force not switching to mobile
    $_SESSION['forceFull'] = true;
    $forceFull = true;
}
$smarty->assign('forceFull', $forceFull);

if (isset($_GET['debug']) || IS_DEVELOPMENT) {
    $smarty->display('BluebookPerUser.tpl');
} else {
    $smarty->display('BluebookPerUserCompressed.tpl');
}
