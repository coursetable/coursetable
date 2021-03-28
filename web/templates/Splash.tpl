{*
	Splash.tpl
	
	Type: standalone template
	Usage: YalePlus bluebook's splash page

	Variables:
	    $facebookDataRetrieved: boolean of whether the user's Facebook data
	                            has been retrieved

    Blocks:
*}
{extends file='Main.tpl'}

{block name=vars}
	{$title = 'YalePlus Bluebook'}
{/block}

{block name=extraHead}
<link rel="stylesheet" href="/css/sortfilter.css">
<link rel="stylesheet" href="/css/bluebook.css">
<link rel="stylesheet" href="/css/modals.css">
{literal}
<style>
body {
	background-color: #000;
}
#fixed-center {
	position: fixed;
	left: 60%;
	margin-left: -170px;
	width: 340px;
	top: 20%;
	background-color: #fff;
	opacity: 0.8;
	padding: 20px;
	
	-webkit-border-radius: 5px;
	-moz-border-radius: 5px;
	border-radius: 5px;
	
	z-index: 2;
}
html {
	background: url(/res/saybrook.jpg) no-repeat center center fixed; 
	-webkit-background-size: cover;
	-moz-background-size: cover;
	-o-background-size: cover;
	background-size: cover;
}

#background {
	position: fixed;
	width: 100%;
	height: 100%;
	filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/res/saybrook.jpg', sizingMethod='scale');
	-ms-filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/res/saybrook.jpg', sizingMethod='scale')";
}
	
</style>
{/literal}
{/block}

{block name=content}
<div id="background">
</div>
<div id="fixed-center">
<h3><img src="/res/logo.png" alt="YalePlus Bluebook"></h3>
<p>YalePlus Bluebook is currently undergoing maintenance. Check back soon for updates!</p>
</div>
{/block}
