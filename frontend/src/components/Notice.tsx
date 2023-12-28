import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import * as Sentry from '@sentry/react';
import {
  useLocalStorageState,
  removeLSObject,
} from '../utilities/browserStorage';
import styles from './Notice.module.css';
import { StyledBanner } from './StyledComponents';

// IMPORTANT: Increment for each new notice, or users who previously dismissed the banner
// won't see it
const key = 1;

// Get the most recently dismissed banner key from local storage
const lastDismissed = parseInt(
  localStorage.getItem('lastDismissed') || '0',
  10,
);

/**
 * Notice banner at the top of the website
 */
function Notice({ children }: { readonly children?: React.ReactNode }) {
  // Determine if the banner should be visible, if the last dismissed banner is less than the current banner key
  const shouldDisplay = lastDismissed < key;

  const dismissBanner = () => {
    localStorage.setItem('lastDismissed', key.toString());
  };

  if (!shouldDisplay || !children) return null;
  return (
    <StyledBanner className={styles.banner}>
      <div className={styles.content}>
        <div>{children}</div>
      </div>
      {/* TODO */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <span
        className={styles.closeButton}
        onClick={() => {
          dismissBanner();
          Sentry.captureMessage('Course evals banner dismissed');
        }}
      >
        <FaTimes style={{ display: 'block' }} />
      </span>
    </StyledBanner>
  );
}

export default Notice;
