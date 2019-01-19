<?php
class Utility
{
    /**
     * Creates a new array, keeping only the key/value pairs for the keys in $fields
     *
     * @param array $array Array to extract fields from
     * @param array $fields Non-associative array of the fields to keep
     *
     * @return array Filtered array with only extracted fields
     */
    public static function arrayPick($array, $fields)
    {
        $return = array();
        foreach ($fields as $field) {
            if (isset($array[$field])) {
                $return[$field] = $array[$field];
            }
        }
        return $return;
    }

    /**
     * Get the value of an element of an array by applying a deep path
     * to it (e.g., get([1 => [2 => 3]], [1, 2]) === 3)
     *
     * @param $array
     * @param $path    path; can be a string (a.b.c) or array (['a', 'b'])
     * @return value at the path, or NULL if any part of the path is non-existent
     */
    public static function get($array, $path, $startFrom = 0)
    {
        if (!isset($array)) {
            return null;
        }
        if (is_string($path)) {
            $path = explode('.', $path);
        }
        if (count($path) === 0) {
            return $array;
        }

        return self::get($array[$path[0]] ?? null, array_slice($path, 1));
    }
}
