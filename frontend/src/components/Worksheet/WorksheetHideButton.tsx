import React from 'react';
import clsx from 'clsx';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { Crn } from '../../utilities/common';
import styles from './WorksheetHideButton.module.css';

export default function WorksheetHideButton({
  hidden,
  crn,
  className,
}: {
  readonly hidden: boolean;
  readonly crn: Crn;
  readonly className?: string;
}) {
  const { toggleCourse, person } = useWorksheet();
  if (person !== 'me') return null;
  const buttonLabel = `${hidden ? 'Show' : 'Hide'} in calendar`;
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={(props) => (
        <Tooltip id="button-tooltip" {...props}>
          <small>{buttonLabel}</small>
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
        className={clsx(styles.toggleButton, className)}
        aria-label={buttonLabel}
      >
        {hidden ? (
          <BsEyeSlash color="var(--color-hidden)" size={18} />
        ) : (
          <BsEye color="var(--color-text-dark)" size={18} />
        )}
      </Button>
    </OverlayTrigger>
  );
}
