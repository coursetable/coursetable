<?php
require_once __DIR__ . '/../web/includes/ProjectCommon.php';

$usage = <<<END
Usage: php RegenerateDataFiles.php
Regenerates all the web/gen/json/data_[season].json and
web/gen/json/data_with_eavls_[season].json files

  --no-save-to-db     Don't save output to CourseJson table

END;

$valueFlags = array();
$booleanFlags = array('--help', '--no-save-to-db', '--dev');
$letterFlags = array();

$cmd = ScriptUtil::processFlags($argv, $valueFlags, $booleanFlags, $letterFlags);

if (isset($cmd['flags']['--help'])) {
    echo $usage . "\n";
    exit;
}

$log = ProjectCommon::createLog('RegenerateDataFiles');

$seasons = ProjectCommon::fetchAllSeasons();
$dir = realpath(dirname(__FILE__));
$script = "{$dir}/../web/GenerateDataFile.php";
$scriptFlags = " --sqlite \"{$dir}/sqlite/blank.sqlite\" " . " --out \"{$dir}/../web/gen/json/data_[season].json\" ";
$evalsScriptFlags = " --out \"{$dir}/../web/gen/json/data_with_evals_[season].json\" ";

/** Get the file for a specific season */
function getFileNameForSeason($season, $eval = false) {
    global $dir;
    $evalStr = $eval ? '_with_evals' : '';
    return "{$dir}/../web/gen/json/data{$evalStr}_{$season}.json";
}


if (empty($cmd['flags']['--no-save-to-db'])) {
    $scriptFlags .= ' --save-to-db ';
}


// If we're running in Docker, we want to wait until the database
// is fully populated before running this.
// As a somewhat hack-ish workaround, wait for the table worksheet_courses
// to be created, since it's the last item in the .sql file

$mysqli = ProjectCommon::createYaleAdvancedOciMysqli();

$isDev = isset($cmd['flags']['--dev']);
if ($isDev) {
    $initialized = false;
    while (!$initialized) {
        $result = $mysqli->query('SHOW TABLES LIKE "worksheet_courses"');
        if ($result->num_rows > 0) {
            $initialized = true;
        } else {
            echo "Waiting for worksheet_courses\n";
            sleep(1);
        }
    }
}

foreach ($seasons as $season) {
    $output = '';
    $return = 0;

    if ($isDev && file_exists(getFileNameForSeason($season, false))) {
        $log->write("Skipping {$season} without evaluations: already exists");
    } else {
        $log->write("Running for {$season} without evaluations");
        $command = "php \"{$script}\" --season {$season} {$scriptFlags}";
        $log->write($command);
        exec($command, $output, $return);
        $output = implode("\n", $output);
        if ($return !== 0) {
            $log->write("Running for {$season} failed with code {$return} and output {$output}", E_ERROR);
            exit(1);
        }
    }

    if ($isDev && file_exists(getFileNameForSeason($season, true))) {
        $log->write("Skipping {$season} with evaluations: already exists");
    } else {
        $log->write("Running for {$season} with evaluations");
        $command = "php \"{$script}\" --season {$season} {$evalsScriptFlags}";
        $log->write($command);
        exec($command, $output, $return);
        $output = implode("\n", $output);
        if ($return !== 0) {
            $log->write("Running for evals {$season} failed with code {$return} and output {$output}", E_ERROR);
            exit(1);
        }
    }
}
