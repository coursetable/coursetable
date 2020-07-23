import React, { Component, useState } from 'react';
import { Button } from 'react-bootstrap';
// import styles from './FBLoginButton.module.css';

// const FB = window.FB;

// A lot of code from https://github.com/Jerryg6j3/react-fbsdk-example
class FBLoginButton extends Component {
  // constructor(props){
  //   super(props);
  // }

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

	// // Here we run a very simple test of the Graph API after login is
	// // successful.  See statusChangeCallback() for when this call is made.
	// testAPI() {
	//   console.log('Welcome!  Fetching your information.... ');
	//   window.FB.api('/me', function(response) {
	//   console.log('Successful login for: ' + response.name);
	//   // document.getElementById('status').innerHTML =
	//   //   'Thanks for logging in, ' + response.name + '!';
	//   });
	// }
	
	// // This is called with the results from from FB.getLoginStatus().
	// statusChangeCallback(response) {
	//   console.log('statusChangeCallback');
  //   console.log(response);
  //   console.log(response.status);
	//   // The response object is returned with a status field that lets the
	//   // app know the current login status of the person.
	//   // Full docs on the response object can be found in the documentation
	//   // for FB.getLoginStatus().
	//   if (response.status === 'connected') {
	//     // Logged into your app and Facebook.
	//     this.testAPI();
	//   } else if (response.status === 'not_authorized') {
	//     // The person is logged into Facebook, but not your app.
	//     document.getElementById('status').innerHTML = 'Please log ' +
	//       'into this app.';
	//   } else {
	//     // The person is not logged into Facebook, so we're not sure if
	//     // they are logged into this app or not.
	//     document.getElementById('status').innerHTML = 'Please log ' +
	//     'into Facebook.';
	//   }
	// }
	
	// // This function is called when someone finishes with the Login
	// // Button.  See the onlogin handler attached to it in the sample
	// // code below.
	// checkLoginState() {
  //   var statusDelta = this.statusChangeCallback(response);
  //   console.log(statusDelta)
	//   window.FB.getLoginStatus(function(response) {
	//     statusDelta
	//   }.bind(this));
	// }

  // handleClick() {
  //   console.log('Clicking FBLoginButton.');
  //   var loginState = this.checkLoginState();
  //   console.log(loginState)
  //   window.FB.login(loginState);
  // }

/**
 * Checks whether we are logged into Facebook and have
 * the user_friends Facebook permission, and calls the success
 * and fail callbacks correspondingly
 * @param successCallback called if we're logged in w/permissions
 * @param failCallback called otherwise
 */
  ensureFacebookPermissions(loginFunc, successCallback, failCallback) {
    console.log('Checking FB login status');
    // 1. Check if logged in
    loginFunc(
      response => {
        if (response.status === 'connected') {
          console.log('FB logged in');

          // 2. Check if we have the permissions needed
          window.FB.api('/me/permissions', response => {
            const permissions = response.data;
            let hasUserFriendsPermission = false;
            for (let i = 0; i !== permissions.length; i++) {
              const p = permissions[i];
              if (p.permission === 'user_friends' && p.status === 'granted') {
                hasUserFriendsPermission = true;
              }
            }

            if (hasUserFriendsPermission) {
              console.log('FB has permissions');
              successCallback();
            } else {
              console.log('FB does not have permissions');
              failCallback();
            }
          });
        } else {
          console.log('FB not logged in');
          failCallback();
        }
      },
      {
        auth_type: 'rerequest', // We need all the settings
        scope: 'email, public_profile, user_friends',
      }
    );
  }

  /**
   * Used when user tries to login to Facebook, either for the first time or to update
   * their friends list
   * 1. Tries to login to Facebook
   * 2. Displays an error message if failed
   * 3. Enables Facebook menu if successful
   * @param force: whether to force a refresh, even if we've recently retrieved Facebook friends in the last few days
   * @param successCallback: callback to be called on successful login
   */
  attemptLoginAndFetch(force) {
    if (typeof force === 'undefined') force = false;

    // const $ = window.$;

    // const $friendWorksheetsButton = $('.friend-worksheets-btn');

    this.ensureFacebookPermissions(
      window.FB.login,
      () => {
        // Logged in; fetch Facebook data
        // this.children('span').text('Loading');
        const params = force ? { force: true } : null;

        this.get(
          '/legacy_api/FetchFacebookData.php',
          params,
          data => {
            this
              .children('span')
              .text("See friends' worksheets");
            this.removeAttr('disabled');
            if (data.success) {
              this.hide();
              // worksheetManager.retrieveFriendWorksheets();

              // if (successCallback) {
              //   successCallback();
              // }
            } else {
              this.tooltip({
                title: "Something went wrong! We'll look into it soon",
                placement: 'bottom',
                trigger: 'manual',
              });
              this.tooltip('show');
              setTimeout(() => {
                this.tooltip('hide');
              }, 5000);
            }
          },
          'json'
        );
      },

      () => {
        // Did not log in; prompt again
        this.tooltip({
          title: 'You need to log into Facebook and authorize CourseTable!',
          placement: 'bottom',
          trigger: 'manual',
        });
        this.tooltip('show');
        setTimeout(() => {
          this.tooltip('hide');
        }, 5000);
        this.removeAttr('disabled');
      }
    );
  }

  handleClick(e) {
    this.attemptLoginAndFetch(true);
  }

  render() {
    return (
      <div>
        {/* See https://developers.facebook.com/apps/185745958145518/fb-login/quickstart/ */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        {this.props.isLoggedIn && (
          <Button 
            className="btn friend-worksheets-btn"
            // href="/legacy_api/index.php?forcelogin=1"
            onClick={this.handleClick.bind(this)}
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
