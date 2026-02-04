import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Form,
  ListGroup,
  Modal,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from 'react-bootstrap';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { CiSettings } from 'react-icons/ci';
import { MdAutoAwesome } from 'react-icons/md';
import { TbCalendarDown } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import GoogleCalendarButton from './GoogleCalendarButton';
import ICSExportButton from './ICSExportButton';
import PNGExportButton from './PNGExportButton';
import ScheduleSuggestionsModal from './ScheduleSuggestionsModal';
import URLExportButton from './URLExportButton';
import WorksheetCalendarListContext from './WorksheetCalendarListContext';
import WorksheetCalendarListItem from './WorksheetCalendarListItem';
import {
  setCourseHidden,
  updateWorksheetCourses,
  updateWorksheetMetadata,
} from '../../queries/api';
import { useStore } from '../../store';
import NoCourses from '../Search/NoCourses';
import { SurfaceComponent } from '../Typography';
import styles from './WorksheetCalendarList.module.css';

type WorksheetCalendarListProps = {
  readonly highlightBuilding: string | null;
  readonly showLocation: boolean;
  readonly showMissingLocationIcon: boolean;
  readonly controlsMode: 'full' | 'hide-only' | 'none' | 'map';
  readonly missingBuildingCodes: Set<string>;
  readonly hideTooltipContext: 'calendar' | 'map';
};

function WorksheetCalendarList({
  highlightBuilding,
  showLocation,
  showMissingLocationIcon,
  controlsMode,
  missingBuildingCodes,
  hideTooltipContext,
}: WorksheetCalendarListProps) {
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
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    setPrivateState(isViewedWorksheetPrivate);
  }, [isViewedWorksheetPrivate]);

  const contextValue = useMemo(
    () => ({
      showLocation,
      showMissingLocationIcon,
      highlightBuilding,
      missingBuildingCodes,
      hideTooltipContext,
    }),
    [
      showLocation,
      showMissingLocationIcon,
      highlightBuilding,
      missingBuildingCodes,
      hideTooltipContext,
    ],
  );

  const handleClearAll = async () => {
    if (courses.length === 0) return;
    const courseCount = courses.length;

    const actions = courses.map((course) => ({
      action: 'remove' as const,
      season: viewedSeason,
      crn: course.listing.crn,
      worksheetNumber: viewedWorksheetNumber,
    }));

    setClearing(true);
    try {
      await updateWorksheetCourses(actions);
      await worksheetsRefresh();
      setClearModalOpen(false);

      toast.success(
        courseCount === 1
          ? 'Removed class from worksheet'
          : `Removed all ${courseCount} classes from worksheet`,
      );
    } finally {
      setClearing(false);
    }
  };

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
                      <span>Suggest schedules</span>
                    </Tooltip>
                  )}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setScheduleModalOpen(true);
                    }}
                    variant="none"
                    className={clsx(styles.button, 'px-3 w-100')}
                    aria-label="Suggest schedules"
                  >
                    <MdAutoAwesome className={clsx(styles.icon)} size={22} />
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
                      <PNGExportButton />
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="4" as="div">
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
        <WorksheetCalendarListContext.Provider value={contextValue}>
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
        </WorksheetCalendarListContext.Provider>
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

            {courses.length > 0 && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setClearModalOpen(true)}
                  disabled={clearing}
                  className={styles.clearAllButton}
                >
                  <strong>Clear All Classes</strong>
                  <p className="text-muted small mb-0">
                    {courses.length === 1
                      ? 'Remove this class from this worksheet'
                      : `Remove all ${courses.length} classes from this worksheet`}
                  </p>
                </button>
              </div>
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

      <Modal
        show={clearModalOpen}
        onHide={() => !clearing && setClearModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Clear All Classes</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Are you sure you want to{' '}
            {courses.length === 1 ? (
              <>remove this class</>
            ) : (
              <>
                remove all <strong>{courses.length} classes</strong>
              </>
            )}{' '}
            from this worksheet?
          </p>
          <p className="text-muted small mb-0">This action cannot be undone.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setClearModalOpen(false)}
            disabled={clearing}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleClearAll}
            disabled={clearing}
            style={{ minWidth: '4rem' }}
          >
            {clearing ? (
              <div className="ms-auto">
                <Spinner size="sm" />
              </div>
            ) : (
              'Clear All'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <ScheduleSuggestionsModal
        show={scheduleModalOpen}
        onHide={() => setScheduleModalOpen(false)}
      />
    </div>
  );
}

export default WorksheetCalendarList;
