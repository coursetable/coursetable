<?php /* Smarty version Smarty-3.1.12, created on 2021-03-03 20:00:22
         compiled from "/usr/share/nginx/html/web/templates/Timetable.tpl" */ ?>
<?php /*%%SmartyHeaderCode:231652950603fead6901601-28821314%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '28d569afd3bd6f20e2daa2a37e3c241dfa786507' => 
    array (
      0 => '/usr/share/nginx/html/web/templates/Timetable.tpl',
      1 => 1581197815,
      2 => 'file',
    ),
    '8d6179c42396f272c2f7cadb18f21f5d055e2da1' => 
    array (
      0 => '/usr/share/nginx/html/web/templates/Main.tpl',
      1 => 1614800343,
      2 => 'file',
    ),
    '100399a5cdfe30bb7b8df0d7fc67ba89afbbbfac' => 
    array (
      0 => '/usr/share/nginx/html/web/templates/SeasonsDropdown.tpl',
      1 => 1581197815,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '231652950603fead6901601-28821314',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'title' => 0,
    'keywords' => 0,
    'description' => 0,
    'robots' => 0,
    'author' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_603fead6af35b1_06666465',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_603fead6af35b1_06666465')) {function content_603fead6af35b1_06666465($_smarty_tpl) {?><?php if (!is_callable('smarty_function_counter')) include '/usr/share/nginx/html/web/libs/smarty/plugins/function.counter.php';
?>

<?php $_smarty_tpl->tpl_vars['siteName'] = new Smarty_variable('CourseTable', null, 0);?>

	<?php $_smarty_tpl->tpl_vars['title'] = new Smarty_variable('CourseTable timetable', null, 0);?>


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


<link rel="stylesheet" href="/css/bluebook.css">
<link rel="stylesheet" href="/css/modals.css">

<style>

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

</style>


</head>

<body>


<div class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<a class="brand" href="/Table/<?php echo $_smarty_tpl->tpl_vars['season']->value;?>
?forceFull">Course<span style="color: #92bcea">Table</span></a>
		<ul class="nav">
			<li><a href="/Table/<?php echo $_smarty_tpl->tpl_vars['season']->value;?>
?forceFull">Full site</a></li>
			<li class="dropdown">
				<a href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><span id="season-dropdown">Terms</span> <b class="caret"></b></a>

				<ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
					<?php /*  Call merged included template "SeasonsDropdown.tpl" */
