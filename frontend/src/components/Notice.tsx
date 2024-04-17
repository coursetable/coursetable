import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createLocalStorageSlot } from '../utilities/browserStorage';
import styles from './Notice.module.css';

const storage = createLocalStorageSlot<number>('lastDismissedBanner');

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
    <div className={styles.banner}>
      <div className={styles.content}>
        <div>{children}</div>
      </div>
      <button
        type="button"
        className={styles.closeButton}
        onClick={() => {
          setVisible(false);
          storage.set(id);
        }}
        aria-label="Close"
      >
        <FaTimes />
      </button>
    </div>
  );
}

export default Notice;
