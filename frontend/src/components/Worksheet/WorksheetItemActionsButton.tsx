import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import {
  CloseButton,
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
import { FaCheck, FaChevronLeft, FaRegCopy } from 'react-icons/fa6';
import { MdEdit, MdMoveToInbox } from 'react-icons/md';
import chroma from 'chroma-js';
import { Calendar } from 'react-big-calendar';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { CalendarEventBody, useEventStyle } from './CalendarEvent';
import { updateWorksheetCourses } from '../../queries/api';
import { useWorksheetNumberOptions } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';
import { type CourseRBCEvent, localizer } from '../../utilities/calendar';
import { colorThemes, type ColorThemeId } from '../../utilities/constants';
import { SurfaceComponent, Input } from '../Typography';
import styles from './ColorPickerButton.module.css';

function WorksheetItemActionsButton({
  event,
  className,
}: {
  readonly event: CourseRBCEvent;
  readonly className?: string;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const targetRef = useRef<HTMLButtonElement>(null);

  const { setOpenColorPickerEvent, setOpenWorksheetMoveEvent } = useStore(
    useShallow((state) => ({
      setOpenColorPickerEvent: state.setOpenColorPickerEvent,
      setOpenWorksheetMoveEvent: state.setOpenWorksheetMoveEvent,
    })),
  );

  const togglePopover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopoverOpen((prev) => !prev);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className={className}
        ref={targetRef}
        onClick={togglePopover}
        aria-label="Item actions"
      >
        <FaEllipsisH color="var(--color-text-dark)" />
      </button>
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
                    <Tooltip
                      id={`worksheet-item-color-${event.listing.crn}-${event.start.getTime()}-tooltip`}
                    >
                      <small>Change color</small>
                    </Tooltip>
                  }
                >
                  <button
                    type="button"
                    className={className}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenColorPickerEvent(event);
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
                    <Tooltip
                      id={`worksheet-item-move-${event.listing.crn}-${event.start.getTime()}-tooltip`}
                    >
                      <small>Move to another worksheet</small>
                    </Tooltip>
                  }
                >
                  <button
                    type="button"
                    className={className}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenWorksheetMoveEvent(event);
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
  onClose,
}: {
  readonly onClose: () => void;
}) {
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);
  const {
    viewedSeason,
    viewedWorksheetNumber,
    openColorPickerEvent,
    colorThemeId,
    setColorThemeId,
  } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      openColorPickerEvent: state.openColorPickerEvent,
      colorThemeId: state.colorThemeId,
      setColorThemeId: state.setColorThemeId,
    })),
  );
  const [newColor, setNewColor] = useState<string | undefined>(undefined);
  const [themePanelOpen, setThemePanelOpen] = useState(false);

  if (!openColorPickerEvent) return null;

  // A persisted id may no longer exist if themes are renamed or removed
  const theme =
    colorThemes.find((t) => t.id === colorThemeId) ?? colorThemes[0];

  const handleClose = () => {
    setNewColor(undefined);
    setThemePanelOpen(false);
    onClose();
  };

  return (
    <Modal show onHide={handleClose} centered dialogClassName={styles.dialog}>
      <Modal.Header closeButton className={styles.modalHeader}>
        <div className={styles.modalTop}>
          <Modal.Title>
            <div className={styles.modalTitle}>Change color</div>
          </Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Picker
          color={newColor ?? openColorPickerEvent.color}
          setColor={setNewColor}
          presetColors={theme.colors}
          themeName={theme.name}
          themePanelOpen={themePanelOpen}
          onToggleThemePanel={() => setThemePanelOpen((open) => !open)}
        />
        <Preview
          event={openColorPickerEvent}
          color={newColor ?? openColorPickerEvent.color}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={async () => {
            // Nothing to save; the API rejects updates with no fields
            if (!newColor || newColor === openColorPickerEvent.color) {
              handleClose();
              return;
            }
            await updateWorksheetCourses({
              action: 'update',
              season: viewedSeason,
              crn: openColorPickerEvent.listing.crn,
              worksheetNumber: viewedWorksheetNumber,
              color: newColor,
            });
            await worksheetsRefresh();
            handleClose();
          }}
        >
          Save
        </Button>
      </Modal.Footer>
      {themePanelOpen && (
        <ThemePanel
          selectedId={theme.id}
          onSelect={setColorThemeId}
          onClose={() => setThemePanelOpen(false)}
        />
      )}
    </Modal>
  );
}

