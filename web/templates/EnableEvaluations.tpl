{*
	EnableEvaluations.tpl

	Type: standalone template
	Usage: YalePlus bluebook's separate page for uploading a data file
	       containing the evaluations

	Variables:
		$challengeCourses: courses to challenge for evaluation counts
			Includes keys subject, number, section, season, crn, counts
		$answerHash: hash for the answer
		$answerSalt: salt for the answer

	Blocks:
*}
{extends file='MainWithHeader.tpl'}

{block name=extraHead}
{$smarty.block.parent}
{literal}
<style>
body {
    font-size: 14px;
}
</style>
{/literal}
{/block}

{block name=vars}
	{$title = 'Upload Data Files'}
{/block}

{block name=content}

<div class="content container">
	<h3>Enable evaluations</h3>
	<p><strong>CourseTable's evaluations data is sourced by Yale students, for Yale students.</strong> As a result, we need to verify that you have access to the evaluations before you get to see them.</p>

	<p><a href="/Blog">Learn more about why this page exists here.</a></p>

	<div class="row">
		<div class="span6 offset3"><div class="well">
			<h5>Answer these questions:</h5>
			<div id="questionMessage" class="alert hide"></div>

			<form action="/ProcessEnableEvaluations.php" method="post" id="questions">
				<input type="hidden" name="answer" value="{$answerHash|escape:html}">
				<input type="hidden" name="salt" value="{$answerSalt|escape:html}">
				{foreach $challengeCourses as $course}
					{$year = substr($course['season'], 0, 4)}
					{$season = substr($course['season'], 4, 2)}
					{if $season === '01'}
						{$term = 'Spring'}
					{elseif $season === '02'}
						{$term = 'Summer'}
					{elseif $season === '03'}
						{$term = 'Fall'}
					{/if}
					<div id="questionTemplate">
						<label>How many people rated the course's overall assessment as "Good" for <strong>
							<span class="subject">{$course.subject}</span>
							<span class="number">{$course.number}</span>
							<span class="section">{substr("0`$course['section']`", -2)}</span> in
							<span class="season">{$term}</span>
							<span class="year">{$year}</span>?
						</strong>
						<a href="https://oce.app.yale.edu/oce-viewer/studentSummary/index?crn={$course.crn}&term_code={$course.season}" class="link" target="_blank">Check on Yale OCE</a></label>
						<input name="ratings[]" type="number" placeholder="# of students">
					</div>
				{/foreach}
				<button type="submit" class="btn">Submit</button>
			</form>
		</div></div>
	</div>
</div>
{/block}

{block name=footer}
{literal}
<script src="/libs/jqueryform/jquery.form.min.js"></script>
<script>
	$(document).ready(function() {
		$('.tooltips').tooltip();

		$('#questions').ajaxForm({
			dataType: 'json',
			beforeSubmit: function() {
				$('#questions button').prop('disabled', true);
			},
			success: function(data) {
				$('#questionMessage').show().html(data.messages.join('<br>'));
				if (data.success) {
					$('#questionMessage').removeClass('alert-error').addClass('alert-success');
				} else {
					$('#questionMessage').addClass('alert-error').removeClass('alert-success');
					$('#questions button').prop('disabled', false);
				}
			}
		});
	});
</script>
{/literal}
{/block}
