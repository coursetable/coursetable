{*
	BluebookPerUser.tpl

	Type: standalone template
	Usage: YalePlus bluebook's main (and only) page, with JSON files per user

	Variables:
	    $facebookDataRetrieved: boolean of whether the user's Facebook data
	                            has been retrieved
		$updated:				string of when the bluebook was last updated
		$coursesTakenPrompted: string on whether student had been prompted to share
								which courses he/she had taken: can be 'Not prompted',
								'Shared', or 'Skipped'

    Blocks:
*}
{extends file='Main.tpl'}

{block name=extraHead}
{*
Stylesheets must be specified exactly as
<link rel="stylesheet" href="...">
for compressibility purposes by tools/build.php
*}
<link href="/libs/select2/select2.css" rel="stylesheet"> {* Not compressed *}
<link rel="stylesheet" href="/css/sortfilter.css">
<link rel="stylesheet" href="/css/bluebook.css">
<link rel="stylesheet" href="/css/modals.css">
<link rel="stylesheet" href="/css/timetable.css">
<link rel="stylesheet" href="/css/custom-timetable.css">

<style>
{if $evaluationsEnabled}
{literal}
@media screen and (max-width: 1020px){
  .navbar #nav-about {
    display: none;
  }
}

@media screen and (max-width: 900px){
  .navbar .brand {
    display: none;
  }
}
{/literal}
{else}
{literal}
@media screen and (max-width: 1120px){
  .navbar #nav-about {
    display: none;
  }
}

@media screen and (max-width: 1000px){
  .navbar .brand {
    display: none;
  }
}
{/literal}
{/if}
</style>

{* Do not remove below comment: used for compression by tools/build.php *}
{* -CSS- *}

{/block}

{block name=content}
<div id="fb-root"></div>

{$numericFilters = [
    'same-both-average', 'same-class-average', 'same-professors-average', 'num-students',
	'num-friends', 'difficulty-average', 'number'
]}

