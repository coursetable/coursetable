import React from 'react';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import clsx from 'clsx';

// This module is "borrowed". Maybe we shouldn't do this?
// eslint-disable-next-line css-modules/no-unused-class
import styles from './WorksheetToggleButton.module.css';

/**
 * Render the course hide button in the Worksheet List
 * @prop hidden - boolean | is this course hidden
 * @prop toggleCourse - function | to hide/show course
 * @prop crn - number | integer that holds crn for the current course
 */
export default function WorksheetHideButton({
  hidden,
  toggleCourse,
  inCal,
}: {
  readonly hidden: boolean;
  readonly toggleCourse: () => void;
  readonly inCal?: boolean;
}) {
  // Size of toggle button
  const buttonSize = 18;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent event from propagating to parent elements
    toggleCourse();
  };

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={(props) => (
        <Tooltip id="button-tooltip" {...props}>
          <small>{`${!hidden ? 'Hide ' : 'Show '}in calendar`}</small>
        </Tooltip>
      )}
    >
      <Button
        variant="toggle"
        onClick={handleClick}
        className={clsx('p-1 d-flex align-items-center', styles.toggleButton)}
      >
        {hidden ? (
          <BsEyeSlash
            color="var(--color-hidden)"
            size={buttonSize}
            className={styles.scaleIcon}
          />
        ) : (
          <BsEye
            color={inCal ? 'black' : 'var(--color-text)'}
            size={buttonSize}
            className={styles.scaleIcon}
          />
        )}
      </Button>
    </OverlayTrigger>
  );
}
