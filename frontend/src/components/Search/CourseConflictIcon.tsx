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
import { CUR_SEASON, CUR_YEAR } from '../../config';

interface CourseConflictIconProps {
  course: Listing;
  inModal?: boolean;
}

/**
 * Displays icon when there is a course conflict with worksheet
 * @prop course - holds listing info
 */
function CourseConflictIcon({
  course,
  inModal = false,
}: CourseConflictIconProps) {
  const { user } = useUser();
  const { worksheetNumber } = useWorksheet();

  // Fetch listing info for each listing in user's worksheet
  const { data } = useWorksheetInfo(
    user.worksheets,
    course.season_code,
    worksheetNumber,
  );

  // Update conflict status whenever the user's worksheet changes
  const conflicts = useMemo(() => {
    const inWorksheet = isInWorksheet(
      course.season_code,
      course.crn,
      worksheetNumber,
      user.worksheets,
    );
    // If the course is in the worksheet, we never report a conflict
    if (inWorksheet) return [];
    if (course.times_summary === 'TBA') return [];
    return checkConflict(data, course);
  }, [course, data, user.worksheets, worksheetNumber]);

  // Update conflict status whenever the user's worksheet changes
  const crossListed = useMemo(
    () => checkCrossListed(data, course),
    [course, data],
  );

  const seasonMismatch = course.season_code !== CUR_SEASON;

  const displayConflict = inModal
    ? seasonMismatch
    : conflicts.length > 0 || seasonMismatch;

  return (
    <Fade in={displayConflict}>
      <div>
        {displayConflict && (
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip {...props} id="conflict-icon-button-tooltip">
                <small style={{ fontWeight: 500 }}>
                <Tooltip {...props} id="conflict-icon-button-tooltip">
  <small style={{ fontWeight: 500 }}>
    {seasonMismatch
      ? `This will add this course to a worksheet in a different season.`
      : `Conflicts with: ${conflicts.map((x) => x.course_code).join(', ')}`}
  </small>
  {crossListed && (
    <div>
      <small>(cross-listed with {crossListed})</small>
    </div>
  )}
</Tooltip>
            )}
          >
            <MdErrorOutline color="#fc4103" />
          </OverlayTrigger>
        )}
      </div>
    </Fade>
  );
}

export default CourseConflictIcon;
