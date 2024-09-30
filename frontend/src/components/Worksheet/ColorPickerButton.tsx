import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { MdEdit } from 'react-icons/md';
import chroma from 'chroma-js';
import { Calendar } from 'react-big-calendar';
import { HexColorPicker } from 'react-colorful';
import { CalendarEventBody, useEventStyle } from './CalendarEvent';
import { useWorksheet } from '../../contexts/worksheetContext';
import { updateWorksheet } from '../../queries/api';
import { useStore } from '../../store';
import { type RBCEvent, localizer } from '../../utilities/calendar';
import { worksheetColors } from '../../utilities/constants';
import { SurfaceComponent, Input } from '../Typography';
import styles from './ColorPickerButton.module.css';

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

function ColorPickerButton({
  event,
  className,
}: {
  readonly event: RBCEvent;
  readonly className?: string;
}) {
  const userRefresh = useStore((state) => state.userRefresh);
  const { curSeason, worksheetNumber } = useWorksheet();
  const [open, setOpen] = useState(false);
  const [newColor, setNewColor] = useState(event.color);
  const onClose = () => {
    setOpen(false);
    setNewColor(event.color);
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <button
        type="button"
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
        aria-label="Change color"
      >
        <MdEdit color="var(--color-text-dark)" />
      </button>

      <Modal show={open} onHide={onClose} centered>
        <Modal.Body className={styles.modalBody}>
          <Picker color={newColor} setColor={setNewColor} />
          <Preview event={event} color={newColor} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              await updateWorksheet({
                action: 'update',
                season: curSeason,
                crn: event.listing.crn,
                worksheetNumber,
                color: newColor,
                hidden: false,
              });
              await userRefresh();
              setOpen(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ColorPickerButton;
