{*
	AboutModal.tpl
	
	Type: template component
	Usage: popovers for containing the "About" page for bluebook

	Variables:
*}
<div class="modal hide fade" id="about">
	{$emails = ['px.peter.xu@gmail.com', 'hy.harry.yu@gmail.com']}
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		<h3>About CourseTable</h3>
	</div>
	<div class="modal-body">
		<p><strong>CourseTable</strong> is a project of <a href="http://yaleplus.com/">YalePlus</a>, and is (as far as we know) the first truly different way to shop for courses.
		<p>For questions, comments, bug reports, suggestions, or hate mail, please email {foreach $emails as $email}<a href="mailto:{$email}">{$email}</a>{if !$email@last} or {/if}{/foreach}.</p>
	</div>
</div>
