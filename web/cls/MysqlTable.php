<?php
class MysqlTable extends SQLTableBase
{
    public function __construct($mysqli, $tableName, $keys = array('id'))
    {
        $this->tableName = $tableName;
        $this->keys = $keys;
        parent::__construct($mysqli);
    }
}
