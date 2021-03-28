<?php
class StudentFacebookFriend extends SQLTableBase
{
    protected $tableName = 'StudentFacebookFriends';
    protected $keys = array('netId');

    protected $joinColumns = array(
        'Students' => array('facebookId', 'facebookId')
    );
    protected $columnAliases = array(
        'friendNetId' => array('Students', 'netId')
    );
}
