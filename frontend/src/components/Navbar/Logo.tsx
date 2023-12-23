import React from 'react';

import { useTheme } from 'styled-components';
import logo from '../../images/brand/bluebook.svg';
import wordmarkOutlines from '../../images/brand/wordmark_outlines.svg';
import wordmarkOutlinesDark from '../../images/brand/ct_white.svg';
import styles from './Logo.module.css';

type Props = {
  /** Should we show the icon */
  readonly icon?: boolean;
  /** Should be show the wordmark */
  readonly wordmark?: boolean;
};

/**
 * CourseTable Logo
 */
function Logo({ icon = true, wordmark = true }: Props) {
  const theme = useTheme();

  return (
    <span
      className={styles.coursetable_logo}
      style={{
        display: 'block',
      }}
    >
      {icon && (
        <img src={logo} alt="" className={styles.coursetable_logo_img} />
      )}{' '}
      {wordmark && (
        <img
          src={theme.theme === 'dark' ? wordmarkOutlinesDark : wordmarkOutlines}
          alt="CourseTable"
          className={styles.coursetable_logo_wordmark}
        />
      )}
    </span>
  );
}

export default Logo;
