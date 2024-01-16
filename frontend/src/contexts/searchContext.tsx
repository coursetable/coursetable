import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isEqual, type Listing, type Season } from '../utilities/common';
import { useSessionStorageState } from '../utilities/browserStorage';
import { useCourseData, useFerry, useWorksheetInfo } from './ferryContext';
import {
  skillsAreas,
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
  filters: {
    [K in keyof typeof defaultFilters]: ReturnType<typeof useFilterState<K>>;
  };
  canReset: boolean;
  seasonsOptions: Option[];
  coursesLoading: boolean;
  searchData: Listing[];
  multiSeasons: boolean;
  isLoggedIn: boolean;
  numFriends: { [seasonCodeCrn: string]: string[] };
  resetKey: number;
  duration: number;
  setCanReset: React.Dispatch<React.SetStateAction<boolean>>;
  handleResetFilters: () => void;
  setResetKey: React.Dispatch<React.SetStateAction<number>>;
  setStartTime: React.Dispatch<React.SetStateAction<number>>;
};

const SearchContext = createContext<Store | undefined>(undefined);
SearchContext.displayName = 'SearchContext';

// Default filter and sorting values
export const defaultWorksheet: Option[] = [
  { value: '0', label: 'Main Worksheet' },
];

export const defaultFilters = {
  searchText: '',
  selectSubjects: [] as Option[],
  selectSkillsAreas: [] as Option[],
  overallBounds: [1, 5],
  workloadBounds: [1, 5],
  selectSeasons: [
    { value: CUR_SEASON, label: toSeasonString(CUR_SEASON) },
  ] as Option[],
  selectDays: [] as Option[],
  timeBounds: ['7:00', '22:00'],
  enrollBounds: [1, 528],
  numBounds: [0, 1000],
  selectSchools: [] as Option[],
  selectCredits: [] as Option<number>[],
  selectCourseInfoAttributes: [] as Option[],
  searchDescription: false,
  hideCancelled: true,
  hideConflicting: false,
  hideFirstYearSeminars: false,
  hideGraduateCourses: false,
  hideDiscussionSections: true,
  selectSortby: sortbyOptions[0] satisfies SortByOption as SortByOption,
  sortOrder: 'asc' satisfies SortOrderType as SortOrderType,
};

function useFilterState<K extends keyof typeof defaultFilters>(key: K) {
  const [value, setValue] = useSessionStorageState(key, defaultFilters[key]);
  return useMemo(
    () => ({
      value,
      set: setValue,
      hasChanged: !isEqual(value, defaultFilters[key]),
      reset: () => setValue(defaultFilters[key]),
    }),
    [value, setValue, key],
  );
}

/**
 * Stores the user's search, filters, and sorts
 */
