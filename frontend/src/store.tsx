import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createAuthSlice, type AuthSlice } from './slices/AuthSlice';
import { createUserSlice, type UserSlice } from './slices/UserSlice';
import { pick } from './utilities/common';

export interface Store extends AuthSlice, UserSlice {}

const PersistKeys: (keyof Store)[] = ['authStatus'];

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUserSlice(...a),
    }),
    {
      name: 'store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => pick(state, PersistKeys),
    },
  ),
);
