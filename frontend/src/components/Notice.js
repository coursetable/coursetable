import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './Notice.module.css';
import styled from 'styled-components';

export const StyledBanner = styled.div`
  background-color: ${({ theme }) => theme.banner};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: 0.3s linear;
`;

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
