import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { BsBookmark } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import clsx from 'clsx';

import { useUser } from '../../contexts/userContext';
import type { Crn, Season } from '../../utilities/common';
import { isInWorksheet } from '../../utilities/course';
import { toggleBookmark } from '../../utilities/api';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import styles from './WorksheetToggleButton.module.css';

/**
 * Toggle button to add course to or remove from worksheet
 * @prop crn - number | integer that holds the crn of the current course
 * @prop seasonCode - string | holds the current season code
 * @prop modal - boolean | are we rendering in the course modal
 * @prop setCourseInWorksheet - function | to set if current course is in user's worksheet for parent component
 */
function WorksheetToggleButton({
  crn,
  seasonCode,
  modal,
  setCourseInWorksheet,
}: {
  readonly crn: Crn;
  readonly seasonCode: Season;
  readonly modal: boolean;
  readonly setCourseInWorksheet?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // Fetch user context data and refresh function
  const { user, userRefresh } = useUser();

  const {
    curSeason,
    hiddenCourses,
    toggleCourse,
    worksheetNumber,
    worksheetOptions,
  } = useWorksheet();

  const [selectedWorksheet, setSelectedWorksheet] = useState(worksheetNumber);
  useEffect(() => {
    setSelectedWorksheet(worksheetNumber);
  }, [worksheetNumber]);

  const worksheetCheck = useMemo(
    () => isInWorksheet(seasonCode, crn, selectedWorksheet, user.worksheets),
    [user.worksheets, seasonCode, crn, selectedWorksheet],
  );
  // Is the current course in the worksheet?
  const [inWorksheet, setInWorksheet] = useState(false);

  // Fetch width of window
  const { isLgDesktop } = useWindowDimensions();

  // Reset inWorksheet state on every rerender
  useEffect(() => {
    if (inWorksheet !== worksheetCheck) {
      setInWorksheet(worksheetCheck);
      if (setCourseInWorksheet) setCourseInWorksheet(worksheetCheck);
    }
  }, [worksheetCheck, inWorksheet, setCourseInWorksheet]);

  // Handle button click
  const toggleWorkSheet = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Determine if we are adding or removing the course
      const addRemove = inWorksheet ? 'remove' : 'add';

      // Remove it from hidden courses before removing from worksheet
      if (inWorksheet && hiddenCourses[curSeason]?.[crn]) toggleCourse(crn);
      const success = await toggleBookmark({
        action: addRemove,
        season: seasonCode,
        crn,
        worksheetNumber: selectedWorksheet,
      });
      if (success) {
        await userRefresh();
        // If not in worksheet view, update inWorksheet state
        setInWorksheet(!inWorksheet);
      }
    },
    [
      crn,
      curSeason,
      hiddenCourses,
      inWorksheet,
      seasonCode,
      toggleCourse,
      userRefresh,
      selectedWorksheet,
    ],
  );

  // Disabled worksheet add/remove button if not logged in
  if (!user.worksheets) {
    return (
      <Button
        onClick={toggleWorkSheet}
        className={clsx('p-0', styles.disabledButton)}
      >
        <BsBookmark size={25} className={styles.disabledButtonIcon} />
      </Button>
    );
  }

  return (
    <OverlayTrigger
      placement="top"
      delay={modal ? { show: 300, hide: 0 } : undefined}
      overlay={(props) => (
        <Tooltip id="button-tooltip" {...props}>
          <small>
            {inWorksheet ? 'Remove from' : 'Add to'} my{' '}
            {worksheetOptions[worksheetNumber]!.label}
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
        {/* Show bookmark icon on modal and +/- everywhere else */}
        {modal ? (
          <>
            {inWorksheet ? (
              <FaMinus size={25} className={styles.scaleIcon} />
            ) : (
              <FaPlus size={25} className={styles.scaleIcon} />
            )}
            {/* Render the worksheet dropdown */}
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
          <>
            {inWorksheet ? (
              <FaMinus size={isLgDesktop ? 16 : 14} />
            ) : (
              <FaPlus size={isLgDesktop ? 16 : 14} />
            )}
          </>
        )}
      </Button>
    </OverlayTrigger>
  );
}

export default WorksheetToggleButton;
