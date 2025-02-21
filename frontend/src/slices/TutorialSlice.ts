import type { StateCreator } from 'zustand';
import type { Store } from '../store';

interface TutorialSliceState {
  isTutorialOpen: boolean;
  currentStep: number;
  hasShownTutorial: boolean;
}

interface TutorialSliceActions {
  toggleTutorial: (open: boolean) => void;
  setCurrentStep: (step: number) => void;
  checkTutorialState: (pathname: string) => void;
}

export interface TutorialSlice
  extends TutorialSliceState,
    TutorialSliceActions {}

export const createTutorialSlice: StateCreator<Store, [], [], TutorialSlice> = (
  set,
  get,
) => ({
  // State
  isTutorialOpen: false,
  currentStep: 0,
  hasShownTutorial: false,

  // Actions
  toggleTutorial(open: boolean) {
    set({
      isTutorialOpen: open,
      currentStep: 0,
      hasShownTutorial: !open,
    });
  },

  setCurrentStep(step: number) {
    set({ currentStep: step });
  },

  checkTutorialState(pathname: string): boolean {
    const { isMobile, isTablet, authStatus, hasShownTutorial } = get();

    let shouldShowTutorial = false;
    if (
      !isMobile &&
      !isTablet &&
      authStatus === 'authenticated' &&
      !hasShownTutorial
    )
      shouldShowTutorial = pathname === '/catalog';

    set({ isTutorialOpen: shouldShowTutorial });
    return shouldShowTutorial;
  },
});
