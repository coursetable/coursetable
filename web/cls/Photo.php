<?php
require_once 'SQLTableBase.php';

class Photo extends SQLTableBase
{
    protected $tableName = 'Photos';
    protected $keys = array('netId');
}
