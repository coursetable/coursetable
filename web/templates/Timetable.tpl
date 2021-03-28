{*
	Timetable.tpl

	Type: standalone template
	Usage: YalePlus bluebook's mobile-friendly timetable

	Variables:
		$season

    Blocks:
*}
{extends file='Main.tpl'}

{block name=vars}
	{$title = 'CourseTable timetable'}
{/block}

{block name=extraHead}
<link rel="stylesheet" href="/css/bluebook.css">
<link rel="stylesheet" href="/css/modals.css">

<style>
{literal}
	/* Overrides */
	.badges {
		margin-right: 0;
	}

	.content {
		margin-top: 60px;
	}
	.accordion-heading:hover {
		background-color: #0f4b92;
	}

	.accordion-heading:hover a {
		color: #fff;
	}

	.accordion-toggle:hover, .accordion-toggle:active, .accordion-toggle:focus {
		color: #08c;
		text-decoration: none;
	}

	.accordion-toggle.clearfix {
		padding-top: 0;
		padding-bottom: 0;
	}

	.nav-pills {
		margin-bottom: 0;
	}

	.navbar .nav { margin-right: 0; }
	.navbar .brand { padding-right: 5px; }
{/literal}
</style>
{/block}

{block name=beforeContent}
<div class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<a class="brand" href="/Table/{$season}?forceFull">Course<span style="color: #92bcea">Table</span></a>
		<ul class="nav">
			<li><a href="/Table/{$season}?forceFull">Full site</a></li>
			<li class="dropdown">
				<a href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><span id="season-dropdown">Terms</span> <b class="caret"></b></a>

				<ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
					{include file='SeasonsDropdown.tpl' availableSeasons=$availableSeasons season=$season href='/Timetable/<season>'}
				</ul>
			</li>
		</ul>
	</div>
</div>
{/block}

{block name=content}

<div class="content">
	{$days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']}
	{$today = date('l')}
	{while $today !== $days[0] && $today !== 'Saturday' && $today !== 'Sunday'}
		{$days[] = $days[0]}
		{$blah = array_shift($days)}
	{/while}


	<div class="accordion" id="accordion">
	{foreach $days as $day}
		<h4>{$day}{if $day@first} (today){/if}</h4>
		{$coursesOnDay = $courses[$day]}
		{if count($coursesOnDay) === 0}
			<div class="alert alert-info">No courses for the {$day}. <a href="/Table/{$season|escape:html}">Go to CourseTable</a> to add courses to your timetable.</div>
		{/if}

		{foreach $coursesOnDay as $courseInfo}
			{counter name=course assign=courseCounter}
			{$course = $courseInfo['course']}
			{$session = $courseInfo['session']}
		<div class="accordion-group">
			<div class="accordion-heading">
				<a class="accordion-toggle pull-left" data-toggle="collapse" data-parent="#accordion" href="#collapse{$courseCounter}">
					{$course.subject|escape:html}&nbsp;{$course.number|escape:html}
				</a>
				<a class="accordion-toggle pull-right" data-toggle="collapse" data-parent="#accordion" href="#collapse{$courseCounter}">
					{$session[0]|string_format:'%.2f'}-{$session[1]|string_format:'%.2f'}{if $session[2]} in {$session[2]}{/if}
				</a>
				<a class="clearfix accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse{$courseCounter}"></a>
			</div>
			<div id="collapse{$courseCounter}" class="accordion-body collapse">
				<div class="accordion-inner">
					<p>
						<big><strong>{$course.long_title|escape:html}</strong></big>
						<span class="badges">
							{foreach $course.skills as $skill}<span class="badge badge-skill">{$skill|escape:html}</span>{/foreach}
							{foreach $course.areas as $area}<span class="badge badge-area">{$area|escape:html}</span>{/foreach}
						</span>
						<br>
						Taught by <strong>{foreach $course.professors as $professor}{if !$professor@first}, {/if}{$professor|escape:html}{/foreach}</strong><br>
						Meets {$course.times.long_summary|escape:html}
					</p>
					<p>{$course.description|escape:html}</p>
					<ul class="nav nav-pills">
						<li><a href="/Table/{$season}/course/{$course.subject}_{$course.number}_{$course.section}?forceFull">View details on full site</a></li>
						{if $course.syllabus_url}<li><a href="{$course.syllabus_url}">Syllabus</a></li>{/if}
						{if $course.course_home_url}<li><a href="{$course.course_home_url}">Course Home</a></li>{/if}
					</ul>
				</div>
			</div>
		</div>
		{/foreach}
	{/foreach}
</div>
{/block}
