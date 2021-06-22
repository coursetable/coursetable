import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSyncAlt } from 'react-icons/fa';
import posthog from 'posthog-js';
import { useUser } from '../user';
import styles from './MeDropdown.module.css';
import { TextComponent, StyledHoverText } from './StyledComponents';
import * as Sentry from '@sentry/react';

import { API_ENDPOINT } from '../config';
import styled from 'styled-components';

const RefreshIcon = styled(FaSyncAlt)`
  transition: transform 0.3s;

  :hover {
    cursor: pointer;
    transform: rotateZ(90deg);
  }
`;

const RefreshText = styled(TextComponent)`
  &:hover + ${RefreshIcon} {
    cursor: pointer;
    transform: rotateZ(90deg);
  }
`;

const loggedInModes = ['disconnect', 'refresh'] as const;
type LoggedInMode = typeof loggedInModes[number];

type Props = {
  loggedInMode?: LoggedInMode;
};

/**
 * FB login button that shows up in the profile dropdown
 * @prop loggedInMode - show disconnect or refresh when logged in?
 */
const FBLoginButton: React.FC<Props> = ({ loggedInMode = 'refresh' }) => {
  const { user, fbRefresh } = useUser();
  const logged_in = user.fbLogin;

  // Note: window.FB is set up via index.html.
  // Types on window.FB are defined in react-app-env.d.ts.

  const syncFacebook = useCallback(async () => {
    const { data } = await axios.post(
      `${API_ENDPOINT}/api/facebook/update`,
      {},
      {
        withCredentials: true,
        headers: {
          'fb-token': FB.getAuthResponse()?.accessToken,
        },
      }
    );
    if (!data.success) {
      throw data.message;
    }
    await fbRefresh();
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
          posthog.capture('facebook-login', { info: response });

          syncFacebook()
            .then(() => {
              toast.success('Successfully connected to FB!');
            })
            .catch((err) => {
              Sentry.captureException(err);
              toast.error('Error connecting FB');
            });
        } else if (response.status === 'not_authorized') {
          // The person is logged into Facebook, but not your app.
          Sentry.captureException('FB not authorized');
        } else {
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          Sentry.captureException('Not logged into FB');
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
      .post(
        `${API_ENDPOINT}/api/facebook/disconnect`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        return fbRefresh(true);
      })
      .then(() => {
        toast.success('Facebook disconnected!');
      })
      .catch(() => {
        toast.error('Error disconnecting Facebook!');
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
      {logged_in &&
        (loggedInMode === loggedInModes[0] ? (
          <>
            <TextComponent
              type={1}
              onClick={handleLogoutClick}
              className={styles.collapse_text}
            >
              <StyledHoverText>Disconnect FB</StyledHoverText>
            </TextComponent>
          </>
        ) : (
          <>
            <RefreshText
              type={1}
              onClick={handleLoginClick}
              className={styles.collapse_text}
            >
              <StyledHoverText>Refresh FB</StyledHoverText>
            </RefreshText>
            <RefreshIcon
              className="ml-2 my-auto"
              size={15}
              color="#32CD32"
              title="Refresh FB friends"
              onClick={handleLoginClick}
            />
          </>
        ))}
    </div>
  );
};

export default FBLoginButton;
