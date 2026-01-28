import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useShallow } from 'zustand/react/shallow';

import { useStore } from '../../store';
import styles from './CalendarLockSettingsModal.module.css';

const HOUR_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 7);

function formatHour(hour: number): string {
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}

function CalendarLockSettingsModal() {
  const {
    isCalendarLockSettingsOpen,
    setCalendarLockSettingsOpen,
    calendarLockStart,
    calendarLockEnd,
    setCalendarLockRange,
  } = useStore(
    useShallow((state) => ({
      isCalendarLockSettingsOpen: state.isCalendarLockSettingsOpen,
      setCalendarLockSettingsOpen: state.setCalendarLockSettingsOpen,
      calendarLockStart: state.calendarLockStart,
      calendarLockEnd: state.calendarLockEnd,
      setCalendarLockRange: state.setCalendarLockRange,
    })),
  );

  const [startHour, setStartHour] = useState(calendarLockStart);
  const [endHour, setEndHour] = useState(calendarLockEnd);

  const handleClose = () => {
    setCalendarLockSettingsOpen(false);
    setStartHour(calendarLockStart);
    setEndHour(calendarLockEnd);
  };

  const handleSave = () => {
    setCalendarLockRange(startHour, endHour);
    setCalendarLockSettingsOpen(false);
  };

  const handlePreset = (start: number, end: number) => {
    setStartHour(start);
    setEndHour(end);
  };

  const isValid = startHour < endHour;

  return (
    <Modal
      show={isCalendarLockSettingsOpen}
      onHide={handleClose}
      centered
      size="sm"
    >
      <Modal.Header closeButton>
        <Modal.Title className={styles.title}>
          Locked Calendar Time Range
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.presets}>
          <button
            type="button"
            className={styles.presetBtn}
            onClick={() => handlePreset(8, 18)}
          >
            Default (8am–6pm)
          </button>
          <button
            type="button"
            className={styles.presetBtn}
            onClick={() => handlePreset(7, 18)}
          >
            Early Bird (7am–6pm)
          </button>
          <button
            type="button"
            className={styles.presetBtn}
            onClick={() => handlePreset(10, 22)}
          >
            Night Owl (10am–10pm)
          </button>
        </div>

        <div className={styles.customRange}>
          <Form.Group className={styles.formGroup}>
            <Form.Label className={styles.label}>Start Time</Form.Label>
            <Form.Select
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className={styles.select}
            >
              {HOUR_OPTIONS.map((hour) => (
                <option key={hour} value={hour}>
                  {formatHour(hour)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label className={styles.label}>End Time</Form.Label>
            <Form.Select
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className={styles.select}
            >
              {HOUR_OPTIONS.map((hour) => (
                <option key={hour} value={hour}>
                  {formatHour(hour)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        {!isValid && (
          <p className={styles.error}>End time must be after start time</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!isValid}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CalendarLockSettingsModal;
