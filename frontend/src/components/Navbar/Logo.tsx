import logo from '../../images/brand/bluebook.svg';
import wordmarkOutlines from '../../images/brand/ct_april.svg';
import wordmarkOutlinesDark from '../../images/brand/ct_april_white.svg';
import { useStore } from '../../store';
import styles from './Logo.module.css';

function Logo({
  icon = true,
  wordmark = true,
}: {
  readonly icon?: boolean;
  readonly wordmark?: boolean;
}) {
  const theme = useStore((state) => state.theme);

  return (
    <span className={styles.coursetableLogo}>
      {icon && <img src={logo} alt="" className={styles.coursetableLogoImg} />}{' '}
      {wordmark && (
        <img
          src={theme === 'dark' ? wordmarkOutlinesDark : wordmarkOutlines}
          alt="CourseTable"
          className={styles.coursetableLogoWordmark}
        />
      )}
    </span>
  );
}

export default Logo;
