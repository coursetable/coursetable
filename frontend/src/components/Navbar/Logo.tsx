import React from 'react';

import { useTheme } from 'styled-components';
import logo from '../../images/brand/bluebook.svg';
import wordmark_outlines from '../../images/brand/wordmark_outlines.svg';
import wordmark_outlines_dark from '../../images/brand/ct_white.svg';
import common_styles from '../../styles/common.module.css';

type Props = {
  /** Should we show the icon */
  icon?: boolean;
  /** Should be show the wordmark */
  wordmark?: boolean;
};

/**
 * CourseTable Logo
 */
const Logo: React.VFC<Props> = ({ icon = true, wordmark = true }) => {
  const theme = useTheme();

  return (
    <span
      className={common_styles.coursetable_logo}
      style={{
        display: 'block',
      }}
    >
      {icon && (
        <img src={logo} alt="" className={common_styles.coursetable_logo_img} />
      )}{' '}
      {wordmark && (
        <img
          src={
            theme.theme === 'dark' ? wordmark_outlines_dark : wordmark_outlines
          }
          alt="CourseTable"
          className={common_styles.coursetable_logo_wordmark}
        />
      )}
    </span>
  );
};

export default Logo;
