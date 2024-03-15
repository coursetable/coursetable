import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  useLocalStorageState,
  useSessionStorageState,
} from '../utilities/browserStorage';
import { CUR_SEASON } from '../config';
import { seasons, useWorksheetInfo } from './ferryContext';
import { useUser, type UserWorksheets } from './userContext';
import type { Option } from './searchContext';
import type { Season, Listing, Crn, NetId } from '../utilities/common';

export type HiddenCourses = {
  [seasonCode: Season]: { [crn: Crn]: boolean };
};
type WorksheetView =
  | { view: 'calendar'; mode: 'expanded' }
  | { view: 'calendar'; mode: '' }
  | { view: 'list'; mode: '' };

export type WorksheetCourse = {
  crn: Crn;
  color: string;
  listing: Listing;
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
  hiddenCourses: HiddenCourses;
  hoverCourse: number | null;
  worksheetView: WorksheetView;
  worksheetLoading: boolean;
  worksheetError: {} | null;
  changeSeason: (seasonCode: Season | null) => void;
  changeWorksheet: (worksheetNumber: number) => void;
  handlePersonChange: (newPerson: 'me' | NetId) => void;
  setHoverCourse: React.Dispatch<React.SetStateAction<number | null>>;
  handleWorksheetView: (view: WorksheetView) => void;
  toggleCourse: (crn: Crn | -1 | -2) => void;
};

const WorksheetContext = createContext<Store | undefined>(undefined);
WorksheetContext.displayName = 'WorksheetContext';

/**
 * Stores the user's worksheet filters and sorts
 */
export function WorksheetProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // Fetch user context data
  const { user } = useUser();
  // Current user who's worksheet we are viewing
  const [viewedPerson, setViewedPerson] = useSessionStorageState<'me' | NetId>(
    'person',
    'me',
  );

  // List of courses that the user has marked hidden
  const [hiddenCourses, setHiddenCourses] = useLocalStorageState<HiddenCourses>(
    'hiddenCourses',
    {},
  );
  // The current listing that the user is hovering over
  const [hoverCourse, setHoverCourse] = useState<number | null>(null);
  // Currently expanded component (calendar or list or none)
  const [worksheetView, setWorksheetView] =
    useSessionStorageState<WorksheetView>('worksheetView', {
      view: 'calendar',
      mode: '',
    });

  /* Processing */

  // Worksheet of the current person
  const curWorksheet = useMemo(() => {
    const whenNotDefined: UserWorksheets = {}; // TODO: change this to undefined
    if (viewedPerson === 'me') return user.worksheets ?? whenNotDefined;

    return user.friends?.[viewedPerson]?.worksheets ?? whenNotDefined;
  }, [user.worksheets, user.friends, viewedPerson]);

  // TODO: restrict to only the seasons with data
  const seasonCodes = seasons;

  // Current season
  const [curSeason, setCurSeason] = useSessionStorageState(
    'curSeason',
    CUR_SEASON,
  );

  // Current worksheet number
  const [worksheetNumber, setWorksheetNumber] = useSessionStorageState(
    'worksheetNumber',
    0,
  );

  // Fetch the worksheet info. This is eventually copied into the 'courses'
  // variable.
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

  /* Functions */

  // Hide/Show this course
  const toggleCourse = useCallback(
    (crn: Crn | -1 | -2) => {
      if (crn === -1) {
        setHiddenCourses((oldHiddenCourses) => {
          const newHiddenCourses = { ...oldHiddenCourses };
          newHiddenCourses[curSeason] ??= {};

          courses.forEach((listing) => {
            newHiddenCourses[curSeason]![listing.crn] = true;
          });
          return newHiddenCourses;
        });
      } else if (crn === -2) {
        setHiddenCourses((oldHiddenCourses) => {
          const newHiddenCourses = { ...oldHiddenCourses };
          newHiddenCourses[curSeason] = {};
          return newHiddenCourses;
        });
      } else {
        setHiddenCourses((oldHiddenCourses) => {
          const newHiddenCourses = { ...oldHiddenCourses };
          newHiddenCourses[curSeason] ??= {};

          if (newHiddenCourses[curSeason]![crn])
            delete newHiddenCourses[curSeason]![crn];
          else newHiddenCourses[curSeason]![crn] = true;
          return newHiddenCourses;
        });
      }
    },
    [setHiddenCourses, courses, curSeason],
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

  // Function to change season
  const changeSeason = useCallback(
    (seasonCode: Season | null) => {
      if (seasonCode === null) return;
      setCurSeason(seasonCode);
    },
    [setCurSeason],
  );

  // Function to change worksheet number
  const changeWorksheet = useCallback(
    (newNumber: number) => {
      setWorksheetNumber(newNumber);
    },
    [setWorksheetNumber],
  );

  // Store object returned in context provider
  const store = useMemo(
    () => ({
      // Context state.
      seasonCodes,
      curSeason,
      worksheetNumber,
      person: viewedPerson,
      courses,
      hiddenCourses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetOptions,

      // Update methods.
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
      hiddenCourses,
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
