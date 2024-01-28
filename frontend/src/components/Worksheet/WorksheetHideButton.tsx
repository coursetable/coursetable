import React from 'react';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import clsx from 'clsx';
import { withTheme, type DefaultTheme } from 'styled-components';

import styles from './WorksheetToggleButton.module.css';

/**
 * Render the course hide button in the Worksheet List
 * @prop hidden - boolean | is this course hidden
 * @prop toggleCourse - function | to hide/show course
 * @prop crn - number | integer that holds crn for the current course
 */
function WorksheetHideButton({
  hidden,
  toggleCourse,
  theme,
}: {
  readonly hidden: boolean;
  readonly toggleCourse: () => void;
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
        onClick={toggleCourse}
        className={clsx('p-1 d-flex align-items-center', styles.toggleButton)}
      >
        {hidden ? (
          <BsEyeSlash
            color={theme.hidden}
            size={buttonSize}
            className={styles.scale_icon}
          />
        ) : (
          <BsEye
            color={theme.text[0]}
            size={buttonSize}
            className={styles.scale_icon}
          />
        )}
      </Button>
    </OverlayTrigger>
  );
}

export default withTheme(WorksheetHideButton);
