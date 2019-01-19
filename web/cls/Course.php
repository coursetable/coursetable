<?php

class Course extends SQLTableBase
{

    protected $keys = array('id');
    protected $tableName = 'courses';
    protected $joinColumns = array(
        'course_names' => array('id', 'course_id')
    );
    protected $columnAliases = array(
        'course_name_id' => array('course_names', 'id'),
        'subject' => array('course_names', 'subject'),
        'number' => array('course_names', 'number'),
        'section' => array('course_names', 'section'),
        'oci_id' => array('course_names', 'oci_id'),
        'season' => array('course_names', 'season')
    );
}
