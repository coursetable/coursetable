import React from 'react';
import clsx from 'clsx';
import { FaRegMoon } from 'react-icons/fa';
import { ImSun } from 'react-icons/im';
import { useTheme } from '../../contexts/themeContext';
import styles from './DarkModeButton.module.css';

function DarkModeButton({ className }: { readonly className: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    // TODO
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={className} onClick={toggleTheme}>
      <span className={clsx(styles.button, 'my-auto')}>
        {theme === 'dark' ? (
          <ImSun size={20} style={{ display: 'block' }} />
        ) : (
          <FaRegMoon size={20} style={{ display: 'block' }} />
        )}
      </span>
    </div>
  );
}

export default DarkModeButton;
