import * as Sentry from '@sentry/react';
import { toast } from 'react-toastify';
import type { StateCreator } from 'zustand';

import { seasons } from '../data/catalogSeasons';
import {
  loadCatalogSeason,
  shouldSkipCatalogRequest,
  subscribeToCatalogCache,
} from '../ferry/ferryCatalogCache';
import type { Season } from '../queries/graphql-types';
import type { Store } from '../store';

const FERRY_CATALOG_UNSUBSCRIBE_KEY = '__ct_ferryCatalogUnsubscribe';
type GlobalWithFerryCatalogListener = typeof globalThis & {
  [FERRY_CATALOG_UNSUBSCRIBE_KEY]?: () => void;
};

interface FerrySliceState {
  ferryRequests: number;
  ferryErrors: object[];
  ferryCatalogRevision: number;
}

interface FerrySliceActions {
  requestSeasons: (requestedSeasons: Season[]) => Promise<void>;
}

export interface FerrySlice extends FerrySliceState, FerrySliceActions {}

export const createFerrySlice: StateCreator<Store, [], [], FerrySlice> = (
  set,
  get,
) => {
  const globalWithFerryListener = globalThis as GlobalWithFerryCatalogListener;
  globalWithFerryListener[FERRY_CATALOG_UNSUBSCRIBE_KEY]?.();
  globalWithFerryListener[FERRY_CATALOG_UNSUBSCRIBE_KEY] =
    subscribeToCatalogCache(() => {
      set((state) => ({
        ferryCatalogRevision: state.ferryCatalogRevision + 1,
      }));
    });

  return {
    ferryRequests: 0,
    ferryErrors: [],
    ferryCatalogRevision: 0,

    async requestSeasons(requestedSeasons) {
      const { authStatus, user } = get();
      const fetches = requestedSeasons.map(async (season) => {
        if (!seasons.includes(season)) return;
        const includeEvals = Boolean(
          authStatus === 'authenticated' && user?.hasEvals,
        );
        if (shouldSkipCatalogRequest(season, includeEvals)) return;

        set({ ferryRequests: get().ferryRequests + 1 });
        try {
          await loadCatalogSeason(season, includeEvals);
        } finally {
          set({ ferryRequests: get().ferryRequests - 1 });
        }
      });
      await Promise.all(fetches).catch((err: unknown) => {
        Sentry.captureException(err);
        toast.error('Failed to fetch course information');
        set({ ferryErrors: [...get().ferryErrors, err as object] });
      });
    },
  };
};
