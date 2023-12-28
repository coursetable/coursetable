import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import * as Sentry from '@sentry/react';
import { getLSObject, setLSObject } from '../utilities/browserStorage';
import styles from './Notice.module.css';
import { StyledBanner } from './StyledComponents';

// Increment for each new notice, or users who previously dismissed the banner
// won't see it
const key = 1;

/**
 * Notice banner at the top of the website
 */
function Notice({ children }: { readonly children?: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const lastDismissed = getLSObject<number>('lastDismissedBanner');
    if (lastDismissed === key) setVisible(false);
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
          setLSObject('lastDismissedBanner', key);
          Sentry.captureMessage('Course evals banner dismissed');
        }}
      >
        <FaTimes style={{ display: 'block' }} />
      </span>
    </StyledBanner>
  );
}

export default Notice;
