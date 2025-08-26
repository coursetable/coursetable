import type { StateCreator } from 'zustand';
import type { CourseModalPrefetchListingDataFragment } from '../generated/graphql-types';
import type { Store } from '../store';
import {
  createCourseModalLink,
  createProfModalLink,
} from '../utilities/display';

type HistoryEntry =
  | {
      type: 'course';
      data: CourseModalPrefetchListingDataFragment;
    }
  | {
      type: 'professor';
      data: number;
    };

interface ModalHistorySliceState {
  currentModal: HistoryEntry | undefined;
  backTarget: string | undefined;
  history: HistoryEntry[];
}

interface ModalHistorySliceActions {
  navigate: ((
    mode: 'push' | 'replace' | 'pop',
    entry?: HistoryEntry,
    searchParams?: URLSearchParams,
  ) => void) &
    ((mode: 'pop') => void);
  closeModal: (
    setSearchParams: (params: URLSearchParams) => URLSearchParams,
  ) => void;
}

export interface ModalHistorySlice
  extends ModalHistorySliceState,
    ModalHistorySliceActions {}

function createHistoryEntryLink(
  entry: HistoryEntry,
  searchParams: URLSearchParams,
) {
  switch (entry.type) {
    case 'course':
      return createCourseModalLink(entry.data, searchParams);
    case 'professor':
      return createProfModalLink(entry.data, searchParams);
    default:
      return undefined;
  }
}

export const createModalHistorySlice: StateCreator<
  Store,
  [],
  [],
  ModalHistorySlice
> = (set, get) => ({
  // State
  currentModal: undefined,
  backTarget: undefined,
  history: [],

  // Actions
  navigate(
    mode: 'push' | 'replace' | 'pop',
    entry?: HistoryEntry,
    searchParams?: URLSearchParams,
  ) {
    const { history } = get();
    if (mode === 'pop') set({ history: history.slice(0, -1) });
    else if (mode === 'replace')
      set({ history: [...history.slice(0, -1), entry!] });
    else set({ history: [...history, entry!] });

    const newCurrentModal = history[history.length - 1];
    const newBackTarget =
      history.length > 1 ? history[history.length - 2] : undefined;

    set({
      currentModal: newCurrentModal,
      backTarget: newBackTarget
        ? createHistoryEntryLink(
            newBackTarget,
            searchParams ?? new URLSearchParams(),
          )
        : undefined,
    });
  },

  closeModal(setSearchParams: (params: URLSearchParams) => URLSearchParams) {
    set({
      history: [],
      currentModal: undefined,
      backTarget: undefined,
    });
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  },
});
