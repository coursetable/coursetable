import React from 'react';

import { useTheme } from '../../contexts/themeContext';
import logo from '../../images/brand/bluebook.svg';
import wordmarkOutlines from '../../images/brand/wordmark_outlines.svg';
import wordmarkOutlinesDark from '../../images/brand/ct_white.svg';
import styles from './Logo.module.css';

function Logo({
  icon = true,
  wordmark = true,
}: {
  readonly icon?: boolean;
  readonly wordmark?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <span
      className={styles.coursetableLogo}
      style={{
        display: 'block',
      }}
    >
      {icon && <img src={logo} alt="" className={styles.coursetableLogoImg} />}{' '}
      {wordmark && (
        <img
          src={theme === 'dark' ? wordmarkOutlinesDark : wordmarkOutlines}
          alt="CourseTable"
          className={styles.coursetableLogoWordmark}
        />
      )}
    </span>
  );
}

export default Logo;
