import type { GridChildComponentProps } from 'react-window';
import type { WishlistGridItemData } from './WishlistGrid';
import styles from './WishlistGridItem.module.css';

function WishlistGridItem({
  data: { courses, columnCount },
  rowIndex,
  columnIndex,
  style,
}: GridChildComponentProps<WishlistGridItemData>) {
  const course = courses[rowIndex * columnCount + columnIndex];

  if (!course) return null;

  return (
    <li className={styles.container} style={style}>
      {course.courseCode}
    </li>
  );
}

export default WishlistGridItem;
