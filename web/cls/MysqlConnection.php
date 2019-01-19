<?php
class MysqlConnection implements SQLConnection
{
    private $conn;
    
    public function __construct($conn)
    {
        $this->conn = $conn;
    }
    
    public function canUseOnDuplicateKeyUpdate()
    {
        return true;
    }
    public function canUseInsertOrReplace()
    {
        return false;
    }
    
    public function escapeIdent($ident)
    {
        return '`' . $ident . '`';
    }
    
    public function escapeString($string)
    {
        return $this->conn->escape_string($string);
    }
    
    public function fetchResult($result)
    {
        return $result->fetch_assoc();
    }
    
    public function getInsertId()
    {
        return $this->conn->insert_id;
    }
    
    public function getErrorCode()
    {
        return $this->conn->errno;
    }
    
    public function getErrorMessage()
    {
        return $this->conn->error;
    }
}
