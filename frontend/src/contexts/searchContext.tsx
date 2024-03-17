import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { buildEvaluator } from 'quist';
import * as Sentry from '@sentry/react';
import {
  isEqual,
  type Listing,
  type Season,
  type Weekdays,
} from '../utilities/common';
import { useSessionStorageState } from '../utilities/browserStorage';
import { useCourseData, useWorksheetInfo, seasons } from './ferryContext';
import { useWorksheet } from './worksheetContext';
import {
  skillsAreasColors,
  skillsAreas,
  subjects,
  schools,
  courseInfoAttributes,
} from '../utilities/constants';
import {
  isInWorksheet,
  checkConflict,
  getDayTimes,
  getEnrolled,
  getNumFriends,
  getOverallRatings,
  getWorkloadRatings,
  getProfessorRatings,
  isGraduate,
  isDiscussionSection,
  sortCourses,
  toRangeTime,
  toSeasonString,
  type NumFriendsReturn,
} from '../utilities/course';
import { CUR_SEASON } from '../config';
import { useUser } from './userContext';

export type Option<T extends string | number = string> = {
  label: string;
  value: T;
  color?: string;
  numeric?: boolean;
};

export const isOption = (x: unknown): x is Option<string | number> =>
  // eslint-disable-next-line no-implicit-coercion
  !!x && typeof x === 'object' && 'label' in x && 'value' in x;

export const skillsAreasOptions = ['Areas', 'Skills'].map((type) => ({
  label: type,
  options: Object.entries(
    skillsAreas[type.toLowerCase() as 'areas' | 'skills'],
  ).map(
    ([code, name]): Option => ({
      label: `${code} - ${name}`,
      value: code,
      color: skillsAreasColors[code],
    }),
  ),
}));

const sortCriteria = {
  course_code: { label: 'Sort by Course Code', numeric: false },
  title: { label: 'Sort by Course Title', numeric: false },
  friend: { label: 'Sort by Friends', numeric: true },
  average_rating: { label: 'Sort by Course Rating', numeric: true },
  average_professor: { label: 'Sort by Professor Rating', numeric: true },
  average_workload: { label: 'Sort by Workload', numeric: true },
  average_gut_rating: {
    label: 'Sort by Guts (Overall - Workload)',
    numeric: true,
  },
  last_enrollment: { label: 'Sort by Last Enrollment', numeric: true },
  times_by_day: { label: 'Sort by Days & Times', numeric: true },
  locations_summary: { label: 'Sort by Locations', numeric: false },
};

export const sortByOptions = Object.fromEntries(
  Object.entries(sortCriteria).map(([k, v]) => [k, { value: k, ...v }]),
) as { [k in SortKeys]: SortByOption };

// We can only sort by primitive keys by default, unless we have special support
export type SortKeys =
  | keyof typeof sortCriteria
  | keyof {
      [K in keyof Listing as Listing[K] extends string | number ? K : never]: K;
    };

export type SortByOption = Option & {
  value: SortKeys;
  numeric: boolean;
};

export const subjectsOptions = Object.entries(subjects).map(
  ([code, name]): Option => ({
    label: `${code} - ${name}`,
    value: code,
  }),
);

export const schoolsOptions = Object.entries(schools).map(
  ([code, name]): Option => ({
    label: name,
    value: code,
  }),
);

export const seasonsOptions = seasons.map(
  (x): Option<Season> => ({
    value: x,
    label: toSeasonString(x),
  }),
);

export const courseInfoAttributesOptions = courseInfoAttributes.map(
  (attr): Option => ({
    label: attr,
    value: attr,
  }),
);

type SortOrderType = 'desc' | 'asc';

type Store = {
  filters: {
    [K in keyof Filters]: FilterHandle<K>;
  };
  coursesLoading: boolean;
  searchData: Listing[];
  multiSeasons: boolean;
  numFriends: NumFriendsReturn;
  duration: number;
  setStartTime: React.Dispatch<React.SetStateAction<number>>;
};

const SearchContext = createContext<Store | undefined>(undefined);
SearchContext.displayName = 'SearchContext';

