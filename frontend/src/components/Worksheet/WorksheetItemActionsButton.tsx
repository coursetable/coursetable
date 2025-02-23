import React, { useState, useRef } from 'react';
import { Overlay, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '../../store';
import type { RBCEvent } from '../../utilities/calendar';
import { FaEllipsisH } from 'react-icons/fa';
import ColorPickerButton from './ColorPickerButton';
import { WorksheetMoveDropdown } from './WorksheetMoveDropdown';

function WorksheetItemActionsButton({
  event,
  className,
}: {
  readonly event: RBCEvent;
  readonly className?: string;
}) {
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);
  const { viewedSeason, viewedWorksheetNumber } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
    })),
  );
  const [open, setOpen] = useState(false);
  const targetRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setOpen(false);
  };

  return (
    <div
      // Prevent click events from bubbling up to parent components
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id="button-tooltip">
            <small>Item actions</small>
          </Tooltip>
        }
      >
        <button
          type="button"
          className={className}
          ref={targetRef}
          onClick={toggleDropdown}
          aria-label="Item actions"
        >
          <FaEllipsisH color="var(--color-text-dark)" />
        </button>
      </OverlayTrigger>

      <Overlay
        target={targetRef.current}
        show={open}
        placement="bottom"
        containerPadding={20}
        rootClose
        onHide={closeDropdown}
      >
        {(props) => (
          <Popover id="popover-contained" {...props}>
            <Popover.Body>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <ColorPickerButton event={event} className={className} />
                <WorksheetMoveDropdown event={event} className={className} />
              </div>
            </Popover.Body>
          </Popover>
        )}
      </Overlay>
    </div>
  );
}

export default WorksheetItemActionsButton;
