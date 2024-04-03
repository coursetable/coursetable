import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { Button, Tooltip, OverlayTrigger, Fade } from 'react-bootstrap';
import clsx from 'clsx';

import { useUser } from '../../contexts/userContext';
import { worksheetColors } from '../../utilities/constants';
import type { Listing } from '../../utilities/common';
import { isInWorksheet, checkConflict } from '../../utilities/course';
import { toggleBookmark } from '../../utilities/api';
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
    'me',
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
            <MdErrorOutline color="#fc4103" />
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

  const { courses, toggleCourse, worksheetNumber, worksheetOptions } =
    useWorksheet();

  // In the modal, the select can override the "currently viewed" worksheet
  const [selectedWorksheet, setSelectedWorksheet] = useState(worksheetNumber);
  useEffect(() => {
    setSelectedWorksheet(worksheetNumber);
  }, [worksheetNumber]);

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

      const isHidden =
        courses.filter((course) => course.crn === listing.crn && course.hidden)
          .length > 0;

      // Remove it from hidden courses before removing from worksheet
      if (inWorksheet && isHidden) toggleCourse(listing.crn);
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
      courses,
      listing.crn,
      listing.season_code,
      toggleCourse,
      selectedWorksheet,
      userRefresh,
    ],
  );

  const size = modal ? 20 : isLgDesktop ? 16 : 14;
  const Icon = inWorksheet ? FaMinus : FaPlus;

  // Disabled worksheet add/remove button if not logged in
  if (!user.worksheets) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-disabled">
            Log in to add to your worksheet
          </Tooltip>
        }
      >
        <Button
          className={clsx('p-0', styles.toggleButton, styles.disabledButton)}
          disabled
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
            <small>
              {inWorksheet ? 'Remove from' : 'Add to'} my{' '}
              {worksheetOptions[selectedWorksheet]!.label}
            </small>
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
        >
          {/* Only show the worksheet number select in modal */}
          {modal ? (
            <>
              <Icon size={size} className={styles.scaleIcon} />
              {/* TODO: use the custom select component */}
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
            </>
          ) : (
            <Icon size={size} />
          )}
        </Button>
      </OverlayTrigger>
    </div>
  );
}

export default WorksheetToggleButton;
