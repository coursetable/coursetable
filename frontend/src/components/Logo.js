import React from 'react';

import common_styles from '../styles/common.module.css';

function Logo({ variant }) {
  return (
    <span
      className={common_styles.coursetable_logo}
      style={{ color: variant === 'dark' ? 'white' : 'black' }}
    >
      Course<span style={{ color: '#92bcea' }}>Table</span>
    </span>
  );
}

export default Logo;
