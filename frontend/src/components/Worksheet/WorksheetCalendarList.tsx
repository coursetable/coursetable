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
      <div className={clsx(styles.spacer, 'pt-3')}>
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
                <Button
                  onClick={() => toggleCourse(areHidden ? -2 : -1)}
                  variant="none"
                  className={clsx(styles.button, 'px-3 w-100')}
                >
                  <HideShowIcon
                    className={clsx(styles.icon, 'my-auto pr-2')}
                    size={32}
                  />
                </Button>
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
                  as={Button}
                  drop="down"
                  menuAlign="right"
                  title={
                    <TbCalendarDown
                      className={clsx(styles.icon, styles.calendarIcon)}
                      size={22}
                    />
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
      </div>
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
