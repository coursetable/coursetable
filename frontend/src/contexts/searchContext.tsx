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
import { GroupedOptionsType, OptionsType } from 'react-select/src/types';
import {
  useLocalStorageState,
  useSessionStorageState,
} from '../browserStorage';
import {
  Listing,
  useCourseData,
  useFerry,
} from '../components/Providers/FerryProvider';
import {
  areas,
  AreasType,
  searchSpeed,
  skills,
  SkillsType,
  SortByOption,
  sortbyOptions,
  SortKeys,
} from '../queries/Constants';
import {
  getDayTimes,
  getEnrolled,
  getNumFB,
  getOverallRatings,
  getWorkloadRatings,
  sortCourses,
  toRangeTime,
  toSeasonString,
} from '../utilities/courseUtilities';
import { useUser } from './userContext';

// Option type for all the filter options
export type Option = {
  label: string;
  value: string;
  color?: string;
  numeric?: boolean;
};

export const isOption = (x: any): x is Option => 'label' in x && 'value' in x;

export type SortOrderType = 'desc' | 'asc' | undefined;

export type OrderingType = {
  [key in SortKeys]?: SortOrderType;
};

// This is a type for weird TS errors
export type OptType =
  | OptionsType<Option>
  | GroupedOptionsType<Option>
  | undefined;

type Store = {
  canReset: boolean;
  searchText: string;
  select_subjects: Option[];
  select_skillsareas: Option[];
  overallBounds: number[];
  overallValueLabels: number[];
  workloadBounds: number[];
  workloadValueLabels: number[];
  select_seasons: Option[];
  select_days: Option[];
  timeBounds: string[];
  timeValueLabels: string[];
  enrollBounds: number[];
  enrollValueLabels: number[];
  numBounds: number[];
  numValueLabels: number[];
  select_schools: Option[];
  select_credits: Option[];
  hideCancelled: boolean;
  hideFirstYearSeminars: boolean;
  hideGraduateCourses: boolean;
  hideDiscussionSections: boolean;
  select_sortby: SortByOption;
  sort_order: SortOrderType;
  ordering: OrderingType;
  seasonsOptions: OptType;
  coursesLoading: boolean;
  searchData: Listing[];
  multiSeasons: boolean;
  isLoggedIn: boolean;
  num_fb: Record<string, string[]>;
  reset_key: number;
  duration: number;
  speed: string;
  course_modal: (string | boolean | Listing)[];
  setCanReset: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setSelectSubjects: React.Dispatch<React.SetStateAction<Option[]>>;
  setSelectSkillsAreas: React.Dispatch<React.SetStateAction<Option[]>>;
  setOverallBounds: React.Dispatch<React.SetStateAction<number[]>>;
  setOverallValueLabels: React.Dispatch<React.SetStateAction<number[]>>;
  setWorkloadBounds: React.Dispatch<React.SetStateAction<number[]>>;
  setWorkloadValueLabels: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectSeasons: React.Dispatch<React.SetStateAction<Option[]>>;
  setSelectDays: React.Dispatch<React.SetStateAction<Option[]>>;
  setTimeBounds: React.Dispatch<React.SetStateAction<string[]>>;
  setTimeValueLabels: React.Dispatch<React.SetStateAction<string[]>>;
  setEnrollBounds: React.Dispatch<React.SetStateAction<number[]>>;
  setEnrollValueLabels: React.Dispatch<React.SetStateAction<number[]>>;
  setNumBounds: React.Dispatch<React.SetStateAction<number[]>>;
  setNumValueLabels: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectSchools: React.Dispatch<React.SetStateAction<Option[]>>;
  setSelectCredits: React.Dispatch<React.SetStateAction<Option[]>>;
  setHideCancelled: React.Dispatch<React.SetStateAction<boolean>>;
  setHideFirstYearSeminars: React.Dispatch<React.SetStateAction<boolean>>;
  setHideGraduateCourses: React.Dispatch<React.SetStateAction<boolean>>;
  setHideDiscussionSections: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectSortby: React.Dispatch<React.SetStateAction<SortByOption>>;
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrderType>>;
  setOrdering: React.Dispatch<React.SetStateAction<OrderingType>>;
  handleResetFilters: () => void;
  setResetKey: React.Dispatch<React.SetStateAction<number>>;
  setStartTime: React.Dispatch<React.SetStateAction<number>>;
  showModal: (listing: Listing) => void;
  hideModal: () => void;
};

