import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaExpandAlt, FaCalendar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useSessionStorageState } from '../../utilities/browserStorage';
import WorksheetCalendar from '../Worksheet/WorksheetCalendar';
import styles from './FloatingWorksheet.module.css';

function FloatingWorksheet() {
  const [overlayVisible, setOverlayVisible] = useSessionStorageState(
    'overlayVisible',
    false,
  );
  const label = `${overlayVisible ? 'Hide' : 'Show'} worksheet`;

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={(props) => (
          <Tooltip id="overlay-tooltip" {...props}>
            {label}
          </Tooltip>
        )}
      >
        <Button
          onClick={() => {
            setOverlayVisible(!overlayVisible);
          }}
          className={styles.worksheetOverlayButton}
          aria-label={label}
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
          <NavLink to="/worksheet" aria-label="Expand worksheet">
            <FaExpandAlt className={styles.expandIcon} size={12} />
          </NavLink>
        </div>
        <WorksheetCalendar />
      </div>
    </>
  );
}

export default FloatingWorksheet;
