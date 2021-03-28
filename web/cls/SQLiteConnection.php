<?php
class SQLiteConnection implements SQLConnection
{
    private $conn;
    
    public function __construct($conn)
    {
        $this->conn = $conn;
    }
    
    public function canUseOnDuplicateKeyUpdate()
    {
        return false;
    }
    
    public function escapeIdent($ident)
    {
        return '"' . $ident . '"';
    }
    
    public function escapeString($string)
    {
        return $this->conn->escapeString($string);
    }
    
    public function fetchResult($result)
    {
        return $result->fetchArray(SQLITE3_ASSOC);
    }
    
    public function getInsertId()
    {
        return $this->conn->lastInsertRowID();
    }
    
    public function getErrorCode()
    {
        return $this->conn->lastErrorCode();
    }
    
    public function getErrorMessage()
    {
        return $this->conn->lastErrorMsg();
    }
}
