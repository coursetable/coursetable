import type { SetURLSearchParams } from 'react-router-dom';
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
  /** Blocks URL hydration until modal query keys are cleared. */
  suppressInitialFromUrl: boolean;
}

interface ModalHistorySliceActions {
  navigate: {
    (mode: 'pop', entry?: undefined, searchParams?: URLSearchParams): void;
    (
      mode: 'push' | 'replace',
      entry: HistoryEntry,
      searchParams?: URLSearchParams,
    ): void;
  };
  closeModal: (setSearchParams: SetURLSearchParams) => void;
  clearUrlSuppression: () => void;
}

export interface ModalHistorySlice
  extends ModalHistorySliceState, ModalHistorySliceActions {}

export type ModalHistoryNavigateFn = ModalHistorySlice['navigate'];

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
  currentModal: undefined,
  backTarget: undefined,
  history: [],
  suppressInitialFromUrl: false,

  navigate(
    mode: 'push' | 'replace' | 'pop',
    entry?: HistoryEntry,
    searchParams = new URLSearchParams(),
  ) {
    const { history } = get();
    const newHistory: HistoryEntry[] =
      mode === 'pop'
        ? history.slice(0, -1)
        : mode === 'replace'
          ? history.length === 0
            ? [entry!]
            : [...history.slice(0, -1), entry!]
          : [...history, entry!];

    const newCurrentModal = newHistory[newHistory.length - 1];
    const newBackTarget =
      newHistory.length > 1 ? newHistory[newHistory.length - 2] : undefined;

    set({
      history: newHistory,
      currentModal: newCurrentModal,
      backTarget: newBackTarget
        ? createHistoryEntryLink(newBackTarget, searchParams)
        : undefined,
    });
  },

  closeModal(setSearchParams: SetURLSearchParams) {
    set({
      history: [],
      currentModal: undefined,
      backTarget: undefined,
      suppressInitialFromUrl: true,
    });
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('course-modal');
      next.delete('prof-modal');
      return next;
    });
  },

  clearUrlSuppression() {
    set({ suppressInitialFromUrl: false });
  },
});
