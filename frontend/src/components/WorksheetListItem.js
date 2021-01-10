import React from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import styled, { withTheme } from 'styled-components';
import styles from './WorksheetListItem.module.css';
import WorksheetToggleButton from './WorksheetToggleButton';
import WorksheetHideButton from './WorksheetHideButton';

// Listgroup Item for worksheet list item
const StyledListItem = styled(ListGroup.Item)`
  background-color: transparent;
  border-color: ${({ theme }) => theme.border};
  transition: border-color 0.2s linear;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.select_hover};
  }
  /* Hides icon until you hover over the list item */
  .hidden {
    opacity: 0;
    transition: 0.2s opacity;
  }
  &:hover .hidden {
    opacity: 1;
  }
`;

/**
 * Render worksheet list item in default worksheet view
 * @prop course - current listing
 * @prop showModal - function to show modal for a certain listing
 * @prop cur_season - string that holds the current season code
 * @prop toggleCourse - function to hide/show course
 * @prop setHoverCourse - function to darken calendar events of this listing
 * @prop hidden - dictionary of hidden courses
 */

function WorksheetListItem({
  course,
  showModal,
  cur_season,
  toggleCourse,
  setHoverCourse,
  hidden,
  theme,
}) {
  // Style for coloring hidden courses
  const color_style = {
    color: hidden ? theme.hidden : theme.text[0],
  };
  return (
    <StyledListItem
      className="py-1 px-2"
      onMouseEnter={() => setHoverCourse(course.crn)}
      onMouseLeave={() => setHoverCourse(null)}
    >
      {/* Bookmark Button */}
      <div className={styles.bookmark}>
        <WorksheetToggleButton
          worksheetView
          crn={course.crn}
          season_code={cur_season}
          modal={false}
        />
      </div>
      <Row className="align-items-center mx-auto">
        {/* Course Code and Title */}
        <Col
          className={`${styles.list_text} pl-1 pr-2`}
          style={color_style}
          onClick={() => showModal(course)}
        >
          <strong>{course.course_code}</strong>
          <br />
          <span className={styles.course_title}>{course.title}</span>
        </Col>
        {/* Hide Button */}
        <Col
          xs="auto"
          className={`pl-0 pr-3 my-auto ${hidden ? 'visible' : 'hidden'}`}
        >
          <Row className="m-auto">
            <WorksheetHideButton
              toggleCourse={toggleCourse}
              hidden={hidden}
              crn={course.crn}
              season_code={cur_season}
            />
          </Row>
        </Col>
      </Row>
    </StyledListItem>
  );
}

export default React.memo(withTheme(WorksheetListItem));
