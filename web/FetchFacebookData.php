<?php
require_once 'includes/ProjectCommon.php';

/**
 * Checks that the environment is good.
 * @param $netId    string
 * @param $fb       Facebook
 * @return bool
 */
function checkArguments($netId, $fb)
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

    $helper = $fb->getJavaScriptHelper();
    $accessToken = $helper->getAccessToken();

    if (!isset($accessToken)) {
        echo json_encode([
            'success' => false,
            'message' => 'You are not logged in to Facebook; try logging in first'
        ]);
        return false;
    } else {
        $_SESSION['fb_access_token'] = $accessToken;
        try {
            // Proceed knowing you have a logged in user who's authenticated.
            $user_profile = $fb->get('/me?fields=id', $accessToken);
        } catch (Facebook\Exceptions\FacebookResponseException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'You are not logged in to Facebook; try logging in first',
                'loginUrl' => $helper->getLoginUrl()
            ]);
            return false;
        }
    }

    $s = new Student($yalePlusMysqli);
    $s->retrieve('netId', $netId, array('facebookId'));

    $sbs = new StudentBluebookSetting($yalePlusMysqli);
    $sbs->retrieve('netId', $netId, array('facebookLastUpdated'));
    if ($sbs->hasResults) {
        $sbs->setInfo('shareCoursesEnabled', 1);
        $sbs->commit();

        if ($sbs->info['facebookLastUpdated'] >
                time() - DAYS_BETWEEN_FACEBOOK_UPDATES * 24 * 60 * 60 &&
                !isset($_GET['force']) && !empty($s->info['facebookId'])) {
            // Don't retrieve if in last 30 days
            echo json_encode(
                array(
                'success' => true,
                'message' => 'Your account has been updated less than ' .
                    DAYS_BETWEEN_FACEBOOK_UPDATES .
                    ' days ago; not doing it again'
                )
            );
            return false;
        }
    }

    return $accessToken;
}

/**
 * Retrieve all Facebook friends for a given user by going through pagination
 *
 * @param $fb                   Facebook object
 * @param $accessToken          Facebook access token
 */
function getAllFriends($fb, $accessToken)
{
    $res = $fb->get('/me/friends?fields=id,name,first_name,middle_name,last_name&limit=500', $accessToken);
    $edge = $res->getGraphEdge();

    $friends = [];
    $i = 0;
    while (isset($edge)) {
        foreach ($edge as $user) {
            $friends[] = $user->asArray();
        }

        $edge = $fb->next($edge);
    }

    return $friends;
}

/**
 * Retrieve Facebook data about your friends and yourself and saves the data.
 * @param $netId                string; Your own NetID.
 * @param $fb                   Facebook object
 * @param $shareCoursesEnabled  bool; whether to share courses or just get data
 * @param $accessToken          Facebook access token
 * @return bool
 */
function retrieveFacebookData($netId, $fb, $shareCoursesEnabled, $accessToken)
{
    global $yalePlusMysqli, $log;

    $res = $fb->get('/me?fields=id,name,first_name,middle_name,last_name', $accessToken);
    $userData = $res->getGraphObject()->asArray();

    $student = new Student($yalePlusMysqli);
    $student->setInfoArray(
        array(
        'netId' => $netId,
        'facebookId' => $userData['id'],
        'facebookDataJson' => json_encode($userData)
        )
    );

    if (!$student->commit()) {
        echo json_encode(
            array(
            'success' => false,
            'message' => 'Storing user data failed; the error has been logged',
            )
        );
        $log->write("Save user data failed for {$netId} on: {$student->lastQuery}", E_ERROR, 0);
        return false;
    }

    $sbs = new StudentBluebookSetting($yalePlusMysqli);
    $sbs->setInfoArray(
        array(
        'netId' => $netId,
        'facebookLastUpdated' => time()
        )
    );
    if (!$sbs->commit()) {
        $log->write("Save user Facebook last updated time failed for {$netId} on: {$sbs->lastQuery}");
    }

    $friends = getAllFriends($fb, $accessToken);
    $yalePlusMysqli->autocommit(false); // Speed optimization: otherwise, this takes 10 seconds

    foreach ($friends as &$friend) {
        $studentFacebookFriend = new StudentFacebookFriend($yalePlusMysqli);
        $studentFacebookFriend->setInfoArray(array(
            'netId' => $netId,
            'name' => $friend['name'],
            'facebookId' => $friend['id']
        ));

        if (!$studentFacebookFriend->commit()) {
            echo json_encode(
                array(
                'success' => false,
                'message' => 'Storing friend data failed; the error has been logged'
                )
            );
            $log->write("Save friend data failed for {$netId} " .
                "on {$friend['id']}: {$studentFacebookFriend->lastQuery}", E_ERROR, 0);
            return false;
        }
    }

    if (!$yalePlusMysqli->commit()) {
        echo json_encode(
            [
                'success' => false,
                'message' => 'Storing all friends data failed; error has been logged'
            ]
        );
        $log->write("Commit failed for {$netId}: " . $mysqli->error, E_ERROR, 1);
        return false;
    }
    
    $yalePlusMysqli->autocommit(true);

    return count($friends);
}

/**
 * Displays a message indicating everything's good.
 * @return bool
 */
function displaySuccessMessage($friendCount)
{
    echo json_encode(
        array(
        'success' => true,
        'message' => 'Storing Facebook data succeeded',
        'friendCount' => $friendCount
        )
    );
    return true;
}

header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

$yalePlusMysqli = ProjectCommon::createYalePlusMysqli();

$netId = ProjectCommon::casAuthenticate(false);
session_write_close(); // Allows other PHP requests from same NetID to be served while this script runs a long time
$fb = ProjectCommon::createFacebook();
$log = ProjectCommon::createLog('FetchFacebookData.txt');

$mode = isset($_GET['mode']) ? $_GET['mode'] : '';
$shareCoursesEnabled = $mode !== 'loginOnly';

$accessToken = checkArguments($netId, $fb);
if ($accessToken) {
    $friendCount = retrieveFacebookData($netId, $fb, $shareCoursesEnabled, $accessToken);
    if ($friendCount !== false) {
        displaySuccessMessage($friendCount);
    }
}
