import React from 'react';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import clsx from 'clsx';
import { useWorksheet } from '../../contexts/worksheetContext';

// This module is "borrowed". Maybe we shouldn't do this?
// eslint-disable-next-line css-modules/no-unused-class
import styles from './WorksheetToggleButton.module.css';
import type { Crn } from '../../utilities/common';

export default function WorksheetHideButton({
  hidden,
  crn,
}: {
  readonly hidden: boolean;
  readonly crn: Crn;
}) {
  const { toggleCourse, person } = useWorksheet();
  if (person !== 'me') return null;
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
        onClick={(e) => {
          // Prevent clicking hide button from opening course modal
          e.stopPropagation();
          toggleCourse(crn, !hidden);
        }}
        className={clsx('p-1 d-flex align-items-center', styles.toggleButton)}
      >
        {hidden ? (
          <BsEyeSlash
            color="var(--color-hidden)"
            size={18}
            className={styles.scaleIcon}
          />
        ) : (
          <BsEye
            color="var(--color-text)"
            size={18}
            className={styles.scaleIcon}
          />
        )}
      </Button>
    </OverlayTrigger>
  );
}
