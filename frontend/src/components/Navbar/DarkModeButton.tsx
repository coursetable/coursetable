import React from 'react';
import clsx from 'clsx';
import { FaRegMoon } from 'react-icons/fa';
import { ImSun } from 'react-icons/im';
import { useTheme } from '../../contexts/themeContext';
import styles from './DarkModeButton.module.css';

function DarkModeButton({ className }: { readonly className: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className={className}
      onClick={toggleTheme}
      title={`To ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className={clsx(styles.button, 'my-auto')}>
        {theme === 'dark' ? (
          <FaRegMoon size={20} style={{ display: 'block' }} />
        ) : (
          <ImSun size={20} style={{ display: 'block' }} />
        )}
      </span>
    </button>
  );
}

export default DarkModeButton;
