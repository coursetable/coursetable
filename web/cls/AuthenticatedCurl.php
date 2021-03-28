<?php
require_once 'Curl.php';

abstract class AuthenticatedCurl extends Curl
{
    private $readOnlyVars = array('autoLoginUsername', 'autoLoginPassword');
    /*
     * Read-only variables code and declaration
     */
    public function __get($name)
    {
        if (in_array($name, (array) $this->readOnlyVars)) {
            return $this->$name;
        }
        return parent::__get($name);
    }

    protected $autoLoginUsername = '';
    protected $autoLoginPassword = '';

    /**
     * Checks if the page is a login prompt.
     * @param string $page the HTML returned from a cURL request
     */
    abstract protected static function isPageLoginPrompt($page);

    /**
     * Checks if logged into Yale interface already.
     */
    abstract public function isLoggedIn($site);

    /**
     * Attempts a login through Yale's CAS.
     * @param string $username
     * @param string $password
     * @param string $site     URL to log into
     * @return bool
     */
    abstract public function attemptLogin($username, $password, $site = null);


    /**
     * Fetch page given URL.
     * @param string $url
     * @param array  $postFields  Leave null if request is GET.
     * @param bool   $withHeaders
     * @return mixed HTML data of the page
     */
    public function fetchPageAndLogin($url, $postFields = null, $withHeaders = false, $autoLogin = true)
    {
        $page = $this->fetchPage($url, $postFields, $withHeaders);
        // Don't do anything if we aren't using autologin or don't need to login
        if (!empty($this->autoLoginUsername) && static::isPageLoginPrompt($page)) {
            $success = $this->attemptLogin($this->autoLoginUsername, $this->autoLoginPassword, $url);
            if (!$success) {
                echo "Login failed\n";
                return false;
            }
            $page = $this->fetchPage($url, $postFields, $withHeaders);
        }

        return $page;
    }

    /**
     * Sets login parameters to automatically log into Yale CAS when necessary.
     * @param string $username
     * @param string $password
     */
    public function setAutoLoginParameters($username, $password)
    {
        $this->autoLoginUsername = $username;
        $this->autoLoginPassword = $password;
        return true;
    }
}
