import { Crn } from '../queries/graphql-types';
import { ExtraInfo } from '../queries/graphql-types';
import { NumberArr } from '../queries/graphql-types';
import { ProfessorInfo } from '../queries/graphql-types';
import { Season } from '../queries/graphql-types';
import { StringArr } from '../queries/graphql-types';
import { TimesByDay } from '../queries/graphql-types';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
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
const defaultOptions = {} as const;
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
  ProfessorInfo: { input: ProfessorInfo; output: ProfessorInfo };
  Season: { input: Season; output: Season };
  StringArr: { input: StringArr; output: StringArr };
  TimesByDay: { input: TimesByDay; output: TimesByDay };
  float8: { input: number; output: number };
  json: { input: object; output: object };
  jsonb: { input: object; output: object };
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

/** columns and relationships of "computed_listing_info" */
export type ComputedListingInfo = {
  __typename?: 'computed_listing_info';
  all_course_codes: Scalars['StringArr']['output'];
  areas: Scalars['StringArr']['output'];
  average_gut_rating: Maybe<Scalars['float8']['output']>;
  average_professor: Maybe<Scalars['float8']['output']>;
  average_rating: Maybe<Scalars['float8']['output']>;
  average_rating_n: Scalars['Int']['output'];
  average_rating_same_professors: Maybe<Scalars['float8']['output']>;
  average_rating_same_professors_n: Scalars['Int']['output'];
  average_workload: Maybe<Scalars['float8']['output']>;
  average_workload_n: Scalars['Int']['output'];
  average_workload_same_professors: Maybe<Scalars['float8']['output']>;
  average_workload_same_professors_n: Scalars['Int']['output'];
  classnotes: Maybe<Scalars['String']['output']>;
  colsem: Maybe<Scalars['Boolean']['output']>;
  /** An object relationship */
  course: Courses;
  course_code: Scalars['String']['output'];
  course_id: Scalars['Int']['output'];
  credits: Maybe<Scalars['float8']['output']>;
  crn: Scalars['Crn']['output'];
  declined: Maybe<Scalars['Int']['output']>;
  description: Scalars['String']['output'];
  enrolled: Maybe<Scalars['Int']['output']>;
  extra_info: Scalars['ExtraInfo']['output'];
  final_exam: Maybe<Scalars['String']['output']>;
  flag_info: Scalars['StringArr']['output'];
  fysem: Maybe<Scalars['Boolean']['output']>;
  last_enrollment: Maybe<Scalars['Int']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Int']['output']>;
  last_enrollment_same_professors: Maybe<Scalars['Boolean']['output']>;
  last_enrollment_season_code: Maybe<Scalars['String']['output']>;
  last_offered_course_id: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  listing: Listings;
  listing_id: Scalars['Int']['output'];
  locations_summary: Scalars['String']['output'];
  no_response: Maybe<Scalars['Int']['output']>;
  number: Scalars['String']['output'];
  professor_ids: Scalars['StringArr']['output'];
  professor_info: Maybe<Scalars['ProfessorInfo']['output']>;
  professor_names: Scalars['StringArr']['output'];
  regnotes: Maybe<Scalars['String']['output']>;
  requirements: Scalars['String']['output'];
  responses: Maybe<Scalars['Int']['output']>;
  rp_attr: Maybe<Scalars['String']['output']>;
  same_course_and_profs_id: Scalars['Int']['output'];
  same_course_id: Scalars['Int']['output'];
  school: Maybe<Scalars['String']['output']>;
  season_code: Scalars['Season']['output'];
  section: Scalars['String']['output'];
  skills: Scalars['StringArr']['output'];
  subject: Scalars['String']['output'];
  syllabus_url: Maybe<Scalars['String']['output']>;
  sysem: Maybe<Scalars['Boolean']['output']>;
  times_by_day: Scalars['TimesByDay']['output'];
  times_summary: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

/** columns and relationships of "computed_listing_info" */
export type ComputedListingInfoAllCourseCodesArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "computed_listing_info" */
export type ComputedListingInfoAreasArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "computed_listing_info" */
export type ComputedListingInfoFlagInfoArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "computed_listing_info" */
export type ComputedListingInfoProfessorIdsArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "computed_listing_info" */
export type ComputedListingInfoProfessorInfoArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "computed_listing_info" */
export type ComputedListingInfoProfessorNamesArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "computed_listing_info" */
export type ComputedListingInfoSkillsArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "computed_listing_info" */
export type ComputedListingInfoTimesByDayArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "computed_listing_info" */
export type ComputedListingInfoAggregate = {
  __typename?: 'computed_listing_info_aggregate';
  aggregate: Maybe<ComputedListingInfoAggregateFields>;
  nodes: Array<ComputedListingInfo>;
};

export type ComputedListingInfoAggregateBoolExp = {
  avg: InputMaybe<ComputedListingInfoAggregateBoolExpAvg>;
  bool_and: InputMaybe<ComputedListingInfoAggregateBoolExpBoolAnd>;
  bool_or: InputMaybe<ComputedListingInfoAggregateBoolExpBoolOr>;
  corr: InputMaybe<ComputedListingInfoAggregateBoolExpCorr>;
  count: InputMaybe<ComputedListingInfoAggregateBoolExpCount>;
  covar_samp: InputMaybe<ComputedListingInfoAggregateBoolExpCovarSamp>;
  max: InputMaybe<ComputedListingInfoAggregateBoolExpMax>;
  min: InputMaybe<ComputedListingInfoAggregateBoolExpMin>;
  stddev_samp: InputMaybe<ComputedListingInfoAggregateBoolExpStddevSamp>;
  sum: InputMaybe<ComputedListingInfoAggregateBoolExpSum>;
  var_samp: InputMaybe<ComputedListingInfoAggregateBoolExpVarSamp>;
};

export type ComputedListingInfoAggregateBoolExpAvg = {
  arguments: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpAvgArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: Float8ComparisonExp;
};

export type ComputedListingInfoAggregateBoolExpBoolAnd = {
  arguments: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpBoolAndArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ComputedListingInfoAggregateBoolExpBoolOr = {
  arguments: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpBoolOrArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: BooleanComparisonExp;
};

export type ComputedListingInfoAggregateBoolExpCorr = {
  arguments: ComputedListingInfoAggregateBoolExpCorrArguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: Float8ComparisonExp;
};

export type ComputedListingInfoAggregateBoolExpCorrArguments = {
  X: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpCorrArgumentsColumns;
  Y: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpCorrArgumentsColumns;
};

export type ComputedListingInfoAggregateBoolExpCount = {
  arguments: InputMaybe<Array<ComputedListingInfoSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: IntComparisonExp;
};

export type ComputedListingInfoAggregateBoolExpCovarSamp = {
  arguments: ComputedListingInfoAggregateBoolExpCovarSampArguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: Float8ComparisonExp;
};

export type ComputedListingInfoAggregateBoolExpCovarSampArguments = {
  X: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpCovarSampArgumentsColumns;
  Y: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpCovarSampArgumentsColumns;
};

export type ComputedListingInfoAggregateBoolExpMax = {
  arguments: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpMaxArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: Float8ComparisonExp;
};

export type ComputedListingInfoAggregateBoolExpMin = {
  arguments: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpMinArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: Float8ComparisonExp;
};

export type ComputedListingInfoAggregateBoolExpStddevSamp = {
  arguments: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpStddevSampArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: Float8ComparisonExp;
};

export type ComputedListingInfoAggregateBoolExpSum = {
  arguments: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpSumArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: Float8ComparisonExp;
};

export type ComputedListingInfoAggregateBoolExpVarSamp = {
  arguments: ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpVarSampArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ComputedListingInfoBoolExp>;
  predicate: Float8ComparisonExp;
};

/** aggregate fields of "computed_listing_info" */
export type ComputedListingInfoAggregateFields = {
  __typename?: 'computed_listing_info_aggregate_fields';
  avg: Maybe<ComputedListingInfoAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<ComputedListingInfoMaxFields>;
  min: Maybe<ComputedListingInfoMinFields>;
  stddev: Maybe<ComputedListingInfoStddevFields>;
  stddev_pop: Maybe<ComputedListingInfoStddevPopFields>;
  stddev_samp: Maybe<ComputedListingInfoStddevSampFields>;
  sum: Maybe<ComputedListingInfoSumFields>;
  var_pop: Maybe<ComputedListingInfoVarPopFields>;
  var_samp: Maybe<ComputedListingInfoVarSampFields>;
  variance: Maybe<ComputedListingInfoVarianceFields>;
};

/** aggregate fields of "computed_listing_info" */
export type ComputedListingInfoAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<ComputedListingInfoSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "computed_listing_info" */
export type ComputedListingInfoAggregateOrderBy = {
  avg: InputMaybe<ComputedListingInfoAvgOrderBy>;
  count: InputMaybe<OrderBy>;
  max: InputMaybe<ComputedListingInfoMaxOrderBy>;
  min: InputMaybe<ComputedListingInfoMinOrderBy>;
  stddev: InputMaybe<ComputedListingInfoStddevOrderBy>;
  stddev_pop: InputMaybe<ComputedListingInfoStddevPopOrderBy>;
  stddev_samp: InputMaybe<ComputedListingInfoStddevSampOrderBy>;
  sum: InputMaybe<ComputedListingInfoSumOrderBy>;
  var_pop: InputMaybe<ComputedListingInfoVarPopOrderBy>;
  var_samp: InputMaybe<ComputedListingInfoVarSampOrderBy>;
  variance: InputMaybe<ComputedListingInfoVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type ComputedListingInfoAppendInput = {
  all_course_codes: InputMaybe<Scalars['jsonb']['input']>;
  areas: InputMaybe<Scalars['jsonb']['input']>;
  flag_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_ids: InputMaybe<Scalars['jsonb']['input']>;
  professor_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_names: InputMaybe<Scalars['jsonb']['input']>;
  skills: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "computed_listing_info" */
export type ComputedListingInfoArrRelInsertInput = {
  data: Array<ComputedListingInfoInsertInput>;
  /** upsert condition */
  on_conflict: InputMaybe<ComputedListingInfoOnConflict>;
};

/** aggregate avg on columns */
export type ComputedListingInfoAvgFields = {
  __typename?: 'computed_listing_info_avg_fields';
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  average_professor: Maybe<Scalars['Float']['output']>;
  average_rating: Maybe<Scalars['Float']['output']>;
  average_rating_n: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  average_workload: Maybe<Scalars['Float']['output']>;
  average_workload_n: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  credits: Maybe<Scalars['Float']['output']>;
  crn: Maybe<Scalars['Float']['output']>;
  declined: Maybe<Scalars['Float']['output']>;
  enrolled: Maybe<Scalars['Float']['output']>;
  last_enrollment: Maybe<Scalars['Float']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  listing_id: Maybe<Scalars['Float']['output']>;
  no_response: Maybe<Scalars['Float']['output']>;
  responses: Maybe<Scalars['Float']['output']>;
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "computed_listing_info" */
export type ComputedListingInfoAvgOrderBy = {
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "computed_listing_info". All fields are combined with a logical 'AND'. */
export type ComputedListingInfoBoolExp = {
  _and: InputMaybe<Array<ComputedListingInfoBoolExp>>;
  _not: InputMaybe<ComputedListingInfoBoolExp>;
  _or: InputMaybe<Array<ComputedListingInfoBoolExp>>;
  all_course_codes: InputMaybe<JsonbComparisonExp>;
  areas: InputMaybe<JsonbComparisonExp>;
  average_gut_rating: InputMaybe<Float8ComparisonExp>;
  average_professor: InputMaybe<Float8ComparisonExp>;
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
  course: InputMaybe<CoursesBoolExp>;
  course_code: InputMaybe<StringComparisonExp>;
  course_id: InputMaybe<IntComparisonExp>;
  credits: InputMaybe<Float8ComparisonExp>;
  crn: InputMaybe<IntComparisonExp>;
  declined: InputMaybe<IntComparisonExp>;
  description: InputMaybe<StringComparisonExp>;
  enrolled: InputMaybe<IntComparisonExp>;
  extra_info: InputMaybe<StringComparisonExp>;
  final_exam: InputMaybe<StringComparisonExp>;
  flag_info: InputMaybe<JsonbComparisonExp>;
  fysem: InputMaybe<BooleanComparisonExp>;
  last_enrollment: InputMaybe<IntComparisonExp>;
  last_enrollment_course_id: InputMaybe<IntComparisonExp>;
  last_enrollment_same_professors: InputMaybe<BooleanComparisonExp>;
  last_enrollment_season_code: InputMaybe<StringComparisonExp>;
  last_offered_course_id: InputMaybe<IntComparisonExp>;
  listing: InputMaybe<ListingsBoolExp>;
  listing_id: InputMaybe<IntComparisonExp>;
  locations_summary: InputMaybe<StringComparisonExp>;
  no_response: InputMaybe<IntComparisonExp>;
  number: InputMaybe<StringComparisonExp>;
  professor_ids: InputMaybe<JsonbComparisonExp>;
  professor_info: InputMaybe<JsonbComparisonExp>;
  professor_names: InputMaybe<JsonbComparisonExp>;
  regnotes: InputMaybe<StringComparisonExp>;
  requirements: InputMaybe<StringComparisonExp>;
  responses: InputMaybe<IntComparisonExp>;
  rp_attr: InputMaybe<StringComparisonExp>;
  same_course_and_profs_id: InputMaybe<IntComparisonExp>;
  same_course_id: InputMaybe<IntComparisonExp>;
  school: InputMaybe<StringComparisonExp>;
  season_code: InputMaybe<StringComparisonExp>;
  section: InputMaybe<StringComparisonExp>;
  skills: InputMaybe<JsonbComparisonExp>;
  subject: InputMaybe<StringComparisonExp>;
  syllabus_url: InputMaybe<StringComparisonExp>;
  sysem: InputMaybe<BooleanComparisonExp>;
  times_by_day: InputMaybe<JsonComparisonExp>;
  times_summary: InputMaybe<StringComparisonExp>;
  title: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "computed_listing_info" */
export enum ComputedListingInfoConstraint {
  /** unique or primary key constraint on columns "listing_id" */
  IdxComputedListingListingId = 'idx_computed_listing_listing_id',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type ComputedListingInfoDeleteAtPathInput = {
  all_course_codes: InputMaybe<Array<Scalars['String']['input']>>;
  areas: InputMaybe<Array<Scalars['String']['input']>>;
  flag_info: InputMaybe<Array<Scalars['String']['input']>>;
  professor_ids: InputMaybe<Array<Scalars['String']['input']>>;
  professor_info: InputMaybe<Array<Scalars['String']['input']>>;
  professor_names: InputMaybe<Array<Scalars['String']['input']>>;
  skills: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type ComputedListingInfoDeleteElemInput = {
  all_course_codes: InputMaybe<Scalars['Int']['input']>;
  areas: InputMaybe<Scalars['Int']['input']>;
  flag_info: InputMaybe<Scalars['Int']['input']>;
  professor_ids: InputMaybe<Scalars['Int']['input']>;
  professor_info: InputMaybe<Scalars['Int']['input']>;
  professor_names: InputMaybe<Scalars['Int']['input']>;
  skills: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type ComputedListingInfoDeleteKeyInput = {
  all_course_codes: InputMaybe<Scalars['String']['input']>;
  areas: InputMaybe<Scalars['String']['input']>;
  flag_info: InputMaybe<Scalars['String']['input']>;
  professor_ids: InputMaybe<Scalars['String']['input']>;
  professor_info: InputMaybe<Scalars['String']['input']>;
  professor_names: InputMaybe<Scalars['String']['input']>;
  skills: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "computed_listing_info" */
export type ComputedListingInfoIncInput = {
  average_gut_rating: InputMaybe<Scalars['float8']['input']>;
  average_professor: InputMaybe<Scalars['float8']['input']>;
  average_rating: InputMaybe<Scalars['float8']['input']>;
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  average_rating_same_professors: InputMaybe<Scalars['float8']['input']>;
  average_rating_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  average_workload: InputMaybe<Scalars['float8']['input']>;
  average_workload_n: InputMaybe<Scalars['Int']['input']>;
  average_workload_same_professors: InputMaybe<Scalars['float8']['input']>;
  average_workload_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  credits: InputMaybe<Scalars['float8']['input']>;
  crn: InputMaybe<Scalars['Int']['input']>;
  declined: InputMaybe<Scalars['Int']['input']>;
  enrolled: InputMaybe<Scalars['Int']['input']>;
  last_enrollment: InputMaybe<Scalars['Int']['input']>;
  last_enrollment_course_id: InputMaybe<Scalars['Int']['input']>;
  last_offered_course_id: InputMaybe<Scalars['Int']['input']>;
  listing_id: InputMaybe<Scalars['Int']['input']>;
  no_response: InputMaybe<Scalars['Int']['input']>;
  responses: InputMaybe<Scalars['Int']['input']>;
  same_course_and_profs_id: InputMaybe<Scalars['Int']['input']>;
  same_course_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "computed_listing_info" */
export type ComputedListingInfoInsertInput = {
  all_course_codes: InputMaybe<Scalars['jsonb']['input']>;
  areas: InputMaybe<Scalars['jsonb']['input']>;
  average_gut_rating: InputMaybe<Scalars['float8']['input']>;
  average_professor: InputMaybe<Scalars['float8']['input']>;
  average_rating: InputMaybe<Scalars['float8']['input']>;
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  average_rating_same_professors: InputMaybe<Scalars['float8']['input']>;
  average_rating_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  average_workload: InputMaybe<Scalars['float8']['input']>;
  average_workload_n: InputMaybe<Scalars['Int']['input']>;
  average_workload_same_professors: InputMaybe<Scalars['float8']['input']>;
  average_workload_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  classnotes: InputMaybe<Scalars['String']['input']>;
  colsem: InputMaybe<Scalars['Boolean']['input']>;
  course: InputMaybe<CoursesObjRelInsertInput>;
  course_code: InputMaybe<Scalars['String']['input']>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  credits: InputMaybe<Scalars['float8']['input']>;
  crn: InputMaybe<Scalars['Int']['input']>;
  declined: InputMaybe<Scalars['Int']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  enrolled: InputMaybe<Scalars['Int']['input']>;
  extra_info: InputMaybe<Scalars['String']['input']>;
  final_exam: InputMaybe<Scalars['String']['input']>;
  flag_info: InputMaybe<Scalars['jsonb']['input']>;
  fysem: InputMaybe<Scalars['Boolean']['input']>;
  last_enrollment: InputMaybe<Scalars['Int']['input']>;
  last_enrollment_course_id: InputMaybe<Scalars['Int']['input']>;
  last_enrollment_same_professors: InputMaybe<Scalars['Boolean']['input']>;
  last_enrollment_season_code: InputMaybe<Scalars['String']['input']>;
  last_offered_course_id: InputMaybe<Scalars['Int']['input']>;
  listing: InputMaybe<ListingsObjRelInsertInput>;
  listing_id: InputMaybe<Scalars['Int']['input']>;
  locations_summary: InputMaybe<Scalars['String']['input']>;
  no_response: InputMaybe<Scalars['Int']['input']>;
  number: InputMaybe<Scalars['String']['input']>;
  professor_ids: InputMaybe<Scalars['jsonb']['input']>;
  professor_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_names: InputMaybe<Scalars['jsonb']['input']>;
  regnotes: InputMaybe<Scalars['String']['input']>;
  requirements: InputMaybe<Scalars['String']['input']>;
  responses: InputMaybe<Scalars['Int']['input']>;
  rp_attr: InputMaybe<Scalars['String']['input']>;
  same_course_and_profs_id: InputMaybe<Scalars['Int']['input']>;
  same_course_id: InputMaybe<Scalars['Int']['input']>;
  school: InputMaybe<Scalars['String']['input']>;
  season_code: InputMaybe<Scalars['String']['input']>;
  section: InputMaybe<Scalars['String']['input']>;
  skills: InputMaybe<Scalars['jsonb']['input']>;
  subject: InputMaybe<Scalars['String']['input']>;
  syllabus_url: InputMaybe<Scalars['String']['input']>;
  sysem: InputMaybe<Scalars['Boolean']['input']>;
  times_by_day: InputMaybe<Scalars['json']['input']>;
  times_summary: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type ComputedListingInfoMaxFields = {
  __typename?: 'computed_listing_info_max_fields';
  average_gut_rating: Maybe<Scalars['float8']['output']>;
  average_professor: Maybe<Scalars['float8']['output']>;
  average_rating: Maybe<Scalars['float8']['output']>;
  average_rating_n: Maybe<Scalars['Int']['output']>;
  average_rating_same_professors: Maybe<Scalars['float8']['output']>;
  average_rating_same_professors_n: Maybe<Scalars['Int']['output']>;
  average_workload: Maybe<Scalars['float8']['output']>;
  average_workload_n: Maybe<Scalars['Int']['output']>;
  average_workload_same_professors: Maybe<Scalars['float8']['output']>;
  average_workload_same_professors_n: Maybe<Scalars['Int']['output']>;
  classnotes: Maybe<Scalars['String']['output']>;
  course_code: Maybe<Scalars['String']['output']>;
  course_id: Maybe<Scalars['Int']['output']>;
  credits: Maybe<Scalars['float8']['output']>;
  crn: Maybe<Scalars['Int']['output']>;
  declined: Maybe<Scalars['Int']['output']>;
  description: Maybe<Scalars['String']['output']>;
  enrolled: Maybe<Scalars['Int']['output']>;
  extra_info: Maybe<Scalars['String']['output']>;
  final_exam: Maybe<Scalars['String']['output']>;
  last_enrollment: Maybe<Scalars['Int']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Int']['output']>;
  last_enrollment_season_code: Maybe<Scalars['String']['output']>;
  last_offered_course_id: Maybe<Scalars['Int']['output']>;
  listing_id: Maybe<Scalars['Int']['output']>;
  locations_summary: Maybe<Scalars['String']['output']>;
  no_response: Maybe<Scalars['Int']['output']>;
  number: Maybe<Scalars['String']['output']>;
  regnotes: Maybe<Scalars['String']['output']>;
  requirements: Maybe<Scalars['String']['output']>;
  responses: Maybe<Scalars['Int']['output']>;
  rp_attr: Maybe<Scalars['String']['output']>;
  same_course_and_profs_id: Maybe<Scalars['Int']['output']>;
  same_course_id: Maybe<Scalars['Int']['output']>;
  school: Maybe<Scalars['String']['output']>;
  season_code: Maybe<Scalars['String']['output']>;
  section: Maybe<Scalars['String']['output']>;
  subject: Maybe<Scalars['String']['output']>;
  syllabus_url: Maybe<Scalars['String']['output']>;
  times_summary: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "computed_listing_info" */
export type ComputedListingInfoMaxOrderBy = {
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  classnotes: InputMaybe<OrderBy>;
  course_code: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  description: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  extra_info: InputMaybe<OrderBy>;
  final_exam: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_enrollment_season_code: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  locations_summary: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  number: InputMaybe<OrderBy>;
  regnotes: InputMaybe<OrderBy>;
  requirements: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  rp_attr: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
  school: InputMaybe<OrderBy>;
  season_code: InputMaybe<OrderBy>;
  section: InputMaybe<OrderBy>;
  subject: InputMaybe<OrderBy>;
  syllabus_url: InputMaybe<OrderBy>;
  times_summary: InputMaybe<OrderBy>;
  title: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ComputedListingInfoMinFields = {
  __typename?: 'computed_listing_info_min_fields';
  average_gut_rating: Maybe<Scalars['float8']['output']>;
  average_professor: Maybe<Scalars['float8']['output']>;
  average_rating: Maybe<Scalars['float8']['output']>;
  average_rating_n: Maybe<Scalars['Int']['output']>;
  average_rating_same_professors: Maybe<Scalars['float8']['output']>;
  average_rating_same_professors_n: Maybe<Scalars['Int']['output']>;
  average_workload: Maybe<Scalars['float8']['output']>;
  average_workload_n: Maybe<Scalars['Int']['output']>;
  average_workload_same_professors: Maybe<Scalars['float8']['output']>;
  average_workload_same_professors_n: Maybe<Scalars['Int']['output']>;
  classnotes: Maybe<Scalars['String']['output']>;
  course_code: Maybe<Scalars['String']['output']>;
  course_id: Maybe<Scalars['Int']['output']>;
  credits: Maybe<Scalars['float8']['output']>;
  crn: Maybe<Scalars['Int']['output']>;
  declined: Maybe<Scalars['Int']['output']>;
  description: Maybe<Scalars['String']['output']>;
  enrolled: Maybe<Scalars['Int']['output']>;
  extra_info: Maybe<Scalars['String']['output']>;
  final_exam: Maybe<Scalars['String']['output']>;
  last_enrollment: Maybe<Scalars['Int']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Int']['output']>;
  last_enrollment_season_code: Maybe<Scalars['String']['output']>;
  last_offered_course_id: Maybe<Scalars['Int']['output']>;
  listing_id: Maybe<Scalars['Int']['output']>;
  locations_summary: Maybe<Scalars['String']['output']>;
  no_response: Maybe<Scalars['Int']['output']>;
  number: Maybe<Scalars['String']['output']>;
  regnotes: Maybe<Scalars['String']['output']>;
  requirements: Maybe<Scalars['String']['output']>;
  responses: Maybe<Scalars['Int']['output']>;
  rp_attr: Maybe<Scalars['String']['output']>;
  same_course_and_profs_id: Maybe<Scalars['Int']['output']>;
  same_course_id: Maybe<Scalars['Int']['output']>;
  school: Maybe<Scalars['String']['output']>;
  season_code: Maybe<Scalars['String']['output']>;
  section: Maybe<Scalars['String']['output']>;
  subject: Maybe<Scalars['String']['output']>;
  syllabus_url: Maybe<Scalars['String']['output']>;
  times_summary: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "computed_listing_info" */
export type ComputedListingInfoMinOrderBy = {
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  classnotes: InputMaybe<OrderBy>;
  course_code: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  description: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  extra_info: InputMaybe<OrderBy>;
  final_exam: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_enrollment_season_code: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  locations_summary: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  number: InputMaybe<OrderBy>;
  regnotes: InputMaybe<OrderBy>;
  requirements: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  rp_attr: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
  school: InputMaybe<OrderBy>;
  season_code: InputMaybe<OrderBy>;
  section: InputMaybe<OrderBy>;
  subject: InputMaybe<OrderBy>;
  syllabus_url: InputMaybe<OrderBy>;
  times_summary: InputMaybe<OrderBy>;
  title: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "computed_listing_info" */
export type ComputedListingInfoMutationResponse = {
  __typename?: 'computed_listing_info_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ComputedListingInfo>;
};

/** on_conflict condition type for table "computed_listing_info" */
export type ComputedListingInfoOnConflict = {
  constraint: ComputedListingInfoConstraint;
  update_columns: Array<ComputedListingInfoUpdateColumn>;
  where: InputMaybe<ComputedListingInfoBoolExp>;
};

/** Ordering options when selecting data from "computed_listing_info". */
export type ComputedListingInfoOrderBy = {
  all_course_codes: InputMaybe<OrderBy>;
  areas: InputMaybe<OrderBy>;
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
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
  course: InputMaybe<CoursesOrderBy>;
  course_code: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  description: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  extra_info: InputMaybe<OrderBy>;
  final_exam: InputMaybe<OrderBy>;
  flag_info: InputMaybe<OrderBy>;
  fysem: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_enrollment_same_professors: InputMaybe<OrderBy>;
  last_enrollment_season_code: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing: InputMaybe<ListingsOrderBy>;
  listing_id: InputMaybe<OrderBy>;
  locations_summary: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  number: InputMaybe<OrderBy>;
  professor_ids: InputMaybe<OrderBy>;
  professor_info: InputMaybe<OrderBy>;
  professor_names: InputMaybe<OrderBy>;
  regnotes: InputMaybe<OrderBy>;
  requirements: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  rp_attr: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
  school: InputMaybe<OrderBy>;
  season_code: InputMaybe<OrderBy>;
  section: InputMaybe<OrderBy>;
  skills: InputMaybe<OrderBy>;
  subject: InputMaybe<OrderBy>;
  syllabus_url: InputMaybe<OrderBy>;
  sysem: InputMaybe<OrderBy>;
  times_by_day: InputMaybe<OrderBy>;
  times_summary: InputMaybe<OrderBy>;
  title: InputMaybe<OrderBy>;
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type ComputedListingInfoPrependInput = {
  all_course_codes: InputMaybe<Scalars['jsonb']['input']>;
  areas: InputMaybe<Scalars['jsonb']['input']>;
  flag_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_ids: InputMaybe<Scalars['jsonb']['input']>;
  professor_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_names: InputMaybe<Scalars['jsonb']['input']>;
  skills: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumn {
  /** column name */
  AllCourseCodes = 'all_course_codes',
  /** column name */
  Areas = 'areas',
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessor = 'average_professor',
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
  CourseCode = 'course_code',
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Credits = 'credits',
  /** column name */
  Crn = 'crn',
  /** column name */
  Declined = 'declined',
  /** column name */
  Description = 'description',
  /** column name */
  Enrolled = 'enrolled',
  /** column name */
  ExtraInfo = 'extra_info',
  /** column name */
  FinalExam = 'final_exam',
  /** column name */
  FlagInfo = 'flag_info',
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
  ListingId = 'listing_id',
  /** column name */
  LocationsSummary = 'locations_summary',
  /** column name */
  NoResponse = 'no_response',
  /** column name */
  Number = 'number',
  /** column name */
  ProfessorIds = 'professor_ids',
  /** column name */
  ProfessorInfo = 'professor_info',
  /** column name */
  ProfessorNames = 'professor_names',
  /** column name */
  Regnotes = 'regnotes',
  /** column name */
  Requirements = 'requirements',
  /** column name */
  Responses = 'responses',
  /** column name */
  RpAttr = 'rp_attr',
  /** column name */
  SameCourseAndProfsId = 'same_course_and_profs_id',
  /** column name */
  SameCourseId = 'same_course_id',
  /** column name */
  School = 'school',
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Section = 'section',
  /** column name */
  Skills = 'skills',
  /** column name */
  Subject = 'subject',
  /** column name */
  SyllabusUrl = 'syllabus_url',
  /** column name */
  Sysem = 'sysem',
  /** column name */
  TimesByDay = 'times_by_day',
  /** column name */
  TimesSummary = 'times_summary',
  /** column name */
  Title = 'title',
}

/** select "computed_listing_info_aggregate_bool_exp_avg_arguments_columns" columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpAvgArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessor = 'average_professor',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "computed_listing_info_aggregate_bool_exp_bool_and_arguments_columns" columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  Colsem = 'colsem',
  /** column name */
  Fysem = 'fysem',
  /** column name */
  LastEnrollmentSameProfessors = 'last_enrollment_same_professors',
  /** column name */
  Sysem = 'sysem',
}

/** select "computed_listing_info_aggregate_bool_exp_bool_or_arguments_columns" columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  Colsem = 'colsem',
  /** column name */
  Fysem = 'fysem',
  /** column name */
  LastEnrollmentSameProfessors = 'last_enrollment_same_professors',
  /** column name */
  Sysem = 'sysem',
}

/** select "computed_listing_info_aggregate_bool_exp_corr_arguments_columns" columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpCorrArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessor = 'average_professor',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "computed_listing_info_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpCovarSampArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessor = 'average_professor',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "computed_listing_info_aggregate_bool_exp_max_arguments_columns" columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpMaxArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessor = 'average_professor',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "computed_listing_info_aggregate_bool_exp_min_arguments_columns" columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpMinArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessor = 'average_professor',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "computed_listing_info_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpStddevSampArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessor = 'average_professor',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "computed_listing_info_aggregate_bool_exp_sum_arguments_columns" columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpSumArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessor = 'average_professor',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "computed_listing_info_aggregate_bool_exp_var_samp_arguments_columns" columns of table "computed_listing_info" */
export enum ComputedListingInfoSelectColumnComputedListingInfoAggregateBoolExpVarSampArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessor = 'average_professor',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** input type for updating data in table "computed_listing_info" */
export type ComputedListingInfoSetInput = {
  all_course_codes: InputMaybe<Scalars['jsonb']['input']>;
  areas: InputMaybe<Scalars['jsonb']['input']>;
  average_gut_rating: InputMaybe<Scalars['float8']['input']>;
  average_professor: InputMaybe<Scalars['float8']['input']>;
  average_rating: InputMaybe<Scalars['float8']['input']>;
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  average_rating_same_professors: InputMaybe<Scalars['float8']['input']>;
  average_rating_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  average_workload: InputMaybe<Scalars['float8']['input']>;
  average_workload_n: InputMaybe<Scalars['Int']['input']>;
  average_workload_same_professors: InputMaybe<Scalars['float8']['input']>;
  average_workload_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  classnotes: InputMaybe<Scalars['String']['input']>;
  colsem: InputMaybe<Scalars['Boolean']['input']>;
  course_code: InputMaybe<Scalars['String']['input']>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  credits: InputMaybe<Scalars['float8']['input']>;
  crn: InputMaybe<Scalars['Int']['input']>;
  declined: InputMaybe<Scalars['Int']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  enrolled: InputMaybe<Scalars['Int']['input']>;
  extra_info: InputMaybe<Scalars['String']['input']>;
  final_exam: InputMaybe<Scalars['String']['input']>;
  flag_info: InputMaybe<Scalars['jsonb']['input']>;
  fysem: InputMaybe<Scalars['Boolean']['input']>;
  last_enrollment: InputMaybe<Scalars['Int']['input']>;
  last_enrollment_course_id: InputMaybe<Scalars['Int']['input']>;
  last_enrollment_same_professors: InputMaybe<Scalars['Boolean']['input']>;
  last_enrollment_season_code: InputMaybe<Scalars['String']['input']>;
  last_offered_course_id: InputMaybe<Scalars['Int']['input']>;
  listing_id: InputMaybe<Scalars['Int']['input']>;
  locations_summary: InputMaybe<Scalars['String']['input']>;
  no_response: InputMaybe<Scalars['Int']['input']>;
  number: InputMaybe<Scalars['String']['input']>;
  professor_ids: InputMaybe<Scalars['jsonb']['input']>;
  professor_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_names: InputMaybe<Scalars['jsonb']['input']>;
  regnotes: InputMaybe<Scalars['String']['input']>;
  requirements: InputMaybe<Scalars['String']['input']>;
  responses: InputMaybe<Scalars['Int']['input']>;
  rp_attr: InputMaybe<Scalars['String']['input']>;
  same_course_and_profs_id: InputMaybe<Scalars['Int']['input']>;
  same_course_id: InputMaybe<Scalars['Int']['input']>;
  school: InputMaybe<Scalars['String']['input']>;
  season_code: InputMaybe<Scalars['String']['input']>;
  section: InputMaybe<Scalars['String']['input']>;
  skills: InputMaybe<Scalars['jsonb']['input']>;
  subject: InputMaybe<Scalars['String']['input']>;
  syllabus_url: InputMaybe<Scalars['String']['input']>;
  sysem: InputMaybe<Scalars['Boolean']['input']>;
  times_by_day: InputMaybe<Scalars['json']['input']>;
  times_summary: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type ComputedListingInfoStddevFields = {
  __typename?: 'computed_listing_info_stddev_fields';
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  average_professor: Maybe<Scalars['Float']['output']>;
  average_rating: Maybe<Scalars['Float']['output']>;
  average_rating_n: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  average_workload: Maybe<Scalars['Float']['output']>;
  average_workload_n: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  credits: Maybe<Scalars['Float']['output']>;
  crn: Maybe<Scalars['Float']['output']>;
  declined: Maybe<Scalars['Float']['output']>;
  enrolled: Maybe<Scalars['Float']['output']>;
  last_enrollment: Maybe<Scalars['Float']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  listing_id: Maybe<Scalars['Float']['output']>;
  no_response: Maybe<Scalars['Float']['output']>;
  responses: Maybe<Scalars['Float']['output']>;
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "computed_listing_info" */
export type ComputedListingInfoStddevOrderBy = {
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type ComputedListingInfoStddevPopFields = {
  __typename?: 'computed_listing_info_stddev_pop_fields';
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  average_professor: Maybe<Scalars['Float']['output']>;
  average_rating: Maybe<Scalars['Float']['output']>;
  average_rating_n: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  average_workload: Maybe<Scalars['Float']['output']>;
  average_workload_n: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  credits: Maybe<Scalars['Float']['output']>;
  crn: Maybe<Scalars['Float']['output']>;
  declined: Maybe<Scalars['Float']['output']>;
  enrolled: Maybe<Scalars['Float']['output']>;
  last_enrollment: Maybe<Scalars['Float']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  listing_id: Maybe<Scalars['Float']['output']>;
  no_response: Maybe<Scalars['Float']['output']>;
  responses: Maybe<Scalars['Float']['output']>;
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "computed_listing_info" */
export type ComputedListingInfoStddevPopOrderBy = {
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type ComputedListingInfoStddevSampFields = {
  __typename?: 'computed_listing_info_stddev_samp_fields';
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  average_professor: Maybe<Scalars['Float']['output']>;
  average_rating: Maybe<Scalars['Float']['output']>;
  average_rating_n: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  average_workload: Maybe<Scalars['Float']['output']>;
  average_workload_n: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  credits: Maybe<Scalars['Float']['output']>;
  crn: Maybe<Scalars['Float']['output']>;
  declined: Maybe<Scalars['Float']['output']>;
  enrolled: Maybe<Scalars['Float']['output']>;
  last_enrollment: Maybe<Scalars['Float']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  listing_id: Maybe<Scalars['Float']['output']>;
  no_response: Maybe<Scalars['Float']['output']>;
  responses: Maybe<Scalars['Float']['output']>;
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "computed_listing_info" */
export type ComputedListingInfoStddevSampOrderBy = {
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "computed_listing_info" */
export type ComputedListingInfoStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ComputedListingInfoStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ComputedListingInfoStreamCursorValueInput = {
  all_course_codes: InputMaybe<Scalars['jsonb']['input']>;
  areas: InputMaybe<Scalars['jsonb']['input']>;
  average_gut_rating: InputMaybe<Scalars['float8']['input']>;
  average_professor: InputMaybe<Scalars['float8']['input']>;
  average_rating: InputMaybe<Scalars['float8']['input']>;
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  average_rating_same_professors: InputMaybe<Scalars['float8']['input']>;
  average_rating_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  average_workload: InputMaybe<Scalars['float8']['input']>;
  average_workload_n: InputMaybe<Scalars['Int']['input']>;
  average_workload_same_professors: InputMaybe<Scalars['float8']['input']>;
  average_workload_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  classnotes: InputMaybe<Scalars['String']['input']>;
  colsem: InputMaybe<Scalars['Boolean']['input']>;
  course_code: InputMaybe<Scalars['String']['input']>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  credits: InputMaybe<Scalars['float8']['input']>;
  crn: InputMaybe<Scalars['Int']['input']>;
  declined: InputMaybe<Scalars['Int']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  enrolled: InputMaybe<Scalars['Int']['input']>;
  extra_info: InputMaybe<Scalars['String']['input']>;
  final_exam: InputMaybe<Scalars['String']['input']>;
  flag_info: InputMaybe<Scalars['jsonb']['input']>;
  fysem: InputMaybe<Scalars['Boolean']['input']>;
  last_enrollment: InputMaybe<Scalars['Int']['input']>;
  last_enrollment_course_id: InputMaybe<Scalars['Int']['input']>;
  last_enrollment_same_professors: InputMaybe<Scalars['Boolean']['input']>;
  last_enrollment_season_code: InputMaybe<Scalars['String']['input']>;
  last_offered_course_id: InputMaybe<Scalars['Int']['input']>;
  listing_id: InputMaybe<Scalars['Int']['input']>;
  locations_summary: InputMaybe<Scalars['String']['input']>;
  no_response: InputMaybe<Scalars['Int']['input']>;
  number: InputMaybe<Scalars['String']['input']>;
  professor_ids: InputMaybe<Scalars['jsonb']['input']>;
  professor_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_names: InputMaybe<Scalars['jsonb']['input']>;
  regnotes: InputMaybe<Scalars['String']['input']>;
  requirements: InputMaybe<Scalars['String']['input']>;
  responses: InputMaybe<Scalars['Int']['input']>;
  rp_attr: InputMaybe<Scalars['String']['input']>;
  same_course_and_profs_id: InputMaybe<Scalars['Int']['input']>;
  same_course_id: InputMaybe<Scalars['Int']['input']>;
  school: InputMaybe<Scalars['String']['input']>;
  season_code: InputMaybe<Scalars['String']['input']>;
  section: InputMaybe<Scalars['String']['input']>;
  skills: InputMaybe<Scalars['jsonb']['input']>;
  subject: InputMaybe<Scalars['String']['input']>;
  syllabus_url: InputMaybe<Scalars['String']['input']>;
  sysem: InputMaybe<Scalars['Boolean']['input']>;
  times_by_day: InputMaybe<Scalars['json']['input']>;
  times_summary: InputMaybe<Scalars['String']['input']>;
  title: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type ComputedListingInfoSumFields = {
  __typename?: 'computed_listing_info_sum_fields';
  average_gut_rating: Maybe<Scalars['float8']['output']>;
  average_professor: Maybe<Scalars['float8']['output']>;
  average_rating: Maybe<Scalars['float8']['output']>;
  average_rating_n: Maybe<Scalars['Int']['output']>;
  average_rating_same_professors: Maybe<Scalars['float8']['output']>;
  average_rating_same_professors_n: Maybe<Scalars['Int']['output']>;
  average_workload: Maybe<Scalars['float8']['output']>;
  average_workload_n: Maybe<Scalars['Int']['output']>;
  average_workload_same_professors: Maybe<Scalars['float8']['output']>;
  average_workload_same_professors_n: Maybe<Scalars['Int']['output']>;
  course_id: Maybe<Scalars['Int']['output']>;
  credits: Maybe<Scalars['float8']['output']>;
  crn: Maybe<Scalars['Int']['output']>;
  declined: Maybe<Scalars['Int']['output']>;
  enrolled: Maybe<Scalars['Int']['output']>;
  last_enrollment: Maybe<Scalars['Int']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Int']['output']>;
  last_offered_course_id: Maybe<Scalars['Int']['output']>;
  listing_id: Maybe<Scalars['Int']['output']>;
  no_response: Maybe<Scalars['Int']['output']>;
  responses: Maybe<Scalars['Int']['output']>;
  same_course_and_profs_id: Maybe<Scalars['Int']['output']>;
  same_course_id: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "computed_listing_info" */
export type ComputedListingInfoSumOrderBy = {
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
};

/** update columns of table "computed_listing_info" */
export enum ComputedListingInfoUpdateColumn {
  /** column name */
  AllCourseCodes = 'all_course_codes',
  /** column name */
  Areas = 'areas',
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessor = 'average_professor',
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
  CourseCode = 'course_code',
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Credits = 'credits',
  /** column name */
  Crn = 'crn',
  /** column name */
  Declined = 'declined',
  /** column name */
  Description = 'description',
  /** column name */
  Enrolled = 'enrolled',
  /** column name */
  ExtraInfo = 'extra_info',
  /** column name */
  FinalExam = 'final_exam',
  /** column name */
  FlagInfo = 'flag_info',
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
  ListingId = 'listing_id',
  /** column name */
  LocationsSummary = 'locations_summary',
  /** column name */
  NoResponse = 'no_response',
  /** column name */
  Number = 'number',
  /** column name */
  ProfessorIds = 'professor_ids',
  /** column name */
  ProfessorInfo = 'professor_info',
  /** column name */
  ProfessorNames = 'professor_names',
  /** column name */
  Regnotes = 'regnotes',
  /** column name */
  Requirements = 'requirements',
  /** column name */
  Responses = 'responses',
  /** column name */
  RpAttr = 'rp_attr',
  /** column name */
  SameCourseAndProfsId = 'same_course_and_profs_id',
  /** column name */
  SameCourseId = 'same_course_id',
  /** column name */
  School = 'school',
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Section = 'section',
  /** column name */
  Skills = 'skills',
  /** column name */
  Subject = 'subject',
  /** column name */
  SyllabusUrl = 'syllabus_url',
  /** column name */
  Sysem = 'sysem',
  /** column name */
  TimesByDay = 'times_by_day',
  /** column name */
  TimesSummary = 'times_summary',
  /** column name */
  Title = 'title',
}

export type ComputedListingInfoUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append: InputMaybe<ComputedListingInfoAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path: InputMaybe<ComputedListingInfoDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem: InputMaybe<ComputedListingInfoDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key: InputMaybe<ComputedListingInfoDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<ComputedListingInfoIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend: InputMaybe<ComputedListingInfoPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<ComputedListingInfoSetInput>;
  /** filter the rows which have to be updated */
  where: ComputedListingInfoBoolExp;
};

/** aggregate var_pop on columns */
export type ComputedListingInfoVarPopFields = {
  __typename?: 'computed_listing_info_var_pop_fields';
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  average_professor: Maybe<Scalars['Float']['output']>;
  average_rating: Maybe<Scalars['Float']['output']>;
  average_rating_n: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  average_workload: Maybe<Scalars['Float']['output']>;
  average_workload_n: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  credits: Maybe<Scalars['Float']['output']>;
  crn: Maybe<Scalars['Float']['output']>;
  declined: Maybe<Scalars['Float']['output']>;
  enrolled: Maybe<Scalars['Float']['output']>;
  last_enrollment: Maybe<Scalars['Float']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  listing_id: Maybe<Scalars['Float']['output']>;
  no_response: Maybe<Scalars['Float']['output']>;
  responses: Maybe<Scalars['Float']['output']>;
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "computed_listing_info" */
export type ComputedListingInfoVarPopOrderBy = {
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type ComputedListingInfoVarSampFields = {
  __typename?: 'computed_listing_info_var_samp_fields';
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  average_professor: Maybe<Scalars['Float']['output']>;
  average_rating: Maybe<Scalars['Float']['output']>;
  average_rating_n: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  average_workload: Maybe<Scalars['Float']['output']>;
  average_workload_n: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  credits: Maybe<Scalars['Float']['output']>;
  crn: Maybe<Scalars['Float']['output']>;
  declined: Maybe<Scalars['Float']['output']>;
  enrolled: Maybe<Scalars['Float']['output']>;
  last_enrollment: Maybe<Scalars['Float']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  listing_id: Maybe<Scalars['Float']['output']>;
  no_response: Maybe<Scalars['Float']['output']>;
  responses: Maybe<Scalars['Float']['output']>;
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "computed_listing_info" */
export type ComputedListingInfoVarSampOrderBy = {
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type ComputedListingInfoVarianceFields = {
  __typename?: 'computed_listing_info_variance_fields';
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  average_professor: Maybe<Scalars['Float']['output']>;
  average_rating: Maybe<Scalars['Float']['output']>;
  average_rating_n: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  average_workload: Maybe<Scalars['Float']['output']>;
  average_workload_n: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  credits: Maybe<Scalars['Float']['output']>;
  crn: Maybe<Scalars['Float']['output']>;
  declined: Maybe<Scalars['Float']['output']>;
  enrolled: Maybe<Scalars['Float']['output']>;
  last_enrollment: Maybe<Scalars['Float']['output']>;
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  listing_id: Maybe<Scalars['Float']['output']>;
  no_response: Maybe<Scalars['Float']['output']>;
  responses: Maybe<Scalars['Float']['output']>;
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "computed_listing_info" */
export type ComputedListingInfoVarianceOrderBy = {
  average_gut_rating: InputMaybe<OrderBy>;
  average_professor: InputMaybe<OrderBy>;
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  average_rating_same_professors: InputMaybe<OrderBy>;
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  average_workload: InputMaybe<OrderBy>;
  average_workload_n: InputMaybe<OrderBy>;
  average_workload_same_professors: InputMaybe<OrderBy>;
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  credits: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  last_enrollment: InputMaybe<OrderBy>;
  last_enrollment_course_id: InputMaybe<OrderBy>;
  last_offered_course_id: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
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

/** aggregated selection of "course_flags" */
export type CourseFlagsAggregate = {
  __typename?: 'course_flags_aggregate';
  aggregate: Maybe<CourseFlagsAggregateFields>;
  nodes: Array<CourseFlags>;
};

export type CourseFlagsAggregateBoolExp = {
  count: InputMaybe<CourseFlagsAggregateBoolExpCount>;
};

export type CourseFlagsAggregateBoolExpCount = {
  arguments: InputMaybe<Array<CourseFlagsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CourseFlagsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "course_flags" */
export type CourseFlagsAggregateFields = {
  __typename?: 'course_flags_aggregate_fields';
  avg: Maybe<CourseFlagsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<CourseFlagsMaxFields>;
  min: Maybe<CourseFlagsMinFields>;
  stddev: Maybe<CourseFlagsStddevFields>;
  stddev_pop: Maybe<CourseFlagsStddevPopFields>;
  stddev_samp: Maybe<CourseFlagsStddevSampFields>;
  sum: Maybe<CourseFlagsSumFields>;
  var_pop: Maybe<CourseFlagsVarPopFields>;
  var_samp: Maybe<CourseFlagsVarSampFields>;
  variance: Maybe<CourseFlagsVarianceFields>;
};

/** aggregate fields of "course_flags" */
export type CourseFlagsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<CourseFlagsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
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

/** input type for inserting array relation for remote table "course_flags" */
export type CourseFlagsArrRelInsertInput = {
  data: Array<CourseFlagsInsertInput>;
  /** upsert condition */
  on_conflict: InputMaybe<CourseFlagsOnConflict>;
};

/** aggregate avg on columns */
export type CourseFlagsAvgFields = {
  __typename?: 'course_flags_avg_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  flag_id: Maybe<Scalars['Float']['output']>;
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

/** unique or primary key constraints on table "course_flags" */
export enum CourseFlagsConstraint {
  /** unique or primary key constraint on columns "course_id", "flag_id" */
  PkCourseFlagsStaged = 'pk_course_flags_staged',
}

/** input type for incrementing numeric columns in table "course_flags" */
export type CourseFlagsIncInput = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  flag_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "course_flags" */
export type CourseFlagsInsertInput = {
  course: InputMaybe<CoursesObjRelInsertInput>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  flag: InputMaybe<FlagsObjRelInsertInput>;
  flag_id: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type CourseFlagsMaxFields = {
  __typename?: 'course_flags_max_fields';
  course_id: Maybe<Scalars['Int']['output']>;
  flag_id: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "course_flags" */
export type CourseFlagsMaxOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type CourseFlagsMinFields = {
  __typename?: 'course_flags_min_fields';
  course_id: Maybe<Scalars['Int']['output']>;
  flag_id: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "course_flags" */
export type CourseFlagsMinOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "course_flags" */
export type CourseFlagsMutationResponse = {
  __typename?: 'course_flags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<CourseFlags>;
};

/** on_conflict condition type for table "course_flags" */
export type CourseFlagsOnConflict = {
  constraint: CourseFlagsConstraint;
  update_columns: Array<CourseFlagsUpdateColumn>;
  where: InputMaybe<CourseFlagsBoolExp>;
};

/** Ordering options when selecting data from "course_flags". */
export type CourseFlagsOrderBy = {
  course: InputMaybe<CoursesOrderBy>;
  course_id: InputMaybe<OrderBy>;
  flag: InputMaybe<FlagsOrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** primary key columns input for table: course_flags */
export type CourseFlagsPkColumnsInput = {
  course_id: Scalars['Int']['input'];
  flag_id: Scalars['Int']['input'];
};

/** select columns of table "course_flags" */
export enum CourseFlagsSelectColumn {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  FlagId = 'flag_id',
}

/** input type for updating data in table "course_flags" */
export type CourseFlagsSetInput = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  flag_id: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type CourseFlagsStddevFields = {
  __typename?: 'course_flags_stddev_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  flag_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "course_flags" */
export type CourseFlagsStddevOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type CourseFlagsStddevPopFields = {
  __typename?: 'course_flags_stddev_pop_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  flag_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "course_flags" */
export type CourseFlagsStddevPopOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type CourseFlagsStddevSampFields = {
  __typename?: 'course_flags_stddev_samp_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  flag_id: Maybe<Scalars['Float']['output']>;
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

/** aggregate sum on columns */
export type CourseFlagsSumFields = {
  __typename?: 'course_flags_sum_fields';
  course_id: Maybe<Scalars['Int']['output']>;
  flag_id: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "course_flags" */
export type CourseFlagsSumOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** update columns of table "course_flags" */
export enum CourseFlagsUpdateColumn {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  FlagId = 'flag_id',
}

export type CourseFlagsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<CourseFlagsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<CourseFlagsSetInput>;
  /** filter the rows which have to be updated */
  where: CourseFlagsBoolExp;
};

/** aggregate var_pop on columns */
export type CourseFlagsVarPopFields = {
  __typename?: 'course_flags_var_pop_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  flag_id: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "course_flags" */
export type CourseFlagsVarPopOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type CourseFlagsVarSampFields = {
  __typename?: 'course_flags_var_samp_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  flag_id: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "course_flags" */
export type CourseFlagsVarSampOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type CourseFlagsVarianceFields = {
  __typename?: 'course_flags_variance_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  flag_id: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "course_flags" */
export type CourseFlagsVarianceOrderBy = {
  course_id: InputMaybe<OrderBy>;
  flag_id: InputMaybe<OrderBy>;
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

/** aggregated selection of "course_professors" */
export type CourseProfessorsAggregate = {
  __typename?: 'course_professors_aggregate';
  aggregate: Maybe<CourseProfessorsAggregateFields>;
  nodes: Array<CourseProfessors>;
};

export type CourseProfessorsAggregateBoolExp = {
  count: InputMaybe<CourseProfessorsAggregateBoolExpCount>;
};

export type CourseProfessorsAggregateBoolExpCount = {
  arguments: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CourseProfessorsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "course_professors" */
export type CourseProfessorsAggregateFields = {
  __typename?: 'course_professors_aggregate_fields';
  avg: Maybe<CourseProfessorsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<CourseProfessorsMaxFields>;
  min: Maybe<CourseProfessorsMinFields>;
  stddev: Maybe<CourseProfessorsStddevFields>;
  stddev_pop: Maybe<CourseProfessorsStddevPopFields>;
  stddev_samp: Maybe<CourseProfessorsStddevSampFields>;
  sum: Maybe<CourseProfessorsSumFields>;
  var_pop: Maybe<CourseProfessorsVarPopFields>;
  var_samp: Maybe<CourseProfessorsVarSampFields>;
  variance: Maybe<CourseProfessorsVarianceFields>;
};

/** aggregate fields of "course_professors" */
export type CourseProfessorsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
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

/** input type for inserting array relation for remote table "course_professors" */
export type CourseProfessorsArrRelInsertInput = {
  data: Array<CourseProfessorsInsertInput>;
  /** upsert condition */
  on_conflict: InputMaybe<CourseProfessorsOnConflict>;
};

/** aggregate avg on columns */
export type CourseProfessorsAvgFields = {
  __typename?: 'course_professors_avg_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  professor_id: Maybe<Scalars['Float']['output']>;
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

/** unique or primary key constraints on table "course_professors" */
export enum CourseProfessorsConstraint {
  /** unique or primary key constraint on columns "course_id", "professor_id" */
  PkCourseProfessorsStaged = 'pk_course_professors_staged',
}

/** input type for incrementing numeric columns in table "course_professors" */
export type CourseProfessorsIncInput = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "course_professors" */
export type CourseProfessorsInsertInput = {
  course: InputMaybe<CoursesObjRelInsertInput>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  professor: InputMaybe<ProfessorsObjRelInsertInput>;
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type CourseProfessorsMaxFields = {
  __typename?: 'course_professors_max_fields';
  course_id: Maybe<Scalars['Int']['output']>;
  professor_id: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "course_professors" */
export type CourseProfessorsMaxOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type CourseProfessorsMinFields = {
  __typename?: 'course_professors_min_fields';
  course_id: Maybe<Scalars['Int']['output']>;
  professor_id: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "course_professors" */
export type CourseProfessorsMinOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "course_professors" */
export type CourseProfessorsMutationResponse = {
  __typename?: 'course_professors_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<CourseProfessors>;
};

/** on_conflict condition type for table "course_professors" */
export type CourseProfessorsOnConflict = {
  constraint: CourseProfessorsConstraint;
  update_columns: Array<CourseProfessorsUpdateColumn>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

/** Ordering options when selecting data from "course_professors". */
export type CourseProfessorsOrderBy = {
  course: InputMaybe<CoursesOrderBy>;
  course_id: InputMaybe<OrderBy>;
  professor: InputMaybe<ProfessorsOrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** primary key columns input for table: course_professors */
export type CourseProfessorsPkColumnsInput = {
  course_id: Scalars['Int']['input'];
  professor_id: Scalars['Int']['input'];
};

/** select columns of table "course_professors" */
export enum CourseProfessorsSelectColumn {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  ProfessorId = 'professor_id',
}

/** input type for updating data in table "course_professors" */
export type CourseProfessorsSetInput = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type CourseProfessorsStddevFields = {
  __typename?: 'course_professors_stddev_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  professor_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "course_professors" */
export type CourseProfessorsStddevOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type CourseProfessorsStddevPopFields = {
  __typename?: 'course_professors_stddev_pop_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  professor_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "course_professors" */
export type CourseProfessorsStddevPopOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type CourseProfessorsStddevSampFields = {
  __typename?: 'course_professors_stddev_samp_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  professor_id: Maybe<Scalars['Float']['output']>;
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

/** aggregate sum on columns */
export type CourseProfessorsSumFields = {
  __typename?: 'course_professors_sum_fields';
  course_id: Maybe<Scalars['Int']['output']>;
  professor_id: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "course_professors" */
export type CourseProfessorsSumOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** update columns of table "course_professors" */
export enum CourseProfessorsUpdateColumn {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  ProfessorId = 'professor_id',
}

export type CourseProfessorsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<CourseProfessorsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<CourseProfessorsSetInput>;
  /** filter the rows which have to be updated */
  where: CourseProfessorsBoolExp;
};

/** aggregate var_pop on columns */
export type CourseProfessorsVarPopFields = {
  __typename?: 'course_professors_var_pop_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  professor_id: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "course_professors" */
export type CourseProfessorsVarPopOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type CourseProfessorsVarSampFields = {
  __typename?: 'course_professors_var_samp_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  professor_id: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "course_professors" */
export type CourseProfessorsVarSampOrderBy = {
  course_id: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type CourseProfessorsVarianceFields = {
  __typename?: 'course_professors_variance_fields';
  course_id: Maybe<Scalars['Float']['output']>;
  professor_id: Maybe<Scalars['Float']['output']>;
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
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Int']['output']>;
  /** Additional class notes */
  classnotes: Maybe<Scalars['String']['output']>;
  /** True if the course is a college seminar. False otherwise. */
  colsem: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  computed_listing_infos: Array<ComputedListingInfo>;
  /** An aggregate relationship */
  computed_listing_infos_aggregate: ComputedListingInfoAggregate;
  /** An object relationship */
  course: Maybe<Courses>;
  /** An object relationship */
  courseByLastOfferedCourseId: Maybe<Courses>;
  /** An array relationship */
  course_flags: Array<CourseFlags>;
  /** An aggregate relationship */
  course_flags_aggregate: CourseFlagsAggregate;
  /** Link to the course homepage */
  course_home_url: Maybe<Scalars['String']['output']>;
  course_id: Scalars['Int']['output'];
  /** An array relationship */
  course_professors: Array<CourseProfessors>;
  /** An aggregate relationship */
  course_professors_aggregate: CourseProfessorsAggregate;
  /** An array relationship */
  courses: Array<Courses>;
  /** An array relationship */
  coursesByLastOfferedCourseId: Array<Courses>;
  /** An aggregate relationship */
  coursesByLastOfferedCourseId_aggregate: CoursesAggregate;
  /** An aggregate relationship */
  courses_aggregate: CoursesAggregate;
  /** Number of course credits */
  credits: Maybe<Scalars['float8']['output']>;
  /** Course description */
  description: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  evaluation_narratives: Array<EvaluationNarratives>;
  /** An aggregate relationship */
  evaluation_narratives_aggregate: EvaluationNarrativesAggregate;
  /** An array relationship */
  evaluation_ratings: Array<EvaluationRatings>;
  /** An aggregate relationship */
  evaluation_ratings_aggregate: EvaluationRatingsAggregate;
  /** An object relationship */
  evaluation_statistic: Maybe<EvaluationStatistics>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info: Scalars['ExtraInfo']['output'];
  /** Final exam information */
  final_exam: Maybe<Scalars['String']['output']>;
  /** True if the course is a first-year seminar. False otherwise. */
  fysem: Maybe<Scalars['Boolean']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Int']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Whether last enrollment offering
   *         is with same professor as current.
   */
  last_enrollment_same_professors: Maybe<Scalars['Boolean']['output']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Int']['output']>;
  /** An array relationship */
  listings: Array<Listings>;
  /** An aggregate relationship */
  listings_aggregate: ListingsAggregate;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary: Maybe<Scalars['String']['output']>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes: Maybe<Scalars['String']['output']>;
  /** Recommended requirements/prerequisites for the course */
  requirements: Maybe<Scalars['String']['output']>;
  /** Reading period notes */
  rp_attr: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Scalars['Int']['output'];
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Scalars['Int']['output'];
  /** An object relationship */
  season: Maybe<Seasons>;
  /** An object relationship */
  seasonBySeasonCode: Seasons;
  /** The season the course is being taught in */
  season_code: Scalars['Season']['output'];
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: Scalars['String']['output'];
  /**
   * Skills that the course fulfills (e.g. writing,
   *         quantitative reasoning, language levels)
   */
  skills: Scalars['StringArr']['output'];
  /** Link to the syllabus */
  syllabus_url: Maybe<Scalars['String']['output']>;
  /** True if the course is a sophomore seminar. False otherwise. */
  sysem: Maybe<Scalars['Boolean']['output']>;
  /**
   * Course meeting times by day, with days as keys and
   *         tuples of `(start_time, end_time, location, location_url)`
   */
  times_by_day: Scalars['TimesByDay']['output'];
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: Maybe<Scalars['String']['output']>;
  /** Complete course title */
  title: Scalars['String']['output'];
};

/** columns and relationships of "courses" */
export type CoursesAreasArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "courses" */
export type CoursesComputedListingInfosArgs = {
  distinct_on: InputMaybe<Array<ComputedListingInfoSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ComputedListingInfoOrderBy>>;
  where: InputMaybe<ComputedListingInfoBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesComputedListingInfosAggregateArgs = {
  distinct_on: InputMaybe<Array<ComputedListingInfoSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ComputedListingInfoOrderBy>>;
  where: InputMaybe<ComputedListingInfoBoolExp>;
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
export type CoursesCourseFlagsAggregateArgs = {
  distinct_on: InputMaybe<Array<CourseFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseFlagsOrderBy>>;
  where: InputMaybe<CourseFlagsBoolExp>;
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
export type CoursesCourseProfessorsAggregateArgs = {
  distinct_on: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseProfessorsOrderBy>>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesCoursesArgs = {
  distinct_on: InputMaybe<Array<CoursesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CoursesOrderBy>>;
  where: InputMaybe<CoursesBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesCoursesByLastOfferedCourseIdArgs = {
  distinct_on: InputMaybe<Array<CoursesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CoursesOrderBy>>;
  where: InputMaybe<CoursesBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesCoursesByLastOfferedCourseIdAggregateArgs = {
  distinct_on: InputMaybe<Array<CoursesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CoursesOrderBy>>;
  where: InputMaybe<CoursesBoolExp>;
};

/** columns and relationships of "courses" */
export type CoursesCoursesAggregateArgs = {
  distinct_on: InputMaybe<Array<CoursesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CoursesOrderBy>>;
  where: InputMaybe<CoursesBoolExp>;
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
export type CoursesEvaluationNarrativesAggregateArgs = {
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
export type CoursesEvaluationRatingsAggregateArgs = {
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
export type CoursesListingsAggregateArgs = {
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

/** columns and relationships of "courses" */
export type CoursesTimesByDayArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "courses" */
export type CoursesAggregate = {
  __typename?: 'courses_aggregate';
  aggregate: Maybe<CoursesAggregateFields>;
  nodes: Array<Courses>;
};

export type CoursesAggregateBoolExp = {
  avg: InputMaybe<CoursesAggregateBoolExpAvg>;
  bool_and: InputMaybe<CoursesAggregateBoolExpBoolAnd>;
  bool_or: InputMaybe<CoursesAggregateBoolExpBoolOr>;
  corr: InputMaybe<CoursesAggregateBoolExpCorr>;
  count: InputMaybe<CoursesAggregateBoolExpCount>;
  covar_samp: InputMaybe<CoursesAggregateBoolExpCovarSamp>;
  max: InputMaybe<CoursesAggregateBoolExpMax>;
  min: InputMaybe<CoursesAggregateBoolExpMin>;
  stddev_samp: InputMaybe<CoursesAggregateBoolExpStddevSamp>;
  sum: InputMaybe<CoursesAggregateBoolExpSum>;
  var_samp: InputMaybe<CoursesAggregateBoolExpVarSamp>;
};

export type CoursesAggregateBoolExpAvg = {
  arguments: CoursesSelectColumnCoursesAggregateBoolExpAvgArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type CoursesAggregateBoolExpBoolAnd = {
  arguments: CoursesSelectColumnCoursesAggregateBoolExpBoolAndArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type CoursesAggregateBoolExpBoolOr = {
  arguments: CoursesSelectColumnCoursesAggregateBoolExpBoolOrArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type CoursesAggregateBoolExpCorr = {
  arguments: CoursesAggregateBoolExpCorrArguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type CoursesAggregateBoolExpCorrArguments = {
  X: CoursesSelectColumnCoursesAggregateBoolExpCorrArgumentsColumns;
  Y: CoursesSelectColumnCoursesAggregateBoolExpCorrArgumentsColumns;
};

export type CoursesAggregateBoolExpCount = {
  arguments: InputMaybe<Array<CoursesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: IntComparisonExp;
};

export type CoursesAggregateBoolExpCovarSamp = {
  arguments: CoursesAggregateBoolExpCovarSampArguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type CoursesAggregateBoolExpCovarSampArguments = {
  X: CoursesSelectColumnCoursesAggregateBoolExpCovarSampArgumentsColumns;
  Y: CoursesSelectColumnCoursesAggregateBoolExpCovarSampArgumentsColumns;
};

export type CoursesAggregateBoolExpMax = {
  arguments: CoursesSelectColumnCoursesAggregateBoolExpMaxArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type CoursesAggregateBoolExpMin = {
  arguments: CoursesSelectColumnCoursesAggregateBoolExpMinArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type CoursesAggregateBoolExpStddevSamp = {
  arguments: CoursesSelectColumnCoursesAggregateBoolExpStddevSampArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type CoursesAggregateBoolExpSum = {
  arguments: CoursesSelectColumnCoursesAggregateBoolExpSumArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type CoursesAggregateBoolExpVarSamp = {
  arguments: CoursesSelectColumnCoursesAggregateBoolExpVarSampArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<CoursesBoolExp>;
  predicate: Float8ComparisonExp;
};

/** aggregate fields of "courses" */
export type CoursesAggregateFields = {
  __typename?: 'courses_aggregate_fields';
  avg: Maybe<CoursesAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<CoursesMaxFields>;
  min: Maybe<CoursesMinFields>;
  stddev: Maybe<CoursesStddevFields>;
  stddev_pop: Maybe<CoursesStddevPopFields>;
  stddev_samp: Maybe<CoursesStddevSampFields>;
  sum: Maybe<CoursesSumFields>;
  var_pop: Maybe<CoursesVarPopFields>;
  var_samp: Maybe<CoursesVarSampFields>;
  variance: Maybe<CoursesVarianceFields>;
};

/** aggregate fields of "courses" */
export type CoursesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<CoursesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
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

/** input type for inserting array relation for remote table "courses" */
export type CoursesArrRelInsertInput = {
  data: Array<CoursesInsertInput>;
  /** upsert condition */
  on_conflict: InputMaybe<CoursesOnConflict>;
};

/** aggregate avg on columns */
export type CoursesAvgFields = {
  __typename?: 'courses_avg_fields';
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of course credits */
  credits: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Float']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "courses" */
export type CoursesAvgOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "courses". All fields are combined with a logical 'AND'. */
export type CoursesBoolExp = {
  _and: InputMaybe<Array<CoursesBoolExp>>;
  _not: InputMaybe<CoursesBoolExp>;
  _or: InputMaybe<Array<CoursesBoolExp>>;
  areas: InputMaybe<JsonComparisonExp>;
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
  computed_listing_infos: InputMaybe<ComputedListingInfoBoolExp>;
  computed_listing_infos_aggregate: InputMaybe<ComputedListingInfoAggregateBoolExp>;
  course: InputMaybe<CoursesBoolExp>;
  courseByLastOfferedCourseId: InputMaybe<CoursesBoolExp>;
  course_flags: InputMaybe<CourseFlagsBoolExp>;
  course_flags_aggregate: InputMaybe<CourseFlagsAggregateBoolExp>;
  course_home_url: InputMaybe<StringComparisonExp>;
  course_id: InputMaybe<IntComparisonExp>;
  course_professors: InputMaybe<CourseProfessorsBoolExp>;
  course_professors_aggregate: InputMaybe<CourseProfessorsAggregateBoolExp>;
  courses: InputMaybe<CoursesBoolExp>;
  coursesByLastOfferedCourseId: InputMaybe<CoursesBoolExp>;
  coursesByLastOfferedCourseId_aggregate: InputMaybe<CoursesAggregateBoolExp>;
  courses_aggregate: InputMaybe<CoursesAggregateBoolExp>;
  credits: InputMaybe<Float8ComparisonExp>;
  description: InputMaybe<StringComparisonExp>;
  evaluation_narratives: InputMaybe<EvaluationNarrativesBoolExp>;
  evaluation_narratives_aggregate: InputMaybe<EvaluationNarrativesAggregateBoolExp>;
  evaluation_ratings: InputMaybe<EvaluationRatingsBoolExp>;
  evaluation_ratings_aggregate: InputMaybe<EvaluationRatingsAggregateBoolExp>;
  evaluation_statistic: InputMaybe<EvaluationStatisticsBoolExp>;
  extra_info: InputMaybe<StringComparisonExp>;
  final_exam: InputMaybe<StringComparisonExp>;
  fysem: InputMaybe<BooleanComparisonExp>;
  last_enrollment: InputMaybe<IntComparisonExp>;
  last_enrollment_course_id: InputMaybe<IntComparisonExp>;
  last_enrollment_same_professors: InputMaybe<BooleanComparisonExp>;
  last_enrollment_season_code: InputMaybe<StringComparisonExp>;
  last_offered_course_id: InputMaybe<IntComparisonExp>;
  listings: InputMaybe<ListingsBoolExp>;
  listings_aggregate: InputMaybe<ListingsAggregateBoolExp>;
  locations_summary: InputMaybe<StringComparisonExp>;
  regnotes: InputMaybe<StringComparisonExp>;
  requirements: InputMaybe<StringComparisonExp>;
  rp_attr: InputMaybe<StringComparisonExp>;
  same_course_and_profs_id: InputMaybe<IntComparisonExp>;
  same_course_id: InputMaybe<IntComparisonExp>;
  season: InputMaybe<SeasonsBoolExp>;
  seasonBySeasonCode: InputMaybe<SeasonsBoolExp>;
  season_code: InputMaybe<StringComparisonExp>;
  section: InputMaybe<StringComparisonExp>;
  skills: InputMaybe<JsonComparisonExp>;
  syllabus_url: InputMaybe<StringComparisonExp>;
  sysem: InputMaybe<BooleanComparisonExp>;
  times_by_day: InputMaybe<JsonComparisonExp>;
  times_summary: InputMaybe<StringComparisonExp>;
  title: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "courses" */
export enum CoursesConstraint {
  /** unique or primary key constraint on columns "course_id" */
  PkCoursesStaged = 'pk_courses_staged',
}

/** input type for incrementing numeric columns in table "courses" */
export type CoursesIncInput = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** Number of course credits */
  credits: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Scalars['Int']['input']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "courses" */
export type CoursesInsertInput = {
  /** Course areas (humanities, social sciences, sciences) */
  areas: InputMaybe<Scalars['json']['input']>;
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  /** Additional class notes */
  classnotes: InputMaybe<Scalars['String']['input']>;
  /** True if the course is a college seminar. False otherwise. */
  colsem: InputMaybe<Scalars['Boolean']['input']>;
  computed_listing_infos: InputMaybe<ComputedListingInfoArrRelInsertInput>;
  course: InputMaybe<CoursesObjRelInsertInput>;
  courseByLastOfferedCourseId: InputMaybe<CoursesObjRelInsertInput>;
  course_flags: InputMaybe<CourseFlagsArrRelInsertInput>;
  /** Link to the course homepage */
  course_home_url: InputMaybe<Scalars['String']['input']>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  course_professors: InputMaybe<CourseProfessorsArrRelInsertInput>;
  courses: InputMaybe<CoursesArrRelInsertInput>;
  coursesByLastOfferedCourseId: InputMaybe<CoursesArrRelInsertInput>;
  /** Number of course credits */
  credits: InputMaybe<Scalars['float8']['input']>;
  /** Course description */
  description: InputMaybe<Scalars['String']['input']>;
  evaluation_narratives: InputMaybe<EvaluationNarrativesArrRelInsertInput>;
  evaluation_ratings: InputMaybe<EvaluationRatingsArrRelInsertInput>;
  evaluation_statistic: InputMaybe<EvaluationStatisticsObjRelInsertInput>;
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
  /**
   * [computed] Whether last enrollment offering
   *         is with same professor as current.
   */
  last_enrollment_same_professors: InputMaybe<Scalars['Boolean']['input']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Scalars['Int']['input']>;
  listings: InputMaybe<ListingsArrRelInsertInput>;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary: InputMaybe<Scalars['String']['input']>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes: InputMaybe<Scalars['String']['input']>;
  /** Recommended requirements/prerequisites for the course */
  requirements: InputMaybe<Scalars['String']['input']>;
  /** Reading period notes */
  rp_attr: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Scalars['Int']['input']>;
  season: InputMaybe<SeasonsObjRelInsertInput>;
  seasonBySeasonCode: InputMaybe<SeasonsObjRelInsertInput>;
  /** The season the course is being taught in */
  season_code: InputMaybe<Scalars['String']['input']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: InputMaybe<Scalars['String']['input']>;
  /**
   * Skills that the course fulfills (e.g. writing,
   *         quantitative reasoning, language levels)
   */
  skills: InputMaybe<Scalars['json']['input']>;
  /** Link to the syllabus */
  syllabus_url: InputMaybe<Scalars['String']['input']>;
  /** True if the course is a sophomore seminar. False otherwise. */
  sysem: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Course meeting times by day, with days as keys and
   *         tuples of `(start_time, end_time, location, location_url)`
   */
  times_by_day: InputMaybe<Scalars['json']['input']>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: InputMaybe<Scalars['String']['input']>;
  /** Complete course title */
  title: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type CoursesMaxFields = {
  __typename?: 'courses_max_fields';
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Int']['output']>;
  /** Additional class notes */
  classnotes: Maybe<Scalars['String']['output']>;
  /** Link to the course homepage */
  course_home_url: Maybe<Scalars['String']['output']>;
  course_id: Maybe<Scalars['Int']['output']>;
  /** Number of course credits */
  credits: Maybe<Scalars['float8']['output']>;
  /** Course description */
  description: Maybe<Scalars['String']['output']>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info: Maybe<Scalars['String']['output']>;
  /** Final exam information */
  final_exam: Maybe<Scalars['String']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Int']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Int']['output']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Int']['output']>;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary: Maybe<Scalars['String']['output']>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes: Maybe<Scalars['String']['output']>;
  /** Recommended requirements/prerequisites for the course */
  requirements: Maybe<Scalars['String']['output']>;
  /** Reading period notes */
  rp_attr: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Maybe<Scalars['Int']['output']>;
  /** The season the course is being taught in */
  season_code: Maybe<Scalars['String']['output']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: Maybe<Scalars['String']['output']>;
  /** Link to the syllabus */
  syllabus_url: Maybe<Scalars['String']['output']>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: Maybe<Scalars['String']['output']>;
  /** Complete course title */
  title: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "courses" */
export type CoursesMaxOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
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
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<OrderBy>;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary: InputMaybe<OrderBy>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes: InputMaybe<OrderBy>;
  /** Recommended requirements/prerequisites for the course */
  requirements: InputMaybe<OrderBy>;
  /** Reading period notes */
  rp_attr: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<OrderBy>;
  /** The season the course is being taught in */
  season_code: InputMaybe<OrderBy>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: InputMaybe<OrderBy>;
  /** Link to the syllabus */
  syllabus_url: InputMaybe<OrderBy>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: InputMaybe<OrderBy>;
  /** Complete course title */
  title: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type CoursesMinFields = {
  __typename?: 'courses_min_fields';
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Int']['output']>;
  /** Additional class notes */
  classnotes: Maybe<Scalars['String']['output']>;
  /** Link to the course homepage */
  course_home_url: Maybe<Scalars['String']['output']>;
  course_id: Maybe<Scalars['Int']['output']>;
  /** Number of course credits */
  credits: Maybe<Scalars['float8']['output']>;
  /** Course description */
  description: Maybe<Scalars['String']['output']>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info: Maybe<Scalars['String']['output']>;
  /** Final exam information */
  final_exam: Maybe<Scalars['String']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Int']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Int']['output']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Int']['output']>;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary: Maybe<Scalars['String']['output']>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes: Maybe<Scalars['String']['output']>;
  /** Recommended requirements/prerequisites for the course */
  requirements: Maybe<Scalars['String']['output']>;
  /** Reading period notes */
  rp_attr: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Maybe<Scalars['Int']['output']>;
  /** The season the course is being taught in */
  season_code: Maybe<Scalars['String']['output']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: Maybe<Scalars['String']['output']>;
  /** Link to the syllabus */
  syllabus_url: Maybe<Scalars['String']['output']>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: Maybe<Scalars['String']['output']>;
  /** Complete course title */
  title: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "courses" */
export type CoursesMinOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
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
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<OrderBy>;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary: InputMaybe<OrderBy>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes: InputMaybe<OrderBy>;
  /** Recommended requirements/prerequisites for the course */
  requirements: InputMaybe<OrderBy>;
  /** Reading period notes */
  rp_attr: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<OrderBy>;
  /** The season the course is being taught in */
  season_code: InputMaybe<OrderBy>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: InputMaybe<OrderBy>;
  /** Link to the syllabus */
  syllabus_url: InputMaybe<OrderBy>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: InputMaybe<OrderBy>;
  /** Complete course title */
  title: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "courses" */
export type CoursesMutationResponse = {
  __typename?: 'courses_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Courses>;
};

/** input type for inserting object relation for remote table "courses" */
export type CoursesObjRelInsertInput = {
  data: CoursesInsertInput;
  /** upsert condition */
  on_conflict: InputMaybe<CoursesOnConflict>;
};

/** on_conflict condition type for table "courses" */
export type CoursesOnConflict = {
  constraint: CoursesConstraint;
  update_columns: Array<CoursesUpdateColumn>;
  where: InputMaybe<CoursesBoolExp>;
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
  computed_listing_infos_aggregate: InputMaybe<ComputedListingInfoAggregateOrderBy>;
  course: InputMaybe<CoursesOrderBy>;
  courseByLastOfferedCourseId: InputMaybe<CoursesOrderBy>;
  course_flags_aggregate: InputMaybe<CourseFlagsAggregateOrderBy>;
  course_home_url: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  course_professors_aggregate: InputMaybe<CourseProfessorsAggregateOrderBy>;
  coursesByLastOfferedCourseId_aggregate: InputMaybe<CoursesAggregateOrderBy>;
  courses_aggregate: InputMaybe<CoursesAggregateOrderBy>;
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
  listings_aggregate: InputMaybe<ListingsAggregateOrderBy>;
  locations_summary: InputMaybe<OrderBy>;
  regnotes: InputMaybe<OrderBy>;
  requirements: InputMaybe<OrderBy>;
  rp_attr: InputMaybe<OrderBy>;
  same_course_and_profs_id: InputMaybe<OrderBy>;
  same_course_id: InputMaybe<OrderBy>;
  season: InputMaybe<SeasonsOrderBy>;
  seasonBySeasonCode: InputMaybe<SeasonsOrderBy>;
  season_code: InputMaybe<OrderBy>;
  section: InputMaybe<OrderBy>;
  skills: InputMaybe<OrderBy>;
  syllabus_url: InputMaybe<OrderBy>;
  sysem: InputMaybe<OrderBy>;
  times_by_day: InputMaybe<OrderBy>;
  times_summary: InputMaybe<OrderBy>;
  title: InputMaybe<OrderBy>;
};

/** primary key columns input for table: courses */
export type CoursesPkColumnsInput = {
  course_id: Scalars['Int']['input'];
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
  LocationsSummary = 'locations_summary',
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
  TimesByDay = 'times_by_day',
  /** column name */
  TimesSummary = 'times_summary',
  /** column name */
  Title = 'title',
}

/** select "courses_aggregate_bool_exp_avg_arguments_columns" columns of table "courses" */
export enum CoursesSelectColumnCoursesAggregateBoolExpAvgArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessorRating = 'average_professor_rating',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "courses_aggregate_bool_exp_bool_and_arguments_columns" columns of table "courses" */
export enum CoursesSelectColumnCoursesAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  Colsem = 'colsem',
  /** column name */
  Fysem = 'fysem',
  /** column name */
  LastEnrollmentSameProfessors = 'last_enrollment_same_professors',
  /** column name */
  Sysem = 'sysem',
}

/** select "courses_aggregate_bool_exp_bool_or_arguments_columns" columns of table "courses" */
export enum CoursesSelectColumnCoursesAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  Colsem = 'colsem',
  /** column name */
  Fysem = 'fysem',
  /** column name */
  LastEnrollmentSameProfessors = 'last_enrollment_same_professors',
  /** column name */
  Sysem = 'sysem',
}

/** select "courses_aggregate_bool_exp_corr_arguments_columns" columns of table "courses" */
export enum CoursesSelectColumnCoursesAggregateBoolExpCorrArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessorRating = 'average_professor_rating',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "courses_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "courses" */
export enum CoursesSelectColumnCoursesAggregateBoolExpCovarSampArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessorRating = 'average_professor_rating',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "courses_aggregate_bool_exp_max_arguments_columns" columns of table "courses" */
export enum CoursesSelectColumnCoursesAggregateBoolExpMaxArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessorRating = 'average_professor_rating',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "courses_aggregate_bool_exp_min_arguments_columns" columns of table "courses" */
export enum CoursesSelectColumnCoursesAggregateBoolExpMinArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessorRating = 'average_professor_rating',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "courses_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "courses" */
export enum CoursesSelectColumnCoursesAggregateBoolExpStddevSampArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessorRating = 'average_professor_rating',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "courses_aggregate_bool_exp_sum_arguments_columns" columns of table "courses" */
export enum CoursesSelectColumnCoursesAggregateBoolExpSumArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessorRating = 'average_professor_rating',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** select "courses_aggregate_bool_exp_var_samp_arguments_columns" columns of table "courses" */
export enum CoursesSelectColumnCoursesAggregateBoolExpVarSampArgumentsColumns {
  /** column name */
  AverageGutRating = 'average_gut_rating',
  /** column name */
  AverageProfessorRating = 'average_professor_rating',
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingSameProfessors = 'average_rating_same_professors',
  /** column name */
  AverageWorkload = 'average_workload',
  /** column name */
  AverageWorkloadSameProfessors = 'average_workload_same_professors',
  /** column name */
  Credits = 'credits',
}

/** input type for updating data in table "courses" */
export type CoursesSetInput = {
  /** Course areas (humanities, social sciences, sciences) */
  areas: InputMaybe<Scalars['json']['input']>;
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
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
  /**
   * [computed] Whether last enrollment offering
   *         is with same professor as current.
   */
  last_enrollment_same_professors: InputMaybe<Scalars['Boolean']['input']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Scalars['Int']['input']>;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary: InputMaybe<Scalars['String']['input']>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes: InputMaybe<Scalars['String']['input']>;
  /** Recommended requirements/prerequisites for the course */
  requirements: InputMaybe<Scalars['String']['input']>;
  /** Reading period notes */
  rp_attr: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Scalars['Int']['input']>;
  /** The season the course is being taught in */
  season_code: InputMaybe<Scalars['String']['input']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: InputMaybe<Scalars['String']['input']>;
  /**
   * Skills that the course fulfills (e.g. writing,
   *         quantitative reasoning, language levels)
   */
  skills: InputMaybe<Scalars['json']['input']>;
  /** Link to the syllabus */
  syllabus_url: InputMaybe<Scalars['String']['input']>;
  /** True if the course is a sophomore seminar. False otherwise. */
  sysem: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Course meeting times by day, with days as keys and
   *         tuples of `(start_time, end_time, location, location_url)`
   */
  times_by_day: InputMaybe<Scalars['json']['input']>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: InputMaybe<Scalars['String']['input']>;
  /** Complete course title */
  title: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type CoursesStddevFields = {
  __typename?: 'courses_stddev_fields';
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of course credits */
  credits: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Float']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "courses" */
export type CoursesStddevOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type CoursesStddevPopFields = {
  __typename?: 'courses_stddev_pop_fields';
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of course credits */
  credits: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Float']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "courses" */
export type CoursesStddevPopOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type CoursesStddevSampFields = {
  __typename?: 'courses_stddev_samp_fields';
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of course credits */
  credits: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Float']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "courses" */
export type CoursesStddevSampOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
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
  areas: InputMaybe<Scalars['json']['input']>;
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
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
  /**
   * [computed] Whether last enrollment offering
   *         is with same professor as current.
   */
  last_enrollment_same_professors: InputMaybe<Scalars['Boolean']['input']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Scalars['Int']['input']>;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary: InputMaybe<Scalars['String']['input']>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes: InputMaybe<Scalars['String']['input']>;
  /** Recommended requirements/prerequisites for the course */
  requirements: InputMaybe<Scalars['String']['input']>;
  /** Reading period notes */
  rp_attr: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Scalars['Int']['input']>;
  /** The season the course is being taught in */
  season_code: InputMaybe<Scalars['String']['input']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: InputMaybe<Scalars['String']['input']>;
  /**
   * Skills that the course fulfills (e.g. writing,
   *         quantitative reasoning, language levels)
   */
  skills: InputMaybe<Scalars['json']['input']>;
  /** Link to the syllabus */
  syllabus_url: InputMaybe<Scalars['String']['input']>;
  /** True if the course is a sophomore seminar. False otherwise. */
  sysem: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Course meeting times by day, with days as keys and
   *         tuples of `(start_time, end_time, location, location_url)`
   */
  times_by_day: InputMaybe<Scalars['json']['input']>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: InputMaybe<Scalars['String']['input']>;
  /** Complete course title */
  title: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type CoursesSumFields = {
  __typename?: 'courses_sum_fields';
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Int']['output']>;
  course_id: Maybe<Scalars['Int']['output']>;
  /** Number of course credits */
  credits: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Int']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "courses" */
export type CoursesSumOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<OrderBy>;
};

/** update columns of table "courses" */
export enum CoursesUpdateColumn {
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
  LocationsSummary = 'locations_summary',
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
  TimesByDay = 'times_by_day',
  /** column name */
  TimesSummary = 'times_summary',
  /** column name */
  Title = 'title',
}

export type CoursesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<CoursesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<CoursesSetInput>;
  /** filter the rows which have to be updated */
  where: CoursesBoolExp;
};

/** aggregate var_pop on columns */
export type CoursesVarPopFields = {
  __typename?: 'courses_var_pop_fields';
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of course credits */
  credits: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Float']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "courses" */
export type CoursesVarPopOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type CoursesVarSampFields = {
  __typename?: 'courses_var_samp_fields';
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of course credits */
  credits: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Float']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "courses" */
export type CoursesVarSampOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type CoursesVarianceFields = {
  __typename?: 'courses_variance_fields';
  /** [computed] average_rating - average_workload */
  average_gut_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: Maybe<Scalars['Float']['output']>;
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of course credits */
  credits: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: Maybe<Scalars['Float']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: Maybe<Scalars['Float']['output']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "courses" */
export type CoursesVarianceOrderBy = {
  /** [computed] average_rating - average_workload */
  average_gut_rating: InputMaybe<OrderBy>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<OrderBy>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<OrderBy>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<OrderBy>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  /** Number of course credits */
  credits: InputMaybe<OrderBy>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<OrderBy>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<OrderBy>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
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
};

/** aggregated selection of "evaluation_narratives" */
export type EvaluationNarrativesAggregate = {
  __typename?: 'evaluation_narratives_aggregate';
  aggregate: Maybe<EvaluationNarrativesAggregateFields>;
  nodes: Array<EvaluationNarratives>;
};

export type EvaluationNarrativesAggregateBoolExp = {
  avg: InputMaybe<EvaluationNarrativesAggregateBoolExpAvg>;
  corr: InputMaybe<EvaluationNarrativesAggregateBoolExpCorr>;
  count: InputMaybe<EvaluationNarrativesAggregateBoolExpCount>;
  covar_samp: InputMaybe<EvaluationNarrativesAggregateBoolExpCovarSamp>;
  max: InputMaybe<EvaluationNarrativesAggregateBoolExpMax>;
  min: InputMaybe<EvaluationNarrativesAggregateBoolExpMin>;
  stddev_samp: InputMaybe<EvaluationNarrativesAggregateBoolExpStddevSamp>;
  sum: InputMaybe<EvaluationNarrativesAggregateBoolExpSum>;
  var_samp: InputMaybe<EvaluationNarrativesAggregateBoolExpVarSamp>;
};

export type EvaluationNarrativesAggregateBoolExpAvg = {
  arguments: EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpAvgArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<EvaluationNarrativesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type EvaluationNarrativesAggregateBoolExpCorr = {
  arguments: EvaluationNarrativesAggregateBoolExpCorrArguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<EvaluationNarrativesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type EvaluationNarrativesAggregateBoolExpCorrArguments = {
  X: EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpCorrArgumentsColumns;
  Y: EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpCorrArgumentsColumns;
};

export type EvaluationNarrativesAggregateBoolExpCount = {
  arguments: InputMaybe<Array<EvaluationNarrativesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<EvaluationNarrativesBoolExp>;
  predicate: IntComparisonExp;
};

export type EvaluationNarrativesAggregateBoolExpCovarSamp = {
  arguments: EvaluationNarrativesAggregateBoolExpCovarSampArguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<EvaluationNarrativesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type EvaluationNarrativesAggregateBoolExpCovarSampArguments = {
  X: EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpCovarSampArgumentsColumns;
  Y: EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpCovarSampArgumentsColumns;
};

export type EvaluationNarrativesAggregateBoolExpMax = {
  arguments: EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpMaxArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<EvaluationNarrativesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type EvaluationNarrativesAggregateBoolExpMin = {
  arguments: EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpMinArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<EvaluationNarrativesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type EvaluationNarrativesAggregateBoolExpStddevSamp = {
  arguments: EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpStddevSampArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<EvaluationNarrativesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type EvaluationNarrativesAggregateBoolExpSum = {
  arguments: EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpSumArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<EvaluationNarrativesBoolExp>;
  predicate: Float8ComparisonExp;
};

export type EvaluationNarrativesAggregateBoolExpVarSamp = {
  arguments: EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpVarSampArgumentsColumns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<EvaluationNarrativesBoolExp>;
  predicate: Float8ComparisonExp;
};

/** aggregate fields of "evaluation_narratives" */
export type EvaluationNarrativesAggregateFields = {
  __typename?: 'evaluation_narratives_aggregate_fields';
  avg: Maybe<EvaluationNarrativesAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<EvaluationNarrativesMaxFields>;
  min: Maybe<EvaluationNarrativesMinFields>;
  stddev: Maybe<EvaluationNarrativesStddevFields>;
  stddev_pop: Maybe<EvaluationNarrativesStddevPopFields>;
  stddev_samp: Maybe<EvaluationNarrativesStddevSampFields>;
  sum: Maybe<EvaluationNarrativesSumFields>;
  var_pop: Maybe<EvaluationNarrativesVarPopFields>;
  var_samp: Maybe<EvaluationNarrativesVarSampFields>;
  variance: Maybe<EvaluationNarrativesVarianceFields>;
};

/** aggregate fields of "evaluation_narratives" */
export type EvaluationNarrativesAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<EvaluationNarrativesSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
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

/** input type for inserting array relation for remote table "evaluation_narratives" */
export type EvaluationNarrativesArrRelInsertInput = {
  data: Array<EvaluationNarrativesInsertInput>;
  /** upsert condition */
  on_conflict: InputMaybe<EvaluationNarrativesOnConflict>;
};

/** aggregate avg on columns */
export type EvaluationNarrativesAvgFields = {
  __typename?: 'evaluation_narratives_avg_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
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
};

/** unique or primary key constraints on table "evaluation_narratives" */
export enum EvaluationNarrativesConstraint {
  /** unique or primary key constraint on columns "id" */
  PkEvaluationNarrativesStaged = 'pk_evaluation_narratives_staged',
}

/** input type for incrementing numeric columns in table "evaluation_narratives" */
export type EvaluationNarrativesIncInput = {
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
};

/** input type for inserting data into table "evaluation_narratives" */
export type EvaluationNarrativesInsertInput = {
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
  course: InputMaybe<CoursesObjRelInsertInput>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  evaluation_question: InputMaybe<EvaluationQuestionsObjRelInsertInput>;
  id: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this narrative comment responds */
  question_code: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type EvaluationNarrativesMaxFields = {
  __typename?: 'evaluation_narratives_max_fields';
  /** Response to the question */
  comment: Maybe<Scalars['String']['output']>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Maybe<Scalars['float8']['output']>;
  /** The course to which this narrative comment applies */
  course_id: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['Int']['output']>;
  /** Question to which this narrative comment responds */
  question_code: Maybe<Scalars['String']['output']>;
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
};

/** aggregate min on columns */
export type EvaluationNarrativesMinFields = {
  __typename?: 'evaluation_narratives_min_fields';
  /** Response to the question */
  comment: Maybe<Scalars['String']['output']>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Maybe<Scalars['float8']['output']>;
  /** The course to which this narrative comment applies */
  course_id: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['Int']['output']>;
  /** Question to which this narrative comment responds */
  question_code: Maybe<Scalars['String']['output']>;
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
};

/** response of any mutation on the table "evaluation_narratives" */
export type EvaluationNarrativesMutationResponse = {
  __typename?: 'evaluation_narratives_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<EvaluationNarratives>;
};

/** on_conflict condition type for table "evaluation_narratives" */
export type EvaluationNarrativesOnConflict = {
  constraint: EvaluationNarrativesConstraint;
  update_columns: Array<EvaluationNarrativesUpdateColumn>;
  where: InputMaybe<EvaluationNarrativesBoolExp>;
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
};

/** primary key columns input for table: evaluation_narratives */
export type EvaluationNarrativesPkColumnsInput = {
  id: Scalars['Int']['input'];
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
}

/** select "evaluation_narratives_aggregate_bool_exp_avg_arguments_columns" columns of table "evaluation_narratives" */
export enum EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpAvgArgumentsColumns {
  /** column name */
  CommentCompound = 'comment_compound',
  /** column name */
  CommentNeg = 'comment_neg',
  /** column name */
  CommentNeu = 'comment_neu',
  /** column name */
  CommentPos = 'comment_pos',
}

/** select "evaluation_narratives_aggregate_bool_exp_corr_arguments_columns" columns of table "evaluation_narratives" */
export enum EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpCorrArgumentsColumns {
  /** column name */
  CommentCompound = 'comment_compound',
  /** column name */
  CommentNeg = 'comment_neg',
  /** column name */
  CommentNeu = 'comment_neu',
  /** column name */
  CommentPos = 'comment_pos',
}

/** select "evaluation_narratives_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "evaluation_narratives" */
export enum EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpCovarSampArgumentsColumns {
  /** column name */
  CommentCompound = 'comment_compound',
  /** column name */
  CommentNeg = 'comment_neg',
  /** column name */
  CommentNeu = 'comment_neu',
  /** column name */
  CommentPos = 'comment_pos',
}

/** select "evaluation_narratives_aggregate_bool_exp_max_arguments_columns" columns of table "evaluation_narratives" */
export enum EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpMaxArgumentsColumns {
  /** column name */
  CommentCompound = 'comment_compound',
  /** column name */
  CommentNeg = 'comment_neg',
  /** column name */
  CommentNeu = 'comment_neu',
  /** column name */
  CommentPos = 'comment_pos',
}

/** select "evaluation_narratives_aggregate_bool_exp_min_arguments_columns" columns of table "evaluation_narratives" */
export enum EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpMinArgumentsColumns {
  /** column name */
  CommentCompound = 'comment_compound',
  /** column name */
  CommentNeg = 'comment_neg',
  /** column name */
  CommentNeu = 'comment_neu',
  /** column name */
  CommentPos = 'comment_pos',
}

/** select "evaluation_narratives_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "evaluation_narratives" */
export enum EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpStddevSampArgumentsColumns {
  /** column name */
  CommentCompound = 'comment_compound',
  /** column name */
  CommentNeg = 'comment_neg',
  /** column name */
  CommentNeu = 'comment_neu',
  /** column name */
  CommentPos = 'comment_pos',
}

/** select "evaluation_narratives_aggregate_bool_exp_sum_arguments_columns" columns of table "evaluation_narratives" */
export enum EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpSumArgumentsColumns {
  /** column name */
  CommentCompound = 'comment_compound',
  /** column name */
  CommentNeg = 'comment_neg',
  /** column name */
  CommentNeu = 'comment_neu',
  /** column name */
  CommentPos = 'comment_pos',
}

/** select "evaluation_narratives_aggregate_bool_exp_var_samp_arguments_columns" columns of table "evaluation_narratives" */
export enum EvaluationNarrativesSelectColumnEvaluationNarrativesAggregateBoolExpVarSampArgumentsColumns {
  /** column name */
  CommentCompound = 'comment_compound',
  /** column name */
  CommentNeg = 'comment_neg',
  /** column name */
  CommentNeu = 'comment_neu',
  /** column name */
  CommentPos = 'comment_pos',
}

/** input type for updating data in table "evaluation_narratives" */
export type EvaluationNarrativesSetInput = {
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
};

/** aggregate stddev on columns */
export type EvaluationNarrativesStddevFields = {
  __typename?: 'evaluation_narratives_stddev_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
};

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
};

/** aggregate stddev_pop on columns */
export type EvaluationNarrativesStddevPopFields = {
  __typename?: 'evaluation_narratives_stddev_pop_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
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
};

/** aggregate stddev_samp on columns */
export type EvaluationNarrativesStddevSampFields = {
  __typename?: 'evaluation_narratives_stddev_samp_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
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
};

/** aggregate sum on columns */
export type EvaluationNarrativesSumFields = {
  __typename?: 'evaluation_narratives_sum_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Maybe<Scalars['float8']['output']>;
  /** The course to which this narrative comment applies */
  course_id: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['Int']['output']>;
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
};

/** update columns of table "evaluation_narratives" */
export enum EvaluationNarrativesUpdateColumn {
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
}

export type EvaluationNarrativesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<EvaluationNarrativesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<EvaluationNarrativesSetInput>;
  /** filter the rows which have to be updated */
  where: EvaluationNarrativesBoolExp;
};

/** aggregate var_pop on columns */
export type EvaluationNarrativesVarPopFields = {
  __typename?: 'evaluation_narratives_var_pop_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
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
};

/** aggregate var_samp on columns */
export type EvaluationNarrativesVarSampFields = {
  __typename?: 'evaluation_narratives_var_samp_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
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
};

/** aggregate variance on columns */
export type EvaluationNarrativesVarianceFields = {
  __typename?: 'evaluation_narratives_variance_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
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
};

/** columns and relationships of "evaluation_questions" */
export type EvaluationQuestions = {
  __typename?: 'evaluation_questions';
  /** An array relationship */
  evaluation_narratives: Array<EvaluationNarratives>;
  /** An aggregate relationship */
  evaluation_narratives_aggregate: EvaluationNarrativesAggregate;
  /** An array relationship */
  evaluation_ratings: Array<EvaluationRatings>;
  /** An aggregate relationship */
  evaluation_ratings_aggregate: EvaluationRatingsAggregate;
  /**
   * True if the question has narrative responses.
   *         False if the question has categorica/numerical responses
   */
  is_narrative: Scalars['Boolean']['output'];
  /** JSON array of possible responses (only if the question is not a narrative) */
  options: Scalars['StringArr']['output'];
  /** Question code from OCE (e.g. "YC402") */
  question_code: Scalars['String']['output'];
  /** The question text */
  question_text: Scalars['String']['output'];
  /**
   * [computed] Question type. The 'Overall' and 'Workload' tags
   *         are used to compute average ratings, while others are purely for
   *         identification purposes. No other commonality, other than that they
   *         contain similar keywords, is guaranteed—for example, they may have
   *         different options, or even differ in being narrative or not.
   */
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
export type EvaluationQuestionsEvaluationNarrativesAggregateArgs = {
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
export type EvaluationQuestionsEvaluationRatingsAggregateArgs = {
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

/** aggregated selection of "evaluation_questions" */
export type EvaluationQuestionsAggregate = {
  __typename?: 'evaluation_questions_aggregate';
  aggregate: Maybe<EvaluationQuestionsAggregateFields>;
  nodes: Array<EvaluationQuestions>;
};

/** aggregate fields of "evaluation_questions" */
export type EvaluationQuestionsAggregateFields = {
  __typename?: 'evaluation_questions_aggregate_fields';
  count: Scalars['Int']['output'];
  max: Maybe<EvaluationQuestionsMaxFields>;
  min: Maybe<EvaluationQuestionsMinFields>;
};

/** aggregate fields of "evaluation_questions" */
export type EvaluationQuestionsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<EvaluationQuestionsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "evaluation_questions". All fields are combined with a logical 'AND'. */
export type EvaluationQuestionsBoolExp = {
  _and: InputMaybe<Array<EvaluationQuestionsBoolExp>>;
  _not: InputMaybe<EvaluationQuestionsBoolExp>;
  _or: InputMaybe<Array<EvaluationQuestionsBoolExp>>;
  evaluation_narratives: InputMaybe<EvaluationNarrativesBoolExp>;
  evaluation_narratives_aggregate: InputMaybe<EvaluationNarrativesAggregateBoolExp>;
  evaluation_ratings: InputMaybe<EvaluationRatingsBoolExp>;
  evaluation_ratings_aggregate: InputMaybe<EvaluationRatingsAggregateBoolExp>;
  is_narrative: InputMaybe<BooleanComparisonExp>;
  options: InputMaybe<JsonComparisonExp>;
  question_code: InputMaybe<StringComparisonExp>;
  question_text: InputMaybe<StringComparisonExp>;
  tag: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "evaluation_questions" */
export enum EvaluationQuestionsConstraint {
  /** unique or primary key constraint on columns "question_code" */
  PkEvaluationQuestionsStaged = 'pk_evaluation_questions_staged',
}

/** input type for inserting data into table "evaluation_questions" */
export type EvaluationQuestionsInsertInput = {
  evaluation_narratives: InputMaybe<EvaluationNarrativesArrRelInsertInput>;
  evaluation_ratings: InputMaybe<EvaluationRatingsArrRelInsertInput>;
  /**
   * True if the question has narrative responses.
   *         False if the question has categorica/numerical responses
   */
  is_narrative: InputMaybe<Scalars['Boolean']['input']>;
  /** JSON array of possible responses (only if the question is not a narrative) */
  options: InputMaybe<Scalars['json']['input']>;
  /** Question code from OCE (e.g. "YC402") */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** The question text */
  question_text: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Question type. The 'Overall' and 'Workload' tags
   *         are used to compute average ratings, while others are purely for
   *         identification purposes. No other commonality, other than that they
   *         contain similar keywords, is guaranteed—for example, they may have
   *         different options, or even differ in being narrative or not.
   */
  tag: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type EvaluationQuestionsMaxFields = {
  __typename?: 'evaluation_questions_max_fields';
  /** Question code from OCE (e.g. "YC402") */
  question_code: Maybe<Scalars['String']['output']>;
  /** The question text */
  question_text: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Question type. The 'Overall' and 'Workload' tags
   *         are used to compute average ratings, while others are purely for
   *         identification purposes. No other commonality, other than that they
   *         contain similar keywords, is guaranteed—for example, they may have
   *         different options, or even differ in being narrative or not.
   */
  tag: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type EvaluationQuestionsMinFields = {
  __typename?: 'evaluation_questions_min_fields';
  /** Question code from OCE (e.g. "YC402") */
  question_code: Maybe<Scalars['String']['output']>;
  /** The question text */
  question_text: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Question type. The 'Overall' and 'Workload' tags
   *         are used to compute average ratings, while others are purely for
   *         identification purposes. No other commonality, other than that they
   *         contain similar keywords, is guaranteed—for example, they may have
   *         different options, or even differ in being narrative or not.
   */
  tag: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "evaluation_questions" */
export type EvaluationQuestionsMutationResponse = {
  __typename?: 'evaluation_questions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<EvaluationQuestions>;
};

/** input type for inserting object relation for remote table "evaluation_questions" */
export type EvaluationQuestionsObjRelInsertInput = {
  data: EvaluationQuestionsInsertInput;
  /** upsert condition */
  on_conflict: InputMaybe<EvaluationQuestionsOnConflict>;
};

/** on_conflict condition type for table "evaluation_questions" */
export type EvaluationQuestionsOnConflict = {
  constraint: EvaluationQuestionsConstraint;
  update_columns: Array<EvaluationQuestionsUpdateColumn>;
  where: InputMaybe<EvaluationQuestionsBoolExp>;
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

/** primary key columns input for table: evaluation_questions */
export type EvaluationQuestionsPkColumnsInput = {
  /** Question code from OCE (e.g. "YC402") */
  question_code: Scalars['String']['input'];
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

/** input type for updating data in table "evaluation_questions" */
export type EvaluationQuestionsSetInput = {
  /**
   * True if the question has narrative responses.
   *         False if the question has categorica/numerical responses
   */
  is_narrative: InputMaybe<Scalars['Boolean']['input']>;
  /** JSON array of possible responses (only if the question is not a narrative) */
  options: InputMaybe<Scalars['json']['input']>;
  /** Question code from OCE (e.g. "YC402") */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** The question text */
  question_text: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Question type. The 'Overall' and 'Workload' tags
   *         are used to compute average ratings, while others are purely for
   *         identification purposes. No other commonality, other than that they
   *         contain similar keywords, is guaranteed—for example, they may have
   *         different options, or even differ in being narrative or not.
   */
  tag: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "evaluation_questions" */
export type EvaluationQuestionsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: EvaluationQuestionsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type EvaluationQuestionsStreamCursorValueInput = {
  /**
   * True if the question has narrative responses.
   *         False if the question has categorica/numerical responses
   */
  is_narrative: InputMaybe<Scalars['Boolean']['input']>;
  /** JSON array of possible responses (only if the question is not a narrative) */
  options: InputMaybe<Scalars['json']['input']>;
  /** Question code from OCE (e.g. "YC402") */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** The question text */
  question_text: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Question type. The 'Overall' and 'Workload' tags
   *         are used to compute average ratings, while others are purely for
   *         identification purposes. No other commonality, other than that they
   *         contain similar keywords, is guaranteed—for example, they may have
   *         different options, or even differ in being narrative or not.
   */
  tag: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "evaluation_questions" */
export enum EvaluationQuestionsUpdateColumn {
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

export type EvaluationQuestionsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<EvaluationQuestionsSetInput>;
  /** filter the rows which have to be updated */
  where: EvaluationQuestionsBoolExp;
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

/** aggregated selection of "evaluation_ratings" */
export type EvaluationRatingsAggregate = {
  __typename?: 'evaluation_ratings_aggregate';
  aggregate: Maybe<EvaluationRatingsAggregateFields>;
  nodes: Array<EvaluationRatings>;
};

export type EvaluationRatingsAggregateBoolExp = {
  count: InputMaybe<EvaluationRatingsAggregateBoolExpCount>;
};

export type EvaluationRatingsAggregateBoolExpCount = {
  arguments: InputMaybe<Array<EvaluationRatingsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<EvaluationRatingsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "evaluation_ratings" */
export type EvaluationRatingsAggregateFields = {
  __typename?: 'evaluation_ratings_aggregate_fields';
  avg: Maybe<EvaluationRatingsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<EvaluationRatingsMaxFields>;
  min: Maybe<EvaluationRatingsMinFields>;
  stddev: Maybe<EvaluationRatingsStddevFields>;
  stddev_pop: Maybe<EvaluationRatingsStddevPopFields>;
  stddev_samp: Maybe<EvaluationRatingsStddevSampFields>;
  sum: Maybe<EvaluationRatingsSumFields>;
  var_pop: Maybe<EvaluationRatingsVarPopFields>;
  var_samp: Maybe<EvaluationRatingsVarSampFields>;
  variance: Maybe<EvaluationRatingsVarianceFields>;
};

/** aggregate fields of "evaluation_ratings" */
export type EvaluationRatingsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<EvaluationRatingsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
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

/** input type for inserting array relation for remote table "evaluation_ratings" */
export type EvaluationRatingsArrRelInsertInput = {
  data: Array<EvaluationRatingsInsertInput>;
  /** upsert condition */
  on_conflict: InputMaybe<EvaluationRatingsOnConflict>;
};

/** aggregate avg on columns */
export type EvaluationRatingsAvgFields = {
  __typename?: 'evaluation_ratings_avg_fields';
  /** The course to which this rating applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
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
  rating: InputMaybe<JsonComparisonExp>;
};

/** unique or primary key constraints on table "evaluation_ratings" */
export enum EvaluationRatingsConstraint {
  /** unique or primary key constraint on columns "id" */
  PkEvaluationRatingsStaged = 'pk_evaluation_ratings_staged',
}

/** input type for incrementing numeric columns in table "evaluation_ratings" */
export type EvaluationRatingsIncInput = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "evaluation_ratings" */
export type EvaluationRatingsInsertInput = {
  course: InputMaybe<CoursesObjRelInsertInput>;
  /** The course to which this rating applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  evaluation_question: InputMaybe<EvaluationQuestionsObjRelInsertInput>;
  id: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this rating responds */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** JSON array of the response counts for each option */
  rating: InputMaybe<Scalars['json']['input']>;
};

/** aggregate max on columns */
export type EvaluationRatingsMaxFields = {
  __typename?: 'evaluation_ratings_max_fields';
  /** The course to which this rating applies */
  course_id: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['Int']['output']>;
  /** Question to which this rating responds */
  question_code: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "evaluation_ratings" */
export type EvaluationRatingsMaxOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** Question to which this rating responds */
  question_code: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type EvaluationRatingsMinFields = {
  __typename?: 'evaluation_ratings_min_fields';
  /** The course to which this rating applies */
  course_id: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['Int']['output']>;
  /** Question to which this rating responds */
  question_code: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "evaluation_ratings" */
export type EvaluationRatingsMinOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
  /** Question to which this rating responds */
  question_code: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "evaluation_ratings" */
export type EvaluationRatingsMutationResponse = {
  __typename?: 'evaluation_ratings_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<EvaluationRatings>;
};

/** on_conflict condition type for table "evaluation_ratings" */
export type EvaluationRatingsOnConflict = {
  constraint: EvaluationRatingsConstraint;
  update_columns: Array<EvaluationRatingsUpdateColumn>;
  where: InputMaybe<EvaluationRatingsBoolExp>;
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

/** primary key columns input for table: evaluation_ratings */
export type EvaluationRatingsPkColumnsInput = {
  id: Scalars['Int']['input'];
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

/** input type for updating data in table "evaluation_ratings" */
export type EvaluationRatingsSetInput = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this rating responds */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** JSON array of the response counts for each option */
  rating: InputMaybe<Scalars['json']['input']>;
};

/** aggregate stddev on columns */
export type EvaluationRatingsStddevFields = {
  __typename?: 'evaluation_ratings_stddev_fields';
  /** The course to which this rating applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "evaluation_ratings" */
export type EvaluationRatingsStddevOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type EvaluationRatingsStddevPopFields = {
  __typename?: 'evaluation_ratings_stddev_pop_fields';
  /** The course to which this rating applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "evaluation_ratings" */
export type EvaluationRatingsStddevPopOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type EvaluationRatingsStddevSampFields = {
  __typename?: 'evaluation_ratings_stddev_samp_fields';
  /** The course to which this rating applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
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
  rating: InputMaybe<Scalars['json']['input']>;
};

/** aggregate sum on columns */
export type EvaluationRatingsSumFields = {
  __typename?: 'evaluation_ratings_sum_fields';
  /** The course to which this rating applies */
  course_id: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "evaluation_ratings" */
export type EvaluationRatingsSumOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** update columns of table "evaluation_ratings" */
export enum EvaluationRatingsUpdateColumn {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Id = 'id',
  /** column name */
  QuestionCode = 'question_code',
  /** column name */
  Rating = 'rating',
}

export type EvaluationRatingsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<EvaluationRatingsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<EvaluationRatingsSetInput>;
  /** filter the rows which have to be updated */
  where: EvaluationRatingsBoolExp;
};

/** aggregate var_pop on columns */
export type EvaluationRatingsVarPopFields = {
  __typename?: 'evaluation_ratings_var_pop_fields';
  /** The course to which this rating applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "evaluation_ratings" */
export type EvaluationRatingsVarPopOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type EvaluationRatingsVarSampFields = {
  __typename?: 'evaluation_ratings_var_samp_fields';
  /** The course to which this rating applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "evaluation_ratings" */
export type EvaluationRatingsVarSampOrderBy = {
  /** The course to which this rating applies */
  course_id: InputMaybe<OrderBy>;
  id: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type EvaluationRatingsVarianceFields = {
  __typename?: 'evaluation_ratings_variance_fields';
  /** The course to which this rating applies */
  course_id: Maybe<Scalars['Float']['output']>;
  id: Maybe<Scalars['Float']['output']>;
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
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Int']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Int']['output']>;
  /** Arbitrary additional information attached to an evaluation */
  extras: Maybe<Scalars['json']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Int']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Int']['output']>;
};

/** columns and relationships of "evaluation_statistics" */
export type EvaluationStatisticsExtrasArgs = {
  path: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "evaluation_statistics" */
export type EvaluationStatisticsAggregate = {
  __typename?: 'evaluation_statistics_aggregate';
  aggregate: Maybe<EvaluationStatisticsAggregateFields>;
  nodes: Array<EvaluationStatistics>;
};

/** aggregate fields of "evaluation_statistics" */
export type EvaluationStatisticsAggregateFields = {
  __typename?: 'evaluation_statistics_aggregate_fields';
  avg: Maybe<EvaluationStatisticsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<EvaluationStatisticsMaxFields>;
  min: Maybe<EvaluationStatisticsMinFields>;
  stddev: Maybe<EvaluationStatisticsStddevFields>;
  stddev_pop: Maybe<EvaluationStatisticsStddevPopFields>;
  stddev_samp: Maybe<EvaluationStatisticsStddevSampFields>;
  sum: Maybe<EvaluationStatisticsSumFields>;
  var_pop: Maybe<EvaluationStatisticsVarPopFields>;
  var_samp: Maybe<EvaluationStatisticsVarSampFields>;
  variance: Maybe<EvaluationStatisticsVarianceFields>;
};

/** aggregate fields of "evaluation_statistics" */
export type EvaluationStatisticsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<EvaluationStatisticsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type EvaluationStatisticsAvgFields = {
  __typename?: 'evaluation_statistics_avg_fields';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Float']['output']>;
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
  declined: InputMaybe<IntComparisonExp>;
  enrolled: InputMaybe<IntComparisonExp>;
  extras: InputMaybe<JsonComparisonExp>;
  no_response: InputMaybe<IntComparisonExp>;
  responses: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "evaluation_statistics" */
export enum EvaluationStatisticsConstraint {
  /** unique or primary key constraint on columns "course_id" */
  PkEvaluationStatisticsStaged = 'pk_evaluation_statistics_staged',
}

/** input type for incrementing numeric columns in table "evaluation_statistics" */
export type EvaluationStatisticsIncInput = {
  /** [computed] Average overall rating */
  avg_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average workload rating */
  avg_workload: InputMaybe<Scalars['float8']['input']>;
  /** The course associated with these statistics */
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** Number of students who declined to respond */
  declined: InputMaybe<Scalars['Int']['input']>;
  /** Number of students enrolled in course */
  enrolled: InputMaybe<Scalars['Int']['input']>;
  /** Number of students who did not respond */
  no_response: InputMaybe<Scalars['Int']['input']>;
  /** Number of responses */
  responses: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "evaluation_statistics" */
export type EvaluationStatisticsInsertInput = {
  /** [computed] Average overall rating */
  avg_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average workload rating */
  avg_workload: InputMaybe<Scalars['float8']['input']>;
  course: InputMaybe<CoursesObjRelInsertInput>;
  /** The course associated with these statistics */
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** Number of students who declined to respond */
  declined: InputMaybe<Scalars['Int']['input']>;
  /** Number of students enrolled in course */
  enrolled: InputMaybe<Scalars['Int']['input']>;
  /** Arbitrary additional information attached to an evaluation */
  extras: InputMaybe<Scalars['json']['input']>;
  /** Number of students who did not respond */
  no_response: InputMaybe<Scalars['Int']['input']>;
  /** Number of responses */
  responses: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type EvaluationStatisticsMaxFields = {
  __typename?: 'evaluation_statistics_max_fields';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['float8']['output']>;
  /** The course associated with these statistics */
  course_id: Maybe<Scalars['Int']['output']>;
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Int']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Int']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Int']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type EvaluationStatisticsMinFields = {
  __typename?: 'evaluation_statistics_min_fields';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['float8']['output']>;
  /** The course associated with these statistics */
  course_id: Maybe<Scalars['Int']['output']>;
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Int']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Int']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Int']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "evaluation_statistics" */
export type EvaluationStatisticsMutationResponse = {
  __typename?: 'evaluation_statistics_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<EvaluationStatistics>;
};

/** input type for inserting object relation for remote table "evaluation_statistics" */
export type EvaluationStatisticsObjRelInsertInput = {
  data: EvaluationStatisticsInsertInput;
  /** upsert condition */
  on_conflict: InputMaybe<EvaluationStatisticsOnConflict>;
};

/** on_conflict condition type for table "evaluation_statistics" */
export type EvaluationStatisticsOnConflict = {
  constraint: EvaluationStatisticsConstraint;
  update_columns: Array<EvaluationStatisticsUpdateColumn>;
  where: InputMaybe<EvaluationStatisticsBoolExp>;
};

/** Ordering options when selecting data from "evaluation_statistics". */
export type EvaluationStatisticsOrderBy = {
  avg_rating: InputMaybe<OrderBy>;
  avg_workload: InputMaybe<OrderBy>;
  course: InputMaybe<CoursesOrderBy>;
  course_id: InputMaybe<OrderBy>;
  declined: InputMaybe<OrderBy>;
  enrolled: InputMaybe<OrderBy>;
  extras: InputMaybe<OrderBy>;
  no_response: InputMaybe<OrderBy>;
  responses: InputMaybe<OrderBy>;
};

/** primary key columns input for table: evaluation_statistics */
export type EvaluationStatisticsPkColumnsInput = {
  /** The course associated with these statistics */
  course_id: Scalars['Int']['input'];
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
  Declined = 'declined',
  /** column name */
  Enrolled = 'enrolled',
  /** column name */
  Extras = 'extras',
  /** column name */
  NoResponse = 'no_response',
  /** column name */
  Responses = 'responses',
}

/** input type for updating data in table "evaluation_statistics" */
export type EvaluationStatisticsSetInput = {
  /** [computed] Average overall rating */
  avg_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average workload rating */
  avg_workload: InputMaybe<Scalars['float8']['input']>;
  /** The course associated with these statistics */
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** Number of students who declined to respond */
  declined: InputMaybe<Scalars['Int']['input']>;
  /** Number of students enrolled in course */
  enrolled: InputMaybe<Scalars['Int']['input']>;
  /** Arbitrary additional information attached to an evaluation */
  extras: InputMaybe<Scalars['json']['input']>;
  /** Number of students who did not respond */
  no_response: InputMaybe<Scalars['Int']['input']>;
  /** Number of responses */
  responses: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type EvaluationStatisticsStddevFields = {
  __typename?: 'evaluation_statistics_stddev_fields';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type EvaluationStatisticsStddevPopFields = {
  __typename?: 'evaluation_statistics_stddev_pop_fields';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type EvaluationStatisticsStddevSampFields = {
  __typename?: 'evaluation_statistics_stddev_samp_fields';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Float']['output']>;
};

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
  /** Number of students who declined to respond */
  declined: InputMaybe<Scalars['Int']['input']>;
  /** Number of students enrolled in course */
  enrolled: InputMaybe<Scalars['Int']['input']>;
  /** Arbitrary additional information attached to an evaluation */
  extras: InputMaybe<Scalars['json']['input']>;
  /** Number of students who did not respond */
  no_response: InputMaybe<Scalars['Int']['input']>;
  /** Number of responses */
  responses: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type EvaluationStatisticsSumFields = {
  __typename?: 'evaluation_statistics_sum_fields';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['float8']['output']>;
  /** The course associated with these statistics */
  course_id: Maybe<Scalars['Int']['output']>;
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Int']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Int']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Int']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "evaluation_statistics" */
export enum EvaluationStatisticsUpdateColumn {
  /** column name */
  AvgRating = 'avg_rating',
  /** column name */
  AvgWorkload = 'avg_workload',
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Declined = 'declined',
  /** column name */
  Enrolled = 'enrolled',
  /** column name */
  Extras = 'extras',
  /** column name */
  NoResponse = 'no_response',
  /** column name */
  Responses = 'responses',
}

export type EvaluationStatisticsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<EvaluationStatisticsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<EvaluationStatisticsSetInput>;
  /** filter the rows which have to be updated */
  where: EvaluationStatisticsBoolExp;
};

/** aggregate var_pop on columns */
export type EvaluationStatisticsVarPopFields = {
  __typename?: 'evaluation_statistics_var_pop_fields';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type EvaluationStatisticsVarSampFields = {
  __typename?: 'evaluation_statistics_var_samp_fields';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type EvaluationStatisticsVarianceFields = {
  __typename?: 'evaluation_statistics_variance_fields';
  /** [computed] Average overall rating */
  avg_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "flags" */
export type Flags = {
  __typename?: 'flags';
  /** An array relationship */
  course_flags: Array<CourseFlags>;
  /** An aggregate relationship */
  course_flags_aggregate: CourseFlagsAggregate;
  /** Flag ID */
  flag_id: Scalars['Int']['output'];
  /** Flag text */
  flag_text: Scalars['String']['output'];
};

/** columns and relationships of "flags" */
export type FlagsCourseFlagsArgs = {
  distinct_on: InputMaybe<Array<CourseFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseFlagsOrderBy>>;
  where: InputMaybe<CourseFlagsBoolExp>;
};

/** columns and relationships of "flags" */
export type FlagsCourseFlagsAggregateArgs = {
  distinct_on: InputMaybe<Array<CourseFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseFlagsOrderBy>>;
  where: InputMaybe<CourseFlagsBoolExp>;
};

/** aggregated selection of "flags" */
export type FlagsAggregate = {
  __typename?: 'flags_aggregate';
  aggregate: Maybe<FlagsAggregateFields>;
  nodes: Array<Flags>;
};

/** aggregate fields of "flags" */
export type FlagsAggregateFields = {
  __typename?: 'flags_aggregate_fields';
  avg: Maybe<FlagsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<FlagsMaxFields>;
  min: Maybe<FlagsMinFields>;
  stddev: Maybe<FlagsStddevFields>;
  stddev_pop: Maybe<FlagsStddevPopFields>;
  stddev_samp: Maybe<FlagsStddevSampFields>;
  sum: Maybe<FlagsSumFields>;
  var_pop: Maybe<FlagsVarPopFields>;
  var_samp: Maybe<FlagsVarSampFields>;
  variance: Maybe<FlagsVarianceFields>;
};

/** aggregate fields of "flags" */
export type FlagsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<FlagsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type FlagsAvgFields = {
  __typename?: 'flags_avg_fields';
  /** Flag ID */
  flag_id: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "flags". All fields are combined with a logical 'AND'. */
export type FlagsBoolExp = {
  _and: InputMaybe<Array<FlagsBoolExp>>;
  _not: InputMaybe<FlagsBoolExp>;
  _or: InputMaybe<Array<FlagsBoolExp>>;
  course_flags: InputMaybe<CourseFlagsBoolExp>;
  course_flags_aggregate: InputMaybe<CourseFlagsAggregateBoolExp>;
  flag_id: InputMaybe<IntComparisonExp>;
  flag_text: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "flags" */
export enum FlagsConstraint {
  /** unique or primary key constraint on columns "flag_id" */
  PkFlagsStaged = 'pk_flags_staged',
}

/** input type for incrementing numeric columns in table "flags" */
export type FlagsIncInput = {
  /** Flag ID */
  flag_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "flags" */
export type FlagsInsertInput = {
  course_flags: InputMaybe<CourseFlagsArrRelInsertInput>;
  /** Flag ID */
  flag_id: InputMaybe<Scalars['Int']['input']>;
  /** Flag text */
  flag_text: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type FlagsMaxFields = {
  __typename?: 'flags_max_fields';
  /** Flag ID */
  flag_id: Maybe<Scalars['Int']['output']>;
  /** Flag text */
  flag_text: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type FlagsMinFields = {
  __typename?: 'flags_min_fields';
  /** Flag ID */
  flag_id: Maybe<Scalars['Int']['output']>;
  /** Flag text */
  flag_text: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "flags" */
export type FlagsMutationResponse = {
  __typename?: 'flags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Flags>;
};

/** input type for inserting object relation for remote table "flags" */
export type FlagsObjRelInsertInput = {
  data: FlagsInsertInput;
  /** upsert condition */
  on_conflict: InputMaybe<FlagsOnConflict>;
};

/** on_conflict condition type for table "flags" */
export type FlagsOnConflict = {
  constraint: FlagsConstraint;
  update_columns: Array<FlagsUpdateColumn>;
  where: InputMaybe<FlagsBoolExp>;
};

/** Ordering options when selecting data from "flags". */
export type FlagsOrderBy = {
  course_flags_aggregate: InputMaybe<CourseFlagsAggregateOrderBy>;
  flag_id: InputMaybe<OrderBy>;
  flag_text: InputMaybe<OrderBy>;
};

/** primary key columns input for table: flags */
export type FlagsPkColumnsInput = {
  /** Flag ID */
  flag_id: Scalars['Int']['input'];
};

/** select columns of table "flags" */
export enum FlagsSelectColumn {
  /** column name */
  FlagId = 'flag_id',
  /** column name */
  FlagText = 'flag_text',
}

/** input type for updating data in table "flags" */
export type FlagsSetInput = {
  /** Flag ID */
  flag_id: InputMaybe<Scalars['Int']['input']>;
  /** Flag text */
  flag_text: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type FlagsStddevFields = {
  __typename?: 'flags_stddev_fields';
  /** Flag ID */
  flag_id: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type FlagsStddevPopFields = {
  __typename?: 'flags_stddev_pop_fields';
  /** Flag ID */
  flag_id: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type FlagsStddevSampFields = {
  __typename?: 'flags_stddev_samp_fields';
  /** Flag ID */
  flag_id: Maybe<Scalars['Float']['output']>;
};

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
};

/** aggregate sum on columns */
export type FlagsSumFields = {
  __typename?: 'flags_sum_fields';
  /** Flag ID */
  flag_id: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "flags" */
export enum FlagsUpdateColumn {
  /** column name */
  FlagId = 'flag_id',
  /** column name */
  FlagText = 'flag_text',
}

export type FlagsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<FlagsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<FlagsSetInput>;
  /** filter the rows which have to be updated */
  where: FlagsBoolExp;
};

/** aggregate var_pop on columns */
export type FlagsVarPopFields = {
  __typename?: 'flags_var_pop_fields';
  /** Flag ID */
  flag_id: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type FlagsVarSampFields = {
  __typename?: 'flags_var_samp_fields';
  /** Flag ID */
  flag_id: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type FlagsVarianceFields = {
  __typename?: 'flags_variance_fields';
  /** Flag ID */
  flag_id: Maybe<Scalars['Float']['output']>;
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

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type JsonComparisonExp = {
  _eq: InputMaybe<Scalars['json']['input']>;
  _gt: InputMaybe<Scalars['json']['input']>;
  _gte: InputMaybe<Scalars['json']['input']>;
  _in: InputMaybe<Array<Scalars['json']['input']>>;
  _is_null: InputMaybe<Scalars['Boolean']['input']>;
  _lt: InputMaybe<Scalars['json']['input']>;
  _lte: InputMaybe<Scalars['json']['input']>;
  _neq: InputMaybe<Scalars['json']['input']>;
  _nin: InputMaybe<Array<Scalars['json']['input']>>;
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
  /** An array relationship */
  computed_listing_infos: Array<ComputedListingInfo>;
  /** An aggregate relationship */
  computed_listing_infos_aggregate: ComputedListingInfoAggregate;
  /** An object relationship */
  course: Courses;
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: Scalars['String']['output'];
  /** Course that the listing refers to */
  course_id: Scalars['Int']['output'];
  /** The CRN associated with this listing */
  crn: Scalars['Crn']['output'];
  /** Listing ID */
  listing_id: Scalars['Int']['output'];
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: Scalars['String']['output'];
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  season: Seasons;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: Scalars['Season']['output'];
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: Scalars['String']['output'];
  /** Subject the course is listed under (e.g. "AMST") */
  subject: Scalars['String']['output'];
};

/** columns and relationships of "listings" */
export type ListingsComputedListingInfosArgs = {
  distinct_on: InputMaybe<Array<ComputedListingInfoSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ComputedListingInfoOrderBy>>;
  where: InputMaybe<ComputedListingInfoBoolExp>;
};

/** columns and relationships of "listings" */
export type ListingsComputedListingInfosAggregateArgs = {
  distinct_on: InputMaybe<Array<ComputedListingInfoSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ComputedListingInfoOrderBy>>;
  where: InputMaybe<ComputedListingInfoBoolExp>;
};

/** aggregated selection of "listings" */
export type ListingsAggregate = {
  __typename?: 'listings_aggregate';
  aggregate: Maybe<ListingsAggregateFields>;
  nodes: Array<Listings>;
};

export type ListingsAggregateBoolExp = {
  count: InputMaybe<ListingsAggregateBoolExpCount>;
};

export type ListingsAggregateBoolExpCount = {
  arguments: InputMaybe<Array<ListingsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<ListingsBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "listings" */
export type ListingsAggregateFields = {
  __typename?: 'listings_aggregate_fields';
  avg: Maybe<ListingsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<ListingsMaxFields>;
  min: Maybe<ListingsMinFields>;
  stddev: Maybe<ListingsStddevFields>;
  stddev_pop: Maybe<ListingsStddevPopFields>;
  stddev_samp: Maybe<ListingsStddevSampFields>;
  sum: Maybe<ListingsSumFields>;
  var_pop: Maybe<ListingsVarPopFields>;
  var_samp: Maybe<ListingsVarSampFields>;
  variance: Maybe<ListingsVarianceFields>;
};

/** aggregate fields of "listings" */
export type ListingsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<ListingsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
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

/** input type for inserting array relation for remote table "listings" */
export type ListingsArrRelInsertInput = {
  data: Array<ListingsInsertInput>;
  /** upsert condition */
  on_conflict: InputMaybe<ListingsOnConflict>;
};

/** aggregate avg on columns */
export type ListingsAvgFields = {
  __typename?: 'listings_avg_fields';
  /** Course that the listing refers to */
  course_id: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id: Maybe<Scalars['Float']['output']>;
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
  computed_listing_infos: InputMaybe<ComputedListingInfoBoolExp>;
  computed_listing_infos_aggregate: InputMaybe<ComputedListingInfoAggregateBoolExp>;
  course: InputMaybe<CoursesBoolExp>;
  course_code: InputMaybe<StringComparisonExp>;
  course_id: InputMaybe<IntComparisonExp>;
  crn: InputMaybe<IntComparisonExp>;
  listing_id: InputMaybe<IntComparisonExp>;
  number: InputMaybe<StringComparisonExp>;
  school: InputMaybe<StringComparisonExp>;
  season: InputMaybe<SeasonsBoolExp>;
  season_code: InputMaybe<StringComparisonExp>;
  section: InputMaybe<StringComparisonExp>;
  subject: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "listings" */
export enum ListingsConstraint {
  /** unique or primary key constraint on columns "crn", "season_code" */
  IdxSeasonCodeCrnUnique = 'idx_season_code_crn_unique',
  /** unique or primary key constraint on columns "listing_id" */
  PkListingsStaged = 'pk_listings_staged',
}

/** input type for incrementing numeric columns in table "listings" */
export type ListingsIncInput = {
  /** Course that the listing refers to */
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Scalars['Int']['input']>;
  /** Listing ID */
  listing_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "listings" */
export type ListingsInsertInput = {
  computed_listing_infos: InputMaybe<ComputedListingInfoArrRelInsertInput>;
  course: InputMaybe<CoursesObjRelInsertInput>;
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: InputMaybe<Scalars['String']['input']>;
  /** Course that the listing refers to */
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Scalars['Int']['input']>;
  /** Listing ID */
  listing_id: InputMaybe<Scalars['Int']['input']>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: InputMaybe<Scalars['String']['input']>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: InputMaybe<Scalars['String']['input']>;
  season: InputMaybe<SeasonsObjRelInsertInput>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<Scalars['String']['input']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: InputMaybe<Scalars['String']['input']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type ListingsMaxFields = {
  __typename?: 'listings_max_fields';
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: Maybe<Scalars['String']['output']>;
  /** Course that the listing refers to */
  course_id: Maybe<Scalars['Int']['output']>;
  /** The CRN associated with this listing */
  crn: Maybe<Scalars['Int']['output']>;
  /** Listing ID */
  listing_id: Maybe<Scalars['Int']['output']>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: Maybe<Scalars['String']['output']>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: Maybe<Scalars['String']['output']>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: Maybe<Scalars['String']['output']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: Maybe<Scalars['String']['output']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "listings" */
export type ListingsMaxOrderBy = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: InputMaybe<OrderBy>;
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: InputMaybe<OrderBy>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: InputMaybe<OrderBy>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<OrderBy>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: InputMaybe<OrderBy>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ListingsMinFields = {
  __typename?: 'listings_min_fields';
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: Maybe<Scalars['String']['output']>;
  /** Course that the listing refers to */
  course_id: Maybe<Scalars['Int']['output']>;
  /** The CRN associated with this listing */
  crn: Maybe<Scalars['Int']['output']>;
  /** Listing ID */
  listing_id: Maybe<Scalars['Int']['output']>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: Maybe<Scalars['String']['output']>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: Maybe<Scalars['String']['output']>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: Maybe<Scalars['String']['output']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: Maybe<Scalars['String']['output']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "listings" */
export type ListingsMinOrderBy = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: InputMaybe<OrderBy>;
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: InputMaybe<OrderBy>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: InputMaybe<OrderBy>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<OrderBy>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: InputMaybe<OrderBy>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "listings" */
export type ListingsMutationResponse = {
  __typename?: 'listings_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Listings>;
};

/** input type for inserting object relation for remote table "listings" */
export type ListingsObjRelInsertInput = {
  data: ListingsInsertInput;
  /** upsert condition */
  on_conflict: InputMaybe<ListingsOnConflict>;
};

/** on_conflict condition type for table "listings" */
export type ListingsOnConflict = {
  constraint: ListingsConstraint;
  update_columns: Array<ListingsUpdateColumn>;
  where: InputMaybe<ListingsBoolExp>;
};

/** Ordering options when selecting data from "listings". */
export type ListingsOrderBy = {
  computed_listing_infos_aggregate: InputMaybe<ComputedListingInfoAggregateOrderBy>;
  course: InputMaybe<CoursesOrderBy>;
  course_code: InputMaybe<OrderBy>;
  course_id: InputMaybe<OrderBy>;
  crn: InputMaybe<OrderBy>;
  listing_id: InputMaybe<OrderBy>;
  number: InputMaybe<OrderBy>;
  school: InputMaybe<OrderBy>;
  season: InputMaybe<SeasonsOrderBy>;
  season_code: InputMaybe<OrderBy>;
  section: InputMaybe<OrderBy>;
  subject: InputMaybe<OrderBy>;
};

/** primary key columns input for table: listings */
export type ListingsPkColumnsInput = {
  /** Listing ID */
  listing_id: Scalars['Int']['input'];
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
}

/** input type for updating data in table "listings" */
export type ListingsSetInput = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: InputMaybe<Scalars['String']['input']>;
  /** Course that the listing refers to */
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Scalars['Int']['input']>;
  /** Listing ID */
  listing_id: InputMaybe<Scalars['Int']['input']>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: InputMaybe<Scalars['String']['input']>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: InputMaybe<Scalars['String']['input']>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<Scalars['String']['input']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: InputMaybe<Scalars['String']['input']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type ListingsStddevFields = {
  __typename?: 'listings_stddev_fields';
  /** Course that the listing refers to */
  course_id: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "listings" */
export type ListingsStddevOrderBy = {
  /** Course that the listing refers to */
  course_id: InputMaybe<OrderBy>;
  /** The CRN associated with this listing */
  crn: InputMaybe<OrderBy>;
  /** Listing ID */
  listing_id: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type ListingsStddevPopFields = {
  __typename?: 'listings_stddev_pop_fields';
  /** Course that the listing refers to */
  course_id: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id: Maybe<Scalars['Float']['output']>;
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

/** aggregate stddev_samp on columns */
export type ListingsStddevSampFields = {
  __typename?: 'listings_stddev_samp_fields';
  /** Course that the listing refers to */
  course_id: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id: Maybe<Scalars['Float']['output']>;
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
  /** Listing ID */
  listing_id: InputMaybe<Scalars['Int']['input']>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: InputMaybe<Scalars['String']['input']>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: InputMaybe<Scalars['String']['input']>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<Scalars['String']['input']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: InputMaybe<Scalars['String']['input']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type ListingsSumFields = {
  __typename?: 'listings_sum_fields';
  /** Course that the listing refers to */
  course_id: Maybe<Scalars['Int']['output']>;
  /** The CRN associated with this listing */
  crn: Maybe<Scalars['Int']['output']>;
  /** Listing ID */
  listing_id: Maybe<Scalars['Int']['output']>;
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

/** update columns of table "listings" */
export enum ListingsUpdateColumn {
  /** column name */
  CourseCode = 'course_code',
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Crn = 'crn',
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
}

export type ListingsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<ListingsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<ListingsSetInput>;
  /** filter the rows which have to be updated */
  where: ListingsBoolExp;
};

/** aggregate var_pop on columns */
export type ListingsVarPopFields = {
  __typename?: 'listings_var_pop_fields';
  /** Course that the listing refers to */
  course_id: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id: Maybe<Scalars['Float']['output']>;
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

/** aggregate var_samp on columns */
export type ListingsVarSampFields = {
  __typename?: 'listings_var_samp_fields';
  /** Course that the listing refers to */
  course_id: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id: Maybe<Scalars['Float']['output']>;
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

/** aggregate variance on columns */
export type ListingsVarianceFields = {
  __typename?: 'listings_variance_fields';
  /** Course that the listing refers to */
  course_id: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id: Maybe<Scalars['Float']['output']>;
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

/** mutation root */
export type MutationRoot = {
  __typename?: 'mutation_root';
  /** delete data from the table: "computed_listing_info" */
  delete_computed_listing_info: Maybe<ComputedListingInfoMutationResponse>;
  /** delete data from the table: "course_flags" */
  delete_course_flags: Maybe<CourseFlagsMutationResponse>;
  /** delete single row from the table: "course_flags" */
  delete_course_flags_by_pk: Maybe<CourseFlags>;
  /** delete data from the table: "course_professors" */
  delete_course_professors: Maybe<CourseProfessorsMutationResponse>;
  /** delete single row from the table: "course_professors" */
  delete_course_professors_by_pk: Maybe<CourseProfessors>;
  /** delete data from the table: "courses" */
  delete_courses: Maybe<CoursesMutationResponse>;
  /** delete single row from the table: "courses" */
  delete_courses_by_pk: Maybe<Courses>;
  /** delete data from the table: "evaluation_narratives" */
  delete_evaluation_narratives: Maybe<EvaluationNarrativesMutationResponse>;
  /** delete single row from the table: "evaluation_narratives" */
  delete_evaluation_narratives_by_pk: Maybe<EvaluationNarratives>;
  /** delete data from the table: "evaluation_questions" */
  delete_evaluation_questions: Maybe<EvaluationQuestionsMutationResponse>;
  /** delete single row from the table: "evaluation_questions" */
  delete_evaluation_questions_by_pk: Maybe<EvaluationQuestions>;
  /** delete data from the table: "evaluation_ratings" */
  delete_evaluation_ratings: Maybe<EvaluationRatingsMutationResponse>;
  /** delete single row from the table: "evaluation_ratings" */
  delete_evaluation_ratings_by_pk: Maybe<EvaluationRatings>;
  /** delete data from the table: "evaluation_statistics" */
  delete_evaluation_statistics: Maybe<EvaluationStatisticsMutationResponse>;
  /** delete single row from the table: "evaluation_statistics" */
  delete_evaluation_statistics_by_pk: Maybe<EvaluationStatistics>;
  /** delete data from the table: "flags" */
  delete_flags: Maybe<FlagsMutationResponse>;
  /** delete single row from the table: "flags" */
  delete_flags_by_pk: Maybe<Flags>;
  /** delete data from the table: "listings" */
  delete_listings: Maybe<ListingsMutationResponse>;
  /** delete single row from the table: "listings" */
  delete_listings_by_pk: Maybe<Listings>;
  /** delete data from the table: "professors" */
  delete_professors: Maybe<ProfessorsMutationResponse>;
  /** delete single row from the table: "professors" */
  delete_professors_by_pk: Maybe<Professors>;
  /** delete data from the table: "seasons" */
  delete_seasons: Maybe<SeasonsMutationResponse>;
  /** delete single row from the table: "seasons" */
  delete_seasons_by_pk: Maybe<Seasons>;
  /** insert data into the table: "computed_listing_info" */
  insert_computed_listing_info: Maybe<ComputedListingInfoMutationResponse>;
  /** insert a single row into the table: "computed_listing_info" */
  insert_computed_listing_info_one: Maybe<ComputedListingInfo>;
  /** insert data into the table: "course_flags" */
  insert_course_flags: Maybe<CourseFlagsMutationResponse>;
  /** insert a single row into the table: "course_flags" */
  insert_course_flags_one: Maybe<CourseFlags>;
  /** insert data into the table: "course_professors" */
  insert_course_professors: Maybe<CourseProfessorsMutationResponse>;
  /** insert a single row into the table: "course_professors" */
  insert_course_professors_one: Maybe<CourseProfessors>;
  /** insert data into the table: "courses" */
  insert_courses: Maybe<CoursesMutationResponse>;
  /** insert a single row into the table: "courses" */
  insert_courses_one: Maybe<Courses>;
  /** insert data into the table: "evaluation_narratives" */
  insert_evaluation_narratives: Maybe<EvaluationNarrativesMutationResponse>;
  /** insert a single row into the table: "evaluation_narratives" */
  insert_evaluation_narratives_one: Maybe<EvaluationNarratives>;
  /** insert data into the table: "evaluation_questions" */
  insert_evaluation_questions: Maybe<EvaluationQuestionsMutationResponse>;
  /** insert a single row into the table: "evaluation_questions" */
  insert_evaluation_questions_one: Maybe<EvaluationQuestions>;
  /** insert data into the table: "evaluation_ratings" */
  insert_evaluation_ratings: Maybe<EvaluationRatingsMutationResponse>;
  /** insert a single row into the table: "evaluation_ratings" */
  insert_evaluation_ratings_one: Maybe<EvaluationRatings>;
  /** insert data into the table: "evaluation_statistics" */
  insert_evaluation_statistics: Maybe<EvaluationStatisticsMutationResponse>;
  /** insert a single row into the table: "evaluation_statistics" */
  insert_evaluation_statistics_one: Maybe<EvaluationStatistics>;
  /** insert data into the table: "flags" */
  insert_flags: Maybe<FlagsMutationResponse>;
  /** insert a single row into the table: "flags" */
  insert_flags_one: Maybe<Flags>;
  /** insert data into the table: "listings" */
  insert_listings: Maybe<ListingsMutationResponse>;
  /** insert a single row into the table: "listings" */
  insert_listings_one: Maybe<Listings>;
  /** insert data into the table: "professors" */
  insert_professors: Maybe<ProfessorsMutationResponse>;
  /** insert a single row into the table: "professors" */
  insert_professors_one: Maybe<Professors>;
  /** insert data into the table: "seasons" */
  insert_seasons: Maybe<SeasonsMutationResponse>;
  /** insert a single row into the table: "seasons" */
  insert_seasons_one: Maybe<Seasons>;
  /** update data of the table: "computed_listing_info" */
  update_computed_listing_info: Maybe<ComputedListingInfoMutationResponse>;
  /** update multiples rows of table: "computed_listing_info" */
  update_computed_listing_info_many: Maybe<
    Array<Maybe<ComputedListingInfoMutationResponse>>
  >;
  /** update data of the table: "course_flags" */
  update_course_flags: Maybe<CourseFlagsMutationResponse>;
  /** update single row of the table: "course_flags" */
  update_course_flags_by_pk: Maybe<CourseFlags>;
  /** update multiples rows of table: "course_flags" */
  update_course_flags_many: Maybe<Array<Maybe<CourseFlagsMutationResponse>>>;
  /** update data of the table: "course_professors" */
  update_course_professors: Maybe<CourseProfessorsMutationResponse>;
  /** update single row of the table: "course_professors" */
  update_course_professors_by_pk: Maybe<CourseProfessors>;
  /** update multiples rows of table: "course_professors" */
  update_course_professors_many: Maybe<
    Array<Maybe<CourseProfessorsMutationResponse>>
  >;
  /** update data of the table: "courses" */
  update_courses: Maybe<CoursesMutationResponse>;
  /** update single row of the table: "courses" */
  update_courses_by_pk: Maybe<Courses>;
  /** update multiples rows of table: "courses" */
  update_courses_many: Maybe<Array<Maybe<CoursesMutationResponse>>>;
  /** update data of the table: "evaluation_narratives" */
  update_evaluation_narratives: Maybe<EvaluationNarrativesMutationResponse>;
  /** update single row of the table: "evaluation_narratives" */
  update_evaluation_narratives_by_pk: Maybe<EvaluationNarratives>;
  /** update multiples rows of table: "evaluation_narratives" */
  update_evaluation_narratives_many: Maybe<
    Array<Maybe<EvaluationNarrativesMutationResponse>>
  >;
  /** update data of the table: "evaluation_questions" */
  update_evaluation_questions: Maybe<EvaluationQuestionsMutationResponse>;
  /** update single row of the table: "evaluation_questions" */
  update_evaluation_questions_by_pk: Maybe<EvaluationQuestions>;
  /** update multiples rows of table: "evaluation_questions" */
  update_evaluation_questions_many: Maybe<
    Array<Maybe<EvaluationQuestionsMutationResponse>>
  >;
  /** update data of the table: "evaluation_ratings" */
  update_evaluation_ratings: Maybe<EvaluationRatingsMutationResponse>;
  /** update single row of the table: "evaluation_ratings" */
  update_evaluation_ratings_by_pk: Maybe<EvaluationRatings>;
  /** update multiples rows of table: "evaluation_ratings" */
  update_evaluation_ratings_many: Maybe<
    Array<Maybe<EvaluationRatingsMutationResponse>>
  >;
  /** update data of the table: "evaluation_statistics" */
  update_evaluation_statistics: Maybe<EvaluationStatisticsMutationResponse>;
  /** update single row of the table: "evaluation_statistics" */
  update_evaluation_statistics_by_pk: Maybe<EvaluationStatistics>;
  /** update multiples rows of table: "evaluation_statistics" */
  update_evaluation_statistics_many: Maybe<
    Array<Maybe<EvaluationStatisticsMutationResponse>>
  >;
  /** update data of the table: "flags" */
  update_flags: Maybe<FlagsMutationResponse>;
  /** update single row of the table: "flags" */
  update_flags_by_pk: Maybe<Flags>;
  /** update multiples rows of table: "flags" */
  update_flags_many: Maybe<Array<Maybe<FlagsMutationResponse>>>;
  /** update data of the table: "listings" */
  update_listings: Maybe<ListingsMutationResponse>;
  /** update single row of the table: "listings" */
  update_listings_by_pk: Maybe<Listings>;
  /** update multiples rows of table: "listings" */
  update_listings_many: Maybe<Array<Maybe<ListingsMutationResponse>>>;
  /** update data of the table: "professors" */
  update_professors: Maybe<ProfessorsMutationResponse>;
  /** update single row of the table: "professors" */
  update_professors_by_pk: Maybe<Professors>;
  /** update multiples rows of table: "professors" */
  update_professors_many: Maybe<Array<Maybe<ProfessorsMutationResponse>>>;
  /** update data of the table: "seasons" */
  update_seasons: Maybe<SeasonsMutationResponse>;
  /** update single row of the table: "seasons" */
  update_seasons_by_pk: Maybe<Seasons>;
  /** update multiples rows of table: "seasons" */
  update_seasons_many: Maybe<Array<Maybe<SeasonsMutationResponse>>>;
};

/** mutation root */
export type MutationRootDeleteComputedListingInfoArgs = {
  where: ComputedListingInfoBoolExp;
};

/** mutation root */
export type MutationRootDeleteCourseFlagsArgs = {
  where: CourseFlagsBoolExp;
};

/** mutation root */
export type MutationRootDeleteCourseFlagsByPkArgs = {
  course_id: Scalars['Int']['input'];
  flag_id: Scalars['Int']['input'];
};

/** mutation root */
export type MutationRootDeleteCourseProfessorsArgs = {
  where: CourseProfessorsBoolExp;
};

/** mutation root */
export type MutationRootDeleteCourseProfessorsByPkArgs = {
  course_id: Scalars['Int']['input'];
  professor_id: Scalars['Int']['input'];
};

/** mutation root */
export type MutationRootDeleteCoursesArgs = {
  where: CoursesBoolExp;
};

/** mutation root */
export type MutationRootDeleteCoursesByPkArgs = {
  course_id: Scalars['Int']['input'];
};

/** mutation root */
export type MutationRootDeleteEvaluationNarrativesArgs = {
  where: EvaluationNarrativesBoolExp;
};

/** mutation root */
export type MutationRootDeleteEvaluationNarrativesByPkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type MutationRootDeleteEvaluationQuestionsArgs = {
  where: EvaluationQuestionsBoolExp;
};

/** mutation root */
export type MutationRootDeleteEvaluationQuestionsByPkArgs = {
  question_code: Scalars['String']['input'];
};

/** mutation root */
export type MutationRootDeleteEvaluationRatingsArgs = {
  where: EvaluationRatingsBoolExp;
};

/** mutation root */
export type MutationRootDeleteEvaluationRatingsByPkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type MutationRootDeleteEvaluationStatisticsArgs = {
  where: EvaluationStatisticsBoolExp;
};

/** mutation root */
export type MutationRootDeleteEvaluationStatisticsByPkArgs = {
  course_id: Scalars['Int']['input'];
};

/** mutation root */
export type MutationRootDeleteFlagsArgs = {
  where: FlagsBoolExp;
};

/** mutation root */
export type MutationRootDeleteFlagsByPkArgs = {
  flag_id: Scalars['Int']['input'];
};

/** mutation root */
export type MutationRootDeleteListingsArgs = {
  where: ListingsBoolExp;
};

/** mutation root */
export type MutationRootDeleteListingsByPkArgs = {
  listing_id: Scalars['Int']['input'];
};

/** mutation root */
export type MutationRootDeleteProfessorsArgs = {
  where: ProfessorsBoolExp;
};

/** mutation root */
export type MutationRootDeleteProfessorsByPkArgs = {
  professor_id: Scalars['Int']['input'];
};

/** mutation root */
export type MutationRootDeleteSeasonsArgs = {
  where: SeasonsBoolExp;
};

/** mutation root */
export type MutationRootDeleteSeasonsByPkArgs = {
  season_code: Scalars['String']['input'];
};

/** mutation root */
export type MutationRootInsertComputedListingInfoArgs = {
  objects: Array<ComputedListingInfoInsertInput>;
  on_conflict: InputMaybe<ComputedListingInfoOnConflict>;
};

/** mutation root */
export type MutationRootInsertComputedListingInfoOneArgs = {
  object: ComputedListingInfoInsertInput;
  on_conflict: InputMaybe<ComputedListingInfoOnConflict>;
};

/** mutation root */
export type MutationRootInsertCourseFlagsArgs = {
  objects: Array<CourseFlagsInsertInput>;
  on_conflict: InputMaybe<CourseFlagsOnConflict>;
};

/** mutation root */
export type MutationRootInsertCourseFlagsOneArgs = {
  object: CourseFlagsInsertInput;
  on_conflict: InputMaybe<CourseFlagsOnConflict>;
};

/** mutation root */
export type MutationRootInsertCourseProfessorsArgs = {
  objects: Array<CourseProfessorsInsertInput>;
  on_conflict: InputMaybe<CourseProfessorsOnConflict>;
};

/** mutation root */
export type MutationRootInsertCourseProfessorsOneArgs = {
  object: CourseProfessorsInsertInput;
  on_conflict: InputMaybe<CourseProfessorsOnConflict>;
};

/** mutation root */
export type MutationRootInsertCoursesArgs = {
  objects: Array<CoursesInsertInput>;
  on_conflict: InputMaybe<CoursesOnConflict>;
};

/** mutation root */
export type MutationRootInsertCoursesOneArgs = {
  object: CoursesInsertInput;
  on_conflict: InputMaybe<CoursesOnConflict>;
};

/** mutation root */
export type MutationRootInsertEvaluationNarrativesArgs = {
  objects: Array<EvaluationNarrativesInsertInput>;
  on_conflict: InputMaybe<EvaluationNarrativesOnConflict>;
};

/** mutation root */
export type MutationRootInsertEvaluationNarrativesOneArgs = {
  object: EvaluationNarrativesInsertInput;
  on_conflict: InputMaybe<EvaluationNarrativesOnConflict>;
};

/** mutation root */
export type MutationRootInsertEvaluationQuestionsArgs = {
  objects: Array<EvaluationQuestionsInsertInput>;
  on_conflict: InputMaybe<EvaluationQuestionsOnConflict>;
};

/** mutation root */
export type MutationRootInsertEvaluationQuestionsOneArgs = {
  object: EvaluationQuestionsInsertInput;
  on_conflict: InputMaybe<EvaluationQuestionsOnConflict>;
};

/** mutation root */
export type MutationRootInsertEvaluationRatingsArgs = {
  objects: Array<EvaluationRatingsInsertInput>;
  on_conflict: InputMaybe<EvaluationRatingsOnConflict>;
};

/** mutation root */
export type MutationRootInsertEvaluationRatingsOneArgs = {
  object: EvaluationRatingsInsertInput;
  on_conflict: InputMaybe<EvaluationRatingsOnConflict>;
};

/** mutation root */
export type MutationRootInsertEvaluationStatisticsArgs = {
  objects: Array<EvaluationStatisticsInsertInput>;
  on_conflict: InputMaybe<EvaluationStatisticsOnConflict>;
};

/** mutation root */
export type MutationRootInsertEvaluationStatisticsOneArgs = {
  object: EvaluationStatisticsInsertInput;
  on_conflict: InputMaybe<EvaluationStatisticsOnConflict>;
};

/** mutation root */
export type MutationRootInsertFlagsArgs = {
  objects: Array<FlagsInsertInput>;
  on_conflict: InputMaybe<FlagsOnConflict>;
};

/** mutation root */
export type MutationRootInsertFlagsOneArgs = {
  object: FlagsInsertInput;
  on_conflict: InputMaybe<FlagsOnConflict>;
};

/** mutation root */
export type MutationRootInsertListingsArgs = {
  objects: Array<ListingsInsertInput>;
  on_conflict: InputMaybe<ListingsOnConflict>;
};

/** mutation root */
export type MutationRootInsertListingsOneArgs = {
  object: ListingsInsertInput;
  on_conflict: InputMaybe<ListingsOnConflict>;
};

/** mutation root */
export type MutationRootInsertProfessorsArgs = {
  objects: Array<ProfessorsInsertInput>;
  on_conflict: InputMaybe<ProfessorsOnConflict>;
};

/** mutation root */
export type MutationRootInsertProfessorsOneArgs = {
  object: ProfessorsInsertInput;
  on_conflict: InputMaybe<ProfessorsOnConflict>;
};

/** mutation root */
export type MutationRootInsertSeasonsArgs = {
  objects: Array<SeasonsInsertInput>;
  on_conflict: InputMaybe<SeasonsOnConflict>;
};

/** mutation root */
export type MutationRootInsertSeasonsOneArgs = {
  object: SeasonsInsertInput;
  on_conflict: InputMaybe<SeasonsOnConflict>;
};

/** mutation root */
export type MutationRootUpdateComputedListingInfoArgs = {
  _append: InputMaybe<ComputedListingInfoAppendInput>;
  _delete_at_path: InputMaybe<ComputedListingInfoDeleteAtPathInput>;
  _delete_elem: InputMaybe<ComputedListingInfoDeleteElemInput>;
  _delete_key: InputMaybe<ComputedListingInfoDeleteKeyInput>;
  _inc: InputMaybe<ComputedListingInfoIncInput>;
  _prepend: InputMaybe<ComputedListingInfoPrependInput>;
  _set: InputMaybe<ComputedListingInfoSetInput>;
  where: ComputedListingInfoBoolExp;
};

/** mutation root */
export type MutationRootUpdateComputedListingInfoManyArgs = {
  updates: Array<ComputedListingInfoUpdates>;
};

/** mutation root */
export type MutationRootUpdateCourseFlagsArgs = {
  _inc: InputMaybe<CourseFlagsIncInput>;
  _set: InputMaybe<CourseFlagsSetInput>;
  where: CourseFlagsBoolExp;
};

/** mutation root */
export type MutationRootUpdateCourseFlagsByPkArgs = {
  _inc: InputMaybe<CourseFlagsIncInput>;
  _set: InputMaybe<CourseFlagsSetInput>;
  pk_columns: CourseFlagsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateCourseFlagsManyArgs = {
  updates: Array<CourseFlagsUpdates>;
};

/** mutation root */
export type MutationRootUpdateCourseProfessorsArgs = {
  _inc: InputMaybe<CourseProfessorsIncInput>;
  _set: InputMaybe<CourseProfessorsSetInput>;
  where: CourseProfessorsBoolExp;
};

/** mutation root */
export type MutationRootUpdateCourseProfessorsByPkArgs = {
  _inc: InputMaybe<CourseProfessorsIncInput>;
  _set: InputMaybe<CourseProfessorsSetInput>;
  pk_columns: CourseProfessorsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateCourseProfessorsManyArgs = {
  updates: Array<CourseProfessorsUpdates>;
};

/** mutation root */
export type MutationRootUpdateCoursesArgs = {
  _inc: InputMaybe<CoursesIncInput>;
  _set: InputMaybe<CoursesSetInput>;
  where: CoursesBoolExp;
};

/** mutation root */
export type MutationRootUpdateCoursesByPkArgs = {
  _inc: InputMaybe<CoursesIncInput>;
  _set: InputMaybe<CoursesSetInput>;
  pk_columns: CoursesPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateCoursesManyArgs = {
  updates: Array<CoursesUpdates>;
};

/** mutation root */
export type MutationRootUpdateEvaluationNarrativesArgs = {
  _inc: InputMaybe<EvaluationNarrativesIncInput>;
  _set: InputMaybe<EvaluationNarrativesSetInput>;
  where: EvaluationNarrativesBoolExp;
};

/** mutation root */
export type MutationRootUpdateEvaluationNarrativesByPkArgs = {
  _inc: InputMaybe<EvaluationNarrativesIncInput>;
  _set: InputMaybe<EvaluationNarrativesSetInput>;
  pk_columns: EvaluationNarrativesPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateEvaluationNarrativesManyArgs = {
  updates: Array<EvaluationNarrativesUpdates>;
};

/** mutation root */
export type MutationRootUpdateEvaluationQuestionsArgs = {
  _set: InputMaybe<EvaluationQuestionsSetInput>;
  where: EvaluationQuestionsBoolExp;
};

/** mutation root */
export type MutationRootUpdateEvaluationQuestionsByPkArgs = {
  _set: InputMaybe<EvaluationQuestionsSetInput>;
  pk_columns: EvaluationQuestionsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateEvaluationQuestionsManyArgs = {
  updates: Array<EvaluationQuestionsUpdates>;
};

/** mutation root */
export type MutationRootUpdateEvaluationRatingsArgs = {
  _inc: InputMaybe<EvaluationRatingsIncInput>;
  _set: InputMaybe<EvaluationRatingsSetInput>;
  where: EvaluationRatingsBoolExp;
};

/** mutation root */
export type MutationRootUpdateEvaluationRatingsByPkArgs = {
  _inc: InputMaybe<EvaluationRatingsIncInput>;
  _set: InputMaybe<EvaluationRatingsSetInput>;
  pk_columns: EvaluationRatingsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateEvaluationRatingsManyArgs = {
  updates: Array<EvaluationRatingsUpdates>;
};

/** mutation root */
export type MutationRootUpdateEvaluationStatisticsArgs = {
  _inc: InputMaybe<EvaluationStatisticsIncInput>;
  _set: InputMaybe<EvaluationStatisticsSetInput>;
  where: EvaluationStatisticsBoolExp;
};

/** mutation root */
export type MutationRootUpdateEvaluationStatisticsByPkArgs = {
  _inc: InputMaybe<EvaluationStatisticsIncInput>;
  _set: InputMaybe<EvaluationStatisticsSetInput>;
  pk_columns: EvaluationStatisticsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateEvaluationStatisticsManyArgs = {
  updates: Array<EvaluationStatisticsUpdates>;
};

/** mutation root */
export type MutationRootUpdateFlagsArgs = {
  _inc: InputMaybe<FlagsIncInput>;
  _set: InputMaybe<FlagsSetInput>;
  where: FlagsBoolExp;
};

/** mutation root */
export type MutationRootUpdateFlagsByPkArgs = {
  _inc: InputMaybe<FlagsIncInput>;
  _set: InputMaybe<FlagsSetInput>;
  pk_columns: FlagsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateFlagsManyArgs = {
  updates: Array<FlagsUpdates>;
};

/** mutation root */
export type MutationRootUpdateListingsArgs = {
  _inc: InputMaybe<ListingsIncInput>;
  _set: InputMaybe<ListingsSetInput>;
  where: ListingsBoolExp;
};

/** mutation root */
export type MutationRootUpdateListingsByPkArgs = {
  _inc: InputMaybe<ListingsIncInput>;
  _set: InputMaybe<ListingsSetInput>;
  pk_columns: ListingsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateListingsManyArgs = {
  updates: Array<ListingsUpdates>;
};

/** mutation root */
export type MutationRootUpdateProfessorsArgs = {
  _inc: InputMaybe<ProfessorsIncInput>;
  _set: InputMaybe<ProfessorsSetInput>;
  where: ProfessorsBoolExp;
};

/** mutation root */
export type MutationRootUpdateProfessorsByPkArgs = {
  _inc: InputMaybe<ProfessorsIncInput>;
  _set: InputMaybe<ProfessorsSetInput>;
  pk_columns: ProfessorsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateProfessorsManyArgs = {
  updates: Array<ProfessorsUpdates>;
};

/** mutation root */
export type MutationRootUpdateSeasonsArgs = {
  _inc: InputMaybe<SeasonsIncInput>;
  _set: InputMaybe<SeasonsSetInput>;
  where: SeasonsBoolExp;
};

/** mutation root */
export type MutationRootUpdateSeasonsByPkArgs = {
  _inc: InputMaybe<SeasonsIncInput>;
  _set: InputMaybe<SeasonsSetInput>;
  pk_columns: SeasonsPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateSeasonsManyArgs = {
  updates: Array<SeasonsUpdates>;
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
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Int']['output']>;
  /** An array relationship */
  course_professors: Array<CourseProfessors>;
  /** An aggregate relationship */
  course_professors_aggregate: CourseProfessorsAggregate;
  /** Email address of the professor */
  email: Maybe<Scalars['String']['output']>;
  /** Name of the professor */
  name: Scalars['String']['output'];
  /** Professor ID */
  professor_id: Scalars['Int']['output'];
};

/** columns and relationships of "professors" */
export type ProfessorsCourseProfessorsArgs = {
  distinct_on: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseProfessorsOrderBy>>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

/** columns and relationships of "professors" */
export type ProfessorsCourseProfessorsAggregateArgs = {
  distinct_on: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseProfessorsOrderBy>>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

/** aggregated selection of "professors" */
export type ProfessorsAggregate = {
  __typename?: 'professors_aggregate';
  aggregate: Maybe<ProfessorsAggregateFields>;
  nodes: Array<Professors>;
};

/** aggregate fields of "professors" */
export type ProfessorsAggregateFields = {
  __typename?: 'professors_aggregate_fields';
  avg: Maybe<ProfessorsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<ProfessorsMaxFields>;
  min: Maybe<ProfessorsMinFields>;
  stddev: Maybe<ProfessorsStddevFields>;
  stddev_pop: Maybe<ProfessorsStddevPopFields>;
  stddev_samp: Maybe<ProfessorsStddevSampFields>;
  sum: Maybe<ProfessorsSumFields>;
  var_pop: Maybe<ProfessorsVarPopFields>;
  var_samp: Maybe<ProfessorsVarSampFields>;
  variance: Maybe<ProfessorsVarianceFields>;
};

/** aggregate fields of "professors" */
export type ProfessorsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<ProfessorsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type ProfessorsAvgFields = {
  __typename?: 'professors_avg_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "professors". All fields are combined with a logical 'AND'. */
export type ProfessorsBoolExp = {
  _and: InputMaybe<Array<ProfessorsBoolExp>>;
  _not: InputMaybe<ProfessorsBoolExp>;
  _or: InputMaybe<Array<ProfessorsBoolExp>>;
  average_rating: InputMaybe<Float8ComparisonExp>;
  average_rating_n: InputMaybe<IntComparisonExp>;
  course_professors: InputMaybe<CourseProfessorsBoolExp>;
  course_professors_aggregate: InputMaybe<CourseProfessorsAggregateBoolExp>;
  email: InputMaybe<StringComparisonExp>;
  name: InputMaybe<StringComparisonExp>;
  professor_id: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "professors" */
export enum ProfessorsConstraint {
  /** unique or primary key constraint on columns "professor_id" */
  PkProfessorsStaged = 'pk_professors_staged',
}

/** input type for incrementing numeric columns in table "professors" */
export type ProfessorsIncInput = {
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  /** Professor ID */
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "professors" */
export type ProfessorsInsertInput = {
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  course_professors: InputMaybe<CourseProfessorsArrRelInsertInput>;
  /** Email address of the professor */
  email: InputMaybe<Scalars['String']['input']>;
  /** Name of the professor */
  name: InputMaybe<Scalars['String']['input']>;
  /** Professor ID */
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type ProfessorsMaxFields = {
  __typename?: 'professors_max_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Int']['output']>;
  /** Email address of the professor */
  email: Maybe<Scalars['String']['output']>;
  /** Name of the professor */
  name: Maybe<Scalars['String']['output']>;
  /** Professor ID */
  professor_id: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type ProfessorsMinFields = {
  __typename?: 'professors_min_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Int']['output']>;
  /** Email address of the professor */
  email: Maybe<Scalars['String']['output']>;
  /** Name of the professor */
  name: Maybe<Scalars['String']['output']>;
  /** Professor ID */
  professor_id: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "professors" */
export type ProfessorsMutationResponse = {
  __typename?: 'professors_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Professors>;
};

/** input type for inserting object relation for remote table "professors" */
export type ProfessorsObjRelInsertInput = {
  data: ProfessorsInsertInput;
  /** upsert condition */
  on_conflict: InputMaybe<ProfessorsOnConflict>;
};

/** on_conflict condition type for table "professors" */
export type ProfessorsOnConflict = {
  constraint: ProfessorsConstraint;
  update_columns: Array<ProfessorsUpdateColumn>;
  where: InputMaybe<ProfessorsBoolExp>;
};

/** Ordering options when selecting data from "professors". */
export type ProfessorsOrderBy = {
  average_rating: InputMaybe<OrderBy>;
  average_rating_n: InputMaybe<OrderBy>;
  course_professors_aggregate: InputMaybe<CourseProfessorsAggregateOrderBy>;
  email: InputMaybe<OrderBy>;
  name: InputMaybe<OrderBy>;
  professor_id: InputMaybe<OrderBy>;
};

/** primary key columns input for table: professors */
export type ProfessorsPkColumnsInput = {
  /** Professor ID */
  professor_id: Scalars['Int']['input'];
};

/** select columns of table "professors" */
export enum ProfessorsSelectColumn {
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingN = 'average_rating_n',
  /** column name */
  Email = 'email',
  /** column name */
  Name = 'name',
  /** column name */
  ProfessorId = 'professor_id',
}

/** input type for updating data in table "professors" */
export type ProfessorsSetInput = {
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  /** Email address of the professor */
  email: InputMaybe<Scalars['String']['input']>;
  /** Name of the professor */
  name: InputMaybe<Scalars['String']['input']>;
  /** Professor ID */
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type ProfessorsStddevFields = {
  __typename?: 'professors_stddev_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type ProfessorsStddevPopFields = {
  __typename?: 'professors_stddev_pop_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type ProfessorsStddevSampFields = {
  __typename?: 'professors_stddev_samp_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "professors" */
export type ProfessorsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ProfessorsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ProfessorsStreamCursorValueInput = {
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  /** Email address of the professor */
  email: InputMaybe<Scalars['String']['input']>;
  /** Name of the professor */
  name: InputMaybe<Scalars['String']['input']>;
  /** Professor ID */
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type ProfessorsSumFields = {
  __typename?: 'professors_sum_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Int']['output']>;
  /** Professor ID */
  professor_id: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "professors" */
export enum ProfessorsUpdateColumn {
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingN = 'average_rating_n',
  /** column name */
  Email = 'email',
  /** column name */
  Name = 'name',
  /** column name */
  ProfessorId = 'professor_id',
}

export type ProfessorsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<ProfessorsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<ProfessorsSetInput>;
  /** filter the rows which have to be updated */
  where: ProfessorsBoolExp;
};

/** aggregate var_pop on columns */
export type ProfessorsVarPopFields = {
  __typename?: 'professors_var_pop_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type ProfessorsVarSampFields = {
  __typename?: 'professors_var_samp_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type ProfessorsVarianceFields = {
  __typename?: 'professors_variance_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id: Maybe<Scalars['Float']['output']>;
};

export type QueryRoot = {
  __typename?: 'query_root';
  /** fetch data from the table: "computed_listing_info" */
  computed_listing_info: Array<ComputedListingInfo>;
  /** fetch aggregated fields from the table: "computed_listing_info" */
  computed_listing_info_aggregate: ComputedListingInfoAggregate;
  /** An array relationship */
  course_flags: Array<CourseFlags>;
  /** An aggregate relationship */
  course_flags_aggregate: CourseFlagsAggregate;
  /** fetch data from the table: "course_flags" using primary key columns */
  course_flags_by_pk: Maybe<CourseFlags>;
  /** An array relationship */
  course_professors: Array<CourseProfessors>;
  /** An aggregate relationship */
  course_professors_aggregate: CourseProfessorsAggregate;
  /** fetch data from the table: "course_professors" using primary key columns */
  course_professors_by_pk: Maybe<CourseProfessors>;
  /** An array relationship */
  courses: Array<Courses>;
  /** An aggregate relationship */
  courses_aggregate: CoursesAggregate;
  /** fetch data from the table: "courses" using primary key columns */
  courses_by_pk: Maybe<Courses>;
  /** An array relationship */
  evaluation_narratives: Array<EvaluationNarratives>;
  /** An aggregate relationship */
  evaluation_narratives_aggregate: EvaluationNarrativesAggregate;
  /** fetch data from the table: "evaluation_narratives" using primary key columns */
  evaluation_narratives_by_pk: Maybe<EvaluationNarratives>;
  /** fetch data from the table: "evaluation_questions" */
  evaluation_questions: Array<EvaluationQuestions>;
  /** fetch aggregated fields from the table: "evaluation_questions" */
  evaluation_questions_aggregate: EvaluationQuestionsAggregate;
  /** fetch data from the table: "evaluation_questions" using primary key columns */
  evaluation_questions_by_pk: Maybe<EvaluationQuestions>;
  /** An array relationship */
  evaluation_ratings: Array<EvaluationRatings>;
  /** An aggregate relationship */
  evaluation_ratings_aggregate: EvaluationRatingsAggregate;
  /** fetch data from the table: "evaluation_ratings" using primary key columns */
  evaluation_ratings_by_pk: Maybe<EvaluationRatings>;
  /** fetch data from the table: "evaluation_statistics" */
  evaluation_statistics: Array<EvaluationStatistics>;
  /** fetch aggregated fields from the table: "evaluation_statistics" */
  evaluation_statistics_aggregate: EvaluationStatisticsAggregate;
  /** fetch data from the table: "evaluation_statistics" using primary key columns */
  evaluation_statistics_by_pk: Maybe<EvaluationStatistics>;
  /** fetch data from the table: "flags" */
  flags: Array<Flags>;
  /** fetch aggregated fields from the table: "flags" */
  flags_aggregate: FlagsAggregate;
  /** fetch data from the table: "flags" using primary key columns */
  flags_by_pk: Maybe<Flags>;
  /** An array relationship */
  listings: Array<Listings>;
  /** An aggregate relationship */
  listings_aggregate: ListingsAggregate;
  /** fetch data from the table: "listings" using primary key columns */
  listings_by_pk: Maybe<Listings>;
  /** fetch data from the table: "professors" */
  professors: Array<Professors>;
  /** fetch aggregated fields from the table: "professors" */
  professors_aggregate: ProfessorsAggregate;
  /** fetch data from the table: "professors" using primary key columns */
  professors_by_pk: Maybe<Professors>;
  /** fetch data from the table: "seasons" */
  seasons: Array<Seasons>;
  /** fetch aggregated fields from the table: "seasons" */
  seasons_aggregate: SeasonsAggregate;
  /** fetch data from the table: "seasons" using primary key columns */
  seasons_by_pk: Maybe<Seasons>;
};

export type QueryRootComputedListingInfoArgs = {
  distinct_on: InputMaybe<Array<ComputedListingInfoSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ComputedListingInfoOrderBy>>;
  where: InputMaybe<ComputedListingInfoBoolExp>;
};

export type QueryRootComputedListingInfoAggregateArgs = {
  distinct_on: InputMaybe<Array<ComputedListingInfoSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ComputedListingInfoOrderBy>>;
  where: InputMaybe<ComputedListingInfoBoolExp>;
};

export type QueryRootCourseFlagsArgs = {
  distinct_on: InputMaybe<Array<CourseFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseFlagsOrderBy>>;
  where: InputMaybe<CourseFlagsBoolExp>;
};

export type QueryRootCourseFlagsAggregateArgs = {
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

export type QueryRootCourseProfessorsArgs = {
  distinct_on: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseProfessorsOrderBy>>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

export type QueryRootCourseProfessorsAggregateArgs = {
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

export type QueryRootCoursesAggregateArgs = {
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

export type QueryRootEvaluationNarrativesAggregateArgs = {
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

export type QueryRootEvaluationQuestionsAggregateArgs = {
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

export type QueryRootEvaluationRatingsAggregateArgs = {
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

export type QueryRootEvaluationStatisticsAggregateArgs = {
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

export type QueryRootFlagsAggregateArgs = {
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

export type QueryRootListingsAggregateArgs = {
  distinct_on: InputMaybe<Array<ListingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ListingsOrderBy>>;
  where: InputMaybe<ListingsBoolExp>;
};

export type QueryRootListingsByPkArgs = {
  listing_id: Scalars['Int']['input'];
};

export type QueryRootProfessorsArgs = {
  distinct_on: InputMaybe<Array<ProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ProfessorsOrderBy>>;
  where: InputMaybe<ProfessorsBoolExp>;
};

export type QueryRootProfessorsAggregateArgs = {
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

export type QueryRootSeasonsAggregateArgs = {
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
  /** An array relationship */
  coursesBySeasonCode: Array<Courses>;
  /** An aggregate relationship */
  coursesBySeasonCode_aggregate: CoursesAggregate;
  /** An aggregate relationship */
  courses_aggregate: CoursesAggregate;
  /** An array relationship */
  listings: Array<Listings>;
  /** An aggregate relationship */
  listings_aggregate: ListingsAggregate;
  /** Season code (e.g. '202001') */
  season_code: Scalars['String']['output'];
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: Scalars['String']['output'];
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
export type SeasonsCoursesBySeasonCodeArgs = {
  distinct_on: InputMaybe<Array<CoursesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CoursesOrderBy>>;
  where: InputMaybe<CoursesBoolExp>;
};

/** columns and relationships of "seasons" */
export type SeasonsCoursesBySeasonCodeAggregateArgs = {
  distinct_on: InputMaybe<Array<CoursesSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CoursesOrderBy>>;
  where: InputMaybe<CoursesBoolExp>;
};

/** columns and relationships of "seasons" */
export type SeasonsCoursesAggregateArgs = {
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

/** columns and relationships of "seasons" */
export type SeasonsListingsAggregateArgs = {
  distinct_on: InputMaybe<Array<ListingsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ListingsOrderBy>>;
  where: InputMaybe<ListingsBoolExp>;
};

/** aggregated selection of "seasons" */
export type SeasonsAggregate = {
  __typename?: 'seasons_aggregate';
  aggregate: Maybe<SeasonsAggregateFields>;
  nodes: Array<Seasons>;
};

/** aggregate fields of "seasons" */
export type SeasonsAggregateFields = {
  __typename?: 'seasons_aggregate_fields';
  avg: Maybe<SeasonsAvgFields>;
  count: Scalars['Int']['output'];
  max: Maybe<SeasonsMaxFields>;
  min: Maybe<SeasonsMinFields>;
  stddev: Maybe<SeasonsStddevFields>;
  stddev_pop: Maybe<SeasonsStddevPopFields>;
  stddev_samp: Maybe<SeasonsStddevSampFields>;
  sum: Maybe<SeasonsSumFields>;
  var_pop: Maybe<SeasonsVarPopFields>;
  var_samp: Maybe<SeasonsVarSampFields>;
  variance: Maybe<SeasonsVarianceFields>;
};

/** aggregate fields of "seasons" */
export type SeasonsAggregateFieldsCountArgs = {
  columns: InputMaybe<Array<SeasonsSelectColumn>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type SeasonsAvgFields = {
  __typename?: 'seasons_avg_fields';
  /** [computed] Year of the semester */
  year: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "seasons". All fields are combined with a logical 'AND'. */
export type SeasonsBoolExp = {
  _and: InputMaybe<Array<SeasonsBoolExp>>;
  _not: InputMaybe<SeasonsBoolExp>;
  _or: InputMaybe<Array<SeasonsBoolExp>>;
  courses: InputMaybe<CoursesBoolExp>;
  coursesBySeasonCode: InputMaybe<CoursesBoolExp>;
  coursesBySeasonCode_aggregate: InputMaybe<CoursesAggregateBoolExp>;
  courses_aggregate: InputMaybe<CoursesAggregateBoolExp>;
  listings: InputMaybe<ListingsBoolExp>;
  listings_aggregate: InputMaybe<ListingsAggregateBoolExp>;
  season_code: InputMaybe<StringComparisonExp>;
  term: InputMaybe<StringComparisonExp>;
  year: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "seasons" */
export enum SeasonsConstraint {
  /** unique or primary key constraint on columns "season_code" */
  PkSeasonsStaged = 'pk_seasons_staged',
}

/** input type for incrementing numeric columns in table "seasons" */
export type SeasonsIncInput = {
  /** [computed] Year of the semester */
  year: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "seasons" */
export type SeasonsInsertInput = {
  courses: InputMaybe<CoursesArrRelInsertInput>;
  coursesBySeasonCode: InputMaybe<CoursesArrRelInsertInput>;
  listings: InputMaybe<ListingsArrRelInsertInput>;
  /** Season code (e.g. '202001') */
  season_code: InputMaybe<Scalars['String']['input']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: InputMaybe<Scalars['String']['input']>;
  /** [computed] Year of the semester */
  year: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type SeasonsMaxFields = {
  __typename?: 'seasons_max_fields';
  /** Season code (e.g. '202001') */
  season_code: Maybe<Scalars['String']['output']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: Maybe<Scalars['String']['output']>;
  /** [computed] Year of the semester */
  year: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type SeasonsMinFields = {
  __typename?: 'seasons_min_fields';
  /** Season code (e.g. '202001') */
  season_code: Maybe<Scalars['String']['output']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: Maybe<Scalars['String']['output']>;
  /** [computed] Year of the semester */
  year: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "seasons" */
export type SeasonsMutationResponse = {
  __typename?: 'seasons_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Seasons>;
};

/** input type for inserting object relation for remote table "seasons" */
export type SeasonsObjRelInsertInput = {
  data: SeasonsInsertInput;
  /** upsert condition */
  on_conflict: InputMaybe<SeasonsOnConflict>;
};

/** on_conflict condition type for table "seasons" */
export type SeasonsOnConflict = {
  constraint: SeasonsConstraint;
  update_columns: Array<SeasonsUpdateColumn>;
  where: InputMaybe<SeasonsBoolExp>;
};

/** Ordering options when selecting data from "seasons". */
export type SeasonsOrderBy = {
  coursesBySeasonCode_aggregate: InputMaybe<CoursesAggregateOrderBy>;
  courses_aggregate: InputMaybe<CoursesAggregateOrderBy>;
  listings_aggregate: InputMaybe<ListingsAggregateOrderBy>;
  season_code: InputMaybe<OrderBy>;
  term: InputMaybe<OrderBy>;
  year: InputMaybe<OrderBy>;
};

/** primary key columns input for table: seasons */
export type SeasonsPkColumnsInput = {
  /** Season code (e.g. '202001') */
  season_code: Scalars['String']['input'];
};

/** select columns of table "seasons" */
export enum SeasonsSelectColumn {
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Term = 'term',
  /** column name */
  Year = 'year',
}

/** input type for updating data in table "seasons" */
export type SeasonsSetInput = {
  /** Season code (e.g. '202001') */
  season_code: InputMaybe<Scalars['String']['input']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: InputMaybe<Scalars['String']['input']>;
  /** [computed] Year of the semester */
  year: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type SeasonsStddevFields = {
  __typename?: 'seasons_stddev_fields';
  /** [computed] Year of the semester */
  year: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type SeasonsStddevPopFields = {
  __typename?: 'seasons_stddev_pop_fields';
  /** [computed] Year of the semester */
  year: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type SeasonsStddevSampFields = {
  __typename?: 'seasons_stddev_samp_fields';
  /** [computed] Year of the semester */
  year: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "seasons" */
export type SeasonsStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: SeasonsStreamCursorValueInput;
  /** cursor ordering */
  ordering: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type SeasonsStreamCursorValueInput = {
  /** Season code (e.g. '202001') */
  season_code: InputMaybe<Scalars['String']['input']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: InputMaybe<Scalars['String']['input']>;
  /** [computed] Year of the semester */
  year: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type SeasonsSumFields = {
  __typename?: 'seasons_sum_fields';
  /** [computed] Year of the semester */
  year: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "seasons" */
export enum SeasonsUpdateColumn {
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Term = 'term',
  /** column name */
  Year = 'year',
}

export type SeasonsUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<SeasonsIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<SeasonsSetInput>;
  /** filter the rows which have to be updated */
  where: SeasonsBoolExp;
};

/** aggregate var_pop on columns */
export type SeasonsVarPopFields = {
  __typename?: 'seasons_var_pop_fields';
  /** [computed] Year of the semester */
  year: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type SeasonsVarSampFields = {
  __typename?: 'seasons_var_samp_fields';
  /** [computed] Year of the semester */
  year: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type SeasonsVarianceFields = {
  __typename?: 'seasons_variance_fields';
  /** [computed] Year of the semester */
  year: Maybe<Scalars['Float']['output']>;
};

export type SubscriptionRoot = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "computed_listing_info" */
  computed_listing_info: Array<ComputedListingInfo>;
  /** fetch aggregated fields from the table: "computed_listing_info" */
  computed_listing_info_aggregate: ComputedListingInfoAggregate;
  /** fetch data from the table in a streaming manner: "computed_listing_info" */
  computed_listing_info_stream: Array<ComputedListingInfo>;
  /** An array relationship */
  course_flags: Array<CourseFlags>;
  /** An aggregate relationship */
  course_flags_aggregate: CourseFlagsAggregate;
  /** fetch data from the table: "course_flags" using primary key columns */
  course_flags_by_pk: Maybe<CourseFlags>;
  /** fetch data from the table in a streaming manner: "course_flags" */
  course_flags_stream: Array<CourseFlags>;
  /** An array relationship */
  course_professors: Array<CourseProfessors>;
  /** An aggregate relationship */
  course_professors_aggregate: CourseProfessorsAggregate;
  /** fetch data from the table: "course_professors" using primary key columns */
  course_professors_by_pk: Maybe<CourseProfessors>;
  /** fetch data from the table in a streaming manner: "course_professors" */
  course_professors_stream: Array<CourseProfessors>;
  /** An array relationship */
  courses: Array<Courses>;
  /** An aggregate relationship */
  courses_aggregate: CoursesAggregate;
  /** fetch data from the table: "courses" using primary key columns */
  courses_by_pk: Maybe<Courses>;
  /** fetch data from the table in a streaming manner: "courses" */
  courses_stream: Array<Courses>;
  /** An array relationship */
  evaluation_narratives: Array<EvaluationNarratives>;
  /** An aggregate relationship */
  evaluation_narratives_aggregate: EvaluationNarrativesAggregate;
  /** fetch data from the table: "evaluation_narratives" using primary key columns */
  evaluation_narratives_by_pk: Maybe<EvaluationNarratives>;
  /** fetch data from the table in a streaming manner: "evaluation_narratives" */
  evaluation_narratives_stream: Array<EvaluationNarratives>;
  /** fetch data from the table: "evaluation_questions" */
  evaluation_questions: Array<EvaluationQuestions>;
  /** fetch aggregated fields from the table: "evaluation_questions" */
  evaluation_questions_aggregate: EvaluationQuestionsAggregate;
  /** fetch data from the table: "evaluation_questions" using primary key columns */
  evaluation_questions_by_pk: Maybe<EvaluationQuestions>;
  /** fetch data from the table in a streaming manner: "evaluation_questions" */
  evaluation_questions_stream: Array<EvaluationQuestions>;
  /** An array relationship */
  evaluation_ratings: Array<EvaluationRatings>;
  /** An aggregate relationship */
  evaluation_ratings_aggregate: EvaluationRatingsAggregate;
  /** fetch data from the table: "evaluation_ratings" using primary key columns */
  evaluation_ratings_by_pk: Maybe<EvaluationRatings>;
  /** fetch data from the table in a streaming manner: "evaluation_ratings" */
  evaluation_ratings_stream: Array<EvaluationRatings>;
  /** fetch data from the table: "evaluation_statistics" */
  evaluation_statistics: Array<EvaluationStatistics>;
  /** fetch aggregated fields from the table: "evaluation_statistics" */
  evaluation_statistics_aggregate: EvaluationStatisticsAggregate;
  /** fetch data from the table: "evaluation_statistics" using primary key columns */
  evaluation_statistics_by_pk: Maybe<EvaluationStatistics>;
  /** fetch data from the table in a streaming manner: "evaluation_statistics" */
  evaluation_statistics_stream: Array<EvaluationStatistics>;
  /** fetch data from the table: "flags" */
  flags: Array<Flags>;
  /** fetch aggregated fields from the table: "flags" */
  flags_aggregate: FlagsAggregate;
  /** fetch data from the table: "flags" using primary key columns */
  flags_by_pk: Maybe<Flags>;
  /** fetch data from the table in a streaming manner: "flags" */
  flags_stream: Array<Flags>;
  /** An array relationship */
  listings: Array<Listings>;
  /** An aggregate relationship */
  listings_aggregate: ListingsAggregate;
  /** fetch data from the table: "listings" using primary key columns */
  listings_by_pk: Maybe<Listings>;
  /** fetch data from the table in a streaming manner: "listings" */
  listings_stream: Array<Listings>;
  /** fetch data from the table: "professors" */
  professors: Array<Professors>;
  /** fetch aggregated fields from the table: "professors" */
  professors_aggregate: ProfessorsAggregate;
  /** fetch data from the table: "professors" using primary key columns */
  professors_by_pk: Maybe<Professors>;
  /** fetch data from the table in a streaming manner: "professors" */
  professors_stream: Array<Professors>;
  /** fetch data from the table: "seasons" */
  seasons: Array<Seasons>;
  /** fetch aggregated fields from the table: "seasons" */
  seasons_aggregate: SeasonsAggregate;
  /** fetch data from the table: "seasons" using primary key columns */
  seasons_by_pk: Maybe<Seasons>;
  /** fetch data from the table in a streaming manner: "seasons" */
  seasons_stream: Array<Seasons>;
};

export type SubscriptionRootComputedListingInfoArgs = {
  distinct_on: InputMaybe<Array<ComputedListingInfoSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ComputedListingInfoOrderBy>>;
  where: InputMaybe<ComputedListingInfoBoolExp>;
};

export type SubscriptionRootComputedListingInfoAggregateArgs = {
  distinct_on: InputMaybe<Array<ComputedListingInfoSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ComputedListingInfoOrderBy>>;
  where: InputMaybe<ComputedListingInfoBoolExp>;
};

export type SubscriptionRootComputedListingInfoStreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ComputedListingInfoStreamCursorInput>>;
  where: InputMaybe<ComputedListingInfoBoolExp>;
};

export type SubscriptionRootCourseFlagsArgs = {
  distinct_on: InputMaybe<Array<CourseFlagsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseFlagsOrderBy>>;
  where: InputMaybe<CourseFlagsBoolExp>;
};

export type SubscriptionRootCourseFlagsAggregateArgs = {
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

export type SubscriptionRootCourseProfessorsArgs = {
  distinct_on: InputMaybe<Array<CourseProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<CourseProfessorsOrderBy>>;
  where: InputMaybe<CourseProfessorsBoolExp>;
};

export type SubscriptionRootCourseProfessorsAggregateArgs = {
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

export type SubscriptionRootCoursesAggregateArgs = {
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

export type SubscriptionRootEvaluationNarrativesAggregateArgs = {
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

export type SubscriptionRootEvaluationQuestionsAggregateArgs = {
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

export type SubscriptionRootEvaluationRatingsAggregateArgs = {
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

export type SubscriptionRootEvaluationStatisticsAggregateArgs = {
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

export type SubscriptionRootFlagsAggregateArgs = {
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

export type SubscriptionRootListingsAggregateArgs = {
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

export type SubscriptionRootProfessorsArgs = {
  distinct_on: InputMaybe<Array<ProfessorsSelectColumn>>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  order_by: InputMaybe<Array<ProfessorsOrderBy>>;
  where: InputMaybe<ProfessorsBoolExp>;
};

export type SubscriptionRootProfessorsAggregateArgs = {
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

export type SubscriptionRootSeasonsAggregateArgs = {
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

export type SameCourseOrProfOfferingsQueryVariables = Exact<{
  seasonCode: Scalars['String']['input'];
  crn: Scalars['Int']['input'];
  same_course_id: Scalars['Int']['input'];
  professor_ids: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
  hasEval: Scalars['Boolean']['input'];
}>;

export type SameCourseOrProfOfferingsQuery = {
  __typename?: 'query_root';
  self: Array<{
    __typename?: 'computed_listing_info';
    description: string;
    requirements: string;
    syllabus_url: string | null;
    professor_names: StringArr;
    times_by_day: TimesByDay;
    section: string;
    flag_info: StringArr;
    enrolled?: number | null;
    last_enrollment?: number | null;
    last_enrollment_same_professors?: boolean | null;
    credits: number | null;
    classnotes: string | null;
    regnotes: string | null;
    rp_attr: string | null;
    final_exam: string | null;
    season_code: Season;
    crn: Crn;
    course_code: string;
    same_course_id: number;
    professor_ids: StringArr;
  }>;
  others: Array<{
    __typename?: 'computed_listing_info';
    professor_info?: ProfessorInfo | null;
    professor_names: StringArr;
    syllabus_url: string | null;
    season_code: Season;
    crn: Crn;
    title: string;
    course_code: string;
    all_course_codes: StringArr;
    section: string;
    skills: StringArr;
    areas: StringArr;
    extra_info: ExtraInfo;
    description: string;
    times_by_day: TimesByDay;
    same_course_id: number;
    professor_ids: StringArr;
    course?: {
      __typename?: 'courses';
      evaluation_statistic: {
        __typename?: 'evaluation_statistics';
        avg_workload: number | null;
        avg_rating: number | null;
      } | null;
    };
  }>;
};

export type SearchEvaluationNarrativesQueryVariables = Exact<{
  season_code: InputMaybe<Scalars['String']['input']>;
  crn: InputMaybe<Scalars['Int']['input']>;
}>;

export type SearchEvaluationNarrativesQuery = {
  __typename?: 'query_root';
  listings: Array<{
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
        enrolled: number | null;
      } | null;
    };
  }>;
};

export const SameCourseOrProfOfferingsDocument = gql`
  query SameCourseOrProfOfferings(
    $seasonCode: String!
    $crn: Int!
    $same_course_id: Int!
    $professor_ids: [String!]
    $hasEval: Boolean!
  ) {
    self: computed_listing_info(
      where: { season_code: { _eq: $seasonCode }, crn: { _eq: $crn } }
    ) {
      description
      requirements
      syllabus_url
      professor_names
      times_by_day
      section
      flag_info
      enrolled @include(if: $hasEval)
      last_enrollment @include(if: $hasEval)
      last_enrollment_same_professors @include(if: $hasEval)
      credits
      classnotes
      regnotes
      rp_attr
      final_exam
      season_code
      crn
      course_code
      same_course_id
      professor_ids
    }
    others: computed_listing_info(
      where: {
        _or: [
          { same_course_id: { _eq: $same_course_id } }
          { professor_ids: { _has_keys_any: $professor_ids } }
        ]
      }
    ) {
      course @include(if: $hasEval) {
        evaluation_statistic {
          avg_workload
          avg_rating
        }
      }
      professor_info @include(if: $hasEval)
      professor_names
      syllabus_url
      season_code
      crn
      title
      course_code
      all_course_codes
      section
      skills
      areas
      extra_info
      description
      times_by_day
      same_course_id
      professor_ids
    }
  }
`;

/**
 * __useSameCourseOrProfOfferingsQuery__
 *
 * To run a query within a React component, call `useSameCourseOrProfOfferingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSameCourseOrProfOfferingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSameCourseOrProfOfferingsQuery({
 *   variables: {
 *      seasonCode: // value for 'seasonCode'
 *      crn: // value for 'crn'
 *      same_course_id: // value for 'same_course_id'
 *      professor_ids: // value for 'professor_ids'
 *      hasEval: // value for 'hasEval'
 *   },
 * });
 */
export function useSameCourseOrProfOfferingsQuery(
  baseOptions: Apollo.QueryHookOptions<
    SameCourseOrProfOfferingsQuery,
    SameCourseOrProfOfferingsQueryVariables
  > &
    (
      | { variables: SameCourseOrProfOfferingsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SameCourseOrProfOfferingsQuery,
    SameCourseOrProfOfferingsQueryVariables
  >(SameCourseOrProfOfferingsDocument, options);
}
export function useSameCourseOrProfOfferingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SameCourseOrProfOfferingsQuery,
    SameCourseOrProfOfferingsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SameCourseOrProfOfferingsQuery,
    SameCourseOrProfOfferingsQueryVariables
  >(SameCourseOrProfOfferingsDocument, options);
}
export function useSameCourseOrProfOfferingsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SameCourseOrProfOfferingsQuery,
    SameCourseOrProfOfferingsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SameCourseOrProfOfferingsQuery,
    SameCourseOrProfOfferingsQueryVariables
  >(SameCourseOrProfOfferingsDocument, options);
}
export type SameCourseOrProfOfferingsQueryHookResult = ReturnType<
  typeof useSameCourseOrProfOfferingsQuery
>;
export type SameCourseOrProfOfferingsLazyQueryHookResult = ReturnType<
  typeof useSameCourseOrProfOfferingsLazyQuery
>;
export type SameCourseOrProfOfferingsSuspenseQueryHookResult = ReturnType<
  typeof useSameCourseOrProfOfferingsSuspenseQuery
>;
export type SameCourseOrProfOfferingsQueryResult = Apollo.QueryResult<
  SameCourseOrProfOfferingsQuery,
  SameCourseOrProfOfferingsQueryVariables
>;
export const SearchEvaluationNarrativesDocument = gql`
  query SearchEvaluationNarratives($season_code: String, $crn: Int) {
    listings(
      where: { season_code: { _eq: $season_code }, crn: { _eq: $crn } }
    ) {
      course {
        evaluation_narratives {
          comment
          evaluation_question {
            question_text
            tag
          }
        }
        evaluation_ratings {
          rating
          evaluation_question {
            question_text
            options
            tag
          }
        }
        evaluation_statistic {
          enrolled
        }
      }
    }
  }
`;

/**
 * __useSearchEvaluationNarrativesQuery__
 *
 * To run a query within a React component, call `useSearchEvaluationNarrativesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEvaluationNarrativesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEvaluationNarrativesQuery({
 *   variables: {
 *      season_code: // value for 'season_code'
 *      crn: // value for 'crn'
 *   },
 * });
 */
export function useSearchEvaluationNarrativesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SearchEvaluationNarrativesQuery,
    SearchEvaluationNarrativesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SearchEvaluationNarrativesQuery,
    SearchEvaluationNarrativesQueryVariables
  >(SearchEvaluationNarrativesDocument, options);
}
export function useSearchEvaluationNarrativesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchEvaluationNarrativesQuery,
    SearchEvaluationNarrativesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SearchEvaluationNarrativesQuery,
    SearchEvaluationNarrativesQueryVariables
  >(SearchEvaluationNarrativesDocument, options);
}
export function useSearchEvaluationNarrativesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SearchEvaluationNarrativesQuery,
    SearchEvaluationNarrativesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SearchEvaluationNarrativesQuery,
    SearchEvaluationNarrativesQueryVariables
  >(SearchEvaluationNarrativesDocument, options);
}
export type SearchEvaluationNarrativesQueryHookResult = ReturnType<
  typeof useSearchEvaluationNarrativesQuery
>;
export type SearchEvaluationNarrativesLazyQueryHookResult = ReturnType<
  typeof useSearchEvaluationNarrativesLazyQuery
>;
export type SearchEvaluationNarrativesSuspenseQueryHookResult = ReturnType<
  typeof useSearchEvaluationNarrativesSuspenseQuery
>;
export type SearchEvaluationNarrativesQueryResult = Apollo.QueryResult<
  SearchEvaluationNarrativesQuery,
  SearchEvaluationNarrativesQueryVariables
>;
