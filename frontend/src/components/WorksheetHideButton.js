import React, { useState } from 'react';
import './WorksheetToggleButton.css';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

const WorksheetHideButton = (props) => {
  const [hidden, setHidden] = useState(false);
  function toggleWorkSheet(e) {
    e.preventDefault();
    const temp = hidden;
    setHidden(!hidden);
    props.toggleCourse(props.season_code, props.crn, temp);
    // console.log('toggle ', props.crn + ' ' + props.season_code);
  }
  const button_size = 18;

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <small>{(!hidden ? 'Hide ' : 'Show ') + 'in calendar'}</small>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="left"
      delay={{ show: 1000, hide: 250 }}
      overlay={renderTooltip}
    >
      <Button variant="toggle" onClick={toggleWorkSheet} className="p-0">
        {hidden ? (
          <BsEyeSlash color="#d6d6d6" size={button_size} />
        ) : (
          <BsEye size={button_size} />
        )}
      </Button>
    </OverlayTrigger>
  );
};

export default WorksheetHideButton;
