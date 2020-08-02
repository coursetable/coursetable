import React from 'react';

import common_styles from '../styles/common.module.css';

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
