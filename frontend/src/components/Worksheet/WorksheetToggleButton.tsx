import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import clsx from 'clsx';
import { Button, Tooltip, OverlayTrigger, Fade, Modal } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { useApolloClient } from '@apollo/client';

import { useShallow } from 'zustand/react/shallow';
import { CUR_YEAR } from '../../config';
import { useWorksheetInfo } from '../../contexts/ferryContext';
import type { Option } from '../../contexts/searchContext';
import type { LatestCurrentOfferingQuery } from '../../generated/graphql-types';
import { updateWorksheetCourses } from '../../queries/api';
import { LatestCurrentOfferingDocument } from '../../queries/graphql-queries';
import type { Season } from '../../queries/graphql-types';
import { useWorksheetNumberOptions } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';
import { worksheetColors } from '../../utilities/constants';
import {
  isInWorksheet,
  checkConflict,
  toSeasonString,
  type ListingWithTimes,
} from '../../utilities/course';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import styles from './WorksheetToggleButton.module.css';

type ListingWithHistoricalInfo = ListingWithTimes & {
  course: ListingWithTimes['course'] & {
    same_course_id?: number;
  };
};

function CourseConflictIcon({
  listing,
  inWorksheet,
  modal,
  worksheetNumber,
}: {
  readonly listing: ListingWithHistoricalInfo;
  readonly inWorksheet: boolean;
  readonly modal: boolean;
  readonly worksheetNumber: number;
}) {
  const worksheets = useStore((state) => state.worksheets);

  const { data } = useWorksheetInfo(
    worksheets,
    listing.course.season_code,
    worksheetNumber,
  );

  const warning = useMemo(() => {
    // If the course is in the worksheet, we never report a conflict
    if (inWorksheet) return undefined;
    if (modal) {
      if (!CUR_YEAR.includes(listing.course.season_code))
        return 'This will add to a worksheet of a semester that has already ended.';
      return undefined;
    }
    const conflicts = checkConflict(data, listing);
    if (conflicts.length > 0)
      return `Conflicts with: ${conflicts.map((x) => x.course_code).join(', ')}`;
    return undefined;
  }, [inWorksheet, modal, listing, data]);

  return (
    <Fade in={Boolean(warning)}>
      <div className={styles.courseConflictIcon}>
        {warning && (
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip {...props} id="conflict-icon-button-tooltip">
                <small>{warning}</small>
              </Tooltip>
            )}
          >
            <span>
              <MdErrorOutline color="#fc4103" size={modal ? 16 : 13} />
            </span>
          </OverlayTrigger>
        )}
      </div>
    </Fade>
  );
}

