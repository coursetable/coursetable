<?php
require_once __DIR__ . '/../../web/libs/cas/CAS/Autoload.php'; // change path as needed

$filePath = dirname(__DIR__);
define('FILE_PATH', $filePath);
$logPath = dirname($filePath) . '/bluebook-logs';
set_include_path(".:{$filePath}:" . substr(get_include_path(), 2));

require_once __DIR__ . '/../../crawler/includes/Credentials.php';
require_once __DIR__ . '/Config.php';

// Used for seeing when Facebook should be updated by FetchFacebookData.php
// and Table.php
define('DAYS_BETWEEN_FACEBOOK_UPDATES', 1);

require_once __DIR__ . '/../libs/cas/CAS.php';

phpCAS::client(CAS_VERSION_2_0, 'secure.its.yale.edu', 443, '/cas');
phpCAS::setNoCasServerValidation();

class ProjectCommon
{
    public static function createMysqli($db)
    {
        $mysqlAccount = MYSQL_USERNAME;
        $mysqlPassword = MYSQL_PASSWORD;
        $mysqli = new mysqli(MYSQL_HOST, $mysqlAccount, $mysqlPassword, $db);

        if (mysqli_connect_errno()) {
            printf("Connect failed: %s\n", mysqli_connect_error());
            exit;
        }
        $mysqli->set_charset('utf8');
        $mysqli->query("SET NAMES 'utf8'");
        $mysqli->query("SET sql_mode = 'NO_ENGINE_SUBSTITUTION,NO_AUTO_CREATE_USER'");

        return $mysqli;
    }

    public static function createFacebook()
    {
        $facebook = new \Facebook\Facebook([
            'app_id' => '185745958145518',
            'app_secret' => '2dfcaee59dd449e209913b7765e25c07'
        ]);

        return $facebook;
    }

    public static function createSmarty()
    {
        global $filePath;
        require_once $filePath . '/libs/smarty/Smarty.class.php';
        $smarty = new Smarty;
        $smarty->template_dir = $filePath . '/templates/';
        $smarty->compile_dir = $filePath . '/gen/smarty/templates_c/';
        $smarty->cache_dir = $filePath . '/gen/smarty/cache/';
        return $smarty;
    }

    public static function autoLoader($className)
    {
        global $filePath;
        if (file_exists($filePath . "/cls/{$className}.php")) {
            /** @noinspection PhpIncludeInspection */
            require_once $filePath . "/cls/{$className}.php";
            return true;
        }
        return false;
    }

    public static function createYaleAdvancedOciMysqli()
    {
        return self::createMysqli(MYSQL_DATABASE);
    }

    public static function createYalePlusMysqli()
    {
        return self::createMysqli('yaleplus');
    }

    public static function casAuthenticate($force = true)
    {
        // if ($force) {
        //     phpCAS::forceAuthentication();
        // }

        // $netId = null;
        // if (phpCAS::isAuthenticated()) {
        //     $netId = phpCAS::getUser();
        // }

        // return $netId;
        return 'mdl74';
    }

    public static function casLogout()
    {
        phpCAS::logout();
    }

    public static function createLog($name = 'general')
    {
        global $logPath;
        return new Log($name, $logPath);
    }

    //
    // These are variables used by the (currently-defunct) textbook crawler
    // that checks Amazon for textbook prices.
    //
    const AMAZON_API_KEY = 'ABCDEFGHIJKLMNOPQRST';
    const AMAZON_SECRET_API_KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXY/abcdefghijklmn';
    const AMAZON_ASSOCIATE_TAG = 'yale0b-20';
    const AMAZON_LINKCODE = 'as2';
    const AMAZON_CAMPAIGN = '1789';
    const AMAZON_CREATIVE = '390957';

    public static function createAmazon()
    {
        require_once 'libs/amazon/AmazonECS.class.php';
        $apiKey = API_KEY; // Access key
        $secretApiKey = AMAZON_SECRET_API_KEY;
        $region = 'com';
        $associateTag = 'yale0b-20';

        $amazon = new AmazonECS(
            self::AMAZON_API_KEY,
            self::AMAZON_SECRET_API_KEY,
            $region,
            self::AMAZON_ASSOCIATE_TAG
        );
        $amazon->returnType(AmazonECS::RETURN_TYPE_ARRAY);
        return $amazon;
    }

    public static function getStudentAuthorizationState($netId, $yalePlusMysqli)
    {
        // $student = new Student($yalePlusMysqli);
        // $student->retrieve('netId', $netId, array('facebookId'));

        // if (empty($student->info['facebookId'])) {
        //     return 'unknown';
        // }

        return 'authorized';
    }

    public static function createSqlite($file)
    {
        $db = new SQLite3($file, SQLITE3_OPEN_READONLY);
        return $db;
    }

    public static function fetchAllSeasons()
    {
        $db = self::createYaleAdvancedOciMysqli();
        $seasonsTable = new MysqlTable($db, 'oci_seasons', array('id', 'season'));
        $seasonsTable->setColumns(array('season'))->select();
        $rows = $seasonsTable->getResults();

        foreach ($rows as &$row) {
            $row = $row['season'];
        }

        sort($rows);
        return $rows;
    }

    public static function fetchCurrentSeason()
    {
        $seasons = self::fetchAllSeasons();
        $currentMonth = (int) date('n');
        $currentYear = (int) date('Y');

        $seasonYear = 0;
        $seasonTermNum = '';
        if ($currentMonth >= 11) {
            $seasonYear = $currentYear + 1;
            $seasonTermNum = '01';
        } elseif ($currentMonth >= 6) {
            $seasonYear = $currentYear;
            $seasonTermNum = '03';
        } else { // Between January and June
            $seasonYear = $currentYear;
            $seasonTermNum = '01';
        }

        $termString = $seasonYear . $seasonTermNum;

        if (in_array($termString, $seasons)) {
            return $termString;
        } elseif (count($seasons) >= 1) {
            $latestSeason = $seasons[count($seasons) - 1];
            $latestSeasonTermString = substr($latestSeason, 4);

            if ($latestSeasonTermString === '02' && count($seasons) >= 2) {
                return $seasons[count($seasons) - 2];
            } else {
                return $latestSeason;
            }
        }

        return '201701'; // Should never get here unless database is messed up
    }

    public static function fetchTextbooksTerm()
    {
        $currentSeason = (string) self::fetchCurrentSeason();
        $textbooksYear = substr($currentSeason, 0, 4);
        $textbooksTerm = substr($currentSeason, 4);
        $termString = '';
        switch ($textbooksTerm) {
            case '01':
                $termString = 'SPRING';
                break;
            case '02':
                $termString = 'SUMMER';
                break;
            case '03':
            default:
                $termString = 'FALL';
        }

        return "{$termString} {$textbooksYear}";
    }

    /**
     * Get the JSON file for a given season (with/without evaluations
     * as specified)
     *
     * @param $season              season to get
     * @param $evaluationsEnabled  whether to include evaluations
     * @return name of the file with the evaluations
     */
    public static function jsonDataForSeason($season, $evaluationsEnabled = false)
    {
        $dataPath = FILE_PATH . "/gen/json/data_<(season)>.json";
        $dataWithEvalsPath = FILE_PATH . "/gen/json/data_with_evals_<(season)>.json";

        $fileForSeason = $evaluationsEnabled ? $dataWithEvalsPath : $dataPath;
        $fileForSeason = str_replace('<(season)>', $season, $fileForSeason);

        return json_decode(file_get_contents($fileForSeason), true);
    }
}

spl_autoload_register('ProjectCommon::autoLoader');
