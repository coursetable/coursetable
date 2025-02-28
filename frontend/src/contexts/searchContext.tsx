import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import debounce from 'lodash.debounce';
import { buildEvaluator } from 'quist';
import { useShallow } from 'zustand/react/shallow';
import { useCourseData, useWorksheetInfo, seasons } from './ferryContext';
import { CUR_SEASON } from '../config';
import buildingsData from '../generated/buildings.json';
import type { Buildings } from '../generated/graphql-types';
import type { CatalogListing } from '../queries/api';
import type { Season } from '../queries/graphql-types';
import { useStore } from '../store';
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
  course_code: 'Sort by course code',
  title: 'Sort by course title',
  friend: 'Sort by # of friends',
  added: 'Sort by date added',
  last_modified: 'Sort by last modified',
  overall: 'Sort by course rating',
  average_professor_rating: 'Sort by professor rating',
  workload: 'Sort by workload',
  average_gut_rating: 'Sort by guts (overall - workload)',
  enrollment: 'Sort by last enrollment',
  time: 'Sort by days & times',
  location: 'Sort by locations',
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

const buildings = buildingsData as Buildings[];

export const buildingOptions = buildings.map(
  (building): Option => ({
    value: building.code,
    label: building.building_name
      ? `${building.code} (${building.building_name})`
      : building.code,
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

export const booleanAttributes = {
  fysem: 'First-year seminar',
  sysem: 'Sophomore seminar',
  colsem: 'College seminar',
  discussion: 'Discussion section',
  graduate: 'Graduate-level course',
};

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

export type BooleanOptions =
  | 'searchDescription'
  | 'enableQuist'
  | 'hideCancelled'
  | 'hideConflicting';

export type BooleanAttributes = keyof typeof booleanAttributes;

export interface CategoricalFilters {
  selectSubjects: string;
  selectSkillsAreas: string;
  selectSeasons: Season;
  selectDays: number;
  selectSchools: string;
  selectCredits: number;
  selectCourseInfoAttributes: string;
  selectBuilding: string;
}

export type NumericFilters =
  | 'overallBounds'
  | 'workloadBounds'
  | 'professorBounds'
  | 'timeBounds'
  | 'enrollBounds'
  | 'numBounds';

// All attributes that one class can have multiple of; these filters will show
// a "union or intersection" button. Declaring it as a separate data structure
// instead of colocating it with each categorical filter definition, because
// this seems to make the categorical filter definitions more consistent.
export type IntersectableFilters =
  | 'selectSubjects'
  | 'selectSkillsAreas'
  | 'selectDays'
  | 'selectSchools'
  | 'selectCourseInfoAttributes';

export type Filters = {
  [P in BooleanOptions]: boolean;
} & {
  [P in keyof CategoricalFilters]: Option<CategoricalFilters[P]>[];
} & {
  [P in NumericFilters]: [number, number];
} & {
  searchText: string;
  selectSortBy: Option<SortKeys>;
  sortOrder: SortOrderType;
  intersectingFilters: IntersectableFilters[];
  includeAttributes: BooleanAttributes[];
  excludeAttributes: BooleanAttributes[];
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
  selectBuilding: 'Building',
  enableQuist: 'Enable Quist',
  // "Cancelled" and "conflicting" are also boolean attributes, but there's
  // little reason one would want to "only include conflicting courses", so
  // we don't add them to includedAttributes/excludedAttributes.
  hideCancelled: 'Hide cancelled courses',
  hideConflicting: 'Hide courses with conflicting times',
  includeAttributes: 'Include', // Unused
  excludeAttributes: 'Exclude', // Unused
  selectSortBy: 'Sort By', // Unused
  sortOrder: 'Sort Order', // Unused
  intersectingFilters: 'Union or Intersection', // Unused
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
  selectBuilding: [],
  searchDescription: false,
  enableQuist: false,
  hideCancelled: true,
  hideConflicting: false,
  includeAttributes: [],
  excludeAttributes: ['discussion'],
  selectSortBy: sortByOptions.course_code,
  sortOrder: 'asc',
  intersectingFilters: [],
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
  excludeAttributes: [],
};

export type FilterHandle<K extends keyof Filters> = ReturnType<
  typeof useFilterState<K>
>;

function useFilterState<K extends keyof Filters>(key: K) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [value, setValue] = useState(() => {
    try {
      const urlValue = searchParams.get(key);
      if (urlValue) {
        return getFilterFromParams(
          key,
          decodeURIComponent(urlValue),
          defaultFilters[key],
        );
      }
      return defaultFilters[key];
    } catch {
      return defaultFilters[key];
    }
  });

  useEffect(() => {
    if (location.pathname === '/catalog') {
      try {
        const newUrl = createFilterLink(key, value, defaultFilters[key]);
        if (newUrl !== location.search) {
          sessionStorage.setItem('lastCatalogSearch', newUrl);
          setSearchParams(new URLSearchParams(newUrl.slice(1)));
        }
      } catch {}
    }
  }, [key, value, location.pathname, location.search, setSearchParams]);

  return useMemo(
    () => ({
      value,
      set: setValue,
      isDefault: isEqual(value, defaultFilters[key]),
      isNonEmpty: !isEqual(value, emptyFilters[key]),
      resetToDefault: () => setValue(defaultFilters[key]),
      resetToEmpty: () => setValue(emptyFilters[key]),
    }),
    [value, key, setValue],
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
    'building-codes',
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
  text: new Set([
    'title',
    'description',
    'location',
    'added',
    'last_modified',
  ] as const),
};

function applyIntersectableFilter<T extends string | number>(
  filterValue: T[],
  value: T[],
  isIntersecting: boolean,
) {
  if (isIntersecting)
    return filterValue.every((option) => value.includes(option));
  return filterValue.some((option) => value.includes(option));
}

function applyBooleanAttributes(
  course: CatalogListing,
  includeAttributes: BooleanAttributes[],
  excludeAttributes: BooleanAttributes[],
) {
  const courseAttributes: BooleanAttributes[] = [];
  if (isGraduate(course)) courseAttributes.push('graduate');
  if (isDiscussionSection(course.course)) courseAttributes.push('discussion');
  if (course.course.fysem) courseAttributes.push('fysem');
  if (course.course.colsem) courseAttributes.push('colsem');
  if (course.course.sysem) courseAttributes.push('sysem');
  // If non-zero attributes should be included, we join them with OR
  if (
    includeAttributes.length > 0 &&
    !includeAttributes.some((attr) => courseAttributes.includes(attr))
  )
    return false;
  // If non-zero attributes should be excluded, we join them with AND
  if (
    excludeAttributes.length > 0 &&
    excludeAttributes.some((attr) => courseAttributes.includes(attr))
  )
    return false;
  return true;
}

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
  const selectBuilding = useFilterState('selectBuilding');
  const selectCourseInfoAttributes = useFilterState(
    'selectCourseInfoAttributes',
  );
  const searchDescription = useFilterState('searchDescription');
  const enableQuist = useFilterState('enableQuist');
  const hideCancelled = useFilterState('hideCancelled');
  const hideConflicting = useFilterState('hideConflicting');
  const includeAttributes = useFilterState('includeAttributes');
  const excludeAttributes = useFilterState('excludeAttributes');

  const selectSortBy = useFilterState('selectSortBy');
  const sortOrder = useFilterState('sortOrder');

  const intersectingFilters = useFilterState('intersectingFilters');

  const [startTime, setStartTime] = useState(Date.now());
  const [duration, setDuration] = useState(0);

  const [searchData, setSearchData] = useState<CatalogListing[] | null>(null);

  const { worksheets, friends, getRelevantWorksheetNumber } = useStore(
    useShallow((state) => ({
      worksheets: state.worksheets,
      friends: state.friends,
      getRelevantWorksheetNumber: state.getRelevantWorksheetNumber,
    })),
  );

  const numFriends = useMemo(() => {
    if (!friends) return {};
    return getNumFriends(friends);
  }, [friends]);

  const processedSearchText = useMemo(
    () =>
      searchText.value
        .split(/\s+/u)
        .filter(Boolean)
        .map((token: string) => token.toLowerCase()),
    [searchText.value],
  );
  const processedSkillsAreas = useMemo(
    () =>
      selectSkillsAreas.value.flatMap((x: Option) =>
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
    return selectSeasons.value.map((x: Option<Season>) => x.value);
  }, [selectSeasons.value]);

  const {
    loading: coursesLoading,
    courses: courseData,
    error: courseLoadError,
  } = useCourseData(processedSeasons);

  // If multiple seasons are queried, the season is indicated
  const multiSeasons = processedSeasons.length !== 1;

  const { data: worksheetInfo } = useWorksheetInfo(
    worksheets,
    processedSeasons,
    getRelevantWorksheetNumber,
  );

  const queryEvaluator = useMemo(
    () =>
      buildEvaluator(targetTypes, (listing: CatalogListing, key) => {
        switch (key) {
          case 'added':
            return listing.course.time_added as string;
          case 'last_modified':
            return listing.course.last_updated as string;
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
              !isInWorksheet(
                listing,
                getRelevantWorksheetNumber(listing.course.season_code),
                worksheets,
              ) &&
              checkConflict(worksheetInfo, listing).length > 0
            );
          case 'grad':
            return isGraduate(listing);
          case 'discussion':
            return isDiscussionSection(listing.course);
          case 'fysem':
            return listing.course.fysem;
          case 'colsem':
            return listing.course.colsem;
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
          case 'building-codes':
            return listing.course.course_meetings
              .map((m) => m.location?.building.code)
              .filter((x) => x !== undefined);
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
      getRelevantWorksheetNumber,
      worksheets,
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
      const listings = processedSeasons.flatMap((seasonCode: Season) => {
        const data = courseData[seasonCode]?.data;
        if (!data) return [];
        return [...data.values()];
      });

      const filtered = listings.filter((listing: CatalogListing) => {
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
          !isInWorksheet(
            listing,
            getRelevantWorksheetNumber(listing.course.season_code),
            worksheets,
          ) &&
          checkConflict(worksheetInfo, listing).length > 0
        )
          return false;

        if (selectSubjects.value.length !== 0) {
          // Never show a course that doesn't contain any of the selected
          // subjects, even when it has a cross listing that does
          // TODO: we don't need this once we group cross-listings
          if (
            !selectSubjects.value.some(
              (option: Option) => listing.subject === option.value,
            )
          )
            return false;
          if (
            !applyIntersectableFilter(
              selectSubjects.value.map((option: Option) => option.value),
              listing.course.listings.map((l) => l.course_code.split(' ')[0]!),
              intersectingFilters.value.includes('selectSubjects'),
            )
          )
            return false;
        }

        if (selectDays.value.length !== 0) {
          const days = listing.course.course_meetings.flatMap((session) =>
            Object.values(weekdays).filter(
              (day) => session.days_of_week & (1 << day),
            ),
          );
          if (
            !applyIntersectableFilter(
              selectDays.value.map((option: Option<number>) => option.value),
              days,
              intersectingFilters.value.includes('selectDays'),
            )
          )
            return false;
        }

        if (processedSkillsAreas.length !== 0) {
          const listingSkillsAreas = [
            ...listing.course.areas,
            ...listing.course.skills,
          ];
          if (
            !applyIntersectableFilter(
              processedSkillsAreas,
              listingSkillsAreas,
              intersectingFilters.value.includes('selectSkillsAreas'),
            )
          )
            return false;
        }

        if (
          selectCredits.value.length !== 0 &&
          listing.course.credits !== null &&
          !selectCredits.value.some(
            (option: Option<number>) => option.value === listing.course.credits,
          )
        )
          return false;

        if (
          selectBuilding.value.length !== 0 &&
          !selectBuilding.value.some((option) =>
            listing.course.course_meetings.some(
              (m) => m.location?.building.code === option.value,
            ),
          )
        )
          return false;

        if (
          selectCourseInfoAttributes.value.length !== 0 &&
          !applyIntersectableFilter(
            selectCourseInfoAttributes.value.map(
              (option: Option) => option.value,
            ),
            listing.course.course_flags.map((f) => f.flag.flag_text),
            intersectingFilters.value.includes('selectCourseInfoAttributes'),
          )
        )
          return false;

        if (selectSchools.value.length !== 0) {
          // Same as selectSubjects
          if (
            !selectSchools.value.some(
              (option: Option) => listing.school === option.value,
            )
          )
            return false;
          if (
            !applyIntersectableFilter(
              selectSchools.value.map((option: Option) => option.value),
              listing.course.listings
                .map((l) => l.school)
                .filter((x) => x.length > 0),
              intersectingFilters.value.includes('selectSchools'),
            )
          )
            return false;
        }

        if (
          !applyBooleanAttributes(
            listing,
            includeAttributes.value,
            excludeAttributes.value,
          )
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
      getRelevantWorksheetNumber,
      worksheets,
      worksheetInfo,
      includeAttributes.value,
      excludeAttributes.value,
      selectSubjects.value,
      selectDays.value,
      processedSkillsAreas,
      selectCredits.value,
      selectCourseInfoAttributes.value,
      selectSchools.value,
      quistPredicate,
      searchDescription.value,
      intersectingFilters.value,
      selectBuilding.value,
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
      includeAttributes,
      excludeAttributes,
      selectSortBy,
      sortOrder,
      intersectingFilters,
      selectBuilding,
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
      includeAttributes,
      excludeAttributes,
      selectSortBy,
      sortOrder,
      intersectingFilters,
      selectBuilding,
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
