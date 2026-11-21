import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createLocalStorageSlot } from '../utilities/browserStorage';
import styles from './Notice.module.css';

const storage = createLocalStorageSlot<number>('lastDismissedBanner');

function Notice({
  children,
  id,
  fallback,
}: {
  readonly children?: React.ReactNode;
  readonly id: number;
  readonly fallback?: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const lastDismissed = storage.get();
    if (lastDismissed === id) setVisible(false);
  }, [id]);

  // Full-width CourseTable notices always take precedence over promotions.
  if (!visible || !children) return fallback ?? null;
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
