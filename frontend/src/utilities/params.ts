import { isEqual } from './common';
import { schools, skillsAreas, subjects, weekdays } from './constants';
import { toSeasonString } from './course';
import type { Season } from '../queries/graphql-types';
import type { Filters, SortKeys } from '../search/searchTypes';

export function getFilterFromParams<K extends keyof Filters>(
  key: K,
  value: string,
  fallback: Filters[K],
): Filters[K] {
  if (value === '') return fallback;

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
          return handleBooleanFilter(value);

        case 'searchText':
          return value as Filters[K];

        case 'selectSortBy':
          return handleSortByFilter(value);

        case 'sortOrder':
          return handleSortOrderFilter(value);

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
          return value.split(',') as Filters[K];

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
): Filters[K] {
  return (value === 'true') as Filters[K];
}

function handleSortByFilter<K extends keyof Filters>(
  value: string,
): Filters[K] {
  return { value: value as SortKeys, label: value } as Filters[K];
}

function handleSortOrderFilter<K extends keyof Filters>(
  value: string,
): Filters[K] {
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
          return {
            value: Number(val),
            label: val,
          };
        case 'selectCourseInfoAttributes':
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

  if (Array.isArray(value)) {
    const values = value.map((v) => {
      if (typeof v === 'object' && Object.hasOwn(v, 'value'))
        return String((v as { value: string | number }).value);
      return String(v as string | number);
    });
    // Avoid `?key=` (empty string): getFilterFromParams treats ''
    // as "use default", which breaks filters whose empty state differs
    // from default (e.g. selectSeasons).
    if (values.length === 0) newSearch.delete(key);
    else newSearch.set(key, values.join(','));
  } else if (typeof value === 'object' && Object.hasOwn(value, 'value')) {
    newSearch.set(key, String((value as { value: string | number }).value));
  } else {
    newSearch.set(key, String(value as string | boolean));
  }

  return `?${newSearch.toString()}`;
}

/**
 * Builds a full query string from all filters, excluding defaults and
 * optionally season.
 */
export function buildFullFilterQueryString(
  filters: Filters,
  defaultFilters: Filters,
  options?: { excludeSeason?: boolean },
): string {
  const params = new URLSearchParams();

  (Object.keys(filters) as (keyof Filters)[]).forEach((key) => {
    // Skip season if requested
    if (options?.excludeSeason && key === 'selectSeasons') return;

    const value = filters[key];
    const defaultValue = defaultFilters[key];

    // Skip if value equals default
    if (isEqual(value, defaultValue)) return;

    // Serialize the value (same logic as createFilterLink)
    if (Array.isArray(value)) {
      const parts = value.map((v) => {
        // Filter array elements can be Option (object with value) or string
        /* eslint-disable @typescript-eslint/no-unnecessary-condition */
        if (typeof v === 'object' && v !== null && Object.hasOwn(v, 'value'))
          return String((v as { value: string | number }).value);

        /* eslint-enable @typescript-eslint/no-unnecessary-condition */
        return String(v as string | number);
      });
      if (parts.length > 0) params.set(key, parts.join(','));
    } else if (
      // SelectSortBy is Option<SortKeys> (object with value)
      /* eslint-disable @typescript-eslint/no-unnecessary-condition */
      typeof value === 'object' &&
      value !== null &&
      Object.hasOwn(value as object, 'value')
    ) {
      /* eslint-enable @typescript-eslint/no-unnecessary-condition */
      params.set(key, String((value as { value: string | number }).value));
    } else {
      params.set(key, String(value as string | boolean));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
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

    if (Array.isArray(value)) {
      const parts = value.map((v) => {
        if (typeof v === 'object' && Object.hasOwn(v as object, 'value'))
          return String((v as { value: string | number }).value);
        return String(v as string | number);
      });
      if (parts.length > 0) result.set(key, parts.join(','));
    } else if (
      typeof value === 'object' &&
      Object.hasOwn(value as object, 'value')
    ) {
      result.set(key, String((value as { value: string | number }).value));
    } else {
      result.set(key, String(value as string | boolean));
    }
  });

  return result;
}
