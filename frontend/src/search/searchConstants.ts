import { type Filters, type Option, sortByOptions } from './searchTypes';
import { DEFAULT_SEASON } from '../config';
import buildingsData from '../generated/buildings.json';
import type { Buildings } from '../generated/graphql-types';
import seasonsData from '../generated/seasons.json';
import type { Season } from '../queries/graphql-types';
import {
  skillsAreas,
  subjects,
  schools,
  courseInfoAttributes,
} from '../utilities/constants';
import { toRangeTime, toSeasonString } from '../utilities/course';

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

const seasons = seasonsData as Season[];

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
  hideCancelled: 'Hide cancelled courses',
  hideConflicting: 'Hide courses with conflicting times',
  includeAttributes: 'Include',
  excludeAttributes: 'Exclude',
  selectSortBy: 'Sort By',
  sortOrder: 'Sort Order',
  intersectingFilters: 'Union or Intersection',
};

export const defaultFilters: Filters = {
  searchText: '',
  selectSubjects: [],
  selectSkillsAreas: [],
  overallBounds: [1, 5],
  workloadBounds: [1, 5],
  professorBounds: [1, 5],
  selectSeasons: [
    { value: DEFAULT_SEASON, label: toSeasonString(DEFAULT_SEASON) },
  ],
  selectDays: [],
  timeBounds: [toRangeTime('7:00'), toRangeTime('22:00')],
  enrollBounds: [1, 528],
  numBounds: [0, 10000],
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

export const emptyFilters: Filters = {
  ...defaultFilters,
  selectSeasons: [],
  hideCancelled: false,
  excludeAttributes: [],
};

export const SEARCH_FILTER_KEYS = Object.keys(
  defaultFilters,
) as (keyof Filters)[];