export function WorksheetMoveModal({
  onClose,
}: {
  readonly onClose: () => void;
}) {
  const {
    viewedSeason,
    viewedWorksheetNumber,
    worksheetsRefresh,
    changeViewedWorksheetNumber,
    openWorksheetMoveEvent,
  } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      worksheetsRefresh: state.worksheetsRefresh,
      changeViewedWorksheetNumber: state.changeViewedWorksheetNumber,
      openWorksheetMoveEvent: state.openWorksheetMoveEvent,
    })),
  );

  const options = useWorksheetNumberOptions('me', viewedSeason);
  const filteredOptions = Object.values(options).filter(
    (option) => option.value !== viewedWorksheetNumber,
  );
  const event = openWorksheetMoveEvent;
  if (!event) return null;

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
      void worksheetsRefresh();
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
  const [copied, setCopied] = useState(false);
  if (color !== prevColor) {
    setValue(color);
    setPrevColor(color);
  }
  return (
    <div className={styles.hexRow}>
      <Input
        type="text"
        className={styles.hexInput}
        value={value}
        isInvalid={invalid}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
          e.target.select();
        }}
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
      <button
        type="button"
        className={styles.copyButton}
        onClick={() => {
          navigator.clipboard.writeText(color).then(
            () => {
              toast.success('Color copied!');
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            },
            () => {
              toast.error('Failed to copy color');
            },
          );
        }}
        aria-label={copied ? 'Copied' : 'Copy hex code'}
      >
        {copied ? <FaCheck /> : <FaRegCopy />}
      </button>
    </div>
  );
}

function Picker({
  color,
  setColor,
  presetColors,
  themeName,
  themePanelOpen,
  onToggleThemePanel,
}: {
  readonly color: string;
  readonly setColor: (newColor: string) => void;
  readonly presetColors: readonly string[];
  readonly themeName: string;
  readonly themePanelOpen: boolean;
  readonly onToggleThemePanel: () => void;
}) {
  return (
    <div className={styles.pickerPanel}>
      <div className={styles.pickerSection}>
        <HexColorPicker color={color} onChange={setColor} />
        <ColorInput color={color} setColor={setColor} />
      </div>
      <hr className={styles.pickerDivider} />
      <div className={styles.pickerSection}>
        <div className={styles.presetColors}>
          {presetColors.map((presetColor) => (
            <button
              type="button"
              key={presetColor}
              className={styles.presetColor}
              style={{ background: presetColor }}
              onClick={() => {
                setColor(presetColor);
              }}
              aria-label={`Set color to ${presetColor}`}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.themeSelector}
          onClick={onToggleThemePanel}
          aria-expanded={themePanelOpen}
          aria-label={`Color theme: ${themeName}`}
        >
          <FaChevronLeft className={styles.themeSelectorChevron} />
          <span className={styles.themeSelectorName}>{themeName}</span>
        </button>
      </div>
    </div>
  );
}

function ThemePanel({
  selectedId,
  onSelect,
  onClose,
}: {
  readonly selectedId: ColorThemeId;
  readonly onSelect: (id: ColorThemeId) => void;
  readonly onClose: () => void;
}) {
  return (
    <section className={styles.themePanel} aria-label="Color themes">
      <div className={styles.themePanelHeader}>
        <span>Themes</span>
        <CloseButton onClick={onClose} aria-label="Close themes" />
      </div>
      <div className={styles.themeList}>
        {colorThemes.map((theme) => (
          <button
            type="button"
            key={theme.id}
            className={clsx(
              styles.themeOption,
              theme.id === selectedId && styles.themeOptionSelected,
            )}
            onClick={() => onSelect(theme.id)}
            aria-pressed={theme.id === selectedId}
          >
            <span>{theme.name}</span>
            <span className={styles.themeSwatches}>
              {/* Every other color gives a spread of both rows */}
              {theme.colors
                .filter((_, i) => i % 2 === 0)
                .map((c) => (
                  <span
                    key={c}
                    className={styles.themeSwatch}
                    style={{ background: c }}
                  />
                ))}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

const MIN_PREVIEW_WINDOW = 2;

function Preview({
  event,
  color,
}: {
  readonly event: CourseRBCEvent;
  readonly color: string;
}) {
  const eventStyleGetter = useEventStyle();
  // Walking-time badges only make sense on the real calendar
  const tempEvent = { ...event, color, walkBefore: undefined };

  // Hour-aligned window with at least 15 minutes of padding around the block
  const toHours = (d: Date) => d.getHours() + d.getMinutes() / 60;
  const padding = 15 / 60;
  const minHour = Math.max(Math.floor(toHours(tempEvent.start) - padding), 0);
  const maxHour = Math.max(
    minHour + MIN_PREVIEW_WINDOW,
    Math.ceil(toHours(tempEvent.end) + padding),
  );

  const start = new Date(tempEvent.start);
  start.setHours(minHour, 0, 0, 0);

  const end = new Date(tempEvent.start);
  // Hour 24 would roll over to the next day
  if (maxHour >= 24) end.setHours(23, 59, 0, 0);
  else end.setHours(maxHour, 0, 0, 0);

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
