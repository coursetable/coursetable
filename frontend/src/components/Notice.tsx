import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useSessionStorageState } from '../browserStorage';
import styles from './Notice.module.css';
import { StyledBanner } from './StyledComponents';

/**
 * Notice banner at the top of the website
 */
const Notice: React.FC = ({ children }) => {
  // Save visibility in session storage
  const [visible, setVisible] = useSessionStorageState(
    'noticeVisibility',
    true,
  );

  if (!visible) {
    return <></>;
  }

  return (
    <StyledBanner className={styles.banner}>
      <div className={styles.content}>
        <div>{children}</div>
      </div>
      <span className={styles.close_button} onClick={() => setVisible(false)}>
        <FaTimes style={{ display: 'block' }} />
      </span>
    </StyledBanner>
  );
};

export default Notice;
