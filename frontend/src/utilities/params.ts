import { isEqual } from './common';
import {
  courseInfoAttributes,
  credits,
  schools,
  skillsAreas,
  subjects,
  weekdays,
} from './constants';
import { toSeasonString } from './course';
import type { Season } from '../queries/graphql-types';
import {
  booleanAttributes,
  sortByOptions,
  type BooleanAttributes,
  type Filters,
  type SortKeys,
} from '../search/searchTypes';

// List of filter params where an empty url value means an empty array
const EMPTY_ARRAY_PARAM_KEYS = new Set<keyof Filters>([
  'selectCourseInfoAttributes',
  'selectCredits',
  'selectDays',
  'selectSchools',
  'selectSeasons',
  'selectSkillsAreas',
  'selectSubjects',
  'selectBuilding',
  'intersectingFilters',
  'includeAttributes',
  'excludeAttributes',
]);

export function getFilterFromParams<K extends keyof Filters>(
  key: K,
  value: string,
  fallback: Filters[K],
): Filters[K] {
  if (value === '') return getEmptyFilterFromParams(key, fallback);

  try {
    const result = ((): Filters[K] => {
      switch (key) {
        case 'enrollBounds':
        case 'numBounds':
        case 'overallBounds':
        case 'professorBounds':
        case 'timeBounds':
        case 'workloadBounds':
          return handleBoundsFilter(value, fallback);

        case 'enableQuist':
        case 'hideCancelled':
        case 'hideConflicting':
        case 'searchDescription':
          return handleBooleanFilter(value, fallback);

        case 'searchText':
          return value as Filters[K];

        case 'selectSortBy':
          return handleSortByFilter(value, fallback);

        case 'sortOrder':
          return handleSortOrderFilter(value, fallback);

        case 'selectCourseInfoAttributes':
        case 'selectCredits':
        case 'selectDays':
        case 'selectSchools':
        case 'selectSeasons':
        case 'selectSkillsAreas':
        case 'selectSubjects':
        case 'selectBuilding':
          return handleSelectFilter(key, value, fallback);

        case 'intersectingFilters':
          return handleIntersectingFiltersParam(value, fallback);

        case 'includeAttributes':
        case 'excludeAttributes':
          return handleBooleanAttributesParam(value, fallback);

        default:
          console.warn(`Unhandled filter type: ${key}`);
          return fallback;
      }
    })();
    return result;
  } catch (e) {
    console.warn(`Error parsing filter ${key}:`, e);
    return fallback;
  }
}

function getEmptyFilterFromParams<K extends keyof Filters>(
  key: K,
  fallback: Filters[K],
): Filters[K] {
  if (EMPTY_ARRAY_PARAM_KEYS.has(key)) return [] as unknown as Filters[K];
  if (key === 'searchText') return '' as Filters[K];
  return fallback;
}

function handleBoundsFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
): Filters[K] {
  const parts = value.split(',');
  if (parts.length !== 2) return fallback;

  const min = Number(parts[0]);
  const max = Number(parts[1]);
  if (Number.isNaN(min) || Number.isNaN(max)) return fallback;

  return [min, max] as Filters[K];
}

function handleBooleanFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
): Filters[K] {
  if (value !== 'true' && value !== 'false') return fallback;
  return (value === 'true') as Filters[K];
}

function handleSortByFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
): Filters[K] {
  if (!Object.hasOwn(sortByOptions, value)) return fallback;
  return { value: value as SortKeys, label: value } as Filters[K];
}

function handleSortOrderFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
): Filters[K] {
  if (value !== 'asc' && value !== 'desc') return fallback;
  return (value === 'asc' ? 'asc' : 'desc') as Filters[K];
}

function handleSelectFilter<K extends keyof Filters>(
  key: K,
  value: string,
  fallback: Filters[K],
): Filters[K] {
  const values = value.split(',');
  if (!values.length) return fallback;

  const options = values
    .map((val) => {
      switch (key) {
        case 'selectSeasons':
          return {
            value: val as Season,
            label: toSeasonString(val as Season),
          };
        case 'selectDays': {
          const found = Object.entries(weekdays).find(
            ([, i]) => i.toString() === val,
          );
          return found ? { value: Number(val), label: found[0] } : null;
        }
        case 'selectCredits':
          if (!credits.some((credit) => String(credit) === val)) return null;
          return {
            value: Number(val),
            label: val,
          };
        case 'selectCourseInfoAttributes':
          if (!courseInfoAttributes.includes(val)) return null;
          return {
            value: val,
            label: val,
          };
        case 'selectBuilding':
          return {
            value: val,
            label: val,
          };
        case 'selectSkillsAreas': {
          const allSkillsAreas = {
            ...skillsAreas.areas,
            ...skillsAreas.skills,
          };
          const name = allSkillsAreas[val];
          return name ? { value: val, label: `${val} - ${name}` } : null;
        }
        case 'selectSubjects': {
          const name = subjects[val];
          return name ? { value: val, label: `${val} - ${name}` } : null;
        }
        case 'selectSchools': {
          const name = schools[val];
          return name ? { value: val, label: name } : null;
        }
        case 'searchDescription':
        case 'enableQuist':
        case 'hideCancelled':
        case 'hideConflicting':
        case 'overallBounds':
        case 'workloadBounds':
        case 'professorBounds':
        case 'timeBounds':
        case 'enrollBounds':
        case 'numBounds':
        case 'searchText':
        case 'selectSortBy':
        case 'sortOrder':
        case 'intersectingFilters':
        case 'includeAttributes':
        case 'excludeAttributes':
        default:
          return null;
      }
    })
    .filter((opt): opt is NonNullable<typeof opt> => opt !== null);

  return options as Filters[K];
}

