import React from 'react';
import clsx from 'clsx';
import { FaRegMoon } from 'react-icons/fa';
import { ImSun } from 'react-icons/im';
import { useTheme } from '../../contexts/themeContext';
import styles from './DarkModeButton.module.css';

/**
 * DarkMode Button
 */
function DarkModeButton() {
  const { theme } = useTheme();
  return (
    <span className={clsx(styles.button, 'my-auto')}>
      {theme === 'dark' ? (
        <ImSun size={20} style={{ display: 'block' }} />
      ) : (
        <FaRegMoon size={20} style={{ display: 'block' }} />
      )}
    </span>
  );
}

export default DarkModeButton;
