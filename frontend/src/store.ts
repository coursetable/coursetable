// Src/store/index.ts
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Import your existing slices
import { createAuthSlice, type AuthSlice } from './slices/AuthSlice';
import {
  createDimensionsSlice,
  type DimensionsSlice,
} from './slices/DimensionsSlice';
import {
  createProfileSlice,
  defaultPreferences,
  type ProfileSlice,
} from './slices/ProfileSlice';
import { createThemeSlice, type ThemeSlice } from './slices/ThemeSlice';
import { createUserSlice, type UserSlice } from './slices/UserSlice';
import {
  createEnumerationSlice,
  type EnumerationSlice,
} from './slices/WorksheetEnumSlice';
import {
  createWorksheetSlice,
  useWorksheetEffects,
  useWorksheetSubscriptions,
  type WorksheetSlice,
} from './slices/WorksheetSlice';

import { pick } from './utilities/common';

// Extend the global store interface to include all slices.
export interface Store
  extends AuthSlice,
    UserSlice,
    ThemeSlice,
    DimensionsSlice,
    ProfileSlice,
    WorksheetSlice,
    EnumerationSlice {}

// Define keys to persist from the store.
const basePersistKeys: (keyof Store)[] = [
  'authStatus',
  'theme',
  'coursePref',
  'professorPref',
  'viewedPerson',
  'viewedSeason',
  'viewedWorksheetNumber',
  'worksheetView',
  'enumerationMode',
];

// Optionally add keys from defaultPreferences
const PersistKeys = basePersistKeys.concat(
  Object.keys(defaultPreferences) as (keyof Store)[],
);

// Create the store using persist, subscribeWithSelector, and immer.
export const useStore = create<Store>()(
  persist(
    subscribeWithSelector(
      immer((...a) => ({
        ...createAuthSlice(...a),
        ...createUserSlice(...a),
        ...createThemeSlice(...a),
        ...createDimensionsSlice(...a),
        ...createProfileSlice(...a),
        ...createWorksheetSlice(...a),
        ...createEnumerationSlice(...a),
      })),
    ),
    {
      name: 'store',
      partialize: (state) => pick(state, PersistKeys),
    },
  ),
);

// --- Store Initialization Hooks ---

// Hydration hook: Determines when the persisted store has finished hydrating.
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
    // This helps Bootstrap apply default colors
    document.documentElement.dataset.bsTheme = theme;
  }, [theme, loaded]);
};

export const useInitStore = () => {
  // Worksheet subscriptions must run first.
  useWorksheetSubscriptions();

  // Then run other effects.
  useAuth();
  useDimensions();
  useTheme();
  useWorksheetEffects();
};
