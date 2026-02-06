import { Crn } from '../queries/graphql-types';
import { ExtraInfo } from '../queries/graphql-types';
import { NumberArr } from '../queries/graphql-types';
import { Season } from '../queries/graphql-types';
import { StringArr } from '../queries/graphql-types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Crn: { input: Crn; output: Crn };
  ExtraInfo: { input: ExtraInfo; output: ExtraInfo };
  NumberArr: { input: NumberArr; output: NumberArr };
  Season: { input: Season; output: Season };
  StringArr: { input: StringArr; output: StringArr };
  float8: { input: number; output: number };
  jsonb: { input: object; output: object };
  timestamp: { input: any; output: any };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
  _eq: InputMaybe<Scalars['Boolean']['input']>;
  _gt: InputMaybe<Scalars['Boolean']['input']>;
  _gte: InputMaybe<Scalars['Boolean']['input']>;
  _in: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['Boolean']['input']>;
  _lte: InputMaybe<Scalars['Boolean']['input']>;
  _neq: InputMaybe<Scalars['Boolean']['input']>;
  _nin: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq: InputMaybe<Scalars['Int']['input']>;
  _gt: InputMaybe<Scalars['Int']['input']>;
  _gte: InputMaybe<Scalars['Int']['input']>;
  _in: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['Int']['input']>;
  _lte: InputMaybe<Scalars['Int']['input']>;
  _neq: InputMaybe<Scalars['Int']['input']>;
  _nin: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq: InputMaybe<Scalars['String']['input']>;
  _gt: InputMaybe<Scalars['String']['input']>;
  _gte: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike: InputMaybe<Scalars['String']['input']>;
  _in: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex: InputMaybe<Scalars['String']['input']>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like: InputMaybe<Scalars['String']['input']>;
  _lt: InputMaybe<Scalars['String']['input']>;
  _lte: InputMaybe<Scalars['String']['input']>;
  _neq: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike: InputMaybe<Scalars['String']['input']>;
  _nin: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "buildings" */
export type Buildings = {
  __typename?: 'buildings';
  /** Building full name */
  building_name: Maybe<Scalars['String']['output']>;
  /** Building short code/abbreviation, as in YCS */
  code: Scalars['String']['output'];
  last_updated: Maybe<Scalars['timestamp']['output']>;
  /** An array relationship */
  locations: Array<Locations>;
  time_added: Maybe<Scalars['timestamp']['output']>;
  /** Yale campus map URL */
  url: Maybe<Scalars['String']['output']>;
};

/** columns and relationships of "buildings" */
export type BuildingsLocationsArgs = {
  distinct_on: InputMaybe<Array<LocationsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<LocationsOrderBy>>;
  where: InputMaybe<LocationsBoolExp>;
};

