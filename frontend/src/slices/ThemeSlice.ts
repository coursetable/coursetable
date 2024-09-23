import type { StateCreator } from 'zustand';
import type { Store } from '../store';

export type Theme = 'light' | 'dark';

interface ThemeSliceState {
  theme: Theme;
}

interface ThemeSliceActions {
  toggleTheme: () => void;
}

export interface ThemeSlice extends ThemeSliceState, ThemeSliceActions {}

export const createThemeSlice: StateCreator<Store, [], [], ThemeSlice> = (
  set,
  get,
) => ({
  theme: 'light',
  toggleTheme() {
    const newTheme: Theme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
  },
});
