<?php
require_once 'SQLTableBase.php';

define('FACEBOOK_PREFIX', 'https://students.yale.edu/facebook');
define('PHOTO_PREFIX', FACEBOOK_PREFIX . '/Photo?id=');
define('DIRECTORY_PREFIX', 'http://directory.yale.edu/phonebook/index.htm?searchString=');

define(
    'DIRECTORY_PATTERN',
    '@<th align="right" width="350" valign="top">\s*([^:]*):\s*</th>\s*' .
    '<td width="350">\s*(?:<[^>]*>)?\s*([^<]*)\s*(?:<[^>]*>)?\s*</td>@mi'
);

class Student extends SQLTableBase
{
    protected $tableName = 'Students';
    protected $keys = array('netId');


    protected $joinColumns = array(
        'StudentGroupMembers' => array('netId', 'netId')
    );

    // Aliases
    protected $columnAliases = array(
        'groupId' => array('StudentGroupMembers', 'groupId')
    );

    protected static $curl;
}