/** Boolean expression to filter rows from the table "buildings". All fields are combined with a logical 'AND'. */
export type BuildingsBoolExp = {
  _and: InputMaybe<Array<BuildingsBoolExp>>;
  _not: InputMaybe<BuildingsBoolExp>;
  _or: InputMaybe<Array<BuildingsBoolExp>>;
  building_name: InputMaybe<StringComparisonExp>;
  code: InputMaybe<StringComparisonExp>;
  last_updated: InputMaybe<TimestampComparisonExp>;
  locations: InputMaybe<LocationsBoolExp>;
  time_added: InputMaybe<TimestampComparisonExp>;
  url: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "buildings". */
export type BuildingsOrderBy = {
  building_name: InputMaybe<OrderBy>;
  code: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  locations_aggregate: InputMaybe<LocationsAggregateOrderBy>;
  time_added: InputMaybe<OrderBy>;
  url: InputMaybe<OrderBy>;
};

/** select columns of table "buildings" */
export enum BuildingsSelectColumn {
  /** column name */
  BuildingName = 'building_name',
  /** column name */
  Code = 'code',
  /** column name */
  LastUpdated = 'last_updated',
  /** column name */
  TimeAdded = 'time_added',
  /** column name */
  Url = 'url',
}

/** Streaming cursor of the table "buildings" */
export type BuildingsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: BuildingsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BuildingsStreamCursorValueInput = {
  /** Building full name */
  building_name: InputMaybe<Scalars['String']['input']>;
  /** Building short code/abbreviation, as in YCS */
  code: InputMaybe<Scalars['String']['input']>;
  last_updated: InputMaybe<Scalars['timestamp']['input']>;
  time_added: InputMaybe<Scalars['timestamp']['input']>;
  /** Yale campus map URL */
  url: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "course_flags" */
export type CourseFlags = {
  __typename?: 'course_flags';
  /** An object relationship */
  course: Courses;
  course_id: Scalars['Int']['output'];
  /** An object relationship */
  flag: Flags;
  flag_id: Scalars['Int']['output'];
};

/** order by aggregate values of table "course_flags" */
export type CourseFlagsAggregateOrderBy = {
  avg: InputMaybe<CourseFlagsAvgOrderBy>;
  count: InputMaybe<OrderBy>;
  max: InputMaybe<CourseFlagsMaxOrderBy>;
  min: InputMaybe<CourseFlagsMinOrderBy>;
  stddev: InputMaybe<CourseFlagsStddevOrderBy>;
  stddev_pop: InputMaybe<CourseFlagsStddevPopOrderBy>;
  stddev_samp: InputMaybe<CourseFlagsStddevSampOrderBy>;
  sum: InputMaybe<CourseFlagsSumOrderBy>;
  var_pop: InputMaybe<CourseFlagsVarPopOrderBy>;
  var_samp: InputMaybe<CourseFlagsVarSampOrderBy>;
  variance: InputMaybe<CourseFlagsVarianceOrderBy>;
};

/** order by avg() on columns of table "course_flags" */
export type CourseFlagsAvgOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "course_flags". All fields are combined with a logical 'AND'. */
export type CourseFlagsBoolExp = {
  _and: InputMaybe<Array<CourseFlagsBoolExp>>;
  _not: InputMaybe<CourseFlagsBoolExp>;
  _or: InputMaybe<Array<CourseFlagsBoolExp>>;
  course: InputMaybe<CoursesBoolExp>;
  course_id: InputMaybe<IntComparisonExp>;
  flag: InputMaybe<FlagsBoolExp>;
  flag_id: InputMaybe<IntComparisonExp>;
};

/** order by max() on columns of table "course_flags" */
export type CourseFlagsMaxOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "course_flags" */
export type CourseFlagsMinOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "course_flags". */
export type CourseFlagsOrderBy = {
  course: InputMaybe<CoursesOrderBy>;
  course_id: InputMaybe<OrderBy>;
  flag: InputMaybe<FlagsOrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** select columns of table "course_flags" */
export enum CourseFlagsSelectColumn {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  FlagId = 'flag_id',
}

/** order by stddev() on columns of table "course_flags" */
export type CourseFlagsStddevOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "course_flags" */
export type CourseFlagsStddevPopOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "course_flags" */
export type CourseFlagsStddevSampOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "course_flags" */
export type CourseFlagsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CourseFlagsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CourseFlagsStreamCursorValueInput = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  flag_id: InputMaybe<Scalars['Int']['input']>;
};

/** order by sum() on columns of table "course_flags" */
export type CourseFlagsSumOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "course_flags" */
export type CourseFlagsVarPopOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "course_flags" */
export type CourseFlagsVarSampOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "course_flags" */
export type CourseFlagsVarianceOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** columns and relationships of "course_meetings" */
export type CourseMeetings = {
  __typename?: 'course_meetings';
  /** An object relationship */
  course: Courses;
  course_id: Scalars['Int']['output'];
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: Scalars['Int']['output'];
  /** End time of this meeting session */
  end_time: Scalars['String']['output'];
  /** An object relationship */
  location: Maybe<Locations>;
  /** Location of this meeting session */
  location_id: Maybe<Scalars['Int']['output']>;
  /** Start time of this meeting session */
  start_time: Scalars['String']['output'];
};

/** order by aggregate values of table "course_meetings" */
export type CourseMeetingsAggregateOrderBy = {
  avg: InputMaybe<CourseMeetingsAvgOrderBy>;
  count: InputMaybe<OrderBy>;
  max: InputMaybe<CourseMeetingsMaxOrderBy>;
  min: InputMaybe<CourseMeetingsMinOrderBy>;
  stddev: InputMaybe<CourseMeetingsStddevOrderBy>;
  stddev_pop: InputMaybe<CourseMeetingsStddevPopOrderBy>;
  stddev_samp: InputMaybe<CourseMeetingsStddevSampOrderBy>;
  sum: InputMaybe<CourseMeetingsSumOrderBy>;
  var_pop: InputMaybe<CourseMeetingsVarPopOrderBy>;
  var_samp: InputMaybe<CourseMeetingsVarSampOrderBy>;
  variance: InputMaybe<CourseMeetingsVarianceOrderBy>;
};

/** order by avg() on columns of table "course_meetings" */
export type CourseMeetingsAvgOrderBy = {
  course_id: InputMaybe<OrderBy>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<OrderBy>;
  /** Location of this meeting session */
  location_id: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "course_meetings". All fields are combined with a logical 'AND'. */
export type CourseMeetingsBoolExp = {
  _and: InputMaybe<Array<CourseMeetingsBoolExp>>;
  _not: InputMaybe<CourseMeetingsBoolExp>;
  _or: InputMaybe<Array<CourseMeetingsBoolExp>>;
  course: InputMaybe<CoursesBoolExp>;
  course_id: InputMaybe<IntComparisonExp>;
  days_of_week: InputMaybe<IntComparisonExp>;
  end_time: InputMaybe<StringComparisonExp>;
  location: InputMaybe<LocationsBoolExp>;
  location_id: InputMaybe<IntComparisonExp>;
  start_time: InputMaybe<StringComparisonExp>;
};

/** order by max() on columns of table "course_meetings" */
export type CourseMeetingsMaxOrderBy = {
  course_id: InputMaybe<OrderBy>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<OrderBy>;
  /** End time of this meeting session */
  end_time: InputMaybe<OrderBy>;
  /** Location of this meeting session */
  location_id: InputMaybe<OrderBy>;
  /** Start time of this meeting session */
  start_time: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "course_meetings" */
export type CourseMeetingsMinOrderBy = {
  course_id: InputMaybe<OrderBy>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<OrderBy>;
  /** End time of this meeting session */
  end_time: InputMaybe<OrderBy>;
  /** Location of this meeting session */
  location_id: InputMaybe<OrderBy>;
  /** Start time of this meeting session */
  start_time: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "course_meetings". */
export type CourseMeetingsOrderBy = {
  course: InputMaybe<CoursesOrderBy>;
  course_id: InputMaybe<OrderBy>;
  days_of_week: InputMaybe<OrderBy>;
  end_time: InputMaybe<OrderBy>;
  location: InputMaybe<LocationsOrderBy>;
  location_id: InputMaybe<OrderBy>;
  start_time: InputMaybe<OrderBy>;
};

/** select columns of table "course_meetings" */
export enum CourseMeetingsSelectColumn {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  DaysOfWeek = 'days_of_week',
  /** column name */
  EndTime = 'end_time',
  /** column name */
  LocationId = 'location_id',
  /** column name */
  StartTime = 'start_time',
}

/** order by stddev() on columns of table "course_meetings" */
export type CourseMeetingsStddevOrderBy = {
  course_id: InputMaybe<OrderBy>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<OrderBy>;
  /** Location of this meeting session */
  location_id: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "course_meetings" */
export type CourseMeetingsStddevPopOrderBy = {
  course_id: InputMaybe<OrderBy>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<OrderBy>;
  /** Location of this meeting session */
  location_id: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "course_meetings" */
export type CourseMeetingsStddevSampOrderBy = {
  course_id: InputMaybe<OrderBy>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<OrderBy>;
  /** Location of this meeting session */
  location_id: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "course_meetings" */
export type CourseMeetingsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CourseMeetingsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CourseMeetingsStreamCursorValueInput = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<Scalars['Int']['input']>;
  /** End time of this meeting session */
  end_time: InputMaybe<Scalars['String']['input']>;
  /** Location of this meeting session */
  location_id: InputMaybe<Scalars['Int']['input']>;
  /** Start time of this meeting session */
  start_time: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "course_meetings" */
export type CourseMeetingsSumOrderBy = {
  course_id: InputMaybe<OrderBy>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<OrderBy>;
  /** Location of this meeting session */
  location_id: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "course_meetings" */
export type CourseMeetingsVarPopOrderBy = {
  course_id: InputMaybe<OrderBy>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<OrderBy>;
  /** Location of this meeting session */
  location_id: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "course_meetings" */
export type CourseMeetingsVarSampOrderBy = {
  course_id: InputMaybe<OrderBy>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<OrderBy>;
  /** Location of this meeting session */
  location_id: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "course_meetings" */
export type CourseMeetingsVarianceOrderBy = {
  course_id: InputMaybe<OrderBy>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: InputMaybe<OrderBy>;
  /** Location of this meeting session */
  location_id: InputMaybe<OrderBy>;
};

/** columns and relationships of "course_professors" */
export type CourseProfessors = {
  __typename?: 'course_professors';
  /** An object relationship */
  course: Courses;
  course_id: Scalars['Int']['output'];
  /** An object relationship */
  professor: Professors;
  professor_id: Scalars['Int']['output'];
};

/** order by aggregate values of table "course_professors" */
export type CourseProfessorsAggregateOrderBy = {
  avg: InputMaybe<CourseProfessorsAvgOrderBy>;
  count: InputMaybe<OrderBy>;
  max: InputMaybe<CourseProfessorsMaxOrderBy>;
  min: InputMaybe<CourseProfessorsMinOrderBy>;
  stddev: InputMaybe<CourseProfessorsStddevOrderBy>;
  stddev_pop: InputMaybe<CourseProfessorsStddevPopOrderBy>;
  stddev_samp: InputMaybe<CourseProfessorsStddevSampOrderBy>;
  sum: InputMaybe<CourseProfessorsSumOrderBy>;
  var_pop: InputMaybe<CourseProfessorsVarPopOrderBy>;
  var_samp: InputMaybe<CourseProfessorsVarSampOrderBy>;
  variance: InputMaybe<CourseProfessorsVarianceOrderBy>;
};

/** order by avg() on columns of table "course_professors" */
export type CourseProfessorsAvgOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "course_professors". All fields are combined with a logical 'AND'. */
export type CourseProfessorsBoolExp = {
  _and: InputMaybe<Array<CourseProfessorsBoolExp>>;
  _not: InputMaybe<CourseProfessorsBoolExp>;
  _or: InputMaybe<Array<CourseProfessorsBoolExp>>;
  course: InputMaybe<CoursesBoolExp>;
  course_id: InputMaybe<IntComparisonExp>;
  professor: InputMaybe<ProfessorsBoolExp>;
  professor_id: InputMaybe<IntComparisonExp>;
};

/** order by max() on columns of table "course_professors" */
export type CourseProfessorsMaxOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "course_professors" */
export type CourseProfessorsMinOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "course_professors". */
export type CourseProfessorsOrderBy = {
  course: InputMaybe<CoursesOrderBy>;
  course_id: InputMaybe<OrderBy>;
  professor: InputMaybe<ProfessorsOrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** select columns of table "course_professors" */
export enum CourseProfessorsSelectColumn {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  ProfessorId = 'professor_id',
}

/** order by stddev() on columns of table "course_professors" */
export type CourseProfessorsStddevOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "course_professors" */
export type CourseProfessorsStddevPopOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "course_professors" */
export type CourseProfessorsStddevSampOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "course_professors" */
export type CourseProfessorsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CourseProfessorsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CourseProfessorsStreamCursorValueInput = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** order by sum() on columns of table "course_professors" */
export type CourseProfessorsSumOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "course_professors" */
export type CourseProfessorsVarPopOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "course_professors" */
export type CourseProfessorsVarSampOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "course_professors" */
export type CourseProfessorsVarianceOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** columns and relationships of "courses" */
export type Courses = {
  __typename?: 'courses';
  all_course_codes: Scalars['StringArr']['output'];
  /** Course areas (humanities, social sciences, sciences) */
  areas: Scalars['StringArr']['output'];
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Scalars['Int']['output'];
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: Scalars['Int']['output'];
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Scalars['Int']['output'];
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: Scalars['Int']['output'];
  /** Additional class notes */
  classnotes: Maybe<Scalars['String']['output']>;
  /** True if the course is a college seminar. False otherwise. */
  colsem: Scalars['Boolean']['output'];
  /** An array relationship */
  course_flags: Array<CourseFlags>;
  /** Link to the course homepage */
  course_home_url: Maybe<Scalars['String']['output']>;
  course_id: Scalars['Int']['output'];
  /** An array relationship */
  course_meetings: Array<CourseMeetings>;
  /** An array relationship */
  course_professors: Array<CourseProfessors>;
  /** Number of course credits */
  credits: Maybe<Scalars['float8']['output']>;
  /** Course description */
  description: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  evaluation_narratives: Array<EvaluationNarratives>;
  /** An array relationship */
  evaluation_ratings: Array<EvaluationRatings>;
  /** An object relationship */
  evaluation_statistic: Maybe<EvaluationStatistics>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info: Scalars['ExtraInfo']['output'];
  /** Final exam information */
  final_exam: Maybe<Scalars['String']['output']>;
  /** True if the course is a first-year seminar. False otherwise. */
  fysem: Scalars['Boolean']['output'];
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Int']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Int']['output']>;
  /** [computed] Whether last enrollment offering is with same professor as current. */
  last_enrollment_same_professors: Maybe<Scalars['Boolean']['output']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: Maybe<Scalars['String']['output']>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: Maybe<Scalars['Int']['output']>;
  last_updated: Maybe<Scalars['timestamp']['output']>;
  /** An array relationship */
  listings: Array<Listings>;
  /** CRN of the primary listing */
  primary_crn: Maybe<Scalars['Crn']['output']>;
  /** Registrar's notes (e.g. preference selection links, optional writing credits, etc.) */
  regnotes: Maybe<Scalars['String']['output']>;
  /** Recommended requirements/prerequisites for the course */
  requirements: Maybe<Scalars['String']['output']>;
  /** Reading period notes */
  rp_attr: Maybe<Scalars['String']['output']>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: Scalars['Int']['output'];
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: Scalars['Int']['output'];
  /** An object relationship */
  season: Seasons;
  /** The season the course is being taught in */
  season_code: Scalars['Season']['output'];
  /** Course section. Note that the section number is the same for all cross-listings. */
  section: Scalars['String']['output'];
  /** Skills that the course fulfills (e.g. writing, quantitative reasoning, language levels) */
  skills: Scalars['StringArr']['output'];
  /** Link to the syllabus */
  syllabus_url: Maybe<Scalars['String']['output']>;
  /** True if the course is a sophomore seminar. False otherwise. */
  sysem: Scalars['Boolean']['output'];
  time_added: Maybe<Scalars['timestamp']['output']>;
  /** Complete course title */
  title: Scalars['String']['output'];
};

/** columns and relationships of "courses" */
export type CoursesAreasArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "courses" */
export type CoursesCourseFlagsArgs = {
  distinct_on: InputMaybe<Array<CourseFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseFlagsOrderBy>>;
  where: InputMaybe<CourseFlagsBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesCourseMeetingsArgs = {
  distinct_on: InputMaybe<Array<CourseMeetingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseMeetingsOrderBy>>;
  where: InputMaybe<CourseMeetingsBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesCourseProfessorsArgs = {
  distinct_on: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseProfessorsOrderBy>>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesEvaluationNarrativesArgs = {
  distinct_on: InputMaybe<Array<EvaluationNarrativesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationNarrativesOrderBy>>;
  where: InputMaybe<EvaluationNarrativesBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesEvaluationRatingsArgs = {
  distinct_on: InputMaybe<Array<EvaluationRatingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationRatingsOrderBy>>;
  where: InputMaybe<EvaluationRatingsBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesListingsArgs = {
  distinct_on: InputMaybe<Array<ListingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ListingsOrderBy>>;
  where: InputMaybe<ListingsBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesSkillsArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** order by aggregate values of table "courses" */
export type CoursesAggregateOrderBy = {
  avg: InputMaybe<CoursesAvgOrderBy>;
  count: InputMaybe<OrderBy>;
  max: InputMaybe<CoursesMaxOrderBy>;
  min: InputMaybe<CoursesMinOrderBy>;
  stddev: InputMaybe<CoursesStddevOrderBy>;
  stddev_pop: InputMaybe<CoursesStddevPopOrderBy>;
  stddev_samp: InputMaybe<CoursesStddevSampOrderBy>;
  sum: InputMaybe<CoursesSumOrderBy>;
  var_pop: InputMaybe<CoursesVarPopOrderBy>;
  var_samp: InputMaybe<CoursesVarSampOrderBy>;
  variance: InputMaybe<CoursesVarianceOrderBy>;
};

/** order by avg() on columns of table "courses" */
export type CoursesAvgOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<OrderBy>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "courses". All fields are combined with a logical 'AND'. */
export type CoursesBoolExp = {
  _and: InputMaybe<Array<CoursesBoolExp>>;
  _not: InputMaybe<CoursesBoolExp>;
  _or: InputMaybe<Array<CoursesBoolExp>>;
  areas: InputMaybe<JsonbComparisonExp>;
  average_gut_rating: InputMaybe<Float8ComparisonExp>;
  average_professor_rating: InputMaybe<Float8ComparisonExp>;
  average_rating: InputMaybe<Float8ComparisonExp>;
  average_rating_n: InputMaybe<IntComparisonExp>;
  average_rating_same_professors: InputMaybe<Float8ComparisonExp>;
  average_rating_same_professors_n: InputMaybe<IntComparisonExp>;
  average_workload: InputMaybe<Float8ComparisonExp>;
  average_workload_n: InputMaybe<IntComparisonExp>;
  average_workload_same_professors: InputMaybe<Float8ComparisonExp>;
  average_workload_same_professors_n: InputMaybe<IntComparisonExp>;
  classnotes: InputMaybe<StringComparisonExp>;
  colsem: InputMaybe<BooleanComparisonExp>;
  course_flags: InputMaybe<CourseFlagsBoolExp>;
  course_home_url: InputMaybe<StringComparisonExp>;
  course_id: InputMaybe<IntComparisonExp>;
  course_meetings: InputMaybe<CourseMeetingsBoolExp>;
  course_professors: InputMaybe<CourseProfessorsBoolExp>;
  credits: InputMaybe<Float8ComparisonExp>;
  description: InputMaybe<StringComparisonExp>;
  evaluation_narratives: InputMaybe<EvaluationNarrativesBoolExp>;
  evaluation_ratings: InputMaybe<EvaluationRatingsBoolExp>;
  evaluation_statistic: InputMaybe<EvaluationStatisticsBoolExp>;
  extra_info: InputMaybe<StringComparisonExp>;
  final_exam: InputMaybe<StringComparisonExp>;
  fysem: InputMaybe<BooleanComparisonExp>;
  last_enrollment: InputMaybe<IntComparisonExp>;
  last_enrollment_course_id: InputMaybe<IntComparisonExp>;
  last_enrollment_same_professors: InputMaybe<BooleanComparisonExp>;
  last_enrollment_season_code: InputMaybe<StringComparisonExp>;
  last_offered_course_id: InputMaybe<IntComparisonExp>;
  last_updated: InputMaybe<TimestampComparisonExp>;
  listings: InputMaybe<ListingsBoolExp>;
  primary_crn: InputMaybe<IntComparisonExp>;
  regnotes: InputMaybe<StringComparisonExp>;
  requirements: InputMaybe<StringComparisonExp>;
  rp_attr: InputMaybe<StringComparisonExp>;
  same_course_and_profs_id: InputMaybe<IntComparisonExp>;
  same_course_id: InputMaybe<IntComparisonExp>;
  season: InputMaybe<SeasonsBoolExp>;
  season_code: InputMaybe<StringComparisonExp>;
  section: InputMaybe<StringComparisonExp>;
  skills: InputMaybe<JsonbComparisonExp>;
  syllabus_url: InputMaybe<StringComparisonExp>;
  sysem: InputMaybe<BooleanComparisonExp>;
  time_added: InputMaybe<TimestampComparisonExp>;
  title: InputMaybe<StringComparisonExp>;
};

/** order by max() on columns of table "courses" */
export type CoursesMaxOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  /** Additional class notes */
  classnotes: InputMaybe<OrderBy>;
  /** Link to the course homepage */
  course_home_url: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** Course description */
  description: InputMaybe<OrderBy>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info: InputMaybe<OrderBy>;
  /** Final exam information */
  final_exam: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: InputMaybe<OrderBy>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<OrderBy>;
  /** Registrar's notes (e.g. preference selection links, optional writing credits, etc.) */
  regnotes: InputMaybe<OrderBy>;
  /** Recommended requirements/prerequisites for the course */
  requirements: InputMaybe<OrderBy>;
  /** Reading period notes */
  rp_attr: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<OrderBy>;
  /** The season the course is being taught in */
  season_code: InputMaybe<OrderBy>;
  /** Course section. Note that the section number is the same for all cross-listings. */
  section: InputMaybe<OrderBy>;
  /** Link to the syllabus */
  syllabus_url: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
  /** Complete course title */
  title: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "courses" */
export type CoursesMinOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  /** Additional class notes */
  classnotes: InputMaybe<OrderBy>;
  /** Link to the course homepage */
  course_home_url: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** Course description */
  description: InputMaybe<OrderBy>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info: InputMaybe<OrderBy>;
  /** Final exam information */
  final_exam: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: InputMaybe<OrderBy>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<OrderBy>;
  /** Registrar's notes (e.g. preference selection links, optional writing credits, etc.) */
  regnotes: InputMaybe<OrderBy>;
  /** Recommended requirements/prerequisites for the course */
  requirements: InputMaybe<OrderBy>;
  /** Reading period notes */
  rp_attr: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<OrderBy>;
  /** The season the course is being taught in */
  season_code: InputMaybe<OrderBy>;
  /** Course section. Note that the section number is the same for all cross-listings. */
  section: InputMaybe<OrderBy>;
  /** Link to the syllabus */
  syllabus_url: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
  /** Complete course title */
  title: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "courses". */
export type CoursesOrderBy = {
  areas: InputMaybe<OrderBy>;
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor_rating: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  classnotes: InputMaybe<OrderBy>;
  colsem: InputMaybe<OrderBy>;
  course_flags_aggregate: InputMaybe<CourseFlagsAggregateOrderBy>;
  course_home_url: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  course_meetings_aggregate: InputMaybe<CourseMeetingsAggregateOrderBy>;
  course_professors_aggregate: InputMaybe<CourseProfessorsAggregateOrderBy>;
  credits: InputMaybe<OrderBy>;
  description: InputMaybe<OrderBy>;
  evaluation_narratives_aggregate: InputMaybe<EvaluationNarrativesAggregateOrderBy>;
  evaluation_ratings_aggregate: InputMaybe<EvaluationRatingsAggregateOrderBy>;
  evaluation_statistic: InputMaybe<EvaluationStatisticsOrderBy>;
  extra_info: InputMaybe<OrderBy>;
  final_exam: InputMaybe<OrderBy>;
  fysem: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_enrollment_same_professors: InputMaybe<OrderBy>;
  last_enrollment_season_code: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  listings_aggregate: InputMaybe<ListingsAggregateOrderBy>;
  primary_crn: InputMaybe<OrderBy>;
  regnotes: InputMaybe<OrderBy>;
  requirements: InputMaybe<OrderBy>;
  rp_attr: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
  season: InputMaybe<SeasonsOrderBy>;
  season_code: InputMaybe<OrderBy>;
  section: InputMaybe<OrderBy>;
  skills: InputMaybe<OrderBy>;
  syllabus_url: InputMaybe<OrderBy>;
  sysem: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
  title: InputMaybe<OrderBy>;
};

/** select columns of table "courses" */
export enum CoursesSelectColumn {
  /** column name */
  Areas = 'areas',
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessorRating = 'average_professor_rating',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingN = 'average_rating_n',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageRatingSameProfessorsN = 'average_rating_same_professors_n',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadN = 'average_workload_n',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  AverageWorkloadSameProfessorsN = 'average_workload_same_professors_n',
  /** column name */
  Classnotes = 'classnotes',
  /** column name */
  Colsem = 'colsem',
  /** column name */
  CourseHomeUrl = 'course_home_url',
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Credits = 'credits',
  /** column name */
  Description = 'description',
  /** column name */
  ExtraInfo = 'extra_info',
  /** column name */
  FinalExam = 'final_exam',
  /** column name */
  Fysem = 'fysem',
  /** column name */
  LastEnrollment = 'last_enrollment',
  /** column name */
  LastEnrollmentCourseId = 'last_enrollment_course_id',
  /** column name */
  LastEnrollmentSameProfessors = 'last_enrollment_same_professors',
  /** column name */
  LastEnrollmentSeasonCode = 'last_enrollment_season_code',
  /** column name */
  LastOfferedCourseId = 'last_offered_course_id',
  /** column name */
  LastUpdated = 'last_updated',
  /** column name */
  PrimaryCrn = 'primary_crn',
  /** column name */
  Regnotes = 'regnotes',
  /** column name */
  Requirements = 'requirements',
  /** column name */
  RpAttr = 'rp_attr',
  /** column name */
  SameCourseAndProfsId = 'same_course_and_profs_id',
  /** column name */
  SameCourseId = 'same_course_id',
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Section = 'section',
  /** column name */
  Skills = 'skills',
  /** column name */
  SyllabusUrl = 'syllabus_url',
  /** column name */
  Sysem = 'sysem',
  /** column name */
  TimeAdded = 'time_added',
  /** column name */
  Title = 'title',
}

/** order by stddev() on columns of table "courses" */
export type CoursesStddevOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<OrderBy>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "courses" */
export type CoursesStddevPopOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<OrderBy>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "courses" */
export type CoursesStddevSampOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<OrderBy>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "courses" */
export type CoursesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: CoursesStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type CoursesStreamCursorValueInput = {
  /** Course areas (humanities, social sciences, sciences) */
  areas: InputMaybe<Scalars['jsonb']['input']>;
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Scalars['Int']['input']>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  /** Additional class notes */
  classnotes: InputMaybe<Scalars['String']['input']>;
  /** True if the course is a college seminar. False otherwise. */
  colsem: InputMaybe<Scalars['Boolean']['input']>;
  /** Link to the course homepage */
  course_home_url: InputMaybe<Scalars['String']['input']>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** Number of course credits */
  credits: InputMaybe<Scalars['float8']['input']>;
  /** Course description */
  description: InputMaybe<Scalars['String']['input']>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info: InputMaybe<Scalars['String']['input']>;
  /** Final exam information */
  final_exam: InputMaybe<Scalars['String']['input']>;
  /** True if the course is a first-year seminar. False otherwise. */
  fysem: InputMaybe<Scalars['Boolean']['input']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Scalars['Int']['input']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Scalars['Int']['input']>;
  /** [computed] Whether last enrollment offering is with same professor as current. */
  last_enrollment_same_professors: InputMaybe<Scalars['Boolean']['input']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: InputMaybe<Scalars['String']['input']>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<Scalars['Int']['input']>;
  last_updated: InputMaybe<Scalars['timestamp']['input']>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<Scalars['Int']['input']>;
  /** Registrar's notes (e.g. preference selection links, optional writing credits, etc.) */
  regnotes: InputMaybe<Scalars['String']['input']>;
  /** Recommended requirements/prerequisites for the course */
  requirements: InputMaybe<Scalars['String']['input']>;
  /** Reading period notes */
  rp_attr: InputMaybe<Scalars['String']['input']>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<Scalars['Int']['input']>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<Scalars['Int']['input']>;
  /** The season the course is being taught in */
  season_code: InputMaybe<Scalars['String']['input']>;
  /** Course section. Note that the section number is the same for all cross-listings. */
  section: InputMaybe<Scalars['String']['input']>;
  /** Skills that the course fulfills (e.g. writing, quantitative reasoning, language levels) */
  skills: InputMaybe<Scalars['jsonb']['input']>;
  /** Link to the syllabus */
  syllabus_url: InputMaybe<Scalars['String']['input']>;
  /** True if the course is a sophomore seminar. False otherwise. */
  sysem: InputMaybe<Scalars['Boolean']['input']>;
  time_added: InputMaybe<Scalars['timestamp']['input']>;
  /** Complete course title */
  title: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "courses" */
export type CoursesSumOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<OrderBy>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "courses" */
export type CoursesVarPopOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<OrderBy>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "courses" */
export type CoursesVarSampOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<OrderBy>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "courses" */
export type CoursesVarianceOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /** [computed] Historical average course rating for this course code, aggregated across all cross-listings with same set of professors */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating_same_professors` */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /** [computed] Historical average workload rating, aggregated across all cross-listings with same set of professors */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload_same_professors` */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /** [computed] Most recent previous offering of course (excluding future ones) */
  last_offered_course_id: InputMaybe<OrderBy>;
  /** CRN of the primary listing */
  primary_crn: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. Same as 'same_course_id' with the constraint that all courses in a group were taught by the same professors. */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /** [computed] Unique ID for grouping courses by historical offering. All courses with a given ID are identical offerings across different semesters. */
  same_course_id: InputMaybe<OrderBy>;
};

/** ordering argument of a cursor */
export enum CursorOrdering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** columns and relationships of "evaluation_narratives" */
export type EvaluationNarratives = {
  __typename?: 'evaluation_narratives';
  /** Response to the question */
  comment: Scalars['String']['output'];
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Scalars['float8']['output'];
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Scalars['float8']['output'];
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Scalars['float8']['output'];
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Scalars['float8']['output'];
  /** An object relationship */
  course: Courses;
  /** The course to which this narrative comment applies */
  course_id: Scalars['Int']['output'];
  /** An object relationship */
  evaluation_question: EvaluationQuestions;
  id: Scalars['Int']['output'];
  /** Question to which this narrative comment responds */
  question_code: Scalars['String']['output'];
  /** The number of the response for the given course and question */
  response_number: Scalars['Int']['output'];
};

/** order by aggregate values of table "evaluation_narratives" */
export type EvaluationNarrativesAggregateOrderBy = {
  avg: InputMaybe<EvaluationNarrativesAvgOrderBy>;
  count: InputMaybe<OrderBy>;
  max: InputMaybe<EvaluationNarrativesMaxOrderBy>;
  min: InputMaybe<EvaluationNarrativesMinOrderBy>;
  stddev: InputMaybe<EvaluationNarrativesStddevOrderBy>;
  stddev_pop: InputMaybe<EvaluationNarrativesStddevPopOrderBy>;
  stddev_samp: InputMaybe<EvaluationNarrativesStddevSampOrderBy>;
  sum: InputMaybe<EvaluationNarrativesSumOrderBy>;
  var_pop: InputMaybe<EvaluationNarrativesVarPopOrderBy>;
  var_samp: InputMaybe<EvaluationNarrativesVarSampOrderBy>;
  variance: InputMaybe<EvaluationNarrativesVarianceOrderBy>;
};

/** order by avg() on columns of table "evaluation_narratives" */
export type EvaluationNarrativesAvgOrderBy = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<OrderBy>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<OrderBy>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<OrderBy>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<OrderBy>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "evaluation_narratives". All fields are combined with a logical 'AND'. */
export type EvaluationNarrativesBoolExp = {
  _and: InputMaybe<Array<EvaluationNarrativesBoolExp>>;
  _not: InputMaybe<EvaluationNarrativesBoolExp>;
  _or: InputMaybe<Array<EvaluationNarrativesBoolExp>>;
  comment: InputMaybe<StringComparisonExp>;
  comment_compound: InputMaybe<Float8ComparisonExp>;
  comment_neg: InputMaybe<Float8ComparisonExp>;
  comment_neu: InputMaybe<Float8ComparisonExp>;
  comment_pos: InputMaybe<Float8ComparisonExp>;
  course: InputMaybe<CoursesBoolExp>;
  course_id: InputMaybe<IntComparisonExp>;
  evaluation_question: InputMaybe<EvaluationQuestionsBoolExp>;
  id: InputMaybe<IntComparisonExp>;
  question_code: InputMaybe<StringComparisonExp>;
  response_number: InputMaybe<IntComparisonExp>;
};

/** order by max() on columns of table "evaluation_narratives" */
export type EvaluationNarrativesMaxOrderBy = {
  /** Response to the question */
  comment: InputMaybe<OrderBy>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<OrderBy>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<OrderBy>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<OrderBy>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<OrderBy>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** Question to which this narrative comment responds */
  question_code: InputMaybe<OrderBy>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "evaluation_narratives" */
export type EvaluationNarrativesMinOrderBy = {
  /** Response to the question */
  comment: InputMaybe<OrderBy>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<OrderBy>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<OrderBy>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<OrderBy>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<OrderBy>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** Question to which this narrative comment responds */
  question_code: InputMaybe<OrderBy>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "evaluation_narratives". */
export type EvaluationNarrativesOrderBy = {
  comment: InputMaybe<OrderBy>;
  comment_compound: InputMaybe<OrderBy>;
  comment_neg: InputMaybe<OrderBy>;
  comment_neu: InputMaybe<OrderBy>;
  comment_pos: InputMaybe<OrderBy>;
  course: InputMaybe<CoursesOrderBy>;
  course_id: InputMaybe<OrderBy>;
  evaluation_question: InputMaybe<EvaluationQuestionsOrderBy>;
  id: InputMaybe<OrderBy>;
  question_code: InputMaybe<OrderBy>;
  response_number: InputMaybe<OrderBy>;
};

/** select columns of table "evaluation_narratives" */
export enum EvaluationNarrativesSelectColumn {
  /** column name */
  Comment = 'comment',
  /** column name */
  CommentCompound = 'comment_compound',
  /** column name */
  CommentNeg = 'comment_neg',
  /** column name */
  CommentNeu = 'comment_neu',
  /** column name */
  CommentPos = 'comment_pos',
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Id = 'id',
  /** column name */
  QuestionCode = 'question_code',
  /** column name */
  ResponseNumber = 'response_number',
}

/** order by stddev() on columns of table "evaluation_narratives" */
export type EvaluationNarrativesStddevOrderBy = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<OrderBy>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<OrderBy>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<OrderBy>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<OrderBy>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "evaluation_narratives" */
export type EvaluationNarrativesStddevPopOrderBy = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<OrderBy>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<OrderBy>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<OrderBy>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<OrderBy>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "evaluation_narratives" */
export type EvaluationNarrativesStddevSampOrderBy = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<OrderBy>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<OrderBy>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<OrderBy>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<OrderBy>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "evaluation_narratives" */
export type EvaluationNarrativesStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: EvaluationNarrativesStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type EvaluationNarrativesStreamCursorValueInput = {
  /** Response to the question */
  comment: InputMaybe<Scalars['String']['input']>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Scalars['float8']['input']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Scalars['float8']['input']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Scalars['float8']['input']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Scalars['float8']['input']>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this narrative comment responds */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<Scalars['Int']['input']>;
};

/** order by sum() on columns of table "evaluation_narratives" */
export type EvaluationNarrativesSumOrderBy = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<OrderBy>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<OrderBy>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<OrderBy>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<OrderBy>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "evaluation_narratives" */
export type EvaluationNarrativesVarPopOrderBy = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<OrderBy>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<OrderBy>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<OrderBy>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<OrderBy>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "evaluation_narratives" */
export type EvaluationNarrativesVarSampOrderBy = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<OrderBy>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<OrderBy>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<OrderBy>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<OrderBy>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "evaluation_narratives" */
export type EvaluationNarrativesVarianceOrderBy = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<OrderBy>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<OrderBy>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<OrderBy>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<OrderBy>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** The number of the response for the given course and question */
  response_number: InputMaybe<OrderBy>;
};

/** columns and relationships of "evaluation_questions" */
export type EvaluationQuestions = {
  __typename?: 'evaluation_questions';
  /** An array relationship */
  evaluation_narratives: Array<EvaluationNarratives>;
  /** An array relationship */
  evaluation_ratings: Array<EvaluationRatings>;
  /** True if the question has narrative responses. False if the question has categorical/numerical responses */
  is_narrative: Scalars['Boolean']['output'];
  /** JSON array of possible responses (only if the question is not a narrative) */
  options: Scalars['StringArr']['output'];
  /** Question code from OCE (e.g. "YC402") */
  question_code: Scalars['String']['output'];
  /** The question text */
  question_text: Scalars['String']['output'];
  /** [computed] Question type. The 'Overall' and 'Workload' tags are used to compute average ratings, while others are purely for identification purposes. No other commonality, other than that they contain similar keywords, is guaranteed—for example, they may have different options, or even differ in being narrative or not. */
  tag: Maybe<Scalars['String']['output']>;
};

/** columns and relationships of "evaluation_questions" */
export type EvaluationQuestionsEvaluationNarrativesArgs = {
  distinct_on: InputMaybe<Array<EvaluationNarrativesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationNarrativesOrderBy>>;
  where: InputMaybe<EvaluationNarrativesBoolExp>;
};

/** columns and relationships of "evaluation_questions" */
export type EvaluationQuestionsEvaluationRatingsArgs = {
  distinct_on: InputMaybe<Array<EvaluationRatingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationRatingsOrderBy>>;
  where: InputMaybe<EvaluationRatingsBoolExp>;
};

/** columns and relationships of "evaluation_questions" */
export type EvaluationQuestionsOptionsArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to filter rows from the table "evaluation_questions". All fields are combined with a logical 'AND'. */
export type EvaluationQuestionsBoolExp = {
  _and: InputMaybe<Array<EvaluationQuestionsBoolExp>>;
  _not: InputMaybe<EvaluationQuestionsBoolExp>;
  _or: InputMaybe<Array<EvaluationQuestionsBoolExp>>;
  evaluation_narratives: InputMaybe<EvaluationNarrativesBoolExp>;
  evaluation_ratings: InputMaybe<EvaluationRatingsBoolExp>;
  is_narrative: InputMaybe<BooleanComparisonExp>;
  options: InputMaybe<JsonbComparisonExp>;
  question_code: InputMaybe<StringComparisonExp>;
  question_text: InputMaybe<StringComparisonExp>;
  tag: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "evaluation_questions". */
export type EvaluationQuestionsOrderBy = {
  evaluation_narratives_aggregate: InputMaybe<EvaluationNarrativesAggregateOrderBy>;
  evaluation_ratings_aggregate: InputMaybe<EvaluationRatingsAggregateOrderBy>;
  is_narrative: InputMaybe<OrderBy>;
  options: InputMaybe<OrderBy>;
  question_code: InputMaybe<OrderBy>;
  question_text: InputMaybe<OrderBy>;
  tag: InputMaybe<OrderBy>;
};

/** select columns of table "evaluation_questions" */
export enum EvaluationQuestionsSelectColumn {
  /** column name */
  IsNarrative = 'is_narrative',
  /** column name */
  Options = 'options',
  /** column name */
  QuestionCode = 'question_code',
  /** column name */
  QuestionText = 'question_text',
  /** column name */
  Tag = 'tag',
}

/** Streaming cursor of the table "evaluation_questions" */
export type EvaluationQuestionsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: EvaluationQuestionsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type EvaluationQuestionsStreamCursorValueInput = {
  /** True if the question has narrative responses. False if the question has categorical/numerical responses */
  is_narrative: InputMaybe<Scalars['Boolean']['input']>;
  /** JSON array of possible responses (only if the question is not a narrative) */
  options: InputMaybe<Scalars['jsonb']['input']>;
  /** Question code from OCE (e.g. "YC402") */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** The question text */
  question_text: InputMaybe<Scalars['String']['input']>;
  /** [computed] Question type. The 'Overall' and 'Workload' tags are used to compute average ratings, while others are purely for identification purposes. No other commonality, other than that they contain similar keywords, is guaranteed—for example, they may have different options, or even differ in being narrative or not. */
  tag: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "evaluation_ratings" */
export type EvaluationRatings = {
  __typename?: 'evaluation_ratings';
  /** An object relationship */
  course: Courses;
  /** The course to which this rating applies */
  course_id: Scalars['Int']['output'];
  /** An object relationship */
  evaluation_question: EvaluationQuestions;
  id: Scalars['Int']['output'];
  /** Question to which this rating responds */
  question_code: Scalars['String']['output'];
  /** JSON array of the response counts for each option */
  rating: Scalars['NumberArr']['output'];
};

/** columns and relationships of "evaluation_ratings" */
export type EvaluationRatingsRatingArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** order by aggregate values of table "evaluation_ratings" */
export type EvaluationRatingsAggregateOrderBy = {
  avg: InputMaybe<EvaluationRatingsAvgOrderBy>;
  count: InputMaybe<OrderBy>;
  max: InputMaybe<EvaluationRatingsMaxOrderBy>;
  min: InputMaybe<EvaluationRatingsMinOrderBy>;
  stddev: InputMaybe<EvaluationRatingsStddevOrderBy>;
  stddev_pop: InputMaybe<EvaluationRatingsStddevPopOrderBy>;
  stddev_samp: InputMaybe<EvaluationRatingsStddevSampOrderBy>;
  sum: InputMaybe<EvaluationRatingsSumOrderBy>;
  var_pop: InputMaybe<EvaluationRatingsVarPopOrderBy>;
  var_samp: InputMaybe<EvaluationRatingsVarSampOrderBy>;
  variance: InputMaybe<EvaluationRatingsVarianceOrderBy>;
};

/** order by avg() on columns of table "evaluation_ratings" */
export type EvaluationRatingsAvgOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "evaluation_ratings". All fields are combined with a logical 'AND'. */
export type EvaluationRatingsBoolExp = {
  _and: InputMaybe<Array<EvaluationRatingsBoolExp>>;
  _not: InputMaybe<EvaluationRatingsBoolExp>;
  _or: InputMaybe<Array<EvaluationRatingsBoolExp>>;
  course: InputMaybe<CoursesBoolExp>;
  course_id: InputMaybe<IntComparisonExp>;
  evaluation_question: InputMaybe<EvaluationQuestionsBoolExp>;
  id: InputMaybe<IntComparisonExp>;
  question_code: InputMaybe<StringComparisonExp>;
  rating: InputMaybe<JsonbComparisonExp>;
};

/** order by max() on columns of table "evaluation_ratings" */
export type EvaluationRatingsMaxOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** Question to which this rating responds */
  question_code: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "evaluation_ratings" */
export type EvaluationRatingsMinOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** Question to which this rating responds */
  question_code: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "evaluation_ratings". */
export type EvaluationRatingsOrderBy = {
  course: InputMaybe<CoursesOrderBy>;
  course_id: InputMaybe<OrderBy>;
  evaluation_question: InputMaybe<EvaluationQuestionsOrderBy>;
  id: InputMaybe<OrderBy>;
  question_code: InputMaybe<OrderBy>;
  rating: InputMaybe<OrderBy>;
};

/** select columns of table "evaluation_ratings" */
export enum EvaluationRatingsSelectColumn {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Id = 'id',
  /** column name */
  QuestionCode = 'question_code',
  /** column name */
  Rating = 'rating',
}

/** order by stddev() on columns of table "evaluation_ratings" */
export type EvaluationRatingsStddevOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "evaluation_ratings" */
export type EvaluationRatingsStddevPopOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "evaluation_ratings" */
export type EvaluationRatingsStddevSampOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "evaluation_ratings" */
export type EvaluationRatingsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: EvaluationRatingsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type EvaluationRatingsStreamCursorValueInput = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this rating responds */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** JSON array of the response counts for each option */
  rating: InputMaybe<Scalars['jsonb']['input']>;
};

/** order by sum() on columns of table "evaluation_ratings" */
export type EvaluationRatingsSumOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "evaluation_ratings" */
export type EvaluationRatingsVarPopOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "evaluation_ratings" */
export type EvaluationRatingsVarSampOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "evaluation_ratings" */
export type EvaluationRatingsVarianceOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** columns and relationships of "evaluation_statistics" */
export type EvaluationStatistics = {
  __typename?: 'evaluation_statistics';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['float8']['output']>;
  /** An object relationship */
  course: Courses;
  /** The course associated with these statistics */
  course_id: Scalars['Int']['output'];
  /** Number of students enrolled in course */
  enrolled: Scalars['Int']['output'];
  /** Arbitrary additional information attached to an evaluation */
  extras: Maybe<Scalars['jsonb']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Int']['output']>;
};

/** columns and relationships of "evaluation_statistics" */
export type EvaluationStatisticsExtrasArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to filter rows from the table "evaluation_statistics". All fields are combined with a logical 'AND'. */
export type EvaluationStatisticsBoolExp = {
  _and: InputMaybe<Array<EvaluationStatisticsBoolExp>>;
  _not: InputMaybe<EvaluationStatisticsBoolExp>;
  _or: InputMaybe<Array<EvaluationStatisticsBoolExp>>;
  avg_rating: InputMaybe<Float8ComparisonExp>;
  avg_workload: InputMaybe<Float8ComparisonExp>;
  course: InputMaybe<CoursesBoolExp>;
  course_id: InputMaybe<IntComparisonExp>;
  enrolled: InputMaybe<IntComparisonExp>;
  extras: InputMaybe<JsonbComparisonExp>;
  responses: InputMaybe<IntComparisonExp>;
};

/** Ordering options when selecting data from "evaluation_statistics". */
export type EvaluationStatisticsOrderBy = {
  avg_rating: InputMaybe<OrderBy>;
  avg_workload: InputMaybe<OrderBy>;
  course: InputMaybe<CoursesOrderBy>;
  course_id: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  extras: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
};

/** select columns of table "evaluation_statistics" */
export enum EvaluationStatisticsSelectColumn {
  /** column name */
  AvgRating = 'avg_rating',
  /** column name */
  AvgWorkload = 'avg_workload',
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Enrolled = 'enrolled',
  /** column name */
  Extras = 'extras',
  /** column name */
  Responses = 'responses',
}

/** Streaming cursor of the table "evaluation_statistics" */
export type EvaluationStatisticsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: EvaluationStatisticsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type EvaluationStatisticsStreamCursorValueInput = {
  /** [computed] Average overall rating */
  avg_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average workload rating */
  avg_workload: InputMaybe<Scalars['float8']['input']>;
  /** The course associated with these statistics */
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** Number of students enrolled in course */
  enrolled: InputMaybe<Scalars['Int']['input']>;
  /** Arbitrary additional information attached to an evaluation */
  extras: InputMaybe<Scalars['jsonb']['input']>;
  /** Number of responses */
  responses: InputMaybe<Scalars['Int']['input']>;
};

/** columns and relationships of "flags" */
export type Flags = {
  __typename?: 'flags';
  /** An array relationship */
  course_flags: Array<CourseFlags>;
  /** Flag ID */
  flag_id: Scalars['Int']['output'];
  /** Flag text */
  flag_text: Scalars['String']['output'];
  last_updated: Maybe<Scalars['timestamp']['output']>;
  time_added: Maybe<Scalars['timestamp']['output']>;
};

/** columns and relationships of "flags" */
export type FlagsCourseFlagsArgs = {
  distinct_on: InputMaybe<Array<CourseFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseFlagsOrderBy>>;
  where: InputMaybe<CourseFlagsBoolExp>;
};

/** Boolean expression to filter rows from the table "flags". All fields are combined with a logical 'AND'. */
export type FlagsBoolExp = {
  _and: InputMaybe<Array<FlagsBoolExp>>;
  _not: InputMaybe<FlagsBoolExp>;
  _or: InputMaybe<Array<FlagsBoolExp>>;
  course_flags: InputMaybe<CourseFlagsBoolExp>;
  flag_id: InputMaybe<IntComparisonExp>;
  flag_text: InputMaybe<StringComparisonExp>;
  last_updated: InputMaybe<TimestampComparisonExp>;
  time_added: InputMaybe<TimestampComparisonExp>;
};

/** Ordering options when selecting data from "flags". */
export type FlagsOrderBy = {
  course_flags_aggregate: InputMaybe<CourseFlagsAggregateOrderBy>;
  flag_id: InputMaybe<OrderBy>;
  flag_text: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
};

/** select columns of table "flags" */
export enum FlagsSelectColumn {
  /** column name */
  FlagId = 'flag_id',
  /** column name */
  FlagText = 'flag_text',
  /** column name */
  LastUpdated = 'last_updated',
  /** column name */
  TimeAdded = 'time_added',
}

/** Streaming cursor of the table "flags" */
export type FlagsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: FlagsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type FlagsStreamCursorValueInput = {
  /** Flag ID */
  flag_id: InputMaybe<Scalars['Int']['input']>;
  /** Flag text */
  flag_text: InputMaybe<Scalars['String']['input']>;
  last_updated: InputMaybe<Scalars['timestamp']['input']>;
  time_added: InputMaybe<Scalars['timestamp']['input']>;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8ComparisonExp = {
  _eq: InputMaybe<Scalars['float8']['input']>;
  _gt: InputMaybe<Scalars['float8']['input']>;
  _gte: InputMaybe<Scalars['float8']['input']>;
  _in: InputMaybe<Array<Scalars['float8']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['float8']['input']>;
  _lte: InputMaybe<Scalars['float8']['input']>;
  _neq: InputMaybe<Scalars['float8']['input']>;
  _nin: InputMaybe<Array<Scalars['float8']['input']>>;
};

export type JsonbCastExp = {
  String: InputMaybe<StringComparisonExp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
  _cast: InputMaybe<JsonbCastExp>;
  /** is the column contained in the given json value */
  _contained_in: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains: InputMaybe<Scalars['jsonb']['input']>;
  _eq: InputMaybe<Scalars['jsonb']['input']>;
  _gt: InputMaybe<Scalars['jsonb']['input']>;
  _gte: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any: InputMaybe<Array<Scalars['String']['input']>>;
  _in: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['jsonb']['input']>;
  _lte: InputMaybe<Scalars['jsonb']['input']>;
  _neq: InputMaybe<Scalars['jsonb']['input']>;
  _nin: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** columns and relationships of "listings" */
export type Listings = {
  __typename?: 'listings';
  /** An object relationship */
  course: Courses;
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: Scalars['String']['output'];
  /** Course that the listing refers to */
  course_id: Scalars['Int']['output'];
  /** The CRN associated with this listing */
  crn: Scalars['Crn']['output'];
  last_updated: Maybe<Scalars['timestamp']['output']>;
  /** Listing ID */
  listing_id: Scalars['Int']['output'];
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: Scalars['String']['output'];
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: Scalars['String']['output'];
  /** An object relationship */
  season: Seasons;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: Scalars['Season']['output'];
  /** Course section. Note that the section number is the same for all cross-listings. */
  section: Scalars['String']['output'];
  /** Subject the course is listed under (e.g. "AMST") */
  subject: Scalars['String']['output'];
  time_added: Maybe<Scalars['timestamp']['output']>;
};

/** order by aggregate values of table "listings" */
export type ListingsAggregateOrderBy = {
  avg: InputMaybe<ListingsAvgOrderBy>;
  count: InputMaybe<OrderBy>;
  max: InputMaybe<ListingsMaxOrderBy>;
  min: InputMaybe<ListingsMinOrderBy>;
  stddev: InputMaybe<ListingsStddevOrderBy>;
  stddev_pop: InputMaybe<ListingsStddevPopOrderBy>;
  stddev_samp: InputMaybe<ListingsStddevSampOrderBy>;
  sum: InputMaybe<ListingsSumOrderBy>;
  var_pop: InputMaybe<ListingsVarPopOrderBy>;
  var_samp: InputMaybe<ListingsVarSampOrderBy>;
  variance: InputMaybe<ListingsVarianceOrderBy>;
};

/** order by avg() on columns of table "listings" */
export type ListingsAvgOrderBy = {
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "listings". All fields are combined with a logical 'AND'. */
export type ListingsBoolExp = {
  _and: InputMaybe<Array<ListingsBoolExp>>;
  _not: InputMaybe<ListingsBoolExp>;
  _or: InputMaybe<Array<ListingsBoolExp>>;
  course: InputMaybe<CoursesBoolExp>;
  course_code: InputMaybe<StringComparisonExp>;
  course_id: InputMaybe<IntComparisonExp>;
  crn: InputMaybe<IntComparisonExp>;
  last_updated: InputMaybe<TimestampComparisonExp>;
  listing_id: InputMaybe<IntComparisonExp>;
  number: InputMaybe<StringComparisonExp>;
  school: InputMaybe<StringComparisonExp>;
  season: InputMaybe<SeasonsBoolExp>;
  season_code: InputMaybe<StringComparisonExp>;
  section: InputMaybe<StringComparisonExp>;
  subject: InputMaybe<StringComparisonExp>;
  time_added: InputMaybe<TimestampComparisonExp>;
};

/** order by max() on columns of table "listings" */
export type ListingsMaxOrderBy = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: InputMaybe<OrderBy>;
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: InputMaybe<OrderBy>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: InputMaybe<OrderBy>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<OrderBy>;
  /** Course section. Note that the section number is the same for all cross-listings. */
  section: InputMaybe<OrderBy>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "listings" */
export type ListingsMinOrderBy = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: InputMaybe<OrderBy>;
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: InputMaybe<OrderBy>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: InputMaybe<OrderBy>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<OrderBy>;
  /** Course section. Note that the section number is the same for all cross-listings. */
  section: InputMaybe<OrderBy>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "listings". */
export type ListingsOrderBy = {
  course: InputMaybe<CoursesOrderBy>;
  course_code: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  number: InputMaybe<OrderBy>;
  school: InputMaybe<OrderBy>;
  season: InputMaybe<SeasonsOrderBy>;
  season_code: InputMaybe<OrderBy>;
  section: InputMaybe<OrderBy>;
  subject: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
};

/** select columns of table "listings" */
export enum ListingsSelectColumn {
  /** column name */
  CourseCode = 'course_code',
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Crn = 'crn',
  /** column name */
  LastUpdated = 'last_updated',
  /** column name */
  ListingId = 'listing_id',
  /** column name */
  Number = 'number',
  /** column name */
  School = 'school',
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Section = 'section',
  /** column name */
  Subject = 'subject',
  /** column name */
  TimeAdded = 'time_added',
}

/** order by stddev() on columns of table "listings" */
export type ListingsStddevOrderBy = {
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "listings" */
export type ListingsStddevPopOrderBy = {
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "listings" */
export type ListingsStddevSampOrderBy = {
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "listings" */
export type ListingsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ListingsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ListingsStreamCursorValueInput = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: InputMaybe<Scalars['String']['input']>;
  /** Course that the listing refers to */
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Scalars['Int']['input']>;
  last_updated: InputMaybe<Scalars['timestamp']['input']>;
  /** Listing ID */
  listing_id: InputMaybe<Scalars['Int']['input']>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: InputMaybe<Scalars['String']['input']>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: InputMaybe<Scalars['String']['input']>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<Scalars['String']['input']>;
  /** Course section. Note that the section number is the same for all cross-listings. */
  section: InputMaybe<Scalars['String']['input']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<Scalars['String']['input']>;
  time_added: InputMaybe<Scalars['timestamp']['input']>;
};

/** order by sum() on columns of table "listings" */
export type ListingsSumOrderBy = {
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "listings" */
export type ListingsVarPopOrderBy = {
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "listings" */
export type ListingsVarSampOrderBy = {
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "listings" */
export type ListingsVarianceOrderBy = {
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
};

/** columns and relationships of "locations" */
export type Locations = {
  __typename?: 'locations';
  /** An object relationship */
  building: Buildings;
  /** Building code */
  building_code: Scalars['String']['output'];
  /** An array relationship */
  course_meetings: Array<CourseMeetings>;
  last_updated: Maybe<Scalars['timestamp']['output']>;
  location_id: Scalars['Int']['output'];
  /** Room number */
  room: Maybe<Scalars['String']['output']>;
  time_added: Maybe<Scalars['timestamp']['output']>;
};

/** columns and relationships of "locations" */
export type LocationsCourseMeetingsArgs = {
  distinct_on: InputMaybe<Array<CourseMeetingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseMeetingsOrderBy>>;
  where: InputMaybe<CourseMeetingsBoolExp>;
};

/** order by aggregate values of table "locations" */
export type LocationsAggregateOrderBy = {
  avg: InputMaybe<LocationsAvgOrderBy>;
  count: InputMaybe<OrderBy>;
  max: InputMaybe<LocationsMaxOrderBy>;
  min: InputMaybe<LocationsMinOrderBy>;
  stddev: InputMaybe<LocationsStddevOrderBy>;
  stddev_pop: InputMaybe<LocationsStddevPopOrderBy>;
  stddev_samp: InputMaybe<LocationsStddevSampOrderBy>;
  sum: InputMaybe<LocationsSumOrderBy>;
  var_pop: InputMaybe<LocationsVarPopOrderBy>;
  var_samp: InputMaybe<LocationsVarSampOrderBy>;
  variance: InputMaybe<LocationsVarianceOrderBy>;
};

/** order by avg() on columns of table "locations" */
export type LocationsAvgOrderBy = {
  location_id: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "locations". All fields are combined with a logical 'AND'. */
export type LocationsBoolExp = {
  _and: InputMaybe<Array<LocationsBoolExp>>;
  _not: InputMaybe<LocationsBoolExp>;
  _or: InputMaybe<Array<LocationsBoolExp>>;
  building: InputMaybe<BuildingsBoolExp>;
  building_code: InputMaybe<StringComparisonExp>;
  course_meetings: InputMaybe<CourseMeetingsBoolExp>;
  last_updated: InputMaybe<TimestampComparisonExp>;
  location_id: InputMaybe<IntComparisonExp>;
  room: InputMaybe<StringComparisonExp>;
  time_added: InputMaybe<TimestampComparisonExp>;
};

/** order by max() on columns of table "locations" */
export type LocationsMaxOrderBy = {
  /** Building code */
  building_code: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  location_id: InputMaybe<OrderBy>;
  /** Room number */
  room: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
};

/** order by min() on columns of table "locations" */
export type LocationsMinOrderBy = {
  /** Building code */
  building_code: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  location_id: InputMaybe<OrderBy>;
  /** Room number */
  room: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "locations". */
export type LocationsOrderBy = {
  building: InputMaybe<BuildingsOrderBy>;
  building_code: InputMaybe<OrderBy>;
  course_meetings_aggregate: InputMaybe<CourseMeetingsAggregateOrderBy>;
  last_updated: InputMaybe<OrderBy>;
  location_id: InputMaybe<OrderBy>;
  room: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
};

/** select columns of table "locations" */
export enum LocationsSelectColumn {
  /** column name */
  BuildingCode = 'building_code',
  /** column name */
  LastUpdated = 'last_updated',
  /** column name */
  LocationId = 'location_id',
  /** column name */
  Room = 'room',
  /** column name */
  TimeAdded = 'time_added',
}

/** order by stddev() on columns of table "locations" */
export type LocationsStddevOrderBy = {
  location_id: InputMaybe<OrderBy>;
};

/** order by stddev_pop() on columns of table "locations" */
export type LocationsStddevPopOrderBy = {
  location_id: InputMaybe<OrderBy>;
};

/** order by stddev_samp() on columns of table "locations" */
export type LocationsStddevSampOrderBy = {
  location_id: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "locations" */
export type LocationsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: LocationsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type LocationsStreamCursorValueInput = {
  /** Building code */
  building_code: InputMaybe<Scalars['String']['input']>;
  last_updated: InputMaybe<Scalars['timestamp']['input']>;
  location_id: InputMaybe<Scalars['Int']['input']>;
  /** Room number */
  room: InputMaybe<Scalars['String']['input']>;
  time_added: InputMaybe<Scalars['timestamp']['input']>;
};

/** order by sum() on columns of table "locations" */
export type LocationsSumOrderBy = {
  location_id: InputMaybe<OrderBy>;
};

/** order by var_pop() on columns of table "locations" */
export type LocationsVarPopOrderBy = {
  location_id: InputMaybe<OrderBy>;
};

/** order by var_samp() on columns of table "locations" */
export type LocationsVarSampOrderBy = {
  location_id: InputMaybe<OrderBy>;
};

/** order by variance() on columns of table "locations" */
export type LocationsVarianceOrderBy = {
  location_id: InputMaybe<OrderBy>;
};

/** columns and relationships of "metadata" */
export type Metadata = {
  __typename?: 'metadata';
  id: Scalars['Int']['output'];
  last_update: Maybe<Scalars['timestamp']['output']>;
};

/** Boolean expression to filter rows from the table "metadata". All fields are combined with a logical 'AND'. */
export type MetadataBoolExp = {
  _and: InputMaybe<Array<MetadataBoolExp>>;
  _not: InputMaybe<MetadataBoolExp>;
  _or: InputMaybe<Array<MetadataBoolExp>>;
  id: InputMaybe<IntComparisonExp>;
  last_update: InputMaybe<TimestampComparisonExp>;
};

/** Ordering options when selecting data from "metadata". */
export type MetadataOrderBy = {
  id: InputMaybe<OrderBy>;
  last_update: InputMaybe<OrderBy>;
};

/** select columns of table "metadata" */
export enum MetadataSelectColumn {
  /** column name */
  Id = 'id',
  /** column name */
  LastUpdate = 'last_update',
}

/** Streaming cursor of the table "metadata" */
export type MetadataStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: MetadataStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type MetadataStreamCursorValueInput = {
  id: InputMaybe<Scalars['Int']['input']>;
  last_update: InputMaybe<Scalars['timestamp']['input']>;
};

/** column ordering options */
export enum OrderBy {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

/** columns and relationships of "professors" */
export type Professors = {
  __typename?: 'professors';
  /** [computed] Average rating of the professor assessed via the "Overall assessment" question in courses taught */
  average_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Scalars['Int']['output'];
  /** An array relationship */
  course_professors: Array<CourseProfessors>;
  /** [computed] Number of courses taught */
  courses_taught: Scalars['Int']['output'];
  /** Email address of the professor */
  email: Maybe<Scalars['String']['output']>;
  last_updated: Maybe<Scalars['timestamp']['output']>;
  /** Name of the professor */
  name: Scalars['String']['output'];
  /** Professor ID */
  professor_id: Scalars['Int']['output'];
  time_added: Maybe<Scalars['timestamp']['output']>;
};

/** columns and relationships of "professors" */
export type ProfessorsCourseProfessorsArgs = {
  distinct_on: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseProfessorsOrderBy>>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

/** Boolean expression to filter rows from the table "professors". All fields are combined with a logical 'AND'. */
export type ProfessorsBoolExp = {
  _and: InputMaybe<Array<ProfessorsBoolExp>>;
  _not: InputMaybe<ProfessorsBoolExp>;
  _or: InputMaybe<Array<ProfessorsBoolExp>>;
  average_rating: InputMaybe<Float8ComparisonExp>;
  average_rating_n: InputMaybe<IntComparisonExp>;
  course_professors: InputMaybe<CourseProfessorsBoolExp>;
  courses_taught: InputMaybe<IntComparisonExp>;
  email: InputMaybe<StringComparisonExp>;
  last_updated: InputMaybe<TimestampComparisonExp>;
  name: InputMaybe<StringComparisonExp>;
  professor_id: InputMaybe<IntComparisonExp>;
  time_added: InputMaybe<TimestampComparisonExp>;
};

/** Ordering options when selecting data from "professors". */
export type ProfessorsOrderBy = {
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  course_professors_aggregate: InputMaybe<CourseProfessorsAggregateOrderBy>;
  courses_taught: InputMaybe<OrderBy>;
  email: InputMaybe<OrderBy>;
  last_updated: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
};

/** select columns of table "professors" */
export enum ProfessorsSelectColumn {
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingN = 'average_rating_n',
  /** column name */
  CoursesTaught = 'courses_taught',
  /** column name */
  Email = 'email',
  /** column name */
  LastUpdated = 'last_updated',
  /** column name */
  Name = 'name',
  /** column name */
  ProfessorId = 'professor_id',
  /** column name */
  TimeAdded = 'time_added',
}

/** Streaming cursor of the table "professors" */
export type ProfessorsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ProfessorsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ProfessorsStreamCursorValueInput = {
  /** [computed] Average rating of the professor assessed via the "Overall assessment" question in courses taught */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  /** [computed] Number of courses taught */
  courses_taught: InputMaybe<Scalars['Int']['input']>;
  /** Email address of the professor */
  email: InputMaybe<Scalars['String']['input']>;
  last_updated: InputMaybe<Scalars['timestamp']['input']>;
  /** Name of the professor */
  name: InputMaybe<Scalars['String']['input']>;
  /** Professor ID */
  professor_id: InputMaybe<Scalars['Int']['input']>;
  time_added: InputMaybe<Scalars['timestamp']['input']>;
};

export type QueryRoot = {
  __typename?: 'query_root';
  /** fetch data from the table: "buildings" */
  buildings: Array<Buildings>;
  /** fetch data from the table: "buildings" using primary key columns */
  buildings_by_pk: Maybe<Buildings>;
  /** An array relationship */
  course_flags: Array<CourseFlags>;
  /** fetch data from the table: "course_flags" using primary key columns */
  course_flags_by_pk: Maybe<CourseFlags>;
  /** An array relationship */
  course_meetings: Array<CourseMeetings>;
  /** An array relationship */
  course_professors: Array<CourseProfessors>;
  /** fetch data from the table: "course_professors" using primary key columns */
  course_professors_by_pk: Maybe<CourseProfessors>;
  /** An array relationship */
  courses: Array<Courses>;
  /** fetch data from the table: "courses" using primary key columns */
  courses_by_pk: Maybe<Courses>;
  /** An array relationship */
  evaluation_narratives: Array<EvaluationNarratives>;
  /** fetch data from the table: "evaluation_narratives" using primary key columns */
  evaluation_narratives_by_pk: Maybe<EvaluationNarratives>;
  /** fetch data from the table: "evaluation_questions" */
  evaluation_questions: Array<EvaluationQuestions>;
  /** fetch data from the table: "evaluation_questions" using primary key columns */
  evaluation_questions_by_pk: Maybe<EvaluationQuestions>;
  /** An array relationship */
  evaluation_ratings: Array<EvaluationRatings>;
  /** fetch data from the table: "evaluation_ratings" using primary key columns */
  evaluation_ratings_by_pk: Maybe<EvaluationRatings>;
  /** fetch data from the table: "evaluation_statistics" */
  evaluation_statistics: Array<EvaluationStatistics>;
  /** fetch data from the table: "evaluation_statistics" using primary key columns */
  evaluation_statistics_by_pk: Maybe<EvaluationStatistics>;
  /** fetch data from the table: "flags" */
  flags: Array<Flags>;
  /** fetch data from the table: "flags" using primary key columns */
  flags_by_pk: Maybe<Flags>;
  /** An array relationship */
  listings: Array<Listings>;
  /** fetch data from the table: "listings" using primary key columns */
  listings_by_pk: Maybe<Listings>;
  /** An array relationship */
  locations: Array<Locations>;
  /** fetch data from the table: "locations" using primary key columns */
  locations_by_pk: Maybe<Locations>;
  /** fetch data from the table: "metadata" */
  metadata: Array<Metadata>;
  /** fetch data from the table: "metadata" using primary key columns */
  metadata_by_pk: Maybe<Metadata>;
  /** fetch data from the table: "professors" */
  professors: Array<Professors>;
  /** fetch data from the table: "professors" using primary key columns */
  professors_by_pk: Maybe<Professors>;
  /** fetch data from the table: "seasons" */
  seasons: Array<Seasons>;
  /** fetch data from the table: "seasons" using primary key columns */
  seasons_by_pk: Maybe<Seasons>;
};

export type QueryRootBuildingsArgs = {
  distinct_on: InputMaybe<Array<BuildingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<BuildingsOrderBy>>;
  where: InputMaybe<BuildingsBoolExp>;
};

export type QueryRootBuildingsByPkArgs = {
  code: Scalars['String']['input'];
};

export type QueryRootCourseFlagsArgs = {
  distinct_on: InputMaybe<Array<CourseFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseFlagsOrderBy>>;
  where: InputMaybe<CourseFlagsBoolExp>;
};

export type QueryRootCourseFlagsByPkArgs = {
  course_id: Scalars['Int']['input'];
  flag_id: Scalars['Int']['input'];
};

export type QueryRootCourseMeetingsArgs = {
  distinct_on: InputMaybe<Array<CourseMeetingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseMeetingsOrderBy>>;
  where: InputMaybe<CourseMeetingsBoolExp>;
};

export type QueryRootCourseProfessorsArgs = {
  distinct_on: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseProfessorsOrderBy>>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

export type QueryRootCourseProfessorsByPkArgs = {
  course_id: Scalars['Int']['input'];
  professor_id: Scalars['Int']['input'];
};

export type QueryRootCoursesArgs = {
  distinct_on: InputMaybe<Array<CoursesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CoursesOrderBy>>;
  where: InputMaybe<CoursesBoolExp>;
};

export type QueryRootCoursesByPkArgs = {
  course_id: Scalars['Int']['input'];
};

export type QueryRootEvaluationNarrativesArgs = {
  distinct_on: InputMaybe<Array<EvaluationNarrativesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationNarrativesOrderBy>>;
  where: InputMaybe<EvaluationNarrativesBoolExp>;
};

export type QueryRootEvaluationNarrativesByPkArgs = {
  id: Scalars['Int']['input'];
};

export type QueryRootEvaluationQuestionsArgs = {
  distinct_on: InputMaybe<Array<EvaluationQuestionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationQuestionsOrderBy>>;
  where: InputMaybe<EvaluationQuestionsBoolExp>;
};

export type QueryRootEvaluationQuestionsByPkArgs = {
  question_code: Scalars['String']['input'];
};

export type QueryRootEvaluationRatingsArgs = {
  distinct_on: InputMaybe<Array<EvaluationRatingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationRatingsOrderBy>>;
  where: InputMaybe<EvaluationRatingsBoolExp>;
};

export type QueryRootEvaluationRatingsByPkArgs = {
  id: Scalars['Int']['input'];
};

export type QueryRootEvaluationStatisticsArgs = {
  distinct_on: InputMaybe<Array<EvaluationStatisticsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationStatisticsOrderBy>>;
  where: InputMaybe<EvaluationStatisticsBoolExp>;
};

export type QueryRootEvaluationStatisticsByPkArgs = {
  course_id: Scalars['Int']['input'];
};

export type QueryRootFlagsArgs = {
  distinct_on: InputMaybe<Array<FlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<FlagsOrderBy>>;
  where: InputMaybe<FlagsBoolExp>;
};

export type QueryRootFlagsByPkArgs = {
  flag_id: Scalars['Int']['input'];
};

export type QueryRootListingsArgs = {
  distinct_on: InputMaybe<Array<ListingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ListingsOrderBy>>;
  where: InputMaybe<ListingsBoolExp>;
};

export type QueryRootListingsByPkArgs = {
  listing_id: Scalars['Int']['input'];
};

export type QueryRootLocationsArgs = {
  distinct_on: InputMaybe<Array<LocationsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<LocationsOrderBy>>;
  where: InputMaybe<LocationsBoolExp>;
};

export type QueryRootLocationsByPkArgs = {
  location_id: Scalars['Int']['input'];
};

export type QueryRootMetadataArgs = {
  distinct_on: InputMaybe<Array<MetadataSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<MetadataOrderBy>>;
  where: InputMaybe<MetadataBoolExp>;
};

export type QueryRootMetadataByPkArgs = {
  id: Scalars['Int']['input'];
};

export type QueryRootProfessorsArgs = {
  distinct_on: InputMaybe<Array<ProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ProfessorsOrderBy>>;
  where: InputMaybe<ProfessorsBoolExp>;
};

export type QueryRootProfessorsByPkArgs = {
  professor_id: Scalars['Int']['input'];
};

export type QueryRootSeasonsArgs = {
  distinct_on: InputMaybe<Array<SeasonsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<SeasonsOrderBy>>;
  where: InputMaybe<SeasonsBoolExp>;
};

export type QueryRootSeasonsByPkArgs = {
  season_code: Scalars['String']['input'];
};

/** columns and relationships of "seasons" */
export type Seasons = {
  __typename?: 'seasons';
  /** An array relationship */
  courses: Array<Courses>;
  last_updated: Maybe<Scalars['timestamp']['output']>;
  /** An array relationship */
  listings: Array<Listings>;
  /** Season code (e.g. '202001') */
  season_code: Scalars['String']['output'];
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: Scalars['String']['output'];
  time_added: Maybe<Scalars['timestamp']['output']>;
  /** [computed] Year of the semester */
  year: Scalars['Int']['output'];
};

/** columns and relationships of "seasons" */
export type SeasonsCoursesArgs = {
  distinct_on: InputMaybe<Array<CoursesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CoursesOrderBy>>;
  where: InputMaybe<CoursesBoolExp>;
};

/** columns and relationships of "seasons" */
export type SeasonsListingsArgs = {
  distinct_on: InputMaybe<Array<ListingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ListingsOrderBy>>;
  where: InputMaybe<ListingsBoolExp>;
};

/** Boolean expression to filter rows from the table "seasons". All fields are combined with a logical 'AND'. */
export type SeasonsBoolExp = {
  _and: InputMaybe<Array<SeasonsBoolExp>>;
  _not: InputMaybe<SeasonsBoolExp>;
  _or: InputMaybe<Array<SeasonsBoolExp>>;
  courses: InputMaybe<CoursesBoolExp>;
  last_updated: InputMaybe<TimestampComparisonExp>;
  listings: InputMaybe<ListingsBoolExp>;
  season_code: InputMaybe<StringComparisonExp>;
  term: InputMaybe<StringComparisonExp>;
  time_added: InputMaybe<TimestampComparisonExp>;
  year: InputMaybe<IntComparisonExp>;
};

/** Ordering options when selecting data from "seasons". */
export type SeasonsOrderBy = {
  courses_aggregate: InputMaybe<CoursesAggregateOrderBy>;
  last_updated: InputMaybe<OrderBy>;
  listings_aggregate: InputMaybe<ListingsAggregateOrderBy>;
  season_code: InputMaybe<OrderBy>;
  term: InputMaybe<OrderBy>;
  time_added: InputMaybe<OrderBy>;
  year: InputMaybe<OrderBy>;
};

/** select columns of table "seasons" */
export enum SeasonsSelectColumn {
  /** column name */
  LastUpdated = 'last_updated',
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Term = 'term',
  /** column name */
  TimeAdded = 'time_added',
  /** column name */
  Year = 'year',
}

/** Streaming cursor of the table "seasons" */
export type SeasonsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: SeasonsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SeasonsStreamCursorValueInput = {
  last_updated: InputMaybe<Scalars['timestamp']['input']>;
  /** Season code (e.g. '202001') */
  season_code: InputMaybe<Scalars['String']['input']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: InputMaybe<Scalars['String']['input']>;
  time_added: InputMaybe<Scalars['timestamp']['input']>;
  /** [computed] Year of the semester */
  year: InputMaybe<Scalars['Int']['input']>;
};

export type SubscriptionRoot = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "buildings" */
  buildings: Array<Buildings>;
  /** fetch data from the table: "buildings" using primary key columns */
  buildings_by_pk: Maybe<Buildings>;
  /** fetch data from the table in a streaming manner: "buildings" */
  buildings_stream: Array<Buildings>;
  /** An array relationship */
  course_flags: Array<CourseFlags>;
  /** fetch data from the table: "course_flags" using primary key columns */
  course_flags_by_pk: Maybe<CourseFlags>;
  /** fetch data from the table in a streaming manner: "course_flags" */
  course_flags_stream: Array<CourseFlags>;
  /** An array relationship */
  course_meetings: Array<CourseMeetings>;
  /** fetch data from the table in a streaming manner: "course_meetings" */
  course_meetings_stream: Array<CourseMeetings>;
  /** An array relationship */
  course_professors: Array<CourseProfessors>;
  /** fetch data from the table: "course_professors" using primary key columns */
  course_professors_by_pk: Maybe<CourseProfessors>;
  /** fetch data from the table in a streaming manner: "course_professors" */
  course_professors_stream: Array<CourseProfessors>;
  /** An array relationship */
  courses: Array<Courses>;
  /** fetch data from the table: "courses" using primary key columns */
  courses_by_pk: Maybe<Courses>;
  /** fetch data from the table in a streaming manner: "courses" */
  courses_stream: Array<Courses>;
  /** An array relationship */
  evaluation_narratives: Array<EvaluationNarratives>;
  /** fetch data from the table: "evaluation_narratives" using primary key columns */
  evaluation_narratives_by_pk: Maybe<EvaluationNarratives>;
  /** fetch data from the table in a streaming manner: "evaluation_narratives" */
  evaluation_narratives_stream: Array<EvaluationNarratives>;
  /** fetch data from the table: "evaluation_questions" */
  evaluation_questions: Array<EvaluationQuestions>;
  /** fetch data from the table: "evaluation_questions" using primary key columns */
  evaluation_questions_by_pk: Maybe<EvaluationQuestions>;
  /** fetch data from the table in a streaming manner: "evaluation_questions" */
  evaluation_questions_stream: Array<EvaluationQuestions>;
  /** An array relationship */
  evaluation_ratings: Array<EvaluationRatings>;
  /** fetch data from the table: "evaluation_ratings" using primary key columns */
  evaluation_ratings_by_pk: Maybe<EvaluationRatings>;
  /** fetch data from the table in a streaming manner: "evaluation_ratings" */
  evaluation_ratings_stream: Array<EvaluationRatings>;
  /** fetch data from the table: "evaluation_statistics" */
  evaluation_statistics: Array<EvaluationStatistics>;
  /** fetch data from the table: "evaluation_statistics" using primary key columns */
  evaluation_statistics_by_pk: Maybe<EvaluationStatistics>;
  /** fetch data from the table in a streaming manner: "evaluation_statistics" */
  evaluation_statistics_stream: Array<EvaluationStatistics>;
  /** fetch data from the table: "flags" */
  flags: Array<Flags>;
  /** fetch data from the table: "flags" using primary key columns */
  flags_by_pk: Maybe<Flags>;
  /** fetch data from the table in a streaming manner: "flags" */
  flags_stream: Array<Flags>;
  /** An array relationship */
  listings: Array<Listings>;
  /** fetch data from the table: "listings" using primary key columns */
  listings_by_pk: Maybe<Listings>;
  /** fetch data from the table in a streaming manner: "listings" */
  listings_stream: Array<Listings>;
  /** An array relationship */
  locations: Array<Locations>;
  /** fetch data from the table: "locations" using primary key columns */
  locations_by_pk: Maybe<Locations>;
  /** fetch data from the table in a streaming manner: "locations" */
  locations_stream: Array<Locations>;
  /** fetch data from the table: "metadata" */
  metadata: Array<Metadata>;
  /** fetch data from the table: "metadata" using primary key columns */
  metadata_by_pk: Maybe<Metadata>;
  /** fetch data from the table in a streaming manner: "metadata" */
  metadata_stream: Array<Metadata>;
  /** fetch data from the table: "professors" */
  professors: Array<Professors>;
  /** fetch data from the table: "professors" using primary key columns */
  professors_by_pk: Maybe<Professors>;
  /** fetch data from the table in a streaming manner: "professors" */
  professors_stream: Array<Professors>;
  /** fetch data from the table: "seasons" */
  seasons: Array<Seasons>;
  /** fetch data from the table: "seasons" using primary key columns */
  seasons_by_pk: Maybe<Seasons>;
  /** fetch data from the table in a streaming manner: "seasons" */
  seasons_stream: Array<Seasons>;
};

export type SubscriptionRootBuildingsArgs = {
  distinct_on: InputMaybe<Array<BuildingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<BuildingsOrderBy>>;
  where: InputMaybe<BuildingsBoolExp>;
};

export type SubscriptionRootBuildingsByPkArgs = {
  code: Scalars['String']['input'];
};

export type SubscriptionRootBuildingsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BuildingsStreamCursorInput>>;
  where: InputMaybe<BuildingsBoolExp>;
};

export type SubscriptionRootCourseFlagsArgs = {
  distinct_on: InputMaybe<Array<CourseFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseFlagsOrderBy>>;
  where: InputMaybe<CourseFlagsBoolExp>;
};

export type SubscriptionRootCourseFlagsByPkArgs = {
  course_id: Scalars['Int']['input'];
  flag_id: Scalars['Int']['input'];
};

export type SubscriptionRootCourseFlagsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<CourseFlagsStreamCursorInput>>;
  where: InputMaybe<CourseFlagsBoolExp>;
};

export type SubscriptionRootCourseMeetingsArgs = {
  distinct_on: InputMaybe<Array<CourseMeetingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseMeetingsOrderBy>>;
  where: InputMaybe<CourseMeetingsBoolExp>;
};

export type SubscriptionRootCourseMeetingsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<CourseMeetingsStreamCursorInput>>;
  where: InputMaybe<CourseMeetingsBoolExp>;
};

export type SubscriptionRootCourseProfessorsArgs = {
  distinct_on: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseProfessorsOrderBy>>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

export type SubscriptionRootCourseProfessorsByPkArgs = {
  course_id: Scalars['Int']['input'];
  professor_id: Scalars['Int']['input'];
};

export type SubscriptionRootCourseProfessorsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<CourseProfessorsStreamCursorInput>>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

export type SubscriptionRootCoursesArgs = {
  distinct_on: InputMaybe<Array<CoursesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CoursesOrderBy>>;
  where: InputMaybe<CoursesBoolExp>;
};

export type SubscriptionRootCoursesByPkArgs = {
  course_id: Scalars['Int']['input'];
};

export type SubscriptionRootCoursesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<CoursesStreamCursorInput>>;
  where: InputMaybe<CoursesBoolExp>;
};

export type SubscriptionRootEvaluationNarrativesArgs = {
  distinct_on: InputMaybe<Array<EvaluationNarrativesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationNarrativesOrderBy>>;
  where: InputMaybe<EvaluationNarrativesBoolExp>;
};

export type SubscriptionRootEvaluationNarrativesByPkArgs = {
  id: Scalars['Int']['input'];
};

export type SubscriptionRootEvaluationNarrativesStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<EvaluationNarrativesStreamCursorInput>>;
  where: InputMaybe<EvaluationNarrativesBoolExp>;
};

export type SubscriptionRootEvaluationQuestionsArgs = {
  distinct_on: InputMaybe<Array<EvaluationQuestionsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationQuestionsOrderBy>>;
  where: InputMaybe<EvaluationQuestionsBoolExp>;
};

export type SubscriptionRootEvaluationQuestionsByPkArgs = {
  question_code: Scalars['String']['input'];
};

export type SubscriptionRootEvaluationQuestionsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<EvaluationQuestionsStreamCursorInput>>;
  where: InputMaybe<EvaluationQuestionsBoolExp>;
};

export type SubscriptionRootEvaluationRatingsArgs = {
  distinct_on: InputMaybe<Array<EvaluationRatingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationRatingsOrderBy>>;
  where: InputMaybe<EvaluationRatingsBoolExp>;
};

export type SubscriptionRootEvaluationRatingsByPkArgs = {
  id: Scalars['Int']['input'];
};

export type SubscriptionRootEvaluationRatingsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<EvaluationRatingsStreamCursorInput>>;
  where: InputMaybe<EvaluationRatingsBoolExp>;
};

export type SubscriptionRootEvaluationStatisticsArgs = {
  distinct_on: InputMaybe<Array<EvaluationStatisticsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<EvaluationStatisticsOrderBy>>;
  where: InputMaybe<EvaluationStatisticsBoolExp>;
};

export type SubscriptionRootEvaluationStatisticsByPkArgs = {
  course_id: Scalars['Int']['input'];
};

export type SubscriptionRootEvaluationStatisticsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<EvaluationStatisticsStreamCursorInput>>;
  where: InputMaybe<EvaluationStatisticsBoolExp>;
};

export type SubscriptionRootFlagsArgs = {
  distinct_on: InputMaybe<Array<FlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<FlagsOrderBy>>;
  where: InputMaybe<FlagsBoolExp>;
};

export type SubscriptionRootFlagsByPkArgs = {
  flag_id: Scalars['Int']['input'];
};

export type SubscriptionRootFlagsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<FlagsStreamCursorInput>>;
  where: InputMaybe<FlagsBoolExp>;
};

export type SubscriptionRootListingsArgs = {
  distinct_on: InputMaybe<Array<ListingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ListingsOrderBy>>;
  where: InputMaybe<ListingsBoolExp>;
};

export type SubscriptionRootListingsByPkArgs = {
  listing_id: Scalars['Int']['input'];
};

export type SubscriptionRootListingsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ListingsStreamCursorInput>>;
  where: InputMaybe<ListingsBoolExp>;
};

export type SubscriptionRootLocationsArgs = {
  distinct_on: InputMaybe<Array<LocationsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<LocationsOrderBy>>;
  where: InputMaybe<LocationsBoolExp>;
};

export type SubscriptionRootLocationsByPkArgs = {
  location_id: Scalars['Int']['input'];
};

export type SubscriptionRootLocationsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<LocationsStreamCursorInput>>;
  where: InputMaybe<LocationsBoolExp>;
};

export type SubscriptionRootMetadataArgs = {
  distinct_on: InputMaybe<Array<MetadataSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<MetadataOrderBy>>;
  where: InputMaybe<MetadataBoolExp>;
};

export type SubscriptionRootMetadataByPkArgs = {
  id: Scalars['Int']['input'];
};

export type SubscriptionRootMetadataStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<MetadataStreamCursorInput>>;
  where: InputMaybe<MetadataBoolExp>;
};

export type SubscriptionRootProfessorsArgs = {
  distinct_on: InputMaybe<Array<ProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ProfessorsOrderBy>>;
  where: InputMaybe<ProfessorsBoolExp>;
};

export type SubscriptionRootProfessorsByPkArgs = {
  professor_id: Scalars['Int']['input'];
};

export type SubscriptionRootProfessorsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ProfessorsStreamCursorInput>>;
  where: InputMaybe<ProfessorsBoolExp>;
};

export type SubscriptionRootSeasonsArgs = {
  distinct_on: InputMaybe<Array<SeasonsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<SeasonsOrderBy>>;
  where: InputMaybe<SeasonsBoolExp>;
};

export type SubscriptionRootSeasonsByPkArgs = {
  season_code: Scalars['String']['input'];
};

export type SubscriptionRootSeasonsStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<SeasonsStreamCursorInput>>;
  where: InputMaybe<SeasonsBoolExp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type TimestampComparisonExp = {
  _eq: InputMaybe<Scalars['timestamp']['input']>;
  _gt: InputMaybe<Scalars['timestamp']['input']>;
  _gte: InputMaybe<Scalars['timestamp']['input']>;
  _in: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['timestamp']['input']>;
  _lte: InputMaybe<Scalars['timestamp']['input']>;
  _neq: InputMaybe<Scalars['timestamp']['input']>;
  _nin: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

export type ListSeasonsQueryVariables = Exact<{ [key: string]: never }>;

export type ListSeasonsQuery = {
  __typename?: 'query_root';
  seasons: Array<{ __typename?: 'seasons'; season_code: string }>;
};

export type EvalsBySeasonQueryVariables = Exact<{
  season: Scalars['String']['input'];
}>;

export type EvalsBySeasonQuery = {
  __typename?: 'query_root';
  courses: Array<{
    __typename?: 'courses';
    average_gut_rating: number | null;
    average_rating: number | null;
    average_rating_same_professors: number | null;
    average_professor_rating: number | null;
    average_workload: number | null;
    average_workload_same_professors: number | null;
    course_id: number;
    last_enrollment: number | null;
    last_enrollment_same_professors: boolean | null;
    evaluation_statistic: {
      __typename?: 'evaluation_statistics';
      enrolled: number;
      responses: number | null;
    } | null;
    course_meetings: Array<{
      __typename?: 'course_meetings';
      days_of_week: number;
      start_time: string;
      end_time: string;
      location: {
        __typename?: 'locations';
        room: string | null;
        building: { __typename?: 'buildings'; code: string };
      } | null;
    }>;
  }>;
};

export type CatalogBySeasonQueryVariables = Exact<{
  season: Scalars['String']['input'];
}>;

export type CatalogBySeasonQuery = {
  __typename?: 'query_root';
  courses: Array<{
    __typename?: 'courses';
    areas: StringArr;
    colsem: boolean;
    course_id: number;
    credits: number | null;
    description: string | null;
    extra_info: ExtraInfo;
    final_exam: string | null;
    fysem: boolean;
    last_offered_course_id: number | null;
    primary_crn: Crn | null;
    requirements: string | null;
    same_course_and_profs_id: number;
    same_course_id: number;
    season_code: Season;
    section: string;
    skills: StringArr;
    sysem: boolean;
    title: string;
    time_added: any | null;
    last_updated: any | null;
    course_flags: Array<{
      __typename?: 'course_flags';
      flag: { __typename?: 'flags'; flag_text: string };
    }>;
    course_professors: Array<{
      __typename?: 'course_professors';
      professor: {
        __typename?: 'professors';
        professor_id: number;
        name: string;
      };
    }>;
    listings: Array<{
      __typename?: 'listings';
      course_code: string;
      crn: Crn;
      number: string;
      school: string;
      subject: string;
    }>;
    course_meetings: Array<{
      __typename?: 'course_meetings';
      days_of_week: number;
      start_time: string;
      end_time: string;
    }>;
  }>;
};

export type CourseAttributesQueryVariables = Exact<{ [key: string]: never }>;

export type CourseAttributesQuery = {
  __typename?: 'query_root';
  flags: Array<{ __typename?: 'flags'; flag_text: string }>;
};

export type BuildingsCatalogQueryVariables = Exact<{ [key: string]: never }>;

export type BuildingsCatalogQuery = {
  __typename?: 'query_root';
  buildings: Array<{
    __typename?: 'buildings';
    building_name: string | null;
    code: string;
    url: string | null;
  }>;
};

export type CourseModalOverviewDataQueryVariables = Exact<{
  listingId: Scalars['Int']['input'];
  sameCourseId: Scalars['Int']['input'];
  hasEvals: Scalars['Boolean']['input'];
}>;

export type CourseModalOverviewDataQuery = {
  __typename?: 'query_root';
  self: {
    __typename?: 'listings';
    school: string;
    season_code: Season;
    crn: Crn;
    course_code: string;
    course: {
      __typename?: 'courses';
      description: string | null;
      requirements: string | null;
      syllabus_url: string | null;
      course_home_url: string | null;
      section: string;
      last_enrollment?: number | null;
      last_enrollment_same_professors?: boolean | null;
      credits: number | null;
      classnotes: string | null;
      regnotes: string | null;
      rp_attr: string | null;
      final_exam: string | null;
      time_added: any | null;
      last_updated: any | null;
      same_course_id: number;
      course_professors: Array<{
        __typename?: 'course_professors';
        professor: {
          __typename?: 'professors';
          professor_id: number;
          name: string;
          average_rating?: number | null;
        };
      }>;
      course_meetings: Array<{
        __typename?: 'course_meetings';
        days_of_week: number;
        start_time: string;
        end_time: string;
        location: {
          __typename?: 'locations';
          room: string | null;
          building: {
            __typename?: 'buildings';
            code: string;
            building_name: string | null;
            url: string | null;
          };
        } | null;
      }>;
      course_flags: Array<{
        __typename?: 'course_flags';
        flag: { __typename?: 'flags'; flag_text: string };
      }>;
      evaluation_statistic?: {
        __typename?: 'evaluation_statistics';
        enrolled: number;
      } | null;
    };
  } | null;
  sameCourse: Array<
    {
      __typename?: 'courses';
      average_professor_rating?: number | null;
      course_id: number;
      syllabus_url: string | null;
      course_home_url: string | null;
      evaluation_statistic?: {
        __typename?: 'evaluation_statistics';
        avg_workload: number | null;
        avg_rating: number | null;
      } | null;
      course_professors: Array<{
        __typename?: 'course_professors';
        professor: {
          __typename?: 'professors';
          name: string;
          average_rating?: number | null;
        };
      }>;
    } & CourseModalPrefetchCourseDataFragment
  >;
};

export type CourseModalPrefetchListingDataFragment = {
  __typename?: 'listings';
  crn: Crn;
  course_code: string;
  course: { __typename?: 'courses' } & CourseModalPrefetchCourseDataFragment;
};

export type CourseModalPrefetchCourseDataFragment = {
  __typename?: 'courses';
  season_code: Season;
  section: string;
  title: string;
  skills: StringArr;
  areas: StringArr;
  extra_info: ExtraInfo;
  description: string | null;
  same_course_id: number;
  primary_crn: Crn | null;
  listings: Array<{ __typename?: 'listings'; crn: Crn; course_code: string }>;
  course_professors: Array<{
    __typename?: 'course_professors';
    professor: { __typename?: 'professors'; professor_id: number };
  }>;
  course_meetings: Array<{
    __typename?: 'course_meetings';
    days_of_week: number;
    start_time: string;
    end_time: string;
  }>;
  evaluation_statistic?: {
    __typename?: 'evaluation_statistics';
    responses: number | null;
  } | null;
};

export type SearchEvaluationNarrativesQueryVariables = Exact<{
  listingId: Scalars['Int']['input'];
}>;

export type SearchEvaluationNarrativesQuery = {
  __typename?: 'query_root';
  listings_by_pk: {
    __typename?: 'listings';
    course: {
      __typename?: 'courses';
      evaluation_narratives: Array<{
        __typename?: 'evaluation_narratives';
        comment: string;
        evaluation_question: {
          __typename?: 'evaluation_questions';
          question_text: string;
          tag: string | null;
        };
      }>;
      evaluation_ratings: Array<{
        __typename?: 'evaluation_ratings';
        rating: NumberArr;
        evaluation_question: {
          __typename?: 'evaluation_questions';
          question_text: string;
          options: StringArr;
          tag: string | null;
        };
      }>;
      evaluation_statistic: {
        __typename?: 'evaluation_statistics';
        enrolled: number;
      } | null;
    };
  } | null;
};

export type ProfModalOverviewDataQueryVariables = Exact<{
  professorId: Scalars['Int']['input'];
  hasEvals: Scalars['Boolean']['input'];
}>;

export type ProfModalOverviewDataQuery = {
  __typename?: 'query_root';
  professors: Array<{
    __typename?: 'professors';
    name: string;
    email: string | null;
    courses_taught: number;
    average_rating?: number | null;
    course_professors: Array<{
      __typename?: 'course_professors';
      course: {
        __typename?: 'courses';
        course_id: number;
        evaluation_statistic?: {
          __typename?: 'evaluation_statistics';
          avg_workload: number | null;
          avg_rating: number | null;
        } | null;
      } & CourseModalPrefetchCourseDataFragment;
    }>;
  }>;
};

export type CourseModalFromUrlQueryVariables = Exact<{
  listingId: Scalars['Int']['input'];
  hasEvals: Scalars['Boolean']['input'];
}>;

export type CourseModalFromUrlQuery = {
  __typename?: 'query_root';
  listings_by_pk:
    | ({ __typename?: 'listings' } & CourseModalPrefetchListingDataFragment)
    | null;
};

export type PrereqLinkInfoQueryVariables = Exact<{
  courseCodes: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
  hasEvals: Scalars['Boolean']['input'];
}>;

export type PrereqLinkInfoQuery = {
  __typename?: 'query_root';
  listings: Array<
    { __typename?: 'listings' } & CourseModalPrefetchListingDataFragment
  >;
};

export type CourseSectionsQueryVariables = Exact<{
  courseCode: Scalars['String']['input'];
  seasonCode: Scalars['String']['input'];
  hasEvals: Scalars['Boolean']['input'];
}>;

export type CourseSectionsQuery = {
  __typename?: 'query_root';
  listings: Array<
    {
      __typename?: 'listings';
      course: {
        __typename?: 'courses';
        course_professors: Array<{
          __typename?: 'course_professors';
          professor: { __typename?: 'professors'; name: string };
        }>;
      };
    } & CourseModalPrefetchListingDataFragment
  >;
};

export type LatestCurrentOfferingQueryVariables = Exact<{
  sameCourseId: Scalars['Int']['input'];
  seasonCodes: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type LatestCurrentOfferingQuery = {
  __typename?: 'query_root';
  courses: Array<{
    __typename?: 'courses';
    season_code: Season;
    listings: Array<{ __typename?: 'listings'; crn: Crn; course_code: string }>;
  }>;
};
