<?php
/**
 * CourseGeneric contains the join declarations for the other
 * types of course tables.
 */
abstract class CourseGeneric extends SQLTableBase
{
    protected $joinColumns = array(
        'course' => array('course_id', 'id'),
        'course_names' => array('course_id', 'course_id')
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
