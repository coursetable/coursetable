import React from 'react';

import logo from '../images/brand/bluebook.svg';
import wordmark_outlines from '../images/brand/wordmark_outlines.svg';
import wordmark_outlines_dark from '../images/brand/ct_white.svg';
import common_styles from '../styles/common.module.css';
import { withTheme } from 'styled-components';

/**
 * CourseTable Logo
 * @prop variant - string that determines the color scheme for the logo
 * @prop condensed - boolean that returns 'CT' if true
 */

function Logo({ icon = true, wordmark = true, theme }) {
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
}

export default withTheme(Logo);
