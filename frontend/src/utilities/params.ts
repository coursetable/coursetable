import {
  courseInfoAttributes,
  credits,
  schools,
  skillsAreas,
  subjects,
  weekdays,
} from './constants';
import { toSeasonString } from './course';
import { seasons } from '../contexts/ferryContext';
import type { Filters } from '../contexts/searchContext';

export function paramFilter<K extends keyof Filters>(
  key: K,
  fallback: Filters[K],
): Filters[K] {
  const params = new URLSearchParams(window.location.search);

  const value = decodeURIComponent(params.get(key.toString()) ?? '');
  if (value === '') return fallback;

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
    case 'hideDiscussionSections':
    case 'hideFirstYearSeminars':
    case 'hideGraduateCourses':
    case 'searchDescription':
      return handleBooleanFilter(value, fallback);

    case 'searchText':
      return value as Filters[K];

    case 'selectSortBy':
      break;

    case 'selectCourseInfoAttributes':
      return handleCourseAttributesFilter(value, fallback);

    case 'selectCredits':
      return handleCreditsFilter(value, fallback);

    case 'selectDays':
      return handleDaysFilter(value, fallback);

    case 'selectSchools':
      return handleSchoolsFilter(value, fallback);

    case 'selectSeasons':
      return handleSeasonsFilter(value, fallback);

    case 'selectSkillsAreas':
      return handleSkillsAreasFilter(value, fallback);

    case 'selectSubjects':
      return handleSubjectsFilter(value, fallback);

    case 'sortOrder':
      break;
  }

  return fallback;
}

function handleBoundsFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
): Filters[K] {
  const parts = value.split(',');
  if (parts.length !== 2) return fallback;

  const [min, max] = parts.map(parseFloat);
  if (min === undefined || max === undefined) return fallback;

  return [min, max] as Filters[K];
}

function handleBooleanFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
): Filters[K] {
  if (value === 'true') return true as Filters[K];
  if (value === 'false') return false as Filters[K];

  return fallback;
}

function handleGenericFilter<
  K extends keyof Filters,
  T,
  V extends string | number,
>(
  value: string,
  fallback: Filters[K],
  parseComponents: (comp: string[]) => T[],
  mapSelections: (parsedComponents: T[]) => { value: V; label: string }[],
): Filters[K] {
  const components = value.split(',');
  const parsed = parseComponents(components);

  if (parsed.length === 0) return fallback;

  const selections = mapSelections(parsed);

  return selections as unknown as Filters[K];
}

function handleCourseAttributesFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
) {
  return handleGenericFilter(
    value,
    fallback,
    (comp) =>
      courseInfoAttributes.filter((attribute) => comp.includes(attribute)),
    (parsed) =>
      parsed.map((attribute) => ({
        value: attribute,
        label: attribute,
      })),
  );
}

function handleCreditsFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
) {
  return handleGenericFilter(
    value,
    fallback,
    (comp) => credits.filter((credit) => comp.includes(credit.toString())),
    (parsed) =>
      parsed.map((credit) => ({
        value: credit,
        label: credit.toString(),
      })),
  );
}

function handleDaysFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
) {
  return handleGenericFilter(
    value,
    fallback,
    (comp) =>
      Object.entries(weekdays).filter(([, index]) =>
        comp.includes(index.toString()),
      ),
    (parsed) =>
      parsed.map(([day, index]) => ({
        value: index,
        label: day,
      })),
  );
}

function handleSchoolsFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
) {
  return handleGenericFilter(
    value,
    fallback,
    (comp) => Object.entries(schools).filter(([code]) => comp.includes(code)),
    (parsed) =>
      parsed.map(([code, name]) => ({
        value: code,
        label: name,
      })),
  );
}

function handleSeasonsFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
) {
  return handleGenericFilter(
    value,
    fallback,
    (comp) => seasons.filter((season) => comp.includes(season)),
    (parsed) =>
      parsed.map((season) => ({
        value: season,
        label: toSeasonString(season),
      })),
  );
}

function handleSkillsAreasFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
) {
  return handleGenericFilter(
    value,
    fallback,
    (comp) =>
      Object.entries(skillsAreas).filter(([skill]) => comp.includes(skill)),
    (parsed) =>
      parsed.map(([lbl, { code }]) => ({
        value: code!,
        label: lbl,
      })),
  );
}

function handleSubjectsFilter<K extends keyof Filters>(
  value: string,
  fallback: Filters[K],
) {
  return handleGenericFilter(
    value,
    fallback,
    (comp) =>
      Object.entries(subjects).filter(([subject]) => comp.includes(subject)),
    (parsed) =>
      parsed.map(([val, lbl]) => ({
        value: val,
        label: lbl,
      })),
  );
}

export function createFilterLink<K extends keyof Filters>(
  key: K,
  value: Filters[K],
  defaultValue: Filters[K],
): string {
  const params = new URLSearchParams(window.location.search);

  if (value === defaultValue) return `?${params.toString()}`;

  if (Array.isArray(value)) {
    const values = value.map((v) => {
      if (typeof v === 'object' && 'value' in v) return v.value;
      return v;
    });

    params.set(key.toString(), encodeURIComponent(values.join(',')));
  } else {
    params.set(
      key.toString(),
      encodeURIComponent(
        typeof value === 'object' ? JSON.stringify(value) : value.toString(),
      ),
    );
  }

  return `?${params.toString()}`;
}
