import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as Sentry from '@sentry/react';
import debounce from 'lodash.debounce';
import { buildEvaluator } from 'quist';
import { useCourseData, useWorksheetInfo, seasons } from './ferryContext';
import { useWorksheet } from './worksheetContext';
import { CUR_SEASON } from '../config';
import type { CatalogListing } from '../queries/api';
import type { Season } from '../queries/graphql-types';
import { useStore } from '../store';
import { useSessionStorageState } from '../utilities/browserStorage';
import { isEqual } from '../utilities/common';
import {
  skillsAreas,
  subjects,
  schools,
  courseInfoAttributes,
  weekdays,
} from '../utilities/constants';
import {
  isInWorksheet,
  checkConflict,
  getEnrolled,
  getNumFriends,
  getOverallRatings,
  getWorkloadRatings,
  getProfessorRatings,
  isGraduate,
  isDiscussionSection,
  sortCourses,
  toLocationsSummary,
  toRangeTime,
  toSeasonString,
  toWeekdayStrings,
  type NumFriendsReturn,
} from '../utilities/course';
import { createFilterLink, getFilterFromParams } from '../utilities/params';

export type Option<T extends string | number = string> = {
  label: string;
  value: T;
};

export const skillsAreasOptions = ['Areas', 'Skills'].map((type) => ({
  label: type,
  options: Object.entries(
    skillsAreas[type.toLowerCase() as 'areas' | 'skills'],
  ).map(
    ([code, name]): Option => ({
      label: `${code} - ${name}`,
      value: code,
    }),
  ),
}));

const sortCriteria = {
  course_code: 'Sort by Course Code',
  title: 'Sort by Course Title',
  friend: 'Sort by Friends',
  overall: 'Sort by Course Rating',
  average_professor_rating: 'Sort by Professor Rating',
  workload: 'Sort by Workload',
  average_gut_rating: 'Sort by Guts (Overall - Workload)',
  enrollment: 'Sort by Last Enrollment',
  time: 'Sort by Days & Times',
  location: 'Sort by Locations',
};

export const sortByOptions = Object.fromEntries(
  Object.entries(sortCriteria).map(([k, v]) => [k, { value: k, label: v }]),
) as { [k in SortKeys]: Option<SortKeys> };

export type SortKeys = keyof typeof sortCriteria;

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
  filters: FilterList;
  coursesLoading: boolean;
  searchData: CatalogListing[] | null;
  multiSeasons: boolean;
  numFriends: NumFriendsReturn;
  duration: number;
  setStartTime: React.Dispatch<React.SetStateAction<number>>;
};

const SearchContext = createContext<Store | undefined>(undefined);
SearchContext.displayName = 'SearchContext';

export type BooleanFilters =
  | 'searchDescription'
  | 'enableQuist'
  | 'hideCancelled'
  | 'hideConflicting'
  | 'hideFirstYearSeminars'
  | 'hideGraduateCourses'
  | 'hideDiscussionSections';

export interface CategoricalFilters {
  selectSubjects: string;
  selectSkillsAreas: string;
  selectSeasons: Season;
  selectDays: number;
  selectSchools: string;
  selectCredits: number;
  selectCourseInfoAttributes: string;
}

export type NumericFilters =
  | 'overallBounds'
  | 'workloadBounds'
  | 'professorBounds'
  | 'timeBounds'
  | 'enrollBounds'
  | 'numBounds';

export type Filters = {
  [P in BooleanFilters]: boolean;
} & {
  [P in keyof CategoricalFilters]: Option<CategoricalFilters[P]>[];
} & {
  [P in NumericFilters]: [number, number];
} & {
  searchText: string;
  selectSortBy: Option<SortKeys>;
  sortOrder: SortOrderType;
};

export type FilterList = { [K in keyof Filters]: FilterHandle<K> };

export const filterLabels: { [K in keyof Filters]: string } = {
  searchText: 'Search',
  selectSubjects: 'Subject',
  selectSkillsAreas: 'Areas/Skills',
  overallBounds: 'Overall',
  workloadBounds: 'Workload',
  professorBounds: 'Professor',
  selectSeasons: 'Season',
  selectDays: 'Day',
  timeBounds: 'Time',
  enrollBounds: '# Enrolled',
  numBounds: 'Course #',
  selectSchools: 'School',
  selectCredits: 'Credit',
  selectCourseInfoAttributes: 'Info',
  searchDescription: 'Include descriptions in search',
  enableQuist: 'Enable Quist',
  hideCancelled: 'Hide cancelled courses',
  hideConflicting: 'Hide courses with conflicting times',
  hideFirstYearSeminars: 'Hide first-year seminars',
  hideGraduateCourses: 'Hide graduate courses',
  hideDiscussionSections: 'Hide discussion sections',
  selectSortBy: 'Sort By', // Unused
  sortOrder: 'Sort Order', // Unused
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
  hideDiscussionSections: true,
};

