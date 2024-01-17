import React, { useMemo } from 'react';
import {
  ListGroup,
  Button,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import styled from 'styled-components';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { TbFileExport } from 'react-icons/tb';

import { SurfaceComponent } from '../StyledComponents';
import WorksheetCalendarListItem from './WorksheetCalendarListItem';
import WorksheetStats from './WorksheetStats';
import NoCourses from '../Search/NoCourses';
import { useWorksheet } from '../../contexts/worksheetContext';
import GoogleCalendarButton from './GoogleCalendarButton';
import ICSExportButton from './ICSExportButton';

// Space above row dropdown to hide scrolled courses
const StyledSpacer = styled.div`
  background-color: ${({ theme }) => theme.background};
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 56px;
  z-index: 2;
  transition:
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};
`;

// Hide icon
const StyledBsEyeSlash = styled(BsEyeSlash)`
  transition: transform 0.3s !important;
`;

// Show icon
const StyledBsEye = styled(BsEye)`
  transition: transform 0.3s !important;
`;

const StyledTbFileExport = styled(TbFileExport)`
  transition: transform 0.3s !important;
  color: ${({ theme }) => theme.text[0]};
`;

// Show/hide all button
const StyledBtn = styled(Button)`
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
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};

  &:active {
    background-color: ${({ theme }) => theme.buttonActive} !important;
  }

  &:disabled {
    background-color: transparent;
    color: ${({ theme }) => theme.text[2]} !important;
  }

  &:hover {
    border: 2px solid hsl(0, 0%, 70%);
    background-color: ${({ theme }) => theme.buttonActive};
    color: ${({ theme }) => theme.text[0]} !important;
    ${StyledBsEyeSlash}, ${StyledBsEye}, ${StyledTbFileExport} {
      transform: scale(1.15);
    }
  }

  &:focus {
    background-color: ${({ theme }) => theme.select};
  }

  &.form-control:focus {
    color: ${({ theme }) => theme.text[0]};
  }

  & .dropdown-menu {
    min-width: 20rem !important;
  }

  & .dropdown-menu,
  & .dropdown-item {
    color: ${({ theme }) => theme.text[0]};
    background-color: ${({ theme }) => theme.surface[1]};
  }

  & .dropdown-item:hover {
    background-color: ${({ theme }) => theme.selectHover};
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
  const { courses, curSeason, hiddenCourses, worksheetNumber, toggleCourse } =
    useWorksheet();

  // Build the HTML for the list of courses of a given season
  const items = useMemo(
    () =>
      courses.map((course, i) => (
        <WorksheetCalendarListItem
          key={i}
          course={course}
          hidden={hiddenCourses[curSeason]?.[course.crn] ?? false}
          worksheetNumber={worksheetNumber}
        />
      )),
    [courses, hiddenCourses, curSeason, worksheetNumber],
  );

  const areHidden = useMemo(() => {
    if (!(curSeason in hiddenCourses)) return false;
    return Object.keys(hiddenCourses[curSeason]!).length === courses.length;
  }, [hiddenCourses, courses, curSeason]);

  const HideShowIcon = areHidden ? StyledBsEyeSlash : StyledBsEye;

  return (
    <>
      <WorksheetStats />
      <StyledSpacer className="pt-3">
        <StyledContainer layer={1} className="mx-1">
          <div className="shadow-sm p-2">
            <ButtonGroup className="w-100">
              <OverlayTrigger
                placement="top"
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    <span>{areHidden ? 'Show' : 'Hide'} all</span>
                  </Tooltip>
                )}
              >
                <StyledBtn
                  onClick={() => toggleCourse(areHidden ? -2 : -1)}
                  variant="none"
                  className="px-3 w-100"
                >
                  <HideShowIcon className="my-auto pr-2" size={32} />
                </StyledBtn>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    <span>Export worksheet calendar</span>
                  </Tooltip>
                )}
              >
                <DropdownButton
                  as={StyledBtn}
                  drop="down"
                  menuAlign="right"
                  title={<StyledTbFileExport size={22} />}
                  variant="none"
                  className="w-100"
                >
                  <Dropdown.Item eventKey="1">
                    <GoogleCalendarButton />
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="2">
                    <ICSExportButton />
                  </Dropdown.Item>
                </DropdownButton>
              </OverlayTrigger>
            </ButtonGroup>
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

export default WorksheetCalendarList;
