<?php
class CourseName extends SQLTableBase
{

    protected $keys = array('id');
    protected $tableName = 'course_names';
    protected $joinColumns = array(
        'courses' => array('course_id', 'id'),
        'worksheet_courses' => array(array('oci_id', 'season'), array('oci_id', 'season')),
        'course_sessions' => array('course_id', 'course_id')
    );
    protected $columnAliases = array(
        'title' => array('courses', 'title'),
        'long_title' => array('courses', 'long_title'),
        'description' => array('courses', 'description'),
        'requirements' => array('courses', 'requirements'),
        'exam_group' => array('courses', 'exam_group'),
        'extra_info' => array('courses', 'extra_info'),
        'syllabus_url' => array('courses', 'syllabus_url'),
        'course_home_url' => array('courses', 'course_home_url'),
        'net_id' => array('worksheet_courses', 'net_id'),
        'day_of_week' => array('course_sessions', 'day_of_week'),
        'start_time' => array('course_sessions', 'start_time'),
        'end_time' => array('course_sessions', 'end_time'),
        'location' => array('course_sessions', 'location')
    );
}
