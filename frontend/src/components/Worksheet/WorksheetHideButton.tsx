import React from 'react';
import './WorksheetToggleButton.css';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { withTheme, type DefaultTheme } from 'styled-components';

/**
 * Render the course hide button in the Worksheet List
 * @prop hidden - boolean | is this course hidden
 * @prop toggleCourse - function | to hide/show course
 * @prop crn - number | integer that holds crn for the current course
 */
function WorksheetHideButton({
  hidden,
  toggleCourse,
  crn,
  theme,
}: {
  readonly hidden: boolean;
  readonly toggleCourse: (crn: number) => void;
  readonly crn: number;
  readonly theme: DefaultTheme;
}) {
  // Size of toggle button
  const buttonSize = 18;

  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 1000, hide: 0 }}
      overlay={(props) => (
        <Tooltip id="button-tooltip" {...props}>
          <small>{`${!hidden ? 'Hide ' : 'Show '}in calendar`}</small>
        </Tooltip>
      )}
    >
      <Button
        variant="toggle"
        onClick={() => toggleCourse(crn)}
        className="p-1 d-flex align-items-center"
      >
        {hidden ? (
          <BsEyeSlash
            color={theme.hidden}
            size={buttonSize}
            className="scale_icon"
          />
        ) : (
          <BsEye
            color={theme.text[0]}
            size={buttonSize}
            className="scale_icon"
          />
        )}
      </Button>
    </OverlayTrigger>
  );
}

export default withTheme(WorksheetHideButton);
