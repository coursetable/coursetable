import React from 'react';
import styles from './MeDropdown.module.css';
import axios from 'axios';
import { useUser } from '../user';
import { toast } from 'react-toastify';

function FBLoginButton() {
  const { user, userRefresh } = useUser();

  window.fbAsyncInit = function () {
    window.FB.init({
      appId: '185745958145518', // The app ID for CourseTable
      channelUrl: '/legacy_api/FacebookChannel.php', // Channel File for x-domain communication
      status: true,
      cookie: true, // enable cookies to allow the server to access the session
      xfbml: true, // parse social plugins on this page
      version: 'v7.0',
    });
  };

  // Load the SDK asynchronously
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    window.FB.api('/me', function (response) {
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
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      console.log('FB not authorized');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      console.log('Not logged into FB');
    }
  }

  function authStatusChange() {
    userRefresh();
    toast.success('Successfully connected to FB!', {
      position: 'top-right',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  // https://stackoverflow.com/questions/43382485/how-to-await-fb-login-callback-on-reactjs/47390564
  function checkLoginState() {
    window.FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  }

  function handleLoginClick() {
    window.FB.Event.subscribe('auth.statusChange', authStatusChange);
    window.FB.login(checkLoginState(), {
      scope: 'user_friends',
      return_scopes: true,
    });
    axios.get('/legacy_api/FetchFacebookData.php');
  }

  function handleLogoutClick() {
    toast.error('FB disconnect not yet implemented.');
  }

  return (
    <div>
      {!user.fbLogin && (
        <span onClick={handleLoginClick} className={styles.collapse_text}>
          Connect to FB
        </span>
      )}
      {user.fbLogin && (
        <span onClick={handleLogoutClick} className={styles.collapse_text}>
          Disconnect FB
        </span>
      )}
    </div>
  );
}

export default FBLoginButton;
