<?php
require_once __DIR__ . '/includes/ProjectCommon.php';
require_once __DIR__ . '/GenerateDataFileLib.php';

error_reporting(E_ALL | E_STRICT);

$mysqli = ProjectCommon::createYaleAdvancedOciMysqli();

//
// This generates the plain data file without any evaluations
// based on merely the courses for a certain season
//

$valueFlags = array('--season', '--sqlite', '--out');
$booleanFlags = array('--save-to-db');
$args = ScriptUtil::processFlags($argv, $valueFlags, $booleanFlags, null);

$saveToDb = isset($args['flags']['--save-to-db']);

if (isset($args['flags']['--sqlite'])) {
    $file = $args['flags']['--sqlite'];

    $evalDb = new SQLite3($file, SQLITE3_OPEN_READONLY);
    $evalDb->busyTimeout(5000);
} else {
    $evalDb = $mysqli;
}

// Find the seasons
if (isset($args['flags']['--season'])) {
    $seasons = array($args['flags']['--season']);
} else {
    $s = new CourseName;
    $s->setColumns(array('season'))
        ->addGroupBy('season')
        ->select();
    $seasons = Base::flattenResults($s->getResults(), 'season');
}

$outputFile = $args['flags']['--out'] ?? null;
if (!isset($outputFile)) {
    echo "Usage: php GenerateDataFile.php --out OUTFILE [--season SEASON] [--sqlite SQLITE]\n";
    echo "OUTFILE can contain [season], which will be replaced by the file's season\n";
    echo "SEASON can be omitted, and we'll generate data files for every season\n";
    exit;
}


foreach ($seasons as $season) {
    echo "Generating data file for {$season}\n";
    generateDataFile(
        $season,
        $mysqli,
        $evalDb,
        str_replace('[season]', $season, $outputFile),
        $saveToDb
    );
}
