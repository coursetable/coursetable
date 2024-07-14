import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useShallow } from 'zustand/react/shallow';
import { seasons, useWorksheetInfo } from './ferryContext';
import type { Option } from './searchContext';
import { CUR_SEASON } from '../config';
import {
  toggleCourseHidden,
  type UserWorksheets,
  type CatalogListing,
} from '../queries/api';
import type { Season, Crn, NetId } from '../queries/graphql-types';
import { useStore } from '../store';
import { useSessionStorageState } from '../utilities/browserStorage';

type WorksheetView = 'calendar' | 'list';

export type WorksheetCourse = {
  crn: Crn;
  color: string;
  listing: CatalogListing;
  hidden: boolean;
};

type Store = {
  // These define which courses the store contains
  person: 'me' | NetId;
  curSeason: Season;
  worksheetNumber: number;

  // These are used to select the worksheet
  seasonCodes: Season[];
  worksheetOptions: Option<number>[];

  // Controls which courses are displayed
  courses: WorksheetCourse[];
  hoverCourse: Crn | null;
  worksheetView: WorksheetView;
  worksheetLoading: boolean;
  worksheetError: {} | null;
  changeSeason: (seasonCode: Season | null) => void;
  changeWorksheet: (worksheetNumber: number) => void;
  handlePersonChange: (newPerson: 'me' | NetId) => void;
  setHoverCourse: React.Dispatch<React.SetStateAction<Crn | null>>;
  handleWorksheetView: (view: WorksheetView) => void;
  toggleCourse: (crn: Crn | 'all', hidden: boolean) => void;
};

const WorksheetContext = createContext<Store | undefined>(undefined);
WorksheetContext.displayName = 'WorksheetContext';

export function WorksheetProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { user, userRefresh } = useStore(
    useShallow((state) => ({
      user: state.user,
      userRefresh: state.userRefresh,
    })),
  );
  const [viewedPerson, setViewedPerson] = useSessionStorageState<'me' | NetId>(
    'person',
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

  // TODO: restrict to only the seasons with data
  const seasonCodes = seasons;
  const [curSeason, setCurSeason] = useSessionStorageState(
    'curSeason',
    CUR_SEASON,
  );
  const [worksheetNumber, setWorksheetNumber] = useSessionStorageState(
    'worksheetNumber',
    0,
  );

  const {
    loading: worksheetLoading,
    error: worksheetError,
    data: courses,
  } = useWorksheetInfo(curWorksheet, curSeason, worksheetNumber);

  // This will be dependent on backend data if we allow renaming
  const worksheetOptions = useMemo<Option<number>[]>(
    () =>
      [0, 1, 2, 3].map((x) => ({
        label: x === 0 ? 'Main Worksheet' : `Worksheet ${x}`,
        value: x,
      })),
    [],
  );

  const toggleCourse = useCallback(
    async (crn: Crn | 'all', hidden: boolean) => {
      toggleCourseHidden({
        season: curSeason,
        crn,
        hidden,
        courses: courses.map((course) => course.listing),
      });
      await userRefresh();
    },
    [courses, curSeason, userRefresh],
  );

  const handleWorksheetView = useCallback(
    (view: WorksheetView) => {
      setWorksheetView(view);
      // Scroll back to top when changing views
      window.scrollTo({ top: 0, left: 0 });
    },
    [setWorksheetView],
  );

  const handlePersonChange = useCallback(
    (newPerson: 'me' | NetId) => {
      setViewedPerson(newPerson);
    },
    [setViewedPerson],
  );

  const changeSeason = useCallback(
    (seasonCode: Season | null) => {
      if (seasonCode === null) return;
      setCurSeason(seasonCode);
    },
    [setCurSeason],
  );

  const changeWorksheet = useCallback(
    (newNumber: number) => {
      setWorksheetNumber(newNumber);
    },
    [setWorksheetNumber],
  );

  const store = useMemo(
    () => ({
      seasonCodes,
      curSeason,
      worksheetNumber,
      person: viewedPerson,
      courses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetOptions,

      changeSeason,
      handlePersonChange,
      setHoverCourse,
      handleWorksheetView,
      toggleCourse,
      changeWorksheet,
    }),
    [
      seasonCodes,
      curSeason,
      worksheetNumber,
      viewedPerson,
      courses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetOptions,
      changeSeason,
      handlePersonChange,
      setHoverCourse,
      handleWorksheetView,
      toggleCourse,
      changeWorksheet,
    ],
  );

  return (
    <WorksheetContext.Provider value={store}>
      {children}
    </WorksheetContext.Provider>
  );
}

export const useWorksheet = () => useContext(WorksheetContext)!;
