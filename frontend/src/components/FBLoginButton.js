// Modified from: https://www.djamware.com/post/5e6d6a9a05efef95f94c4aed/reactjs-tutorial-facebook-login-example

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
// import FB from '../fb';
// import styles from './FBLoginButton.module.css';

function FBLoginButton(props) {

  function handleClick() {
    console.log('Clicking FBLoginButton.');
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

  return (
    <div>
      {/* See https://developers.facebook.com/apps/185745958145518/fb-login/quickstart/ */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      {props.isLoggedIn && (
        <Button 
          class="btn friend-worksheets-btn"
          // href="/legacy_api/index.php?forcelogin=1"
          onClick={handleClick}
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

export default FBLoginButton;
