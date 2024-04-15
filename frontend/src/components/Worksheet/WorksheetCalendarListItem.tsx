import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import clsx from 'clsx';
import styles from './WorksheetCalendarListItem.module.css';
import WorksheetToggleButton from './WorksheetToggleButton';
import WorksheetHideButton from './WorksheetHideButton';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { Listing } from '../../utilities/common';

export default function WorksheetCalendarListItem({
  course,
  hidden,
}: {
  readonly course: Listing;
  readonly hidden: boolean;
}) {
  const [, setSearchParams] = useSearchParams();
  const { setHoverCourse } = useWorksheet();

  return (
    <ListGroup.Item
      className={clsx(styles.listItem, 'py-1 px-2')}
      onMouseEnter={() => setHoverCourse(course.crn)}
      onMouseLeave={() => setHoverCourse(null)}
    >
      <button
        type="button"
        className={clsx(
          styles.courseCode,
          hidden && styles.courseCodeHidden,
          'ps-1 pe-2',
        )}
        onClick={() => {
          setSearchParams((prev) => {
            prev.set('course-modal', `${course.season_code}-${course.crn}`);
            return prev;
          });
        }}
      >
        <strong>{course.course_code}</strong>
        <br />
        <span className={styles.courseTitle}>{course.title}</span>
      </button>
      <div className="d-flex align-items-center">
        <div className={clsx(!hidden && styles.hideButtonHidden)}>
          <WorksheetHideButton crn={course.crn} hidden={hidden} />
        </div>
        <WorksheetToggleButton listing={course} modal={false} />
      </div>
    </ListGroup.Item>
  );
}
