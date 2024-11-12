import { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  ListGroup,
  Button,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { TbCalendarDown } from 'react-icons/tb';

import GoogleCalendarButton from './GoogleCalendarButton';
import ICSExportButton from './ICSExportButton';
import WorksheetCalendarListItem from './WorksheetCalendarListItem';
import { useWorksheet, WorksheetCourse } from '../../contexts/worksheetContext';
import { useCourseData } from '../../contexts/ferryContext';
import { linkDataToCourses } from '../../utilities/course';
import NoCourses from '../Search/NoCourses';
import { SurfaceComponent } from '../Typography';
import styles from './WorksheetCalendarList.module.css';

function WorksheetCalendarList() {
  const { courses, toggleCourse, person, curSeason } = useWorksheet();
  const [searchParams, setSearchParams] = useSearchParams();
  const [linkCourses, setLinkCourses] = useState<WorksheetCourse[]>([]);

  const areHidden = useMemo(
    () => {
      if (linkCourses.length == 0) {
        return courses.length > 0 && courses.every((course) => course.hidden)
      } else {
        return linkCourses.every((course) => course.hidden)
      }
    },
    [courses, linkCourses],
  );

  const {
    loading: coursesLoading,
    courses: courseData,
    error: courseLoadError,
  } = useCourseData([curSeason]);

  useEffect(() => {
    const data = searchParams.get("ws");
    if (!data) return;
    const courseObjects = linkDataToCourses(courseData, curSeason, data);
    setLinkCourses(courseObjects);
    // import courses
  }, [])

  // eslint-disable-next-line no-useless-assignment
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
        {(linkCourses.length == 0 && courses.length > 0) && (
          <ListGroup variant="flush">
            {courses.map((course) => (
              <WorksheetCalendarListItem
                key={curSeason + course.crn}
                listing={course.listing}
                hidden={false}
                exported={true}
              />
            ))}
          </ListGroup>
        )}
        {linkCourses.length == 0 && courses.length == 0 && (
          <NoCourses />
        )}
        {linkCourses.length > 0 && (
          <ListGroup variant="flush">
            {linkCourses.map((course) => (
              <WorksheetCalendarListItem
                key={curSeason + course.crn}
                listing={course.listing}
                hidden={course.hidden ?? false}
                exported={false}
              />
            ))}
          </ListGroup>
        )}
      </SurfaceComponent>
    </div>
  );
}

export default WorksheetCalendarList;
