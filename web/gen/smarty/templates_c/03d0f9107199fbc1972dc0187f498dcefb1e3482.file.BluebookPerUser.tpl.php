<?php /* Smarty version Smarty-3.1.12, created on 2021-03-03 20:21:51
         compiled from "/usr/share/nginx/html/web/templates/BluebookPerUser.tpl" */ ?>
<?php /*%%SmartyHeaderCode:4863924425e3f2f9796f747-04033519%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '03d0f9107199fbc1972dc0187f498dcefb1e3482' => 
    array (
      0 => '/usr/share/nginx/html/web/templates/BluebookPerUser.tpl',
      1 => 1614802910,
      2 => 'file',
    ),
    '8d6179c42396f272c2f7cadb18f21f5d055e2da1' => 
    array (
      0 => '/usr/share/nginx/html/web/templates/Main.tpl',
      1 => 1614800343,
      2 => 'file',
    ),
    'ac1c76bee830def07c3e3c8cf3ca2c791e9739cc' => 
    array (
      0 => '/usr/share/nginx/html/web/templates/AboutModal.tpl',
      1 => 1581197815,
      2 => 'file',
    ),
    '3bec28765b1c087dd84f849957753d49d8ece9d3' => 
    array (
      0 => '/usr/share/nginx/html/web/templates/NoticeModal.tpl',
      1 => 1581197815,
      2 => 'file',
    ),
    '100399a5cdfe30bb7b8df0d7fc67ba89afbbbfac' => 
    array (
      0 => '/usr/share/nginx/html/web/templates/SeasonsDropdown.tpl',
      1 => 1581197815,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '4863924425e3f2f9796f747-04033519',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5e3f2f97bd3af3_48175303',
  'variables' => 
  array (
    'title' => 0,
    'keywords' => 0,
    'description' => 0,
    'robots' => 0,
    'author' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5e3f2f97bd3af3_48175303')) {function content_5e3f2f97bd3af3_48175303($_smarty_tpl) {?>

<?php $_smarty_tpl->tpl_vars['siteName'] = new Smarty_variable('CourseTable', null, 0);?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title><?php echo $_smarty_tpl->tpl_vars['title']->value;?>
</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php if (isset($_smarty_tpl->tpl_vars['keywords']->value)){?><meta name="keywords" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['keywords']->value, ENT_QUOTES, 'UTF-8', true);?>
"><?php }?>
<?php if (isset($_smarty_tpl->tpl_vars['description']->value)){?><meta name="description" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['description']->value, ENT_QUOTES, 'UTF-8', true);?>
"><?php }?>
<?php if (isset($_smarty_tpl->tpl_vars['robots']->value)){?><meta name="robots" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['robots']->value, ENT_QUOTES, 'UTF-8', true);?>
"><?php }?>
<?php if (isset($_smarty_tpl->tpl_vars['author']->value)){?><meta name="author" content="<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['author']->value, ENT_QUOTES, 'UTF-8', true);?>
"><?php }?>

    <!-- Le styles -->
    <link href="/libs/bootstrap-2.3.2/css/bootstrap.css" rel="stylesheet">
    <link href="/libs/fontawesome/css/font-awesome.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <!--
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/libs/bootstrap/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/libs/bootstrap/ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/libs/bootstrap/ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="/libs/bootstrap/ico/apple-touch-icon-57-precomposed.png">
    -->
    <link rel="icon" href="/favicon.png" type="image/png" />
    <link rel="shortcut icon" href="/favicon.png">

    <!-- analytics -->
    <script async defer data-website-id="c5761971-088c-47ee-911c-2d5429fd651d" src="https://umami.coursetable.com/umami.js"></script>



<link href="/libs/select2/select2.css" rel="stylesheet"> 
<link rel="stylesheet" href="/css/sortfilter.css">
<link rel="stylesheet" href="/css/bluebook.css">
<link rel="stylesheet" href="/css/modals.css">
<link rel="stylesheet" href="/css/timetable.css">
<link rel="stylesheet" href="/css/custom-timetable.css">

<style>
<?php if ($_smarty_tpl->tpl_vars['evaluationsEnabled']->value){?>

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

<?php }else{ ?>

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

<?php }?>
</style>






</head>

<body>



<div id="fb-root"></div>

<?php $_smarty_tpl->tpl_vars['numericFilters'] = new Smarty_variable(array('same-both-average','same-class-average','same-professors-average','num-students','num-friends','difficulty-average','number'), null, 0);?>

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

	
	<?php  $_smarty_tpl->tpl_vars['numericFilter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['numericFilter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['numericFilters']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['numericFilter']->key => $_smarty_tpl->tpl_vars['numericFilter']->value){
$_smarty_tpl->tpl_vars['numericFilter']->_loop = true;
?>
		<div class="<?php echo $_smarty_tpl->tpl_vars['numericFilter']->value;?>
-popover popover popover-sort-filter"><div class="arrow"></div><div class="popover-inner">
			<?php if ($_smarty_tpl->tpl_vars['numericFilter']->value!='difficulty-average'){?>
			<div class="<?php echo $_smarty_tpl->tpl_vars['numericFilter']->value;?>
-sort">
				<h3 class="popover-title">Sort <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<button class="btn sort-asc-btn">Ascending <i class="icon-arrow-up"></i></button>
					<button class="btn sort-desc-btn">Descending <i class="icon-arrow-down"></i></button>
				</div>
			</div>
			<?php }?>
			<div class="<?php echo $_smarty_tpl->tpl_vars['numericFilter']->value;?>
-filter">
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
	<?php } ?>

	<?php $_smarty_tpl->tpl_vars['textFilters'] = new Smarty_variable(array(array('title','Name'),array('professors','Professor(s)'),array('locations-summary','Location(s)')), null, 0);?>

	<?php  $_smarty_tpl->tpl_vars['textFilter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['textFilter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['textFilters']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['textFilter']->key => $_smarty_tpl->tpl_vars['textFilter']->value){
$_smarty_tpl->tpl_vars['textFilter']->_loop = true;
?>
		<?php $_smarty_tpl->tpl_vars['classPrefix'] = new Smarty_variable($_smarty_tpl->tpl_vars['textFilter']->value[0], null, 0);?>
		<?php $_smarty_tpl->tpl_vars['placeholder'] = new Smarty_variable($_smarty_tpl->tpl_vars['textFilter']->value[1], null, 0);?>

		<div class="<?php echo $_smarty_tpl->tpl_vars['classPrefix']->value;?>
-popover popover popover-sort-filter"><div class="arrow"></div><div class="popover-inner">
			<div class="<?php echo $_smarty_tpl->tpl_vars['classPrefix']->value;?>
-sort">
				<h3 class="popover-title">Sort <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<button class="btn sort-asc-btn">Ascending <i class="icon-arrow-up"></i></button>
					<button class="btn sort-desc-btn">Descending <i class="icon-arrow-down"></i></button>
				</div>
			</div>
			<div class="<?php echo $_smarty_tpl->tpl_vars['classPrefix']->value;?>
-filter">
				<h3 class="popover-title">Filter <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<span class="control-group"><input type="text" class="input-medium search-filter-input" placeholder="<?php echo $_smarty_tpl->tpl_vars['placeholder']->value;?>
"></span>
					<button class="btn filter-btn" style="float: right">Filter</button>
					<div style="clear: both"></div>
				</div>
			</div>
			<h3 class="popover-title"><button class="btn close-btn">Close</button></h3>
		</div></div>
	<?php } ?>

	<?php $_smarty_tpl->tpl_vars['categoryFilters'] = new Smarty_variable(array(array('subject','Subject',true),array('skills','Skills',true),array('areas','Areas',true),array('exam-timestamp','Exam Groups',false)), null, 0);?>

	<?php  $_smarty_tpl->tpl_vars['categoryFilter'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['categoryFilter']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['categoryFilters']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['categoryFilter']->key => $_smarty_tpl->tpl_vars['categoryFilter']->value){
$_smarty_tpl->tpl_vars['categoryFilter']->_loop = true;
?>
		<?php $_smarty_tpl->tpl_vars['classPrefix'] = new Smarty_variable($_smarty_tpl->tpl_vars['categoryFilter']->value[0], null, 0);?>
		<?php $_smarty_tpl->tpl_vars['placeholder'] = new Smarty_variable($_smarty_tpl->tpl_vars['categoryFilter']->value[1], null, 0);?>
		<?php $_smarty_tpl->tpl_vars['hasAdvancedButton'] = new Smarty_variable($_smarty_tpl->tpl_vars['categoryFilter']->value[2], null, 0);?>

		<div class="<?php echo $_smarty_tpl->tpl_vars['classPrefix']->value;?>
-popover popover popover-sort-filter"><div class="arrow"></div><div class="popover-inner">
			<div class="<?php echo $_smarty_tpl->tpl_vars['classPrefix']->value;?>
-sort">
				<h3 class="popover-title">Sort <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<button class="btn sort-asc-btn">Ascending <i class="icon-arrow-up"></i></button>
					<button class="btn sort-desc-btn">Descending <i class="icon-arrow-down"></i></button>
				</div>
			</div>
			<div class="<?php echo $_smarty_tpl->tpl_vars['classPrefix']->value;?>
-filter">
				<h3 class="popover-title">Filter <button class="btn clear-btn">Clear</button></h3>
				<div class="popover-content">
					<select multiple="multiple" data-placeholder="<?php echo $_smarty_tpl->tpl_vars['placeholder']->value;?>
" style="width: 250px; height: 100px; margin-bottom: 0">
					</select>
					<?php if ($_smarty_tpl->tpl_vars['hasAdvancedButton']->value){?>
					<label class="checkbox" style="margin-top: 5px"><input type="checkbox"> Advanced mode</label>
					<?php }?>
				</div>
			</div>
			<h3 class="popover-title"><button class="btn close-btn">Close</button></h3>
		</div></div>
	<?php } ?>

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

<?php /*  Call merged included template "AboutModal.tpl" */
$_tpl_stack[] = $_smarty_tpl;
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate('AboutModal.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0, '4863924425e3f2f9796f747-04033519');
content_603fefdf403df3_72764528($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "AboutModal.tpl" */?>

<?php /*  Call merged included template "NoticeModal.tpl" */
$_tpl_stack[] = $_smarty_tpl;
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate('NoticeModal.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0, '4863924425e3f2f9796f747-04033519');
content_603fefdf40e017_03544240($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "NoticeModal.tpl" */?>

<div class="navbar navbar-fixed-top">
  <div class="text-center" style="font-size: 16px; background-color: #ffb5b5; font-weight: 500; padding: 5px">
    We will be shutting down this site on April 1st. Please check out the <a href="https://coursetable.com">updated site</a> instead!
  </div>
	<div class="navbar-inner">
		<a class="brand" href="#">Course<span style="color: #92bcea">Table</span></a>
		<ul class="nav">
			<li class="hide mobile-link"><a href="/Timetable/<?php echo $_smarty_tpl->tpl_vars['season']->value;?>
">Mobile version</a></li>
			<li class="dropdown">
				<a href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><span id="season-dropdown"><?php echo substr($_smarty_tpl->tpl_vars['season']->value,0,4);?>
 <?php if ($_smarty_tpl->tpl_vars['season']->value%100==1){?>Spring<?php }elseif($_smarty_tpl->tpl_vars['season']->value%100==2){?>Summer<?php }else{ ?>Fall<?php }?></span> <b class="caret"></b></a>

				<ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
					<?php /*  Call merged included template "SeasonsDropdown.tpl" */
$_tpl_stack[] = $_smarty_tpl;
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate('SeasonsDropdown.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('availableSeasons'=>$_smarty_tpl->tpl_vars['availableSeasons']->value,'season'=>$_smarty_tpl->tpl_vars['season']->value), 0, '4863924425e3f2f9796f747-04033519');
content_603fefdf424455_08289396($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "SeasonsDropdown.tpl" */?>
					<li>
            <?php if (!$_smarty_tpl->tpl_vars['evaluationsEnabled']->value){?>
              <a tabindex="-1" href="/EnableEvaluations">Enable evaluations</a>
            <?php }?>
						<a tabindex="-1" href="/Blog">Events of 2014 Spring</a>
                        <a tabindex="-1" href="?disconnect_facebook">Disconnect Facebook</a>
						<a tabindex="-1" href="?logout">Sign out</a>
					</li>
				</ul>
			</li>

            <li id="nav-about"><a href="#" data-toggle="modal" data-target="#about">Updated <?php echo $_smarty_tpl->tpl_vars['updated']->value;?>
 <i class="icon-question-sign"></i></a></li>

			<li id="nav-beta"><a href="https://coursetable.com">Try the new site <i class="icon-external-link"></i></a></li>
		</ul>
		<ul class="nav pull-right nav-right search-filter">
			<li>
				<div style="margin-top: 5px;">
					<?php if (!$_smarty_tpl->tpl_vars['evaluationsEnabled']->value){?>
						<a class="btn btn-info" href="/EnableEvaluations">Turn on evaluations</a>
					<?php }?>

					<select class="friend-worksheets-select"></select>
					<button class="btn friend-worksheets-btn"><i class="icon-facebook-sign"></i> <span>Loading</span></button>
                    <a href="#" class="friend-worksheet-refresh" data-toggle="tooltip" data-placement="bottom" title="Refresh friends list to see your recently added friends' courses"><i class="icon-refresh"></i></a>
					<button class="btn worksheet-only-btn">Worksheet</button>
					<span class="btn-group">
						<button class="btn list-table-btn hide"><i class="icon-th"></i></button>
						<button class="btn download-csv-btn hide"><i class="icon-download-alt"></i></button>
            <button class="btn download-ics-btn hide"><i class="icon-calendar"></i></button>
					</span>

					<span class="input-append" id="search-container">
						<input type="text" id="search-box" class="input-medium search-filter-input" placeholder="Search (Ctrl-F)">
						<button class="btn clear-btn"><i class="icon-remove"></i></button>
					</span>
				</div>
				<!--<a href="#" style="display: inline-block">&nbsp;</a>-->
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

<div class="tableContainer" style="position: fixed; height: 100%; margin-top: 30px">
    <table class="dataTable table table-condensed" style="table-layout: fixed; width: 1px">
    </table>
</div>


<!-- Le javascript
        ================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js"></script>
<script src="/libs/bootstrap-2.3.2/js/bootstrap.js"></script>
<script src="/js/fb.js"></script>


<script>
    var table = null;
	
	var courseIndices = {}; // courseIndices[subject][number][section] = index in data
	

    var facebookDataRetrieved = <?php if ($_smarty_tpl->tpl_vars['facebookDataRetrieved']->value){?>true<?php }else{ ?>false<?php }?>;
    var facebookNeedsUpdate = <?php if ($_smarty_tpl->tpl_vars['facebookNeedsUpdate']->value){?>true<?php }else{ ?>false<?php }?>;
	var coursesTakenPrompted = '<?php echo $_smarty_tpl->tpl_vars['coursesTakenPrompted']->value;?>
';
    var showNotice = <?php if ($_smarty_tpl->tpl_vars['showNotice']->value){?>true<?php }else{ ?>false<?php }?>;
	var season = <?php echo $_smarty_tpl->tpl_vars['season']->value;?>
;
	var netId = '<?php echo $_smarty_tpl->tpl_vars['netId']->value;?>
';

	var evaluationsEnabled = <?php if ($_smarty_tpl->tpl_vars['evaluationsEnabled']->value){?>true<?php }else{ ?>false<?php }?>;
    var forceFull = <?php if ($_smarty_tpl->tpl_vars['forceFull']->value){?>true<?php }else{ ?>false<?php }?>;

	
	function jsonForSeason(season) {
	
	<?php if ($_smarty_tpl->tpl_vars['evaluationsEnabled']->value){?>
		return '/GetDataFile.php?season=' + season;
	<?php }else{ ?>
		return '/gen/json/data_' + season + '.json';
	<?php }?>

	
	}

    if (screen.width <= 699) {
		if (!forceFull) {
			location.href = '/Timetable';
		} else {
			$('.mobile-link').removeClass('hide');
		}
    }


	
</script>


<script src="/libs/select2/select2.js"></script>

<!-- Templating -->
<script src="/libs/ejs/ejs.js"></script>
<script src="/libs/ejs/ejs_fulljslint.js"></script>
<script src="/js/pack.js"></script>







<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-53419058-1', 'auto');
  ga('send', 'pageview');

</script>


</body>
</html>
<?php }} ?><?php /* Smarty version Smarty-3.1.12, created on 2021-03-03 20:21:51
         compiled from "/usr/share/nginx/html/web/templates/AboutModal.tpl" */ ?>
<?php if ($_valid && !is_callable('content_603fefdf403df3_72764528')) {function content_603fefdf403df3_72764528($_smarty_tpl) {?>
<div class="modal hide fade" id="about">
	<?php $_smarty_tpl->tpl_vars['emails'] = new Smarty_variable(array('coursetable@elilists.yale.edu'), null, 0);?>
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		<h3>About CourseTable</h3>
	</div>
	<div class="modal-body">
		<p><strong>CourseTable</strong> was a project of <a href="http://yaleplus.com/">YalePlus</a> created by <strong>Peter Xu (Yale MC '14) and Harry Yu (Yale SY '14)</strong> and is continuing to be developed by <strong>Yale Computer Society</strong>. It is (as far as we know) the first truly different way to shop for courses.</p>
		<p>For questions, comments, bug reports, suggestions, or hate mail, please email <?php  $_smarty_tpl->tpl_vars['email'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['email']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['emails']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['email']->total= $_smarty_tpl->_count($_from);
 $_smarty_tpl->tpl_vars['email']->iteration=0;
foreach ($_from as $_smarty_tpl->tpl_vars['email']->key => $_smarty_tpl->tpl_vars['email']->value){
$_smarty_tpl->tpl_vars['email']->_loop = true;
 $_smarty_tpl->tpl_vars['email']->iteration++;
 $_smarty_tpl->tpl_vars['email']->last = $_smarty_tpl->tpl_vars['email']->iteration === $_smarty_tpl->tpl_vars['email']->total;
?><a href="mailto:<?php echo $_smarty_tpl->tpl_vars['email']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['email']->value;?>
</a><?php if (!$_smarty_tpl->tpl_vars['email']->last){?> or <?php }?><?php } ?>.</p>
	</div>
</div>
<?php }} ?><?php /* Smarty version Smarty-3.1.12, created on 2021-03-03 20:21:51
         compiled from "/usr/share/nginx/html/web/templates/NoticeModal.tpl" */ ?>
<?php if ($_valid && !is_callable('content_603fefdf40e017_03544240')) {function content_603fefdf40e017_03544240($_smarty_tpl) {?>
<div class="modal fade" id="notice" style="top: 5%; width: 800px; margin-left: -400px; left: 50%">
	<?php $_smarty_tpl->tpl_vars['emails'] = new Smarty_variable(array('coursetable@elilists.yale.edu'), null, 0);?>
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
<?php }} ?><?php /* Smarty version Smarty-3.1.12, created on 2021-03-03 20:21:51
         compiled from "/usr/share/nginx/html/web/templates/SeasonsDropdown.tpl" */ ?>
<?php if ($_valid && !is_callable('content_603fefdf424455_08289396')) {function content_603fefdf424455_08289396($_smarty_tpl) {?><?php if (!is_callable('smarty_modifier_replace')) include '/usr/share/nginx/html/web/libs/smarty/plugins/modifier.replace.php';
?>

<?php if (!isset($_smarty_tpl->tpl_vars['href']->value)||!$_smarty_tpl->tpl_vars['href']->value){?>
	<?php $_smarty_tpl->tpl_vars['href'] = new Smarty_variable('#', null, 0);?>
<?php }?>

<?php $_smarty_tpl->tpl_vars['seasonsByYear'] = new Smarty_variable(array(), null, 0);?>
<?php  $_smarty_tpl->tpl_vars['availableSeason'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['availableSeason']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['availableSeasons']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['availableSeason']->key => $_smarty_tpl->tpl_vars['availableSeason']->value){
$_smarty_tpl->tpl_vars['availableSeason']->_loop = true;
?>
	<?php $_smarty_tpl->tpl_vars['year'] = new Smarty_variable(substr($_smarty_tpl->tpl_vars['availableSeason']->value,0,4), null, 0);?>
	<?php $_smarty_tpl->tpl_vars['yearSeason'] = new Smarty_variable(substr($_smarty_tpl->tpl_vars['availableSeason']->value,4,2), null, 0);?>
	<?php $_smarty_tpl->createLocalArrayVariable('seasonsByYear', null, 0);
$_smarty_tpl->tpl_vars['seasonsByYear']->value[$_smarty_tpl->tpl_vars['year']->value][] = $_smarty_tpl->tpl_vars['yearSeason']->value;?>
	<?php $_smarty_tpl->tpl_vars['success'] = new Smarty_variable(rsort($_smarty_tpl->tpl_vars['seasonsByYear']->value[$_smarty_tpl->tpl_vars['year']->value]), null, 0);?>
<?php } ?>
<?php $_smarty_tpl->tpl_vars['success'] = new Smarty_variable(krsort($_smarty_tpl->tpl_vars['seasonsByYear']->value), null, 0);?>
<?php  $_smarty_tpl->tpl_vars['seasons'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['seasons']->_loop = false;
 $_smarty_tpl->tpl_vars['year'] = new Smarty_Variable;
 $_from = $_smarty_tpl->tpl_vars['seasonsByYear']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['seasons']->key => $_smarty_tpl->tpl_vars['seasons']->value){
$_smarty_tpl->tpl_vars['seasons']->_loop = true;
 $_smarty_tpl->tpl_vars['year']->value = $_smarty_tpl->tpl_vars['seasons']->key;
?>
<li class="dropdown-submenu">
	<a tabindex="-1" href="#" class="year-link" onclick="return preventDefault(event);"><?php echo $_smarty_tpl->tpl_vars['year']->value;?>
</a>
	<ul class="dropdown-menu">
	<?php  $_smarty_tpl->tpl_vars['availableSeason'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['availableSeason']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['seasons']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['availableSeason']->key => $_smarty_tpl->tpl_vars['availableSeason']->value){
$_smarty_tpl->tpl_vars['availableSeason']->_loop = true;
?>
		<li><a tabindex="-1" href="<?php echo smarty_modifier_replace($_smarty_tpl->tpl_vars['href']->value,'<season>',((string)$_smarty_tpl->tpl_vars['year']->value).((string)$_smarty_tpl->tpl_vars['availableSeason']->value));?>
" class="season-link" data-season="<?php echo $_smarty_tpl->tpl_vars['year']->value;?>
<?php echo $_smarty_tpl->tpl_vars['availableSeason']->value;?>
"><?php if ($_smarty_tpl->tpl_vars['availableSeason']->value%100==1){?>Spring<?php }elseif($_smarty_tpl->tpl_vars['availableSeason']->value%100==2){?>Summer<?php }else{ ?>Fall<?php }?></a></li>
	<?php } ?>
	</ul>
</li>
<?php } ?>

<script>

function preventDefault(event) {
	event.preventDefault();
	event.stopPropagation();
	return event;
}

</script>
<?php }} ?>