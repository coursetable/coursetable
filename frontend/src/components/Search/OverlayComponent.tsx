import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { FaExpandAlt } from 'react-icons/fa';
import WorksheetCalendar from '../Worksheet/WorksheetCalendar';
import styles from './OverlayComponent.module.css';

function OverlayComponent({ isVisible }: { readonly isVisible: boolean }) {
  return (
    <div
      className={clsx(
        styles.overlayModal,
        isVisible ? styles.overlayModalVisible : styles.overlayModalHidden,
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
  );
}

export default OverlayComponent;
