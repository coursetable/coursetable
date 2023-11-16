import React from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import styled, { withTheme, type DefaultTheme } from 'styled-components';
import styles from './WorksheetCalendarListItem.module.css';
import WorksheetToggleButton from './WorksheetToggleButton';
import WorksheetHideButton from './WorksheetHideButton';
import { useWorksheet } from '../../contexts/worksheetContext';
import { Listing } from '../Providers/FerryProvider';

// Listgroup Item for worksheet list item
const StyledListItem = styled(ListGroup.Item)`
  background-color: transparent;
  border-color: ${({ theme }) => theme.border};
  overflow: hidden;
  transition:
    border-color ${({ theme }) => theme.trans_dur},
    background-color ${({ theme }) => theme.trans_dur},
    color ${({ theme }) => theme.trans_dur};
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
  @media only screen and (max-width: 480px) {
    .hidden {
      opacity: 1;
    }
  }
`;

// Course code
const StyledCol = styled(Col)`
  overflow: hidden;
  transition: color ${({ theme }) => theme.trans_dur};
`;

/**
 * Render worksheet list item in default worksheet view
 * @prop course - object | current listing
 * @prop hidden - object | dictionary of hidden courses
 */
function WorksheetMobileCalendarListItem({
  course,
  hidden,
  theme,
  worksheet_number,
}: {
  course: Listing;
  hidden: boolean;
  theme: DefaultTheme;
  worksheet_number?: string;
}) {
  const { showModal, cur_season, toggleCourse } =
    useWorksheet();

  // Style for coloring hidden courses
  const color_style = {
    color: hidden ? theme.hidden : theme.text[0],
  };
  return (
    <StyledListItem
      className="py-1 px-2"
    >
      <Row className="align-items-center mx-auto">
        {/* Course Code and Title */}
        <StyledCol
          className="pl-1 pr-2"
          style={color_style}
          onClick={() => showModal(course)}
        >
          <strong>{course.course_code}</strong>
          <br />
          <span className={styles.course_title}>{course.title}</span>
        </StyledCol>
        {/* Hide Button */}
        <div className={`mr-1 my-auto ${hidden ? 'visible' : 'hidden'}`}>
          <WorksheetHideButton
            toggleCourse={toggleCourse}
            hidden={hidden}
            crn={course.crn}
          />
        </div>
        {/* Add/remove from worksheet button */}
        <div className="my-auto">
          <WorksheetToggleButton
            crn={course.crn}
            season_code={cur_season}
            modal={false}
            selectedWorksheet={worksheet_number}
          />
        </div>
      </Row>
    </StyledListItem>
  );
}

export default React.memo(withTheme(WorksheetMobileCalendarListItem));
