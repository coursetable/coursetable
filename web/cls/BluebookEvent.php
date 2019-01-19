<?php
class BluebookEvent extends SQLTableBase
{
    protected $tableName = 'BluebookEvents';
    protected $keys = array('netId', 'time');
}