export type Filters = {
  searchText: string;
  selectSubjects: Option[];
  selectSkillsAreas: Option[];
  overallBounds: [number, number];
  workloadBounds: [number, number];
  professorBounds: [number, number];
  selectSeasons: Option<Season>[];
  selectDays: Option<Weekdays>[];
  timeBounds: [number, number];
  enrollBounds: [number, number];
  numBounds: [number, number];
  selectSchools: Option[];
  selectCredits: Option<number>[];
  selectCourseInfoAttributes: Option[];
  searchDescription: boolean;
  enableQuist: boolean;
  hideCancelled: boolean;
  hideConflicting: boolean;
  hideFirstYearSeminars: boolean;
  hideGraduateCourses: boolean;
  hideDiscussionSections: boolean;
  selectSortBy: SortByOption;
  sortOrder: SortOrderType;
};

export const defaultFilters: Filters = {
  searchText: '',
  selectSubjects: [],
  selectSkillsAreas: [],
  overallBounds: [1, 5],
  workloadBounds: [1, 5],
  professorBounds: [1, 5],
  selectSeasons: [{ value: CUR_SEASON, label: toSeasonString(CUR_SEASON) }],
  selectDays: [],
  timeBounds: [toRangeTime('7:00'), toRangeTime('22:00')],
  enrollBounds: [1, 528],
  numBounds: [0, 1000],
  selectSchools: [],
  selectCredits: [],
  selectCourseInfoAttributes: [],
  searchDescription: false,
  enableQuist: false,
  hideCancelled: true,
  hideConflicting: false,
  hideFirstYearSeminars: false,
  hideGraduateCourses: false,
  hideDiscussionSections: true,
  selectSortBy: sortByOptions.course_code,
  sortOrder: 'asc',
};

export type FilterHandle<K extends keyof Filters> = ReturnType<
  typeof useFilterState<K>
>;

