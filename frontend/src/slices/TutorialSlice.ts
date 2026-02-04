import type { StateCreator } from 'zustand';
import type { Store } from '../store';

interface TutorialSliceState {
  currentStep: number;
  hasShownTutorial: boolean;
}

interface TutorialSliceActions {
  toggleTutorial: (open: boolean) => void;
  setCurrentStep: (step: number) => void;
}

export interface TutorialSlice
  extends TutorialSliceState,
    TutorialSliceActions {}

export const createTutorialSlice: StateCreator<Store, [], [], TutorialSlice> = (
  set,
) => ({
  // State
  currentStep: 0,
  hasShownTutorial: false,

  // Actions
  toggleTutorial(open: boolean) {
    set({
      currentStep: 0,
      hasShownTutorial: !open,
    });
  },

  setCurrentStep(step: number) {
    set({ currentStep: step });
  },
});
