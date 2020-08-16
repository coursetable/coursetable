import React, { Component, useState } from 'react';
import styles from './MeDropdown.module.css';
import axios from 'axios';
// import { useUser } from '../user';

// TODO: debug for first-time login; ui isn't updating after user approves fb connection

function FBLoginButton(props) {
  // const { user, userRefresh } = useUser();
  
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

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    window.FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
    });
  }

  function statusChangeCallback(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
      // this.state.fbConnected = true
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      // this.state.fbConnected = false
      console.log("FB not authorized")
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      // this.state.fbConnected = false
      console.log("Not logged into FB")
    }
    // userRefresh();
  }
  
  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  // https://stackoverflow.com/questions/43382485/how-to-await-fb-login-callback-on-reactjs/47390564
  function checkLoginState() {
    window.FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    }.bind(this));
  }

  function handleClick() {
    window.FB.login(
      checkLoginState()
    );
    axios.get(
      '/legacy_api/FetchFacebookData.php'
    );
  }

  return (
    <div>
      {/* {!user.fbLogin && (
        <span 
          onClick={handleClick}
          className={styles.collapse_text}
        >
          Connect to FB
        </span>
      )}
      {user.fbLogin && (
        <span 
          onClick={handleClick}
          className={styles.collapse_text}
        >
          Disconnect FB
        </span>
      )} */}
      <span 
        onClick={handleClick}
        className={styles.collapse_text}
      >
        Connect to FB
      </span>
    </div>
  );
}

export default FBLoginButton;
