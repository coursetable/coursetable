import type { StateCreator } from 'zustand';
import type { Store } from '../store';
import type { CourseRBCEvent } from '../utilities/calendar';

interface CalendarSliceState {
  openColorPickerEvent: CourseRBCEvent | null;
  openWorksheetMoveEvent: CourseRBCEvent | null;
  isCalendarViewLocked: boolean;
  calendarLockStart: number;
  calendarLockEnd: number;
  isCalendarLockSettingsOpen: boolean;
}

interface CalendarSliceActions {
  setOpenColorPickerEvent: (value: CourseRBCEvent | null) => void;
  setOpenWorksheetMoveEvent: (value: CourseRBCEvent | null) => void;
  setCalendarViewLocked: (locked: boolean) => void;
  setCalendarLockRange: (start: number, end: number) => void;
  setCalendarLockSettingsOpen: (open: boolean) => void;
}

export interface CalendarSlice
  extends CalendarSliceState,
    CalendarSliceActions {}

export const createCalendarSlice: StateCreator<Store, [], [], CalendarSlice> = (
  set,
) => ({
  openColorPickerEvent: null,
  openWorksheetMoveEvent: null,
  isCalendarViewLocked: false,
  setOpenColorPickerEvent(value) {
    set({ openColorPickerEvent: value });
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
