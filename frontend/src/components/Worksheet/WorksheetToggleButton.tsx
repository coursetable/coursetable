import React, { useMemo, useState, useEffect, useCallback } from 'react';
import './WorksheetToggleButton.css';
import { BsBookmark } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useUser } from '../../contexts/userContext';
import { setLSObject } from '../../browserStorage';
import { isInWorksheet } from '../../utilities/courseUtilities';
import { useWindowDimensions } from '../Providers/WindowDimensionsProvider';
import * as Sentry from '@sentry/react';

import { API_ENDPOINT } from '../../config';
import { useWorksheet } from '../../contexts/worksheetContext';

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
 * @prop season_code - string | holds the current season code
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
  crn: number;
  seasonCode: string;
  modal: boolean;
  setCourseInWorksheet?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedWorksheet?: string;
}) {
  // Fetch user context data and refresh function
  const { user, userRefresh } = useUser();

  // Define options for the worksheet dropdown
  const worksheetOptions = ['0', '1', '2', '3'];

  const [selectedWorksheet, setSelectedWorksheet] = useState(
    initialSelectedWorksheet || '0',
  );

  const { curSeason, hiddenCourses, toggleCourse } = useWorksheet();

  const worksheetCheck = useMemo(
    () =>
      isInWorksheet(
        seasonCode,
        crn.toString(),
        selectedWorksheet,
        user.worksheet,
      ),
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
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Determine if we are adding or removing the course
      const addRemove = inWorksheet ? 'remove' : 'add';
      //console.log(add_remove, inWorksheet);

      // removes removed courses from worksheet hidden courses
      if (inWorksheet) {
        setLSObject('hiddenCourses', {}, true);
        if (
          Object.prototype.hasOwnProperty.call(hiddenCourses, curSeason) &&
          hiddenCourses[curSeason][crn]
        ) {
          toggleCourse(crn);
        }
      }

      // Call the endpoint
      return axios
        .post(
          `${API_ENDPOINT}/api/user/toggleBookmark`,
          {
            action: addRemove,
            season: seasonCode,
            ociId: crn,
            worksheet_number: parseInt(selectedWorksheet),
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(() => userRefresh())
        .then(() => {
          // If not in worksheet view, update inWorksheet state
          setInWorksheet(!inWorksheet);
        })
        .catch((err) => {
          toast.error('Failed to update worksheet');
          Sentry.captureException(err);
        });
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
  if (user.worksheet == null)
    return (
      <Button onClick={toggleWorkSheet} className="p-0 disabled-button">
        <BsBookmark size={25} className="disabled-button-icon" />
      </Button>
    );

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
        className="py-auto px-1 d-flex align-items-center"
        onClick={toggleWorkSheet}
      >
        {/* Show bookmark icon on modal and +/- everywhere else */}
        {modal ? (
          <>
            {inWorksheet ? (
              <FaMinus size={25} className="scale_icon" />
            ) : (
              <FaPlus size={25} className="scale_icon" />
            )}
            {/* Render the worksheet dropdown */}
            <StyledSelect
              value={selectedWorksheet}
              onChange={(event) => {
                setSelectedWorksheet(event.target.value);
              }}
              onClick={(e) => {
                // Check if the clicked target is the select element
                if ((e.target as HTMLSelectElement).tagName === 'SELECT') {
                  e.stopPropagation();
                }
              }}
              onMouseEnter={(e) => {
                e.preventDefault();
              }}
              className="worksheet-dropdown"
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

// WorksheetToggleButton.whyDidYouRender = true;
export default React.memo(WorksheetToggleButton);
