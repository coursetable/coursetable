import React, { useMemo } from 'react';
import { OverlayTrigger, Tooltip, Fade } from 'react-bootstrap';

import { useUser } from '../user';
import { useWorksheetInfo } from '../queries/GetWorksheetListings';
import { isInWorksheet, checkConflict, unflattenTimes } from '../utilities';
import { MdErrorOutline } from 'react-icons/md';

/**
 * Displays icon when there is a course conflict with worksheet
 * @prop course - holds listing info
 */

const CourseConflictIcon = ({ course }) => {
  const { user } = useUser();

  const inWorksheet = useMemo(() => {
    return isInWorksheet(
      course.season_code,
      course.crn.toString(),
      user.worksheet
    );
  }, [course.season_code, course.crn, user.worksheet]);

  // Fetch listing info for each listing in user's worksheet
  const { data } = useWorksheetInfo(user.worksheet);

  // Get listing times
  const times = useMemo(() => unflattenTimes(course), [course]);

  // Update conflict status whenever the user's worksheet changes
  const conflict = useMemo(() => {
    // Return if worksheet hasn't been loaded or this listing has no times
    if (!data || !times) return false;
    // There is a conflict or this listing has an invalid time
    if (times === 'TBA' || checkConflict(data, course, times)) {
      return true;
    }
    // No conflict
    return false;
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

// CourseConflictIcon.whyDidYouRender = true;
export default React.memo(CourseConflictIcon);
