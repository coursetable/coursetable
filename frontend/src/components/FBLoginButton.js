import React, { Component, useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
// import styles from './FBLoginButton.module.css';
// const FB = window.FB;

// A lot of code from https://github.com/Jerryg6j3/react-fbsdk-example
class FBLoginButton extends Component {
  constructor(props){
    super(props);
    this.fbConnected = false;
  }

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
    console.log(this.fbConnected);
    
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
    this.fbConnected = true;
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    // document.getElementById('status').innerHTML = 'Please log ' +
    //   'into this app.';
    this.fbConnected = false;
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    // document.getElementById('status').innerHTML = 'Please log ' +
    // 'into Facebook.';
    this.fbConnected = false;
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
  console.log(this.fbConnected);
}

  render() {
    return (
      <div>
        {/* See https://developers.facebook.com/apps/185745958145518/fb-login/quickstart/ */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        {this.props.isLoggedIn && !this.fbConnected && (
          <Button 
            className="btn friend-worksheets-btn"
            onClick={this.handleClick.bind(this)}
            // style="display: inline-block;"
          >
            {/* TODO: Style FB icon so it's not so ugly lol */}
            <i className="fa fa-facebook"></i>
            <span>See friends' worksheets</span>
          </Button>
        )}
        {this.fbConnected && (
          <Button 
            className="friend-worksheets-btn"
            onClick={this.handleClick.bind(this)}
            // style="display: inline-block;"
          >
            {/* TODO: Style FB icon so it's not so ugly lol */}
            <i className="fa fa-facebook"></i>
            <span>Facebook connected!</span>
          </Button>
        )}
      </div>
    );
  }
}

export default FBLoginButton;
