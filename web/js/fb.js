window.fbAsyncInit = function() {
  // init the FB JS SDK
  FB.init({
    appId: '185745958145518', // App ID from the App Dashboard
    channelUrl: '/FacebookChannel.php', // Channel File for x-domain communication
    status: true, // check the login status upon init?
    cookie: true, // set sessions cookies to allow your server to access the session?
    xfbml: true, // parse XFBML tags on this page?
    version: 'v3.3'
  });

  // Additional initialization code such as adding Event Listeners goes here
  if (typeof window.extraFbAsyncInit !== 'undefined') {
    window.extraFbAsyncInit();
  }
};

// Load the SDK's source Asynchronously
// Note that the debug version is being actively developed and might
// contain some type checks that are overly strict.
// Please report such bugs using the bugs tool.
(function(d) {
  const id = 'facebook-jssdk';
  const ref = d.getElementsByTagName('script')[0];

  if (d.getElementById(id)) {
    return;
  }

  const js = d.createElement('script');
  js.id = id;
  js.async = true;
  js.src = '//connect.facebook.net/en_US/sdk.js';
  ref.parentNode.insertBefore(js, ref);
})(document);
