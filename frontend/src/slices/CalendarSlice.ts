import type { StateCreator } from 'zustand';
import type { Store } from '../store';
import type { RBCEvent } from '../utilities/calendar';

interface CalendarSliceState {
  openColorPickerEvent: RBCEvent | null;
  openWorksheetMoveEvent: RBCEvent | null;
  isCalendarViewLocked: boolean;
}

interface CalendarSliceActions {
  setOpenColorPickerEvent: (value: RBCEvent | null) => void;
  setOpenWorksheetMoveEvent: (value: RBCEvent | null) => void;
  setCalendarViewLocked: (locked: boolean) => void;
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
});
