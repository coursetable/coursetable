import type { StateCreator } from 'zustand';
import type { Store } from '../store';
import type { CourseWithTime } from '../utilities/useEnumeration';

export interface EnumerationState {
  enumerationMode: boolean;
  currentIndex: number;
  totalCombos: number;
  currentCombo: CourseWithTime[] | null;
  comboSize: number; // Number of courses in a combo
}

export interface EnumerationActions {
  // Actions to update the state:
  toggleEnumerationMode: () => void;
  setCurrentIndex: (index: number) => void;
  setTotalCombos: (total: number) => void;
  setCurrentCombo: (combo: CourseWithTime[] | null) => void;
  setHandleNext: (fn: () => void) => void;
  setHandlePrevious: (fn: () => void) => void;
  // Navigation functions (to be set from the Worksheet page)
  handleNext: () => void;
  handlePrevious: () => void;
  setEnumState: (
    handleNext: () => void,
    handlePrevious: () => void,
    currentIndex: number,
    totalCombos: number,
  ) => void;
  setComboSize: (size: number) => void; // Sets combo size
}

export interface EnumerationSlice
  extends EnumerationState,
    EnumerationActions {}

export const createEnumerationSlice: StateCreator<
  Store,
  [],
  [],
  EnumerationSlice
> = (set, get) => ({
  enumerationMode: false,
  currentIndex: 0,
  totalCombos: 0,
  currentCombo: null,
  comboSize: 4, // Default combo size is 4
  toggleEnumerationMode: () => set({ enumerationMode: !get().enumerationMode }),
  setCurrentIndex: (index: number) => set({ currentIndex: index }),
  setTotalCombos: (total: number) => set({ totalCombos: total }),
  setCurrentCombo: (combo: CourseWithTime[] | null) =>
    set({ currentCombo: combo }),
  setHandleNext: (fn: () => void) => set({ handleNext: fn }),
  setHandlePrevious: (fn: () => void) => set({ handlePrevious: fn }),
  // Initialize navigation functions as no-ops.
  handleNext() {},
  handlePrevious() {},
  setEnumState: (
    handleNext: () => void,
    handlePrevious: () => void,
    currentIndex: number,
    totalCombos: number,
  ) => set({ handleNext, handlePrevious, currentIndex, totalCombos }),
  setComboSize: (size: number) => set({ comboSize: size }),
});
