<?php

/**
 * Interface that provides a uniform way to access different
 * SQL databases' connection and result objects
 *
 * @author User
 * @version 2014-06-20
 *
 */
interface SQLConnection
{

    /**
     * Return true if the current connection supports
     * "INSERT ... ON DUPLICATE KEY UPDATE"
     * @return    bool        whether it's supported
     */
    public function canUseOnDuplicateKeyUpdate();

    /**
     * Escapes a database identifier (e.g. a column or table)
     * @param    string    $ident        Identifier to be escaped
     * @return    string                Escaped identifier (with $leftEscape, $rightEscape)
     */
    public function escapeIdent($ident);
    
    /**
     * Escapes a string for use in single quotes in a query
     * @param    string    $string        string to escape
     * @return    string                 escaped string
     */
    public function escapeString($string);
    
    /**
     * Fetch a row from a result in an associative array
     * @param    result    $result        result from a database query
     * @return    array                associative array of column => value
     */
    public function fetchResult($result);
    
    /**
     * If the previous operation was an INSERT query, get the insertid from the
     * connection.
     * @return    int                    ID of the inserted row
     */
    public function getInsertId();
    
    /**
     * Gets the number of the last error that occurred on the connection.
     * @return    int            Error number
     */
    public function getErrorCode();
    
    /**
     * Gets the message of the last error that occurred on the connection.
     * @return    string        Error message
     */
    public function getErrorMessage();
}
