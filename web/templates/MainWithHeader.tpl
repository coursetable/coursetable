{*
	MainWithHeader.tpl

	Type: base template
	Usage: Base template with a "CourseTable" header

	Variables:

	Blocks:
*}
{extends file='Main.tpl'}

{block name=extraHead}
<link rel="stylesheet" href="/css/bluebook.css">
{/block}

{block name=beforeContent}
<div class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<a class="brand hide-small" href="/Table">Course<span style="color: #92bcea">Table</span></a>
	</div>
</div>
{/block}
