import _ from 'lodash';
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

export const isOption = (x: unknown): x is Option =>
  !!x && typeof x === 'object' && 'label' in x && 'value' in x;

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
  selectSubjects: Option[];
  selectSkillsAreas: Option[];
  overallBounds: number[];
  overallValueLabels: number[];
  workloadBounds: number[];
  workloadValueLabels: number[];
  selectSeasons: Option[];
  selectDays: Option[];
  timeBounds: string[];
  timeValueLabels: string[];
  enrollBounds: number[];
  enrollValueLabels: number[];
  numBounds: number[];
  numValueLabels: number[];
  selectSchools: Option[];
  selectCredits: Option[];
  searchDescription: boolean;
  hideCancelled: boolean;
  hideFirstYearSeminars: boolean;
  hideGraduateCourses: boolean;
  hideDiscussionSections: boolean;
  selectSortBy: SortByOption;
  sortOrder: SortOrderType;
  ordering: OrderingType;
  seasonsOptions: OptType;
  coursesLoading: boolean;
  searchData: Listing[];
  multiSeasons: boolean;
  isLoggedIn: boolean;
  numFb: Record<string, string[]>;
  resetKey: number;
  duration: number;
  speed: string;
  courseModal: (string | boolean | Listing)[];
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
  setSearchDescription: React.Dispatch<React.SetStateAction<boolean>>;
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
const defSeasonCode = '202401';

// Default filter and sorting values
const defaultOption: Option = { label: '', value: '' };
const defaultOptions: Option[] = [];
const defaultRatingBounds = [1, 5];
const defaultSeason: Option[] = [
  { value: defSeasonCode, label: toSeasonString(defSeasonCode)[0] },
];
const defaultWorksheet: Option[] = [{ value: '0', label: 'Main Worksheet' }];
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
  defaultWorksheet,
  defaultTrue,
  defaultFalse,
  defaultSortOption,
  defaultSortOrder,
  defaultOrdering,
};

