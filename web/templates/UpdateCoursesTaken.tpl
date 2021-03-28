{*
	UpdateCoursesTaken.tpl

	Type: standalone template
	Usage: YalePlus bluebook's separate page for uploading a list of the
		   courses you've taken

	Variables:

	Blocks:
*}
{extends file='Main.tpl'}

{block name=extraHead}
<link rel='stylesheet' href='/css/bluebook.css'>
<style>
.navbar {
	position: static;
}

.navbar .brand {
	display: block !important;
}

.sis-iframe {
	display: block;
	margin: 10px;
	width: 550px;
	height: 450px;
	float: right;
	border: 0;
	-webkit-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
	-moz-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
	box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
}

#step3 img {
	-webkit-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
	-moz-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
	box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
	margin: 15px 0;
}

.content {
	width: 990px;
	margin: 10px 20px;
	font-size: 14px;
}

#paste-box {
	width: 400px;
	display: block;
}

#step2, #step3, .updating-loading, .mac-only, .detailed-instructions {
	display: none;
}
</style>
{/block}

{block name=footer}
{literal}
<script>
function seasonTextToNumber(seasonText, yearText) {
    var seasonNumber;
    if (seasonText === 'Spring') {
        seasonNumber = '01';
    } else if (seasonText == 'Summer') {
        seasonNumber = '02';
    } else {
        seasonNumber = '03';
    }
    
    return parseInt(yearText + seasonNumber);
}

function seasonNumberToText(seasonNumber) {
	if (seasonNumber == 0) {
		return 'Any';
	}
	
	var semesterNumber = seasonNumber % 100;
	var year = Math.floor(seasonNumber / 100);
	var semesterText = 0;
	if (semesterNumber === 1) {
		semesterText = 'Spring';
	} else if (semesterNumber === 2) {
		semesterText = 'Summer';
	} else {
		semesterText = 'Fall';
	}
	
	return semesterText + ' ' + year;
}

function findSeasonIndexes(text) {
    var seasonRe = /(Spring|Fall|Summer)\s+([0-9]{4})/g;
    var seasonIndexes = [];
    
    var m;
    while (m = seasonRe.exec(text)) {
        var seasonNumber = seasonTextToNumber(m[1], m[2]);
        seasonIndexes.push([seasonNumber, m.index]);
    }
    
    return seasonIndexes;
}

function findSeasonForCourseAtIndex(index, seasonIndexes) {
    for (var i = seasonIndexes.length - 1; i >= 0; i--) {
        var season = seasonIndexes[i][0];
        var seasonIndex = seasonIndexes[i][1];
        
        if (index >= seasonIndex) {
            return season;
        }
    }
    
    return 0;
}

function getCoursesBySeason(text, seasonIndexes) {
    var re = /^([A-Za-z&]{3,4})\s+([A-Za-z]?[0-9]{2,5}[A-Za-z]?)/gm;
    var coursesBySeason = {};
    
    var m;
    while (m = re.exec(text)) {
        var season = findSeasonForCourseAtIndex(m.index, seasonIndexes);
        if (!coursesBySeason.hasOwnProperty(season)) {
            coursesBySeason[season] = [];
        }
		
		var subject = m[1].toUpperCase();
		var courseIsSeason = subject === 'FALL' || subject === 'SPRING' || subject === 'SUMMER';
		if (!courseIsSeason) {
			coursesBySeason[season].push(m[1].toUpperCase() + ' ' + m[2].toUpperCase());
		}
    }
	
    re = /^([A-Za-z&]{3,4})([0-9]{3}[A-Za-z]?)/gm;
    while (m = re.exec(text)) {
        if (!coursesBySeason.hasOwnProperty(0)) {
            coursesBySeason[0] = [];
        }
        coursesBySeason[0].push(m[1].toUpperCase() + ' ' + m[2].toUpperCase());
    }
    
    return coursesBySeason;
}

function populatePreviewTable(coursesBySeason) {
	var seasons = Object.keys(coursesBySeason);
	seasons.sort();

	var seasonRows = [];
	for (var i = 0; i < seasons.length; i++) {
		var seasonNumber = seasons[i];
		var seasonText = seasonNumberToText(seasonNumber);
		var courses = coursesBySeason[seasonNumber];
		var coursesText = coursesBySeason[seasonNumber].join(', ');
		seasonRows.push('<td>' + seasonText + '</td><td>' + coursesText + '</td>');
	}
	
	var seasonRows = '<tr>' + seasonRows.join('</tr><tr>') + '</tr>';
	
	$('#preview-tbody').html(seasonRows);
}

