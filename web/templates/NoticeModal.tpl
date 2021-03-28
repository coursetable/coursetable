{*
	NoticeModal.tpl
	
	Type: template component
	Usage: popovers for containing the "Notice" page for CourseTable

	Variables:
*}
<div class="modal fade" id="notice" style="top: 5%; width: 800px; margin-left: -400px; left: 50%">
	{$emails = ['coursetable@elilists.yale.edu']}
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		<!--<h3>Textbooks and Updates</h3>-->
        <h3>Tutorial</h3>
	</div>
	<div class="modal-body">
		<!--<div class="alert"><strong>Warning:</strong> Some course times might be different from those listed in the <a href="http://catalog.yale.edu/ycps/">YCPS (Yale College Programs of Study)</a> because Yale's database is out of date. When in doubt, assume that times on the YCPS website are correct.</div>-->
		<img id="tutorial-image" src="/res/tutorial-0.png" alt="Guide to using CourseTable" />
        <!--
        <p>As school starts, we're making CourseTable better so that it can do everything you want it to do. On request, we have added:</p>
        <img src="/res/textbook.png" alt="Textbooks">
        <p><strong>Textbook lists and comparison</strong> based on prices on Amazon and at the Yale Bookstore. Click on <i class="icon-book"></i> Textbooks when viewing a course to check it out.</p>
        <hr>
        <img src="/res/timetable.png" alt="Timetable">
        <p><strong>Timetable view</strong> for seeing your and your friends' classes. Just click <i class="icon-th"></i> and you will see your week, laid out for you.</p>
        <hr>
        <p><strong>Export to Excel</strong> your worksheet so that you can print and manage it there. Click the <i class="icon-download-alt"></i> button to download a .csv file.</p>
        -->
	</div>
  <div class="modal-footer">
    <a href="#" id="tutorial-button-1" class="btn btn-success tutorial-button">Next</a>  
    <a href="#" id="tutorial-button-2" class="btn btn-success" data-dismiss="modal" style="display: none">Take me to CourseTable</a>
  </div>
</div>
