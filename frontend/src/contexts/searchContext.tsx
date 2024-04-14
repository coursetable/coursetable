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
  // This is the only way to help with TS inference
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

// Empty vs. default:
// "Empty" means it won't filter any course out; "default" just means it's like
// that on first load. Only the below three filters have different empty states.
// Filters are rendered as "active" (blue) when they are non-empty.
// The "cross" can reset the button to empty.
// The only way to reset to default is to click the "reset" button.
const emptyFilters: Filters = {
  ...defaultFilters,
  selectSeasons: [],
  hideCancelled: false,
  hideDiscussionSections: false,
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
      isDefault: isEqual(value, defaultFilters[key]),
      isNonEmpty: !isEqual(value, emptyFilters[key]),
      resetToDefault: () => setValue(defaultFilters[key]),
      resetToEmpty: () => setValue(emptyFilters[key]),
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
      // For empty bounds, don't apply filters at all to include no ratings
      if (overallBounds.isNonEmpty) {
        const overall = getOverallRatings(listing, 'stat');
        if (overall === null) return false;
        const rounded = Math.round(overall * 10) / 10;
        if (
          rounded < overallBounds.value[0] ||
          rounded > overallBounds.value[1]
        )
          return false;
      }

      if (workloadBounds.isNonEmpty) {
        const workload = getWorkloadRatings(listing, 'stat');
        if (workload === null) return false;
        const rounded = Math.round(workload * 10) / 10;
        if (
          rounded < workloadBounds.value[0] ||
          rounded > workloadBounds.value[1]
        )
          return false;
      }

      if (professorBounds.isNonEmpty) {
        const professorRate = getProfessorRatings(listing, 'stat');
        if (professorRate === null) return false;
        const rounded = Math.round(professorRate * 10) / 10;
        if (
          rounded < professorBounds.value[0] ||
          rounded > professorBounds.value[1]
        )
          return false;
      }

      if (timeBounds.isNonEmpty) {
        const times = getDayTimes(listing);
        if (
          !times.some(
            (time) =>
              toRangeTime(time.start) >= timeBounds.value[0] &&
              toRangeTime(time.end) <= timeBounds.value[1],
          )
        )
          return false;
      }

      if (enrollBounds.isNonEmpty) {
        const enrollment = getEnrolled(listing, 'stat');
        if (
          enrollment === null ||
          enrollment < enrollBounds.value[0] ||
          enrollment > enrollBounds.value[1]
        )
          return false;
      }

      if (numBounds.isNonEmpty) {
        const number = Number(listing.number.replace(/\D/gu, ''));
        if (
          number < numBounds.value[0] ||
          (numBounds.value[1] < 1000 && number > numBounds.value[1])
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
        selectSubjects.value.length !== 0 &&
        !selectSubjects.value.some((option) => option.value === listing.subject)
      )
        return false;

      if (selectDays.value.length !== 0) {
        const days = getDayTimes(listing).map((daytime) => daytime.day);
        const selectDayValues = selectDays.value.map((day) => day.value);
        // Require the two sets to be equal
        if (
          days.some((day) => !selectDayValues.includes(day)) ||
          selectDayValues.some((day) => !days.includes(day))
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
        selectCredits.value.length !== 0 &&
        listing.credits !== null &&
        !selectCredits.value.some((option) => option.value === listing.credits)
      )
        return false;

      if (
        selectCourseInfoAttributes.value.length !== 0 &&
        !selectCourseInfoAttributes.value.some((option) =>
          listing.flag_info.includes(option.value),
        )
      )
        return false;

      if (
        selectSchools.value.length !== 0 &&
        listing.school !== null &&
        !selectSchools.value.some((option) => option.value === listing.school)
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
    overallBounds,
    workloadBounds,
    professorBounds,
    timeBounds,
    enrollBounds,
    numBounds,
    hideCancelled.value,
    hideConflicting.value,
    worksheetNumber,
    user.worksheets,
    worksheetInfo,
    hideDiscussionSections.value,
    hideFirstYearSeminars.value,
    hideGraduateCourses.value,
    selectSubjects.value,
    selectDays.value,
    processedSkillsAreas,
    selectCredits.value,
    selectCourseInfoAttributes.value,
    selectSchools.value,
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

  // TODO this is not an effect
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
