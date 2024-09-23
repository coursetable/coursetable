import type { StateCreator } from 'zustand';
import { checkAuth } from '../queries/api';
import type { Store } from '../store';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

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
      authStatus: isAuthenticated ? 'authenticated' : 'unauthenticated',
    });
    if (isAuthenticated) {
      await Promise.all([
        get().userRefresh(),
        get().friendRefresh(),
        get().friendReqRefresh(),
      ]);
    }
  },
});
