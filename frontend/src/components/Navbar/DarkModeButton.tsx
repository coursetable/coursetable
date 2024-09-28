import clsx from 'clsx';
import { FaRegMoon } from 'react-icons/fa';
import { ImSun } from 'react-icons/im';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '../../store';
import styles from './DarkModeButton.module.css';

function DarkModeButton({
  className,
}: {
  readonly className: string | undefined;
}) {
  const { theme, toggleTheme } = useStore(
    useShallow((state) => ({
      theme: state.theme,
      toggleTheme: state.toggleTheme,
    })),
  );
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
