import React, { useState } from 'react';
import './WorksheetToggleButton.css';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { withTheme } from 'styled-components';

/**
 * Render the course hide button in the Worksheet List
 * @prop toggleCourse - function to hide/show course
 * @prop crn - int that holds crn for the current course
 * @prop season_code - string that holds the current season code
 */

const WorksheetHideButton = ({ toggleCourse, crn, season_code, theme }) => {
  // Is this course hidden?
  const [hidden, setHidden] = useState(false);
  // Handle hide/show click
  function toggleWorkSheet(e) {
    e.preventDefault();
    // Set hidden course in Worksheet.js
    toggleCourse(season_code, crn, hidden);
    // Set hidden course in this component
    setHidden(!hidden);
  }
  // Size of toggle button
  const button_size = 18;

  // Tooltip that displays show/hide message on hover
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
          <BsEyeSlash color={theme.hidden} size={button_size} />
        ) : (
          <BsEye color={theme.text} size={button_size} />
        )}
      </Button>
    </OverlayTrigger>
  );
};

export default React.memo(withTheme(WorksheetHideButton));