function useFilterState<K extends keyof Filters>(key: K) {
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

const targetTypes = {
  categorical: new Set([
    'school',
    'season',
    'type',
    'subject',
    'course-code',
  ] as const),
  numeric: new Set([
    'rating',
    'workload',
    'professor-rating',
    'number',
    'enrollment',
    'credits',
  ] as const),
  set: new Set([
    'skills',
    'areas',
    'days',
    'info-attributes',
    'subjects',
    'professor-names',
  ] as const),
  boolean: new Set([
    'cancelled',
    'conflicting',
    'grad',
    'discussion',
    'fysem',
    'colsem',
  ] as const),
  text: new Set(['title', 'description', 'location'] as const),
};

export function SearchProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const searchText = useFilterState('searchText');
  const selectSubjects = useFilterState('selectSubjects');
  const selectSkillsAreas = useFilterState('selectSkillsAreas');
  const overallBounds = useFilterState('overallBounds');
  const workloadBounds = useFilterState('workloadBounds');
  const professorBounds = useFilterState('professorBounds');
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
  const enableQuist = useFilterState('enableQuist');
  const hideCancelled = useFilterState('hideCancelled');
  const hideConflicting = useFilterState('hideConflicting');
  const hideFirstYearSeminars = useFilterState('hideFirstYearSeminars');
  const hideGraduateCourses = useFilterState('hideGraduateCourses');
  const hideDiscussionSections = useFilterState('hideDiscussionSections');

  const selectSortBy = useFilterState('selectSortBy');
  const sortOrder = useFilterState('sortOrder');

  const [startTime, setStartTime] = useState(Date.now());
  const [duration, setDuration] = useState(0);

  const { user } = useUser();

  const numFriends = useMemo(() => {
    if (!user.friends) return {};
    return getNumFriends(user.friends);
  }, [user.friends]);

  const processedSearchText = useMemo(
    () =>
      searchText.value
        .split(/\s+/u)
        .filter(Boolean)
        .map((token) => token.toLowerCase()),
    [searchText.value],
  );
  const processedSubjects = useMemo(
    () => selectSubjects.value.map((x) => x.value),
    [selectSubjects.value],
  );
  const processedSkillsAreas = useMemo(
    () =>
      selectSkillsAreas.value.flatMap((x) =>
        // Old courses only have 'L' label
        x.value === 'L' ? ['L', 'L1', 'L2', 'L3', 'L4', 'L5'] : x.value,
      ),
    [selectSkillsAreas.value],
  );
  const processedSeasons = useMemo(() => {
    if (selectSeasons.value.length === 0) {
      // Nothing selected, so default to all seasons.
      return seasons.slice(0, 15);
    }
    return selectSeasons.value.map((x) => x.value);
  }, [selectSeasons.value]);
  const processedDays = useMemo(
    () => selectDays.value.map((x) => x.value),
    [selectDays.value],
  );
  const processedSchools = useMemo(
    () => selectSchools.value.map((x) => x.value),
    [selectSchools.value],
  );
  const processedCredits = useMemo(
    () => selectCredits.value.map((x) => x.value),
    [selectCredits.value],
  );
  const processedCourseInfoAttributes = useMemo(
    () => selectCourseInfoAttributes.value.map((x) => x.value),
    [selectCourseInfoAttributes.value],
  );
  // If the bounds are unaltered, we need to set them to null
  // to include unrated courses
  const processedOverallBounds = useMemo(
    () => (overallBounds.hasChanged ? overallBounds.value : null),
    [overallBounds],
  );
  const processedWorkloadBounds = useMemo(
    () => (workloadBounds.hasChanged ? workloadBounds.value : null),
    [workloadBounds],
  );
  const processedProfessorBounds = useMemo(
    () => (professorBounds.hasChanged ? professorBounds.value : null),
    [professorBounds],
  );
  const processedTimeBounds = useMemo(
    () => (timeBounds.hasChanged ? timeBounds.value : null),
    [timeBounds],
  );
  const processedEnrollBounds = useMemo(
    () => (enrollBounds.hasChanged ? enrollBounds.value : null),
    [enrollBounds],
  );
  const processedNumBounds = useMemo(
    () => (numBounds.hasChanged ? numBounds.value : null),
    [numBounds],
  );

  const {
    loading: coursesLoading,
    courses: courseData,
    error: courseLoadError,
  } = useCourseData(processedSeasons);

  // If multiple seasons are queried, the season is indicated
  const multiSeasons = processedSeasons.length !== 1;

  const { worksheetNumber } = useWorksheet();

  const { data: worksheetInfo } = useWorksheetInfo(
    user.worksheets,
    processedSeasons,
    worksheetNumber,
  );

  const queryEvaluator = useMemo(
    () =>
      buildEvaluator(targetTypes, (listing: Listing, key) => {
        switch (key) {
          case 'rating':
            return getOverallRatings(listing, 'stat');
          case 'workload':
            return getWorkloadRatings(listing, 'stat');
          case 'professor-rating':
            return getProfessorRatings(listing, 'stat');
          case 'enrollment':
            return getEnrolled(listing, 'stat');
          case 'days':
            return Object.keys(listing.times_by_day).map((d) =>
              ['Thursday', 'Saturday', 'Sunday'].includes(d)
                ? d.slice(0, 2)
                : d[0],
            );
          case 'info-attributes':
            return listing.flag_info;
          case 'skills':
            return listing.skills.some((s) => s.startsWith('L'))
              ? [...listing.skills, 'L']
              : listing.skills;
          case 'subjects':
            return listing.all_course_codes.map((code) => code.split(' ')[0]);
          case 'cancelled':
            return listing.extra_info !== 'ACTIVE';
          case 'conflicting':
            return (
              listing.times_summary !== 'TBA' &&
              !isInWorksheet(
                listing.season_code,
                listing.crn,
                worksheetNumber,
                user.worksheets,
              ) &&
              checkConflict(worksheetInfo, listing).length > 0
            );
          case 'grad':
            return isGraduate(listing);
          case 'discussion':
            return isDiscussionSection(listing);
          case 'fysem':
            return listing.fysem !== false;
          case 'colsem':
            // TODO: query for colsem
            return false;
          case 'location':
            return listing.locations_summary;
          case 'season':
            return listing.season_code;
          case 'professor-names':
            return listing.professor_names;
          case 'course-code':
            return listing.course_code;
          case 'type':
            return 'lecture'; // TODO: add other types like fysem, discussion, etc.
          case 'number':
            return Number(listing.number.replace(/\D/gu, ''));
          case '*': {
            const base = `${listing.subject} ${listing.number} ${listing.title} ${listing.professor_names.join(' ')}`;
            if (searchDescription.value && listing.description)
              return `${base} ${listing.description}`;
            return base;
          }
          default:
            return listing[key];
        }
      }),
    [searchDescription.value, worksheetInfo, worksheetNumber, user.worksheets],
  );

  const quistPredicate = useMemo(() => {
    if (!enableQuist.value) return null;
    try {
      return queryEvaluator(searchText.value);
    } catch {
      Sentry.addBreadcrumb({
        category: 'quist',
        message: `Parsing quist query "${searchText.value}"`,
        level: 'info',
      });
      Sentry.captureException(new Error('Quist query failed to parse'));
      return null;
    }
  }, [enableQuist.value, queryEvaluator, searchText.value]);

  // Filtered and sorted courses
  const searchData = useMemo(() => {
    if (coursesLoading || courseLoadError) return [];

    const listings = processedSeasons.flatMap((seasonCode) => {
      const data = courseData[seasonCode];
      if (!data) return [];
      return [...data.values()];
    });

    const filtered = listings.filter((listing) => {
      if (processedOverallBounds !== null) {
        const overall = getOverallRatings(listing, 'stat');
        if (overall === null) return false;
        const rounded = Math.round(overall * 10) / 10;
        if (
          rounded < processedOverallBounds[0] ||
          rounded > processedOverallBounds[1]
        )
          return false;
      }

      if (processedWorkloadBounds !== null) {
        const workload = getWorkloadRatings(listing, 'stat');
        if (workload === null) return false;
        const rounded = Math.round(workload * 10) / 10;
        if (
          rounded < processedWorkloadBounds[0] ||
          rounded > processedWorkloadBounds[1]
        )
          return false;
      }

      if (processedProfessorBounds !== null) {
        const professorRate = getProfessorRatings(listing, 'stat');
        if (professorRate === null) return false;
        const rounded = Math.round(professorRate * 10) / 10;
        if (
          rounded < processedProfessorBounds[0] ||
          rounded > processedProfessorBounds[1]
        )
          return false;
      }

      if (processedTimeBounds !== null) {
        const times = getDayTimes(listing);
        if (
          !times.some(
            (time) =>
              toRangeTime(time.start) >= processedTimeBounds[0] &&
              toRangeTime(time.end) <= processedTimeBounds[1],
          )
        )
          return false;
      }

      if (processedEnrollBounds !== null) {
        const enrollment = getEnrolled(listing, 'stat');
        if (
          enrollment === null ||
          enrollment < processedEnrollBounds[0] ||
          enrollment > processedEnrollBounds[1]
        )
          return false;
      }

      if (processedNumBounds !== null) {
        const number = Number(listing.number.replace(/\D/gu, ''));
        if (
          number < processedNumBounds[0] ||
          (processedNumBounds[1] < 1000 && number > processedNumBounds[1])
        )
          return false;
      }

      if (hideCancelled.value && listing.extra_info !== 'ACTIVE') return false;

      if (
        hideConflicting.value &&
        listing.times_summary !== 'TBA' &&
        !isInWorksheet(
          listing.season_code,
          listing.crn,
          worksheetNumber,
          user.worksheets,
        ) &&
        checkConflict(worksheetInfo, listing).length > 0
      )
        return false;

      if (hideDiscussionSections.value && isDiscussionSection(listing))
        return false;

      if (hideFirstYearSeminars.value && listing.fysem !== false) return false;

      if (hideGraduateCourses.value && isGraduate(listing)) return false;

      if (
        processedSubjects.length !== 0 &&
        !processedSubjects.includes(listing.subject)
      )
        return false;

      if (processedDays.length !== 0) {
        const days = getDayTimes(listing).map((daytime) => daytime.day);
        if (
          days.some((day) => !processedDays.includes(day)) ||
          processedDays.some((day) => !days.includes(day))
        )
          return false;
      }

      if (processedSkillsAreas.length !== 0) {
        const listingSkillsAreas = [...listing.areas, ...listing.skills];
        if (
          !processedSkillsAreas.some((area) =>
            listingSkillsAreas.includes(area),
          )
        )
          return false;
      }

      if (
        processedCredits.length !== 0 &&
        listing.credits !== null &&
        !processedCredits.includes(listing.credits)
      )
        return false;

      if (
        processedCourseInfoAttributes.length !== 0 &&
        !processedCourseInfoAttributes.some((attr) =>
          listing.flag_info.includes(attr),
        )
      )
        return false;

      if (
        processedSchools.length !== 0 &&
        listing.school !== null &&
        !processedSchools.includes(listing.school)
      )
        return false;

      if (quistPredicate) return quistPredicate(listing);
      // Handle search text. Each token must match something.
      for (const token of processedSearchText) {
        // First character of the course number
        const numberFirstChar = listing.number.charAt(0);
        if (
          listing.subject.toLowerCase().startsWith(token) ||
          listing.number.toLowerCase().startsWith(token) ||
          // For course numbers that start with a letter,
          // exclude this letter when comparing with the search token
          (/\D/u.test(numberFirstChar) &&
            listing.number
              .toLowerCase()
              .startsWith(numberFirstChar.toLowerCase() + token)) ||
          (searchDescription.value &&
            listing.description?.toLowerCase().includes(token)) ||
          listing.title.toLowerCase().includes(token) ||
          listing.professor_names.some((professor) =>
            professor.toLowerCase().includes(token),
          ) ||
          // Use `times_by_day` instead of `locations_summary` to account for
          // multiple locations.
          Object.values(listing.times_by_day)
            .flat()
            .flatMap((x) => x[2].toLowerCase().split(' '))
            .some(
              (loc) =>
                // Never allow a number to match a room number, as numbers are
                // more likely to be course numbers.
                // TODO: this custom parsing is not ideal. `times_by_day` should
                // give a more structured location format.
                !/^\d+$/u.test(loc) &&
                loc !== '-' &&
                loc !== 'tba' &&
                loc.startsWith(token),
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
      { key: selectSortBy.value.value, type: sortOrder.value },
      numFriends,
    );
  }, [
    coursesLoading,
    courseLoadError,
    processedSeasons,
    selectSortBy.value.value,
    sortOrder.value,
    numFriends,
    courseData,
    processedOverallBounds,
    processedWorkloadBounds,
    processedProfessorBounds,
    processedTimeBounds,
    processedEnrollBounds,
    processedNumBounds,
    hideCancelled.value,
    hideConflicting.value,
    worksheetNumber,
    user.worksheets,
    worksheetInfo,
    hideDiscussionSections.value,
    hideFirstYearSeminars.value,
    hideGraduateCourses.value,
    processedSubjects,
    processedDays,
    processedSkillsAreas,
    processedCredits,
    processedCourseInfoAttributes,
    processedSchools,
    quistPredicate,
    processedSearchText,
    searchDescription.value,
  ]);

  const filters = useMemo(
    () => ({
      searchText,
      selectSubjects,
      selectSkillsAreas,
      overallBounds,
      workloadBounds,
      professorBounds,
      selectSeasons,
      selectDays,
      timeBounds,
      enrollBounds,
      numBounds,
      selectSchools,
      selectCredits,
      selectCourseInfoAttributes,
      searchDescription,
      enableQuist,
      hideCancelled,
      hideConflicting,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      selectSortBy,
      sortOrder,
    }),
    [
      searchText,
      selectSubjects,
      selectSkillsAreas,
      overallBounds,
      workloadBounds,
      professorBounds,
      selectSeasons,
      selectDays,
      timeBounds,
      enrollBounds,
      numBounds,
      selectSchools,
      selectCredits,
      selectCourseInfoAttributes,
      searchDescription,
      enableQuist,
      hideCancelled,
      hideConflicting,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      selectSortBy,
      sortOrder,
    ],
  );

  useEffect(() => {
    if (!coursesLoading) {
      const durInSecs = Math.abs(Date.now() - startTime) / 1000;
      setDuration(durInSecs);
    }
  }, [filters, coursesLoading, searchData, startTime]);

  const store = useMemo(
    () => ({
      filters,
      coursesLoading,
      searchData,
      multiSeasons,
      numFriends,
      duration,
      setStartTime,
    }),
    [
      filters,
      coursesLoading,
      searchData,
      multiSeasons,
      numFriends,
      duration,
      setStartTime,
    ],
  );

  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext)!;
