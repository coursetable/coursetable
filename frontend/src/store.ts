import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createAuthSlice, type AuthSlice } from './slices/AuthSlice';
import {
  createDimensionsSlice,
  type DimensionsSlice,
} from './slices/DimensionsSlice';
import { createThemeSlice, type ThemeSlice } from './slices/ThemeSlice';
import { createUserSlice, type UserSlice } from './slices/UserSlice';
import { pick } from './utilities/common';

export interface Store
  extends AuthSlice,
    UserSlice,
    ThemeSlice,
    DimensionsSlice {}

const PersistKeys: (keyof Store)[] = ['authStatus', 'theme'];

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUserSlice(...a),
      ...createThemeSlice(...a),
      ...createDimensionsSlice(...a),
    }),
    {
      name: 'store',
      partialize: (state) => pick(state, PersistKeys),
    },
  ),
);
