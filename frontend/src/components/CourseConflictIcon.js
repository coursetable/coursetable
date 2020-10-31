import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip, Fade } from 'react-bootstrap';

import { useUser } from '../user';
import { FetchWorksheet } from '../queries/GetWorksheetListings';
import { isInWorksheet, checkConflict, unflattenTimes } from '../utilities';
import { MdErrorOutline } from 'react-icons/md';

/**
 * Displays icon when there is a course conflict with worksheet
 * @prop course - holds listing info
 */

const CourseConflictIcon = ({ course }) => {
  const { user } = useUser();
  // Is the course already in the user's worksheet
  const [inWorksheet, setInWorksheet] = useState(
    isInWorksheet(course.season_code, course.crn.toString(), user.worksheet)
  );
  if (course.crn === 22131) {
    console.log('here', course.crn);
  }

  // Fetch listing info for each listing in user's worksheet
  if (user.worksheet) {
    var { data } = FetchWorksheet(user.worksheet);
  }

  // This updates on rerender
  const update = isInWorksheet(
    course.season_code,
    course.crn.toString(),
    user.worksheet
  );
  // Update inWorksheet state if something has changed
  if (inWorksheet !== update) setInWorksheet(update);

  // Is there a conflict?
  const [conflict, setConflict] = useState(false);
  // Get listing times
  const times = unflattenTimes(course);

  // Update conflict status whenever the user's worksheet changes
  useEffect(() => {
    // Return if worksheet hasn't been loaded or this listing has no times
    if (!data || !times) return;
    // There is a conflict or this listing has an invalid time
    if (times === 'TBA' || checkConflict(data, course, times)) {
      setConflict(true);
      return;
    }
    // No conflict
    setConflict(false);
  }, [course, data, times]);

  // Renders the conflict tooltip on hover
  const renderTooltip = (props) =>
    // Render if this course isn't in the worksheet and there is a conflict
    !inWorksheet && conflict ? (
      <Tooltip id="button-tooltip" {...props}>
        <small style={{ fontWeight: 500 }}>
          {times === 'TBA' ? 'Invalid Course Time' : 'Conflicts with worksheet'}
        </small>
      </Tooltip>
    ) : (
      <div />
    );

  return (
    // Smooth fade in and out transition
    <Fade in={!inWorksheet && conflict}>
      <div>
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 250 }}
          overlay={renderTooltip}
        >
          <MdErrorOutline color="#fc4103" />
        </OverlayTrigger>
      </div>
    </Fade>
  );
};

export default CourseConflictIcon;
