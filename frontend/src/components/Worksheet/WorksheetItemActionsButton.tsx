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
import {
  FaCheck,
  FaChevronLeft,
  FaPlus,
  FaRegClone,
  FaRegCopy,
} from 'react-icons/fa6';
import { MdEdit, MdMoveToInbox } from 'react-icons/md';
import chroma from 'chroma-js';
import { Calendar } from 'react-big-calendar';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { CalendarEventBody, useEventStyle } from './CalendarEvent';
import {
  createColorTheme,
  deleteColorTheme,
  updateColorTheme,
  updateWorksheetCourses,
  updateWorksheetMetadata,
  type ColorTheme,
} from '../../queries/api';
import { useWorksheetNumberOptions } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';
import { type CourseRBCEvent, localizer } from '../../utilities/calendar';
import {
  applyTheme,
  fallbackTheme,
  getWorksheetTheme,
} from '../../utilities/colorTheme';
import { toSeasonString } from '../../utilities/course';
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

type PickedColor = { color: string; colorIndex: number | null };

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
    colorThemes,
    openColorPickerEvent,
  } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      courses: state.courses,
      savedThemeId: state.worksheets
        ?.get(state.viewedSeason)
        ?.get(state.viewedWorksheetNumber)?.colorThemeId,
      colorThemes: state.colorThemes,
      openColorPickerEvent: state.openColorPickerEvent,
    })),
  );
  const [picked, setPicked] = useState<PickedColor | undefined>(undefined);
  // Unsaved theme choice; falls back to the worksheet's saved theme
  const [selectedThemeId, setSelectedThemeId] = useState<number | undefined>(
    undefined,
  );
  const [themePanelOpen, setThemePanelOpen] = useState(false);

  if (!openColorPickerEvent) return null;

  const course = courses.find(
    (c) => c.listing.crn === openColorPickerEvent.listing.crn,
  );
  const theme = getWorksheetTheme(colorThemes, selectedThemeId ?? savedThemeId);
  const themeChanged =
    theme.id !== getWorksheetTheme(colorThemes, savedThemeId).id;

  const handleClose = () => {
    setPicked(undefined);
    setSelectedThemeId(undefined);
    setThemePanelOpen(false);
    onClose();
  };

  const saveTheme = () =>
    updateWorksheetMetadata({
      action: 'setColorTheme',
      season: viewedSeason,
      worksheetNumber: viewedWorksheetNumber,
      colorThemeId: theme.id,
    });

  const applyThemeToAll = async (options: ApplyThemeOptions) => {
    const targets = courses.filter((c) => options.includeHidden || !c.hidden);
    const recolored = applyTheme(targets, theme.colors, options.overrideCustom);
    const updates = targets.flatMap((c, i) => {
      const { color, colorIndex } = recolored[i]!;
      if (color === c.color && colorIndex === c.colorIndex) return [];
      return [
        {
          action: 'update' as const,
          season: viewedSeason,
          crn: c.crn,
          worksheetNumber: viewedWorksheetNumber,
          color,
          colorIndex,
        },
      ];
    });
    if (updates.length > 0 && !(await updateWorksheetCourses(updates))) return;
    if (themeChanged && !(await saveTheme())) return;
    if (updates.length > 0 || themeChanged) await worksheetsRefresh();
    toast.success(`Applied ${theme.name}`);
    handleClose();
  };

  const color = picked?.color ?? openColorPickerEvent.color;

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
          color={color}
          onPick={setPicked}
          presetColors={theme.colors}
          themeName={theme.name}
          themePanelOpen={themePanelOpen}
          onToggleThemePanel={() => setThemePanelOpen((open) => !open)}
        />
        <Preview event={openColorPickerEvent} color={color} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={async () => {
            // The API rejects course updates with no fields, so skip unchanged
            const colorChanged =
              picked !== undefined &&
              (picked.color !== course?.color ||
                picked.colorIndex !== course.colorIndex);
            if (colorChanged) {
              await updateWorksheetCourses({
                action: 'update',
                season: viewedSeason,
                crn: openColorPickerEvent.listing.crn,
                worksheetNumber: viewedWorksheetNumber,
                ...picked,
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
          themes={colorThemes ?? [fallbackTheme]}
          selectedTheme={theme}
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
    courses,
    worksheetsRefresh,
    changeViewedWorksheetNumber,
    openWorksheetMoveEvent,
  } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      courses: state.courses,
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
      // Keep its slot so the course follows the new worksheet's theme
      colorIndex:
        courses.find((c) => c.listing.crn === event.listing.crn)?.colorIndex ??
        null,
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
  onPick,
  presetColors,
  themeName,
  themePanelOpen,
  onToggleThemePanel,
}: {
  readonly color: string;
  readonly onPick: (picked: PickedColor) => void;
  readonly presetColors: readonly string[];
  readonly themeName: string;
  readonly themePanelOpen: boolean;
  readonly onToggleThemePanel: () => void;
}) {
  // Anything not picked from the theme's presets is a custom color
  const pickCustom = (newColor: string) =>
    onPick({ color: newColor, colorIndex: null });
  return (
    <div className={styles.pickerPanel}>
      <div className={styles.pickerSection}>
        <HexColorPicker color={color} onChange={pickCustom} />
        <ColorInput color={color} setColor={pickCustom} />
      </div>
      <hr className={styles.pickerDivider} />
      <div className={styles.pickerSection}>
        <div className={styles.presetColors}>
          {presetColors.map((presetColor, i) => (
            <button
              type="button"
              // Themes may repeat a color
              key={i}
              className={styles.presetColor}
              style={{ background: presetColor }}
              onClick={() => onPick({ color: presetColor, colorIndex: i })}
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

// Matches the API's limit
const MAX_THEMES = 20;

type ThemeDraft = {
  readonly id?: number;
  readonly name: string;
  readonly colors: readonly string[];
};

function ThemeOption({
  theme,
  selected,
  onSelect,
  onEdit,
  onCopy,
}: {
  readonly theme: ColorTheme;
  readonly selected: boolean;
  readonly onSelect: () => void;
  readonly onEdit: () => void;
  readonly onCopy?: () => Promise<void>;
}) {
  return (
    <div className={styles.themeOptionRow}>
      <button
        type="button"
        className={clsx(
          styles.themeOption,
          styles.themeOptionWithAction,
          selected && styles.themeOptionSelected,
        )}
        onClick={onSelect}
        aria-pressed={selected}
      >
        <span className={styles.themeOptionName}>{theme.name}</span>
        <span className={styles.themeSwatches}>
          {/* Every other color gives a spread of both rows */}
          {theme.colors
            .filter((_, i) => i % 2 === 0)
            .map((c, i) => (
              <span
                // Themes may repeat a color
                key={i}
                className={styles.themeSwatch}
                style={{ background: c }}
              />
            ))}
        </span>
      </button>
      {/* The default theme can't be edited, only copied */}
      {theme.isDefault ? (
        onCopy && (
          <button
            type="button"
            className={styles.themeActionButton}
            onClick={onCopy}
            aria-label={`Copy ${theme.name}`}
          >
            <FaRegClone />
          </button>
        )
      ) : (
        <button
          type="button"
          className={styles.themeActionButton}
          onClick={onEdit}
          aria-label={`Edit ${theme.name}`}
        >
          <MdEdit />
        </button>
      )}
    </div>
  );
}

function ThemePanel({
  themes,
  selectedTheme,
  onSelect,
  onApplyToAll,
  onClose,
}: {
  readonly themes: readonly ColorTheme[];
  readonly selectedTheme: ColorTheme;
  readonly onSelect: (id: number) => void;
  readonly onApplyToAll: (options: ApplyThemeOptions) => Promise<void>;
  readonly onClose: () => void;
}) {
  const { worksheets, colorThemesRefresh, worksheetsRefresh } = useStore(
    useShallow((state) => ({
      worksheets: state.worksheets,
      colorThemesRefresh: state.colorThemesRefresh,
      worksheetsRefresh: state.worksheetsRefresh,
    })),
  );
  const [includeHidden, setIncludeHidden] = useState(false);
  const [overrideCustom, setOverrideCustom] = useState(false);
  const [applying, setApplying] = useState(false);
  const [copying, setCopying] = useState(false);
  const [draft, setDraft] = useState<ThemeDraft | null>(null);

  const canAdd = themes.length < MAX_THEMES && !copying;

  const copyTheme = async (name: string, colors: readonly string[]) => {
    setCopying(true);
    const created = await createColorTheme(`${name} (copy)`.slice(0, 32), [
      ...colors,
    ]);
    if (created) await colorThemesRefresh();
    setCopying(false);
    setDraft(null);
  };

  // Labels for the worksheets (in any season) that use a theme
  const worksheetsUsing = (id: number) =>
    [...(worksheets ?? [])].flatMap(([season, seasonWorksheets]) =>
      [...seasonWorksheets.values()]
        .filter((ws) => ws.colorThemeId === id)
        .map((ws) => `${ws.name} (${toSeasonString(season)})`),
    );

  const title = draft
    ? draft.id === undefined
      ? 'New theme'
      : 'Edit theme'
    : 'Worksheet theme';

  return (
    <section className={styles.themePanel} aria-label={title}>
      <div className={styles.themePanelHeader}>
        <span>{title}</span>
        <CloseButton onClick={onClose} aria-label="Close worksheet theme" />
      </div>
      {draft ? (
        <ThemeEditor
          key={draft.id ?? 'new'}
          draft={draft}
          usedBy={draft.id === undefined ? [] : worksheetsUsing(draft.id)}
          canCopy={canAdd}
          onCopy={copyTheme}
          onCancel={() => setDraft(null)}
          onSaved={async (saved) => {
            await colorThemesRefresh();
            onSelect(saved.id);
            setDraft(null);
          }}
          onDeleted={async () => {
            // The API reset worksheets that used it to the default theme
            await Promise.all([colorThemesRefresh(), worksheetsRefresh()]);
            setDraft(null);
          }}
        />
      ) : (
        <>
          <div className={styles.themePanelBody}>
            <div className={styles.themeList}>
              {themes.map((theme) => (
                <ThemeOption
                  key={theme.id}
                  theme={theme}
                  selected={theme.id === selectedTheme.id}
                  onSelect={() => onSelect(theme.id)}
                  onEdit={() => setDraft(theme)}
                  onCopy={
                    canAdd
                      ? () => copyTheme(theme.name, theme.colors)
                      : undefined
                  }
                />
              ))}
            </div>
            {canAdd && (
              <button
                type="button"
                className={clsx(styles.themeOption, styles.themeNew)}
                // Start from whatever theme is selected
                onClick={() =>
                  setDraft({ name: '', colors: selectedTheme.colors })
                }
              >
                <FaPlus />
                New theme
              </button>
            )}
          </div>
          <fieldset
            className={styles.themeApply}
            aria-label="Apply to all courses"
          >
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
        </>
      )}
    </section>
  );
}

function ThemeEditor({
  draft,
  usedBy,
  canCopy,
  onCopy,
  onCancel,
  onSaved,
  onDeleted,
}: {
  readonly draft: ThemeDraft;
  readonly usedBy: readonly string[];
  readonly canCopy: boolean;
  readonly onCopy: (name: string, colors: readonly string[]) => Promise<void>;
  readonly onCancel: () => void;
  readonly onSaved: (theme: ColorTheme) => Promise<void>;
  readonly onDeleted: () => Promise<void>;
}) {
  const [name, setName] = useState(draft.name);
  const [colors, setColors] = useState(draft.colors);
  const [activeSlot, setActiveSlot] = useState(0);
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const setSlotColor = (color: string) => {
    setColors((prev) => prev.map((c, i) => (i === activeSlot ? color : c)));
  };
  // The API only accepts #rrggbb
  const normalizedColors = () => colors.map((c) => chroma(c).hex('rgb'));

  const save = async () => {
    setBusy(true);
    const saved =
      draft.id === undefined
        ? await createColorTheme(name.trim(), normalizedColors())
        : await updateColorTheme(draft.id, name.trim(), normalizedColors());
    if (saved) await onSaved(saved);
    setBusy(false);
  };

  const remove = async (id: number) => {
    setBusy(true);
    if (await deleteColorTheme(id)) await onDeleted();
    setBusy(false);
  };

  return (
    <>
      <div className={clsx(styles.themePanelBody, styles.themeEditor)}>
        <Input
          type="text"
          placeholder="Theme name"
          aria-label="Theme name"
          maxLength={32}
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
        <div className={styles.presetColors}>
          {colors.map((c, i) => (
            <button
              type="button"
              // Slots are positional and may repeat a color
              key={i}
              className={clsx(
                styles.presetColor,
                i === activeSlot && styles.presetColorActive,
              )}
              style={{ background: c }}
              onClick={() => setActiveSlot(i)}
              aria-label={`Edit color ${i + 1}`}
              aria-pressed={i === activeSlot}
            />
          ))}
        </div>
        <HexColorPicker color={colors[activeSlot]} onChange={setSlotColor} />
        <ColorInput color={colors[activeSlot]!} setColor={setSlotColor} />
      </div>
      {confirmingDelete && (
        <p className={styles.themeDeleteWarning}>
          {usedBy.length > 0
            ? `Used by ${usedBy.join(', ')}. Those worksheets will switch to Classic and their courses keep their current colors.`
            : 'Delete this theme?'}
        </p>
      )}
      <div className={styles.themeEditorFooter}>
        {draft.id !== undefined && (
          <>
            <button
              type="button"
              className={clsx(styles.textButton, styles.dangerText)}
              disabled={busy}
              onClick={() => {
                if (confirmingDelete) void remove(draft.id!);
                else setConfirmingDelete(true);
              }}
            >
              {confirmingDelete ? 'Confirm' : 'Delete'}
            </button>
            <button
              type="button"
              className={styles.textButton}
              disabled={busy || !canCopy}
              onClick={() => onCopy(name.trim() || draft.name, colors)}
            >
              Copy
            </button>
          </>
        )}
        <div className={styles.themeEditorActions}>
          <button
            type="button"
            className={styles.textButton}
            onClick={onCancel}
          >
            Cancel
          </button>
          <Button
            variant="primary"
            disabled={busy || !name.trim()}
            onClick={save}
          >
            Save
          </Button>
        </div>
      </div>
    </>
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