export function SearchProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  /* Filtering */
  const searchText = useFilterState('searchText');
  const selectSubjects = useFilterState('selectSubjects');
  const selectSkillsAreas = useFilterState('selectSkillsAreas');
  const overallBounds = useFilterState('overallBounds');
  const workloadBounds = useFilterState('workloadBounds');
  const selectSeasons = useFilterState('selectSeasons');
  const selectDays = useFilterState('selectDays');
  const timeBounds = useFilterState('timeBounds');
  const enrollBounds = useFilterState('enrollBounds');
  const numBounds = useFilterState('numBounds');
  const selectSchools = useFilterState('selectSchools');
  const selectCredits = useFilterState('selectCredits');
  const selectCourseInfoAttributes = useFilterState(
    'selectCourseInfoAttributes',
  );
  const searchDescription = useFilterState('searchDescription');
  const hideCancelled = useFilterState('hideCancelled');
  const hideConflicting = useFilterState('hideConflicting');
  const hideFirstYearSeminars = useFilterState('hideFirstYearSeminars');
  const hideGraduateCourses = useFilterState('hideGraduateCourses');
  const hideDiscussionSections = useFilterState('hideDiscussionSections');

  /* Sorting */
  const selectSortby = useFilterState('selectSortby');
  const sortOrder = useFilterState('sortOrder');

  /* Resetting */

  // State to determine if user can reset or not
  const [canReset, setCanReset] = useSessionStorageState('canReset', false);
  // State to cause components to reload when filters are reset
  const [resetKey, setResetKey] = useState(0);

  /* Search speed */
  const [startTime, setStartTime] = useState(Date.now());
  const [duration, setDuration] = useState(0);

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
  const { seasons } = useFerry();
  const seasonsOptions = seasons.map(
    (x): Option => ({
      value: x,
      // Capitalize term and add year
      label: toSeasonString(x),
    }),
  );

  const requiredSeasons = useMemo((): Season[] => {
    if (!isLoggedIn) {
      // If we're not logged in, don't attempt to request any seasons.
      return [];
    }
    if (selectSeasons.value.length === 0) {
      // Nothing selected, so default to all seasons.
      return seasons.slice(0, 15);
    }
    return selectSeasons.value.map((x) => x.value as Season);
  }, [isLoggedIn, selectSeasons, seasons]);

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
    const processedSkillsAreas = selectSkillsAreas.value.map((x) => x.value);
    if (processedSkillsAreas.includes('L'))
      processedSkillsAreas.push('L1', 'L2', 'L3', 'L4', 'L5');
    const processedSkills = processedSkillsAreas.filter(
      (x) => x in skillsAreas.skills,
    );
    const processedAreas = processedSkillsAreas.filter(
      (x) => x in skillsAreas.areas,
    );

    // Variables to use in search query
    const searchVariables = {
      searchText: searchText.value,
      // Seasons: not included because it is handled by required_seasons
      areas: new Set(processedAreas),
      skills: new Set(processedSkills),
      credits: new Set(selectCredits.value.map((x) => x.value)),
      courseInfoAttributes: new Set(
        selectCourseInfoAttributes.value.map((x) => x.value),
      ),
      schools: new Set(selectSchools.value.map((x) => x.value)),
      subjects: new Set(selectSubjects.value.map((x) => x.value)),
      days: new Set(selectDays.value.map((x) => x.value)),
      // If the bounds are unaltered, we need to set them to null
      // to include unrated courses
      minOverall: overallBounds.hasChanged ? overallBounds.value[0] : null,
      maxOverall: overallBounds.hasChanged ? overallBounds.value[1] : null,
      minWorkload: workloadBounds.hasChanged ? workloadBounds.value[0] : null,
      maxWorkload: workloadBounds.hasChanged ? workloadBounds.value[1] : null,
      minTime: timeBounds.hasChanged ? timeBounds.value[0] : null,
      maxTime: timeBounds.hasChanged ? timeBounds.value[1] : null,
      minEnrollment: enrollBounds.hasChanged ? enrollBounds.value[0] : null,
      maxEnrollment: enrollBounds.hasChanged ? enrollBounds.value[1] : null,
      minNumber: numBounds.hasChanged ? numBounds.value[0] : null,
      maxNumber: numBounds.hasChanged ? numBounds.value[1] : null,
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
    selectCourseInfoAttributes,
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

    // Pre-processing for the search text.
    const tokens = searchConfig.searchText
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
          enrollment < searchConfig.minEnrollment ||
          enrollment > searchConfig.maxEnrollment)
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
        !listing.areas.some((v) => searchConfig.areas.has(v)) &&
        !listing.skills.some((v) => searchConfig.skills.has(v))
      )
        return false;

      if (
        searchConfig.credits.size !== 0 &&
        listing.credits !== null &&
        !searchConfig.credits.has(listing.credits)
      )
        return false;

      if (
        searchConfig.courseInfoAttributes.size !== 0 &&
        listing.flag_info !== null &&
        // !searchConfig.courseInfoAttributes.has(String(listing.flag_info))
        Array.from(searchConfig.courseInfoAttributes).filter((value) =>
          listing.flag_info.includes(value),
        ).length === 0
      )
        return false;

      if (
        searchConfig.courseInfoAttributes.size !== 0 &&
        listing.flag_info !== null &&
        // !searchConfig.courseInfoAttributes.has(String(listing.flag_info))
        Array.from(searchConfig.courseInfoAttributes).filter((value) =>
          listing.flag_info.includes(value),
        ).length === 0
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
    return sortCourses(
      filtered,
      { key: selectSortby.value.value, type: sortOrder.value },
      numFriends,
    );
  }, [
    worksheetInfo,
    searchDescription,
    requiredSeasons,
    coursesLoading,
    courseLoadError,
    courseData,
    searchConfig,
    selectSortby,
    sortOrder,
    numFriends,
  ]);

  const filters = useMemo(
    () => ({
      searchText,
      selectSubjects,
      selectSkillsAreas,
      overallBounds,
      workloadBounds,
      selectSeasons,
      selectDays,
      timeBounds,
      enrollBounds,
      numBounds,
      selectSchools,
      selectCredits,
      selectCourseInfoAttributes,
      searchDescription,
      hideCancelled,
      hideConflicting,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      selectSortby,
      sortOrder,
    }),
    [
      searchText,
      selectSubjects,
      selectSkillsAreas,
      overallBounds,
      workloadBounds,
      selectSeasons,
      selectDays,
      timeBounds,
      enrollBounds,
      numBounds,
      selectSchools,
      selectCredits,
      selectCourseInfoAttributes,
      searchDescription,
      hideCancelled,
      hideConflicting,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      selectSortby,
      sortOrder,
    ],
  );

  // For resetting all filters and sorts
  const handleResetFilters = useCallback(() => {
    Object.values(filters).forEach((filter) => filter.reset());

    setResetKey(resetKey + 1);

    setCanReset(false);
    setStartTime(Date.now());
  }, [resetKey, filters, setCanReset]);

  // Check if can or can't reset
  useEffect(() => {
    if (
      Object.entries(filters)
        .filter(([k]) => !['sortOrder', 'selectSortby'].includes(k))
        .some(([, filter]) => filter.hasChanged)
    )
      setCanReset(true);
    else setCanReset(false);
    if (!coursesLoading && searchData) {
      const durInSecs = Math.abs(Date.now() - startTime) / 1000;
      setDuration(durInSecs);
    }
  }, [filters, coursesLoading, searchData, startTime, setCanReset]);

  // Store object returned in context provider
  const store = useMemo(
    () => ({
      // Context state.
      canReset,
      filters,
      seasonsOptions,
      coursesLoading,
      searchData,
      multiSeasons,
      isLoggedIn,
      numFriends,
      resetKey,
      duration,

      // Update methods.
      setCanReset,
      handleResetFilters,
      setResetKey,
      setStartTime,
    }),
    [
      canReset,
      filters,
      seasonsOptions,
      coursesLoading,
      searchData,
      multiSeasons,
      isLoggedIn,
      numFriends,
      resetKey,
      duration,
      setCanReset,
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