export type FilterHandle<K extends keyof Filters> = ReturnType<
  typeof useFilterState<K>
>;

function useFilterState<K extends keyof Filters>(key: K) {
  // TODO: can't use react-router because this is outside the router
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );
  const [value, setValue] = useSessionStorageState(key, () =>
    getFilterFromParams(
      key,
      decodeURIComponent(searchParams.get(key) ?? ''),
      defaultFilters[key],
    ),
  );
  const setValueWithSync = useCallback(
    (v: Filters[K]) => {
      setValue(v);
      // TODO: can't use react-router because this is outside the router
      window.history.pushState(
        null,
        '',
        createFilterLink(key, v, defaultFilters[key]),
      );
    },
    [setValue, key],
  );

  return useMemo(
    () => ({
      value,
      set: setValueWithSync,
      isDefault: isEqual(value, defaultFilters[key]),
      isNonEmpty: !isEqual(value, emptyFilters[key]),
      resetToDefault: () => setValueWithSync(defaultFilters[key]),
      resetToEmpty: () => setValueWithSync(emptyFilters[key]),
    }),
    [value, key, setValueWithSync],
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
    'listings.subjects',
    'listings.course-codes',
    'listings.schools',
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

  const [searchData, setSearchData] = useState<CatalogListing[] | null>(null);

  const user = useStore((state) => state.user);

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

  const { viewedWorksheetNumber } = useWorksheet();

  const { data: worksheetInfo } = useWorksheetInfo(
    user.worksheets,
    processedSeasons,
    viewedWorksheetNumber,
  );

  const queryEvaluator = useMemo(
    () =>
      buildEvaluator(targetTypes, (listing: CatalogListing, key) => {
        switch (key) {
          case 'rating':
            return getOverallRatings(listing.course, 'stat');
          case 'workload':
            return getWorkloadRatings(listing.course, 'stat');
          case 'professor-rating':
            return getProfessorRatings(listing.course, 'stat');
          case 'enrollment':
            return getEnrolled(listing.course, 'stat');
          case 'days':
            return toWeekdayStrings(
              listing.course.course_meetings.reduce(
                // Each days_of_week is a bitmask. Join them to get all days.
                (acc, m) => acc | m.days_of_week,
                0,
              ),
            );
          case 'info-attributes':
            return listing.course.course_flags.map((f) => f.flag.flag_text);
          case 'skills':
            return listing.course.skills.some((s) => s.startsWith('L'))
              ? [...listing.course.skills, 'L']
              : listing.course.skills;
          case 'subjects':
            return listing.course.listings.map(
              (l) => l.course_code.split(' ')[0],
            );
          case 'cancelled':
            return listing.course.extra_info !== 'ACTIVE';
          case 'conflicting':
            return (
              listing.course.course_meetings.length > 0 &&
              !isInWorksheet(listing, viewedWorksheetNumber, user.worksheets) &&
              checkConflict(worksheetInfo, listing).length > 0
            );
          case 'grad':
            return isGraduate(listing);
          case 'discussion':
            return isDiscussionSection(listing.course);
          case 'fysem':
            return listing.course.fysem !== false;
          case 'colsem':
            return listing.course.colsem !== false;
          case 'location':
            return toLocationsSummary(listing.course);
          case 'season':
            return listing.course.season_code;
          case 'professor-names':
            // "No processors" is displayed in catalog as "TBA"
            // so it seems easiest to make Quist reflect this reality, although
            // "TBA" is not a real value
            // TODO: we should make something like "professor-names:empty"
            if (!listing.course.course_professors.length) return ['TBA'];
            return listing.course.course_professors.map(
              (p) => p.professor.name,
            );
          case 'course-code':
            return listing.course_code;
          case 'type':
            return 'lecture'; // TODO: add other types like fysem, discussion, etc.
          case 'number':
            return Number(listing.number.replace(/\D/gu, ''));
          case 'listings.subjects':
            return listing.course.listings.map((l) => l.subject);
          case 'listings.course-codes':
            return listing.course.listings.map((l) => l.course_code);
          case 'listings.schools':
            return listing.course.listings.map((l) => l.school);
          case 'subject':
          case 'school':
            return listing[key];
          case '*': {
            const base = `${listing.subject} ${listing.number} ${listing.course.title} ${listing.course.course_professors.map((p) => p.professor.name).join(' ')}`;
            if (searchDescription.value && listing.course.description)
              return `${base} ${listing.course.description}`;
            return base;
          }
          case 'title':
          case 'areas':
          case 'description':
          case 'credits':
          default:
            return listing.course[key];
        }
      }),
    [
      searchDescription.value,
      worksheetInfo,
      viewedWorksheetNumber,
      user.worksheets,
    ],
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

  const searchDataPredictate = useCallback(
    (processedSearchTextParam: typeof processedSearchText) => {
      const listings = processedSeasons.flatMap((seasonCode) => {
        const data = courseData[seasonCode]?.data;
        if (!data) return [];
        return [...data.values()];
      });

      const filtered = listings.filter((listing) => {
        // For empty bounds, don't apply filters at all to include no ratings
        if (overallBounds.isNonEmpty) {
          const overall = getOverallRatings(listing.course, 'stat');
          if (overall === null) return false;
          const rounded = Math.round(overall * 10) / 10;
          if (
            rounded < overallBounds.value[0] ||
            rounded > overallBounds.value[1]
          )
            return false;
        }

        if (workloadBounds.isNonEmpty) {
          const workload = getWorkloadRatings(listing.course, 'stat');
          if (workload === null) return false;
          const rounded = Math.round(workload * 10) / 10;
          if (
            rounded < workloadBounds.value[0] ||
            rounded > workloadBounds.value[1]
          )
            return false;
        }

        if (professorBounds.isNonEmpty) {
          const professorRate = getProfessorRatings(listing.course, 'stat');
          if (professorRate === null) return false;
          const rounded = Math.round(professorRate * 10) / 10;
          if (
            rounded < professorBounds.value[0] ||
            rounded > professorBounds.value[1]
          )
            return false;
        }

        if (timeBounds.isNonEmpty) {
          if (
            !listing.course.course_meetings.some(
              (session) =>
                toRangeTime(session.start_time) >= timeBounds.value[0] &&
                toRangeTime(session.end_time) <= timeBounds.value[1],
            )
          )
            return false;
        }

        if (enrollBounds.isNonEmpty) {
          const enrollment = getEnrolled(listing.course, 'stat');
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

        if (hideCancelled.value && listing.course.extra_info !== 'ACTIVE')
          return false;

        if (
          hideConflicting.value &&
          listing.course.course_meetings.length > 0 &&
          !isInWorksheet(listing, viewedWorksheetNumber, user.worksheets) &&
          checkConflict(worksheetInfo, listing).length > 0
        )
          return false;

        if (hideDiscussionSections.value && isDiscussionSection(listing.course))
          return false;

        if (hideFirstYearSeminars.value && listing.course.fysem !== false)
          return false;

        if (hideGraduateCourses.value && isGraduate(listing)) return false;

        if (
          selectSubjects.value.length !== 0 &&
          !selectSubjects.value.some(
            (option) => option.value === listing.subject,
          )
        )
          return false;

        if (selectDays.value.length !== 0) {
          const days = listing.course.course_meetings.flatMap((session) =>
            Object.values(weekdays).filter(
              (day) => session.days_of_week & (1 << day),
            ),
          );
          const selectDayValues = selectDays.value.map((day) => day.value);
          // Require the two sets to be equal
          if (
            days.some((day) => !selectDayValues.includes(day)) ||
            selectDayValues.some((day) => !days.includes(day))
          )
            return false;
        }

        if (processedSkillsAreas.length !== 0) {
          const listingSkillsAreas = [
            ...listing.course.areas,
            ...listing.course.skills,
          ];
          if (
            !processedSkillsAreas.some((area) =>
              listingSkillsAreas.includes(area),
            )
          )
            return false;
        }

        if (
          selectCredits.value.length !== 0 &&
          listing.course.credits !== null &&
          !selectCredits.value.some(
            (option) => option.value === listing.course.credits,
          )
        )
          return false;

        if (
          selectCourseInfoAttributes.value.length !== 0 &&
          !selectCourseInfoAttributes.value.some((option) =>
            listing.course.course_flags.some(
              (f) => f.flag.flag_text === option.value,
            ),
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
        for (const token of processedSearchTextParam) {
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
              listing.course.description?.toLowerCase().includes(token)) ||
            listing.course.title.toLowerCase().includes(token) ||
            listing.course.course_professors.some((p) =>
              p.professor.name.toLowerCase().includes(token),
            ) ||
            listing.course.course_meetings.some(({ location }) =>
              // TODO catalog no longer stores building full name; we should
              // fetch this as a separate query
              // Do not match on room numbers because room numbers are more
              // likely to be course numbers
              location?.building.code.toLowerCase().startsWith(token),
            )
          )
            continue;

          return false;
        }

        return true;
      });
      // Apply sorting order.
      setSearchData(
        sortCourses(
          filtered,
          { key: selectSortBy.value.value, type: sortOrder.value },
          numFriends,
        ),
      );
    },
    [
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
      viewedWorksheetNumber,
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
      searchDescription.value,
    ],
  );

  const searchDataPredicateDebounced = useMemo(
    () =>
      debounce(searchDataPredictate, 300, {
        leading: true,
        trailing: true,
      }),
    [searchDataPredictate],
  );

  // Filtered and sorted courses
  useEffect(() => {
    if (coursesLoading || courseLoadError) return;
    searchDataPredicateDebounced(processedSearchText);
  }, [
    searchDataPredicateDebounced,
    coursesLoading,
    courseLoadError,
    processedSearchText,
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
