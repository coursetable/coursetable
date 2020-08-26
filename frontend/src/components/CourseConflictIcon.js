import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip, Fade } from 'react-bootstrap';

import { useUser } from '../user';
import { FetchWorksheet } from '../queries/GetWorksheetListings';
import { isInWorksheet, checkConflict, unflattenTimes } from '../utilities';
import { MdErrorOutline } from 'react-icons/md';

const CourseConflictIcon = ({ course }) => {
  const { user } = useUser();
  const [inWorksheet, setInWorksheet] = useState(
    isInWorksheet(course.season_code, course.crn.toString(), user.worksheet)
  );
  if (user.worksheet) {
    var { data } = FetchWorksheet(user.worksheet);
  }

  const update = isInWorksheet(
    course.season_code,
    course.crn.toString(),
    user.worksheet
  );
  if (inWorksheet !== update) setInWorksheet(update);

  const [conflict, setConflict] = useState(false);
  const times = unflattenTimes(course);

  useEffect(() => {
    const times = unflattenTimes(course);
    if (!data || !times) return;
    if (times === 'TBA' || checkConflict(data, course, times)) {
      setConflict(true);
      return;
    }
    setConflict(false);
  }, [course, data]);

  const renderTooltip = (props) =>
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
