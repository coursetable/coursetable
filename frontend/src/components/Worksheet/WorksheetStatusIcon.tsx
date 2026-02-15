import { FaLock, FaUnlock, FaStar } from 'react-icons/fa';
import styles from './WorksheetStatusIcon.module.css';

export default function WorksheetStatusIcon(
  worksheetNumber: number,
  isPrivate: boolean | undefined,
) {
  return (
    <div className={styles.statusIconContainer}>
      {worksheetNumber === 0 ? (
        <FaStar />
      ) : isPrivate ? (
        <FaLock style={{ transform: 'scale(0.85)' }} />
      ) : (
        <FaUnlock style={{ transform: 'scale(0.85)' }} />
      )}
    </div>
  );
}
