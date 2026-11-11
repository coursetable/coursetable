import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  Button,
  ButtonGroup,
  Collapse,
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
import { TbCalendarDown, TbCalendarUp } from 'react-icons/tb';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

import GoogleCalendarButton from './GoogleCalendarButton';
import ICSExportButton from './ICSExportButton';
import PNGExportButton from './PNGExportButton';
import URLExportButton from './URLExportButton';
import WorksheetCalendarListContext from './WorksheetCalendarListContext';
import WorksheetCalendarListItem from './WorksheetCalendarListItem';
import WorksheetStatusIcon from './WorksheetStatusIcon';
import {
  setCourseHidden,
  updateWorksheetCourses,
  updateWorksheetMetadata,
} from '../../queries/api';
import type { Crn, Season } from '../../queries/graphql-types';
import {
  useWorksheetNumberOptions,
  type WorksheetCourse,
} from '../../slices/WorksheetSlice';
import { useStore } from '../../store';
import NoCourses from '../Search/NoCourses';
import { SurfaceComponent } from '../Typography';
import styles from './WorksheetCalendarList.module.css';

type CourseImportAction = {
  season: Season;
  crn: Crn;
  worksheetNumber: number;
  action: 'add';
  color: string;
  hidden: boolean;
};

function buildCourseImports(
  currentCourses: readonly WorksheetCourse[],
  targetSeason: Season,
  targetWorksheetNumber: number,
  targetWorksheet: { courses: { crn: Crn }[] } | undefined,
): CourseImportAction[] {
  const actions: CourseImportAction[] = [];

  for (const course of currentCourses) {
    if (
      targetWorksheet &&
      targetWorksheet.courses.some((c) => c.crn === course.listing.crn)
    )
      continue;

    actions.push({
      season: targetSeason,
      crn: course.listing.crn,
      worksheetNumber: targetWorksheetNumber,
      action: 'add',
      color: course.color,
      hidden: course.hidden ?? false,
    });
  }

  return actions;
}

type WorksheetCalendarListProps = {
  readonly highlightBuilding: string | null;
  readonly showLocation: boolean;
  readonly showMissingLocationIcon: boolean;
  readonly controlsMode: 'full' | 'hide-only' | 'none' | 'map';
  readonly missingBuildingCodes: Set<string>;
  readonly hideTooltipContext: 'calendar' | 'map';
  readonly showWalkingTimes?: boolean;
  readonly onShowWalkingTimesChange?: (showWalkingTimes: boolean) => void;
};