/**
 * Stores the user's search, filters, and sorts
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  // Search on page render?
  const [defaultSearch, setDefaultSearch] = useState(true);

  /* Filtering */

  const [searchText, setSearchText] = useSessionStorageState('searchText', '');

  const [selectSubjects, setSelectSubjects] = useSessionStorageState(
    'selectSubjects',
    defaultOptions,
  );

  const [selectSkillsAreas, setSelectSkillsAreas] = useSessionStorageState(
    'selectSkillsAreas',
    defaultOptions,
  );

  const [overallBounds, setOverallBounds] = useSessionStorageState(
    'overallBounds',
    defaultRatingBounds,
  );
  const [overallValueLabels, setOverallValueLabels] = useState(
    overallBounds !== defaultRatingBounds ? overallBounds : defaultRatingBounds,
  );

  const [workloadBounds, setWorkloadBounds] = useSessionStorageState(
    'workloadBounds',
    defaultRatingBounds,
  );
  const [workloadValueLabels, setWorkloadValueLabels] = useState(
    workloadBounds !== defaultRatingBounds
      ? workloadBounds
      : defaultRatingBounds,
  );

  const [selectSeasons, setSelectSeasons] = useSessionStorageState(
    'selectSeasons',
    defaultSeason,
  );

  const [selectDays, setSelectDays] = useSessionStorageState(
    'selectDays',
    defaultOptions,
  );

  const [timeBounds, setTimeBounds] = useSessionStorageState(
    'timeBounds',
    defaultTimeBounds,
  );
  const [timeValueLabels, setTimeValueLabels] = useState(
    timeBounds !== defaultTimeBounds ? timeBounds : defaultTimeBounds,
  );

  const [enrollBounds, setEnrollBounds] = useSessionStorageState(
    'enrollBounds',
    defaultEnrollBounds,
  );
  const [enrollValueLabels, setEnrollValueLabels] = useState(
    enrollBounds !== defaultEnrollBounds ? enrollBounds : defaultEnrollBounds,
  );

  const [numBounds, setNumBounds] = useSessionStorageState(
    'numBounds',
    defaultNumBounds,
  );
  const [numValueLabels, setNumValueLabels] = useState(
    numBounds !== defaultNumBounds ? numBounds : defaultNumBounds,
  );

  const [selectSchools, setSelectSchools] = useSessionStorageState(
    'selectSchools',
    defaultOptions,
  );

  const [selectCredits, setSelectCredits] = useSessionStorageState(
    'selectCredits',
    defaultOptions,
  );

  const [searchDescription, setSearchDescription] = useLocalStorageState(
    'searchDescription',
    defaultFalse,
  );

  const [hideCancelled, setHideCancelled] = useLocalStorageState(
    'hideCancelled',
    defaultTrue,
  );

  const [hideFirstYearSeminars, setHideFirstYearSeminars] =
    useLocalStorageState('hideFirstYearSeminars', defaultFalse);

  const [hideGraduateCourses, setHideGraduateCourses] = useLocalStorageState(
    'hideGraduateCourses',
    defaultFalse,
  );

  const [hideDiscussionSections, setHideDiscussionSections] =
    useLocalStorageState('hideDiscussionSections', defaultTrue);

  /* Sorting */

  // Sort option state
  const [selectSortBy, setSelectSortby] = useSessionStorageState<SortByOption>(
    'selectSortBy',
    defaultSortOption,
  );

  // Sort order state
  const [sortOrder, setSortOrder] = useSessionStorageState<SortOrderType>(
    'sortOrder',
    defaultSortOrder,
  );

  // Combination of sort option and sort order
  const [ordering, setOrdering] = useSessionStorageState(
    'ordering',
    defaultOrdering,
  );

  /* Resetting */

  // State to determine if user can reset or not
  const [canReset, setCanReset] = useSessionStorageState('canReset', false);
  // State to cause components to reload when filters are reset
  const [resetKey, setResetKey] = useState(0);

  /* Search speed */

  const [startTime, setStartTime] = useState(Date.now());
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState('fast');

  // State that determines if a course modal needs to be displayed and which course to display
  const [courseModal, setCourseModal] = useState<
    (string | boolean | Listing)[]
  >([false, '']);

  // Fetch user context data
  const { user } = useUser();
  // Is the user logged in?
  const isLoggedIn = user.worksheet != null;

  // Object that holds a list of each fb friend taking a specific course
  const numFb = useMemo(() => {
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

  const requiredSeasons = useMemo(() => {
    if (!isLoggedIn) {
      // If we're not logged in, don't attempt to request any seasons.
      return [];
    }
    if (selectSeasons == null) {
      return [];
    }
    if (selectSeasons.length === 0) {
      // Nothing selected, so default to all seasons.
      return seasonsData.seasons.map((x) => x.season_code).slice(0, 15);
    }
    return selectSeasons.map((x) => x.value);
  }, [isLoggedIn, selectSeasons, seasonsData]);

  const {
    loading: coursesLoading,
    courses: courseData,
    error: courseLoadError,
  } = useCourseData(requiredSeasons);

  // State used to determine whether or not to show season tags
  // (if multiple seasons are queried, the season is indicated)
  const multiSeasons = requiredSeasons.length !== 1;

  // Search configuration of filters
  const searchConfig = useMemo(() => {
    // skills and areas
    let processedSkillsAreas;
    let processedSkills;
    let processedAreas;
    if (selectSkillsAreas != null) {
      processedSkillsAreas = selectSkillsAreas.map((x) => {
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
      processedSkills = processedSkillsAreas.filter((x): x is SkillsType =>
        skills.includes(x as SkillsType),
      );
      processedAreas = processedSkillsAreas.filter((x): x is AreasType =>
        areas.includes(x as AreasType),
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
    if (selectCredits != null) {
      processedCredits = selectCredits.map((x) => {
        return x.label;
      });
      // set null defaults
      if (processedCredits.length === 0) {
        processedCredits = null;
      }
    }

    // schools to filter
    let processedSchools;
    if (selectSchools != null) {
      processedSchools = selectSchools.map((x) => {
        return x.value;
      });

      // set null defaults
      if (processedSchools.length === 0) {
        processedSchools = null;
      }
    }

    // subjects to filter
    let processedSubjects;
    if (selectSubjects != null) {
      processedSubjects = selectSubjects.map((x) => {
        return x.value;
      });

      // set null defaults
      if (processedSubjects.length === 0) {
        processedSubjects = null;
      }
    }

    // days to filter
    let processedDays;
    if (selectDays != null) {
      processedDays = selectDays.map((x) => {
        return x.value;
      });

      // set null defaults
      if (processedDays.length === 0) {
        processedDays = null;
      }
    }

    // if the bounds are unaltered, we need to set them to null
    // to include unrated courses
    const includeAllOveralls = _.isEqual(overallBounds, defaultRatingBounds);

    const includeAllWorkloads = _.isEqual(workloadBounds, defaultRatingBounds);

    const includeAllTimes = _.isEqual(timeBounds, defaultTimeBounds);

    const includeAllEnrollments = _.isEqual(
      enrollBounds.map(Math.round),
      defaultEnrollBounds,
    );

    const includeAllNumbers = _.isEqual(numBounds, defaultNumBounds);

    // Variables to use in search query
    const searchVariables = {
      search_text: searchText,
      // seasons: not included because it is handled by required_seasons
      areas: new Set(processedAreas),
      skills: new Set(processedSkills),
      credits: new Set(processedCredits),
      schools: new Set(processedSchools),
      subjects: new Set(processedSubjects),
      days: new Set(processedDays),
      min_overall: includeAllOveralls ? null : overallBounds[0],
      max_overall: includeAllOveralls ? null : overallBounds[1],
      min_workload: includeAllWorkloads ? null : workloadBounds[0],
      max_workload: includeAllWorkloads ? null : workloadBounds[1],
      min_time: includeAllTimes ? null : timeBounds[0],
      max_time: includeAllTimes ? null : timeBounds[1],
      min_enrollment: includeAllEnrollments ? null : enrollBounds[0],
      max_enrollment: includeAllEnrollments ? null : enrollBounds[1],
      min_number: includeAllNumbers ? null : numBounds[0],
      max_number: includeAllNumbers ? null : numBounds[1],
      description: searchDescription ? 'ACTIVE' : null,
      extra_info: hideCancelled ? 'ACTIVE' : null,
      discussion_section: hideDiscussionSections ? 'ACTIVE' : null,
      fy_sem: hideFirstYearSeminars ? false : null,
      grad_level: hideGraduateCourses ? false : null,
    };
    return searchVariables;
  }, [
    searchDescription,
    hideCancelled,
    hideFirstYearSeminars,
    hideGraduateCourses,
    hideDiscussionSections,
    overallBounds,
    workloadBounds,
    timeBounds,
    enrollBounds,
    numBounds,
    selectCredits,
    selectSchools,
    selectSkillsAreas,
    selectSubjects,
    selectDays,
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

    const listings = requiredSeasons
      .map((season_code) => {
        if (!courseData[season_code]) return [];
        return [...courseData[season_code].values()];
      })
      .reduce((acc, cur) => acc.concat(cur), []);

    const filtered = listings.filter((listing) => {
      // Apply filters.
      const averageOverall = Number(getOverallRatings(listing));
      if (
        searchConfig.min_overall !== null &&
        searchConfig.max_overall !== null &&
        (averageOverall === null ||
          _.round(averageOverall, 1) < searchConfig.min_overall ||
          _.round(averageOverall, 1) > searchConfig.max_overall)
      ) {
        return false;
      }

      const averageWorkload = Number(getWorkloadRatings(listing));
      if (
        searchConfig.min_workload !== null &&
        searchConfig.max_workload !== null &&
        (averageWorkload === null ||
          _.round(averageWorkload, 1) < searchConfig.min_workload ||
          _.round(averageWorkload, 1) > searchConfig.max_workload)
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

      // Checks whether the section field consists only of letters -- if so, the class is a discussion section.
      if (
        searchConfig.discussion_section !== null &&
        /^[A-Z]*$/.test(listing.section)
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
        !listing.areas.some((v): v is AreasType =>
          searchConfig.areas.has(v as AreasType),
        ) &&
        !listing.skills.some((v): v is SkillsType =>
          searchConfig.skills.has(v as SkillsType),
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
          (searchDescription &&
            listing.description?.toLowerCase()?.includes(token)) ||
          listing.title.toLowerCase().includes(token) ||
          listing.professor_names.some((professor) =>
            professor.toLowerCase().includes(token),
          )
        )
          continue;

        return false;
      }

      return true;
    });

    // Apply sorting order.
    return sortCourses(filtered, ordering, numFb);
  }, [
    searchDescription,
    requiredSeasons,
    coursesLoading,
    courseLoadError,
    courseData,
    searchConfig,
    ordering,
    numFb,
  ]);

  // For resetting all filters and sorts
  const handleResetFilters = useCallback(() => {
    setSearchText('');
    setSearchDescription(false);
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

    setResetKey(resetKey + 1);

    setCanReset(false);
    setStartTime(Date.now());
  }, [
    resetKey,
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
    setSearchDescription,
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
      setCourseModal([true, listing]);
    },
    [setCourseModal],
  );

  // Reset courseModal state to hide the modal
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
    const sortParams = selectSortBy.value;
    const newOrdering: {
      [key in SortKeys]?: SortOrderType;
    } = {
      [sortParams]: sortOrder,
    };
    setOrdering(newOrdering);
  }, [selectSortBy, sortOrder, setOrdering]);

  // Check if can or can't reset
  useEffect(() => {
    if (
      !_.isEqual(searchText, '') ||
      !_.isEqual(selectSubjects, defaultOptions) ||
      !_.isEqual(selectSkillsAreas, defaultOptions) ||
      !_.isEqual(overallBounds, defaultRatingBounds) ||
      !_.isEqual(workloadBounds, defaultRatingBounds) ||
      !_.isEqual(selectSeasons, defaultSeason) ||
      !_.isEqual(selectDays, defaultOptions) ||
      !_.isEqual(timeBounds, defaultTimeBounds) ||
      !_.isEqual(enrollBounds, defaultEnrollBounds) ||
      !_.isEqual(numBounds, defaultNumBounds) ||
      !_.isEqual(selectSchools, defaultOptions) ||
      !_.isEqual(selectCredits, defaultOptions) ||
      !_.isEqual(searchDescription, defaultFalse) ||
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
      const durInSecs = Math.abs(Date.now() - startTime) / 1000;
      setDuration(durInSecs);
      const sp = _.sample(
        searchSpeed[
          durInSecs > 1 ? 'fast' : durInSecs > 0.5 ? 'faster' : 'fastest'
        ],
      );
      if (sp) {
        setSpeed(sp);
      }
    }
  }, [
    searchText,
    selectSubjects,
    selectSkillsAreas,
    overallBounds,
    workloadBounds,
    timeBounds,
    enrollBounds,
    numBounds,
    selectSeasons,
    selectDays,
    selectSchools,
    selectCredits,
    searchDescription,
    hideCancelled,
    hideFirstYearSeminars,
    hideGraduateCourses,
    hideDiscussionSections,
    ordering,
    coursesLoading,
    searchData,
    startTime,
    setCanReset,
  ]);

  // Store object returned in context provider
  const store = useMemo(
    () => ({
      // Context state.
      canReset,
      searchText,
      selectSubjects,
      selectSkillsAreas,
      overallBounds,
      overallValueLabels,
      workloadBounds,
      workloadValueLabels,
      selectSeasons,
      selectDays,
      timeBounds,
      timeValueLabels,
      enrollBounds,
      enrollValueLabels,
      numBounds,
      numValueLabels,
      selectSchools,
      selectCredits,
      searchDescription,
      hideCancelled,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      selectSortBy,
      sortOrder,
      ordering,
      seasonsOptions,
      coursesLoading,
      searchData,
      multiSeasons,
      isLoggedIn,
      numFb,
      resetKey,
      duration,
      speed,
      courseModal,

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
      setSearchDescription,
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
      selectSubjects,
      selectSkillsAreas,
      overallBounds,
      overallValueLabels,
      workloadBounds,
      workloadValueLabels,
      selectSeasons,
      selectDays,
      timeBounds,
      timeValueLabels,
      enrollBounds,
      enrollValueLabels,
      numBounds,
      numValueLabels,
      selectSchools,
      selectCredits,
      searchDescription,
      hideCancelled,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      selectSortBy,
      sortOrder,
      ordering,
      seasonsOptions,
      coursesLoading,
      searchData,
      multiSeasons,
      isLoggedIn,
      numFb,
      resetKey,
      duration,
      speed,
      courseModal,
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
      setSearchDescription,
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
    ],
  );

  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext)!;
