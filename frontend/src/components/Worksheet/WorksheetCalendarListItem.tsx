import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, ListGroup } from 'react-bootstrap';
import styled, { withTheme, type DefaultTheme } from 'styled-components';
import clsx from 'clsx';
import styles from './WorksheetCalendarListItem.module.css';
import WorksheetToggleButton from './WorksheetToggleButton';
import WorksheetHideButton from './WorksheetHideButton';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { Listing } from '../../utilities/common';

// Listgroup Item for worksheet list item
const StyledListItem = styled(ListGroup.Item)`
  background-color: transparent;
  border-color: ${({ theme }) => theme.border};
  overflow: hidden;
  transition:
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.selectHover};
  }
  /* Hides icon until you hover over the list item */
  .hidden {
    opacity: 0;
    transition: 0.05s opacity;
  }
  &:hover .hidden {
    opacity: 1;
  }
  @media only screen and (max-width: 480px) {
    .hidden {
      opacity: 1;
    }
  }
`;

// Course code
const StyledCol = styled(Col)`
  overflow: hidden;
  transition: color ${({ theme }) => theme.transDur};
`;

/**
 * Render worksheet list item in default worksheet view
 * @prop course - object | current listing
 * @prop hidden - object | dictionary of hidden courses
 */
function WorksheetCalendarListItem({
  course,
  hidden,
  theme,
  worksheetNumber,
}: {
  readonly course: Listing;
  readonly hidden: boolean;
  readonly theme: DefaultTheme;
  readonly worksheetNumber?: string;
}) {
  const [, setSearchParams] = useSearchParams();
  const { curSeason, toggleCourse, setHoverCourse } = useWorksheet();

  // Style for coloring hidden courses
  const colorStyle = {
    color: hidden ? theme.hidden : theme.text[0],
  };
  return (
    <StyledListItem
      className="py-1 px-2"
      onMouseEnter={() => setHoverCourse(course.crn)}
      onMouseLeave={() => setHoverCourse(null)}
    >
      <Row className="align-items-center mx-auto">
        {/* Course Code and Title */}
        <StyledCol
          className="pl-1 pr-2"
          style={colorStyle}
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
        </StyledCol>
        {/* Hide Button */}
        <div className={clsx('mr-1 my-auto', hidden ? 'visible' : 'hidden')}>
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
            selectedWorksheet={worksheetNumber}
          />
        </div>
      </Row>
    </StyledListItem>
  );
}

export default withTheme(WorksheetCalendarListItem);
