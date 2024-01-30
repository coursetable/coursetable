import React, { useMemo } from 'react';
import { OverlayTrigger, Tooltip, Fade } from 'react-bootstrap';

import { MdErrorOutline } from 'react-icons/md';
import { useUser } from '../../contexts/userContext';
import { useWorksheetInfo } from '../../contexts/ferryContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { Listing } from '../../utilities/common';
import {
  checkConflict,
  checkCrossListed,
  isInWorksheet,
} from '../../utilities/course';

/**
 * Displays icon when there is a course conflict with worksheet
 * @prop course - holds listing info
 */
function CourseConflictIcon({ course }: { readonly course: Listing }) {
  const { user } = useUser();
  const { worksheetNumber } = useWorksheet();

  // Fetch listing info for each listing in user's worksheet
  const { data } = useWorksheetInfo(
    user.worksheet,
    course.season_code,
    worksheetNumber,
  );

  // Update conflict status whenever the user's worksheet changes
  const conflicts = useMemo(() => {
    const inWorksheet = isInWorksheet(
      course.season_code,
      course.crn,
      worksheetNumber,
      user.worksheet,
    );
    // If the course is in the worksheet, we never report a conflict
    if (inWorksheet) return [];
    if (course.times_summary === 'TBA') return [];
    return checkConflict(data, course);
  }, [course, data, user.worksheet, worksheetNumber]);

  // Update conflict status whenever the user's worksheet changes
  const crossListed = useMemo(
    () => checkCrossListed(data, course),
    [course, data],
  );

  return (
    // Smooth fade in and out transition
    <Fade in={conflicts.length > 0}>
      <div>
        <OverlayTrigger
          placement="top"
          overlay={(props) => (
            <Tooltip {...props} id="conflict-icon-button-tooltip">
              <small style={{ fontWeight: 500 }}>
                Conflicts with: <br />
                {conflicts.map((x) => x.course_code).join(', ')} <br />
              </small>
              {crossListed !== false ? (
                // Show only if the class is cross-listed with another class
                // in the worksheet
                <small>(cross-listed with {crossListed})</small>
              ) : (
                ''
              )}
            </Tooltip>
          )}
        >
          <MdErrorOutline color="#fc4103" />
        </OverlayTrigger>
      </div>
    </Fade>
  );
}

export default CourseConflictIcon;
