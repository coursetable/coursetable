import React, { useState, useRef } from 'react';
import {
  Overlay,
  Popover,
  Tooltip,
  OverlayTrigger,
  Modal,
  Button,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import { FaEllipsisH } from 'react-icons/fa';
import { MdEdit, MdMoveToInbox } from 'react-icons/md';
import chroma from 'chroma-js';
import { Calendar } from 'react-big-calendar';
import { HexColorPicker } from 'react-colorful';
import { useShallow } from 'zustand/react/shallow';
import { CalendarEventBody, useEventStyle } from './CalendarEvent';
import { updateWorksheetCourses } from '../../queries/api';
import { useWorksheetNumberOptions } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';
import { type RBCEvent, localizer } from '../../utilities/calendar';
import { worksheetColors } from '../../utilities/constants';
import { SurfaceComponent, Input } from '../Typography';
import styles from './ColorPickerButton.module.css';

function WorksheetItemActionsButton({
  className,
  setOpenColorPicker,
  setOpenWorksheetMove,
}: {
  readonly event: RBCEvent;
  readonly className?: string;
  readonly setOpenColorPicker: (open: boolean) => void;
  readonly setOpenWorksheetMove: (open: boolean) => void;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const targetRef = useRef<HTMLButtonElement>(null);

  const togglePopover = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPopoverOpen((prev) => !prev);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  return (
    <div
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
          onClick={togglePopover}
          aria-label="Item actions"
        >
          <FaEllipsisH color="var(--color-text-dark)" />
        </button>
      </OverlayTrigger>
      <Overlay
        target={targetRef}
        show={popoverOpen}
        placement="bottom"
        containerPadding={20}
        rootClose
        onHide={closePopover}
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
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="color-tooltip">
                      <small>Change color</small>
                    </Tooltip>
                  }
                >
                  <button
                    type="button"
                    className={className}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setOpenColorPicker(true);
                      setPopoverOpen(false);
                    }}
                    aria-label="Change color"
                  >
                    <MdEdit color="var(--color-text-dark)" />
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="move-tooltip">
                      <small>Move to another worksheet</small>
                    </Tooltip>
                  }
                >
                  <button
                    type="button"
                    className={className}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setOpenWorksheetMove(true);
                      setPopoverOpen(false);
                    }}
                    aria-label="Move course"
                  >
                    <MdMoveToInbox color="var(--color-text-dark)" />
                  </button>
                </OverlayTrigger>
              </div>
            </Popover.Body>
          </Popover>
        )}
      </Overlay>
    </div>
  );
}

export function ColorPickerModal({
  event,
  onClose,
}: {
  readonly event: RBCEvent;
  readonly className?: string;
  readonly onClose: () => void;
}) {
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);
  const { viewedSeason, viewedWorksheetNumber } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
    })),
  );
  const [newColor, setNewColor] = useState(event.color);

  const handleClose = () => {
    setNewColor(event.color);
    onClose();
  };

  return (
    <Modal show onHide={handleClose} centered>
      <Modal.Body className={styles.modalBody}>
        <Picker color={newColor} setColor={setNewColor} />
        <Preview event={event} color={newColor} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            await updateWorksheetCourses({
              action: 'update',
              season: viewedSeason,
              crn: event.listing.crn,
              worksheetNumber: viewedWorksheetNumber,
              color: newColor,
            });
            await worksheetsRefresh();
            onClose();
          }}
        >
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export function WorksheetMoveModal({
  event,
  onClose,
}: {
  readonly event: RBCEvent;
  readonly className?: string;
  readonly onClose: () => void;
}) {
  const {
    viewedSeason,
    viewedWorksheetNumber,
    worksheetsRefresh,
    changeViewedWorksheetNumber,
  } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      worksheetsRefresh: state.worksheetsRefresh,
      changeViewedWorksheetNumber: state.changeViewedWorksheetNumber,
    })),
  );

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
      changeViewedWorksheetNumber(newWorksheetNumber);
      onClose();
    }
  };

  return (
    <Modal show onHide={onClose} centered>
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
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function ColorInput({
  color,
  setColor,
}: {
  readonly color: string;
  readonly setColor: (newColor: string) => void;
}) {
  const [invalid, setInvalid] = useState(false);
  const [value, setValue] = useState(color);
  const [prevColor, setPrevColor] = useState(color);
  if (color !== prevColor) {
    setValue(color);
    setPrevColor(color);
  }
  return (
    <Input
      type="text"
      value={value}
      isInvalid={invalid}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        if (chroma.valid(newColor)) {
          setColor(newColor);
          setInvalid(false);
        } else {
          setInvalid(true);
        }
        setValue(newColor);
      }}
    />
  );
}

function Picker({
  color,
  setColor,
}: {
  readonly color: string;
  readonly setColor: (newColor: string) => void;
}) {
  return (
    <div className={styles.pickerPanel}>
      <ColorInput color={color} setColor={setColor} />
      <HexColorPicker color={color} onChange={setColor} />
      <div className={styles.presetColors}>
        {worksheetColors.map((presetColor) => (
          <button
            type="button"
            key={presetColor}
            className={styles.presetColor}
            style={{ background: presetColor }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setColor(presetColor);
            }}
            aria-label={`Set color to ${presetColor}`}
          />
        ))}
      </div>
    </div>
  );
}

function Preview({
  event,
  color,
}: {
  readonly event: RBCEvent;
  readonly color: string;
}) {
  const eventStyleGetter = useEventStyle();
  const tempEvent = { ...event, color };
  const start = new Date(tempEvent.start);
  if (start.getMinutes() === 0) start.setHours(start.getHours() - 1);
  start.setMinutes(0);
  const end = new Date(tempEvent.end);
  end.setHours(end.getHours() + 1);
  end.setMinutes(0);
  return (
    <SurfaceComponent className={styles.eventPreview}>
      <Calendar
        defaultView="day"
        views={['day']}
        events={[tempEvent]}
        date={tempEvent.start}
        min={start}
        max={end}
        localizer={localizer}
        toolbar={false}
        components={{ event: CalendarEventBody }}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={undefined}
        onNavigate={() => {}}
      />
    </SurfaceComponent>
  );
}

export default WorksheetItemActionsButton;
