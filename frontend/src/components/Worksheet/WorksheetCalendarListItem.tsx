import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ListGroup } from 'react-bootstrap';
import WorksheetHideButton from './WorksheetHideButton';
import WorksheetToggleButton from './WorksheetToggleButton';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { Listing } from '../../queries/api';
import { useCourseModalLink } from '../../utilities/display';
import styles from './WorksheetCalendarListItem.module.css';

export default function WorksheetCalendarListItem({
  course,
  hidden,
}: {
  readonly course: Listing;
  readonly hidden: boolean;
}) {
  const target = useCourseModalLink(course);
  const { setHoverCourse } = useWorksheet();

  return (
    <ListGroup.Item
      className={clsx(styles.listItem, 'py-1 px-2')}
      onMouseEnter={() => setHoverCourse(course.crn)}
      onMouseLeave={() => setHoverCourse(null)}
    >
      <Link
        to={target}
        className={clsx(
          styles.courseCode,
          hidden && styles.courseCodeHidden,
          'ps-1 pe-2',
        )}
      >
        <strong>{course.course_code}</strong>
        <br />
        <span className={styles.courseTitle}>{course.title}</span>
      </Link>
      <div className="d-flex align-items-center gap-1">
        <WorksheetHideButton
          crn={course.crn}
          hidden={hidden}
          className={clsx(
            styles.hideButton,
            !hidden && styles.hideButtonHidden,
          )}
        />
        <WorksheetToggleButton listing={course} modal={false} />
      </div>
    </ListGroup.Item>
  );
}
