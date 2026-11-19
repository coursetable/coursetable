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
  Form,
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
import {
  updateWorksheetCourses,
  updateWorksheetMetadata,
} from '../../queries/api';
import { useWorksheetNumberOptions } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';
import { type CourseRBCEvent, localizer } from '../../utilities/calendar';
import {
  getColorTheme,
  isCustomColor,
  mapColorsToTheme,
} from '../../utilities/colorTheme';
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
    courses,
    savedThemeId,
    openColorPickerEvent,
  } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      courses: state.courses,
      savedThemeId: state.worksheets
        ?.get(state.viewedSeason)
        ?.get(state.viewedWorksheetNumber)?.colorTheme,
      openColorPickerEvent: state.openColorPickerEvent,
    })),
  );
  const [newColor, setNewColor] = useState<string | undefined>(undefined);
  // Unsaved theme choice; falls back to the worksheet's saved theme
  const [selectedThemeId, setSelectedThemeId] = useState<
    ColorThemeId | undefined
  >(undefined);
  const [themePanelOpen, setThemePanelOpen] = useState(false);

  if (!openColorPickerEvent) return null;

  const theme = getColorTheme(selectedThemeId ?? savedThemeId);
  const themeChanged = theme.id !== getColorTheme(savedThemeId).id;

  const handleClose = () => {
    setNewColor(undefined);
    setSelectedThemeId(undefined);
    setThemePanelOpen(false);
    onClose();
  };

  const saveTheme = () =>
    updateWorksheetMetadata({
      action: 'setColorTheme',
      season: viewedSeason,
      worksheetNumber: viewedWorksheetNumber,
      colorTheme: theme.id,
    });

  const applyThemeToAll = async (options: ApplyThemeOptions) => {
    const targets = courses.filter(
      (course) =>
        (options.includeHidden || !course.hidden) &&
        (options.overrideCustom || !isCustomColor(course.color)),
    );
    const colorMap = mapColorsToTheme(
      targets.map((course) => course.color),
      theme.colors,
    );
    const updates = targets
      .map((course) => ({
        course,
        color: colorMap.get(course.color.toLowerCase())!,
      }))
      .filter(
        ({ course, color }) =>
          course.color.toLowerCase() !== color.toLowerCase(),
      );
    if (updates.length > 0) {
      const success = await updateWorksheetCourses(
        updates.map(({ course, color }) => ({
          action: 'update' as const,
          season: viewedSeason,
          crn: course.crn,
          worksheetNumber: viewedWorksheetNumber,
          color,
        })),
      );
      if (!success) return;
    }
    if (themeChanged && !(await saveTheme())) return;
    if (updates.length > 0 || themeChanged) await worksheetsRefresh();
    toast.success(
      `Applied ${theme.name} to ${targets.length} course${targets.length === 1 ? '' : 's'}`,
    );
    handleClose();
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
            // The API rejects course updates with no fields, so skip unchanged
            const colorChanged =
              newColor !== undefined && newColor !== openColorPickerEvent.color;
            if (colorChanged) {
              await updateWorksheetCourses({
                action: 'update',
                season: viewedSeason,
                crn: openColorPickerEvent.listing.crn,
                worksheetNumber: viewedWorksheetNumber,
                color: newColor,
              });
            }
            if (themeChanged) await saveTheme();
            if (colorChanged || themeChanged) await worksheetsRefresh();
            handleClose();
          }}
        >
          Save
        </Button>
      </Modal.Footer>
      {themePanelOpen && (
        <ThemePanel
          selectedId={theme.id}
          onSelect={setSelectedThemeId}
          onApplyToAll={applyThemeToAll}
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

type ApplyThemeOptions = {
  includeHidden: boolean;
  overrideCustom: boolean;
};

function ThemePanel({
  selectedId,
  onSelect,
  onApplyToAll,
  onClose,
}: {
  readonly selectedId: ColorThemeId;
  readonly onSelect: (id: ColorThemeId) => void;
  readonly onApplyToAll: (options: ApplyThemeOptions) => Promise<void>;
  readonly onClose: () => void;
}) {
  const [includeHidden, setIncludeHidden] = useState(false);
  const [overrideCustom, setOverrideCustom] = useState(false);
  const [applying, setApplying] = useState(false);

  return (
    <section className={styles.themePanel} aria-label="Worksheet theme">
      <div className={styles.themePanelHeader}>
        <span>Worksheet theme</span>
        <CloseButton onClick={onClose} aria-label="Close worksheet theme" />
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
      <fieldset className={styles.themeApply} aria-label="Apply to all courses">
        <Button
          variant="primary"
          disabled={applying}
          onClick={async () => {
            setApplying(true);
            await onApplyToAll({ includeHidden, overrideCustom });
            setApplying(false);
          }}
        >
          Apply to all
        </Button>
        <Form.Check
          type="switch"
          id="theme-include-hidden-switch"
          label="Include hidden courses"
          checked={includeHidden}
          onChange={(e) => setIncludeHidden(e.currentTarget.checked)}
        />
        <Form.Check
          type="switch"
          id="theme-override-custom-switch"
          label="Override custom colors"
          checked={overrideCustom}
          onChange={(e) => setOverrideCustom(e.currentTarget.checked)}
        />
      </fieldset>
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
