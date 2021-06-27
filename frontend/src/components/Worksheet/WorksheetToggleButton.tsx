import React, { useMemo, useState, useEffect } from 'react';
import './WorksheetToggleButton.css';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import posthog from 'posthog-js';
import styled from 'styled-components';
import { useUser } from '../../user';
import { setLSObject } from '../../browserStorage';
import { isInWorksheet } from '../../utilities/courseUtilities';
import { useWindowDimensions } from '../Providers/WindowDimensionsProvider';
import * as Sentry from '@sentry/react';

import { API_ENDPOINT } from '../../config';
import { useWorksheet } from '../../worksheetContext';

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.primary}!important;
  &:hover {
    opacity: 0.5;
  }
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
  season_code,
  modal,
  setCourseInWorksheet,
}: {
  crn: number;
  season_code: string;
  modal: boolean;
  setCourseInWorksheet?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // Fetch user context data and refresh function
  const { user, userRefresh } = useUser();

  const { cur_season, hidden_courses, toggleCourse } = useWorksheet();

  const worksheet_check = useMemo(() => {
    return isInWorksheet(season_code, crn.toString(), user.worksheet);
  }, [user.worksheet, season_code, crn]);
  // Is the current course in the worksheet?
  const [inWorksheet, setInWorksheet] = useState(false);

  // Fetch width of window
  const { isLgDesktop } = useWindowDimensions();

  // Reset inWorksheet state on every rerender
  useEffect(() => {
    if (inWorksheet !== worksheet_check) {
      setInWorksheet(worksheet_check);
      if (setCourseInWorksheet) setCourseInWorksheet(worksheet_check);
    }
  }, [worksheet_check, inWorksheet, setCourseInWorksheet]);

  // Disabled worksheet add/remove button if not logged in
  if (user.worksheet == null)
    return (
      <Button onClick={toggleWorkSheet} className="p-0 disabled-button">
        <BsBookmark size={25} className="disabled-button-icon" />
      </Button>
    );

  // Add/remove course
  function add_remove_course() {
    posthog.capture('worksheet-add-remove', { season_code, crn });

    // Determine if we are adding or removing the course
    const add_remove = inWorksheet ? 'remove' : 'add';

    // removes removed courses from worksheet hidden courses
    if (inWorksheet) {
      setLSObject('hidden_courses', {}, true);
      if (
        Object.prototype.hasOwnProperty.call(hidden_courses, cur_season) &&
        hidden_courses[cur_season][crn]
      ) {
        toggleCourse(crn);
      }
    }

    // Call the endpoint
    return axios
      .post(
        `${API_ENDPOINT}/api/user/toggleBookmark`,
        { action: add_remove, season: season_code, ociId: crn },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        // Refresh user's worksheet
        return userRefresh();
      })
      .then(() => {
        // If not in worksheet view, update inWorksheet state
        setInWorksheet(!inWorksheet);
      })
      .catch((err) => {
        toast.error('Failed to update worksheet');
        Sentry.captureException(err);
      });
  }

  // Handle button click
  function toggleWorkSheet(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    add_remove_course();
  }

  // Render remove/add message on hover
  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      <small>
        {inWorksheet ? 'Remove from my worksheet' : 'Add to my worksheet'}
      </small>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 1000, hide: 0 }}
      overlay={renderTooltip}
    >
      <StyledButton
        variant="toggle"
        className="py-auto px-1 d-flex align-items-center"
        onClick={toggleWorkSheet}
      >
        {/* Show bookmark icon on modal and +/- everywhere else */}
        {modal ? (
          inWorksheet ? (
            <BsBookmarkFill size={25} className="scale_icon" />
          ) : (
            <BsBookmark size={25} className="scale_icon" />
          )
        ) : inWorksheet ? (
          <FaMinus size={isLgDesktop ? 16 : 14} />
        ) : (
          <FaPlus size={isLgDesktop ? 16 : 14} />
        )}
      </StyledButton>
    </OverlayTrigger>
  );
}

// WorksheetToggleButton.whyDidYouRender = true;
export default React.memo(WorksheetToggleButton);
