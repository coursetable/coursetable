import React from 'react';
import clsx from 'clsx';
import { FaRegMoon } from 'react-icons/fa';
import { ImSun } from 'react-icons/im';
import { useTheme } from '../../contexts/themeContext';
import styles from './DarkModeButton.module.css';

function DarkModeButton({
  className,
}: {
  readonly className: string | undefined;
}) {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === 'dark' ? FaRegMoon : ImSun;
  const label = `To ${theme === 'dark' ? 'light' : 'dark'} mode`;
  return (
    <button
      type="button"
      className={clsx(styles.button, className)}
      onClick={toggleTheme}
      title={label}
      aria-label={label}
    >
      <Icon size={20} />
    </button>
  );
}

export default DarkModeButton;
