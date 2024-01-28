import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { BsBookmark } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import * as Sentry from '@sentry/react';

import { useUser } from '../../contexts/userContext';
import type { Crn, Season } from '../../utilities/common';
import { isInWorksheet } from '../../utilities/course';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { API_ENDPOINT } from '../../config';
import { useWorksheet } from '../../contexts/worksheetContext';
import styles from './WorksheetToggleButton.module.css';

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.primary}!important;
  &:hover {
    opacity: 0.5;
  }
`;

const StyledSelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.select || '#f2f2f2'}!important;
  color: ${({ theme }) => theme.text[0] || '#333'}!important;
  font-size: 16px;
  font-weight: bold;
  border: none;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

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
  selectedWorksheet: initialSelectedWorksheet,
}: {
  readonly crn: Crn;
  readonly seasonCode: Season;
  readonly modal: boolean;
  readonly setCourseInWorksheet?: React.Dispatch<React.SetStateAction<boolean>>;
  readonly selectedWorksheet?: string;
}) {
  // Fetch user context data and refresh function
  const { user, userRefresh } = useUser();

  // Define options for the worksheet dropdown
  const worksheetOptions = ['0', '1', '2', '3'];

  const [selectedWorksheet, setSelectedWorksheet] = useState(
    initialSelectedWorksheet || '0',
  );
  useEffect(() => {
    setSelectedWorksheet(initialSelectedWorksheet || '0');
  }, [initialSelectedWorksheet]);

  const { curSeason, hiddenCourses, toggleCourse } = useWorksheet();

  const worksheetCheck = useMemo(
    () => isInWorksheet(seasonCode, crn, selectedWorksheet, user.worksheet),
    [user.worksheet, seasonCode, crn, selectedWorksheet],
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
      const body = JSON.stringify({
        action: addRemove,
        season: seasonCode,
        ociId: crn,
        worksheetNumber: parseInt(selectedWorksheet, 10),
      });

      // Call the endpoint
      try {
        const res = await fetch(`${API_ENDPOINT}/api/user/toggleBookmark`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          switch (data.error) {
            // These errors can be triggered if the user clicks the button twice
            // in a row
            // TODO: we should debounce the request instead
            case 'ALREADY_BOOKMARKED':
              toast.error(
                'You have already added this class to your worksheet',
              );
              break;
            case 'NOT_BOOKMARKED':
              toast.error(
                'You have already remove this class from your worksheet',
              );
              break;
            default:
              throw new Error(data.error ?? res.statusText);
          }
          return;
        }
        await userRefresh();
        // If not in worksheet view, update inWorksheet state
        setInWorksheet(!inWorksheet);
      } catch (err) {
        Sentry.addBreadcrumb({
          category: 'worksheet',
          message: `Updating worksheet: ${body}`,
          level: 'info',
        });
        Sentry.captureException(err);
        toast.error(`Failed to update worksheet. ${String(err)}`);
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
  if (!user.worksheet) {
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
      delay={{ show: 1000, hide: 0 }}
      overlay={(props) => (
        <Tooltip id="button-tooltip" {...props}>
          <small>
            {inWorksheet ? 'Remove from my worksheet' : 'Add to my worksheet'}
          </small>
        </Tooltip>
      )}
    >
      <StyledButton
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
              <FaMinus size={25} className={styles.scale_icon} />
            ) : (
              <FaPlus size={25} className={styles.scale_icon} />
            )}
            {/* Render the worksheet dropdown */}
            <StyledSelect
              value={selectedWorksheet}
              onChange={(event) => {
                setSelectedWorksheet(event.target.value);
              }}
              onClick={(e) => {
                // Check if the clicked target is the select element
                if ((e.target as HTMLSelectElement).tagName === 'SELECT')
                  e.stopPropagation();
              }}
              onMouseEnter={(e) => {
                e.preventDefault();
              }}
              className={styles.worksheetDropdown}
            >
              {worksheetOptions.map((option) => (
                <option key={option} value={option}>
                  {option === '0' ? 'Main Worksheet' : `Worksheet ${option}`}
                </option>
              ))}
            </StyledSelect>
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
      </StyledButton>
    </OverlayTrigger>
  );
}

export default WorksheetToggleButton;
