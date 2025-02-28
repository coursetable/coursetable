import { schools, skillsAreas, subjects, weekdays } from './constants';
import { toSeasonString } from './course';
import type { Filters, SortKeys } from '../contexts/searchContext';
import type { Season } from '../queries/graphql-types';

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
): string {
  const newSearch = new URLSearchParams(window.location.search);

  if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
    newSearch.delete(key);
    return `?${newSearch.toString()}`;
  }

  if (Array.isArray(value)) {
    const values = value.map((v) =>
      typeof v === 'object' && Object.hasOwn(v, 'value') ? v.value : v,
    );
    newSearch.set(key, values.join(','));
  } else if (typeof value === 'object' && Object.hasOwn(value, 'value')) {
    newSearch.set(key, value.value.toString());
  } else {
    newSearch.set(key, value.toString());
  }

  return `?${newSearch.toString()}`;
}
