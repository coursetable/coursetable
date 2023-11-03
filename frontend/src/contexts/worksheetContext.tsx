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
} from '../browserStorage';
import { Listing, useFerry } from '../components/Providers/FerryProvider';
import { toSeasonString } from '../utilities/courseUtilities';
// import { sortbyOptions } from './queries/Constants';
import { useWorksheetInfo } from '../queries/GetWorksheetListings';
import { useUser, Worksheet } from './userContext';
import { Season } from '../utilities/common';
import { OptType, Option, defaultFilters } from './searchContext';

export type HiddenCourses = Record<Season, Record<number, boolean>>;
export type WorksheetView = Record<string, string>;

type Store = {
  seasonCodes: string[];
  seasonOptions: OptType;
  cur_worksheet: Worksheet;
  curSeason: Season;
  worksheetNumber: string;
  fbPerson: string;
  courses: Listing[];
  hiddenCourses: HiddenCourses;
  hoverCourse: number | null;
  worksheetView: WorksheetView;
  worksheetLoading: boolean;
  worksheetError: string | null;
  worksheetData: Listing[];
  courseModal: (string | boolean | Listing)[];
  changeSeason: (season_code: Season | null) => void;
  changeWorksheet: (worksheetNumber: string) => void;
  handleFBPersonChange: (new_person: string) => void;
  setHoverCourse: React.Dispatch<React.SetStateAction<number | null>>;
  handleWorksheetView: (view: WorksheetView) => void;
  toggleCourse: (crn: number) => void;
  showModal: (listing: Listing) => void;
  hideModal: () => void;
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
export function WorksheetProvider({ children }: { children: React.ReactNode }) {
  // Fetch user context data
  const { user } = useUser();
  // Current user who's worksheet we are viewing
  const [fbPerson, setFbPerson] = useSessionStorageState('fbPerson', 'me');

  // Determines when to show course modal and for what listing
  const [courseModal, setCourseModal] = useState<
    (string | boolean | Listing)[]
  >([false, '']);
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
    /** @type typeof user.worksheet! */
    const whenNotDefined: Worksheet = []; // TODO: change this to undefined
    if (fbPerson === 'me') {
      return user.worksheet ?? whenNotDefined;
    }
    const friendWorksheets = user.fbWorksheets?.worksheets;
    return friendWorksheets
      ? friendWorksheets[fbPerson] ?? whenNotDefined
      : whenNotDefined;
  }, [user.worksheet, user.fbWorksheets, fbPerson]);

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
    const tempSeasonOptions: Option[] = [];
    // Sort season codes from most to least recent
    seasonCodes.sort();
    seasonCodes.reverse();
    // Iterate over seasons and populate seasonOptions list
    seasonCodes.forEach((season_code) => {
      tempSeasonOptions.push({
        value: season_code,
        label: toSeasonString(season_code)[0],
      });
    });
    return tempSeasonOptions;
  }, [seasonCodes]);

  // Current season
  const [curSeason, setCurSeason] = useSessionStorageState<Season>(
    'curSeason',
    defaultFilters.defaultSeason[0].value,
  );

  // Current worksheet number
  const [worksheetNumber, setWorksheetNumber] = useSessionStorageState(
    'worksheetNumber',
    '0',
  );

  // Fetch the worksheet info. This is eventually copied into the 'courses' variable.
  const {
    loading: worksheetLoading,
    error: worksheetError,
    data: worksheetData,
  } = useWorksheetInfo(curWorksheet, curSeason, worksheetNumber);

  // Cache calendar colors. Reset whenever the season changes.
  const [colorMap, setColorMap] = useState<Record<number, number[]>>({});
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
        if (colorMap[temp[i].crn]) {
          choice = colorMap[temp[i].crn];
        } else {
          colorMap[temp[i].crn] = choice;
        }
        temp[i].color = `rgba(${choice[0]}, ${choice[1]}, ${choice[2]}, 0.85)`;
        temp[i].border = `rgba(${choice[0]}, ${choice[1]}, ${choice[2]}, 1)`;
        temp[i].current_worksheet = worksheetNumber;
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
        setHiddenCourses((old_hiddenCourses: HiddenCourses) => {
          const newHiddenCourses = { ...old_hiddenCourses };
          if (
            !Object.prototype.hasOwnProperty.call(newHiddenCourses, curSeason)
          ) {
            newHiddenCourses[curSeason] = {};
          }
          courses.forEach((listing) => {
            newHiddenCourses[curSeason][listing.crn] = true;
          });
          return newHiddenCourses;
        });
      } else if (crn === -2) {
        setHiddenCourses((old_hiddenCourses: HiddenCourses) => {
          const newHiddenCourses = { ...old_hiddenCourses };
          newHiddenCourses[curSeason] = {};
          return newHiddenCourses;
        });
      } else {
        setHiddenCourses((old_hiddenCourses: HiddenCourses) => {
          const newHiddenCourses = { ...old_hiddenCourses };
          if (
            !Object.prototype.hasOwnProperty.call(newHiddenCourses, curSeason)
          ) {
            newHiddenCourses[curSeason] = {};
          }
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

  const handleFBPersonChange = useCallback(
    (new_person: string) => {
      setFbPerson(new_person);
    },
    [setFbPerson],
  );

  // Function to change season
  const changeSeason = useCallback(
    (season_code: Season | null) => {
      if (season_code === null) return;
      setCurSeason(season_code);
    },
    [setCurSeason],
  );

  // Function to change worksheet number
  const changeWorksheet = useCallback(
    (new_number: string) => {
      setWorksheetNumber(new_number);
    },
    [setWorksheetNumber],
  );

  // Show course modal for the chosen listing
  const showModal = useCallback((listing: Listing) => {
    setCourseModal([true, listing]);
  }, []);

  // Hide course modal
  const hideModal = useCallback(() => {
    setCourseModal([false, '']);
  }, []);

  // Store object returned in context provider
  const store = useMemo(
    () => ({
      // Context state.
      seasonCodes,
      seasonOptions,
      cur_worksheet: curWorksheet,
      curSeason,
      worksheetNumber,
      fbPerson,
      courses,
      hiddenCourses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetData,
      courseModal,

      // Update methods.
      changeSeason,
      handleFBPersonChange,
      setHoverCourse,
      handleWorksheetView,
      toggleCourse,
      showModal,
      hideModal,
      changeWorksheet,
    }),
    [
      seasonCodes,
      seasonOptions,
      curWorksheet,
      curSeason,
      worksheetNumber,
      fbPerson,
      courses,
      hiddenCourses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetData,
      courseModal,
      changeSeason,
      handleFBPersonChange,
      setHoverCourse,
      handleWorksheetView,
      toggleCourse,
      showModal,
      hideModal,
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
