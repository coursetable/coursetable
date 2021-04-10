<?php /* Smarty version Smarty-3.1.12, created on 2021-03-03 19:48:40
         compiled from "/usr/share/nginx/html/web/templates/NewSplash.tpl" */ ?>
<?php /*%%SmartyHeaderCode:11005985505e5ad6806e02b2-03841778%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'e11ec0e4af026c62000e18c282e9862963c10879' => 
    array (
      0 => '/usr/share/nginx/html/web/templates/NewSplash.tpl',
      1 => 1581197815,
      2 => 'file',
    ),
    '8d6179c42396f272c2f7cadb18f21f5d055e2da1' => 
    array (
      0 => '/usr/share/nginx/html/web/templates/Main.tpl',
      1 => 1614800343,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '11005985505e5ad6806e02b2-03841778',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.12',
  'unifunc' => 'content_5e5ad680825a02_37185812',
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
<?php if ($_valid && !is_callable('content_5e5ad680825a02_37185812')) {function content_5e5ad680825a02_37185812($_smarty_tpl) {?>

<?php $_smarty_tpl->tpl_vars['siteName'] = new Smarty_variable('CourseTable', null, 0);?>

    <?php $_smarty_tpl->tpl_vars['title'] = new Smarty_variable('CourseTable', null, 0);?>

    <?php $_smarty_tpl->tpl_vars['notTesterAlertClass'] = new Smarty_variable('', null, 0);?>
    <?php $_smarty_tpl->tpl_vars['loginButtonClass'] = new Smarty_variable('', null, 0);?>
    <?php $_smarty_tpl->tpl_vars['continueButtonClass'] = new Smarty_variable('', null, 0);?>
    <?php if ($_smarty_tpl->tpl_vars['authorizationState']->value=='authorized'){?>
        <?php $_smarty_tpl->tpl_vars['loginButtonClass'] = new Smarty_variable('force-hide', null, 0);?>
        <?php $_smarty_tpl->tpl_vars['continueButtonClass'] = new Smarty_variable('force-inline', null, 0);?>
    <?php }elseif($_smarty_tpl->tpl_vars['authorizationState']->value=='unauthorized'){?>
        <?php $_smarty_tpl->tpl_vars['notTesterAlertClass'] = new Smarty_variable('force-block', null, 0);?>
        <?php $_smarty_tpl->tpl_vars['loginButtonClass'] = new Smarty_variable('force-hide', null, 0);?>
    <?php }?>



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


<link rel="stylesheet" href="/css/sortfilter.css">
<link rel="stylesheet" href="/css/bluebook.css">
<link rel="stylesheet" href="/css/modals.css">
    
    <style>
        .splash-container {
            min-height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #fixed-center {
            max-width: 400px;
            background-color: #fff;
            opacity: 0.9;

            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;

            margin: 20px 10px;
        }

		#fixed-center h1 {
			font-family: YaleDesign, Garamond, 'Palatino Linotype', Palatino, Bookman, serif;
			color: #fff;
			background: #445;
			margin: 0;
			font-weight: normal;
			padding: 20px;

			border-radius: 10px 10px 0 0;
            -webkit-border-radius: 10px 10px 0 0;
            -moz-border-radius: 10px 10px 0 0;
		}
		#fixed-center-inner {
			padding: 10px 20px 20px;
		}

        html, body {
            height: 100%;
            min-height: 100%;
        }

        body {
            background: url(/res/saybrook.jpg) no-repeat center center fixed;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
        }


        .not-tester-alert, .continue-btn {
            display: none;
        }

        .force-inline {
            display: inline !important;
        }

        .force-block {
            display: block !important;
        }

        .force-hide {
            display: none !important;
        }
    </style>
    


</head>

<body>




<?php $_smarty_tpl->_capture_stack[0][] = array('buttons', 'buttons', null); ob_start(); ?>
	<button class="btn btn-primary facebook-login-btn <?php echo $_smarty_tpl->tpl_vars['loginButtonClass']->value;?>
"><i class="icon-facebook-sign"></i> <span>Log in to Facebook</span></button>
	<div class="fetching-message" style="display: none; margin-top: 5px">This may take up to 2 minutes, but will only happen once.</div>
    <a class="btn btn-success continue-btn <?php echo $_smarty_tpl->tpl_vars['continueButtonClass']->value;?>
" href="/Table">Continue to CourseTable</a>
    <a class="muted" href="/Table?noFacebook=1"><small>I don't have Facebook</small></a>
<?php list($_capture_buffer, $_capture_assign, $_capture_append) = array_pop($_smarty_tpl->_capture_stack[0]);
if (!empty($_capture_buffer)) {
 if (isset($_capture_assign)) $_smarty_tpl->assign($_capture_assign, ob_get_contents());
 if (isset( $_capture_append)) $_smarty_tpl->append( $_capture_append, ob_get_contents());
 Smarty::$_smarty_vars['capture'][$_capture_buffer]=ob_get_clean();
} else $_smarty_tpl->capture_error();?>

<div id="disclaimer-modal" class="modal hide">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		<h3>Notices</h3>
	</div>
	<div class="modal-body">
		<p class="alert alert-error">The new CourseTable makes it easy to see courses' evaluations. That being said, keep in mind that <strong>evaluations are not everything</strong>! Professors' personalities and teaching styles are often divisive, and you will likely enjoy a class up your alley more than the random, most-highly evaluated class. Also, sophomores and freshmen: keep in mind highly-evaluated seminars are often filled to the brim.</p>
	</div>
	<div class="modal-footer">
		<?php echo $_smarty_tpl->tpl_vars['buttons']->value;?>

	</div>
</div>

<div class="splash-container">
    <div id="fixed-center">
        <div class="alert alert-error not-tester-alert <?php echo $_smarty_tpl->tpl_vars['notTesterAlertClass']->value;?>
"><strong>The CourseTable isn't publicly launched yet. Please check back later!</strong></div>
        <h1 class="splash-title">Course<span style="color: #92bcea">Table</span></h1>
        <div id="fixed-center-inner">
            <?php if ($_smarty_tpl->tpl_vars['splashMessage']->value){?>
                <div class="alert alert-info"><?php echo $_smarty_tpl->tpl_vars['splashMessage']->value;?>
</div>
            <?php }?>

            <?php $_smarty_tpl->tpl_vars['emails'] = new Smarty_variable(array('coursetable@elilists.yale.edu'), null, 0);?>
            <p><strong>CourseTable</strong> was a course-data processor created by <strong>Peter Xu (Yale MC '14) and Harry Yu (Yale SY '14)</strong> and is continuing to be developed by <strong>Yale Computer Society</strong>. It helps you find the courses at Yale where you'll learn and enjoy the most, and has returned after <a href="/Blog">Yale unceremoniously blocked it from campus networks</a>.</p>
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
            <p class="<?php echo $_smarty_tpl->tpl_vars['loginButtonClass']->value;?>
">Please log in to get started!</p>
            <div>
                <?php if ($_smarty_tpl->tpl_vars['netId']->value){?>
                    <?php if ($_smarty_tpl->tpl_vars['showDisclaimer']->value){?>
                        <a class="btn btn-success" role="button" href="#disclaimer-modal" data-toggle="modal">Continue</a>
                    <?php }else{ ?>
                        <?php echo $_smarty_tpl->tpl_vars['buttons']->value;?>

                    <?php }?>
                <?php }else{ ?>
                    <a class="btn btn-success" role="button" href="<?php echo $_smarty_tpl->tpl_vars['loginUrl']->value;?>
">Login on CAS</a>
                <?php }?>
            </div>
        </div>
    </div>
</div>


<!-- Le javascript
        ================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js"></script>
<script src="/libs/bootstrap-2.3.2/js/bootstrap.js"></script>
<script src="/js/fb.js"></script>


<script type="text/javascript">
    
    $(document).ready(function() {
        var $friendWorksheetsButton = $('.facebook-login-btn');
        $friendWorksheetsButton.click(function(event) {
            $friendWorksheetsButton.attr('disabled', 'disabled');
            $friendWorksheetsButton.children('span').text('Loading');
            FB.login(function(response) {
                if (response.status !== 'connected') {
                    $friendWorksheetsButton.tooltip({
                        title: 'You need to log into Facebook and authorize CourseTable!',
                        placement: 'bottom',
                        trigger: 'manual'
                    });
                    $friendWorksheetsButton.tooltip('show');
                    setTimeout(function() {
                        $friendWorksheetsButton.tooltip('hide');
                    }, 5000);
                    $friendWorksheetsButton.removeAttr('disabled');
                } else {
                    $friendWorksheetsButton.children('span').text('Loading');
					$('.fetching-message').show();
                    $.get('/FetchFacebookData.php', {mode: 'loginOnly'}, function(data) {
                        $('.facebook-login-btn').hide();
						$('.fetching-message').hide();
                        $('.continue-btn').show();
                    }, 'json');
                }
            }, {scope: 'email, user_about_me, user_activities, user_education_history, user_groups, user_hometown, user_interests, user_likes, user_location, user_work_history'});
        });
    });
    
</script>



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
<?php }} ?>