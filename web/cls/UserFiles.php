<?php
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;

class UserFiles
{
    private $netId;
    private $path;
    private $userDir;
    private $sqliteFile;

    public function __construct($netId)
    {
        $this->path = __DIR__ . '/uploads';

        $this->netId = $netId;
        $this->userDir = $this->path . '/' . $this->netId;
        $this->sqliteFile = $this->userDir . '/sqlite';
    }

    /**
     * Check if the current user (NetID) has a SQLite database
     * file of evaluations
     * @return true if a SQLite database exists, false otherwise
     */
    public function hasSqlite()
    {
        return file_exists($this->sqliteFile);
    }

    /**
     * Save a SQLite file as the current user's copy
     * @param    $file    name of the file to set as the new DB
     * @return    true on successful copy, false if otherwise
     */
    public function setSqlite($file)
    {
        if (!is_dir($this->userDir)) {
            mkdir($this->userDir, 0755);
        }

        return copy($file, $this->sqliteFile);
    }

    public function fileForSeason($season)
    {
        return "{$this->userDir}/data_{$season}.json";
    }

    /**
     * Check if the current user (NetID) has a compiled JSON file
     * used for the actual table
     * @param    $season
     * @return true if a JSON file exists for the given season
     */
    public function hasJSON($season)
    {
        return file_exists($this->fileForSeason($season));
    }

    /**
     * Schedule a JSON file to be generated from a SQLite file for a
     * given season
     * @param     $season        season for which to generate a file
     */
    public function generateJSON($season)
    {
        $conn = new AMQPConnection('localhost', 5672, 'guest', 'guest');
        $channel = $conn->channel();
        $channel->queue_declare('hello', false, false, false, false);

        $message = new AMQPMessage(
            json_encode(
                array(
                'season' => $season,
                'netId' => $netId
                )
            ),
            array('delivery_mode' => 2) // Persistent
        );

        $channel->basic_publish($message, '', 'generateJSON');
    }
}