function WorksheetToggleButton({
  listing,
  modal,
  inWorksheet: inWorksheetProp,
}: {
  readonly listing: ListingWithHistoricalInfo;
  readonly modal: boolean;
  readonly inWorksheet?: boolean;
}) {
  const { worksheets, worksheetsRefresh, getRelevantWorksheetNumber } =
    useStore(
      useShallow((state) => ({
        worksheets: state.worksheets,
        worksheetsRefresh: state.worksheetsRefresh,
        getRelevantWorksheetNumber: state.getRelevantWorksheetNumber,
      })),
    );
  const client = useApolloClient();
  const pendingLatestChoiceRef = useRef<((useLatest: boolean) => void) | null>(
    null,
  );
  const [latestOfferingPrompt, setLatestOfferingPrompt] = useState<{
    courseCode: string;
    seasonCode: Season;
  } | null>(null);

  const resolveLatestOfferingPrompt = useCallback((useLatest: boolean) => {
    pendingLatestChoiceRef.current?.(useLatest);
    pendingLatestChoiceRef.current = null;
    setLatestOfferingPrompt(null);
  }, []);

  const confirmAddLatestOffering = useCallback(
    (courseCode: string, seasonCode: Season): Promise<boolean> =>
      new Promise((resolve) => {
        pendingLatestChoiceRef.current = resolve;
        setLatestOfferingPrompt({ courseCode, seasonCode });
      }),
    [],
  );

  useEffect(
    () => () => {
      pendingLatestChoiceRef.current?.(false);
      pendingLatestChoiceRef.current = null;
    },
    [],
  );

  const defaultWorksheetNumber = getRelevantWorksheetNumber(
    listing.course.season_code,
  );

  // In the modal, the select can override the "currently viewed" worksheet
  // Please read https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [selectedWorksheet, setSelectedWorksheet] = useState(
    defaultWorksheetNumber,
  );
  const [prevWorksheetCtx, setPrevWorksheetCtx] = useState(
    defaultWorksheetNumber,
  );
  if (prevWorksheetCtx !== defaultWorksheetNumber) {
    setSelectedWorksheet(defaultWorksheetNumber);
    setPrevWorksheetCtx(defaultWorksheetNumber);
  }

  const worksheetOptions = useWorksheetNumberOptions(
    'me',
    listing.course.season_code,
  );

  const inWorksheet = useMemo(
    () =>
      inWorksheetProp ?? isInWorksheet(listing, selectedWorksheet, worksheets),
    [inWorksheetProp, listing, selectedWorksheet, worksheets],
  );

  const isLgDesktop = useStore((state) => state.isLgDesktop);

  const toggleWorkSheet = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      let targetSeason = listing.course.season_code;
      let targetCrn = listing.crn;
      let targetWorksheetNumber = selectedWorksheet;

      const shouldCheckLatest =
        !inWorksheet && !CUR_YEAR.includes(listing.course.season_code);

      if (shouldCheckLatest && listing.course.same_course_id !== undefined) {
        try {
          const { data } = await client.query<LatestCurrentOfferingQuery>({
            query: LatestCurrentOfferingDocument,
            variables: {
              sameCourseId: listing.course.same_course_id,
              seasonCodes: CUR_YEAR,
            },
          });
          const [latestCourse] = data.courses;
          const [latestListing] = latestCourse?.listings ?? [];
          if (latestCourse && latestListing) {
            const hasLatestOffering =
              latestCourse.season_code !== listing.course.season_code ||
              latestListing.crn !== listing.crn;

            if (hasLatestOffering) {
              const addLatest = await confirmAddLatestOffering(
                latestListing.course_code,
                latestCourse.season_code,
              );

              if (addLatest) {
                targetSeason = latestCourse.season_code;
                targetCrn = latestListing.crn;
                targetWorksheetNumber = getRelevantWorksheetNumber(
                  latestCourse.season_code,
                );
              }
            }
          }
        } catch {
          // If lookup fails, fall back to adding the selected listing
        }
      }

      const success = await updateWorksheetCourses({
        action: inWorksheet ? 'remove' : 'add',
        season: targetSeason,
        crn: targetCrn,
        worksheetNumber: targetWorksheetNumber,
        color:
          worksheetColors[Math.floor(Math.random() * worksheetColors.length)]!,
        hidden: false,
      });
      if (success) await worksheetsRefresh();
    },
    [
      inWorksheet,
      client,
      confirmAddLatestOffering,
      getRelevantWorksheetNumber,
      listing.crn,
      listing.course.season_code,
      listing.course.same_course_id,
      selectedWorksheet,
      worksheetsRefresh,
    ],
  );

  const size = modal ? 20 : isLgDesktop ? 16 : 14;
  const Icon = inWorksheet ? FaMinus : FaPlus;
  const buttonLabel = worksheets
    ? // The worksheet name can only be unknown if we triggered the
      // if (prevWorksheetCtx !== defaultWorksheetNumber) code path above
      // We will update it once and then it will be correct
      `${inWorksheet ? 'Remove from' : 'Add to'} worksheet "${worksheetOptions[selectedWorksheet]?.label ?? 'Unknown'}"`
    : 'Log in to add to your worksheet';

  // Disabled worksheet add/remove button if not logged in
  if (!worksheets) {
    return (
      <div className={styles.container}>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-disabled">{buttonLabel}</Tooltip>}
        >
          <Button
            className={clsx('p-0', styles.toggleButton, styles.disabledButton)}
            disabled
            aria-label={buttonLabel}
          >
            <FaPlus size={size} className={styles.disabledButtonIcon} />
          </Button>
        </OverlayTrigger>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* This div "anchors" the conflict icon to the plus icon instead of the
        whole container */}
      <div className={styles.toggleContainer}>
        <CourseConflictIcon
          listing={listing}
          inWorksheet={inWorksheet}
          modal={modal}
          worksheetNumber={selectedWorksheet}
        />
        <OverlayTrigger
          placement="top"
          delay={modal ? { show: 300, hide: 0 } : undefined}
          overlay={(props) => (
            <Tooltip id="button-tooltip" {...props}>
              <small>{buttonLabel}</small>
            </Tooltip>
          )}
        >
          <Button
            variant="toggle"
            className={clsx(
              'py-auto px-1 d-flex align-items-center',
              styles.toggleButton,
            )}
            onClick={toggleWorkSheet}
            aria-label={buttonLabel}
          >
            <Icon size={size} className={clsx(modal && styles.scaleIcon)} />
          </Button>
        </OverlayTrigger>
      </div>
      {modal && (
        <Popout
          buttonText="Worksheet"
          selectedOptions={worksheetOptions[selectedWorksheet]}
          clearIcon={false}
          displayOptionLabel
          className={styles.worksheetDropdown}
        >
          <PopoutSelect<Option<number>, false>
            value={worksheetOptions[selectedWorksheet]}
            options={Object.values(worksheetOptions)}
            onChange={(option) => setSelectedWorksheet(option!.value)}
            showControl={false}
            minWidth={200}
          />
        </Popout>
      )}
      <Modal
        show={latestOfferingPrompt !== null}
        onHide={() => resolveLatestOfferingPrompt(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add latest offering?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {latestOfferingPrompt && (
            <>
              This course is from a past semester. Add the latest offering (
              {latestOfferingPrompt.courseCode},{' '}
              {toSeasonString(latestOfferingPrompt.seasonCode)}) instead?
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => resolveLatestOfferingPrompt(false)}
          >
            Add historical
          </Button>
          <Button onClick={() => resolveLatestOfferingPrompt(true)}>
            Add latest
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default WorksheetToggleButton;
