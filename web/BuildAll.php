<?php
$version = $argv[1];

if (empty($version)) {
    echo <<<END
Usage: php BuildAll.php version
Version is the version to suffix the Javascript file
(e.g. for all-1.4.js, use 1.4)

END;
}

$dir = dirname(__FILE__);

$templates = array('Main.tpl', 'Bluebook.tpl');

$jsFiles = array();

foreach ($templates as $template) {
    $file = file_get_contents('templates/'.$template);
    preg_match_all('/([^\'"]*\.js)[\'"]/', $file, $matches);

    $jsFiles = array_merge($jsFiles, $matches[1]);
}

$allJs = '';
foreach ($jsFiles as $file) {
    $fullPath = $dir.'/'.$file;
    if (file_exists($fullPath)) {
        echo "{$file} found\n";
        $allJs .= file_get_contents($fullPath)."\n";
    }
}
// Compress it
$allJsFile = $dir."/js/all-{$version}.js";
file_put_contents($allJsFile, $allJs);
$command = "java -jar /root/scripts/yui.jar ".
    "-o '{$dir}/js/all-{$version}-min.js' ".
    "--line-break 200 --type js '{$allJsFile}'";
echo $command, "\n";
exec($command);
