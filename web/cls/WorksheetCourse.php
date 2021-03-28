<?php
class WorksheetCourse extends SQLTableBase
{
    protected $tableName = 'worksheet_courses';
    protected $keys = array('id', 'net_id');
    
    
    protected $joinColumns = array(
        'StudentGroupMembers' => array('netId', 'netId')
    );
    
    // Aliases
    protected $columnAliases = array(
        'groupId' => array('StudentGroupMembers', 'groupId')
    );
}
