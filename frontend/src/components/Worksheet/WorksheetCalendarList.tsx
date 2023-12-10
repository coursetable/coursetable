import React, { useMemo } from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { SurfaceComponent } from '../StyledComponents';
import WorksheetCalendarListItem from './WorksheetCalendarListItem';
import WorksheetStats from './WorksheetStats';
import NoCourses from '../Search/NoCourses';
import { useWorksheet } from '../../contexts/worksheetContext';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import GoogleCalendarButton from './GoogleCalendarButton';

// Space above row dropdown to hide scrolled courses
const StyledSpacer = styled.div`
  background-color: ${({ theme }) => theme.background};
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 56px;
  z-index: 2;
  transition:
    border-color ${({ theme }) => theme.trans_dur},
    background-color ${({ theme }) => theme.trans_dur},
    color ${({ theme }) => theme.trans_dur};
`;

// Hide icon
const StyledBsEyeSlash = styled(BsEyeSlash)`
  transition: transform 0.3s !important;
`;

// Show icon
const StyledBsEye = styled(BsEye)`
  transition: transform 0.3s !important;
`;

// Show/hide all button
export const StyledBtn = styled.div`
  background-color: ${({ theme }) => theme.select};
  color: ${({ theme }) => theme.text[0]};
  padding: 5px;
  cursor: pointer;
  text-align: center;
  border: solid 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  margin-bottom: 5px;
  transition:
    border-color ${({ theme }) => theme.trans_dur},
    background-color ${({ theme }) => theme.trans_dur},
    color ${({ theme }) => theme.trans_dur};

  &:hover {
    border: 2px solid hsl(0, 0%, 70%);
    ${StyledBsEyeSlash} {
      transform: scale(1.15);
    }
    ${StyledBsEye} {
      transform: scale(1.15);
    }
  }

  &:focus {
    background-color: ${({ theme }) => theme.select};
  }

  &.form-control:focus {
    color: ${({ theme }) => theme.text[0]};
  }
`;

// Container of row dropdown (without spacer)
const StyledContainer = styled(SurfaceComponent)`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
`;

// Course list
const CourseList = styled(SurfaceComponent)`
  overflow-x: hidden;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
`;

/**
 * Render worksheet list in default worksheet view
 */

function WorksheetCalendarList() {
  const {
    courses,
    cur_season,
    hidden_courses,
    worksheet_number,
    toggleCourse,
  } = useWorksheet();

  // Build the HTML for the list of courses of a given season
  const items = useMemo(() => {
    // List to hold HTML
    const listitems = courses.map((course, id) => {
      let hidden = false;
      if (Object.prototype.hasOwnProperty.call(hidden_courses, cur_season)) {
        hidden = hidden_courses[cur_season][course.crn];
      }
      // Add listgroup item to listitems list
      return (
        <WorksheetCalendarListItem
          key={id}
          course={course}
          hidden={hidden}
          worksheet_number={worksheet_number}
        />
      );
    });

    return listitems;
  }, [courses, hidden_courses, cur_season, worksheet_number]);

  const areHidden = useMemo(() => {
    if (!Object.prototype.hasOwnProperty.call(hidden_courses, cur_season)) {
      return false;
    }
    return Object.keys(hidden_courses[cur_season]).length === courses.length;
  }, [hidden_courses, courses, cur_season]);

  return (
    <>
      <WorksheetStats />
      {/* Hide/show toggle */}
      <StyledSpacer className="pt-3">
        <StyledContainer layer={1} className="mx-1">
          <div className="shadow-sm p-2">
            {/* Gcal Button */}
            <Row className="mx-auto">
              <Col className="px-0 w-100">
                <GoogleCalendarButton
                  courses={courses.filter(
                    (course) =>
                      !hidden_courses[cur_season] ||
                      !(course.crn in hidden_courses[cur_season]) ||
                      !hidden_courses[cur_season][course.crn],
                  )}
                  season_code={cur_season}
                />
              </Col>
            </Row>
            {/* Hide/Show All Button */}
            <Row className="mx-auto">
              <Col className="px-0 w-100">
                <StyledBtn onClick={() => toggleCourse(areHidden ? -2 : -1)}>
                  {areHidden ? (
                    <>
                      <StyledBsEyeSlash className="my-auto pr-2" size={26} />{' '}
                      Show
                    </>
                  ) : (
                    <>
                      <StyledBsEye className="my-auto pr-2" size={26} /> Hide
                    </>
                  )}{' '}
                  All
                </StyledBtn>
              </Col>
            </Row>
          </div>
        </StyledContainer>
      </StyledSpacer>
      {/* List of courses for this season */}
      <CourseList layer={0} className="mx-1">
        {items.length > 0 ? (
          // There are courses for this season
          <ListGroup variant="flush">{items}</ListGroup>
        ) : (
          // There aren't courses for this season
          <NoCourses />
        )}
      </CourseList>
    </>
  );
}

// WorksheetCalendarList.whyDidYouRender = true;
export default React.memo(WorksheetCalendarList);
