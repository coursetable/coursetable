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
    if (!isAuthenticated) {
      set({ authStatus: 'unauthenticated', user: undefined });
      return;
    }
    set({ authStatus: 'initializing' });
    try {
      await Promise.all([
        get().userRefresh(),
        get().worksheetsRefresh(),
        get().wishlistRefresh(),
        get().friendRefresh(),
        get().friendReqRefresh(),
      ]);
    } catch (error) {
      console.error('refreshAuth: one or more refresh calls failed', error);
    } finally {
      set({ authStatus: 'authenticated' });
    }
  },
});
