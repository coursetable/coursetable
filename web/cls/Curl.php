<?php
/**
 * Wraps CURL session into a class
 *
 * @author User
 */
class Curl
{
    const DEFAULT_TEMP_DIR = '/tmp';

    /**
     * Variables that are read-only.
     * @var array
     */
    private $readOnlyVars = array('error', 'errno', 'cookieFile',
        'storeReferer', 'debug', 'averageRequestTime', 'lastRequestTime');
    protected $error = '';
    protected $errno = 0;


    const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';
    const MAX_RETRIES = 3;
    const TIMEOUT = 15;
    private $debug = false;
    private $storeReferer = false;
    private $curlHandle;
    protected $cookieFile = null;
    protected $curlOpts = array();

    // Statistics about the time taken for past requests
    protected $lastRequestTime = 0;
    protected $averageRequestTime = 0;
    protected $averageRequestCount = 0;

    protected $pause = 0;

    protected $xhr = false;

    /**
     * Creates the curl handle, sets its options, and sets the cookieFile path
     * to the default.
     */
    public function __construct($debug = false)
    {
        $this->debug = $debug;

        $this->curlHandle = curl_init();
        $this->setCurlOpt(CURLOPT_USERAGENT, self::DEFAULT_USER_AGENT);
        $this->setCurlOpt(CURLOPT_SSL_VERIFYHOST, false);
        $this->setCurlOpt(CURLOPT_SSL_VERIFYPEER, false);
        $this->setCurlOpt(CURLOPT_RETURNTRANSFER, true);
        $this->setCurlOpt(CURLOPT_FOLLOWLOCATION, true);
        $this->setCurlOpt(CURLOPT_TIMEOUT, self::TIMEOUT);
        $this->setCurlOpt(CURLOPT_CONNECTTIMEOUT, self::TIMEOUT);

        $this->setCookieFile(''); // Enable cookie handling, but don't load from anywhere
    }

    /**
     * Deletes the cookie file on destruction.
     */
    public function __destruct()
    {

        $this->deleteCookieFile();
    }

    private function deleteCookieFile()
    {
        if (!empty($this->cookieFile)) {
            @unlink($this->cookieFile);
        }
    }
    /**
     * Set whether to enable debug mode for cURL.
     * @param bool $setting
     */
    public function setDebug($setting)
    {
        $setting = (bool) $setting;
        $success = $this->setCurlOpt(CURLOPT_VERBOSE, $setting);
        if ($success === true) {
            $this->debug = $setting;
        }
        return $success;
    }

    /**
     * Set an alternative network interface or IP address to use
     * @param    $interface        Interface name or interface IP address
     */
    public function setInterface($interface)
    {
        return $this->setCurlOpt(CURLOPT_INTERFACE, $interface);
    }

    /**
     * Set whether to store the Referer from past requests.
     * @param bool $setting
     * @return bool $success
     */
    public function setStoreReferer($setting)
    {
        $this->storeReferer = (bool) $setting;
        return true;
    }

    /**
     * Set the Referer: field of HTTP requests.
     * @param string $referer
     */
    public function setReferer($referer)
    {
        return $this->setCurlOpt(CURLOPT_REFERER, $referer);
    }

    /**
     * Sets the file the cookies are placed and taken from.
     * @param string $filePath
     * @return bool $success
     */
    public function setCookieFile($filePath)
    {
        $success = $this->setCurlOpt(CURLOPT_COOKIEFILE, $filePath);
        if (!empty($filePath)) {
            $this->setCurlOpt(CURLOPT_COOKIEJAR, $filePath);
        }

        if ($success === true) {
            $this->cookieFile = $filePath;
        }
        return $success;
    }

    public function setCookie($cookie)
    {
        return $this->setCurlOpt(CURLOPT_COOKIE, $cookie);
    }

    /**
     * Set the timeout, in milliseconds, for cURL requests
     * @param    $timeout
     * @return bool $success
     */
    public function setTimeout($timeout)
    {
        //$this->setCurlOpt(CURLOPT_TIMEOUT, ceil($timeout / 1000));
        //$this->setCurlOpt(CURLOPT_CONNECTTIMEOUT, ceil($timeout / 1000));
        $this->setCurlOpt(CURLOPT_TIMEOUT_MS, $timeout);
        $this->setCurlOpt(CURLOPT_CONNECTTIMEOUT_MS, $timeout);

        return true;
    }

