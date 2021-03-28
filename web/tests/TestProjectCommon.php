<?php
require_once __DIR__ . '/../includes/ProjectCommon.php';

if (php_sapi_name() !== 'cli') {
    exit;
}

function testFetchAllSeasons()
{
    $allSeasons = ProjectCommon::fetchAllSeasons();
    assert(in_array('201601', $allSeasons));
    echo "All seasons\n";
    print_r($allSeasons);
    echo "\n";
}

function testFetchCurrentSeason()
{
    $currentSeason = ProjectCommon::fetchCurrentSeason();
    echo "Current season\n";
    var_dump($currentSeason);
    echo "\n";
}

function testFetchTextbooksTerm()
{
    $textbooksTerm = ProjectCommon::fetchTextbooksTerm();
    echo "Textbooks term\n";
    var_dump($textbooksTerm);
    echo "\n";
}

testFetchAllSeasons();
testFetchCurrentSeason();
testFetchTextbooksTerm();
