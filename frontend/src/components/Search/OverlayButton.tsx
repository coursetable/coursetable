import React from 'react';
import { FaCalendar } from 'react-icons/fa';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import styles from './OverlayButton.module.css';

function FloatingButton({
  overlayVisible,
  toggleOverlay,
}: {
  readonly overlayVisible: boolean;
  readonly toggleOverlay: () => void;
}) {
  const overlayToolTip = overlayVisible ? (
    <Tooltip id="hide-overlay">Hide Worksheet</Tooltip>
  ) : (
    <Tooltip id="show-overlay">Show Worksheet</Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={overlayToolTip}>
      <Button onClick={toggleOverlay} className={styles.worksheetOverlayButton}>
        {overlayVisible ? (
          <IoClose style={{ marginBottom: '2px' }} />
        ) : (
          <FaCalendar style={{ marginBottom: '4px' }} />
        )}
      </Button>
    </OverlayTrigger>
  );
}

export default FloatingButton;
