import clsx from 'clsx';
import styles from './BetaPill.module.css';

export default function BetaPill({
  className,
}: {
  readonly className?: string;
}) {
  return <span className={clsx(styles.betaPill, className)}>Beta</span>;
}
