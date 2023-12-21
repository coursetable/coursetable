import React, { useMemo } from 'react';
import { OverlayTrigger, Tooltip, Fade } from 'react-bootstrap';

import { MdErrorOutline } from 'react-icons/md';
import { useUser } from '../../contexts/userContext';
import type { Listing } from '../../utilities/common';
import {
  checkConflict,
  checkCrossListed,
  isInWorksheet,
} from '../../utilities/course';
import { useWorksheetInfo } from '../../queries/GetWorksheetListings';

/**
 * Displays icon when there is a course conflict with worksheet
 * @prop course - holds listing info
 */
function CourseConflictIcon({ course }: { readonly course: Listing }) {
  const { user } = useUser();

  const inWorksheet = isInWorksheet(
    course.season_code,
    course.crn.toString(),
    '0',
    user.worksheet,
  );

  // Fetch listing info for each listing in user's worksheet
  const { data } = useWorksheetInfo(user.worksheet, course.season_code);

  // Update conflict status whenever the user's worksheet changes
  const conflicts = useMemo(() => {
    // Return if worksheet hasn't been loaded or this listing has no times
    if (!data) return [];
    if (course.times_summary === 'TBA') return [];
    return checkConflict(data, course);
  }, [course, data]);

  // Update conflict status whenever the user's worksheet changes
  const crossListed = useMemo(() => {
    // Return if worksheet hasn't been loaded, otherwise return the cross-listed
    // class
    if (!data) return false;
    return checkCrossListed(data, course);
  }, [course, data]);

  return (
    // Smooth fade in and out transition
    <Fade in={!inWorksheet && conflicts.length > 0}>
      <div>
        <OverlayTrigger
          placement="top"
          overlay={(props) =>
            // Render if this course isn't in the worksheet and there is a
            // conflict
            !inWorksheet && conflicts.length > 0 ? (
              <Tooltip {...props} id="conflict-icon-button-tooltip">
                <small style={{ fontWeight: 500 }}>
                  Conflicts with: <br />
                  {conflicts.map((x) => String(x.course_code)).join(', ')}{' '}
                  <br />
                </small>
                {crossListed !== false ? (
                  // Show only if the class is cross-listed with another class
                  // in the worksheet
                  <small>(cross-listed with {crossListed})</small>
                ) : (
                  ''
                )}
              </Tooltip>
            ) : (
              <div />
            )
          }
        >
          <MdErrorOutline color="#fc4103" />
        </OverlayTrigger>
      </div>
    </Fade>
  );
}

export default CourseConflictIcon;
