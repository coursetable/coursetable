import type { StateCreator } from 'zustand';
import { checkAuth } from '../queries/api';
import type { Store } from '../store';

type AuthStatus =
  | 'loading'
  | 'initializing'
  | 'authenticated'
  | 'unauthenticated';

interface AuthSliceState {
  authStatus: AuthStatus;
}

interface AuthSliceActions {
  refreshAuth: () => Promise<void>;
}

export interface AuthSlice extends AuthSliceState, AuthSliceActions {}

export const createAuthSlice: StateCreator<Store, [], [], AuthSlice> = (
  set,
  get,
) => ({
  authStatus: 'loading',
  async refreshAuth() {
    set({ authStatus: 'loading' });
    const isAuthenticated = await checkAuth();
    set({
      authStatus: isAuthenticated ? 'initializing' : 'unauthenticated',
    });
    if (isAuthenticated) {
      await Promise.all([
        get().userRefresh(),
        get().worksheetsRefresh(),
        get().wishlistRefresh(),
        get().friendRefresh(),
        get().friendReqRefresh(),
      ]);
      set({ authStatus: 'authenticated' });
    }
  },
});
