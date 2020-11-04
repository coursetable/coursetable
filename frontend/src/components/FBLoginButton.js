import React, { useCallback } from 'react';
import styles from './MeDropdown.module.css';
import axios from 'axios';
import { useUser } from '../user';
import { toast } from 'react-toastify';
import posthog from 'posthog-js';

/**
 * FB login button that shows up in the profile dropdown
 */
function FBLoginButton() {
  const { user, fbRefresh } = useUser();
  const logged_in = user.fbLogin;

  // Note: window.FB setup via index.html.

  // TODO: add support for refreshing facebook auth status

  const syncFacebook = useCallback(() => {
    return axios.get('/legacy_api/FetchFacebookData.php').then(({ data }) => {
      if (!data.success) {
        throw data.message;
      }
      return fbRefresh();
    });
  }, [fbRefresh]);

  const handleLoginClick = useCallback(() => {
    const loginCallback = (response) => {
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        console.log('FB connected');
        posthog.capture('facebook-login', { info: response });

        syncFacebook()
          .then(() => {
            toast.success('Successfully connected to FB!');
          })
          .catch((err) => {
            console.error(err);
            toast.error('Error connecting FB');
          });
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        console.log('FB not authorized');
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        console.log('Not logged into FB');
      }
    };

    window.FB.login(
      (response) => {
        loginCallback(response);
      },
      {
        scope: 'user_friends',
        return_scopes: true,
      }
    );
  }, [syncFacebook]);

  const handleLogoutClick = useCallback(() => {
    posthog.capture('facebook-logout');

    // TODO: disconnect_facebook does not implement it correctly.
    axios
      .get('/legacy_api/Table.php?disconnect_facebook')
      .then(() => {
        return fbRefresh(true);
      })
      .then(() => {
        toast.success('FB disconnected');
      })
      .catch(() => {
        toast.error('Error disconnecting FB');
      });
  }, [fbRefresh]);

  return (
    <div>
      {!logged_in && (
        <span onClick={handleLoginClick} className={styles.collapse_text}>
          Connect to FB
        </span>
      )}
      {logged_in && (
        <span onClick={handleLogoutClick} className={styles.collapse_text}>
          Disconnect FB
        </span>
      )}
    </div>
  );
}

export default FBLoginButton;
