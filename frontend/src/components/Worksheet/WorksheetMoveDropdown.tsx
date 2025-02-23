import React, { useState } from 'react';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdMoveToInbox } from 'react-icons/md';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { updateWorksheetCourses } from '../../queries/api';
import { useWorksheetNumberOptions } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';
import type { RBCEvent } from '../../utilities/calendar';
import styles from './ColorPickerButton.module.css';

interface WorksheetMoveDropdownProps {
  readonly event: RBCEvent;
  readonly className?: string;
}

export function WorksheetMoveDropdown({
  event,
  className,
}: WorksheetMoveDropdownProps) {
  const { viewedSeason, viewedWorksheetNumber, worksheetsRefresh } = useStore(
    (state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      worksheetsRefresh: state.worksheetsRefresh,
    }),
  );

  const [open, setOpen] = useState(false);
  const options = useWorksheetNumberOptions('me', viewedSeason);
  const filteredOptions = Object.values(options).filter(
    (option) => option.value !== viewedWorksheetNumber,
  );

  const handleSelect = async (worksheetKey: string | null) => {
    if (!worksheetKey) return;
    const newWorksheetNumber = Number(worksheetKey);

    await updateWorksheetCourses({
      action: 'remove',
      season: viewedSeason,
      crn: event.listing.crn,
      worksheetNumber: viewedWorksheetNumber,
    });

    const addResult = await updateWorksheetCourses({
      action: 'add',
      season: viewedSeason,
      crn: event.listing.crn,
      worksheetNumber: newWorksheetNumber,
      color: event.color,
      hidden: false,
    });

    if (addResult) {
      worksheetsRefresh();
      setOpen(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <OverlayTrigger
        placement="bottom"
        overlay={(props) => (
          <Tooltip id="move-tooltip" {...props}>
            <small>Move to another worksheet</small>
          </Tooltip>
        )}
      >
        <button
          type="button"
          className={className}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen(true);
          }}
          aria-label="Move course"
        >
          <MdMoveToInbox color="var(--color-text-dark)" />
        </button>
      </OverlayTrigger>

      <Modal show={open} onHide={() => setOpen(false)} centered>
        <Modal.Body className={styles.modalBody}>
          <DropdownButton
            title="Select Worksheet"
            onSelect={handleSelect}
            variant="secondary"
            size="sm"
          >
            {filteredOptions.map(({ value, label }) => (
              <Dropdown.Item key={value} eventKey={String(value)}>
                {label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
