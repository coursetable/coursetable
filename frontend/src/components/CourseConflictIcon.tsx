import React, { useMemo } from 'react';
import { OverlayTrigger, Tooltip, Fade } from 'react-bootstrap';

import { useUser } from '../user';
import { MdErrorOutline } from 'react-icons/md';
import {
  checkConflict,
  isInWorksheet,
  unflattenTimes,
} from '../courseUtilities';
import { useWorksheetInfo } from '../queries/GetWorksheetListings';
import { Listing } from './FerryProvider';

/**
 * Displays icon when there is a course conflict with worksheet
 * @prop course - holds listing info
 */
const CourseConflictIcon = ({ course }: { course: Listing }) => {
  const { user } = useUser();

  const inWorksheet = useMemo(() => {
    return isInWorksheet(
      course.season_code,
      course.crn.toString(),
      user.worksheet
    );
  }, [course.season_code, course.crn, user.worksheet]);

  // Fetch listing info for each listing in user's worksheet
  const { data } = useWorksheetInfo(user.worksheet, course.season_code);

  // Get listing times
  const times = useMemo(() => unflattenTimes(course), [course]);

  // Update conflict status whenever the user's worksheet changes
  const conflict = useMemo(() => {
    // Return if worksheet hasn't been loaded or this listing has no times
    if (!data || !times) return false;
    if (times === 'TBA') {
      // Ignore any items with an invalid time.
      return false;
    } else if (checkConflict(data, course, times)) {
      // There is a conflict with this listing.
      return true;
    }
    // No conflict
    return false;
  }, [course, data, times]);

  // Renders the conflict tooltip on hover
  const renderTooltip = (
    // We manually add the "id" attribute, so we omit it here.
    props: Omit<React.ComponentPropsWithRef<typeof Tooltip>, 'id'>
  ) =>
    // Render if this course isn't in the worksheet and there is a conflict
    !inWorksheet && conflict ? (
      <Tooltip {...props} id="conflict-icon-button-tooltip">
        <small style={{ fontWeight: 500 }}>Conflicts with worksheet</small>
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