<div id="popovers-backup">

	<div class="special-filter-popover popover popover-sort-filter">
		<div class="arrow"></div>
		<div class="popover-inner">
			<h3 class="popover-title">Quick filters</h3>
			<div class="popover-content form-inline">
				<input id="cancelled-filter" type="checkbox" value="1"> <label for="cancelled-filter">Hide cancelled courses</label><br>
				<input id="undergraduate-filter" type="checkbox" value="1"> <label for="undergraduate-filter">Hide graduate courses</label>
			</div>
		</div>
	</div>

	{* A copy of the popovers is saved here in; when the table reloads, they get destroyed *}
	{foreach $numericFilters as $numericFilter}
		<div class="{$numericFilter}-popover popover popover-sort-filter"><div class="arrow"></div><div class="popover-inner">
			{if $numericFilter != 'difficulty-average'}
			<div class="{$numericFilter}-sort">
				<h3 class="popover-title">Sort <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<button class="btn sort-asc-btn">Ascending <i class="icon-arrow-up"></i></button>
					<button class="btn sort-desc-btn">Descending <i class="icon-arrow-down"></i></button>
				</div>
			</div>
			{/if}
			<div class="{$numericFilter}-filter">
				<h3 class="popover-title">Filter <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<span class="control-group"><input type="text" class="input-mini above-input" placeholder="Above"></span>
					<span class="control-group"><input type="text" class="input-mini below-input" placeholder="Below"></span>
					<button class="btn filter-btn pull-right">Filter</button>
					<div style="clear: both"></div>
				</div>
			</div>
			<h3 class="popover-title"><button class="btn close-btn">Close</button></h3>
		</div></div>
	{/foreach}

	{$textFilters = [
		['title', 'Name'], ['professors', 'Professor(s)'], ['locations-summary', 'Location(s)']
	]}

	{foreach $textFilters as $textFilter}
		{$classPrefix = $textFilter[0]}
		{$placeholder = $textFilter[1]}

		<div class="{$classPrefix}-popover popover popover-sort-filter"><div class="arrow"></div><div class="popover-inner">
			<div class="{$classPrefix}-sort">
				<h3 class="popover-title">Sort <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<button class="btn sort-asc-btn">Ascending <i class="icon-arrow-up"></i></button>
					<button class="btn sort-desc-btn">Descending <i class="icon-arrow-down"></i></button>
				</div>
			</div>
			<div class="{$classPrefix}-filter">
				<h3 class="popover-title">Filter <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<span class="control-group"><input type="text" class="input-medium search-filter-input" placeholder="{$placeholder}"></span>
					<button class="btn filter-btn" style="float: right">Filter</button>
					<div style="clear: both"></div>
				</div>
			</div>
			<h3 class="popover-title"><button class="btn close-btn">Close</button></h3>
		</div></div>
	{/foreach}

	{$categoryFilters = [
		['subject', 'Subject', true],
		['skills', 'Skills', true],
		['areas', 'Areas', true],
		['exam-timestamp', 'Exam Groups', false]
	]}

	{foreach $categoryFilters as $categoryFilter}
		{$classPrefix = $categoryFilter[0]}
		{$placeholder = $categoryFilter[1]}
		{$hasAdvancedButton = $categoryFilter[2]}

		<div class="{$classPrefix}-popover popover popover-sort-filter"><div class="arrow"></div><div class="popover-inner">
			<div class="{$classPrefix}-sort">
				<h3 class="popover-title">Sort <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<button class="btn sort-asc-btn">Ascending <i class="icon-arrow-up"></i></button>
					<button class="btn sort-desc-btn">Descending <i class="icon-arrow-down"></i></button>
				</div>
			</div>
			<div class="{$classPrefix}-filter">
				<h3 class="popover-title">Filter <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<select multiple="multiple" data-placeholder="{$placeholder}" style="width: 250px; height: 100px; margin-bottom: 0">
					</select>
					{if $hasAdvancedButton}
					<label class="checkbox" style="margin-top: 5px"><input type="checkbox"> Advanced mode</label>
					{/if}
				</div>
			</div>
			<h3 class="popover-title"><button class="btn close-btn">Close</button></h3>
		</div></div>
	{/foreach}

	<div class="times-popover popover popover-sort-filter"><div class="arrow"></div><div class="popover-inner">
		<div class="times-sort">
			<h3 class="popover-title">Sort <button class="btn clear-btn">Clear</button></h3>
			<div class="popover-content">
				<div class="btn-group weekday-btn-group"><button class="btn">M</button><button class="btn">T</button><button class="btn">W</button><button class="btn">Th</button><button class="btn">F</button></div>
				<div style="margin-top: 7px">
					<button class="btn sort-asc-btn">Earliest first <i class="icon-arrow-up"></i></button>
					<button class="btn sort-desc-btn">Latest first <i class="icon-arrow-down"></i></button>
				</div>
			</div>
		</div>
		<div class="times-filter">
			<h3 class="popover-title">Filter <button class="btn clear-btn">Clear</button></h3>
			<div class="popover-content">
				<div class="btn-group weekday-btn-group"><button class="btn">M</button><button class="btn">T</button><button class="btn">W</button><button class="btn">Th</button><button class="btn">F</button></div>
				<div style="margin-top: 7px" class="input-prepend input-append">
					<div class="btn-group before-after-btn-group"><button class="btn">Before</button><button class="btn">After</button></div>
					<span class="control-group"><input type="text" class="input-mini time-input" placeholder="Time"></span>
					<button class="btn filter-btn">Filter</button>
				</div>
			</div>
		</div>
		<h3 class="popover-title"><button class="btn close-btn">Close</button></h3>
	</div></div>
</div>

<div id="popovers">
</div>

{include file='AboutModal.tpl'}

{include file='NoticeModal.tpl'}

