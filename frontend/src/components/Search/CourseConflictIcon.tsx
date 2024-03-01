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
import { CUR_YEAR } from '../../config';

interface CourseConflictIconProps {
  readonly course: Listing;
  readonly inModal?: boolean;
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

  const crossListed = useMemo(
    () => checkCrossListed(data, course),
    [course, data],
  );

  const warning = useMemo(() => {
    const inWorksheet = isInWorksheet(
      course.season_code,
      course.crn,
      worksheetNumber,
      user.worksheets,
    );
    // If the course is in the worksheet, we never report a conflict
    if (inWorksheet) return undefined;
    if (inModal) {
      if (!CUR_YEAR.includes(course.season_code))
        return 'This will add to a worksheet of a semester that has already ended.';
      return undefined;
    }
    if (course.times_summary === 'TBA') return undefined;
    const conflicts = checkConflict(data, course);
    if (conflicts.length > 0) {
      return (
        <>
          Conflicts with: {conflicts.map((x) => x.course_code).join(', ')}
          <br />
          {crossListed && `(cross-listed with ${crossListed})`}
        </>
      );
    }
    return undefined;
  }, [course, crossListed, data, inModal, user.worksheets, worksheetNumber]);

  return (
    <Fade in={Boolean(warning)}>
      <div>
        {warning && (
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip {...props} id="conflict-icon-button-tooltip">
                <small style={{ fontWeight: 500 }}>{warning}</small>
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
