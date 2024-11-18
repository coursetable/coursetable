import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { seasons as allSeasons, useWorksheetInfo } from './ferryContext';
import type { Option } from './searchContext';
import { CUR_SEASON } from '../config';
import type { UserWorksheets, CatalogListing } from '../queries/api';
import type { Season, Crn, NetId } from '../queries/graphql-types';
import { useStore } from '../store';
import { useSessionStorageState } from '../utilities/browserStorage';

type WorksheetView = 'calendar' | 'list';

export type WorksheetCourse = {
  crn: Crn;
  color: string;
  listing: CatalogListing;
  hidden: boolean | null;
};

type Store = {
  // These define which courses the store contains
  viewedPerson: 'me' | NetId;
  viewedSeason: Season;
  viewedWorksheetNumber: number;
  changeViewedPerson: (newPerson: 'me' | NetId) => void;
  changeViewedSeason: (seasonCode: Season) => void;
  changeViewedWorksheetNumber: (worksheetNumber: number) => void;

  // Affect visual display
  worksheetView: WorksheetView;
  hoverCourse: Crn | null;
  changeWorksheetView: (view: WorksheetView) => void;
  setHoverCourse: React.Dispatch<React.SetStateAction<Crn | null>>;

  // These are used to select the worksheet
  seasonCodes: Season[];
  worksheetOptions: Option<number>[];

  // Controls which courses are displayed
  courses: WorksheetCourse[];
  worksheetLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  worksheetError: {} | null;
};

const WorksheetContext = createContext<Store | undefined>(undefined);
WorksheetContext.displayName = 'WorksheetContext';

function seasonsWithDataFirst(
  seasons: Season[],
  worksheets: UserWorksheets | undefined,
) {
  if (!worksheets) return seasons;
  return [...seasons].sort((a, b) => {
    const aHasData = a in worksheets;
    const bHasData = b in worksheets;
    if (aHasData && !bHasData) return -1;
    if (!aHasData && bHasData) return 1;
    return Number(b) - Number(a);
  });
}

export function WorksheetProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = useStore((state) => state.user);
  const [viewedPerson, setViewedPerson] = useSessionStorageState<'me' | NetId>(
    'viewedPerson',
    'me',
  );

  const [hoverCourse, setHoverCourse] = useState<Crn | null>(null);
  const [worksheetView, setWorksheetView] =
    useSessionStorageState<WorksheetView>('worksheetView', 'calendar');

  const curWorksheet = useMemo(() => {
    const whenNotDefined: UserWorksheets = {};
    if (viewedPerson === 'me') return user.worksheets ?? whenNotDefined;

    return user.friends?.[viewedPerson]?.worksheets ?? whenNotDefined;
  }, [user.worksheets, user.friends, viewedPerson]);

  // Maybe seasons without data should be disabled/hidden
  const seasonCodes = useMemo(
    () => seasonsWithDataFirst(allSeasons, user.worksheets),
    [user.worksheets],
  );
  const [viewedSeason, setViewedSeason] = useSessionStorageState(
    'viewedSeason',
    CUR_SEASON,
  );
  const [viewedWorksheetNumber, setViewedWorksheetNumber] =
    useSessionStorageState('viewedWorksheetNumber', 0);

  const {
    loading: worksheetLoading,
    error: worksheetError,
    data: courses,
  } = useWorksheetInfo(curWorksheet, viewedSeason, viewedWorksheetNumber);

  // This will be dependent on backend data if we allow renaming
  const worksheetOptions = useMemo<Option<number>[]>(
    () =>
      [0, 1, 2, 3].map((x) => ({
        label: x === 0 ? 'Main Worksheet' : `Worksheet ${x}`,
        value: x,
      })),
    [],
  );

  const changeWorksheetView = useCallback(
    (view: WorksheetView) => {
      setWorksheetView(view);
      // Scroll back to top when changing views
      window.scrollTo({ top: 0, left: 0 });
    },
    [setWorksheetView],
  );

  const changeViewedPerson = useCallback(
    (newPerson: 'me' | NetId) => {
      setViewedWorksheetNumber(0);
      setViewedPerson(newPerson);
    },
    [setViewedPerson, setViewedWorksheetNumber],
  );

  const store = useMemo(
    () => ({
      seasonCodes,
      viewedSeason,
      viewedWorksheetNumber,
      viewedPerson,
      courses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetOptions,

      changeViewedSeason: setViewedSeason,
      changeViewedPerson,
      setHoverCourse,
      changeWorksheetView,
      changeViewedWorksheetNumber: setViewedWorksheetNumber,
    }),
    [
      seasonCodes,
      viewedSeason,
      viewedWorksheetNumber,
      viewedPerson,
      courses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetOptions,
      setViewedSeason,
      changeViewedPerson,
      changeWorksheetView,
      setViewedWorksheetNumber,
    ],
  );

  return (
    <WorksheetContext.Provider value={store}>
      {children}
    </WorksheetContext.Provider>
  );
}

export const useWorksheet = () => useContext(WorksheetContext)!;
