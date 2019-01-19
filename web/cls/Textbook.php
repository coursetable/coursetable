<?php
class Textbook extends SQLTableBase
{
    protected $tableName = 'textbooks';
    protected $keys = array('isbn');
    
    protected $joinColumns = array(
        'textbook_courses' => array('isbn', 'isbn'),
        'textbook_prices' => array('isbn', 'isbn')
    );
    protected $columnAliases = array(
        'term' => array('textbook_courses', 'term'),
        'subject' => array('textbook_courses', 'subject'),
        'number' => array('textbook_courses', 'number'),
        'section' => array('textbook_courses', 'section'),
        'section_id' => array('textbook_courses', 'section_id'),
        'required' => array('textbook_courses', 'required'),
        'type' => array('textbook_prices', 'type'),
        'price' => array('textbook_prices', 'price')
    );
}
