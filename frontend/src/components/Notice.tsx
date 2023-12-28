import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import * as Sentry from '@sentry/react';
import {
  useLocalStorageState,
  removeLSObject,
} from '../utilities/browserStorage';
import styles from './Notice.module.css';
import { StyledBanner } from './StyledComponents';

// Increment for each new notice, or users who previously dismissed the banner
// won't see it
const key = 1;

/**
 * Notice banner at the top of the website
 */
function Notice({ children }: { readonly children?: React.ReactNode }) {
  // Save visibility in local storage so it doesn't come back every time user
  // opens the page. Important if you want to collect analytics
  const [visible, setVisible] = useLocalStorageState(
    `noticeVisibility-${key}`,
    true,
  );
  useEffect(() => {
    removeLSObject(`noticeVisibility-${key - 1}`);
  }, []);

  if (!visible || !children) return null;
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
          setVisible(false);
          Sentry.captureMessage('Course evals banner dismissed');
        }}
      >
        <FaTimes style={{ display: 'block' }} />
      </span>
    </StyledBanner>
  );
}

export default Notice;
