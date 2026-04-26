import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type SetStateAction,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import debounce from 'lodash.debounce';
import { buildEvaluator } from 'quist';
import { useShallow } from 'zustand/react/shallow';
import {
  defaultFilters,
  emptyFilters,
  SEARCH_FILTER_KEYS,
} from './searchConstants';
import { searchMatchQuality } from './searchTextMatch';
import type {
  BooleanAttributes,
  FilterHandle,
  Filters,
  Option,
} from './searchTypes';
import { seasons } from '../data/catalogSeasons';
import { useCourseData, useWorksheetInfo } from '../hooks/useFerry';
import type { CatalogListing } from '../queries/api';
import type { Season } from '../queries/graphql-types';
import { useStore } from '../store';
import { isEqual } from '../utilities/common';
import { weekdays } from '../utilities/constants';
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
  toWeekdayStrings,
} from '../utilities/course';
import {
  buildCatalogSearchParams,
  getFilterFromParams,
} from '../utilities/params';

type PendingUrlHydration = {
  search: string;
  updates: Partial<Filters>;
};

function hasAppliedHydration(
  searchFilters: Filters,
  updates: Partial<Filters>,
) {
  return (Object.keys(updates) as (keyof Filters)[]).every((key) => {
    const value = updates[key];
    return value === undefined || isEqual(searchFilters[key], value);
  });
}

function useSearchUrlHydration() {
  const location = useLocation();
  const patchSearchFilters = useStore((s) => s.patchSearchFilters);
  const pendingHydrationRef = useRef<PendingUrlHydration | null>(null);
  const clearPendingHydration = useCallback(() => {
    pendingHydrationRef.current = null;
  }, []);

  useLayoutEffect(() => {
    if (location.pathname !== '/catalog') return;
    const { searchFilters } = useStore.getState();
    const searchParams = new URLSearchParams(location.search);
    const updates = SEARCH_FILTER_KEYS.reduce<Partial<Filters>>((acc, key) => {
      const urlValue = searchParams.get(key);
      if (urlValue === null && key === 'selectSeasons') return acc;
      try {
        const next =
          urlValue === null
            ? defaultFilters[key]
            : getFilterFromParams(key, urlValue, defaultFilters[key]);
        if (isEqual(searchFilters[key], next)) return acc;
        return { ...acc, [key]: next };
      } catch {
        return acc;
      }
    }, {});
    if (Object.keys(updates).length > 0) {
      pendingHydrationRef.current = {
        search: location.search,
        updates,
      };
      patchSearchFilters(updates);
    } else {
      pendingHydrationRef.current = null;
    }
  }, [location.pathname, location.search, patchSearchFilters]);

  return { clearPendingHydration, pendingHydrationRef };
}

function useFilterState<K extends keyof Filters>(key: K): FilterHandle<K> {
  const value = useStore((s) => s.searchFilters[key]);
  const setSearchFilter = useStore((s) => s.setSearchFilter);

  return useMemo(
    () => ({
      value,
      set(v: SetStateAction<Filters[K]>) {
        setSearchFilter(key, v);
      },
      isDefault: isEqual(value, defaultFilters[key]),
      isNonEmpty: !isEqual(value, emptyFilters[key]),
      resetToDefault() {
        setSearchFilter(key, defaultFilters[key]);
      },
      resetToEmpty() {
        setSearchFilter(key, emptyFilters[key]);
      },
    }),
    [value, key, setSearchFilter],
  );
}

function useSearchUrlSync(
  pendingHydrationRef: React.RefObject<PendingUrlHydration | null>,
  clearPendingHydration: () => void,
) {
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  const searchFilters = useStore((s) => s.searchFilters);

  useEffect(() => {
    if (location.pathname !== '/catalog') return;
    const pendingHydration = pendingHydrationRef.current;
    if (
      pendingHydration?.search === location.search &&
      !hasAppliedHydration(searchFilters, pendingHydration.updates)
    )
      return;
    if (pendingHydration?.search === location.search) clearPendingHydration();

    const searchParams = new URLSearchParams(location.search);
    const nextParams = buildCatalogSearchParams(
      searchFilters,
      defaultFilters,
      searchParams,
    );
    const nextSearch = nextParams.toString();

    if (nextSearch === searchParams.toString()) return;

    sessionStorage.setItem(
      'lastCatalogSearch',
      nextSearch ? `?${nextSearch}` : '',
    );
    setSearchParams(nextParams);
  }, [
    location.pathname,
    location.search,
    clearPendingHydration,
    pendingHydrationRef,
    searchFilters,
    setSearchParams,
  ]);
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

export function SearchBootstrap({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { clearPendingHydration, pendingHydrationRef } =
    useSearchUrlHydration();
  useSearchUrlSync(pendingHydrationRef, clearPendingHydration);

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

  const setSearchData = useStore((s) => s.setSearchData);
  const searchData = useStore((s) => s.searchData);
  const searchFilters = useStore((s) => s.searchFilters);
  const searchTimingStartMs = useStore((s) => s.searchTimingStartMs);

  const {
    worksheets,
    friends,
    sameCourseIdToCrns,
    getRelevantWorksheetNumber,
  } = useStore(
    useShallow((state) => ({
      worksheets: state.worksheets,
      friends: state.friends,
      sameCourseIdToCrns: state.sameCourseIdToCrns,
      getRelevantWorksheetNumber: state.getRelevantWorksheetNumber,
    })),
  );

  const numFriends = useMemo(() => {
    if (!friends) return {};
    return getNumFriends(friends, sameCourseIdToCrns);
  }, [friends, sameCourseIdToCrns]);

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
          case 'number': {
            const numString = listing.number.replace(/\D/gu, '');

            let number = Number(numString);
            if (numString.length === 3) number *= 10;

            return number;
          }
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

      const qualityMap = new Map<CatalogListing, number>();
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
          const numString = listing.number.replace(/\D/gu, '');

          let number = Number(numString);
          if (numString.length === 3) number *= 10;

          if (
            number < numBounds.value[0] ||
            (numBounds.value[1] < 10000 && number > numBounds.value[1])
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
        const quality = searchMatchQuality(listing, processedSearchTextParam, {
          searchDescription: searchDescription.value,
        });
        if (quality > 0) qualityMap.set(listing, quality);
        return quality > 0;
      });
      // Apply sorting order, with match quality as primary when searching.
      setSearchData(
        sortCourses(
          filtered,
          { key: selectSortBy.value.value, type: sortOrder.value },
          numFriends,
          qualityMap.size > 0 ? qualityMap : undefined,
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
      setSearchData,
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

  useLayoutEffect(() => {
    useStore.getState().setSearchNumFriends(numFriends);
  }, [numFriends]);

  useLayoutEffect(() => {
    useStore.getState().setSearchMultiSeasons(multiSeasons);
  }, [multiSeasons]);

  useLayoutEffect(() => {
    useStore.getState().setSearchCoursesLoading(coursesLoading);
  }, [coursesLoading]);

  // TODO this is not an effect
  useEffect(() => {
    if (!coursesLoading) {
      const durInSecs = Math.abs(Date.now() - searchTimingStartMs) / 1000;
      useStore.getState().setSearchDuration(durInSecs);
    }
  }, [searchFilters, coursesLoading, searchData, searchTimingStartMs]);

  return <>{children}</>;
}