const SearchContext = createContext<Store | undefined>(undefined);
SearchContext.displayName = 'SearchContext';

// // Calculate upcoming season
// const dt = DateTime.now().setZone('America/New_York');
// let { year } = dt;
// let season: number;
// // Starting in October look at next year spring
// if (dt.month >= 10) {
//   season = 1;
//   year += 1;
//   // Starting in March look at this year fall
// } else if (dt.month >= 3) {
//   season = 3;
// } else {
//   season = 1;
// }
// UPDATE THIS MANUALLY
const def_season_code = '202203';

// Default filter and sorting values
const defaultOption: Option = { label: '', value: '' };
const defaultOptions: Option[] = [];
const defaultRatingBounds = [1, 5];
const defaultSeason: Option[] = [
  { value: def_season_code, label: toSeasonString(def_season_code)[0] },
];
const defaultTrue = true;
const defaultFalse = false;
const defaultSortOption: SortByOption = sortbyOptions[0];
const defaultTimeBounds = ['7:00', '22:00'];
const defaultEnrollBounds = [1, 528];
const defaultNumBounds = [0, 1000];
const defaultSortOrder: SortOrderType = 'asc';
const defaultOrdering: OrderingType = { course_code: 'asc' };

export const defaultFilters = {
  defaultOption,
  defaultOptions,
  defaultRatingBounds,
  defaultTimeBounds,
  defaultEnrollBounds,
  defaultNumBounds,
  defaultSeason,
  defaultTrue,
  defaultFalse,
  defaultSortOption,
  defaultSortOrder,
  defaultOrdering,
};

/**
 * Stores the user's search, filters, and sorts
 */