$_tpl_stack[] = $_smarty_tpl;
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate('SeasonsDropdown.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('availableSeasons'=>$_smarty_tpl->tpl_vars['availableSeasons']->value,'season'=>$_smarty_tpl->tpl_vars['season']->value,'href'=>'/Timetable/<season>'), 0, '231652950603fead6901601-28821314');
content_603fead69dd1d0_88885377($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "SeasonsDropdown.tpl" */?>
				</ul>
			</li>
		</ul>
	</div>
</div>



<div class="content">
	<?php $_smarty_tpl->tpl_vars['days'] = new Smarty_variable(array('Monday','Tuesday','Wednesday','Thursday','Friday'), null, 0);?>
	<?php $_smarty_tpl->tpl_vars['today'] = new Smarty_variable(date('l'), null, 0);?>
	<?php while ($_smarty_tpl->tpl_vars['today']->value!==$_smarty_tpl->tpl_vars['days']->value[0]&&$_smarty_tpl->tpl_vars['today']->value!=='Saturday'&&$_smarty_tpl->tpl_vars['today']->value!=='Sunday'){?>
		<?php $_smarty_tpl->createLocalArrayVariable('days', null, 0);
$_smarty_tpl->tpl_vars['days']->value[] = $_smarty_tpl->tpl_vars['days']->value[0];?>
		<?php $_smarty_tpl->tpl_vars['blah'] = new Smarty_variable(array_shift($_smarty_tpl->tpl_vars['days']->value), null, 0);?>
	<?php }?>


	<div class="accordion" id="accordion">
	<?php  $_smarty_tpl->tpl_vars['day'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['day']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['days']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['day']->index=-1;
foreach ($_from as $_smarty_tpl->tpl_vars['day']->key => $_smarty_tpl->tpl_vars['day']->value){
$_smarty_tpl->tpl_vars['day']->_loop = true;
 $_smarty_tpl->tpl_vars['day']->index++;
 $_smarty_tpl->tpl_vars['day']->first = $_smarty_tpl->tpl_vars['day']->index === 0;
?>
		<h4><?php echo $_smarty_tpl->tpl_vars['day']->value;?>
<?php if ($_smarty_tpl->tpl_vars['day']->first){?> (today)<?php }?></h4>
		<?php $_smarty_tpl->tpl_vars['coursesOnDay'] = new Smarty_variable($_smarty_tpl->tpl_vars['courses']->value[$_smarty_tpl->tpl_vars['day']->value], null, 0);?>
		<?php if (count($_smarty_tpl->tpl_vars['coursesOnDay']->value)===0){?>
			<div class="alert alert-info">No courses for the <?php echo $_smarty_tpl->tpl_vars['day']->value;?>
. <a href="/Table/<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['season']->value, ENT_QUOTES, 'UTF-8', true);?>
">Go to CourseTable</a> to add courses to your timetable.</div>
		<?php }?>

		<?php  $_smarty_tpl->tpl_vars['courseInfo'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['courseInfo']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['coursesOnDay']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['courseInfo']->key => $_smarty_tpl->tpl_vars['courseInfo']->value){
$_smarty_tpl->tpl_vars['courseInfo']->_loop = true;
?>
			<?php echo smarty_function_counter(array('name'=>'course','assign'=>'courseCounter'),$_smarty_tpl);?>

			<?php $_smarty_tpl->tpl_vars['course'] = new Smarty_variable($_smarty_tpl->tpl_vars['courseInfo']->value['course'], null, 0);?>
			<?php $_smarty_tpl->tpl_vars['session'] = new Smarty_variable($_smarty_tpl->tpl_vars['courseInfo']->value['session'], null, 0);?>
		<div class="accordion-group">
			<div class="accordion-heading">
				<a class="accordion-toggle pull-left" data-toggle="collapse" data-parent="#accordion" href="#collapse<?php echo $_smarty_tpl->tpl_vars['courseCounter']->value;?>
">
					<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['course']->value['subject'], ENT_QUOTES, 'UTF-8', true);?>
&nbsp;<?php echo htmlspecialchars($_smarty_tpl->tpl_vars['course']->value['number'], ENT_QUOTES, 'UTF-8', true);?>

				</a>
				<a class="accordion-toggle pull-right" data-toggle="collapse" data-parent="#accordion" href="#collapse<?php echo $_smarty_tpl->tpl_vars['courseCounter']->value;?>
">
					<?php echo sprintf('%.2f',$_smarty_tpl->tpl_vars['session']->value[0]);?>
-<?php echo sprintf('%.2f',$_smarty_tpl->tpl_vars['session']->value[1]);?>
<?php if ($_smarty_tpl->tpl_vars['session']->value[2]){?> in <?php echo $_smarty_tpl->tpl_vars['session']->value[2];?>
<?php }?>
				</a>
				<a class="clearfix accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse<?php echo $_smarty_tpl->tpl_vars['courseCounter']->value;?>
"></a>
			</div>
			<div id="collapse<?php echo $_smarty_tpl->tpl_vars['courseCounter']->value;?>
" class="accordion-body collapse">
				<div class="accordion-inner">
					<p>
						<big><strong><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['course']->value['long_title'], ENT_QUOTES, 'UTF-8', true);?>
</strong></big>
						<span class="badges">
							<?php  $_smarty_tpl->tpl_vars['skill'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['skill']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['course']->value['skills']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['skill']->key => $_smarty_tpl->tpl_vars['skill']->value){
$_smarty_tpl->tpl_vars['skill']->_loop = true;
?><span class="badge badge-skill"><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['skill']->value, ENT_QUOTES, 'UTF-8', true);?>
</span><?php } ?>
							<?php  $_smarty_tpl->tpl_vars['area'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['area']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['course']->value['areas']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['area']->key => $_smarty_tpl->tpl_vars['area']->value){
$_smarty_tpl->tpl_vars['area']->_loop = true;
?><span class="badge badge-area"><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['area']->value, ENT_QUOTES, 'UTF-8', true);?>
</span><?php } ?>
						</span>
						<br>
						Taught by <strong><?php  $_smarty_tpl->tpl_vars['professor'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['professor']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['course']->value['professors']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
 $_smarty_tpl->tpl_vars['professor']->index=-1;
foreach ($_from as $_smarty_tpl->tpl_vars['professor']->key => $_smarty_tpl->tpl_vars['professor']->value){
$_smarty_tpl->tpl_vars['professor']->_loop = true;
 $_smarty_tpl->tpl_vars['professor']->index++;
 $_smarty_tpl->tpl_vars['professor']->first = $_smarty_tpl->tpl_vars['professor']->index === 0;
?><?php if (!$_smarty_tpl->tpl_vars['professor']->first){?>, <?php }?><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['professor']->value, ENT_QUOTES, 'UTF-8', true);?>
<?php } ?></strong><br>
						Meets <?php echo htmlspecialchars($_smarty_tpl->tpl_vars['course']->value['times']['long_summary'], ENT_QUOTES, 'UTF-8', true);?>

					</p>
					<p><?php echo htmlspecialchars($_smarty_tpl->tpl_vars['course']->value['description'], ENT_QUOTES, 'UTF-8', true);?>
</p>
					<ul class="nav nav-pills">
						<li><a href="/Table/<?php echo $_smarty_tpl->tpl_vars['season']->value;?>
/course/<?php echo $_smarty_tpl->tpl_vars['course']->value['subject'];?>
_<?php echo $_smarty_tpl->tpl_vars['course']->value['number'];?>
_<?php echo $_smarty_tpl->tpl_vars['course']->value['section'];?>
?forceFull">View details on full site</a></li>
						<?php if ($_smarty_tpl->tpl_vars['course']->value['syllabus_url']){?><li><a href="<?php echo $_smarty_tpl->tpl_vars['course']->value['syllabus_url'];?>
">Syllabus</a></li><?php }?>
						<?php if ($_smarty_tpl->tpl_vars['course']->value['course_home_url']){?><li><a href="<?php echo $_smarty_tpl->tpl_vars['course']->value['course_home_url'];?>
">Course Home</a></li><?php }?>
					</ul>
				</div>
			</div>
		</div>
		<?php } ?>
	<?php } ?>
</div>


<!-- Le javascript
        ================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js"></script>
<script src="/libs/bootstrap-2.3.2/js/bootstrap.js"></script>
<script src="/js/fb.js"></script>




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
<?php }} ?><?php /* Smarty version Smarty-3.1.12, created on 2021-03-03 20:00:22
         compiled from "/usr/share/nginx/html/web/templates/SeasonsDropdown.tpl" */ ?>
<?php if ($_valid && !is_callable('content_603fead69dd1d0_88885377')) {function content_603fead69dd1d0_88885377($_smarty_tpl) {?><?php if (!is_callable('smarty_modifier_replace')) include '/usr/share/nginx/html/web/libs/smarty/plugins/modifier.replace.php';
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