    /**
     * Set whether to spoof AJAX (XHR) requests
     */
    public function setXMLHttpRequest($useXhr = true)
    {
        $this->xhr = $useXhr;
        return $this->setcurlOpt(
            CURLOPT_HTTPHEADER,
            $useXhr ? array(
                'X-Requested-With: XMLHttpRequest',
                'Accept: application/json, text/javascript, */*'
            ) : array()
        );
    }

    /**
     * Set an amount of time to sleep after each request
     */
    public function setPause($microseconds)
    {
        $this->pause = $microseconds;
        return true;
    }

    /**
     * Clear the cookies of the current session by creating a new cookie object
     */
    public function clearCookies()
    {
        $this->deleteCookieFile();

        unset($this->curlHandle);
        echo "CLEARING HANDLE\n\n\n\n\n";
        $this->curlHandle = curl_init();
        curl_setopt_array($this->curlHandle, $this->curlOpts);

        $this->setCookieFile($this->cookieFile);
    }

    /**
     * Get the CURLOPTS used for the last fetch.
     */
    public function getLastFetchCurlOpts()
    {
        return curl_getinfo($this->curlHandle);
    }

    /**
     * Fetch page given URL.
     * @param string $url
     * @param array $postFields        Leave null if request is GET.
     * @param bool $withHeaders
     * @return mixed $page
     */
    public function fetchPage($url, $postFields = null, $withHeaders = false, $getFields = null)
    {
        if (!empty($getFields)) {
            if (is_array($getFields)) {
                $getFields = http_build_query($getFields);
            }
            $url .= '?' . $getFields;
        }

        $this->setCurlOpt(CURLOPT_URL, $url);

        if (!empty($postFields)) {
            $this->setCurlOpt(CURLOPT_POST, true);

            if (is_array($postFields)) {
                $postFields = http_build_query($postFields);
            }

            $this->setCurlOpt(CURLOPT_POSTFIELDS, $postFields);
        } else {
            $this->setCurlOpt(CURLOPT_POST, false);
            $this->setCurlOpt(CURLOPT_HTTPGET, true);
        }

        if ($withHeaders === true) {
            $this->setCurlOpt(CURLOPT_HEADER, true);
        } else {
            $this->setCurlOpt(CURLOPT_HEADER, false);
        }

        $try = 0;

        // Debugging: let us get request headers
        if ($this->debug) {
            $this->setCurlOpt(CURLINFO_HEADER_OUT, true);
        }

        $output = $this->fetchExecuteOutput();
        while ($output === false && $try <= self::MAX_RETRIES) {
            ++$try;
            $output = $this->fetchExecuteOutput();
        }

        // Debugging: let us get request headers
        if ($this->debug) {
            $this->setCurlOpt(CURLINFO_HEADER_OUT, false);
            echo curl_getinfo($this->curlHandle, CURLINFO_HEADER_OUT), "\n";

            if (!empty($postFields)) {
                echo "POST: ";
                print_r($postFields);
            }

            echo "\n";
            echo <<<END
OUTPUT
======

END;
            echo $output, "\n\n";
        }

        if ($output === false) {
            $this->updateErrorVars();
        }

        if ($output !== false && $this->storeReferer === true) {
            $this->setReferer($url);
        }
        return $output;
    }

    /**
     * Set the specified CURL option with curl_setopt.
     * @param int $option
     * @param mixed $value
     * @return bool $success
     */
    private function setCurlOpt($option, $value)
    {
        $success = curl_setopt($this->curlHandle, $option, $value);
        if ($success === false) {
            $this->updateErrorVars();
        } else {
            $this->curlOpts[$option] = $value;
        }
        return $success;
    }

    /**
     * Updates the class's error variables from the CURL handle.
     */
    private function updateErrorVars()
    {
        $this->error = curl_error($this->curlHandle);
        $this->errno = curl_errno($this->curlHandle);
    }

    private function fetchExecuteOutput()
    {
        $startTime = microtime(true);
        $ret = curl_exec($this->curlHandle);
        $timeTaken = microtime(true) - $startTime;

        // Save time taken
        $this->averageRequestTime = ($this->averageRequestTime * $this->averageRequestCount + $timeTaken) / ($this->averageRequestCount + 1);
        $this->averageRequestCount++;
        $this->lastRequestTime = $timeTaken;

        if ($this->pause != 0) {
            usleep($this->pause);
        }

        return $ret;
    }

    /*
	 * Standard base class functions.
	 */
    public function __get($name)
    {
        if (in_array($name, (array) $this->readOnlyVars)) {
            return $this->$name;
        }
        return null;
    }

    /**
     * Sets internal error variables.
     * @param int $errno
     * @param string $error
     */
    protected function setError($errno, $error)
    {
        $this->errno = $errno;
        $this->error = $error;
    }
}
