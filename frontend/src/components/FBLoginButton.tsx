import React, { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSyncAlt } from 'react-icons/fa';
import posthog from 'posthog-js';
import { useUser } from '../user';
import styles from './MeDropdown.module.css';
import { TextComponent, StyledHoverText } from './StyledComponents';

/**
 * FB login button that shows up in the profile dropdown
 */
function FBLoginButton() {
  const { user, fbRefresh } = useUser();
  const logged_in = user.fbLogin;

  // Note: window.FB is set up via index.html.
  // Types on window.FB are defined in react-app-env.d.ts.

  const syncFacebook = useCallback(async () => {
    const { data } = await axios.get('/legacy_api/FetchFacebookData.php');
    if (!data.success) {
      throw data.message;
    }
    return await fbRefresh();
  }, [fbRefresh]);

  const handleLoginClick = useCallback(() => {
    window.FB.login(
      (response) => {
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
          <StyledHoverText>Connect to FB</StyledHoverText>
        </TextComponent>
      )}
      {logged_in && (
        <>
          <TextComponent
            type={1}
            onClick={handleLogoutClick}
            className={styles.collapse_text}
          >
            <StyledHoverText>Disconnect FB</StyledHoverText>
          </TextComponent>

          <FaSyncAlt
            className={`${styles.fb_sync} ml-2 my-auto`}
            size={15}
            color="#32CD32"
            title="Refresh FB friends"
            onClick={handleLoginClick}
          />
        </>
      )}
    </div>
  );
}

export default FBLoginButton;
