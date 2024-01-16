import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useLocalStorageState,
  useSessionStorageState,
} from '../utilities/browserStorage';
import { CUR_SEASON } from '../config';
import { useFerry, useWorksheetInfo } from './ferryContext';
import { useUser, type Worksheet } from './userContext';
import type { Season, Listing, Crn, NetId } from '../utilities/common';

export type HiddenCourses = {
  [seasonCode: Season]: { [crn: Crn]: boolean };
};
export type WorksheetView =
  | { view: 'calendar'; mode: 'expanded' }
  | { view: 'calendar'; mode: '' }
  | { view: 'list'; mode: '' };

type Store = {
  seasonCodes: Season[];
  curWorksheet: Worksheet;
  curSeason: Season;
  worksheetNumber: string;
  person: 'me' | NetId;
  courses: Listing[];
  hiddenCourses: HiddenCourses;
  hoverCourse: number | null;
  worksheetView: WorksheetView;
  worksheetLoading: boolean;
  worksheetError: {} | null;
  worksheetData: Listing[];
  changeSeason: (seasonCode: Season | null) => void;
  changeWorksheet: (worksheetNumber: string) => void;
  handlePersonChange: (newPerson: 'me' | NetId) => void;
  setHoverCourse: React.Dispatch<React.SetStateAction<number | null>>;
  handleWorksheetView: (view: WorksheetView) => void;
  toggleCourse: (crn: Crn | -1 | -2) => void;
};

const WorksheetContext = createContext<Store | undefined>(undefined);
WorksheetContext.displayName = 'WorksheetContext';

// List of colors for the calendar events
const colors: [number, number, number][] = [
  [108, 194, 111],
  [202, 95, 83],
  [49, 164, 212],
  [223, 134, 83],
  [38, 186, 154],
  [186, 120, 129],
];

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
    const whenNotDefined: Worksheet = []; // TODO: change this to undefined
    if (viewedPerson === 'me') return user.worksheet ?? whenNotDefined;

    return user.friends?.[viewedPerson]?.worksheets ?? whenNotDefined;
  }, [user.worksheet, user.friends, viewedPerson]);

  const { seasons } = useFerry();
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
    '0',
  );

  // Fetch the worksheet info. This is eventually copied into the 'courses'
  // variable.
  const {
    loading: worksheetLoading,
    error: worksheetError,
    data: worksheetData,
  } = useWorksheetInfo(curWorksheet, curSeason, worksheetNumber);
  // Cache calendar colors. Reset whenever the season changes.
  const [colorMap, setColorMap] = useState<{
    [crn: Crn]: [number, number, number];
  }>({});
  useEffect(() => {
    setColorMap({});
  }, [curSeason]);

  // Courses data - basically a color-annotated version of the worksheet info.
  const [courses, setCourses] = useState<Listing[]>([]);

  // Initialize courses state and color map.
  useEffect(() => {
    if (!worksheetLoading && !worksheetError) {
      const temp = [...worksheetData];
      // Assign color to each course
      for (let i = 0; i < worksheetData.length; i++) {
        let choice = colors[i % colors.length]!;
        if (colorMap[temp[i]!.crn]) choice = colorMap[temp[i]!.crn]!;
        else colorMap[temp[i]!.crn] = choice;

        temp[i]!.color = choice;
        temp[i]!.currentWorksheet = worksheetNumber;
      }
      // Sort list by course code
      temp.sort((a, b) => a.course_code.localeCompare(b.course_code, 'en-US'));
      setCourses(temp);
    }
  }, [
    worksheetLoading,
    worksheetError,
    curWorksheet,
    worksheetNumber,
    worksheetData,
    setCourses,
    colorMap,
  ]);

  /* Functions */

  // Hide/Show this course
  const toggleCourse = useCallback(
    (crn: Crn | -1 | -2) => {
      if (crn === -1) {
        setHiddenCourses((oldHiddenCourses) => {
          const newHiddenCourses = { ...oldHiddenCourses };
          // There are a lot of ESLint bugs with index signatures and
          // no-unnecessary-condition
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
          // There are a lot of ESLint bugs with index signatures and
          // no-unnecessary-condition
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    (newNumber: string) => {
      setWorksheetNumber(newNumber);
    },
    [setWorksheetNumber],
  );

  // Store object returned in context provider
  const store = useMemo(
    () => ({
      // Context state.
      seasonCodes,
      curWorksheet,
      curSeason,
      worksheetNumber,
      person: viewedPerson,
      courses,
      hiddenCourses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetData,

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
      curWorksheet,
      curSeason,
      worksheetNumber,
      viewedPerson,
      courses,
      hiddenCourses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetData,
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
