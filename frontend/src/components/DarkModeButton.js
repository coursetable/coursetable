import React from 'react';

import moon from '../images/darkmode.png';
import sun from '../images/lightmode.png';

import common_styles from '../styles/common.module.css';

/**
 * DarkMode Button
 * @prop darkModeEnabled - boolean to determine which image to display (true for "sun"; false for "moon")
 */

function DarkModeButton({ darkModeEnabled = false }) {
  return (
    <span>
      <img
        src={darkModeEnabled ? sun : moon}
        alt="ChangeTheme"
        className={common_styles.dark_mode_btn}
      />
    </span>
  );
}

export default DarkModeButton;
