import React from 'react';

import logo from '../images/brand/bluebook.svg';
import wordmark_outlines from '../images/brand/wordmark_outlines.svg';
import common_styles from '../styles/common.module.css';

/**
 * CourseTable Logo
 * @prop variant - string that determines the color scheme for the logo
 * @prop condensed - boolean that returns 'CT' if true
 */

function Logo({ variant, icon = true, wordmark = true }) {
  return (
    <span
      className={common_styles.coursetable_logo}
      style={{
        color: variant === 'dark' ? 'white' : 'black',
      }}
    >
      {icon && (
        <img src={logo} alt="" className={common_styles.coursetable_logo_img} />
      )}{' '}
      {wordmark && (
        <img
          src={wordmark_outlines}
          alt="CourseTable"
          className={common_styles.coursetable_logo_wordmark}
        />
      )}
    </span>
  );
}

export default Logo;
