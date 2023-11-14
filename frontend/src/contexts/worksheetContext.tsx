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
  season_codes: string[];
  season_options: OptType;
  cur_worksheet: Worksheet;
  cur_season: Season;
  worksheet_number: string;
  person: string;
  courses: Listing[];
  hidden_courses: HiddenCourses;
  hover_course: number | null;
  worksheet_view: WorksheetView;
  worksheetLoading: boolean;
  worksheetError: string | null;
  worksheetData: Listing[];
  course_modal: (string | boolean | Listing)[];
  changeSeason: (season_code: Season | null) => void;
  changeWorksheet: (worksheet_number: string) => void;
  handlePersonChange: (new_person: string) => void;
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
  const [person, setFbPerson] = useSessionStorageState('person', 'me');

  // Determines when to show course modal and for what listing
  const [course_modal, setCourseModal] = useState<
    (string | boolean | Listing)[]
  >([false, '']);
  // List of courses that the user has marked hidden
  const [hidden_courses, setHiddenCourses] =
    useLocalStorageState<HiddenCourses>('hidden_courses', {});
  // The current listing that the user is hovering over
  const [hover_course, setHoverCourse] = useState<number | null>(null);
  // Currently expanded component (calendar or list or none)
  const [worksheet_view, setWorksheetView] =
    useSessionStorageState<WorksheetView>('worksheet_view', {
      view: 'calendar',
      mode: '',
    });

  /* Processing */

  // Worksheet of the current person
  const cur_worksheet = useMemo(() => {
    /** @type typeof user.worksheet! */
    const when_not_defined: Worksheet = []; // TODO: change this to undefined

    if (person === 'me') {
      return user.worksheet ?? when_not_defined;
    }

    const friend_worksheets = user.friendWorksheets?.worksheets;
    return friend_worksheets
      ? friend_worksheets[person] ?? when_not_defined
      : when_not_defined;
  }, [user.worksheet, user.friendWorksheets, person]);

  const { seasons: seasonsData } = useFerry();
  const season_codes = useMemo(() => {
    const season_codes_temp: string[] = [];
    if (seasonsData && seasonsData.seasons) {
      seasonsData.seasons.forEach((season) => {
        season_codes_temp.push(season.season_code);
      });
    }
    season_codes_temp.sort();
    season_codes_temp.reverse();
    return season_codes_temp;
  }, [seasonsData]);

  // List to hold season dropdown options
  const season_options = useMemo(() => {
    const season_options_temp: Option[] = [];
    // Sort season codes from most to least recent
    season_codes.sort();
    season_codes.reverse();
    // Iterate over seasons and populate season_options list
    season_codes.forEach((season_code) => {
      season_options_temp.push({
        value: season_code,
        label: toSeasonString(season_code)[0],
      });
    });
    return season_options_temp;
  }, [season_codes]);

  // Current season
  const [cur_season, setCurSeason] = useSessionStorageState<Season>(
    'cur_season',
    defaultFilters.defaultSeason[0].value,
  );

  // Current worksheet number
  const [worksheet_number, setWorksheetNumber] = useSessionStorageState(
    'worksheet_number',
    '0',
  );

  // Fetch the worksheet info. This is eventually copied into the 'courses' variable.
  const {
    loading: worksheetLoading,
    error: worksheetError,
    data: worksheetData,
  } = useWorksheetInfo(cur_worksheet, cur_season, worksheet_number);
  // Cache calendar colors. Reset whenever the season changes.
  const [colorMap, setColorMap] = useState<Record<number, number[]>>({});
  useEffect(() => {
    setColorMap({});
  }, [cur_season]);

  // Courses data - basically a color-annotated version of the worksheet info.
  const [courses, setCourses] = useState<Listing[]>([]);

  // Initialize courses state and color map.
  useEffect(() => {
    if (
      !worksheetLoading &&
      !worksheetError &&
      cur_worksheet &&
      worksheetData
    ) {
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
        temp[i].current_worksheet = worksheet_number;
      }
      // Sort list by course code
      temp.sort((a, b) => a.course_code.localeCompare(b.course_code, 'en-US'));
      setCourses(temp);
    }
  }, [
    worksheetLoading,
    worksheetError,
    cur_worksheet,
    worksheet_number,
    worksheetData,
    setCourses,
    colorMap,
  ]);

  /* Functions */

  // Hide/Show this course
  const toggleCourse = useCallback(
    (crn: number) => {
      if (crn === -1) {
        setHiddenCourses((old_hidden_courses: HiddenCourses) => {
          const new_hidden_courses = { ...old_hidden_courses };
          if (
            !Object.prototype.hasOwnProperty.call(
              new_hidden_courses,
              cur_season,
            )
          ) {
            new_hidden_courses[cur_season] = {};
          }
          courses.forEach((listing) => {
            new_hidden_courses[cur_season][listing.crn] = true;
          });
          return new_hidden_courses;
        });
      } else if (crn === -2) {
        setHiddenCourses((old_hidden_courses: HiddenCourses) => {
          const new_hidden_courses = { ...old_hidden_courses };
          new_hidden_courses[cur_season] = {};
          return new_hidden_courses;
        });
      } else {
        setHiddenCourses((old_hidden_courses: HiddenCourses) => {
          const new_hidden_courses = { ...old_hidden_courses };
          if (
            !Object.prototype.hasOwnProperty.call(
              new_hidden_courses,
              cur_season,
            )
          ) {
            new_hidden_courses[cur_season] = {};
          }
          if (new_hidden_courses[cur_season][crn])
            delete new_hidden_courses[cur_season][crn];
          else new_hidden_courses[cur_season][crn] = true;
          return new_hidden_courses;
        });
      }
    },
    [setHiddenCourses, courses, cur_season],
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
      season_codes,
      season_options,
      cur_worksheet,
      cur_season,
      worksheet_number,
      person,
      courses,
      hidden_courses,
      hover_course,
      worksheet_view,
      worksheetLoading,
      worksheetError,
      worksheetData,
      course_modal,

      // Update methods.
      changeSeason,
      handlePersonChange,
      setHoverCourse,
      handleWorksheetView,
      toggleCourse,
      showModal,
      hideModal,
      changeWorksheet,
    }),
    [
      season_codes,
      season_options,
      cur_worksheet,
      cur_season,
      worksheet_number,
      person,
      courses,
      hidden_courses,
      hover_course,
      worksheet_view,
      worksheetLoading,
      worksheetError,
      worksheetData,
      course_modal,
      changeSeason,
      handlePersonChange,
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
