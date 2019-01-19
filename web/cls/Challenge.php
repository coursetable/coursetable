<?php
class Challenge
{
    private static $secret = 'BANNPR4JSWV2X8EVK7VNRFGSN1NSUP0SOG1GYA44';
    
    public static function encodeAnswer($data)
    {
        $salt = mt_rand();
        return array(sha1(implode(',', $data) . self::$secret . $salt), $salt);
    }
    
    public static function checkAnswer($data, $salt, $encodedAnswer)
    {
        return sha1(implode(',', $data) . self::$secret . $salt) === $encodedAnswer;
    }
}
