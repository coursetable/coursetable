<?php
require_once __DIR__ . '/../includes/ProjectCommon.php';

$templates = array(
    'BluebookPerUser.tpl' => 'BluebookPerUserCompressed.tpl'
);

$scriptsDir = __DIR__ . '/../../node_modules/.bin';

foreach ($templates as $file => $compressed) {
    $templateFile = $filePath . '/templates/' . $file;
    $compressedTemplateFile = $filePath . '/templates/' . $compressed;

    $jsCompiler = "{$scriptsDir}/uglifyjs";
    $cssCompiler = "{$scriptsDir}/cleancss";
    $allJsFile = '/js/all.js';
    $allCssFile = '/css/all.css';

    $allJs = $filePath . $allJsFile;
    $allCss = $filePath . $allCssFile;

    $template = file_get_contents($templateFile);

    // Javascript files
    $jsPattern = '@<script src="(/[^/][^"]+)"></script>@';
    preg_match_all($jsPattern, $template, $matches);
    $jsFiles = $matches[1];

    // Performance-enhancing stuff
    array_unshift($jsFiles, '/js/production.js');

    $command = $jsCompiler;
    foreach ($jsFiles as $jsFile) {
        $command .= ' ' . escapeshellarg($filePath . '/' . $jsFile);
    }
    $command .= ' > ' . escapeshellarg($allJs);
    echo $command, "\n";
    echo shell_exec($command);

    $allJsFileWithHash = '/js/all-' . substr(sha1_file($allJs), 0, 8) . '.js';
    $allJsWithHash = $filePath . $allJsFileWithHash;
    rename($allJs, $allJsWithHash);

    // CSS files
    $cssPattern = '@<link rel="stylesheet" href="(/[^/][^"]+)">@';
    preg_match_all($cssPattern, $template, $matches);
    $cssFiles = $matches[1];

    $command = $cssCompiler . ' -o ' . escapeshellarg($allCss);
    foreach ($cssFiles as $cssFile) {
        $command .= ' ' . escapeshellarg($filePath . '/' . $cssFile);
    }
    echo $command, "\n";
    echo shell_exec($command);


    $allCssFileWithHash = '/css/all-' . substr(sha1_file($allCss), 0, 8) . '.css';
    $allCssWithHash = $filePath . $allCssFileWithHash;
    rename($allCss, $allCssWithHash);

    $template = preg_replace($cssPattern, '', $template);
    $template = preg_replace($jsPattern, '', $template);
    $jsString = <<<END
<script>
//console.log = function() {};
</script>
<script src="{$allJsFileWithHash}"></script>
END;
    $template = str_replace('{* -JS- *}', $jsString, $template);
    $template = str_replace('{* -CSS- *}', '<link rel="stylesheet" href="' . $allCssFileWithHash . '">', $template);
    file_put_contents($compressedTemplateFile, $template);
}
