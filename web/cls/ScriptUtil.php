<?php
class ScriptUtil
{
    public static function processFlags($args, $valueFlags, $booleanFlags, $letterFlags)
    {
        $argsSize = count($args);
        $valueFlags = (array) $valueFlags;
        $booleanFlags = (array) $booleanFlags;
        $letterFlags = (array) $letterFlags;
        
        $returnArray = array('flags' => array(), 'arguments' => array());
        
        for ($i = 1; $i < $argsSize; $i++) {
            if ($args[$i][0] == '-') {
                // Value flags
                if (in_array($args[$i], $valueFlags) ||
                        isset($valueFlags[$args[$i]])) {
                    if (isset($valueFlags[$args[$i]])) {
                        $returnArray['flags'][$valueFlags[$args[$i]]] = $args[$i+1];
                    } else {
                        $returnArray['flags'][$args[$i]] = $args[$i+1];
                    }
                    ++$i;
                    
                // Boolean flags
                } elseif (in_array($args[$i], $booleanFlags)) {
                    $returnArray['flags'][$args[$i]] = true;
                } elseif (isset($booleanFlags[$args[$i]])) {
                    $returnArray['flags'][$booleanFlags[$args[$i]]] = true;
                    
                // Letter flags
                } else {
                    foreach ($letterFlags as $flagKey => &$flagValue) {
                        if (is_string($flagKey) &&
                                strpos($args[$i], $flagKey) !== false) {
                            $returnArray['flags'][$flagValue] = true;
                        } elseif (strpos($args[$i], $flagValue) !== false) {
                            $returnArray['flags'][$flagValue] = true;
                        }
                    }
                }
            } else {
                if ($args[$i][0] == '\\') {
                    $args[$i] = substr($args[$i], 1);
                }
                $returnArray['arguments'][] = $args[$i];
            }
        }
        
        return $returnArray;
    }
}
