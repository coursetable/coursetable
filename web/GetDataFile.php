<?php
require_once 'includes/ProjectCommon.php';

// Gets a data file for a season
if (isset($_SERVER['HTTP_REFERER']) && strpos($_SERVER['HTTP_REFERER'], 'NonYale') !== false) {
    $netId = 'zpx2';
} else {
    $netId = ProjectCommon::getID();
}

$mysqli = ProjectCommon::createYalePlusMysqli();
$sbs = new StudentBluebookSetting($mysqli);
$sbs->retrieve('netId', $netId, ['evaluationsEnabled']);

if ($sbs->info['evaluationsEnabled'] || IS_DEVELOPMENT) {
    $dataFile = $filePath . '/gen/json/data_with_evals_' . $_GET['season'] . '.json';
    $mtime = filemtime($dataFile);
    $etag = md5($mtime . $netId);

    $mtimeString = gmdate('D, d M Y H:i:s ', $mtime) . 'GMT';
    $expiresString = gmdate('D, d M Y H:i:s ', $mtime + 86400) . 'GMT';

    // From http://stackoverflow.com/a/1973016
    $ifModifiedSince = isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) ? $_SERVER['HTTP_IF_MODIFIED_SINCE'] : false;
    $ifNoneMatch = isset($_SERVER['HTTP_IF_NONE_MATCH']) ? $_SERVER['HTTP_IF_NONE_MATCH'] : false;

    header('Cache-Control: must-revalidate');
    if ($ifNoneMatch === $etag || $ifModifiedSince === $mtimeString) {
        header('HTTP/1.1 304 Not Modified');
        exit();
    }

    // We have to duplicate all the caching headers
    header('Content-Type: application/json');
    header('Last-Modified: ' . $mtimeString);
    header('Expires: ' . $expiresString);
    header('ETag: ' . $etag);

    readfile($dataFile);
} else {
    header('HTTP/1.0 403 Forbidden');
}
