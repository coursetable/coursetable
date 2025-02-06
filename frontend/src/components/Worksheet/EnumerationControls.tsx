import React from 'react';
import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useStore } from '../../store';
import styles from './EnumerationControls.module.css';

export interface EnumerationControlsProps {
  readonly enumerationMode: boolean;
  readonly toggleEnumerationMode: () => void;
  readonly handleNext: () => void;
  readonly handlePrevious: () => void;
  readonly currentIndex: number;
}

export function EnumerationControls({
  enumerationMode,
  toggleEnumerationMode,
  handleNext,
  handlePrevious,
  currentIndex,
}: EnumerationControlsProps) {
  const comboSize = useStore((state) => state.comboSize);
  const setComboSize = useStore((state) => state.setComboSize);

  return (
    <div className={clsx(styles.enumerationControls, 'ms-3')}>
      <Button
        variant="outline-secondary"
        onClick={toggleEnumerationMode}
        className={styles.enumToggleButton}
        aria-label="Toggle Enumeration Mode"
      >
        {enumerationMode ? 'Disable Enum' : 'Enable Enum'}
      </Button>
      {enumerationMode && (
        <div className={clsx('d-flex align-items-center', 'ms-2')}>
          <label
            htmlFor="comboSizeInput"
            style={{
              marginRight: '0.5rem',
              fontSize: '14px',
              color: 'var(--color-text)',
            }}
          >
            Combo Size:
          </label>
          <input
            id="comboSizeInput"
            type="number"
            min="1"
            value={comboSize}
            onChange={(e) => setComboSize(Number(e.target.value))}
            className={clsx(styles.comboSizeInput)}
          />
          <div className={styles.arrowControls}>
            <Button
              variant="outline-secondary"
              onClick={handlePrevious}
              className={styles.prevButton}
              aria-label="Previous Combination"
              disabled={currentIndex === 0}
            >
              <FaArrowLeft />
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleNext}
              className={styles.nextButton}
              aria-label="Next Combination"
            >
              <FaArrowRight />
            </Button>
            <div className={styles.indexDisplay}>
              Combination {currentIndex + 1}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnumerationControls;
