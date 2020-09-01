import React from 'react';

import common_styles from '../styles/common.module.css';

/**
 * CourseTable Logo
 * @prop variant - string that determines the color scheme for the logo
 * @prop condensed - boolean that returns 'CT' if true
 */

function Logo({ variant, condensed = false }) {
  return (
    <span
      className={common_styles.coursetable_logo}
      style={{
        color: variant === 'dark' ? 'white' : 'black',
      }}
    >
      {condensed ? 'C' : 'Course'}
      <span style={{ color: '#92bcea' }}>{condensed ? 'T' : 'Table'}</span>
    </span>
  );
}

export default Logo;
