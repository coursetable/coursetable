import type {
  BooleanFilters,
  FilterHandle,
  FilterList,
  Filters,
  NumericFilters,
} from '../contexts/searchContext';

export function paramFilter<K extends keyof Filters>(
  key: K,
  fallback: Filters[K],
): Filters[K] {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key.toString());

  if (value === null) return fallback;

  switch (key) {
    case 'enrollBounds':
    case 'numBounds':
    case 'overallBounds':
    case 'professorBounds':
    case 'timeBounds':
    case 'workloadBounds': {
      const parts = value.split(',');
      if (parts.length !== 2) return fallback;

      return [
        parseFloat(parts[0] ?? ''),
        parseFloat(parts[1] ?? ''),
      ] as Filters[K];
    }
    case 'enableQuist':
    case 'hideCancelled':
    case 'hideConflicting':
    case 'hideDiscussionSections':
    case 'hideFirstYearSeminars':
    case 'hideGraduateCourses':
    case 'searchDescription': {
      return (value === 'true') as Filters[K];
    }
    case 'searchText':
      console.log(key);
      console.log(fallback);
      break;
    case 'selectCourseInfoAttributes':
    case 'selectCredits':
    case 'selectDays':
    case 'selectSchools':
    case 'selectSeasons':
    case 'selectSkillsAreas':
    case 'selectSortBy':
    case 'selectSubjects': {
      console.log(fallback);
      break;
    }
    case 'sortOrder':
      console.log(key);
      console.log(fallback);
      break;
  }

  return fallback;
}

export function buildParams(filters: FilterList) {
  const params = {};

  buildNumericParam(params, 'enrollment', filters.enrollBounds);
  buildBooleanParam(params, 'cancelled', filters.hideCancelled);
  buildBooleanParam(params, 'conflicting', filters.hideConflicting);
  buildBooleanParam(params, 'discussion', filters.hideDiscussionSections);
  buildBooleanParam(params, 'fysem', filters.hideFirstYearSeminars);
  buildBooleanParam(params, 'grad', filters.hideGraduateCourses);
  buildNumericParam(params, 'number', filters.numBounds);
  buildNumericParam(params, 'rating', filters.overallBounds);
  buildNumericParam(params, 'professor-rating', filters.professorBounds);
  // TODO: filters.searchDescription
  // TODO: filters.searchText
  // TODO: filters.selectCourseInfoAttributes
  // TODO: filters.selectCredits
  // TODO: filters.selectDays
  // TODO: filters.selectCourseInfoAttributes
  // TODO: filters.selectCredits
  // TODO: filters.selectDays
  // TODO: filters.selectSchools
  // TODO: filters.selectSeasons
  // TODO: filters.selectSkillsAreas
  // TODO: filters.selectSortBy
  // TODO: filters.selectSubjects
  // TODO: filters.sortOrder
  // TODO: filters.timeBounds
  buildNumericParam(params, 'workload', filters.workloadBounds);

  return params;
}

export function decodeParams(params: URLSearchParams) {
  const filters = {};

  decodeNumericParam(filters, 'workload', params.get('workload'));
  decodeBooleanParam(filters, 'cancelled', params.get('hideCancelled'));
  decodeBooleanParam(filters, 'conflicting', params.get('hideConflicting'));
  decodeBooleanParam(
    filters,
    'discussion',
    params.get('hideDiscussionSections'),
  );
  decodeBooleanParam(filters, 'fysem', params.get('hideFirstYearSeminars'));
  decodeBooleanParam(filters, 'grad', params.get('hideGraduateCourses'));
  decodeNumericParam(filters, 'number', params.get('numBounds'));
  decodeNumericParam(filters, 'rating', params.get('overallBounds'));
  decodeNumericParam(
    filters,
    'professor-rating',
    params.get('professorBounds'),
  );
  decodeNumericParam(filters, 'workload', params.get('workloadBounds'));

  return filters;
}

function buildBooleanParam(
  params: { [key: string]: string },
  field: string,
  filter: FilterHandle<BooleanFilters>,
) {
  if (!filter.isDefault) params[field] = filter.value.toString();
}

function decodeBooleanParam(
  filters: { [key: string]: boolean },
  field: string,
  value: string | null,
) {
  if (value === null) return;
  if (value !== 'true' && value !== 'false') return;

  filters[field] = Boolean(value);
}

function buildNumericParam(
  params: { [key: string]: string },
  field: string,
  filter: FilterHandle<NumericFilters>,
) {
  if (!filter.isDefault) params[field] = filter.value.toString();
}

function decodeNumericParam(
  filters: { [key: string]: [number, number] },
  field: string,
  value: string | null,
) {
  if (value === null) return;

  const parts = value.split(',');
  if (parts.length !== 2 || parts[0] === undefined || parts[1] === undefined)
    return;

  filters[field] = [parseFloat(parts[0]), parseFloat(parts[1])];
}

export function createFilterLink<K extends keyof Filters>(
  key: K,
  value: Filters[K],
  defaultValue: Filters[K],
) {
  const params = new URLSearchParams(window.location.search);

  if (value === defaultValue) params.delete(key.toString());
  else params.set(key, value.toString());

  return `?${params.toString()}`;
}
