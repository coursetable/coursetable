import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createLocalStorageSlot } from '../utilities/browserStorage';
import styles from './Notice.module.css';
import { StyledBanner } from './StyledComponents';

const storage = createLocalStorageSlot<number>('lastDismissedBanner');

/**
 * Notice banner at the top of the website
 */
function Notice({
  children,
  id,
}: {
  readonly children?: React.ReactNode;
  readonly id: number;
}) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const lastDismissed = storage.get();
    if (lastDismissed === id) setVisible(false);
  }, [id]);

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
          storage.set(id);
        }}
      >
        <FaTimes style={{ display: 'block' }} />
      </span>
    </StyledBanner>
  );
}

export default Notice;
