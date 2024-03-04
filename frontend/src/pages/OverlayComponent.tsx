import React, { useEffect } from 'react';
import Worksheet from './Worksheet';
import styles from './OverlayComponent.module.css';
import { useWorksheet } from '../contexts/worksheetContext';

function OverlayComponent({ isVisible }: { readonly isVisible: boolean }) {
  const { handleWorksheetView } = useWorksheet();
  useEffect(() => {
    handleWorksheetView({ view: 'overlay', mode: '' });
  }, [handleWorksheetView]);

  return (
    <div
      className={
        isVisible
          ? `${styles.overlayModal} ${styles.overlayModalVisible}`
          : `${styles.overlayModal} ${styles.overlayModalHidden}`
      }
    >
      <Worksheet />
    </div>
  );
}

export default OverlayComponent;
