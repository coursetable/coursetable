import { FaUnlockAlt } from 'react-icons/fa';
import { FaLock, FaStar } from 'react-icons/fa6';

export default function WorksheetStatusIcon(
  worksheetNumber: number,
  isPrivate: boolean | undefined,
) {
  if (worksheetNumber === 0) return <FaStar />;
  return isPrivate ? (
    <FaLock style={{ transform: 'scale(0.9)' }} />
  ) : (
    <FaUnlockAlt style={{ transform: 'scale(0.9)' }} />
  );
}
