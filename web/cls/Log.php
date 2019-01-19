<?php
class Log
{

    const FLAG_ECHO = 1;
    private $filename = '';
    private $logPath = '';
    private $logLevel = E_ALL;
    private static $levelLabels = array(E_WARNING => 'Warning',
        E_ERROR => 'Error', E_NOTICE => 'Notice');


    /**
     * Set the file to which logs will be written.
     * @param $file     string name of file
     */
    public function setFile($file)
    {
        $this->filename = $file;
    }

    /**
     * Sets the default logging level.
     * @param $logLevel
     * @return bool     Success
     */
    public function setLogLevel($logLevel)
    {
        if (is_int($logLevel)) {
            $this->logLevel = $logLevel;
            return true;
        }

        return false;
    }

    /**
     * Creates a logger, which writes log data to a given file.
     * @param    string    $file        file name of file
     * @param    string    $logPath    directory in which to save the log. If omitted, defaults to
     *                                the /logs directory under the current script directory. The
     *                                directory is created if needed.
     */
    public function __construct($file, $logPath = null)
    {
        if (!isset($logPath)) {
            $logPath = dirname($_SERVER['PHP_SELF']) . '/logs';
        }
        if (!is_dir($logPath)) {
            @mkdir($logPath);
        }

        $this->logPath = $logPath;
        $this->filename = $file;
    }


    /**
     * Write a message to the log
     * @param $message
     * @param int $level
     * @param int $flags
     * @return bool|int
     */
    public function write($message, $level = E_NOTICE, $flags = self::FLAG_ECHO)
    {
        // Returns if level not valid
        if (empty(self::$levelLabels[$level])) {
            return false;
        }

        $level_label = self::$levelLabels[$level];

        $write = '[' . date('m/d H:i:s') . "] [{$level_label}] {$message}\n";

        $ret = true;
        if (!empty($this->filename) && ($level & $this->logLevel)) {
            $ret = file_put_contents(
                $this->logPath . '/' . $this->filename,
                $write,
                FILE_APPEND | FILE_TEXT
            );
        }

        if ($flags & self::FLAG_ECHO) {
            echo $write;
        }

        return $ret;
    }
}
