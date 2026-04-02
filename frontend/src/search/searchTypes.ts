import type React from 'react';

import type { Season } from '../queries/graphql-types';

export type Option<T extends string | number = string> = {
  label: string;
  value: T;
};

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
} as const;

export type SortKeys = keyof typeof sortCriteria;

export const sortByOptions = Object.fromEntries(
  Object.entries(sortCriteria).map(([k, v]) => [k, { value: k, label: v }]),
) as { [k in SortKeys]: Option<SortKeys> };

export const booleanAttributes = {
  fysem: 'First-year seminar',
  sysem: 'Sophomore seminar',
  colsem: 'College seminar',
  discussion: 'Discussion section',
  graduate: 'Graduate-level course',
};

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

export type IntersectableFilters =
  | 'selectSubjects'
  | 'selectSkillsAreas'
  | 'selectDays'
  | 'selectSchools'
  | 'selectCourseInfoAttributes';

type SortOrderType = 'desc' | 'asc';

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

export type FilterHandle<K extends keyof Filters> = {
  value: Filters[K];
  set: React.Dispatch<React.SetStateAction<Filters[K]>>;
  isDefault: boolean;
  isNonEmpty: boolean;
  resetToDefault: () => void;
  resetToEmpty: () => void;
};

export type FilterList = { [K in keyof Filters]: FilterHandle<K> };
