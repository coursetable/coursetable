import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isEqual, type Listing, type Season } from '../utilities/common';
import {
  useLocalStorageState,
  useSessionStorageState,
} from '../utilities/browserStorage';
import { useCourseData, useFerry, useWorksheetInfo } from './ferryContext';
import {
  areas,
  type AreasType,
  searchSpeed,
  skills,
  type SkillsType,
  type SortByOption,
  sortbyOptions,
  type SortKeys,
} from '../utilities/constants';
import {
  checkConflict,
  getDayTimes,
  getEnrolled,
  getNumFriends,
  getOverallRatings,
  getWorkloadRatings,
  sortCourses,
  toRangeTime,
  toSeasonString,
} from '../utilities/course';
import { CUR_SEASON } from '../config';
import { useUser } from './userContext';

// Option type for all the filter options
export type Option<T extends string | number = string> = {
  label: string;
  value: T;
  color?: string;
  numeric?: boolean;
};

export const isOption = (x: unknown): x is Option =>
  // eslint-disable-next-line no-implicit-coercion
  !!x && typeof x === 'object' && 'label' in x && 'value' in x;

export type SortOrderType = 'desc' | 'asc';

export type OrderingType = {
  key: SortKeys;
  type: 'desc' | 'asc';
};

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
  selectCredits: Option<number>[];
  searchDescription: boolean;
  hideCancelled: boolean;
  hideConflicting: boolean;
  hideFirstYearSeminars: boolean;
  hideGraduateCourses: boolean;
  hideDiscussionSections: boolean;
  selectSortby: SortByOption;
  sortOrder: SortOrderType;
  ordering: OrderingType;
  seasonsOptions: Option[];
  coursesLoading: boolean;
  searchData: Listing[];
  multiSeasons: boolean;
  isLoggedIn: boolean;
  numFriends: { [seasonCodeCrn: string]: string[] };
  resetKey: number;
  duration: number;
  speed: string;
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
  setSelectCredits: React.Dispatch<React.SetStateAction<Option<number>[]>>;
  setSearchDescription: React.Dispatch<React.SetStateAction<boolean>>;
  setHideCancelled: React.Dispatch<React.SetStateAction<boolean>>;
  setHideConflicting: React.Dispatch<React.SetStateAction<boolean>>;
  setHideFirstYearSeminars: React.Dispatch<React.SetStateAction<boolean>>;
  setHideGraduateCourses: React.Dispatch<React.SetStateAction<boolean>>;
  setHideDiscussionSections: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectSortby: React.Dispatch<React.SetStateAction<SortByOption>>;
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrderType>>;
  setOrdering: React.Dispatch<React.SetStateAction<OrderingType>>;
  handleResetFilters: () => void;
  setResetKey: React.Dispatch<React.SetStateAction<number>>;
  setStartTime: React.Dispatch<React.SetStateAction<number>>;
};

const SearchContext = createContext<Store | undefined>(undefined);
SearchContext.displayName = 'SearchContext';

// Default filter and sorting values
const defaultOptions: [] = [];
const defaultRatingBounds = [1, 5];
const defaultSeason: Option[] = [
  { value: CUR_SEASON, label: toSeasonString(CUR_SEASON) },
];
const defaultWorksheet: Option[] = [{ value: '0', label: 'Main Worksheet' }];
const defaultTrue = true;
const defaultFalse = false;
const [defaultSortOption] = sortbyOptions;
const defaultTimeBounds = ['7:00', '22:00'];
const defaultEnrollBounds = [1, 528];
const defaultNumBounds = [0, 1000];
const defaultSortOrder: SortOrderType = 'asc';
const defaultOrdering: OrderingType = { key: 'course_code', type: 'asc' };

