import type { StateCreator } from 'zustand';

import type { Store } from '../store';

export interface GapiSliceState {
  /**
   * Loaded Google API client for Calendar; null until `gapi-script` finishes.
   */
  gapi: typeof globalThis.gapi | null;
}

export interface GapiSliceActions {
  setGapi: (gapi: typeof globalThis.gapi | null) => void;
}

export interface GapiSlice extends GapiSliceState, GapiSliceActions {}

export const createGapiSlice: StateCreator<Store, [], [], GapiSlice> = (
  set,
) => ({
  gapi: null,
  setGapi: (gapi) => set({ gapi }),
});
