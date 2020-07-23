import React, { Component, useState } from 'react';
import { Button } from 'react-bootstrap';
// import '../fb';
// import styles from './FBLoginButton.module.css';

// const FB = window.FB;

// A lot of code from https://github.com/Jerryg6j3/react-fbsdk-example
class FBLoginButton extends Component {

  componentDidMount() {
	  window.fbAsyncInit = function() {
	    window.FB.init({
        appId: '185745958145518',
        channelUrl: '/legacy_api/FacebookChannel.php', // Channel File for x-domain communication
        status: true,
	      cookie: true,  // enable cookies to allow the server to access the session
	      xfbml: true,  // parse social plugins on this page
	      version: 'v2.1',
	    });
	
	    // Now that we've initialized the JavaScript SDK, we call
	    // FB.getLoginStatus().  This function gets the state of the
	    // person visiting this page and can return one of three states to
	    // the callback you provide.  They can be:
	    //
	    // 1. Logged into your app ('connected')
	    // 2. Logged into Facebook, but not your app ('not_authorized')
	    // 3. Not logged into Facebook and can't tell if they are logged into
	    //    your app or not.
	    //
	    // These three cases are handled in the callback function.
	    window.FB.getLoginStatus(function(response) {
	      this.statusChangeCallback(response);
	    }.bind(this));
	  }.bind(this);
    
	  // Load the SDK asynchronously
	  (function(d, s, id) {
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) return;
	    js = d.createElement(s); js.id = id;
	    js.src = "//connect.facebook.net/en_US/sdk.js";
	    fjs.parentNode.insertBefore(js, fjs);
	  }(document, 'script', 'facebook-jssdk'));
	}

	// Here we run a very simple test of the Graph API after login is
	// successful.  See statusChangeCallback() for when this call is made.
	testAPI() {
	  console.log('Welcome!  Fetching your information.... ');
	  window.FB.api('/me', function(response) {
	  console.log('Successful login for: ' + response.name);
	  // document.getElementById('status').innerHTML =
	  //   'Thanks for logging in, ' + response.name + '!';
	  });
	}
	
	// This is called with the results from from FB.getLoginStatus().
	statusChangeCallback(response) {
	  console.log('statusChangeCallback');
	  console.log(response);
	  // The response object is returned with a status field that lets the
	  // app know the current login status of the person.
	  // Full docs on the response object can be found in the documentation
	  // for FB.getLoginStatus().
	  if (response.status === 'connected') {
	    // Logged into your app and Facebook.
	    this.testAPI();
	  } else if (response.status === 'not_authorized') {
	    // The person is logged into Facebook, but not your app.
	    document.getElementById('status').innerHTML = 'Please log ' +
	      'into this app.';
	  } else {
	    // The person is not logged into Facebook, so we're not sure if
	    // they are logged into this app or not.
	    document.getElementById('status').innerHTML = 'Please log ' +
	    'into Facebook.';
	  }
	}
	
	// This function is called when someone finishes with the Login
	// Button.  See the onlogin handler attached to it in the sample
	// code below.
	checkLoginState() {
	  window.FB.getLoginStatus(function(response) {
	    this.statusChangeCallback(response);
	  }.bind(this));
	}

  handleClick() {
    console.log('Clicking FBLoginButton.');
    window.FB.login(this.checkLoginState());
  }

//   /**
//  * Checks whether we are logged into Facebook and have
//  * the user_friends Facebook permission, and calls the success
//  * and fail callbacks correspondingly
//  * @param successCallback called if we're logged in w/permissions
//  * @param failCallback called otherwise
//  */
// function ensureFacebookPermissions(loginFunc, successCallback, failCallback) {
//   console.log('Checking FB login status');
//   // 1. Check if logged in
//   loginFunc(
//     response => {
//       if (response.status === 'connected') {
//         console.log('FB logged in');

//         // 2. Check if we have the permissions needed
//         FB.api('/me/permissions', response => {
//           const permissions = response.data;
//           let hasUserFriendsPermission = false;
//           for (let i = 0; i !== permissions.length; i++) {
//             const p = permissions[i];
//             if (p.permission === 'user_friends' && p.status === 'granted') {
//               hasUserFriendsPermission = true;
//             }
//           }

//           if (hasUserFriendsPermission) {
//             console.log('FB has permissions');
//             successCallback();
//           } else {
//             console.log('FB does not have permissions');
//             failCallback();
//           }
//         });
//       } else {
//         console.log('FB not logged in');
//         failCallback();
//       }
//     },
//     {
//       auth_type: 'rerequest', // We need all the settings
//       scope: 'email, public_profile, user_friends',
//     }
//   );
// }

//   /**
//    * Used when user tries to login to Facebook, either for the first time or to update
//    * their friends list
//    * 1. Tries to login to Facebook
//    * 2. Displays an error message if failed
//    * 3. Enables Facebook menu if successful
//    * @param force: whether to force a refresh, even if we've recently retrieved Facebook friends in the last few days
//    * @param successCallback: callback to be called on successful login
//    */
//   const attemptLoginAndFetch = function(force, successCallback) {
//     if (typeof force === 'undefined') force = false;

//     const $ = window.$;

//     const $friendWorksheetsButton = $('.friend-worksheets-btn');

//     ensureFacebookPermissions(
//       FB.login,
//       () => {
//         // Logged in; fetch Facebook data
//         $friendWorksheetsButton.children('span').text('Loading');
//         const params = force ? { force: true } : null;

//         $.get(
//           '/legacy_api/FetchFacebookData.php',
//           params,
//           data => {
//             $friendWorksheetsButton
//               .children('span')
//               .text("See friends' worksheets");
//             $friendWorksheetsButton.removeAttr('disabled');
//             if (data.success) {
//               $friendWorksheetsButton.hide();
//               worksheetManager.retrieveFriendWorksheets();

//               if (successCallback) {
//                 successCallback();
//               }
//             } else {
//               $friendWorksheetsButton.tooltip({
//                 title: "Something went wrong! We'll look into it soon",
//                 placement: 'bottom',
//                 trigger: 'manual',
//               });
//               $friendWorksheetsButton.tooltip('show');
//               setTimeout(() => {
//                 $friendWorksheetsButton.tooltip('hide');
//               }, 5000);
//             }
//           },
//           'json'
//         );
//       },

//       () => {
//         // Did not log in; prompt again
//         $friendWorksheetsButton.tooltip({
//           title: 'You need to log into Facebook and authorize CourseTable!',
//           placement: 'bottom',
//           trigger: 'manual',
//         });
//         $friendWorksheetsButton.tooltip('show');
//         setTimeout(() => {
//           $friendWorksheetsButton.tooltip('hide');
//         }, 5000);
//         $friendWorksheetsButton.removeAttr('disabled');
//       }
//     );
//   };

  render() {
    return (
      <div>
        {/* See https://developers.facebook.com/apps/185745958145518/fb-login/quickstart/ */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        {this.props.isLoggedIn && (
          <Button 
            className="btn friend-worksheets-btn"
            // href="/legacy_api/index.php?forcelogin=1"
            onClick={this.handleClick}
            // style="display: inline-block;"
          >
            {/* TODO: Style FB icon so it's not so ugly lol */}
            <i className="fa fa-facebook"></i>
            <span>See friends' worksheets</span>
          </Button>
        )}
      </div>
    );
  }
}

export default FBLoginButton;
