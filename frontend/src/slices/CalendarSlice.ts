import { useMemo } from 'react';
import type { StateCreator } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { useStore, type Store } from '../store';
import type { CourseRBCEvent } from '../utilities/calendar';
import {
  applyColorDraft,
  applyThemeEdit,
  getWorksheetTheme,
  type CourseColor,
} from '../utilities/colorTheme';

// The color picker's unsaved changes, previewed on the worksheet until saved
type ColorPickerDraft = {
  readonly picked?: CourseColor | undefined;
  readonly themeId?: number | undefined;
  // Colors of a theme open in the theme editor, saved separately with it
  readonly editedTheme?:
    | { readonly id: number; readonly colors: readonly string[] }
    | undefined;
};

interface CalendarSliceState {
  openColorPickerEvent: CourseRBCEvent | null;
  colorPickerDraft: ColorPickerDraft;
  openWorksheetMoveEvent: CourseRBCEvent | null;
  isCalendarViewLocked: boolean;
  calendarLockStart: number;
  calendarLockEnd: number;
  isCalendarLockSettingsOpen: boolean;
}

interface CalendarSliceActions {
  setOpenColorPickerEvent: (value: CourseRBCEvent | null) => void;
  updateColorPickerDraft: (draft: ColorPickerDraft) => void;
  setOpenWorksheetMoveEvent: (value: CourseRBCEvent | null) => void;
  setCalendarViewLocked: (locked: boolean) => void;
  setCalendarLockRange: (start: number, end: number) => void;
  setCalendarLockSettingsOpen: (open: boolean) => void;
}

export interface CalendarSlice
  extends CalendarSliceState, CalendarSliceActions {}

export const createCalendarSlice: StateCreator<Store, [], [], CalendarSlice> = (
  set,
) => ({
  openColorPickerEvent: null,
  colorPickerDraft: {},
  openWorksheetMoveEvent: null,
  isCalendarViewLocked: false,
  setOpenColorPickerEvent(value) {
    // Opening or closing the picker discards anything unsaved
    set({ openColorPickerEvent: value, colorPickerDraft: {} });
  },
  updateColorPickerDraft(draft) {
    set((state) => ({
      colorPickerDraft: { ...state.colorPickerDraft, ...draft },
    }));
  },
  setOpenWorksheetMoveEvent(value) {
    set({ openWorksheetMoveEvent: value });
  },
  setCalendarViewLocked(locked) {
    set({ isCalendarViewLocked: locked });
  },
  calendarLockStart: 8,
  calendarLockEnd: 18,
  isCalendarLockSettingsOpen: false,
  setCalendarLockRange(start, end) {
    set({ calendarLockStart: start, calendarLockEnd: end });
  },
  setCalendarLockSettingsOpen(open) {
    set({ isCalendarLockSettingsOpen: open });
  },
});

/**
 * The viewed worksheet's courses with the open color picker's unsaved changes
 * applied, plus the theme they use. `toSave` leaves out a theme being edited,
 * since the theme editor saves that itself.
 */
export function useColorPickerPreview() {
  const { courses, colorThemes, savedThemeId, crn, draft } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      colorThemes: state.colorThemes,
      savedThemeId: state.worksheets
        ?.get(state.viewedSeason)
        ?.get(state.viewedWorksheetNumber)?.colorThemeId,
      crn: state.openColorPickerEvent?.listing.crn,
      draft: state.colorPickerDraft,
    })),
  );
  const selectedTheme = getWorksheetTheme(
    colorThemes,
    draft.themeId ?? savedThemeId,
  );
  const themeChanged =
    selectedTheme.id !== getWorksheetTheme(colorThemes, savedThemeId).id;
  // Memoized so the calendar only rebuilds its events when colors change
  const toSave = useMemo(
    () =>
      crn === undefined
        ? courses
        : applyColorDraft(
            courses,
            crn,
            draft.picked,
            selectedTheme,
            themeChanged,
          ),
    [courses, crn, draft.picked, selectedTheme, themeChanged],
  );
  const edit =
    draft.editedTheme?.id === selectedTheme.id ? draft.editedTheme : undefined;
  const previewCourses = useMemo(
    () => (edit ? applyThemeEdit(toSave, edit.colors) : toSave),
    [toSave, edit],
  );
  return {
    courses: previewCourses,
    toSave,
    picked: draft.picked,
    theme: edit
      ? { ...selectedTheme, colors: [...edit.colors] }
      : selectedTheme,
    themeChanged,
  };
}
