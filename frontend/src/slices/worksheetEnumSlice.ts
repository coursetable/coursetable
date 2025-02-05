import type { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { CourseWithTime } from '../hooks/useEnumeration';
import { Store } from '../store';

export interface EnumerationState {
  enumerationMode: boolean;
  currentIndex: number;
  totalCombos: number;
  currentCombo: CourseWithTime[] | null;
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
}

export const createEnumerationSlice: StateCreator<
  Store,
  [],
  [['zustand/immer', never]],
  EnumerationState
> = immer((set) => ({
  enumerationMode: false,
  currentIndex: 0,
  totalCombos: 0,
  currentCombo: null,
  toggleEnumerationMode: () =>
    set((state: EnumerationState) => {
      state.enumerationMode = !state.enumerationMode;
    }),
  setCurrentIndex: (index: number) =>
    set((state: EnumerationState) => {
      state.currentIndex = index;
    }),
  setTotalCombos: (total: number) =>
    set((state: EnumerationState) => {
      state.totalCombos = total;
    }),
  setCurrentCombo: (combo: CourseWithTime[] | null) =>
    set((state: EnumerationState) => {
      state.currentCombo = combo;
    }),
  setHandleNext: (fn: () => void) =>
    set((state: EnumerationState) => {
      state.handleNext = fn;
    }),
  setHandlePrevious: (fn: () => void) =>
    set((state: EnumerationState) => {
      state.handlePrevious = fn;
    }),
  // Initialize navigation functions as no-ops.
  handleNext() {},
  handlePrevious() {},
}));
