import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, ListGroup } from 'react-bootstrap';
import clsx from 'clsx';
import styles from './WorksheetCalendarListItem.module.css';
import WorksheetToggleButton from './WorksheetToggleButton';
import WorksheetHideButton from './WorksheetHideButton';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { Listing } from '../../utilities/common';

/**
 * Render worksheet list item in default worksheet view
 * @prop course - object | current listing
 * @prop hidden - object | dictionary of hidden courses
 */
export default function WorksheetCalendarListItem({
  course,
  hidden,
}: {
  readonly course: Listing;
  readonly hidden: boolean;
}) {
  const [, setSearchParams] = useSearchParams();
  const { curSeason, toggleCourse, setHoverCourse } = useWorksheet();

  return (
    <ListGroup.Item
      className={clsx(styles.listItem, 'py-1 px-2')}
      onMouseEnter={() => setHoverCourse(course.crn)}
      onMouseLeave={() => setHoverCourse(null)}
    >
      <Row className="align-items-center mx-auto">
        {/* Course Code and Title */}
        <Col
          className={clsx(styles.courseCode, 'pl-1 pr-2')}
          style={{
            color: hidden ? 'var(--color-hidden)' : 'var(--color-text)',
          }}
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
        </Col>
        {/* Hide Button */}
        <div
          className={clsx('mr-1 my-auto', !hidden && styles.hideButtonHidden)}
        >
          <WorksheetHideButton
            toggleCourse={() => toggleCourse(course.crn)}
            hidden={hidden}
          />
        </div>
        {/* Add/remove from worksheet button */}
        <div className="my-auto">
          <WorksheetToggleButton
            crn={course.crn}
            seasonCode={curSeason}
            modal={false}
          />
        </div>
      </Row>
    </ListGroup.Item>
  );
}
