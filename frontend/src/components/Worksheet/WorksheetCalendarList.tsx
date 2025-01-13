import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  ListGroup,
  Button,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
  Modal,
} from 'react-bootstrap';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { CiSettings } from 'react-icons/ci';
import { TbCalendarDown } from 'react-icons/tb';

import GoogleCalendarButton from './GoogleCalendarButton';
import ICSExportButton from './ICSExportButton';
import URLExportButton from './URLExportButton';
import WorksheetCalendarListItem from './WorksheetCalendarListItem';
import { useWorksheet } from '../../contexts/worksheetContext';
import { setCourseHidden } from '../../queries/api';
import { useStore } from '../../store';
import NoCourses from '../Search/NoCourses';
import { SurfaceComponent } from '../Typography';
import styles from './WorksheetCalendarList.module.css';

function WorksheetCalendarList() {
  const { courses, viewedSeason, viewedWorksheetNumber, isReadonlyWorksheet } =
    useWorksheet();
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);

  const areHidden = useMemo(
    () => courses.length > 0 && courses.every((course) => course.hidden),
    [courses],
  );

   
  const HideShowIcon = areHidden ? BsEyeSlash : BsEye;

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <div>
      <SurfaceComponent elevated className={styles.container}>
        <div className="shadow-sm p-2">
          <ButtonGroup className="w-100">
            {!isReadonlyWorksheet && (
              <OverlayTrigger
                placement="top"
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    <span>{areHidden ? 'Show' : 'Hide'} all</span>
                  </Tooltip>
                )}
              >
                <Button
                  onClick={async () => {
                    await setCourseHidden({
                      season: viewedSeason,
                      worksheetNumber: viewedWorksheetNumber,
                      crn: courses.map((course) => course.listing.crn),
                      hidden: !areHidden,
                    });
                    await worksheetsRefresh();
                  }}
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
                  <span>Worksheet Settings</span>
                </Tooltip>
              )}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSettingsModalOpen(true);
                }}
                variant="none"
                className={clsx(styles.button, 'px-3 w-100')}
                aria-label="Worksheet Settings"
              >
                <CiSettings className={clsx(styles.icon)} size={32} />
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
                <Dropdown.Item eventKey="3" as="div">
                  <URLExportButton />
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
                key={viewedSeason + course.crn}
                listing={course.listing}
                hidden={course.hidden ?? false}
              />
            ))}
          </ListGroup>
        ) : (
          <NoCourses />
        )}
      </SurfaceComponent>
      <Modal
        show={settingsModalOpen}
        onHide={() => setSettingsModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Worksheet Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Settings content goes here.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setSettingsModalOpen(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => setSettingsModalOpen(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default WorksheetCalendarList;