<div class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<a class="brand" href="#">Course<span style="color: #92bcea">Table</span></a>
		<ul class="nav">
			<li class="hide mobile-link"><a href="/Timetable/{$season}">Mobile version</a></li>
			<li class="dropdown">
				<a href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><span id="season-dropdown">{$season|substr:0:4} {if $season % 100 == 1}Spring{elseif $season % 100 == 2}Summer{else}Fall{/if}</span> <b class="caret"></b></a>

				<ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
					{include file='SeasonsDropdown.tpl' availableSeasons=$availableSeasons season=$season}
					<li>
						<a tabindex="-1" href="/EnableEvaluations">Enable evaluations</a>
						<a tabindex="-1" href="/Blog">Events of 2014 Spring</a>
                        <a tabindex="-1" href="?disconnect_facebook">Disconnect Facebook</a>
						<a tabindex="-1" href="?logout">Sign out</a>
					</li>
				</ul>
			</li>

			<li id="nav-about"><a href="#" data-toggle="modal" data-target="#about">Updated {$updated} <i class="icon-question-sign"></i></a></li>
		</ul>
		<ul class="nav pull-right nav-right search-filter">
			<li>
				<div style="margin-top: 5px;">
					{if !$evaluationsEnabled}
						<a class="btn btn-info" href="/EnableEvaluations">Turn on evaluations</a>
					{/if}

					<select class="friend-worksheets-select"></select>
					<button class="btn friend-worksheets-btn"><i class="icon-facebook-sign"></i> <span>Loading</span></button>
                    <a href="#" class="friend-worksheet-refresh" data-toggle="tooltip" data-placement="bottom" title="Refresh friends list to see your recently added friends' courses"><i class="icon-refresh"></i></a>
					<button class="btn worksheet-only-btn">Worksheet</button>
					<span class="btn-group">
						<button class="btn list-table-btn hide"><i class="icon-th"></i></button>
						<button class="btn download-csv-btn hide"><i class="icon-download-alt"></i></button>
					</span>

					<span class="input-append" id="search-container">
						<input type="text" id="search-box" class="input-medium search-filter-input" placeholder="Search (Ctrl-F)">
						<button class="btn clear-btn"><i class="icon-remove"></i></button>
					</span>
				</div>
				<!--<a href="#" style="display: inline-block">&nbsp;{*<i class="icon-cog"></i>*}</a>-->
			</li>
		</ul>
		<span style="clear: both"></span>
	</div>
</div>

<div class="timetableContainer">
	<div class="timetable">
	</div>
	<div class="timetableCoursesContainer">
		<div class="timetableCourses">
		</div>
	</div>
</div>

<div class="loading">
	<div class="alert alert-info">
		<div class="progress progress-striped active">
			<div class="bar" style="width: 100%;"></div>
		</div>
		Loading...<span id="extra-loading"></span>
	</div>
</div>

<div class="tableContainer" style="position: fixed; height: 100%;">
    <table class="dataTable table table-condensed" style="table-layout: fixed; width: 1px">
    </table>
</div>
{/block}

{block name=footer}
<script>
    var table = null;
	{literal}
	var courseIndices = {}; // courseIndices[subject][number][section] = index in data
	{/literal}

    var facebookDataRetrieved = {if $facebookDataRetrieved}true{else}false{/if};
    var facebookNeedsUpdate = {if $facebookNeedsUpdate}true{else}false{/if};
	var coursesTakenPrompted = '{$coursesTakenPrompted}';
    var showNotice = {if $showNotice}true{else}false{/if};
	var season = {$season};
	var netId = '{$netId}';

	var evaluationsEnabled = {if $evaluationsEnabled}true{else}false{/if};
    var forceFull = {if $forceFull}true{else}false{/if};

	{literal}
	function jsonForSeason(season) {
	{/literal}
	{if $evaluationsEnabled}
		return '/GetDataFile.php?season=' + season;
	{else}
		return '/gen/json/data_' + season + '.json';
	{/if}

	{literal}
	}

    if (screen.width <= 699) {
		if (!forceFull) {
			location.href = '/Timetable';
		} else {
			$('.mobile-link').removeClass('hide');
		}
    }


	{/literal}
</script>

{*
Javascript tags must be specified exactly as
<script src="..."></script>
for compressibility purposes by tools/build.php
*}
<script src="/libs/select2/select2.js"></script>

<!-- Templating -->
<script src="/libs/ejs/ejs.js"></script>
<script src="/libs/ejs/ejs_fulljslint.js"></script>
<script src="/js/pack.js"></script>

{* Do not remove below comment: used for compression by tools/build.php *}
{* -JS- *}

{/block}
