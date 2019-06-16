{*
	Splash.tpl

	Type: standalone template
	Usage: YalePlus bluebook's splash page

	Variables:
	    authorizationState: one of 'authorized', 'unauthorized', or 'unknown'
		showDisclaimer: whether to show the disclaimer box

    Blocks:
*}
{extends file='Main.tpl'}

{block name=vars}
    {$title = 'CourseTable'}

    {$notTesterAlertClass = ''}
    {$loginButtonClass = ''}
    {$continueButtonClass = ''}
    {if $authorizationState == 'authorized'}
        {$loginButtonClass = 'force-hide'}
        {$continueButtonClass = 'force-inline'}
    {elseif $authorizationState == 'unauthorized'}
        {$notTesterAlertClass = 'force-block'}
        {$loginButtonClass = 'force-hide'}
    {/if}

{/block}

{block name=extraHead}
<link rel="stylesheet" href="/css/sortfilter.css">
<link rel="stylesheet" href="/css/bluebook.css">
<link rel="stylesheet" href="/css/modals.css">
    {literal}
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
    {/literal}
{/block}

{block name=content}

{capture name=buttons assign=buttons}
	<button class="btn btn-primary facebook-login-btn {$loginButtonClass}"><i class="icon-facebook-sign"></i> <span>Log in to Facebook</span></button>
	<div class="fetching-message" style="display: none; margin-top: 5px">This may take up to 2 minutes, but will only happen once.</div>
    <a class="btn btn-success continue-btn {$continueButtonClass}" href="/Table">Continue to CourseTable</a>
    <a class="muted" href="/Table?noFacebook=1"><small>I don't have Facebook</small></a>
{/capture}

<div id="disclaimer-modal" class="modal hide">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		<h3>Notices</h3>
	</div>
	<div class="modal-body">
		<p class="alert alert-error">The new CourseTable makes it easy to see courses' evaluations. That being said, keep in mind that <strong>evaluations are not everything</strong>! Professors' personalities and teaching styles are often divisive, and you will likely enjoy a class up your alley more than the random, most-highly evaluated class. Also, sophomores and freshmen: keep in mind highly-evaluated seminars are often filled to the brim.</p>
	</div>
	<div class="modal-footer">
		{$buttons}
	</div>
</div>

<div class="splash-container">
    <div id="fixed-center">
        <div class="alert alert-error not-tester-alert {$notTesterAlertClass}"><strong>The CourseTable isn't publicly launched yet. Please check back later!</strong></div>
        <h1 class="splash-title">Course<span style="color: #92bcea">Table</span></h1>
        <div id="fixed-center-inner">
            {if $splashMessage}
                <div class="alert alert-info">{$splashMessage}</div>
            {/if}

            {$emails = ['peter@coursetable.com', 'harry@coursetable.com']}
            <p><strong>CourseTable</strong> is a course-data processor created by <strong>by Peter Xu (Yale MC 14) and Harry Yu (Yale SY 14)</strong>. It helps you find the courses at Yale where you'll learn and enjoy the most, and has returned after <a href="/Blog">Yale unceremoniously blocked it from campus networks</a>.</p>
            <p>For questions, comments, bug reports, suggestions, or hate mail, please email {foreach $emails as $email}<a href="mailto:{$email}">{$email}</a>{if !$email@last} or {/if}{/foreach}.</p>
            <p class="{$loginButtonClass}">Please log in to get started!</p>
            <div>
                {if $netId}
                    {if $showDisclaimer}
                        <a class="btn btn-success" role="button" href="#disclaimer-modal" data-toggle="modal">Continue</a>
                    {else}
                        {$buttons}
                    {/if}
                {else}
                    <a class="btn btn-success" role="button" href="{$loginUrl}">Login on CAS</a>
                {/if}
            </div>
        </div>
    </div>
</div>
{/block}

{block name=footer}
<script type="text/javascript">
    {literal}
    $(document).ready(function() {
        var $friendWorksheetsButton = $('.facebook-login-btn');
        $friendWorksheetsButton.click(function(event) {
            $friendWorksheetsButton.attr('disabled', 'disabled');
            $friendWorksheetsButton.children('span').text('Loading');
            FB.login(function(response) {
                if (response.status !== 'connected') {
                    $friendWorksheetsButton.tooltip({
                        title: 'You need to log into Facebook and authorize Yaleplus!',
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
    {/literal}
</script>
{/block}
