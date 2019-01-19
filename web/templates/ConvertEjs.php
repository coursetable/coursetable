<?php
$simple = array(
    '{*' => '<%#',
    '*}' => '%>',
    '{/if}' => '<% } %>',
    '{/foreach}' => '<% } %>'
);

$regex = array(
    '@\{if ([^}]*)\}@' => '<% if ($1) { %>',
    '@\{foreach \$([^ ]*) as \$([^ ]*)\}@' =>
        '<% for (var i = 0; i < $1.length; i++) {' . "\n\t" .
        'var $2 = $1[i];',
    '@\{\$([^|\s]*)\|escape:html}@' => '<%= $1 %>',
    '@\{\$([^|}\s]*)}@' => '<%= $1 %>',
    '/!\$[^@ ]*\@first/' => 'i != 0',
    '/\$[^@ ]*\@first/' => 'i == 0',
);

$fileName = $argv[1];

// Some basic conversions
$file = file_get_contents($fileName);
$file = str_replace(array_keys($simple), array_values($simple), $file);
$file = preg_replace(array_keys($regex), array_values($regex), $file);
echo $file;