function handleIntersectingFiltersParam<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
): Filters[K] {
  const filters = value.split(',');
  if (
    !filters.every((f) =>
      [
        'selectSubjects',
        'selectSkillsAreas',
        'selectDays',
        'selectSchools',
        'selectCourseInfoAttributes',
      ].includes(f),
    )
  )
    return fallback;

  return filters as Filters[K];
}

function handleBooleanAttributesParam<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
): Filters[K] {
  const attrs = value.split(',');
  if (!attrs.every((attr) => Object.hasOwn(booleanAttributes, attr)))
    return fallback;

  return attrs as BooleanAttributes[] as Filters[K];
}

function serializeArrayFilterValue(value: readonly unknown[]) {
  return value
    .map((v) => {
      if (typeof v === 'object' && v !== null && Object.hasOwn(v, 'value'))
        return String((v as { value: string | number }).value);
      return String(v as string | number);
    })
    .join(',');
}

function serializeFilterValue(value: Filters[keyof Filters]) {
  if (Array.isArray(value)) return serializeArrayFilterValue(value);
  if (typeof value === 'object' && Object.hasOwn(value, 'value'))
    return String((value as { value: string | number }).value);
  return String(value as string | boolean);
}

export function createFilterLink<K extends keyof Filters>(
  key: K,
  value: Filters[K],
  defaultValue: Filters[K],
  currentSearch?: string,
): string {
  const base = currentSearch ?? window.location.search;
  const newSearch = new URLSearchParams(
    base.startsWith('?') ? base.slice(1) : base,
  );

  if (isEqual(value, defaultValue)) {
    newSearch.delete(key);
    return `?${newSearch.toString()}`;
  }

  newSearch.set(key, serializeFilterValue(value));

  return `?${newSearch.toString()}`;
}

/**
 * Builds a saved-search query string from filters, excluding defaults and
 * season.
 */
export function buildFullFilterQueryString(
  filters: Filters,
  defaultFilters: Filters,
): string {
  const params = new URLSearchParams();

  (Object.keys(filters) as (keyof Filters)[]).forEach((key) => {
    if (key === 'selectSeasons') return;

    const value = filters[key];
    const defaultValue = defaultFilters[key];

    // Skip if value equals default
    if (isEqual(value, defaultValue)) return;

    params.set(key, serializeFilterValue(value));
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export function sanitizeFilterQueryString(
  queryString: string,
  defaultFilters: Filters,
): string {
  const params = new URLSearchParams(
    queryString.startsWith('?') ? queryString.slice(1) : queryString,
  );
  const filters = { ...defaultFilters };

  (Object.keys(defaultFilters) as (keyof Filters)[]).forEach((key) => {
    if (key === 'selectSeasons') return;

    const value = params.get(key);
    if (value === null) return;

    filters[key] = getFilterFromParams(
      key,
      value,
      defaultFilters[key],
    ) as never;
  });

  return buildFullFilterQueryString(filters, defaultFilters);
}

/** Params to preserve when syncing URL (e.g. course-modal, prof-modal). */
const PRESERVE_PARAMS = new Set(['course-modal', 'prof-modal']);

/**
 * Builds URLSearchParams from filter state for the catalog, preserving
 * non-filter params (e.g. course-modal, prof-modal) from the current URL.
 * Used for centralized single-pass URL sync.
 */
export function buildCatalogSearchParams(
  filters: Filters,
  defaultFilters: Filters,
  currentParams: URLSearchParams,
): URLSearchParams {
  const result = new URLSearchParams();

  // Copy preserved params first
  PRESERVE_PARAMS.forEach((key) => {
    const v = currentParams.get(key);
    if (v !== null) result.set(key, v);
  });

  // Add filter params (excluding defaults)
  (Object.keys(filters) as (keyof Filters)[]).forEach((key) => {
    const value = filters[key];
    const defaultValue = defaultFilters[key];

    if (isEqual(value, defaultValue)) return;

    result.set(key, serializeFilterValue(value));
  });

  return result;
}