$(document).ready(function() {
	var isMac = navigator.platform.toLowerCase().indexOf('mac') >= 0;
	if (isMac) {
		$('.mac-only').show();
		$('.non-mac').hide();
	}

	$('#next-1').click(function(event) {
		event.preventDefault();
	
		var text = $('#paste-box').val();
		var seasonIndexes = findSeasonIndexes(text);
		var coursesBySeason = getCoursesBySeason(text, seasonIndexes);
		
		if (Object.keys(coursesBySeason).length === 0) {
			$('#paste-error').text('No classes were found! Please make sure you highlight and copy the entire page titled "Unofficial Academic Record"');
			return;
		}

		$('#paste-error').text('');
		
		populatePreviewTable(coursesBySeason);
		$('#courses-by-season-json').val(JSON.stringify(coursesBySeason));
		$('#step1 iframe').attr('src', 'https://www.sis.yale.edu/pls/ban1/tybkbnr.main');
		$('#step1').hide();
		$('#step2').show();
		
	});
	
	$('#back-2').click(function(event) {
		event.preventDefault();
		$('#step2').hide();
		$('#step1').show();
	});
		
	
	$('#next-2').click(function(event) {
		event.preventDefault();
	
		var coursesBySeason = $('#courses-by-season-json').val();
		$('#step2 .updating-loading').show();
		$.post('/SendCoursesTaken.php', {courses: coursesBySeason}, function(data) {
			$('#step2 .updating-loading').hide();
			$('#step3').show();
			$('#step2').hide();
		});
	});
	
	$('.skip-link').click(function(event) {
		event.preventDefault();
		
		$('#step2 .updating-loading').show();
		$.post('/SendCoursesTaken.php', {courses: {}}, function(data) {
			$('#step2 .updating-loading').hide();
			window.location.href = '/Bluebook';
		});
	});
	
	$('.show-hide-instructions').click(function(event) {
		$('.detailed-instructions').toggle();
		$('.show-instructions').toggle();
	});
});
</script>
{/literal}
{/block}

{block name=content}
<div class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<span class="brand">Bluebook<span style="color: #92bcea">+</span></span>
	</div>
</div>

<div class="content">
	<div id="step1">
		<iframe class="sis-iframe" src="https://www.sis.yale.edu/pls/ban1/tybkbnr.main"></iframe>
		<p style="font-size: 16px; line-height: 22px"><strong>See which courses your friends have taken!</strong><br>
		<p><strong>Enter your favourite courses below one per line</strong> or follow the directions below to import your course history and see your friends' past courses.</strong></p>
		<p><a href="#" class="show-hide-instructions show-instructions">Show instructions</a></p>
		<div class="detailed-instructions">
			<p><a class="show-hide-instructions" href="#">Hide instructions</a></p>
			<p><strong>Step 1: </strong>Click on the <strong>"Academics"</strong> button.</p>
			<p><strong>Step 2: </strong>Click on the <strong>"Grades for All Terms"</strong> box.</p>
			<p><strong>Step 3: </strong>Click on the grey <strong>"Submit"</strong> button.</p>
			<p><strong>Step 4: </strong>Copy the information for all of your courses and paste it into the box below.</p>
			<p><strong>To do this manually: </strong>simply type each course code below, one on each line.</p>
			<p><strong>To do this automatically: </strong>click on the window and press <span class="non-mac">Ctrl+A and then Ctrl+C</span><span class="mac-only">&#x2318;-A and then &#x2318;-C</span> to copy its contents.</p>
			<p><em><strong>Note: </strong>We do not receive your grades: they are never sent to our server.</em></p>
			<p><strong>Step 5: </strong>Press "Next" and verify the courses.</p>
		</div>
		<form action="">
			<textarea id="paste-box" rows="4" placeholder="Enter or paste your courses here: e.g.                                           ENGL 120                                                                                                  PSYC 110"></textarea>
			<div id="paste-error" class="text-error"></div>
			<button id="next-1" class="btn" style="margin: 10px 0; display: block">Next</button>
			<a href="#" class="skip-link">I do not want to share my past courses or see my friends' courses</a>
		</form>
	</div>
	
	<div id="step2">
		<table class="table">
			<thead><tr><th>Semester</th><th>Courses</th></tr></thead>
			<tbody id="preview-tbody"></tbody>
		</table>
		<p>Please ensure that these classes look correct, and then submit the data.</p>
		<form action="">
			<input id="courses-by-season-json" type="hidden">
			<button id="back-2" class="btn">Back</button> <button id="next-2" class="btn btn-primary">Submit</button>
		</form>
	</div>
	
	<div id="step3">
		We've recorded your course codes! A box showing <strong>"Friends who took this"</strong> should show up if your friends have updated your preferences.<br>
		<a class="btn" href="/Bluebook" style="margin-top: 10px">Continue to the Bluebook</a>
		<img src="/res/friends.png" alt="'Friends who took this' will show up">
	</div>
	
	<div class="updating-loading">
		<div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div>
	</div>
</div>
{/block}

