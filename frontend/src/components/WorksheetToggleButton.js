import React, { useMemo, useState } from 'react';
import './WorksheetToggleButton.css';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../user';
import { toast } from 'react-toastify';
import { isInWorksheet } from '../utilities';

/**
 * Render worksheet list in default worksheet view
 * @prop worksheetView - boolean | are we in the worksheet view?
 * @prop crn - integer that holds the crn of the current course
 * @prop season_code - string that holds the current season code
 * @prop modal - boolean | are we rendering in the course modal
 * @prop hasSeason - function to switch to most recent course when removing the last course of a season
 */

const WorksheetToggleButton = ({
  worksheetView,
  crn,
  season_code,
  modal,
  hasSeason,
}) => {
  // Fetch user context data and refresh function
  const { user, userRefresh } = useUser();
  const worksheet_check = useMemo(() => {
    return isInWorksheet(season_code, crn.toString(), user.worksheet);
  }, [user.worksheet, season_code, crn]);
  // Is the current course in the worksheet?
  const [inWorksheet, setInWorksheet] = useState(worksheet_check);

  // Reset inWorksheet state on every rerender
  const update = isInWorksheet(season_code, crn.toString(), user.worksheet);
  if (inWorksheet !== update) setInWorksheet(update);
  // Disabled worksheed add/remove button if not logged in
  if (user.worksheet === null)
    return (
      <Button onClick={toggleWorkSheet} className="p-0 disabled-button">
        <BsBookmark size={25} className="disabled-button-icon" />
      </Button>
    );

  // Add/remove course
  function add_remove_course() {
    let add_remove;
    // Determine if we are adding or removing the course
    inWorksheet ? (add_remove = 'remove') : (add_remove = 'add');
    // User legacy api php to perform worksheet action
    axios
      .get(
        `/legacy_api/WorksheetActions.php?action=${add_remove}&season=${season_code}&ociId=${crn}`
      )
      .then((response) => {
        // console.log(response.data);
        // Refresh user's worksheet
        userRefresh().catch((err) => {
          toast.error('Failed to update worksheet');
          console.error(err);
        });
        // Check to see if user removed the last course of a season
        if (hasSeason && add_remove === 'remove') hasSeason(season_code, crn);
        // If not in worksheet view, update inWorksheet state
        if (!worksheetView) setInWorksheet(!inWorksheet);
      });
  }

  // Handle button click
  function toggleWorkSheet(e) {
    e.preventDefault();
    e.stopPropagation();
    add_remove_course();

    //Metric Tracking for Worksheet Toggle Button
    window.umami.trackEvent('Worksheet Toggled', 'worksheet');
  }

  // Render remove/add message on hover
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <small>
        {inWorksheet ? 'Remove from my worksheet' : 'Add to my worksheet'}
      </small>
    </Tooltip>
  );

  const bookmark_style = { transition: '0.3s' };
  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 1000, hide: 250 }}
      overlay={renderTooltip}
    >
      <Button
        variant="toggle"
        className={'p-0 bookmark_fill ' + (modal ? '' : 'bookmark_move')}
        onClick={toggleWorkSheet}
      >
        {inWorksheet ? (
          <BsBookmarkFill
            className={'bookmark_fill ' + (modal ? '' : 'bookmark_move')}
            color="#3396ff"
            size={25}
          />
        ) : (
          <BsBookmark color={'#3396ff'} size={25} style={bookmark_style} />
        )}
      </Button>
    </OverlayTrigger>
  );
};

// WorksheetToggleButton.whyDidYouRender = true;
export default React.memo(WorksheetToggleButton);