export const SearchProvider: React.FC = ({ children }) => {
  // Search on page render?
  const [defaultSearch, setDefaultSearch] = useState(true);

  /* Filtering */

  const [searchText, setSearchText] = useSessionStorageState('searchText', '');

  const [select_subjects, setSelectSubjects] = useSessionStorageState(
    'select_subjects',
    defaultOptions
  );

  const [select_skillsareas, setSelectSkillsAreas] = useSessionStorageState(
    'select_skillsareas',
    defaultOptions
  );

  const [overallBounds, setOverallBounds] = useSessionStorageState(
    'overallBounds',
    defaultRatingBounds
  );
  const [overallValueLabels, setOverallValueLabels] = useState(
    overallBounds !== defaultRatingBounds ? overallBounds : defaultRatingBounds
  );

  const [workloadBounds, setWorkloadBounds] = useSessionStorageState(
    'workloadBounds',
    defaultRatingBounds
  );
  const [workloadValueLabels, setWorkloadValueLabels] = useState(
    workloadBounds !== defaultRatingBounds
      ? workloadBounds
      : defaultRatingBounds
  );

  const [select_seasons, setSelectSeasons] = useSessionStorageState(
    'select_seasons',
    defaultSeason
  );

  const [select_days, setSelectDays] = useSessionStorageState(
    'select_days',
    defaultOptions
  );

  const [timeBounds, setTimeBounds] = useSessionStorageState(
    'timeBounds',
    defaultTimeBounds
  );
  const [timeValueLabels, setTimeValueLabels] = useState(
    timeBounds !== defaultTimeBounds ? timeBounds : defaultTimeBounds
  );

  const [enrollBounds, setEnrollBounds] = useSessionStorageState(
    'enrollBounds',
    defaultEnrollBounds
  );
  const [enrollValueLabels, setEnrollValueLabels] = useState(
    enrollBounds !== defaultEnrollBounds ? enrollBounds : defaultEnrollBounds
  );

  const [numBounds, setNumBounds] = useSessionStorageState(
    'numBounds',
    defaultNumBounds
  );
  const [numValueLabels, setNumValueLabels] = useState(
    numBounds !== defaultNumBounds ? numBounds : defaultNumBounds
  );

  const [select_schools, setSelectSchools] = useSessionStorageState(
    'select_schools',
    defaultOptions
  );

  const [select_credits, setSelectCredits] = useSessionStorageState(
    'select_credits',
    defaultOptions
  );

  const [hideCancelled, setHideCancelled] = useLocalStorageState(
    'hideCancelled',
    defaultTrue
  );

  const [hideFirstYearSeminars, setHideFirstYearSeminars] =
    useLocalStorageState('hideFirstYearSeminars', defaultFalse);

  const [hideGraduateCourses, setHideGraduateCourses] = useLocalStorageState(
    'hideGraduateCourses',
    defaultFalse
  );

  const [hideDiscussionSections, setHideDiscussionSections] =
    useLocalStorageState('hideDiscussionSections', defaultTrue);

  /* Sorting */

  // Sort option state
  const [select_sortby, setSelectSortby] = useSessionStorageState<SortByOption>(
    'select_sortby',
    defaultSortOption
  );

  // Sort order state
  const [sort_order, setSortOrder] = useSessionStorageState<SortOrderType>(
    'sort_order',
    defaultSortOrder
  );

  // Combination of sort option and sort order
  const [ordering, setOrdering] = useSessionStorageState(
    'ordering',
    defaultOrdering
  );

  /* Resetting */

  // State to determine if user can reset or not
  const [canReset, setCanReset] = useSessionStorageState('canReset', false);
  // State to cause components to reload when filters are reset
  const [reset_key, setResetKey] = useState(0);

  /* Search speed */

  const [start_time, setStartTime] = useState(Date.now());
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState('fast');

  // State that determines if a course modal needs to be displayed and which course to display
  const [course_modal, setCourseModal] = useState<
    (string | boolean | Listing)[]
  >([false, '']);

  // Fetch user context data
  const { user } = useUser();
  // Is the user logged in?
  const isLoggedIn = user.worksheet != null;

  // Object that holds a list of each fb friend taking a specific course
  const num_fb = useMemo(() => {
    if (!user.fbLogin || !user.fbWorksheets) return {};
    return getNumFB(user.fbWorksheets);
  }, [user.fbLogin, user.fbWorksheets]);

  // populate seasons from database
  let seasonsOptions: OptType;
  const { seasons: seasonsData } = useFerry();
  if (seasonsData && seasonsData.seasons) {
    seasonsOptions = seasonsData.seasons.map((x) => {
      const seasonOption: Option = {
        value: x.season_code,
        // capitalize term and add year
        label: `${x.term.charAt(0).toUpperCase() + x.term.slice(1)} ${x.year}`,
      };
      return seasonOption;
    });
  }

  const required_seasons = useMemo(() => {
    if (!isLoggedIn) {
      // If we're not logged in, don't attempt to request any seasons.
      return [];
    }
    if (select_seasons == null) {
      return [];
    }
    if (select_seasons.length === 0) {
      // Nothing selected, so default to all seasons.
      return seasonsData.seasons.map((x) => x.season_code).slice(0, 15);
    }
    return select_seasons.map((x) => x.value);
  }, [isLoggedIn, select_seasons, seasonsData]);

  const {
    loading: coursesLoading,
    courses: courseData,
    error: courseLoadError,
  } = useCourseData(required_seasons);

  // State used to determine whether or not to show season tags
  // (if multiple seasons are queried, the season is indicated)
  const multiSeasons = required_seasons.length !== 1;

  // Search configuration of filters
  const searchConfig = useMemo(() => {
    // skills and areas
    let processedSkillsAreas;
    let processedSkills;
    let processedAreas;
    if (select_skillsareas != null) {
      processedSkillsAreas = select_skillsareas.map((x) => {
        return x.value;
      });

      // match all languages
      if (processedSkillsAreas.includes('L')) {
        processedSkillsAreas = processedSkillsAreas.concat([
          'L1',
          'L2',
          'L3',
          'L4',
          'L5',
        ]);
      }

      // separate skills and areas
      processedSkills = processedSkillsAreas.filter((x: any): x is SkillsType =>
        skills.includes(x)
      );
      processedAreas = processedSkillsAreas.filter((x: any): x is AreasType =>
        areas.includes(x)
      );

      // set null defaults
      if (processedSkills.length === 0) {
        processedSkills = null;
      }
      if (processedAreas.length === 0) {
        processedAreas = null;
      }
    }

    // credits to filter
    let processedCredits;
    if (select_credits != null) {
      processedCredits = select_credits.map((x) => {
        return x.label;
      });
      // set null defaults
      if (processedCredits.length === 0) {
        processedCredits = null;
      }
    }

    // schools to filter
    let processedSchools;
    if (select_schools != null) {
      processedSchools = select_schools.map((x) => {
        return x.value;
      });

      // set null defaults
      if (processedSchools.length === 0) {
        processedSchools = null;
      }
    }

    // subjects to filter
    let processedSubjects;
    if (select_subjects != null) {
      processedSubjects = select_subjects.map((x) => {
        return x.value;
      });

      // set null defaults
      if (processedSubjects.length === 0) {
        processedSubjects = null;
      }
    }

    // days to filter
    let processedDays;
    if (select_days != null) {
      processedDays = select_days.map((x) => {
        return x.value;
      });

      // set null defaults
      if (processedDays.length === 0) {
        processedDays = null;
      }
    }

    // if the bounds are unaltered, we need to set them to null
    // to include unrated courses
    const include_all_overalls = _.isEqual(overallBounds, defaultRatingBounds);

    const include_all_workloads = _.isEqual(
      workloadBounds,
      defaultRatingBounds
    );

    const include_all_times = _.isEqual(timeBounds, defaultTimeBounds);

    const include_all_enrollments = _.isEqual(
      enrollBounds.map(Math.round),
      defaultEnrollBounds
    );

    const include_all_numbers = _.isEqual(numBounds, defaultNumBounds);

    // Variables to use in search query
    const search_variables = {
      search_text: searchText,
      // seasons: not included because it is handled by required_seasons
      areas: new Set(processedAreas),
      skills: new Set(processedSkills),
      credits: new Set(processedCredits),
      schools: new Set(processedSchools),
      subjects: new Set(processedSubjects),
      days: new Set(processedDays),
      min_overall: include_all_overalls ? null : overallBounds[0],
      max_overall: include_all_overalls ? null : overallBounds[1],
      min_workload: include_all_workloads ? null : workloadBounds[0],
      max_workload: include_all_workloads ? null : workloadBounds[1],
      min_time: include_all_times ? null : timeBounds[0],
      max_time: include_all_times ? null : timeBounds[1],
      min_enrollment: include_all_enrollments ? null : enrollBounds[0],
      max_enrollment: include_all_enrollments ? null : enrollBounds[1],
      min_number: include_all_numbers ? null : numBounds[0],
      max_number: include_all_numbers ? null : numBounds[1],
      extra_info: hideCancelled ? 'ACTIVE' : null,
      discussion_section: hideDiscussionSections ? 'ACTIVE' : null,
      fy_sem: hideFirstYearSeminars ? false : null,
      grad_level: hideGraduateCourses ? false : null,
    };

    // Track search
    posthog.capture('search', {
      ...search_variables,
      search_text_clean: search_variables.search_text || '[none]',
    });

    return search_variables;
  }, [
    hideCancelled,
    hideFirstYearSeminars,
    hideGraduateCourses,
    hideDiscussionSections,
    overallBounds,
    workloadBounds,
    timeBounds,
    enrollBounds,
    numBounds,
    select_credits,
    select_schools,
    select_skillsareas,
    select_subjects,
    select_days,
    searchText,
  ]);

  // Filtered and sorted courses
  const searchData = useMemo(() => {
    // Match search results with course data.
    if (coursesLoading || courseLoadError) return [];
    if (Object.keys(searchConfig).length === 0) return [];

    // Pre-processing for the search text.
    const tokens = (searchConfig.search_text || '')
      .split(/\s+/)
      .filter((x) => !!x)
      .map((token) => token.toLowerCase());

    const listings = required_seasons
      .map((season_code) => {
        if (!courseData[season_code]) return [];
        return [...courseData[season_code].values()];
      })
      .reduce((acc, cur) => acc.concat(cur), []);

    const filtered = listings.filter((listing) => {
      // Apply filters.
      const average_overall = Number(getOverallRatings(listing));
      if (
        searchConfig.min_overall !== null &&
        searchConfig.max_overall !== null &&
        (average_overall === null ||
          _.round(average_overall, 1) < searchConfig.min_overall ||
          _.round(average_overall, 1) > searchConfig.max_overall)
      ) {
        return false;
      }

      const average_workload = Number(getWorkloadRatings(listing));
      if (
        searchConfig.min_workload !== null &&
        searchConfig.max_workload !== null &&
        (average_workload === null ||
          _.round(average_workload, 1) < searchConfig.min_workload ||
          _.round(average_workload, 1) > searchConfig.max_workload)
      ) {
        return false;
      }

      if (searchConfig.min_time !== null && searchConfig.max_time !== null) {
        let include = false;
        const times = getDayTimes(listing);
        if (times) {
          times.forEach((time) => {
            if (
              searchConfig.min_time !== null &&
              searchConfig.max_time !== null &&
              time !== null &&
              toRangeTime(time.start) >= toRangeTime(searchConfig.min_time) &&
              toRangeTime(time.end) <= toRangeTime(searchConfig.max_time)
            ) {
              include = true;
            }
          });
        }
        if (!include) {
          return false;
        }
      }

      let enrollment = getEnrolled(listing);
      if (enrollment !== null) enrollment = Number(enrollment);
      if (
        searchConfig.min_enrollment !== null &&
        searchConfig.max_enrollment !== null &&
        (enrollment === null ||
          enrollment < Math.round(searchConfig.min_enrollment) ||
          enrollment > Math.round(searchConfig.max_enrollment))
      ) {
        return false;
      }

      const number = Number(listing.number.replace(/\D/g, ''));
      if (
        searchConfig.min_number !== null &&
        searchConfig.max_number !== null &&
        (number === null ||
          number < searchConfig.min_number ||
          (searchConfig.max_number < 1000 && number > searchConfig.max_number))
      ) {
        return false;
      }

      if (
        searchConfig.extra_info !== null &&
        searchConfig.extra_info !== listing.extra_info
      ) {
        return false;
      }

      if (
        searchConfig.discussion_section !== null &&
        listing.title === 'Discussion Section'
      ) {
        return false;
      }

      if (
        searchConfig.fy_sem !== null &&
        searchConfig.fy_sem !== listing.fysem
      ) {
        return false;
      }

      if (
        searchConfig.grad_level !== null &&
        (listing.number === null ||
          // tests if first character is between 5-9
          (listing.number.charAt(0) >= '5' &&
            listing.number.charAt(0) <= '9') ||
          // otherwise if first character is not a number (i.e. summer classes), tests whether second character between 5-9
          ((listing.number.charAt(0) < '0' || listing.number.charAt(0) > '9') &&
            (listing.number.length <= 1 ||
              (listing.number.charAt(1) >= '5' &&
                listing.number.charAt(1) <= '9'))))
      ) {
        return false;
      }

      if (
        searchConfig.subjects.size !== 0 &&
        !searchConfig.subjects.has(listing.subject)
      ) {
        return false;
      }

      const days = new Set(getDayTimes(listing)?.map((daytime) => daytime.day));
      if (searchConfig.days.size !== 0) {
        let include = true;
        if (days && days !== null) {
          days.forEach((day) => {
            if (!searchConfig.days.has(day)) {
              include = false;
            }
          });
          searchConfig.days.forEach((day) => {
            if (!days.has(day)) {
              include = false;
            }
          });
        } else {
          include = false;
        }
        if (!include) {
          return false;
        }
      }

      if (
        (searchConfig.areas.size !== 0 || searchConfig.skills.size !== 0) &&
        !listing.areas.some((v: any): v is AreasType =>
          searchConfig.areas.has(v)
        ) &&
        !listing.skills.some((v: any): v is SkillsType =>
          searchConfig.skills.has(v)
        )
      ) {
        return false;
      }

      if (
        searchConfig.credits.size !== 0 &&
        listing.credits !== null &&
        !searchConfig.credits.has(String(listing.credits))
      ) {
        return false;
      }

      if (
        searchConfig.schools.size !== 0 &&
        listing.school !== null &&
        !searchConfig.schools.has(listing.school)
      ) {
        return false;
      }

      // Handle search text. Each token must match something.
      for (const token of tokens) {
        // first character of the course number
        const numberFirstChar = listing.number.charAt(0);
        if (
          listing.subject.toLowerCase().startsWith(token) ||
          listing.number.toLowerCase().startsWith(token) ||
          // for course numbers that start with a letter
          // (checked by if .toLowerCase() is not equal to .toUpperCase(), see https://stackoverflow.com/a/32567789/5540324),
          // exclude this letter when comparing with the search token
          (numberFirstChar.toLowerCase() !== numberFirstChar.toUpperCase() &&
            listing.number
              .toLowerCase()
              .startsWith(numberFirstChar.toLowerCase() + token)) ||
          listing.title.toLowerCase().includes(token) ||
          listing.professor_names.some((professor) =>
            professor.toLowerCase().includes(token)
          )
        )
          continue;

        return false;
      }

      return true;
    });

    // Apply sorting order.
    return sortCourses(filtered, ordering, num_fb);
  }, [
    required_seasons,
    coursesLoading,
    courseLoadError,
    courseData,
    searchConfig,
    ordering,
    num_fb,
  ]);

  // For resetting all filters and sorts
  const handleResetFilters = useCallback(() => {
    setSearchText('');
    setHideCancelled(true);
    setHideFirstYearSeminars(false);
    setHideGraduateCourses(false);
    setHideDiscussionSections(true);
    setOverallBounds(defaultRatingBounds);
    setOverallValueLabels(defaultRatingBounds);
    setWorkloadBounds(defaultRatingBounds);
    setWorkloadValueLabels(defaultRatingBounds);
    setTimeBounds(defaultTimeBounds);
    setTimeValueLabels(defaultTimeBounds);
    setEnrollBounds(defaultEnrollBounds);
    setEnrollValueLabels(defaultEnrollBounds);
    setNumBounds(defaultNumBounds);
    setNumValueLabels(defaultNumBounds);
    setSelectSeasons(defaultSeason);
    setSelectSkillsAreas(defaultOptions);
    setSelectDays(defaultOptions);
    setSelectCredits(defaultOptions);
    setSelectSchools(defaultOptions);
    setSelectSubjects(defaultOptions);

    setSelectSortby(defaultSortOption);
    setSortOrder(defaultSortOrder);
    setOrdering(defaultOrdering);

    setResetKey(reset_key + 1);

    setCanReset(false);
    setStartTime(Date.now());
  }, [
    reset_key,
    setSearchText,
    setSelectSubjects,
    setSelectSkillsAreas,
    setOverallBounds,
    setWorkloadBounds,
    setSelectSeasons,
    setTimeBounds,
    setEnrollBounds,
    setNumBounds,
    setSelectSchools,
    setSelectDays,
    setSelectCredits,
    setHideCancelled,
    setHideFirstYearSeminars,
    setHideGraduateCourses,
    setHideDiscussionSections,
    setSelectSortby,
    setSortOrder,
    setOrdering,
    setCanReset,
  ]);

  // Show the modal for the course that was clicked
  const showModal = useCallback(
    (listing: Listing) => {
      posthog.capture('course-modal-open', {
        season_code: listing.season_code,
        course_code: listing.course_code,
        crn: listing.crn,
      });

      setCourseModal([true, listing]);
    },
    [setCourseModal]
  );

  // Reset course_modal state to hide the modal
  const hideModal = useCallback(() => {
    setCourseModal([false, '']);
  }, [setCourseModal]);

  // perform default search on load
  useEffect(() => {
    // only execute after seasons have been loaded
    if (defaultSearch && seasonsOptions) {
      setDefaultSearch(false);
    }
  }, [seasonsOptions, defaultSearch]);

  // Set ordering in parent element whenever sortby or order changes
  useEffect(() => {
    const sortParams = select_sortby.value;
    const newOrdering: {
      [key in SortKeys]?: SortOrderType;
    } = {
      [sortParams]: sort_order,
    };
    setOrdering(newOrdering);
  }, [select_sortby, sort_order, setOrdering]);

  // Check if can or can't reset
  useEffect(() => {
    if (
      !_.isEqual(searchText, '') ||
      !_.isEqual(select_subjects, defaultOptions) ||
      !_.isEqual(select_skillsareas, defaultOptions) ||
      !_.isEqual(overallBounds, defaultRatingBounds) ||
      !_.isEqual(workloadBounds, defaultRatingBounds) ||
      !_.isEqual(select_seasons, defaultSeason) ||
      !_.isEqual(select_days, defaultOptions) ||
      !_.isEqual(timeBounds, defaultTimeBounds) ||
      !_.isEqual(enrollBounds, defaultEnrollBounds) ||
      !_.isEqual(numBounds, defaultNumBounds) ||
      !_.isEqual(select_schools, defaultOptions) ||
      !_.isEqual(select_credits, defaultOptions) ||
      !_.isEqual(hideCancelled, defaultTrue) ||
      !_.isEqual(hideFirstYearSeminars, defaultFalse) ||
      !_.isEqual(hideGraduateCourses, defaultFalse) ||
      !_.isEqual(hideDiscussionSections, defaultTrue) ||
      !_.isEqual(ordering, defaultOrdering)
    ) {
      setCanReset(true);
    } else {
      setCanReset(false);
    }
    // Calculate & determine search speed
    if (!coursesLoading && searchData) {
      const durInSecs = Math.abs(Date.now() - start_time) / 1000;
      setDuration(durInSecs);
      const sp = _.sample(
        searchSpeed[
          durInSecs > 1 ? 'fast' : durInSecs > 0.5 ? 'faster' : 'fastest'
        ]
      );
      if (sp) {
        setSpeed(sp);
      }
    }
  }, [
    searchText,
    select_subjects,
    select_skillsareas,
    overallBounds,
    workloadBounds,
    timeBounds,
    enrollBounds,
    numBounds,
    select_seasons,
    select_days,
    select_schools,
    select_credits,
    hideCancelled,
    hideFirstYearSeminars,
    hideGraduateCourses,
    hideDiscussionSections,
    ordering,
    coursesLoading,
    searchData,
    start_time,
    setCanReset,
  ]);

  // Store object returned in context provider
  const store = useMemo(
    () => ({
      // Context state.
      canReset,
      searchText,
      select_subjects,
      select_skillsareas,
      overallBounds,
      overallValueLabels,
      workloadBounds,
      workloadValueLabels,
      select_seasons,
      select_days,
      timeBounds,
      timeValueLabels,
      enrollBounds,
      enrollValueLabels,
      numBounds,
      numValueLabels,
      select_schools,
      select_credits,
      hideCancelled,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      select_sortby,
      sort_order,
      ordering,
      seasonsOptions,
      coursesLoading,
      searchData,
      multiSeasons,
      isLoggedIn,
      num_fb,
      reset_key,
      duration,
      speed,
      course_modal,

      // Update methods.
      setCanReset,
      setSearchText,
      setSelectSubjects,
      setSelectSkillsAreas,
      setOverallBounds,
      setOverallValueLabels,
      setWorkloadBounds,
      setWorkloadValueLabels,
      setSelectSeasons,
      setSelectDays,
      setTimeBounds,
      setTimeValueLabels,
      setEnrollBounds,
      setEnrollValueLabels,
      setNumBounds,
      setNumValueLabels,
      setSelectSchools,
      setSelectCredits,
      setHideCancelled,
      setHideFirstYearSeminars,
      setHideGraduateCourses,
      setHideDiscussionSections,
      setSelectSortby,
      setSortOrder,
      setOrdering,
      handleResetFilters,
      setResetKey,
      setStartTime,
      showModal,
      hideModal,
    }),
    [
      canReset,
      searchText,
      select_subjects,
      select_skillsareas,
      overallBounds,
      overallValueLabels,
      workloadBounds,
      workloadValueLabels,
      select_seasons,
      select_days,
      timeBounds,
      timeValueLabels,
      enrollBounds,
      enrollValueLabels,
      numBounds,
      numValueLabels,
      select_schools,
      select_credits,
      hideCancelled,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      select_sortby,
      sort_order,
      ordering,
      seasonsOptions,
      coursesLoading,
      searchData,
      multiSeasons,
      isLoggedIn,
      num_fb,
      reset_key,
      duration,
      speed,
      course_modal,
      setCanReset,
      setSearchText,
      setSelectSubjects,
      setSelectSkillsAreas,
      setOverallBounds,
      setOverallValueLabels,
      setWorkloadBounds,
      setWorkloadValueLabels,
      setSelectSeasons,
      setSelectDays,
      setTimeBounds,
      setTimeValueLabels,
      setEnrollBounds,
      setEnrollValueLabels,
      setNumBounds,
      setNumValueLabels,
      setSelectSchools,
      setSelectCredits,
      setHideCancelled,
      setHideFirstYearSeminars,
      setHideGraduateCourses,
      setHideDiscussionSections,
      setSelectSortby,
      setSortOrder,
      setOrdering,
      handleResetFilters,
      setResetKey,
      setStartTime,
      showModal,
      hideModal,
    ]
  );

  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext)!;