function WorksheetCalendarList({
  highlightBuilding,
  showLocation,
  showMissingLocationIcon,
  controlsMode,
  missingBuildingCodes,
  hideTooltipContext,
  showWalkingTimes = true,
  onShowWalkingTimesChange,
}: WorksheetCalendarListProps) {
  const {
    courses,
    viewedSeason,
    viewedWorksheetNumber,
    isReadonlyWorksheet,
    isExoticWorksheet,
    exoticWorksheet,
    isViewedWorksheetPrivate,
    worksheetView,
    viewedPerson,
    worksheets,
    user,
  } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      isReadonlyWorksheet: state.worksheetMemo.getIsReadonlyWorksheet(state),
      isExoticWorksheet: state.worksheetMemo.getIsExoticWorksheet(state),
      exoticWorksheet: state.exoticWorksheet,
      isViewedWorksheetPrivate:
        state.worksheetMemo.getIsViewedWorksheetPrivate(state),
      worksheetView: state.worksheetView,
      viewedPerson: state.viewedPerson,
      worksheets: state.worksheets,
      user: state.user,
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
  const showWalkTimesSetting =
    worksheetView === 'calendar' && Boolean(onShowWalkingTimesChange);
  const showExport = controlsMode === 'full';
  const showImport = controlsMode === 'full' && isExoticWorksheet;

  const [showImportRow, setShowImportRow] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importTargetWorksheet, setImportTargetWorksheet] = useState(0);

  useEffect(() => {
    if (!isExoticWorksheet || !user) {
      setShowImportRow(false);
      setImportTargetWorksheet(0);
    }
  }, [isExoticWorksheet, user]);

  const importSeason = exoticWorksheet?.data.season ?? viewedSeason;
  const importWorksheetOptions = useWorksheetNumberOptions('me', importSeason);

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [privateState, setPrivateState] = useState(isViewedWorksheetPrivate);
  const [updatingWSState, setUpdatingWSState] = useState(false);

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
                    <Tooltip
                      id="worksheet-calendar-show-hide-tooltip"
                      {...props}
                    >
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
                    <Tooltip
                      id="worksheet-calendar-settings-tooltip"
                      {...props}
                    >
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
                    <Tooltip id="worksheet-calendar-export-tooltip" {...props}>
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
                    className={clsx(
                      styles.button,
                      styles.exportCalendarDropdown,
                      'w-100 btn',
                    )}
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

              {showImport && (
                <OverlayTrigger
                  placement="top"
                  overlay={(props) => (
                    <Tooltip id="worksheet-calendar-import-tooltip" {...props}>
                      <span>
                        {user
                          ? 'Import courses into your worksheet'
                          : 'Sign in to import courses into your worksheets'}
                      </span>
                    </Tooltip>
                  )}
                >
                  <Button
                    variant="none"
                    className={clsx(styles.button, 'px-3 w-100')}
                    aria-label="Import courses"
                    aria-expanded={showImportRow}
                    onClick={() => {
                      if (!user) {
                        toast.info('Sign in to import courses');
                        return;
                      }
                      setShowImportRow(!showImportRow);
                    }}
                  >
                    <TbCalendarUp
                      className={clsx(styles.icon, styles.calendarIcon)}
                      size={22}
                    />
                  </Button>
                </OverlayTrigger>
              )}
            </ButtonGroup>

            <Collapse in={showImportRow}>
              <div>
                <div className={styles.importRow}>
                  <div className={styles.importTopRow}>
                    <span className={styles.importLabel}>Import into:</span>
                    <DropdownButton
                      size="sm"
                      variant="outline-secondary"
                      className={styles.importDropdown}
                      title={
                        <>
                          {WorksheetStatusIcon(
                            importTargetWorksheet,
                            importWorksheetOptions[importTargetWorksheet]
                              ?.isPrivate,
                          )}
                          <span className={styles.importDropdownTitle}>
                            {importWorksheetOptions[importTargetWorksheet]
                              ?.label ?? 'Main Worksheet'}
                          </span>
                        </>
                      }
                      onSelect={(key) => {
                        if (key !== null) setImportTargetWorksheet(Number(key));
                      }}
                    >
                      {Object.values(importWorksheetOptions).map((opt) => (
                        <Dropdown.Item
                          key={opt.value}
                          eventKey={opt.value}
                          active={opt.value === importTargetWorksheet}
                          className={styles.importDropdownItem}
                        >
                          {WorksheetStatusIcon(opt.value, opt.isPrivate)}
                          {opt.label}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={isImporting}
                    onClick={async () => {
                      if (isImporting) return;
                      setIsImporting(true);

                      const targetWorksheet = worksheets
                        ?.get(importSeason)
                        ?.get(importTargetWorksheet);

                      if (courses.length === 0) {
                        toast.error(
                          'Current worksheet has no courses to import',
                        );
                        setIsImporting(false);
                        return;
                      }

                      const actions = buildCourseImports(
                        courses,
                        importSeason,
                        importTargetWorksheet,
                        targetWorksheet,
                      );

                      if (actions.length === 0) {
                        toast.success('All courses imported successfully');
                        setIsImporting(false);
                        setShowImportRow(false);
                        return;
                      }

                      try {
                        const success = await updateWorksheetCourses(actions);
                        if (success) {
                          await worksheetsRefresh();
                          toast.success(
                            `Imported ${actions.length} course${
                              actions.length === 1 ? '' : 's'
                            }`,
                          );
                          setShowImportRow(false);
                        }
                      } catch (error) {
                        toast.error(
                          'Failed to import courses. Please try again.',
                        );
                        console.error('Failed to import courses:', error);
                      } finally {
                        setIsImporting(false);
                      }
                    }}
                  >
                    {isImporting ? 'Importing...' : 'Confirm'}
                  </Button>
                </div>
              </div>
            </Collapse>
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
                  <Tooltip id="worksheet-settings-private-disabled-tooltip">
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
            {showWalkTimesSetting && (
              <Form.Check
                type="switch"
                id="show-walk-times-switch"
                className="mt-3"
                label={
                  <span className={styles.walkTimesLabel}>
                    Show walk times
                    <span className={styles.betaPill}>Beta</span>
                  </span>
                }
                checked={showWalkingTimes}
                onChange={(event) =>
                  onShowWalkingTimesChange?.(event.currentTarget.checked)
                }
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
    </div>
  );
}

export default WorksheetCalendarList;
