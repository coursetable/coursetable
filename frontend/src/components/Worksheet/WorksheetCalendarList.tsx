import { useEffect, useMemo, useState } from 'react';
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
  Form,
  Spinner,
} from 'react-bootstrap';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { CiSettings } from 'react-icons/ci';
import { TbCalendarDown } from 'react-icons/tb';

import { useShallow } from 'zustand/react/shallow';
import GoogleCalendarButton from './GoogleCalendarButton';
import ICSExportButton from './ICSExportButton';
import URLExportButton from './URLExportButton';
import WorksheetCalendarListItem from './WorksheetCalendarListItem';
import { setCourseHidden, updateWorksheetMetadata } from '../../queries/api';
import { useStore } from '../../store';
import { toLocationsSummary } from '../../utilities/course';
import NoCourses from '../Search/NoCourses';
import { SurfaceComponent } from '../Typography';
import styles from './WorksheetCalendarList.module.css';

type WorksheetCalendarListProps = {
  readonly highlightBuilding?: string | null;
  readonly showLocation?: boolean;
  readonly showMissingLocationIcon?: boolean;
  readonly controlsMode?: 'full' | 'hide-only' | 'none' | 'map';
  readonly missingBuildingCodes?: Set<string>;
  readonly hideTooltipContext?: 'calendar' | 'map';
};

function WorksheetCalendarList({
  highlightBuilding = null,
  showLocation = false,
  showMissingLocationIcon = false,
  controlsMode = 'full',
  missingBuildingCodes,
  hideTooltipContext = 'calendar',
}: WorksheetCalendarListProps = {}) {
  const {
    courses,
    viewedSeason,
    viewedWorksheetNumber,
    isReadonlyWorksheet,
    isExoticWorksheet,
    isViewedWorksheetPrivate,
    viewedPerson,
  } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      isReadonlyWorksheet: state.worksheetMemo.getIsReadonlyWorksheet(state),
      isExoticWorksheet: state.worksheetMemo.getIsExoticWorksheet(state),
      isViewedWorksheetPrivate:
        state.worksheetMemo.getIsViewedWorksheetPrivate(state),
      viewedPerson: state.viewedPerson,
    })),
  );
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);

  const areHidden = useMemo(
    () => courses.length > 0 && courses.every((course) => course.hidden),
    [courses],
  );

  const HideShowIcon = areHidden ? BsEyeSlash : BsEye;
  const showControls = controlsMode !== 'none';
  const showHideButton = controlsMode !== 'none';
  const showSettings =
    (controlsMode === 'full' || controlsMode === 'map') &&
    !isExoticWorksheet &&
    viewedPerson === 'me';
  const showExport = controlsMode === 'full';

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [privateState, setPrivateState] = useState(isViewedWorksheetPrivate);
  const [updatingWSState, setUpdatingWSState] = useState(false);

  useEffect(() => {
    setPrivateState(isViewedWorksheetPrivate);
  }, [isViewedWorksheetPrivate]);
  return (
    <div>
      {showControls && (
        <SurfaceComponent elevated className={styles.container}>
          <div className="shadow-sm p-2">
            <ButtonGroup className="w-100">
              {showHideButton && !isReadonlyWorksheet && (
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
              {showSettings && (
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
              )}
              {showExport && (
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
              )}
            </ButtonGroup>
          </div>
        </SurfaceComponent>
      )}
      <SurfaceComponent className={styles.courseList}>
        {courses.length > 0 ? (
          <ListGroup variant="flush">
            {courses.map((course) => {
              const hasMissingCoordinate =
                showMissingLocationIcon &&
                course.listing.course.course_meetings.some((meeting) => {
                  const code = meeting.location?.building.code;
                  return Boolean(code && missingBuildingCodes?.has(code));
                });
              return (
                <WorksheetCalendarListItem
                  key={viewedSeason + course.crn}
                  listing={course.listing}
                  hidden={course.hidden ?? false}
                  locationSummary={toLocationsSummary(course.listing.course)}
                  showLocation={showLocation}
                  showMissingLocationIcon={showMissingLocationIcon}
                  isHighlighted={
                    Boolean(highlightBuilding) &&
                    course.listing.course.course_meetings.some(
                      (meeting) =>
                        meeting.location?.building.code === highlightBuilding,
                    )
                  }
                  missingCoordinate={hasMissingCoordinate}
                  hideTooltipContext={hideTooltipContext}
                />
              );
            })}
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
          <Form>
            {viewedWorksheetNumber === 0 ? (
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="tooltip-disabled">
                    Your main worksheet must always be public.
                  </Tooltip>
                }
              >
                <span style={{ display: 'inline-block' }}>
                  <Form.Check
                    type="switch"
                    id="private-worksheet-switch"
                    label="Private Worksheet"
                    checked={false}
                    disabled
                  />
                </span>
              </OverlayTrigger>
            ) : (
              <Form.Check
                type="switch"
                id="private-worksheet-switch"
                label="Private Worksheet"
                checked={privateState}
                onChange={() => setPrivateState(!privateState)}
              />
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              if (privateState !== isViewedWorksheetPrivate) {
                setUpdatingWSState(true);
                (async () => {
                  await updateWorksheetMetadata({
                    season: viewedSeason,
                    action: 'setPrivate',
                    worksheetNumber: viewedWorksheetNumber,
                    private: privateState,
                  });
                  await worksheetsRefresh();
                })()
                  .then(() => {
                    setUpdatingWSState(false);
                    setSettingsModalOpen(false);
                  })
                  .catch(() => {
                    setUpdatingWSState(false);
                  });
              }
            }}
            disabled={
              privateState === isViewedWorksheetPrivate || updatingWSState
            }
            style={{ minWidth: '4rem' }}
          >
            {updatingWSState ? (
              <div className="ms-auto">
                <Spinner size="sm" />
              </div>
            ) : (
              'Save'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default WorksheetCalendarList;
