import React, { useMemo, useState, useCallback } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { Button, Tooltip, OverlayTrigger, Fade } from 'react-bootstrap';
import clsx from 'clsx';

import { useUser } from '../../contexts/userContext';
import { worksheetColors } from '../../utilities/constants';
import type { Listing } from '../../utilities/common';
import { isInWorksheet, checkConflict } from '../../utilities/course';
import { toggleBookmark, toggleCourseHidden } from '../../utilities/api';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { useWorksheetInfo } from '../../contexts/ferryContext';
import styles from './WorksheetToggleButton.module.css';
import { CUR_YEAR } from '../../config';

function CourseConflictIcon({
  listing,
  inWorksheet,
  modal,
  worksheetNumber,
}: {
  readonly listing: Listing;
  readonly inWorksheet: boolean;
  readonly modal: boolean;
  readonly worksheetNumber: number;
}) {
  const { user } = useUser();

  const { data } = useWorksheetInfo(
    user.worksheets,
    listing.season_code,
    worksheetNumber,
  );

  const warning = useMemo(() => {
    // If the course is in the worksheet, we never report a conflict
    if (inWorksheet) return undefined;
    if (modal) {
      if (!CUR_YEAR.includes(listing.season_code))
        return 'This will add to a worksheet of a semester that has already ended.';
      return undefined;
    }
    if (listing.times_summary === 'TBA') return undefined;
    const conflicts = checkConflict(data, listing);
    if (conflicts.length > 0)
      return `Conflicts with: ${conflicts.map((x) => x.course_code).join(', ')}`;
    return undefined;
  }, [inWorksheet, modal, listing, data]);

  return (
    <Fade in={Boolean(warning)}>
      <div
        className={
          modal ? styles.courseConflictIconModal : styles.courseConflictIcon
        }
      >
        {warning && (
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip {...props} id="conflict-icon-button-tooltip">
                <small style={{ fontWeight: 500 }}>{warning}</small>
              </Tooltip>
            )}
          >
            <span>
              <MdErrorOutline color="#fc4103" />
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
  readonly listing: Listing;
  readonly modal: boolean;
  readonly inWorksheet?: boolean;
}) {
  const { user, userRefresh } = useUser();

  const { worksheetNumber, worksheetOptions } = useWorksheet();

  // In the modal, the select can override the "currently viewed" worksheet
  // Please read https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [selectedWorksheet, setSelectedWorksheet] = useState(worksheetNumber);
  const [prevWorksheetCtx, setPrevWorksheetCtx] = useState(worksheetNumber);
  if (prevWorksheetCtx !== worksheetNumber) {
    setSelectedWorksheet(worksheetNumber);
    setPrevWorksheetCtx(worksheetNumber);
  }

  const inWorksheet = useMemo(
    () =>
      inWorksheetProp ??
      isInWorksheet(
        listing.season_code,
        listing.crn,
        selectedWorksheet,
        user.worksheets,
      ),
    [
      inWorksheetProp,
      listing.season_code,
      listing.crn,
      selectedWorksheet,
      user.worksheets,
    ],
  );

  const { isLgDesktop } = useWindowDimensions();

  const toggleWorkSheet = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Determine if we are adding or removing the course
      const addRemove = inWorksheet ? 'remove' : 'add';

      // Remove it from hidden courses before removing from worksheet
      if (inWorksheet) {
        toggleCourseHidden({
          season: listing.season_code,
          crn: listing.crn,
          hidden: false,
        });
      }
      const success = await toggleBookmark({
        action: addRemove,
        season: listing.season_code,
        crn: listing.crn,
        worksheetNumber: selectedWorksheet,
        color:
          worksheetColors[Math.floor(Math.random() * worksheetColors.length)]!,
      });
      if (success) await userRefresh();
    },
    [
      inWorksheet,
      listing.crn,
      listing.season_code,
      selectedWorksheet,
      userRefresh,
    ],
  );

  const size = modal ? 20 : isLgDesktop ? 16 : 14;
  const Icon = inWorksheet ? FaMinus : FaPlus;
  const buttonLabel = user.worksheets
    ? `${inWorksheet ? 'Remove from' : 'Add to'} my ${worksheetOptions[selectedWorksheet]!.label}`
    : 'Log in to add to your worksheet';

  // Disabled worksheet add/remove button if not logged in
  if (!user.worksheets) {
    return (
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
    );
  }

  return (
    <div className={styles.container}>
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
      {/* TODO: use the custom select component */}
      {modal && (
        <select
          value={selectedWorksheet}
          onChange={(event) => {
            setSelectedWorksheet(Number(event.target.value));
          }}
          onClick={(e) => {
            // Check if the clicked target is the select element
            if ((e.target as HTMLSelectElement).tagName === 'SELECT')
              e.stopPropagation();
          }}
          // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
          onMouseEnter={(e) => {
            e.preventDefault();
          }}
          className={styles.worksheetDropdown}
        >
          {worksheetOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default WorksheetToggleButton;
