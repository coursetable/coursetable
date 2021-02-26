import React from 'react';
import './WorksheetToggleButton.css';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { withTheme } from 'styled-components';

/**
 * Render the course hide button in the Worksheet List
 * @prop hidden - boolean | is this course hidden
 * @prop toggleCourse - function | to hide/show course
 * @prop crn - number | integer that holds crn for the current course
 */
const WorksheetHideButton = ({ hidden, toggleCourse, crn, theme }) => {
  // Handle hide/show click
  function toggleWorkSheet() {
    toggleCourse(crn);
  }
  // Size of toggle button
  const button_size = 18;

  // Tooltip that displays show/hide message on hover
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <small>{`${!hidden ? 'Hide ' : 'Show '}in calendar`}</small>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 50 }}
      overlay={renderTooltip}
    >
      <Button
        variant="toggle"
        onClick={toggleWorkSheet}
        className="p-1 d-flex align-items-center"
      >
        {hidden ? (
          <BsEyeSlash
            color={theme.hidden}
            size={button_size}
            className="scale_icon"
          />
        ) : (
          <BsEye
            color={theme.text[0]}
            size={button_size}
            className="scale_icon"
          />
        )}
      </Button>
    </OverlayTrigger>
  );
};

export default React.memo(withTheme(WorksheetHideButton));
