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
import { useFerry } from './ferryContext';
import { toSeasonString } from '../utilities/courseUtilities';
import { useWorksheetInfo } from '../queries/GetWorksheetListings';
import { useUser, type Worksheet } from './userContext';
import type { Season, Listing } from '../utilities/common';
import type { OptType } from './searchContext';

export type HiddenCourses = { [key: Season]: { [key: number]: boolean } };
export type WorksheetView = { [key: string]: string };

type Store = {
  seasonCodes: string[];
  seasonOptions: OptType;
  curWorksheet: Worksheet;
  curSeason: Season;
  worksheetNumber: string;
  person: string;
  courses: Listing[];
  hiddenCourses: HiddenCourses;
  hoverCourse: number | null;
  worksheetView: WorksheetView;
  worksheetLoading: boolean;

  worksheetError: {} | null;
  worksheetData: Listing[];
  changeSeason: (seasonCode: Season | null) => void;
  changeWorksheet: (worksheetNumber: string) => void;
  handlePersonChange: (newPerson: string) => void;
  setHoverCourse: React.Dispatch<React.SetStateAction<number | null>>;
  handleWorksheetView: (view: WorksheetView) => void;
  toggleCourse: (crn: number) => void;
};

const WorksheetContext = createContext<Store | undefined>(undefined);
WorksheetContext.displayName = 'WorksheetContext';

// List of colors for the calendar events
const colors = [
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
  const [viewedPerson, setViewedPerson] = useSessionStorageState(
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

    const friendWorksheets = user.friendWorksheets?.worksheets;
    return friendWorksheets
      ? friendWorksheets[viewedPerson] ?? whenNotDefined
      : whenNotDefined;
  }, [user.worksheet, user.friendWorksheets, viewedPerson]);

  const { seasons: seasonsData } = useFerry();
  const seasonCodes = useMemo(() => {
    const tempSeasonCodes: string[] = [];
    if (seasonsData && seasonsData.seasons) {
      seasonsData.seasons.forEach((season) => {
        tempSeasonCodes.push(season.season_code);
      });
    }
    tempSeasonCodes.sort();
    tempSeasonCodes.reverse();
    return tempSeasonCodes;
  }, [seasonsData]);

  // List to hold season dropdown options
  const seasonOptions = useMemo(() => {
    // Sort season codes from most to least recent
    seasonCodes.sort();
    seasonCodes.reverse();
    return seasonCodes.map((seasonCode) => ({
      value: seasonCode,
      label: toSeasonString(seasonCode),
    }));
  }, [seasonCodes]);

  // Current season
  const [curSeason, setCurSeason] = useSessionStorageState<Season>(
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
  const [colorMap, setColorMap] = useState<{ [key: number]: number[] }>({});
  useEffect(() => {
    setColorMap({});
  }, [curSeason]);

  // Courses data - basically a color-annotated version of the worksheet info.
  const [courses, setCourses] = useState<Listing[]>([]);

  // Initialize courses state and color map.
  useEffect(() => {
    if (!worksheetLoading && !worksheetError && curWorksheet && worksheetData) {
      const temp = [...worksheetData];
      // Assign color to each course
      for (let i = 0; i < worksheetData.length; i++) {
        let choice = colors[i % colors.length];
        if (colorMap[temp[i].crn]) choice = colorMap[temp[i].crn];
        else colorMap[temp[i].crn] = choice;

        temp[i].color = `rgba(${choice[0]}, ${choice[1]}, ${choice[2]}, 0.85)`;
        temp[i].border = `rgba(${choice[0]}, ${choice[1]}, ${choice[2]}, 1)`;
        temp[i].currentWorksheet = worksheetNumber;
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
    (crn: number) => {
      if (crn === -1) {
        setHiddenCourses((oldHiddenCourses) => {
          const newHiddenCourses = { ...oldHiddenCourses };
          if (!(curSeason in newHiddenCourses))
            newHiddenCourses[curSeason] = {};

          courses.forEach((listing) => {
            newHiddenCourses[curSeason][listing.crn] = true;
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
          if (!(curSeason in newHiddenCourses))
            newHiddenCourses[curSeason] = {};

          if (newHiddenCourses[curSeason][crn])
            delete newHiddenCourses[curSeason][crn];
          else newHiddenCourses[curSeason][crn] = true;
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
    (newPerson: string) => {
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
      seasonOptions,
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
      seasonOptions,
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
