import _ from 'lodash';
import posthog from 'posthog-js';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSessionStorageState } from './browserStorage';
import { Listing } from './components/FerryProvider';
import { toSeasonString } from './courseUtilities';
// import { sortbyOptions } from './queries/Constants';
import { useWorksheetInfo } from './queries/GetWorksheetListings';
import { useUser, Worksheet } from './user';
import { Season } from './common';
import { OptType, Option } from './searchContext';

export type HiddenCourses = Record<number, boolean>;

type Store = {
  season_codes: string[];
  season_options: OptType;
  cur_worksheet: Worksheet;
  cur_season: Season;
  fb_person: string;
  courses: Listing[];
  hidden_courses: HiddenCourses;
  hover_course: number | null;
  cur_expand: string;
  worksheetLoading: boolean;
  worksheetError: string | null;
  worksheetData: Listing[];
  course_modal: (string | boolean | Listing)[];
  changeSeason: (season_code: Season) => void;
  handleFBPersonChange: (new_person: string) => void;
  setHoverCourse: React.Dispatch<React.SetStateAction<number | null>>;
  handleCurExpand: (view: string) => void;
  toggleCourse: (crn: number) => void;
  setCourseModal: React.Dispatch<
    React.SetStateAction<(string | boolean | Listing)[]>
  >;
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
export const WorksheetProvider: React.FC = ({ children }) => {
  // Fetch user context data
  const { user } = useUser();
  // Current user who's worksheet we are viewing
  const [fb_person, setFbPerson] = useSessionStorageState('fb_person', 'me');

  // Determines when to show course modal and for what listing
  const [course_modal, setCourseModal] = useState<
    (string | boolean | Listing)[]
  >([false, '']);
  // List of courses that the user has marked hidden
  const [
    hidden_courses,
    setHiddenCourses,
  ] = useSessionStorageState<HiddenCourses>('hidden_courses', {});
  // The current listing that the user is hovering over
  const [hover_course, setHoverCourse] = useState<number | null>(null);
  // Currently expanded component (calendar or list or none)
  const [cur_expand, setCurExpand] = useSessionStorageState(
    'cur_expand',
    'none'
  );

  /* Processing */

  // populate seasons from database
  // let season_options: OptType;
  // const { seasons: seasonsData } = useFerry();
  // if (seasonsData && seasonsData.seasons) {
  //   season_options = seasonsData.seasons.map((x) => {
  //     const seasonOption: Option = {
  //       value: x.season_code,
  //       // capitalize term and add year
  //       label: `${x.term.charAt(0).toUpperCase() + x.term.slice(1)} ${x.year}`,
  //     };
  //     return seasonOption;
  //   });
  // }

  // Worksheet of the current person
  const cur_worksheet = useMemo(() => {
    /** @type typeof user.worksheet! */
    const when_not_defined: Worksheet = []; // TODO: change this to undefined
    if (fb_person === 'me') {
      return user.worksheet ?? when_not_defined;
    }
    const friend_worksheets = user.fbWorksheets?.worksheets;
    return friend_worksheets
      ? friend_worksheets[fb_person] ?? when_not_defined
      : when_not_defined;
  }, [user.worksheet, user.fbWorksheets, fb_person]);

  const season_codes = useMemo(() => {
    const season_codes_temp: string[] = [];
    if (cur_worksheet) {
      cur_worksheet.forEach((szn) => {
        if (season_codes_temp.indexOf(szn[0]) === -1)
          season_codes_temp.push(szn[0]);
      });
    }
    season_codes_temp.sort();
    season_codes_temp.reverse();
    return season_codes_temp;
  }, [cur_worksheet]);

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

  // Current season initialized to most recent season
  const [cur_season, setCurSeason] = useSessionStorageState<Season>(
    'cur_season',
    season_codes.length > 0 ? season_codes[0] : ''
  );

  // Fetch the worksheet info. This is eventually copied into the 'courses' variable.
  const {
    loading: worksheetLoading,
    error: worksheetError,
    data: worksheetData,
  } = useWorksheetInfo(cur_worksheet, cur_season);

  // Cache calendar colors. Reset whenever the season changes.
  const [colorMap, setColorMap] = useState<Record<number, number[]>>({});
  useEffect(() => {
    setColorMap({});
  }, [cur_season]);

  // Courses data - basically a color-annotated version of the worksheet info.
  const [courses, setCourses] = useState<Listing[]>([]);

  // Function to sort worksheet courses by course code
  const sortByCourseCode = useCallback((a, b) => {
    if (a.course_code < b.course_code) return -1;
    return 1;
  }, []);

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
      }
      // Sort list by course code
      temp.sort(sortByCourseCode);
      setCourses(temp);
    }
  }, [
    worksheetLoading,
    worksheetError,
    cur_worksheet,
    worksheetData,
    setCourses,
    colorMap,
    sortByCourseCode,
  ]);

  /* Functions */

  // Hide/Show this course
  const toggleCourse = useCallback(
    (crn: number) => {
      if (crn === -1) {
        const new_hidden_courses: HiddenCourses = {};
        courses.forEach((listing) => {
          new_hidden_courses[listing.crn] = true;
        });
        setHiddenCourses(new_hidden_courses);
      } else if (crn === -2) {
        setHiddenCourses({});
      } else {
        setHiddenCourses((old_hidden_courses: HiddenCourses) => {
          const new_hidden_courses = { ...old_hidden_courses };
          if (old_hidden_courses[crn]) delete new_hidden_courses[crn];
          else new_hidden_courses[crn] = true;
          return new_hidden_courses;
        });
      }
    },
    [setHiddenCourses, courses]
  );

  const handleCurExpand = useCallback(
    (view: string) => {
      setCurExpand(view);
      // Scroll back to top when changing views
      window.scrollTo({ top: 0, left: 0 });
    },
    [setCurExpand]
  );

  const handleFBPersonChange = useCallback(
    (new_person: string) => {
      setFbPerson(new_person);
    },
    [setFbPerson]
  );

  // Function to change season
  const changeSeason = useCallback(
    (season_code: Season) => {
      posthog.capture('worksheet-season', { new_season: season_code });
      setCurSeason(season_code);
    },
    [setCurSeason]
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
      fb_person,
      courses,
      hidden_courses,
      hover_course,
      cur_expand,
      worksheetLoading,
      worksheetError,
      worksheetData,
      course_modal,

      // Update methods.
      changeSeason,
      handleFBPersonChange,
      setHoverCourse,
      handleCurExpand,
      toggleCourse,
      setCourseModal,
      showModal,
      hideModal,
    }),
    [
      season_codes,
      season_options,
      cur_worksheet,
      cur_season,
      fb_person,
      courses,
      hidden_courses,
      hover_course,
      cur_expand,
      worksheetLoading,
      worksheetError,
      worksheetData,
      course_modal,
      changeSeason,
      handleFBPersonChange,
      setHoverCourse,
      handleCurExpand,
      toggleCourse,
      setCourseModal,
      showModal,
      hideModal,
    ]
  );

  return (
    <WorksheetContext.Provider value={store}>
      {children}
    </WorksheetContext.Provider>
  );
};

export const useWorksheet = () => useContext(WorksheetContext)!;
