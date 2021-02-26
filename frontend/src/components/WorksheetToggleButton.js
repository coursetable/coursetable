import React, { useMemo, useState } from 'react';
import './WorksheetToggleButton.css';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import posthog from 'posthog-js';
import styled from 'styled-components';
import { useUser } from '../user';
import { getSSObject, setSSObject } from '../browserStorage';
import { isInWorksheet } from '../courseUtilities';
import { useWindowDimensions } from './WindowDimensionsProvider';

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.primary}!important;
  &:hover {
    opacity: 0.5;
  }
`;

/**
 * Toggle button to add course to or remove from worksheet
 * @prop worksheetView - boolean | are we in the worksheet view?
 * @prop crn - number | integer that holds the crn of the current course
 * @prop season_code - string | holds the current season code
 * @prop modal - boolean | are we rendering in the course modal
 */
function WorksheetToggleButton({ worksheetView, crn, season_code, modal }) {
  // Fetch user context data and refresh function
  const { user, userRefresh } = useUser();
  const worksheet_check = useMemo(() => {
    return isInWorksheet(season_code, crn.toString(), user.worksheet);
  }, [user.worksheet, season_code, crn]);
  // Is the current course in the worksheet?
  const [inWorksheet, setInWorksheet] = useState(worksheet_check);

  // Fetch width of window
  const { width } = useWindowDimensions();

  // Reset inWorksheet state on every rerender
  const update = isInWorksheet(season_code, crn.toString(), user.worksheet);
  if (inWorksheet !== update) setInWorksheet(update);
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
      setSSObject('hidden_courses', {}, true);
      const hidden_courses = getSSObject('hidden_courses');
      if (hidden_courses[crn]) {
        hidden_courses[crn] = false;
        setSSObject('hidden_courses', hidden_courses);
      }
    }

    // User legacy api php to perform worksheet action
    return axios
      .get(
        `/legacy_api/WorksheetActions.php?action=${add_remove}&season=${season_code}&ociId=${crn}`
      )
      .then((response) => {
        // console.log(response.data);
        // Refresh user's worksheet
        return userRefresh();
      })
      .then(() => {
        // If not in worksheet view, update inWorksheet state
        setInWorksheet(!inWorksheet);
      })
      .catch((err) => {
        toast.error('Failed to update worksheet');
        console.error(err);
      });
  }

  // Handle button click
  function toggleWorkSheet(e) {
    e.preventDefault();
    e.stopPropagation();
    add_remove_course();
  }

  // Render remove/add message on hover
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <small>
        {inWorksheet ? 'Remove from my worksheet' : 'Add to my worksheet'}
      </small>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 50 }}
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
          <FaMinus size={width > 1320 ? 16 : 14} />
        ) : (
          <FaPlus size={width > 1320 ? 16 : 14} />
        )}
      </StyledButton>
    </OverlayTrigger>
  );
}

// WorksheetToggleButton.whyDidYouRender = true;
export default React.memo(WorksheetToggleButton);
