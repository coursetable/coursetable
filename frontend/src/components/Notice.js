import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './Notice.module.css';

function Notice({ children }) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return <></>;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.content_inner}>{children}</div>
      </div>
      <span className={styles.close_button} onClick={() => setVisible(false)}>
        <FaTimes style={{ display: 'block' }} />
      </span>
    </div>
  );
}

export default Notice;
