import type { StateCreator } from 'zustand';
import type { Store } from '../store';
import type { RBCEvent } from '../utilities/calendar';

interface CalendarSliceState {
  openColorPickerEvent: RBCEvent | null;
  openWorksheetMoveEvent: RBCEvent | null;
}

interface CalendarSliceActions {
  setOpenColorPickerEvent: (value: RBCEvent | null) => void;
  setOpenWorksheetMoveEvent: (value: RBCEvent | null) => void;
}

export interface CalendarSlice
  extends CalendarSliceState,
    CalendarSliceActions {}

export const createCalendarSlice: StateCreator<Store, [], [], CalendarSlice> = (
  set,
) => ({
  openColorPickerEvent: null,
  openWorksheetMoveEvent: null,
  setOpenColorPickerEvent(value) {
    set({ openColorPickerEvent: value });
  },
  setOpenWorksheetMoveEvent(value) {
    set({ openWorksheetMoveEvent: value });
  },
});
