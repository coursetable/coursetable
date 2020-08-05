import React, { Component, useState } from 'react';
import styles from './MeDropdown.module.css';
import axios from 'axios';

// A lot of code from https://github.com/Jerryg6j3/react-fbsdk-example
class FBLoginButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // TODO: Change this so that fbConnected persists (rather than being reset to false every time)
      fbConnected: false
    };
  }

  // This gets called when the component mounts
  componentDidMount() {
	  window.fbAsyncInit = function() {
	    window.FB.init({
        appId: '185745958145518', // The app ID for CourseTable
        channelUrl: '/legacy_api/FacebookChannel.php', // Channel File for x-domain communication
        status: true,
	      cookie: true,  // enable cookies to allow the server to access the session
	      xfbml: true,  // parse social plugins on this page
	      version: 'v7.0',
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

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  window.FB.api('/me', function(response) {
  console.log('Successful login for: ' + response.name);
  });
}

// This is called with the results from from FB.getLoginStatus().
statusChangeCallback(response) {
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    this.testAPI();
    this.state.fbConnected = true
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    this.state.fbConnected = false
    console.log("FB not authorized")
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    this.state.fbConnected = false
    console.log("Not logged into FB")
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
  window.FB.login(this.checkLoginState());
  axios.get(
    '/legacy_api/FetchFacebookData.php'
  );
}

  render() {
    return (
      <div>
        {!this.state.fbConnected && (
          <span 
            onClick={this.handleClick.bind(this)}
            className={styles.collapse_text}
          >
            Connect to FB
          </span>
        )}
        {this.state.fbConnected && (
          <span 
            // onClick={this.handleClick.bind(this)}
            className={styles.collapse_text}
          >
            Disconnect FB
          </span>
        )}
      </div>
    );
  }
}

export default FBLoginButton;
