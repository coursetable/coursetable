import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './Notice.module.css';
import { StyledBanner } from './StyledComponents';

function Notice({ children }) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return <></>;
  }

  return (
    <StyledBanner className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.content_inner}>{children}</div>
      </div>
      <span className={styles.close_button} onClick={() => setVisible(false)}>
        <FaTimes style={{ display: 'block' }} />
      </span>
    </StyledBanner>
  );
}

export default Notice;
