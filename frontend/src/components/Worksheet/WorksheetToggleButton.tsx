import React, { useMemo, useState, useCallback } from 'react';
import clsx from 'clsx';
import { Button, Tooltip, OverlayTrigger, Fade } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';

import { useShallow } from 'zustand/react/shallow';
import { CUR_YEAR } from '../../config';
import { useWorksheetInfo } from '../../contexts/ferryContext';
import type { Option } from '../../contexts/searchContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { updateWorksheetCourses } from '../../queries/api';
import { useStore } from '../../store';
import { worksheetColors } from '../../utilities/constants';
import {
  isInWorksheet,
  checkConflict,
  type ListingWithTimes,
} from '../../utilities/course';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import styles from './WorksheetToggleButton.module.css';

function CourseConflictIcon({
  listing,
  inWorksheet,
  modal,
  worksheetNumber,
}: {
  readonly listing: ListingWithTimes;
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
  readonly listing: ListingWithTimes;
  readonly modal: boolean;
  readonly inWorksheet?: boolean;
}) {
  const { worksheets, worksheetsRefresh } = useStore(
    useShallow((state) => ({
      worksheets: state.worksheets,
      worksheetsRefresh: state.worksheetsRefresh,
    })),
  );

  const { myViewedWorksheetNumber, worksheetOptions } = useWorksheet();

  // In the modal, the select can override the "currently viewed" worksheet
  // Please read https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [selectedWorksheet, setSelectedWorksheet] = useState(
    myViewedWorksheetNumber,
  );
  const [prevWorksheetCtx, setPrevWorksheetCtx] = useState(
    myViewedWorksheetNumber,
  );
  if (prevWorksheetCtx !== myViewedWorksheetNumber) {
    setSelectedWorksheet(myViewedWorksheetNumber);
    setPrevWorksheetCtx(myViewedWorksheetNumber);
  }

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

      const success = await updateWorksheetCourses({
        action: inWorksheet ? 'remove' : 'add',
        season: listing.course.season_code,
        crn: listing.crn,
        worksheetNumber: selectedWorksheet,
        color:
          worksheetColors[Math.floor(Math.random() * worksheetColors.length)]!,
        hidden: false,
      });
      if (success) await worksheetsRefresh();
    },
    [
      inWorksheet,
      listing.crn,
      listing.course.season_code,
      selectedWorksheet,
      worksheetsRefresh,
    ],
  );

  const size = modal ? 20 : isLgDesktop ? 16 : 14;
  const Icon = inWorksheet ? FaMinus : FaPlus;
  const buttonLabel = worksheets
    ? `${inWorksheet ? 'Remove from' : 'Add to'} worksheet "${worksheetOptions[selectedWorksheet]!.label}"`
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
    </div>
  );
}

export default WorksheetToggleButton;
