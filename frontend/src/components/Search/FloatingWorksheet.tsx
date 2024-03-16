import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import { FaExpandAlt, FaCalendar } from 'react-icons/fa';
import { useSessionStorageState } from '../../utilities/browserStorage';
import WorksheetCalendar from '../Worksheet/WorksheetCalendar';
import styles from './FloatingWorksheet.module.css';

function FloatingWorksheet() {
  const [overlayVisible, setOverlayVisible] = useSessionStorageState(
    'overlayVisible',
    false,
  );

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={(props) => (
          <Tooltip id="overlay-tooltip" {...props}>
            {overlayVisible ? 'Hide' : 'Show'} Worksheet
          </Tooltip>
        )}
      >
        <Button
          onClick={() => {
            setOverlayVisible(!overlayVisible);
          }}
          className={styles.worksheetOverlayButton}
        >
          {overlayVisible ? (
            <IoClose style={{ marginBottom: '2px' }} />
          ) : (
            <FaCalendar style={{ marginBottom: '4px' }} />
          )}
        </Button>
      </OverlayTrigger>
      <div
        className={clsx(
          styles.overlayModal,
          overlayVisible
            ? styles.overlayModalVisible
            : styles.overlayModalHidden,
        )}
      >
        <div className={styles.expandBtn}>
          <NavLink to="/worksheet">
            <FaExpandAlt
              className={styles.expandIcon}
              size={12}
              style={{ display: 'block' }}
            />
          </NavLink>
        </div>
        <WorksheetCalendar />
      </div>
    </>
  );
}

export default FloatingWorksheet;
