<?php
class PDOConnection implements SQLConnection
{
    private $conn;
    private $driver;
    
    public function __construct($conn)
    {
        $this->conn = $conn;
        $this->driver = $conn->getAttribute(PDO::ATTR_DRIVER_NAME);
    }
    
    public function canUseOnDuplicateKeyUpdate()
    {
        if ($this->driver == 'mysql') {
            return true;
        } else {
            return false;
        }
    }
    public function canUseInsertOrReplace()
    {
        if ($this->driver == 'sqlite') {
            return true;
        } else {
            return false;
        }
    }
    
    public function escapeIdent($ident)
    {
        if ($this->driver == 'mysql') {
            return '`' . $ident . '`';
        } elseif ($this->driver == 'sqlite') {
            return '"' . $ident . '"';
        }
    }
    
    public function escapeString($string)
    {
        if ($this->driver == 'sqlite') {
            // The Phalanger PDO-SQLite used to have a bug where they
            // escape ' as \' instead of '', so we do it ourselves. Also,
            // we really don't need to escape anything else
            return mb_ereg_replace("'", "''", $string);
        }
        
        $quoted = $this->conn->quote($string);
        
        // This already includes quotes, which SQLTableBase doesn't expect
        return substr($quoted, 1, -1);
    }
    
    public function fetchResult($result)
    {
        // Optional parameters needed for Phalanger
        return $result->fetch(PDO::FETCH_ASSOC, 0, 0);
    }
    
    public function getInsertId()
    {
        return $this->conn->lastInsertId();
    }
    
    public function getErrorCode()
    {
        $info = $this->conn->errorInfo();
        return $info[1]; // Driver-specific error code
    }
    
    public function getErrorMessage()
    {
        $info = $this->conn->errorInfo();
        return $info[2]; // Driver-specific error message
    }
}
