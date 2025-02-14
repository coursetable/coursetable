import type { StateCreator } from 'zustand';
import type { Store } from '../store';
import { createLocalStorageSlot } from '../utilities/browserStorage';

const shownTutorialStorage = createLocalStorageSlot<boolean>('shownTutorial');

interface TutorialState {
  isTutorialOpen: boolean;
  currentStep: number;
}

interface TutorialActions {
  toggleTutorial: (open: boolean) => void;
  setCurrentStep: (step: number) => void;
  checkTutorialState: (pathname: string) => void;
}

export interface TutorialSlice extends TutorialState, TutorialActions {}

export const createTutorialSlice: StateCreator<Store, [], [], TutorialSlice> = (
  set,
  get,
) => ({
  // State
  isTutorialOpen: false,
  currentStep: 0,

  // Actions
  toggleTutorial(open: boolean) {
    set({
      isTutorialOpen: open,
      currentStep: 0,
    });
    shownTutorialStorage.set(!open);
  },

  setCurrentStep(step: number) {
    set({ currentStep: step });
  },

  checkTutorialState(pathname: string) {
    const { isMobile, isTablet, authStatus } = get();

    if (
      !isMobile &&
      !isTablet &&
      authStatus === 'authenticated' &&
      !shownTutorialStorage.get()
    ) {
      if (pathname === '/catalog') set({ isTutorialOpen: true });
      else if (pathname !== '/worksheet') set({ isTutorialOpen: false });
    } else {
      set({ isTutorialOpen: false });
    }
  },
});
