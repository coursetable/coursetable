<?php
class YaleCurl extends Curl
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


    const LOGIN_HOST = 'https://secure.its.yale.edu';
    const LOGIN_PATH = '/cas/login';
    const LOGIN_PAGE_SUBSTRING = 'You may establish Yale authentication now in order to access';
    private $autoLoginUsername = '';
    private $autoLoginPassword = '';

    // Before logging in, we need to at least have gotten redirected
    // or gotten some cookies along the line
    private $loginInitialized = false;

    // These variables below keep the state of a multi-step
    // login session so that they don't have to be passed
    // in repeatedly
    private $duoSettings;
    private $duoForm;
    private $username;
    private $password;

    /**
     * Checks if the page is a login prompt.
     */
    private static function isPageLoginPrompt($page)
    {
        return (strpos($page, self::LOGIN_PAGE_SUBSTRING) !== false);
    }

    /**
     * Checks if a page is the start of a Duo two-factor authentication
     * page
     * @example return from Duo: {
     *   'host': 'api-08659818.duosecurity.com',
     *   'sig_request': 'TX|aGoyMjZ8RElKNVUxS1hDOFZZVjRPRjAwRU58MTUwMDY0ODgzNA==\
     *        |6dfd6cf54e312386a02b4504466c11fb021108fb:APP\
     *        |aGoyMjZ8RElKNVUxS1hDOFZZVjRPRjAwRU58MTUwMDY1MjEzNA==\
     *        |531b2b775307d63dac6e3923d2c0df198a0fa633',
     *   'post_argument': 'signedDuoResponse'
     * }
     * @param $page  the HTML of the page
     * @return the Duo.init call object if it's a Duo page (see above), or
     *         NULL if it's not
     */
    private static function isTwoFactorAuthPage($page)
    {
        if (preg_match('/Duo\.init\((\{[^}]+\})\)/i', $page, $match)) {
            return json_decode(str_replace("'", '"', $match[1]), true);
        }
        return null;
    }

    /**
     * Load the two-factor authentication page with the different methods
     * to contact the user.
     * This must be called after we called ->login() and got back
     * a page requiring two factor authentication
     *
     * @return either {state: 'twoFactorPrompt', devices}
     *         array of devices, each with 'deviceIndex', 'description', and 'factors'
     *         or NULL if we actually succeeded in logging in (with a redirect)
     *         or {state: 'loggedIn', jsCookie}
     *         JS cookie needs to be passed on to fully log in
     */
    private function loadTwoFactorAuthDevices()
    {
        $duoSettings = $this->duoSettings;
        $service = $this->service;
        $tx = explode(':', $duoSettings['sig_request'])[0];

        $page = $this->fetchPage("https://{$duoSettings['host']}/frame/web/v1/auth", [
            'parent' => $this->makeLoginUrl($service),
            'java_version' => '',
            'flash_version' => '',
            'screen_resolution_width' => '1366',
            'screen_resolution_height' => '768',
            'color_depth' => '24'
        ], false, [
            'tx' => $tx,
            'parent' => $this->makeLoginUrl($service)
        ]);

        $qp = html5qp($page);

        // Two branches
        // 1. We're already logged in by Duo standards and just need
        //    to do a POST redirect
        $jsCookie = $qp->find('input[name=js_cookie]')->get(0);
        if ($jsCookie) {
            return [
                'state' => 'loggedIn',
                'jsCookie' => $jsCookie->getAttribute('value')
            ];
        }

        $devices = [];
        // Get the auth method for each device
        $qp->find('fieldset[data-device-index]')->each(function ($index, $elem) use (&$devices) {
            $elemQp = html5qp($elem);
            $deviceIndex = $elemQp->attr('data-device-index');
            $factors = [];
            $elemQp->find('input[name=factor]')
                ->each(function ($index, $factor) use (&$factors) {
                    $factors[] = $factor->getAttribute('value');
                });

            $devices[] = [
                'deviceIndex' => $deviceIndex,
                'factors' => $factors
            ];
        });

        // Get the user-friendly label for each device
        $qp->find('select[name=device] option')->each(function ($index, $option) use (&$devices) {
            $devices[$index]['description'] = trim($option->nodeValue);
        });

        $qp->find('#login-form > input[type=hidden]')->each(function ($index, $input) use (&$hiddenInputs) {
            $hiddenInputs[$input->getAttribute('name')] = $input->getAttribute('value');
        });

        $this->duoForm = $hiddenInputs;
        return [
            'state' => 'twoFactorPrompt',
            'devices' => $devices
        ];
    }

    /**
     * Request a SMS for two-factor authentication
     *
     * @param $deviceIndex  device index (e.g., "phone4") from loadTwoFactorAuthDevices
     * @return NULL on success, error message on failure
     */
    public function requestSMS($deviceIndex)
    {
        $duoSettings = $this->duoSettings;
        $duoForm = $this->duoForm;
        $page = $this->fetchPage("https://{$duoSettings['host']}/frame/prompt", [
            'sid' => $duoForm['sid'],
            'device' => $deviceIndex,
            'factor' => 'sms'
        ]);

        $result = json_decode($page, true);
        return $result['stat'] === 'OK' ? null :
            $result['message'];
    }

    /**
     * Verify a SMS code
     *
     * @param $deviceIndex  the device index we requested the pass code for (e.g., 'phone3')
     * @param $passcode     the pass code that was texted
     * @return null on success, error message on failure
     */
    public function verifySMS($deviceIndex, $passcode)
    {
        $duoSettings = $this->duoSettings;
        $duoForm = $this->duoForm;

        // Step 1: get a token ("txid") from the code
        $page = $this->fetchPage("https://{$duoSettings['host']}/frame/prompt", [
            'sid' => $duoForm['sid'],
            'device' => $deviceIndex,
            'factor' => 'Passcode',
            'passcode' => $passcode,
            'dampen_choice' => true
        ]);

        $result = json_decode($page, true);
        if ($result['stat'] !== 'OK') {
            return $result['message'];
        }

        $txid = $result['response']['txid'];

        // Step 2: verify this txid to see if it works
        $page = $this->fetchPage("https://{$duoSettings['host']}/frame/status", [
            'sid' => $duoForm['sid'],
            'txid' => $txid
        ]);

        $result = json_decode($page, true);
        $success = $result['stat'] === 'OK' &&
            $result['response']['status_code'] === 'allow';

        if (!$success) {
            return $result['message'] || $result['response']['status'];
        }

        $part1 = $result['response']['cookie'];
        $part2 = explode(':', $duoSettings['sig_request'])[1];

        // Step 3: log in again
        $service = $this->service;
        $page = $this->fetchPage($this->makeLoginUrl($service), [
            '_eventId' => 'submit',
            'username' => $this->username,
            'password' => $this->password,
            'execution' => 'e1s2',
            'service' => $service,
            'signedDuoResponse' => "{$part1}:{$part2}"
        ], true);

        $result = $this->processLoginResponse($page);
        return $result['state'] === 'loggedIn' ? null :
            'We ran into an issue when logging in';
    }

    /**
     * Gets the value of the lt form field on login prompt pages.
     * Enter description here ...
     * @param unknown_type $service
     */
    private function getLtValue($service)
    {
        $page = $this->fetchPage($this->makeLoginUrl($service), null, true);
        if (strpos($page, 'Login Successful') !== false ||
                strpos($page, '302') !== false) {
            return false;
        }
        return StringUtil::getBetween('name="lt" value="', '"', $page);
    }

    private function makeLoginUrl($service, $loginPath = self::LOGIN_PATH)
    {
        $loginPage = self::LOGIN_HOST . $loginPath;
        if (!empty($service) && is_string($service)) {
            return $loginPage . '?service=' . urlencode($service);
        }
        return $loginPage;
    }

    /**
     * Checks if logged into Yale interface already.
     */
    public function isLoggedIn($service)
    {
        if ($this->getLtValue($service) === false) {
            return true;
        }
        return false;
    }

    /**
     * Given a response from a login page, return whether
     * we had a wrong username/password, two-factor authentication, or
     * successful login
     *
     * @param $page   response to login page with headers
     * @return array with 'state' => 'loginFailed' | 'twoFactor' | 'isLoggedIn'
     *         and extra information depending on the state
     */
    private function processLoginResponse($page)
    {
        if (stripos($page, 'Login required') !== false) {
            $this->setError(0, 'The login credentials did not work.');
            return [
                'state' => 'loginFailed',
                'error' => 'The login credentials did not work.'
            ];
        }

        $duoSettings = self::isTwoFactorAuthPage($page);
        if ($duoSettings) {
            $this->duoSettings = $duoSettings;
            $twoFactorState = $this->loadTwoFactorAuthDevices();

            if ($twoFactorState['state'] === 'loggedIn') {
                $part1 = $twoFactorState['jsCookie'];
                $part2 = explode(':', $duoSettings['sig_request'])[1];

                $page = $this->fetchPage($this->makeLoginUrl($service), [
                    '_eventId' => 'submit',
                    'username' => $this->username,
                    'password' => $this->password,
                    'execution' => 'e1s2',
                    'service' => $service,
                    'signedDuoResponse' => "{$part1}:{$part2}"
                ], true);

                return $this->processLoginResponse($page);
            }

            return [
                'state' => 'twoFactor',
                'devices' => $twoFactorState['devices']
            ];
        }

        return [
            'state' => 'loggedIn'
        ];
    }

    /**
     * Initialize the login page and get the cookies, etc.
     * needed
     */
    private function initLogin($service)
    {
        $page = $this->fetchPage($this->makeLoginUrl($service));
        $this->loginInitialized = true;

        $qp = html5qp($page);
        $loginPath = $qp->find('form')->get(0)->getAttribute('action');

        return $loginPath;
    }

    /**
     * Log in on Yale's CAS
     * @return bool
     */
    public function login($username, $password, $service = '')
    {
        $loginPath = null;
        if (!$this->loginInitialized) {
            $loginPath = $this->initLogin($service);
        }

        $this->service = $service;
        $this->username = $username;
        $this->password = $password;

        $page = $this->fetchPage($this->makeLoginUrl($service, $loginPath), [
            '_eventId' => 'submit',
            'username' => $username,
            'password' => $password,
            'execution' => 'e1s1',
            'service' => $service
        ], true);
        // Request login, and also take the response headers

        return $this->processLoginResponse($page);
    }

    /**
     * Attempts a login through Yale's CAS.
     * @param string $username
     * @param string $password
     * @param string $service URL to log into
     * @return bool
     */
    public function attemptLogin($username, $password, $service = '')
    {
        if (!isset($this->cookieFile)) {
            echo $this->cookieFile . "\n";
            $this->setError(0, 'A cookie file must be set to log in.');
            return false;
        }

        $ltValue = $this->getLtValue($service);
        // Already logged in
        if ($ltValue === false) {
            return true;
        }

        $result = $this->login($username, $password, $service);
        return $result['state'] === 'loggedIn';
    }

    /**
     * Fetch page given URL.
     * @param string $url
     * @param array $postFields        Leave null if request is GET.
     * @param bool $withHeaders
     * @return mixed $page
     */
    public function fetchPageAndLogin($url, $postFields, $withHeaders, $autoLogin, $getFields = null)
    {
        $page = $this->fetchPage($url, $postFields, $withHeaders, $getFields);
        $this->loginInitialized = true;

        // Don't do anything if we aren't using autologin or don't need to login
        if (!empty($this->autoLoginUsername) && self::isPageLoginPrompt($page)) {
            $result = $this->attemptLogin($this->autoLoginUsername, $this->autoLoginPassword, $url);
            if ($result['state'] !== 'loggedIn') {
                return false;
            }
            $page = $this->fetchPage($url, $postFields, $withHeaders, $getFields);
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
