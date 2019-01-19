<?php
/**
 * Used by fb.js in FB.init(); helps improve performance.
 * The following is copy-pasted from https://developers.facebook.com/docs/reference/javascript/
 */
$cache_expire = 60*60*24*365;
header("Pragma: public");
header("Cache-Control: max-age=".$cache_expire);
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$cache_expire) . ' GMT');
?>
<script src="//connect.facebook.net/en_US/all.js"></script>
