import React, { Fragment, useCallback } from 'react';
import styles from './MeDropdown.module.css';
import axios from 'axios';
import { useUser } from '../user';
import { toast } from 'react-toastify';
import { FaSyncAlt } from 'react-icons/fa';
import posthog from 'posthog-js';
import { TextComponent } from './StyledComponents';

/**
 * FB login button that shows up in the profile dropdown
 */
function FBLoginButton() {
  const { user, fbRefresh } = useUser();
  const logged_in = user.fbLogin;

  // Note: window.FB setup via index.html.

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
    <div className="d-flex">
      {!logged_in && (
        <TextComponent
          type={1}
          onClick={handleLoginClick}
          className={styles.collapse_text}
        >
          Connect to FB
        </TextComponent>
      )}
      {logged_in && (
        <Fragment>
          <TextComponent
            type={1}
            onClick={handleLogoutClick}
            className={styles.collapse_text}
          >
            Disconnect FB
          </TextComponent>

          <FaSyncAlt
            className={styles.fb_sync + ' ml-2 my-auto'}
            size={15}
            color="#32CD32"
            title="Refresh FB friends"
            onClick={handleLoginClick}
          />
        </Fragment>
      )}
    </div>
  );
}

export default FBLoginButton;
