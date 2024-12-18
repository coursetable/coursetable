import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFerry } from './ferryContext';

import type { CourseModalPrefetchListingDataFragment } from '../generated/graphql-types';
import { useCourseModalFromUrlQuery } from '../queries/graphql-queries';
import type { Season, Crn } from '../queries/graphql-types';
import { useStore } from '../store';
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

// This context enables different kinds of modals to share the same history
// stack, maintaining a uniform UX.
export type Store = {
  currentModal: HistoryEntry | undefined;
  backTarget: string | undefined;
  navigate: ((mode: 'push' | 'replace', entry: HistoryEntry) => void) &
    ((mode: 'pop', entry?: undefined) => void);
  closeModal: () => void;
};

const ModalHistoryContext = createContext<Store | undefined>(undefined);

function createHistoryEntryLink(
  entry: HistoryEntry | undefined,
  searchParams: URLSearchParams,
) {
  if (!entry) return undefined;
  switch (entry.type) {
    case 'course':
      return createCourseModalLink(entry.data, searchParams);
    case 'professor':
      return createProfModalLink(entry.data, searchParams);
    default:
      return undefined;
  }
}

function parseQuery(courseModalQuery: string | null) {
  if (!courseModalQuery) return undefined;
  const [seasonCode, crn] = courseModalQuery.split('-') as [Season, string];
  if (!seasonCode || !crn) return undefined;
  return { seasonCode, crn: Number(crn) as Crn };
}

function useCourseInfoFromURL(
  isInitial: boolean,
): CourseModalPrefetchListingDataFragment | undefined {
  const user = useStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const courseModal = searchParams.get('course-modal');
  const variables = parseQuery(courseModal);
  const { courses } = useFerry();
  // If the season is in the static catalog, we can just use that instead of
  // fetching GraphQL
  const hasStaticCatalog = variables && variables.seasonCode in courses;
  const { data } = useCourseModalFromUrlQuery({
    // If variables is undefined, the query will not be sent
    variables: { ...variables!, hasEvals: Boolean(user?.hasEvals) },
    skip: !variables || !isInitial || hasStaticCatalog,
  });
  if (hasStaticCatalog)
    return courses[variables.seasonCode]!.data.get(variables.crn);
  return data?.listings[0];
}

function useProfInfoFromURL(): number | undefined {
  const [searchParams] = useSearchParams();
  const profModal = searchParams.get('prof-modal');
  return profModal ? Number(profModal) : undefined;
}

export function ModalHistoryProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const courseFromURL = useCourseInfoFromURL(history.length === 0);
  const profFromURL = useProfInfoFromURL();
  if (history.length === 0) {
    if (courseFromURL) setHistory([{ type: 'course', data: courseFromURL }]);
    else if (profFromURL)
      setHistory([{ type: 'professor', data: profFromURL }]);
  }
  const backTarget = createHistoryEntryLink(
    history[history.length - 2],
    searchParams,
  );
  const currentModal = history[history.length - 1];
  const navigate = useCallback(
    (mode: 'push' | 'replace' | 'pop', entry: HistoryEntry | undefined) => {
      if (mode === 'pop') setHistory(history.slice(0, -1));
      else if (mode === 'replace')
        setHistory([...history.slice(0, -1), entry!]);
      else setHistory([...history, entry!]);
    },
    [history, setHistory],
  );
  const closeModal = useCallback(() => {
    setHistory([]);
    setSearchParams((s) => {
      s.delete('course-modal');
      s.delete('prof-modal');
      return s;
    });
  }, [setSearchParams]);

  const store = useMemo(
    () => ({ currentModal, backTarget, navigate, closeModal }),
    [currentModal, backTarget, navigate, closeModal],
  );

  return (
    <ModalHistoryContext.Provider value={store}>
      {children}
    </ModalHistoryContext.Provider>
  );
}

export const useModalHistory = () => useContext(ModalHistoryContext)!;
