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
import clsx from 'clsx';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { TbCalendarDown } from 'react-icons/tb';

import { SurfaceComponent } from '../StyledComponents';
import WorksheetCalendarListItem from './WorksheetCalendarListItem';
import WorksheetStats from './WorksheetStats';
import NoCourses from '../Search/NoCourses';
import { useWorksheet } from '../../contexts/worksheetContext';
import GoogleCalendarButton from './GoogleCalendarButton';
import ICSExportButton from './ICSExportButton';
import styles from './WorksheetCalendarList.module.css';

// Space above row dropdown to hide scrolled courses
const StyledSpacer = styled.div`
  background-color: ${({ theme }) => theme.background};
  transition:
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};
`;

const StyledTbCalendarDown = styled(TbCalendarDown)`
  color: ${({ theme }) => theme.text[0]};
`;

// Show/hide all button
const StyledBtn = styled(Button)`
  background-color: ${({ theme }) => theme.select};
  color: ${({ theme }) => theme.text[0]};
  transition:
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};

  &:active {
    background-color: ${({ theme }) => theme.buttonActive} !important;
  }

  &:disabled {
    color: ${({ theme }) => theme.text[2]} !important;
  }

  &:hover {
    background-color: ${({ theme }) => theme.buttonActive};
    color: ${({ theme }) => theme.text[0]} !important;
  }

  &:focus {
    background-color: ${({ theme }) => theme.select};
  }

  &.form-control:focus {
    color: ${({ theme }) => theme.text[0]};
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

  const HideShowIcon = areHidden ? BsEyeSlash : BsEye;

  return (
    <>
      <WorksheetStats />
      <StyledSpacer className={clsx(styles.spacer, 'pt-3')}>
        <SurfaceComponent layer={1} className={clsx(styles.container, 'mx-1')}>
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
                  className={clsx(styles.button, 'px-3 w-100')}
                >
                  <HideShowIcon
                    className={clsx(styles.icon, 'my-auto pr-2')}
                    size={32}
                  />
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
                  title={
                    <StyledTbCalendarDown className={styles.icon} size={22} />
                  }
                  variant="none"
                  className={clsx(styles.button, 'w-100')}
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
        </SurfaceComponent>
      </StyledSpacer>
      {/* List of courses for this season */}
      <SurfaceComponent layer={0} className={clsx(styles.courseList, 'mx-1')}>
        {items.length > 0 ? (
          // There are courses for this season
          <ListGroup variant="flush">{items}</ListGroup>
        ) : (
          // There aren't courses for this season
          <NoCourses />
        )}
      </SurfaceComponent>
    </>
  );
}

export default WorksheetCalendarList;
