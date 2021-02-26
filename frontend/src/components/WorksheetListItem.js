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
  overflow: hidden;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.select_hover};
  }
  /* Hides icon until you hover over the list item */
  .hidden {
    opacity: 0;
    transition: 0.05s opacity;
  }
  &:hover .hidden {
    opacity: 1;
  }
`;

/**
 * Render worksheet list item in default worksheet view
 * @prop course - object | current listing
 * @prop showModal - function | to show modal for a certain listing
 * @prop cur_season - string | holds the current season code
 * @prop toggleCourse - function | to hide/show course
 * @prop setHoverCourse - function | to darken calendar events of this listing
 * @prop hidden - object | dictionary of hidden courses
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
        <div className={`mr-1 my-auto ${hidden ? 'visible' : 'hidden'}`}>
          <WorksheetHideButton
            toggleCourse={toggleCourse}
            hidden={hidden}
            crn={course.crn}
            season_code={cur_season}
          />
        </div>
        {/* Add/remove from worksheet button */}
        <div className="my-auto">
          <WorksheetToggleButton
            worksheetView
            crn={course.crn}
            season_code={cur_season}
            modal={false}
          />
        </div>
      </Row>
    </StyledListItem>
  );
}

export default React.memo(withTheme(WorksheetListItem));
