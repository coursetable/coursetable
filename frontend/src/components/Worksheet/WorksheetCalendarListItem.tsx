import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ListGroup } from 'react-bootstrap';
import WorksheetHideButton from './WorksheetHideButton';
import WorksheetToggleButton from './WorksheetToggleButton';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { CatalogListing } from '../../queries/api';
import { useCourseModalLink } from '../../utilities/display';
import styles from './WorksheetCalendarListItem.module.css';

export default function WorksheetCalendarListItem({
  listing,
  hidden,
  exported,
}: {
  readonly listing: CatalogListing;
  readonly hidden: boolean;
  readonly exported: boolean;
}) {
  const target = useCourseModalLink(listing);
  const { setHoverCourse } = useWorksheet();

  return (
    <ListGroup.Item
      className={clsx(styles.listItem, 'py-1 px-2')}
      onMouseEnter={() => setHoverCourse(listing.crn)}
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
        <strong>{listing.course_code}</strong>
        <br />
        <span className={styles.courseTitle}>{listing.course.title}</span>
      </Link>
      <div className="d-flex align-items-center gap-1">
        {!exported && (
          <WorksheetHideButton
            crn={listing.crn}
            hidden={hidden}
            className={clsx(
              styles.hideButton,
              !hidden && styles.hideButtonHidden,
            )}
          />
        )}
        <WorksheetToggleButton listing={listing} modal={false} />
      </div>
    </ListGroup.Item>
  );
}
