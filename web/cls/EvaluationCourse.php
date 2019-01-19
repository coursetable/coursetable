<?php
class EvaluationCourse extends SQLTableBase
{

    protected $keys = array('id');
    protected $tableName = 'evaluation_courses';
    protected $joinColumns = array(
        'evaluation_course_names' => array('id', 'course_id'),
        'evaluation_ratings' => array('id', 'course_id')
    );
    protected $columnAliases = array(
        'evaluation_course_name_id' => array('evaluation_course_names', 'id'),
        'subject' => array('evaluation_course_names', 'subject'),
        'number' => array('evaluation_course_names', 'number'),
        'section' => array('evaluation_course_names', 'section'),
        'crn' => array('evaluation_course_names', 'crn'),
        'season' => array('evaluation_course_names', 'season'),

        'counts' => array('evaluation_ratings', 'counts'),
        'question_id' => array('evaluation_ratings', 'question_id'),
    );
}
