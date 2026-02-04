import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createAuthSlice, type AuthSlice } from './slices/AuthSlice';
import {
  type CalendarSlice,
  createCalendarSlice,
} from './slices/CalendarSlice';
import {
  createDimensionsSlice,
  type DimensionsSlice,
} from './slices/DimensionsSlice';
import {
  createModalHistorySlice,
  type ModalHistorySlice,
} from './slices/ModalHistorySlice';
import {
  createProfileSlice,
  defaultPreferences,
  type ProfileSlice,
} from './slices/ProfileSlice';
import { createThemeSlice, type ThemeSlice } from './slices/ThemeSlice';
import {
  createTutorialSlice,
  type TutorialSlice,
} from './slices/TutorialSlice';
import { createUserSlice, type UserSlice } from './slices/UserSlice';
import {
  createWorksheetSlice,
  useWorksheetEffects,
  type WorksheetSlice,
} from './slices/WorksheetSlice';
import { pick } from './utilities/common';

export interface Store
  extends AuthSlice,
    CalendarSlice,
    UserSlice,
    ThemeSlice,
    DimensionsSlice,
    TutorialSlice,
    ModalHistorySlice,
    ProfileSlice,
    WorksheetSlice {}

const basePersistKeys: (keyof Store)[] = [
  'authStatus',
  'theme',
  'coursePref',
  'professorPref',
  'viewedSeason',
  'viewedWorksheetNumber',
  'worksheetView',
  'hasShownTutorial',
];
const PersistKeys = basePersistKeys.concat(
  Object.keys(defaultPreferences) as (keyof Store)[],
);

export const useStore = create<Store>()(
  persist(
    subscribeWithSelector(
      immer((...a) => ({
        ...createAuthSlice(...a),
        ...createCalendarSlice(...a),
        ...createUserSlice(...a),
        ...createThemeSlice(...a),
        ...createDimensionsSlice(...a),
        ...createTutorialSlice(...a),
        ...createModalHistorySlice(...a),
        ...createProfileSlice(...a),
        ...createWorksheetSlice(...a),
      })),
    ),
    {
      name: 'store',
      partialize: (state) => pick(state, PersistKeys),
    },
  ),
);

// Store init effects
const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false));

    const unsubFinishHydration = useStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    setHydrated(useStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};

const useAuth = () => {
  const refreshAuth = useStore((state) => state.refreshAuth);
  const loaded = useHydration();

  useEffect(() => {
    if (!loaded) return;
    void refreshAuth();
  }, [loaded, refreshAuth]);
};

const useDimensions = () => {
  const handleResize = useStore((state) => state.handleResize);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
};

const useTheme = () => {
  const theme = useStore((state) => state.theme);

  const loaded = useHydration();

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.dataset.theme = theme;
    // We don't actually use this ourselves, but it helps Bootstrap apply sane
    // defaults for colors
    document.documentElement.dataset.bsTheme = theme;
  }, [theme, loaded]);
};

export const useInitStore = () => {
  useAuth();
  useDimensions();
  useTheme();
  useWorksheetEffects();
};
