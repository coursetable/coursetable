import type { SetStateAction } from 'react';
import type { StateCreator } from 'zustand';

import type { CatalogListing } from '../queries/api';
import { defaultFilters } from '../search/searchConstants';
import type { Filters } from '../search/searchTypes';
import type { Store } from '../store';
import type { NumFriendsReturn } from '../utilities/course';

export interface SearchSliceState {
  searchFilters: Filters;
  searchData: CatalogListing[] | null;
  coursesLoading: boolean;
  multiSeasons: boolean;
  numFriends: NumFriendsReturn;
  duration: number;
  searchTimingStartMs: number;
}

export interface SearchSliceActions {
  setSearchFilter: <K extends keyof Filters>(
    key: K,
    value: SetStateAction<Filters[K]>,
  ) => void;
  patchSearchFilters: (partial: Partial<Filters>) => void;
  setSearchData: (data: CatalogListing[] | null) => void;
  setSearchCoursesLoading: (loading: boolean) => void;
  setSearchMultiSeasons: (multi: boolean) => void;
  setSearchNumFriends: (n: NumFriendsReturn) => void;
  setSearchDuration: (d: number) => void;
  setSearchStartTime: (t: number) => void;
}

export interface SearchSlice extends SearchSliceState, SearchSliceActions {}

export const createSearchSlice: StateCreator<Store, [], [], SearchSlice> = (
  set,
) => ({
  searchFilters: defaultFilters,
  searchData: null,
  coursesLoading: false,
  multiSeasons: false,
  numFriends: {},
  duration: 0,
  searchTimingStartMs: Date.now(),

  setSearchFilter: (key, value) =>
    set((state) => {
      const current = state.searchFilters[key];
      const next =
        typeof value === 'function'
          ? (value as (prev: typeof current) => typeof current)(current)
          : value;
      return {
        searchFilters: { ...state.searchFilters, [key]: next },
        searchTimingStartMs: Date.now(),
      };
    }),

  patchSearchFilters: (partial) =>
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...partial },
      searchTimingStartMs: Date.now(),
    })),

  setSearchData: (data) => set({ searchData: data }),
  setSearchCoursesLoading: (loading) => set({ coursesLoading: loading }),
  setSearchMultiSeasons: (multi) => set({ multiSeasons: multi }),
  setSearchNumFriends: (n) => set({ numFriends: n }),
  setSearchDuration: (d) => set({ duration: d }),
  setSearchStartTime: (t) => set({ searchTimingStartMs: t }),
});
