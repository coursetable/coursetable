{*
	AboutModal.tpl
	
	Type: template component
	Usage: popovers for containing the "About" page for bluebook

	Variables:
*}
<div class="modal hide fade" id="about">
	{$emails = ['coursetable@elilists.yale.edu']}
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		<h3>About CourseTable</h3>
	</div>
	<div class="modal-body">
		<p><strong>CourseTable</strong> was a project of <a href="http://yaleplus.com/">YalePlus</a> created by <strong>Peter Xu (Yale MC '14) and Harry Yu (Yale SY '14)</strong> and is continuing to be developed by <strong>Yale Computer Society</strong>. It is (as far as we know) the first truly different way to shop for courses.</p>
		<p>For questions, comments, bug reports, suggestions, or hate mail, please email {foreach $emails as $email}<a href="mailto:{$email}">{$email}</a>{if !$email@last} or {/if}{/foreach}.</p>
	</div>
</div>
