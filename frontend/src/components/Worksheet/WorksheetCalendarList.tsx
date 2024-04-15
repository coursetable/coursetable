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

import { SurfaceComponent } from '../Typography';
import WorksheetCalendarListItem from './WorksheetCalendarListItem';
import NoCourses from '../Search/NoCourses';
import { useWorksheet } from '../../contexts/worksheetContext';
import GoogleCalendarButton from './GoogleCalendarButton';
import ICSExportButton from './ICSExportButton';
import styles from './WorksheetCalendarList.module.css';

function WorksheetCalendarList() {
  const { courses, toggleCourse, person, curSeason } = useWorksheet();

  const areHidden = useMemo(
    () => courses.length > 0 && courses.every((course) => course.hidden),
    [courses],
  );

  const HideShowIcon = areHidden ? BsEyeSlash : BsEye;

  return (
    <div>
      <SurfaceComponent elevated className={styles.container}>
        <div className="shadow-sm p-2">
          <ButtonGroup className="w-100">
            {person === 'me' && (
              <OverlayTrigger
                placement="top"
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    <span>{areHidden ? 'Show' : 'Hide'} all</span>
                  </Tooltip>
                )}
              >
                <Button
                  onClick={() => toggleCourse('all', !areHidden)}
                  variant="none"
                  className={clsx(styles.button, 'px-3 w-100')}
                  aria-label={`${areHidden ? 'Show' : 'Hide'} all`}
                >
                  <HideShowIcon
                    className={clsx(styles.icon, 'my-auto pe-2')}
                    size={32}
                  />
                </Button>
              </OverlayTrigger>
            )}
            <OverlayTrigger
              placement="top"
              overlay={(props) => (
                <Tooltip id="button-tooltip" {...props}>
                  <span>Export worksheet calendar</span>
                </Tooltip>
              )}
            >
              <DropdownButton
                as="div"
                drop="down"
                align="end"
                title={
                  <TbCalendarDown
                    className={clsx(styles.icon, styles.calendarIcon)}
                    size={22}
                  />
                }
                variant="none"
                className={clsx(styles.button, 'w-100 btn')}
              >
                <Dropdown.Item eventKey="1" as="div">
                  <GoogleCalendarButton />
                </Dropdown.Item>
                <Dropdown.Item eventKey="2" as="div">
                  <ICSExportButton />
                </Dropdown.Item>
              </DropdownButton>
            </OverlayTrigger>
          </ButtonGroup>
        </div>
      </SurfaceComponent>
      <SurfaceComponent className={styles.courseList}>
        {courses.length > 0 ? (
          <ListGroup variant="flush">
            {courses.map((course) => (
              <WorksheetCalendarListItem
                key={curSeason + course.crn}
                course={course.listing}
                hidden={course.hidden}
              />
            ))}
          </ListGroup>
        ) : (
          <NoCourses />
        )}
      </SurfaceComponent>
    </div>
  );
}

export default WorksheetCalendarList;