export const defaultFilters = {
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
export function SearchProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // Search on page render?
  const [defaultSearch, setDefaultSearch] = useState(true);

  /* Filtering */

  const [searchText, setSearchText] = useSessionStorageState('searchText', '');

  const [selectSubjects, setSelectSubjects] = useSessionStorageState<Option[]>(
    'selectSubjects',
    defaultOptions,
  );

  const [selectSkillsAreas, setSelectSkillsAreas] = useSessionStorageState<
    Option[]
  >('selectSkillsAreas', defaultOptions);

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

  const [selectDays, setSelectDays] = useSessionStorageState<Option[]>(
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

  const [selectSchools, setSelectSchools] = useSessionStorageState<Option[]>(
    'selectSchools',
    defaultOptions,
  );

  const [selectCredits, setSelectCredits] = useSessionStorageState<
    Option<number>[]
  >('selectCredits', defaultOptions);

  const [searchDescription, setSearchDescription] = useLocalStorageState(
    'searchDescription',
    defaultFalse,
  );

  const [hideCancelled, setHideCancelled] = useLocalStorageState(
    'hideCancelled',
    defaultTrue,
  );

  const [hideConflicting, setHideConflicting] = useLocalStorageState(
    'hideConflicting',
    defaultFalse,
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
  const [selectSortby, setSelectSortby] = useSessionStorageState<SortByOption>(
    'selectSortby',
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

  // Fetch user context data
  const { user } = useUser();
  // Is the user logged in?
  const isLoggedIn = Boolean(user.worksheet);

  // Object that holds a list of each friend taking a specific course
  const numFriends = useMemo(() => {
    if (!user.friends) return {};
    return getNumFriends(user.friends);
  }, [user.friends]);

  // Populate seasons from database
  const { seasons: seasonsData } = useFerry();
  const seasonsOptions = seasonsData.seasons.map(
    (x): Option => ({
      value: x.season_code,
      // Capitalize term and add year
      label: `${x.term.charAt(0).toUpperCase() + x.term.slice(1)} ${x.year}`,
    }),
  );

  const requiredSeasons = useMemo((): Season[] => {
    if (!isLoggedIn) {
      // If we're not logged in, don't attempt to request any seasons.
      return [];
    }
    // TODO: can it be null?
    if (!selectSeasons) return [];
    if (selectSeasons.length === 0) {
      // Nothing selected, so default to all seasons.
      return seasonsData.seasons
        .map((x) => x.season_code as Season)
        .slice(0, 15);
    }
    return selectSeasons.map((x) => x.value as Season);
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
    // Skills and areas
    const processedSkillsAreas = selectSkillsAreas.map((x) => x.value);
    if (processedSkillsAreas.includes('L'))
      processedSkillsAreas.push('L1', 'L2', 'L3', 'L4', 'L5');
    const processedSkills = processedSkillsAreas.filter((x): x is SkillsType =>
      skills.includes(x as SkillsType),
    );
    const processedAreas = processedSkillsAreas.filter((x): x is AreasType =>
      areas.includes(x as AreasType),
    );

    // Credits to filter
    const processedCredits = selectCredits.map((x) => x.label);

    // Schools to filter
    const processedSchools = selectSchools.map((x) => x.value);

    // Subjects to filter
    const processedSubjects = selectSubjects.map((x) => x.value);

    // Days to filter
    const processedDays = selectDays.map((x) => x.value);

    // If the bounds are unaltered, we need to set them to null
    // to include unrated courses
    const includeAllOveralls = isEqual(overallBounds, defaultRatingBounds);

    const includeAllWorkloads = isEqual(workloadBounds, defaultRatingBounds);

    const includeAllTimes = isEqual(timeBounds, defaultTimeBounds);

    const includeAllEnrollments = isEqual(
      enrollBounds.map(Math.round),
      defaultEnrollBounds,
    );

    const includeAllNumbers = isEqual(numBounds, defaultNumBounds);

    // Variables to use in search query
    const searchVariables = {
      searchText,
      // Seasons: not included because it is handled by required_seasons
      areas: new Set(processedAreas),
      skills: new Set(processedSkills),
      credits: new Set(processedCredits),
      schools: new Set(processedSchools),
      subjects: new Set(processedSubjects),
      days: new Set(processedDays),
      minOverall: includeAllOveralls ? null : overallBounds[0],
      maxOverall: includeAllOveralls ? null : overallBounds[1],
      minWorkload: includeAllWorkloads ? null : workloadBounds[0],
      maxWorkload: includeAllWorkloads ? null : workloadBounds[1],
      minTime: includeAllTimes ? null : timeBounds[0],
      maxTime: includeAllTimes ? null : timeBounds[1],
      minEnrollment: includeAllEnrollments ? null : enrollBounds[0],
      maxEnrollment: includeAllEnrollments ? null : enrollBounds[1],
      minNumber: includeAllNumbers ? null : numBounds[0],
      maxNumber: includeAllNumbers ? null : numBounds[1],
      description: searchDescription ? 'ACTIVE' : null,
      extraInfo: hideCancelled ? 'ACTIVE' : null,
      conflicting: hideConflicting ? 'ACTIVE' : null,
      discussionSection: hideDiscussionSections ? 'ACTIVE' : null,
      fySem: hideFirstYearSeminars ? false : null,
      gradLevel: hideGraduateCourses ? false : null,
    };
    return searchVariables;
  }, [
    searchDescription,
    hideCancelled,
    hideConflicting,
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

  const { data: worksheetInfo } = useWorksheetInfo(user.worksheet);

  // Filtered and sorted courses
  const searchData = useMemo(() => {
    // Match search results with course data.
    if (coursesLoading || courseLoadError) return [];
    if (Object.keys(searchConfig).length === 0) return [];

    // Pre-processing for the search text.
    const tokens = (searchConfig.searchText || '')
      .split(/\s+/u)
      .filter((x) => Boolean(x))
      .map((token) => token.toLowerCase());

    const listings = requiredSeasons
      .map((seasonCode) => {
        if (!courseData[seasonCode]) return [];
        return [...courseData[seasonCode].values()];
      })
      .reduce((acc, cur) => acc.concat(cur), []);

    const filtered = listings.filter((listing) => {
      // Apply filters.
      const averageOverall = getOverallRatings(listing, 'stat');
      const overall =
        averageOverall === null ? null : Math.round(averageOverall * 10) / 10;
      if (
        searchConfig.minOverall !== null &&
        searchConfig.maxOverall !== null &&
        (overall === null ||
          overall < searchConfig.minOverall ||
          overall > searchConfig.maxOverall)
      )
        return false;

      const averageWorkload = getWorkloadRatings(listing, 'stat');
      const workload =
        averageWorkload === null ? null : Math.round(averageWorkload * 10) / 10;
      if (
        searchConfig.minWorkload !== null &&
        searchConfig.maxWorkload !== null &&
        (workload === null ||
          workload < searchConfig.minWorkload ||
          workload > searchConfig.maxWorkload)
      )
        return false;

      if (searchConfig.minTime !== null && searchConfig.maxTime !== null) {
        const times = getDayTimes(listing);
        if (
          times &&
          !times.some(
            (time) =>
              searchConfig.minTime !== null &&
              searchConfig.maxTime !== null &&
              time !== null &&
              toRangeTime(time.start) >= toRangeTime(searchConfig.minTime) &&
              toRangeTime(time.end) <= toRangeTime(searchConfig.maxTime),
          )
        )
          return false;
      }

      const enrollment = getEnrolled(listing, 'stat');
      if (
        searchConfig.minEnrollment !== null &&
        searchConfig.maxEnrollment !== null &&
        (enrollment === null ||
          enrollment < Math.round(searchConfig.minEnrollment) ||
          enrollment > Math.round(searchConfig.maxEnrollment))
      )
        return false;

      const number = Number(listing.number.replace(/\D/gu, ''));
      if (
        searchConfig.minNumber !== null &&
        searchConfig.maxNumber !== null &&
        (number === null ||
          number < searchConfig.minNumber ||
          (searchConfig.maxNumber < 1000 && number > searchConfig.maxNumber))
      )
        return false;

      if (
        searchConfig.extraInfo !== null &&
        searchConfig.extraInfo !== listing.extra_info
      )
        return false;

      if (
        searchConfig.conflicting !== null &&
        worksheetInfo &&
        listing.times_summary !== 'TBA' &&
        checkConflict(worksheetInfo, listing).length > 0
      )
        return false;

      // Checks whether the section field consists only of letters -- if so, the
      // class is a discussion section.
      if (
        searchConfig.discussionSection !== null &&
        /^[A-Z]*$/u.test(listing.section)
      )
        return false;

      if (searchConfig.fySem !== null && searchConfig.fySem !== listing.fysem)
        return false;

      if (
        searchConfig.gradLevel !== null &&
        (listing.number === null ||
          // Tests if first character is between 5-9
          (listing.number.charAt(0) >= '5' &&
            listing.number.charAt(0) <= '9') ||
          // Otherwise if first character is not a number (i.e. summer classes),
          // tests whether second character between 5-9
          ((listing.number.charAt(0) < '0' || listing.number.charAt(0) > '9') &&
            (listing.number.length <= 1 ||
              (listing.number.charAt(1) >= '5' &&
                listing.number.charAt(1) <= '9'))))
      )
        return false;

      if (
        searchConfig.subjects.size !== 0 &&
        !searchConfig.subjects.has(listing.subject)
      )
        return false;

      // TODO: searchConfig.days should be a literal set too
      const days = new Set<string>(
        getDayTimes(listing)?.map((daytime) => daytime.day),
      );
      if (searchConfig.days.size !== 0) {
        let include = true;
        if (days && days !== null) {
          days.forEach((day) => {
            if (!searchConfig.days.has(day)) include = false;
          });
          searchConfig.days.forEach((day) => {
            if (!days.has(day)) include = false;
          });
        } else {
          include = false;
        }
        if (!include) return false;
      }

      if (
        (searchConfig.areas.size !== 0 || searchConfig.skills.size !== 0) &&
        !listing.areas.some((v): v is AreasType =>
          searchConfig.areas.has(v as AreasType),
        ) &&
        !listing.skills.some((v): v is SkillsType =>
          searchConfig.skills.has(v as SkillsType),
        )
      )
        return false;

      if (
        searchConfig.credits.size !== 0 &&
        listing.credits !== null &&
        !searchConfig.credits.has(String(listing.credits))
      )
        return false;

      if (
        searchConfig.schools.size !== 0 &&
        listing.school !== null &&
        !searchConfig.schools.has(listing.school)
      )
        return false;

      // Handle search text. Each token must match something.
      for (const token of tokens) {
        // First character of the course number
        const numberFirstChar = listing.number.charAt(0);
        if (
          listing.subject.toLowerCase().startsWith(token) ||
          listing.number.toLowerCase().startsWith(token) ||
          // For course numbers that start with a letter (checked by if
          // .toLowerCase() is not equal to .toUpperCase(), see
          // https://stackoverflow.com/a/32567789/5540324),
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
    return sortCourses(filtered, ordering, numFriends);
  }, [
    worksheetInfo,
    searchDescription,
    requiredSeasons,
    coursesLoading,
    courseLoadError,
    courseData,
    searchConfig,
    ordering,
    numFriends,
  ]);

  // For resetting all filters and sorts
  const handleResetFilters = useCallback(() => {
    setSearchText('');
    setSearchDescription(false);
    setHideCancelled(true);
    setHideConflicting(false);
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
    setHideConflicting,
    setHideFirstYearSeminars,
    setHideGraduateCourses,
    setHideDiscussionSections,
    setSelectSortby,
    setSortOrder,
    setOrdering,
    setCanReset,
  ]);

  // Perform default search on load
  useEffect(() => {
    // Only execute after seasons have been loaded
    if (defaultSearch && seasonsOptions) setDefaultSearch(false);
  }, [seasonsOptions, defaultSearch]);

  // Set ordering in parent element whenever sortby or order changes
  useEffect(() => {
    const sortParams = selectSortby.value;
    const newOrdering: OrderingType = {
      key: sortParams,
      type: sortOrder,
    };
    setOrdering(newOrdering);
  }, [selectSortby, sortOrder, setOrdering]);

  // Check if can or can't reset
  useEffect(() => {
    if (
      searchText !== '' ||
      !isEqual(selectSubjects, defaultOptions) ||
      !isEqual(selectSkillsAreas, defaultOptions) ||
      !isEqual(overallBounds, defaultRatingBounds) ||
      !isEqual(workloadBounds, defaultRatingBounds) ||
      !(selectSeasons.length === 1 && selectSeasons[0].value === CUR_SEASON) ||
      !isEqual(selectDays, defaultOptions) ||
      !isEqual(timeBounds, defaultTimeBounds) ||
      !isEqual(enrollBounds, defaultEnrollBounds) ||
      !isEqual(numBounds, defaultNumBounds) ||
      !isEqual(selectSchools, defaultOptions) ||
      !isEqual(selectCredits, defaultOptions) ||
      searchDescription !== defaultFalse ||
      hideCancelled !== defaultTrue ||
      hideConflicting !== defaultFalse ||
      hideFirstYearSeminars !== defaultFalse ||
      hideGraduateCourses !== defaultFalse ||
      hideDiscussionSections !== defaultTrue ||
      !(
        ordering.type === defaultOrdering.type &&
        ordering.key === defaultOrdering.key
      )
    )
      setCanReset(true);
    else setCanReset(false);

    // Calculate & determine search speed
    if (!coursesLoading && searchData) {
      const durInSecs = Math.abs(Date.now() - startTime) / 1000;
      setDuration(durInSecs);
      const pool =
        searchSpeed[
          durInSecs > 1 ? 'fast' : durInSecs > 0.5 ? 'faster' : 'fastest'
        ];
      setSpeed(pool[Math.floor(Math.random() * pool.length)]);
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
    hideConflicting,
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
      hideConflicting,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      selectSortby,
      sortOrder,
      ordering,
      seasonsOptions,
      coursesLoading,
      searchData,
      multiSeasons,
      isLoggedIn,
      numFriends,
      resetKey,
      duration,
      speed,

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
      setHideConflicting,
      setHideFirstYearSeminars,
      setHideGraduateCourses,
      setHideDiscussionSections,
      setSelectSortby,
      setSortOrder,
      setOrdering,
      handleResetFilters,
      setResetKey,
      setStartTime,
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
      hideConflicting,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      selectSortby,
      sortOrder,
      ordering,
      seasonsOptions,
      coursesLoading,
      searchData,
      multiSeasons,
      isLoggedIn,
      numFriends,
      resetKey,
      duration,
      speed,
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
      setHideConflicting,
      setHideFirstYearSeminars,
      setHideGraduateCourses,
      setHideDiscussionSections,
      setSelectSortby,
      setSortOrder,
      setOrdering,
      handleResetFilters,
      setResetKey,
      setStartTime,
    ],
  );

  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext)!;
