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
  float8: { input: number; output: number };
  json: { input: any; output: any };
  jsonb: { input: any; output: any };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
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
export type Int_Comparison_Exp = {
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
export type String_Comparison_Exp = {
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

export type Computed_Listing_Info_Aggregate_Bool_Exp = {
  avg: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Avg>;
  bool_and: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Bool_And>;
  bool_or: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Bool_Or>;
  corr: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Corr>;
  count: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Count>;
  covar_samp: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Covar_Samp>;
  max: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Max>;
  min: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Min>;
  stddev_samp: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Stddev_Samp>;
  sum: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Sum>;
  var_samp: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp_Var_Samp>;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Avg = {
  arguments: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Bool_And = {
  arguments: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Corr = {
  arguments: Computed_Listing_Info_Aggregate_Bool_Exp_Corr_Arguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Corr_Arguments = {
  X: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Count = {
  arguments: InputMaybe<Array<Computed_Listing_Info_Select_Column>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: Computed_Listing_Info_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Max = {
  arguments: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Min = {
  arguments: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Sum = {
  arguments: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Computed_Listing_Info_Aggregate_Bool_Exp_Var_Samp = {
  arguments: Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

/** order by aggregate values of table "computed_listing_info" */
export type Computed_Listing_Info_Aggregate_Order_By = {
  avg: InputMaybe<Computed_Listing_Info_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Computed_Listing_Info_Max_Order_By>;
  min: InputMaybe<Computed_Listing_Info_Min_Order_By>;
  stddev: InputMaybe<Computed_Listing_Info_Stddev_Order_By>;
  stddev_pop: InputMaybe<Computed_Listing_Info_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Computed_Listing_Info_Stddev_Samp_Order_By>;
  sum: InputMaybe<Computed_Listing_Info_Sum_Order_By>;
  var_pop: InputMaybe<Computed_Listing_Info_Var_Pop_Order_By>;
  var_samp: InputMaybe<Computed_Listing_Info_Var_Samp_Order_By>;
  variance: InputMaybe<Computed_Listing_Info_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Computed_Listing_Info_Append_Input = {
  all_course_codes: InputMaybe<Scalars['jsonb']['input']>;
  areas: InputMaybe<Scalars['jsonb']['input']>;
  flag_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_ids: InputMaybe<Scalars['jsonb']['input']>;
  professor_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_names: InputMaybe<Scalars['jsonb']['input']>;
  skills: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "computed_listing_info" */
export type Computed_Listing_Info_Arr_Rel_Insert_Input = {
  data: Array<Computed_Listing_Info_Insert_Input>;
  /** upsert condition */
  on_conflict: InputMaybe<Computed_Listing_Info_On_Conflict>;
};

/** order by avg() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Avg_Order_By = {
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "computed_listing_info". All fields are combined with a logical 'AND'. */
export type Computed_Listing_Info_Bool_Exp = {
  _and: InputMaybe<Array<Computed_Listing_Info_Bool_Exp>>;
  _not: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  _or: InputMaybe<Array<Computed_Listing_Info_Bool_Exp>>;
  all_course_codes: InputMaybe<Jsonb_Comparison_Exp>;
  areas: InputMaybe<Jsonb_Comparison_Exp>;
  average_gut_rating: InputMaybe<Float8_Comparison_Exp>;
  average_professor: InputMaybe<Float8_Comparison_Exp>;
  average_rating: InputMaybe<Float8_Comparison_Exp>;
  average_rating_n: InputMaybe<Int_Comparison_Exp>;
  average_rating_same_professors: InputMaybe<Float8_Comparison_Exp>;
  average_rating_same_professors_n: InputMaybe<Int_Comparison_Exp>;
  average_workload: InputMaybe<Float8_Comparison_Exp>;
  average_workload_n: InputMaybe<Int_Comparison_Exp>;
  average_workload_same_professors: InputMaybe<Float8_Comparison_Exp>;
  average_workload_same_professors_n: InputMaybe<Int_Comparison_Exp>;
  classnotes: InputMaybe<String_Comparison_Exp>;
  colsem: InputMaybe<Boolean_Comparison_Exp>;
  course: InputMaybe<Courses_Bool_Exp>;
  course_code: InputMaybe<String_Comparison_Exp>;
  course_id: InputMaybe<Int_Comparison_Exp>;
  credits: InputMaybe<Float8_Comparison_Exp>;
  crn: InputMaybe<Int_Comparison_Exp>;
  declined: InputMaybe<Int_Comparison_Exp>;
  description: InputMaybe<String_Comparison_Exp>;
  enrolled: InputMaybe<Int_Comparison_Exp>;
  enrollment: InputMaybe<Int_Comparison_Exp>;
  extra_info: InputMaybe<String_Comparison_Exp>;
  final_exam: InputMaybe<String_Comparison_Exp>;
  flag_info: InputMaybe<Jsonb_Comparison_Exp>;
  fysem: InputMaybe<Boolean_Comparison_Exp>;
  last_enrollment: InputMaybe<Int_Comparison_Exp>;
  last_enrollment_course_id: InputMaybe<Int_Comparison_Exp>;
  last_enrollment_same_professors: InputMaybe<Boolean_Comparison_Exp>;
  last_enrollment_season_code: InputMaybe<String_Comparison_Exp>;
  last_offered_course_id: InputMaybe<Int_Comparison_Exp>;
  listing: InputMaybe<Listings_Bool_Exp>;
  listing_id: InputMaybe<Int_Comparison_Exp>;
  locations_summary: InputMaybe<String_Comparison_Exp>;
  no_response: InputMaybe<Int_Comparison_Exp>;
  number: InputMaybe<String_Comparison_Exp>;
  professor_ids: InputMaybe<Jsonb_Comparison_Exp>;
  professor_info: InputMaybe<Jsonb_Comparison_Exp>;
  professor_names: InputMaybe<Jsonb_Comparison_Exp>;
  regnotes: InputMaybe<String_Comparison_Exp>;
  requirements: InputMaybe<String_Comparison_Exp>;
  responses: InputMaybe<Int_Comparison_Exp>;
  rp_attr: InputMaybe<String_Comparison_Exp>;
  same_course_and_profs_id: InputMaybe<Int_Comparison_Exp>;
  same_course_id: InputMaybe<Int_Comparison_Exp>;
  school: InputMaybe<String_Comparison_Exp>;
  season_code: InputMaybe<String_Comparison_Exp>;
  section: InputMaybe<String_Comparison_Exp>;
  skills: InputMaybe<Jsonb_Comparison_Exp>;
  subject: InputMaybe<String_Comparison_Exp>;
  syllabus_url: InputMaybe<String_Comparison_Exp>;
  sysem: InputMaybe<Boolean_Comparison_Exp>;
  times_by_day: InputMaybe<Json_Comparison_Exp>;
  times_summary: InputMaybe<String_Comparison_Exp>;
  title: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "computed_listing_info" */
export enum Computed_Listing_Info_Constraint {
  /** unique or primary key constraint on columns "listing_id" */
  IdxComputedListingListingId = 'idx_computed_listing_listing_id',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Computed_Listing_Info_Delete_At_Path_Input = {
  all_course_codes: InputMaybe<Array<Scalars['String']['input']>>;
  areas: InputMaybe<Array<Scalars['String']['input']>>;
  flag_info: InputMaybe<Array<Scalars['String']['input']>>;
  professor_ids: InputMaybe<Array<Scalars['String']['input']>>;
  professor_info: InputMaybe<Array<Scalars['String']['input']>>;
  professor_names: InputMaybe<Array<Scalars['String']['input']>>;
  skills: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Computed_Listing_Info_Delete_Elem_Input = {
  all_course_codes: InputMaybe<Scalars['Int']['input']>;
  areas: InputMaybe<Scalars['Int']['input']>;
  flag_info: InputMaybe<Scalars['Int']['input']>;
  professor_ids: InputMaybe<Scalars['Int']['input']>;
  professor_info: InputMaybe<Scalars['Int']['input']>;
  professor_names: InputMaybe<Scalars['Int']['input']>;
  skills: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Computed_Listing_Info_Delete_Key_Input = {
  all_course_codes: InputMaybe<Scalars['String']['input']>;
  areas: InputMaybe<Scalars['String']['input']>;
  flag_info: InputMaybe<Scalars['String']['input']>;
  professor_ids: InputMaybe<Scalars['String']['input']>;
  professor_info: InputMaybe<Scalars['String']['input']>;
  professor_names: InputMaybe<Scalars['String']['input']>;
  skills: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "computed_listing_info" */
export type Computed_Listing_Info_Inc_Input = {
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
  enrollment: InputMaybe<Scalars['Int']['input']>;
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
export type Computed_Listing_Info_Insert_Input = {
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
  course: InputMaybe<Courses_Obj_Rel_Insert_Input>;
  course_code: InputMaybe<Scalars['String']['input']>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  credits: InputMaybe<Scalars['float8']['input']>;
  crn: InputMaybe<Scalars['Int']['input']>;
  declined: InputMaybe<Scalars['Int']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  enrolled: InputMaybe<Scalars['Int']['input']>;
  enrollment: InputMaybe<Scalars['Int']['input']>;
  extra_info: InputMaybe<Scalars['String']['input']>;
  final_exam: InputMaybe<Scalars['String']['input']>;
  flag_info: InputMaybe<Scalars['jsonb']['input']>;
  fysem: InputMaybe<Scalars['Boolean']['input']>;
  last_enrollment: InputMaybe<Scalars['Int']['input']>;
  last_enrollment_course_id: InputMaybe<Scalars['Int']['input']>;
  last_enrollment_same_professors: InputMaybe<Scalars['Boolean']['input']>;
  last_enrollment_season_code: InputMaybe<Scalars['String']['input']>;
  last_offered_course_id: InputMaybe<Scalars['Int']['input']>;
  listing: InputMaybe<Listings_Obj_Rel_Insert_Input>;
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

/** order by max() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Max_Order_By = {
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  classnotes: InputMaybe<Order_By>;
  course_code: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  description: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  extra_info: InputMaybe<Order_By>;
  final_exam: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_enrollment_season_code: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  locations_summary: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  number: InputMaybe<Order_By>;
  regnotes: InputMaybe<Order_By>;
  requirements: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  rp_attr: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
  school: InputMaybe<Order_By>;
  season_code: InputMaybe<Order_By>;
  section: InputMaybe<Order_By>;
  subject: InputMaybe<Order_By>;
  syllabus_url: InputMaybe<Order_By>;
  times_summary: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
};

/** order by min() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Min_Order_By = {
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  classnotes: InputMaybe<Order_By>;
  course_code: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  description: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  extra_info: InputMaybe<Order_By>;
  final_exam: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_enrollment_season_code: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  locations_summary: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  number: InputMaybe<Order_By>;
  regnotes: InputMaybe<Order_By>;
  requirements: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  rp_attr: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
  school: InputMaybe<Order_By>;
  season_code: InputMaybe<Order_By>;
  section: InputMaybe<Order_By>;
  subject: InputMaybe<Order_By>;
  syllabus_url: InputMaybe<Order_By>;
  times_summary: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
};

/** on_conflict condition type for table "computed_listing_info" */
export type Computed_Listing_Info_On_Conflict = {
  constraint: Computed_Listing_Info_Constraint;
  update_columns: Array<Computed_Listing_Info_Update_Column>;
  where: InputMaybe<Computed_Listing_Info_Bool_Exp>;
};

/** Ordering options when selecting data from "computed_listing_info". */
export type Computed_Listing_Info_Order_By = {
  all_course_codes: InputMaybe<Order_By>;
  areas: InputMaybe<Order_By>;
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  classnotes: InputMaybe<Order_By>;
  colsem: InputMaybe<Order_By>;
  course: InputMaybe<Courses_Order_By>;
  course_code: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  description: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  extra_info: InputMaybe<Order_By>;
  final_exam: InputMaybe<Order_By>;
  flag_info: InputMaybe<Order_By>;
  fysem: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_enrollment_same_professors: InputMaybe<Order_By>;
  last_enrollment_season_code: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing: InputMaybe<Listings_Order_By>;
  listing_id: InputMaybe<Order_By>;
  locations_summary: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  number: InputMaybe<Order_By>;
  professor_ids: InputMaybe<Order_By>;
  professor_info: InputMaybe<Order_By>;
  professor_names: InputMaybe<Order_By>;
  regnotes: InputMaybe<Order_By>;
  requirements: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  rp_attr: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
  school: InputMaybe<Order_By>;
  season_code: InputMaybe<Order_By>;
  section: InputMaybe<Order_By>;
  skills: InputMaybe<Order_By>;
  subject: InputMaybe<Order_By>;
  syllabus_url: InputMaybe<Order_By>;
  sysem: InputMaybe<Order_By>;
  times_by_day: InputMaybe<Order_By>;
  times_summary: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Computed_Listing_Info_Prepend_Input = {
  all_course_codes: InputMaybe<Scalars['jsonb']['input']>;
  areas: InputMaybe<Scalars['jsonb']['input']>;
  flag_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_ids: InputMaybe<Scalars['jsonb']['input']>;
  professor_info: InputMaybe<Scalars['jsonb']['input']>;
  professor_names: InputMaybe<Scalars['jsonb']['input']>;
  skills: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "computed_listing_info" */
export enum Computed_Listing_Info_Select_Column {
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
  Enrollment = 'enrollment',
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
export enum Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Avg_Arguments_Columns {
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
export enum Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
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
export enum Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
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
export enum Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Corr_Arguments_Columns {
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
export enum Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns {
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
export enum Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Max_Arguments_Columns {
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
export enum Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Min_Arguments_Columns {
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
export enum Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns {
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
export enum Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Sum_Arguments_Columns {
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
export enum Computed_Listing_Info_Select_Column_Computed_Listing_Info_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns {
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
export type Computed_Listing_Info_Set_Input = {
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
  enrollment: InputMaybe<Scalars['Int']['input']>;
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

/** order by stddev() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Stddev_Order_By = {
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Stddev_Pop_Order_By = {
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Stddev_Samp_Order_By = {
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "computed_listing_info" */
export type Computed_Listing_Info_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Computed_Listing_Info_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Computed_Listing_Info_Stream_Cursor_Value_Input = {
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
  enrollment: InputMaybe<Scalars['Int']['input']>;
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

/** order by sum() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Sum_Order_By = {
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
};

/** update columns of table "computed_listing_info" */
export enum Computed_Listing_Info_Update_Column {
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
  Enrollment = 'enrollment',
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

export type Computed_Listing_Info_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append: InputMaybe<Computed_Listing_Info_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path: InputMaybe<Computed_Listing_Info_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem: InputMaybe<Computed_Listing_Info_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key: InputMaybe<Computed_Listing_Info_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Computed_Listing_Info_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend: InputMaybe<Computed_Listing_Info_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Computed_Listing_Info_Set_Input>;
  /** filter the rows which have to be updated */
  where: Computed_Listing_Info_Bool_Exp;
};

/** order by var_pop() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Var_Pop_Order_By = {
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Var_Samp_Order_By = {
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Variance_Order_By = {
  average_gut_rating: InputMaybe<Order_By>;
  average_professor: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  credits: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
};

export type Course_Flags_Aggregate_Bool_Exp = {
  count: InputMaybe<Course_Flags_Aggregate_Bool_Exp_Count>;
};

export type Course_Flags_Aggregate_Bool_Exp_Count = {
  arguments: InputMaybe<Array<Course_Flags_Select_Column>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Course_Flags_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "course_flags" */
export type Course_Flags_Aggregate_Order_By = {
  avg: InputMaybe<Course_Flags_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Course_Flags_Max_Order_By>;
  min: InputMaybe<Course_Flags_Min_Order_By>;
  stddev: InputMaybe<Course_Flags_Stddev_Order_By>;
  stddev_pop: InputMaybe<Course_Flags_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Course_Flags_Stddev_Samp_Order_By>;
  sum: InputMaybe<Course_Flags_Sum_Order_By>;
  var_pop: InputMaybe<Course_Flags_Var_Pop_Order_By>;
  var_samp: InputMaybe<Course_Flags_Var_Samp_Order_By>;
  variance: InputMaybe<Course_Flags_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "course_flags" */
export type Course_Flags_Arr_Rel_Insert_Input = {
  data: Array<Course_Flags_Insert_Input>;
  /** upsert condition */
  on_conflict: InputMaybe<Course_Flags_On_Conflict>;
};

/** order by avg() on columns of table "course_flags" */
export type Course_Flags_Avg_Order_By = {
  course_id: InputMaybe<Order_By>;
  flag_id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_flags". All fields are combined with a logical 'AND'. */
export type Course_Flags_Bool_Exp = {
  _and: InputMaybe<Array<Course_Flags_Bool_Exp>>;
  _not: InputMaybe<Course_Flags_Bool_Exp>;
  _or: InputMaybe<Array<Course_Flags_Bool_Exp>>;
  course: InputMaybe<Courses_Bool_Exp>;
  course_id: InputMaybe<Int_Comparison_Exp>;
  flag: InputMaybe<Flags_Bool_Exp>;
  flag_id: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_flags" */
export enum Course_Flags_Constraint {
  /** unique or primary key constraint on columns "course_id", "flag_id" */
  PkCourseFlagsStaged = 'pk_course_flags_staged',
}

/** input type for incrementing numeric columns in table "course_flags" */
export type Course_Flags_Inc_Input = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  flag_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "course_flags" */
export type Course_Flags_Insert_Input = {
  course: InputMaybe<Courses_Obj_Rel_Insert_Input>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  flag: InputMaybe<Flags_Obj_Rel_Insert_Input>;
  flag_id: InputMaybe<Scalars['Int']['input']>;
};

/** order by max() on columns of table "course_flags" */
export type Course_Flags_Max_Order_By = {
  course_id: InputMaybe<Order_By>;
  flag_id: InputMaybe<Order_By>;
};

/** order by min() on columns of table "course_flags" */
export type Course_Flags_Min_Order_By = {
  course_id: InputMaybe<Order_By>;
  flag_id: InputMaybe<Order_By>;
};

/** on_conflict condition type for table "course_flags" */
export type Course_Flags_On_Conflict = {
  constraint: Course_Flags_Constraint;
  update_columns: Array<Course_Flags_Update_Column>;
  where: InputMaybe<Course_Flags_Bool_Exp>;
};

/** Ordering options when selecting data from "course_flags". */
export type Course_Flags_Order_By = {
  course: InputMaybe<Courses_Order_By>;
  course_id: InputMaybe<Order_By>;
  flag: InputMaybe<Flags_Order_By>;
  flag_id: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_flags */
export type Course_Flags_Pk_Columns_Input = {
  course_id: Scalars['Int']['input'];
  flag_id: Scalars['Int']['input'];
};

/** select columns of table "course_flags" */
export enum Course_Flags_Select_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  FlagId = 'flag_id',
}

/** input type for updating data in table "course_flags" */
export type Course_Flags_Set_Input = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  flag_id: InputMaybe<Scalars['Int']['input']>;
};

/** order by stddev() on columns of table "course_flags" */
export type Course_Flags_Stddev_Order_By = {
  course_id: InputMaybe<Order_By>;
  flag_id: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "course_flags" */
export type Course_Flags_Stddev_Pop_Order_By = {
  course_id: InputMaybe<Order_By>;
  flag_id: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "course_flags" */
export type Course_Flags_Stddev_Samp_Order_By = {
  course_id: InputMaybe<Order_By>;
  flag_id: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "course_flags" */
export type Course_Flags_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Course_Flags_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Course_Flags_Stream_Cursor_Value_Input = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  flag_id: InputMaybe<Scalars['Int']['input']>;
};

/** order by sum() on columns of table "course_flags" */
export type Course_Flags_Sum_Order_By = {
  course_id: InputMaybe<Order_By>;
  flag_id: InputMaybe<Order_By>;
};

/** update columns of table "course_flags" */
export enum Course_Flags_Update_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  FlagId = 'flag_id',
}

export type Course_Flags_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Course_Flags_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Course_Flags_Set_Input>;
  /** filter the rows which have to be updated */
  where: Course_Flags_Bool_Exp;
};

/** order by var_pop() on columns of table "course_flags" */
export type Course_Flags_Var_Pop_Order_By = {
  course_id: InputMaybe<Order_By>;
  flag_id: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "course_flags" */
export type Course_Flags_Var_Samp_Order_By = {
  course_id: InputMaybe<Order_By>;
  flag_id: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "course_flags" */
export type Course_Flags_Variance_Order_By = {
  course_id: InputMaybe<Order_By>;
  flag_id: InputMaybe<Order_By>;
};

export type Course_Professors_Aggregate_Bool_Exp = {
  count: InputMaybe<Course_Professors_Aggregate_Bool_Exp_Count>;
};

export type Course_Professors_Aggregate_Bool_Exp_Count = {
  arguments: InputMaybe<Array<Course_Professors_Select_Column>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Course_Professors_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "course_professors" */
export type Course_Professors_Aggregate_Order_By = {
  avg: InputMaybe<Course_Professors_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Course_Professors_Max_Order_By>;
  min: InputMaybe<Course_Professors_Min_Order_By>;
  stddev: InputMaybe<Course_Professors_Stddev_Order_By>;
  stddev_pop: InputMaybe<Course_Professors_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Course_Professors_Stddev_Samp_Order_By>;
  sum: InputMaybe<Course_Professors_Sum_Order_By>;
  var_pop: InputMaybe<Course_Professors_Var_Pop_Order_By>;
  var_samp: InputMaybe<Course_Professors_Var_Samp_Order_By>;
  variance: InputMaybe<Course_Professors_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "course_professors" */
export type Course_Professors_Arr_Rel_Insert_Input = {
  data: Array<Course_Professors_Insert_Input>;
  /** upsert condition */
  on_conflict: InputMaybe<Course_Professors_On_Conflict>;
};

/** order by avg() on columns of table "course_professors" */
export type Course_Professors_Avg_Order_By = {
  course_id: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_professors". All fields are combined with a logical 'AND'. */
export type Course_Professors_Bool_Exp = {
  _and: InputMaybe<Array<Course_Professors_Bool_Exp>>;
  _not: InputMaybe<Course_Professors_Bool_Exp>;
  _or: InputMaybe<Array<Course_Professors_Bool_Exp>>;
  course: InputMaybe<Courses_Bool_Exp>;
  course_id: InputMaybe<Int_Comparison_Exp>;
  professor: InputMaybe<Professors_Bool_Exp>;
  professor_id: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_professors" */
export enum Course_Professors_Constraint {
  /** unique or primary key constraint on columns "course_id", "professor_id" */
  PkCourseProfessorsStaged = 'pk_course_professors_staged',
}

/** input type for incrementing numeric columns in table "course_professors" */
export type Course_Professors_Inc_Input = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "course_professors" */
export type Course_Professors_Insert_Input = {
  course: InputMaybe<Courses_Obj_Rel_Insert_Input>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  professor: InputMaybe<Professors_Obj_Rel_Insert_Input>;
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** order by max() on columns of table "course_professors" */
export type Course_Professors_Max_Order_By = {
  course_id: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** order by min() on columns of table "course_professors" */
export type Course_Professors_Min_Order_By = {
  course_id: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** on_conflict condition type for table "course_professors" */
export type Course_Professors_On_Conflict = {
  constraint: Course_Professors_Constraint;
  update_columns: Array<Course_Professors_Update_Column>;
  where: InputMaybe<Course_Professors_Bool_Exp>;
};

/** Ordering options when selecting data from "course_professors". */
export type Course_Professors_Order_By = {
  course: InputMaybe<Courses_Order_By>;
  course_id: InputMaybe<Order_By>;
  professor: InputMaybe<Professors_Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** primary key columns input for table: course_professors */
export type Course_Professors_Pk_Columns_Input = {
  course_id: Scalars['Int']['input'];
  professor_id: Scalars['Int']['input'];
};

/** select columns of table "course_professors" */
export enum Course_Professors_Select_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  ProfessorId = 'professor_id',
}

/** input type for updating data in table "course_professors" */
export type Course_Professors_Set_Input = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** order by stddev() on columns of table "course_professors" */
export type Course_Professors_Stddev_Order_By = {
  course_id: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "course_professors" */
export type Course_Professors_Stddev_Pop_Order_By = {
  course_id: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "course_professors" */
export type Course_Professors_Stddev_Samp_Order_By = {
  course_id: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "course_professors" */
export type Course_Professors_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Course_Professors_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Course_Professors_Stream_Cursor_Value_Input = {
  course_id: InputMaybe<Scalars['Int']['input']>;
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** order by sum() on columns of table "course_professors" */
export type Course_Professors_Sum_Order_By = {
  course_id: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** update columns of table "course_professors" */
export enum Course_Professors_Update_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  ProfessorId = 'professor_id',
}

export type Course_Professors_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Course_Professors_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Course_Professors_Set_Input>;
  /** filter the rows which have to be updated */
  where: Course_Professors_Bool_Exp;
};

/** order by var_pop() on columns of table "course_professors" */
export type Course_Professors_Var_Pop_Order_By = {
  course_id: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "course_professors" */
export type Course_Professors_Var_Samp_Order_By = {
  course_id: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "course_professors" */
export type Course_Professors_Variance_Order_By = {
  course_id: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

export type Courses_Aggregate_Bool_Exp = {
  avg: InputMaybe<Courses_Aggregate_Bool_Exp_Avg>;
  bool_and: InputMaybe<Courses_Aggregate_Bool_Exp_Bool_And>;
  bool_or: InputMaybe<Courses_Aggregate_Bool_Exp_Bool_Or>;
  corr: InputMaybe<Courses_Aggregate_Bool_Exp_Corr>;
  count: InputMaybe<Courses_Aggregate_Bool_Exp_Count>;
  covar_samp: InputMaybe<Courses_Aggregate_Bool_Exp_Covar_Samp>;
  max: InputMaybe<Courses_Aggregate_Bool_Exp_Max>;
  min: InputMaybe<Courses_Aggregate_Bool_Exp_Min>;
  stddev_samp: InputMaybe<Courses_Aggregate_Bool_Exp_Stddev_Samp>;
  sum: InputMaybe<Courses_Aggregate_Bool_Exp_Sum>;
  var_samp: InputMaybe<Courses_Aggregate_Bool_Exp_Var_Samp>;
};

export type Courses_Aggregate_Bool_Exp_Avg = {
  arguments: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Courses_Aggregate_Bool_Exp_Bool_And = {
  arguments: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Courses_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Courses_Aggregate_Bool_Exp_Corr = {
  arguments: Courses_Aggregate_Bool_Exp_Corr_Arguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Courses_Aggregate_Bool_Exp_Corr_Arguments = {
  X: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type Courses_Aggregate_Bool_Exp_Count = {
  arguments: InputMaybe<Array<Courses_Select_Column>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

export type Courses_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: Courses_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Courses_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type Courses_Aggregate_Bool_Exp_Max = {
  arguments: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Courses_Aggregate_Bool_Exp_Min = {
  arguments: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Courses_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Courses_Aggregate_Bool_Exp_Sum = {
  arguments: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Courses_Aggregate_Bool_Exp_Var_Samp = {
  arguments: Courses_Select_Column_Courses_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Courses_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

/** order by aggregate values of table "courses" */
export type Courses_Aggregate_Order_By = {
  avg: InputMaybe<Courses_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Courses_Max_Order_By>;
  min: InputMaybe<Courses_Min_Order_By>;
  stddev: InputMaybe<Courses_Stddev_Order_By>;
  stddev_pop: InputMaybe<Courses_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Courses_Stddev_Samp_Order_By>;
  sum: InputMaybe<Courses_Sum_Order_By>;
  var_pop: InputMaybe<Courses_Var_Pop_Order_By>;
  var_samp: InputMaybe<Courses_Var_Samp_Order_By>;
  variance: InputMaybe<Courses_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "courses" */
export type Courses_Arr_Rel_Insert_Input = {
  data: Array<Courses_Insert_Input>;
  /** upsert condition */
  on_conflict: InputMaybe<Courses_On_Conflict>;
};

/** order by avg() on columns of table "courses" */
export type Courses_Avg_Order_By = {
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  /** Number of course credits */
  credits: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "courses". All fields are combined with a logical 'AND'. */
export type Courses_Bool_Exp = {
  _and: InputMaybe<Array<Courses_Bool_Exp>>;
  _not: InputMaybe<Courses_Bool_Exp>;
  _or: InputMaybe<Array<Courses_Bool_Exp>>;
  areas: InputMaybe<Json_Comparison_Exp>;
  average_rating: InputMaybe<Float8_Comparison_Exp>;
  average_rating_n: InputMaybe<Int_Comparison_Exp>;
  average_rating_same_professors: InputMaybe<Float8_Comparison_Exp>;
  average_rating_same_professors_n: InputMaybe<Int_Comparison_Exp>;
  average_workload: InputMaybe<Float8_Comparison_Exp>;
  average_workload_n: InputMaybe<Int_Comparison_Exp>;
  average_workload_same_professors: InputMaybe<Float8_Comparison_Exp>;
  average_workload_same_professors_n: InputMaybe<Int_Comparison_Exp>;
  classnotes: InputMaybe<String_Comparison_Exp>;
  colsem: InputMaybe<Boolean_Comparison_Exp>;
  computed_listing_infos: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  computed_listing_infos_aggregate: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp>;
  course: InputMaybe<Courses_Bool_Exp>;
  courseByLastOfferedCourseId: InputMaybe<Courses_Bool_Exp>;
  course_flags: InputMaybe<Course_Flags_Bool_Exp>;
  course_flags_aggregate: InputMaybe<Course_Flags_Aggregate_Bool_Exp>;
  course_home_url: InputMaybe<String_Comparison_Exp>;
  course_id: InputMaybe<Int_Comparison_Exp>;
  course_professors: InputMaybe<Course_Professors_Bool_Exp>;
  course_professors_aggregate: InputMaybe<Course_Professors_Aggregate_Bool_Exp>;
  courses: InputMaybe<Courses_Bool_Exp>;
  coursesByLastOfferedCourseId: InputMaybe<Courses_Bool_Exp>;
  coursesByLastOfferedCourseId_aggregate: InputMaybe<Courses_Aggregate_Bool_Exp>;
  courses_aggregate: InputMaybe<Courses_Aggregate_Bool_Exp>;
  credits: InputMaybe<Float8_Comparison_Exp>;
  description: InputMaybe<String_Comparison_Exp>;
  evaluation_narratives: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  evaluation_narratives_aggregate: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp>;
  evaluation_ratings: InputMaybe<Evaluation_Ratings_Bool_Exp>;
  evaluation_ratings_aggregate: InputMaybe<Evaluation_Ratings_Aggregate_Bool_Exp>;
  evaluation_statistic: InputMaybe<Evaluation_Statistics_Bool_Exp>;
  extra_info: InputMaybe<String_Comparison_Exp>;
  final_exam: InputMaybe<String_Comparison_Exp>;
  fysem: InputMaybe<Boolean_Comparison_Exp>;
  last_enrollment: InputMaybe<Int_Comparison_Exp>;
  last_enrollment_course_id: InputMaybe<Int_Comparison_Exp>;
  last_enrollment_same_professors: InputMaybe<Boolean_Comparison_Exp>;
  last_enrollment_season_code: InputMaybe<String_Comparison_Exp>;
  last_offered_course_id: InputMaybe<Int_Comparison_Exp>;
  listings: InputMaybe<Listings_Bool_Exp>;
  listings_aggregate: InputMaybe<Listings_Aggregate_Bool_Exp>;
  locations_summary: InputMaybe<String_Comparison_Exp>;
  regnotes: InputMaybe<String_Comparison_Exp>;
  requirements: InputMaybe<String_Comparison_Exp>;
  rp_attr: InputMaybe<String_Comparison_Exp>;
  same_course_and_profs_id: InputMaybe<Int_Comparison_Exp>;
  same_course_id: InputMaybe<Int_Comparison_Exp>;
  season: InputMaybe<Seasons_Bool_Exp>;
  seasonBySeasonCode: InputMaybe<Seasons_Bool_Exp>;
  season_code: InputMaybe<String_Comparison_Exp>;
  short_title: InputMaybe<String_Comparison_Exp>;
  skills: InputMaybe<Json_Comparison_Exp>;
  syllabus_url: InputMaybe<String_Comparison_Exp>;
  sysem: InputMaybe<Boolean_Comparison_Exp>;
  times_by_day: InputMaybe<Json_Comparison_Exp>;
  times_long_summary: InputMaybe<String_Comparison_Exp>;
  times_summary: InputMaybe<String_Comparison_Exp>;
  title: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "courses" */
export enum Courses_Constraint {
  /** unique or primary key constraint on columns "course_id" */
  PkCoursesStaged = 'pk_courses_staged',
}

/** input type for incrementing numeric columns in table "courses" */
export type Courses_Inc_Input = {
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
export type Courses_Insert_Input = {
  /** Course areas (humanities, social sciences, sciences) */
  areas: InputMaybe<Scalars['json']['input']>;
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
  computed_listing_infos: InputMaybe<Computed_Listing_Info_Arr_Rel_Insert_Input>;
  course: InputMaybe<Courses_Obj_Rel_Insert_Input>;
  courseByLastOfferedCourseId: InputMaybe<Courses_Obj_Rel_Insert_Input>;
  course_flags: InputMaybe<Course_Flags_Arr_Rel_Insert_Input>;
  /** Link to the course homepage */
  course_home_url: InputMaybe<Scalars['String']['input']>;
  course_id: InputMaybe<Scalars['Int']['input']>;
  course_professors: InputMaybe<Course_Professors_Arr_Rel_Insert_Input>;
  courses: InputMaybe<Courses_Arr_Rel_Insert_Input>;
  coursesByLastOfferedCourseId: InputMaybe<Courses_Arr_Rel_Insert_Input>;
  /** Number of course credits */
  credits: InputMaybe<Scalars['float8']['input']>;
  /** Course description */
  description: InputMaybe<Scalars['String']['input']>;
  evaluation_narratives: InputMaybe<Evaluation_Narratives_Arr_Rel_Insert_Input>;
  evaluation_ratings: InputMaybe<Evaluation_Ratings_Arr_Rel_Insert_Input>;
  evaluation_statistic: InputMaybe<Evaluation_Statistics_Obj_Rel_Insert_Input>;
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
  listings: InputMaybe<Listings_Arr_Rel_Insert_Input>;
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
  season: InputMaybe<Seasons_Obj_Rel_Insert_Input>;
  seasonBySeasonCode: InputMaybe<Seasons_Obj_Rel_Insert_Input>;
  /** The season the course is being taught in */
  season_code: InputMaybe<Scalars['String']['input']>;
  /**
   * Shortened course title (first 29 characters + "...")
   *         if the length exceeds 32, otherwise just the title itself
   */
  short_title: InputMaybe<Scalars['String']['input']>;
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
   *         tuples of `(start_time, end_time, location)`
   */
  times_by_day: InputMaybe<Scalars['json']['input']>;
  /**
   * Course times and locations, displayed in the "Meets"
   *          row in CourseTable course modals
   */
  times_long_summary: InputMaybe<Scalars['String']['input']>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: InputMaybe<Scalars['String']['input']>;
  /** Complete course title */
  title: InputMaybe<Scalars['String']['input']>;
};

/** order by max() on columns of table "courses" */
export type Courses_Max_Order_By = {
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Order_By>;
  /** Additional class notes */
  classnotes: InputMaybe<Order_By>;
  /** Link to the course homepage */
  course_home_url: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  /** Number of course credits */
  credits: InputMaybe<Order_By>;
  /** Course description */
  description: InputMaybe<Order_By>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info: InputMaybe<Order_By>;
  /** Final exam information */
  final_exam: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Order_By>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Order_By>;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary: InputMaybe<Order_By>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes: InputMaybe<Order_By>;
  /** Recommended requirements/prerequisites for the course */
  requirements: InputMaybe<Order_By>;
  /** Reading period notes */
  rp_attr: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Order_By>;
  /** The season the course is being taught in */
  season_code: InputMaybe<Order_By>;
  /**
   * Shortened course title (first 29 characters + "...")
   *         if the length exceeds 32, otherwise just the title itself
   */
  short_title: InputMaybe<Order_By>;
  /** Link to the syllabus */
  syllabus_url: InputMaybe<Order_By>;
  /**
   * Course times and locations, displayed in the "Meets"
   *          row in CourseTable course modals
   */
  times_long_summary: InputMaybe<Order_By>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: InputMaybe<Order_By>;
  /** Complete course title */
  title: InputMaybe<Order_By>;
};

/** order by min() on columns of table "courses" */
export type Courses_Min_Order_By = {
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Order_By>;
  /** Additional class notes */
  classnotes: InputMaybe<Order_By>;
  /** Link to the course homepage */
  course_home_url: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  /** Number of course credits */
  credits: InputMaybe<Order_By>;
  /** Course description */
  description: InputMaybe<Order_By>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info: InputMaybe<Order_By>;
  /** Final exam information */
  final_exam: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Order_By>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Order_By>;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary: InputMaybe<Order_By>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes: InputMaybe<Order_By>;
  /** Recommended requirements/prerequisites for the course */
  requirements: InputMaybe<Order_By>;
  /** Reading period notes */
  rp_attr: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Order_By>;
  /** The season the course is being taught in */
  season_code: InputMaybe<Order_By>;
  /**
   * Shortened course title (first 29 characters + "...")
   *         if the length exceeds 32, otherwise just the title itself
   */
  short_title: InputMaybe<Order_By>;
  /** Link to the syllabus */
  syllabus_url: InputMaybe<Order_By>;
  /**
   * Course times and locations, displayed in the "Meets"
   *          row in CourseTable course modals
   */
  times_long_summary: InputMaybe<Order_By>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: InputMaybe<Order_By>;
  /** Complete course title */
  title: InputMaybe<Order_By>;
};

/** input type for inserting object relation for remote table "courses" */
export type Courses_Obj_Rel_Insert_Input = {
  data: Courses_Insert_Input;
  /** upsert condition */
  on_conflict: InputMaybe<Courses_On_Conflict>;
};

/** on_conflict condition type for table "courses" */
export type Courses_On_Conflict = {
  constraint: Courses_Constraint;
  update_columns: Array<Courses_Update_Column>;
  where: InputMaybe<Courses_Bool_Exp>;
};

/** Ordering options when selecting data from "courses". */
export type Courses_Order_By = {
  areas: InputMaybe<Order_By>;
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  average_rating_same_professors: InputMaybe<Order_By>;
  average_rating_same_professors_n: InputMaybe<Order_By>;
  average_workload: InputMaybe<Order_By>;
  average_workload_n: InputMaybe<Order_By>;
  average_workload_same_professors: InputMaybe<Order_By>;
  average_workload_same_professors_n: InputMaybe<Order_By>;
  classnotes: InputMaybe<Order_By>;
  colsem: InputMaybe<Order_By>;
  computed_listing_infos_aggregate: InputMaybe<Computed_Listing_Info_Aggregate_Order_By>;
  course: InputMaybe<Courses_Order_By>;
  courseByLastOfferedCourseId: InputMaybe<Courses_Order_By>;
  course_flags_aggregate: InputMaybe<Course_Flags_Aggregate_Order_By>;
  course_home_url: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  course_professors_aggregate: InputMaybe<Course_Professors_Aggregate_Order_By>;
  coursesByLastOfferedCourseId_aggregate: InputMaybe<Courses_Aggregate_Order_By>;
  courses_aggregate: InputMaybe<Courses_Aggregate_Order_By>;
  credits: InputMaybe<Order_By>;
  description: InputMaybe<Order_By>;
  evaluation_narratives_aggregate: InputMaybe<Evaluation_Narratives_Aggregate_Order_By>;
  evaluation_ratings_aggregate: InputMaybe<Evaluation_Ratings_Aggregate_Order_By>;
  evaluation_statistic: InputMaybe<Evaluation_Statistics_Order_By>;
  extra_info: InputMaybe<Order_By>;
  final_exam: InputMaybe<Order_By>;
  fysem: InputMaybe<Order_By>;
  last_enrollment: InputMaybe<Order_By>;
  last_enrollment_course_id: InputMaybe<Order_By>;
  last_enrollment_same_professors: InputMaybe<Order_By>;
  last_enrollment_season_code: InputMaybe<Order_By>;
  last_offered_course_id: InputMaybe<Order_By>;
  listings_aggregate: InputMaybe<Listings_Aggregate_Order_By>;
  locations_summary: InputMaybe<Order_By>;
  regnotes: InputMaybe<Order_By>;
  requirements: InputMaybe<Order_By>;
  rp_attr: InputMaybe<Order_By>;
  same_course_and_profs_id: InputMaybe<Order_By>;
  same_course_id: InputMaybe<Order_By>;
  season: InputMaybe<Seasons_Order_By>;
  seasonBySeasonCode: InputMaybe<Seasons_Order_By>;
  season_code: InputMaybe<Order_By>;
  short_title: InputMaybe<Order_By>;
  skills: InputMaybe<Order_By>;
  syllabus_url: InputMaybe<Order_By>;
  sysem: InputMaybe<Order_By>;
  times_by_day: InputMaybe<Order_By>;
  times_long_summary: InputMaybe<Order_By>;
  times_summary: InputMaybe<Order_By>;
  title: InputMaybe<Order_By>;
};

/** primary key columns input for table: courses */
export type Courses_Pk_Columns_Input = {
  course_id: Scalars['Int']['input'];
};

/** select columns of table "courses" */
export enum Courses_Select_Column {
  /** column name */
  Areas = 'areas',
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
  ShortTitle = 'short_title',
  /** column name */
  Skills = 'skills',
  /** column name */
  SyllabusUrl = 'syllabus_url',
  /** column name */
  Sysem = 'sysem',
  /** column name */
  TimesByDay = 'times_by_day',
  /** column name */
  TimesLongSummary = 'times_long_summary',
  /** column name */
  TimesSummary = 'times_summary',
  /** column name */
  Title = 'title',
}

/** select "courses_aggregate_bool_exp_avg_arguments_columns" columns of table "courses" */
export enum Courses_Select_Column_Courses_Aggregate_Bool_Exp_Avg_Arguments_Columns {
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
export enum Courses_Select_Column_Courses_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
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
export enum Courses_Select_Column_Courses_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
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
export enum Courses_Select_Column_Courses_Aggregate_Bool_Exp_Corr_Arguments_Columns {
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
export enum Courses_Select_Column_Courses_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns {
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
export enum Courses_Select_Column_Courses_Aggregate_Bool_Exp_Max_Arguments_Columns {
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
export enum Courses_Select_Column_Courses_Aggregate_Bool_Exp_Min_Arguments_Columns {
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
export enum Courses_Select_Column_Courses_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns {
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
export enum Courses_Select_Column_Courses_Aggregate_Bool_Exp_Sum_Arguments_Columns {
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
export enum Courses_Select_Column_Courses_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns {
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
export type Courses_Set_Input = {
  /** Course areas (humanities, social sciences, sciences) */
  areas: InputMaybe<Scalars['json']['input']>;
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
   * Shortened course title (first 29 characters + "...")
   *         if the length exceeds 32, otherwise just the title itself
   */
  short_title: InputMaybe<Scalars['String']['input']>;
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
   *         tuples of `(start_time, end_time, location)`
   */
  times_by_day: InputMaybe<Scalars['json']['input']>;
  /**
   * Course times and locations, displayed in the "Meets"
   *          row in CourseTable course modals
   */
  times_long_summary: InputMaybe<Scalars['String']['input']>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: InputMaybe<Scalars['String']['input']>;
  /** Complete course title */
  title: InputMaybe<Scalars['String']['input']>;
};

/** order by stddev() on columns of table "courses" */
export type Courses_Stddev_Order_By = {
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  /** Number of course credits */
  credits: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "courses" */
export type Courses_Stddev_Pop_Order_By = {
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  /** Number of course credits */
  credits: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "courses" */
export type Courses_Stddev_Samp_Order_By = {
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  /** Number of course credits */
  credits: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "courses" */
export type Courses_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Courses_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Courses_Stream_Cursor_Value_Input = {
  /** Course areas (humanities, social sciences, sciences) */
  areas: InputMaybe<Scalars['json']['input']>;
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
   * Shortened course title (first 29 characters + "...")
   *         if the length exceeds 32, otherwise just the title itself
   */
  short_title: InputMaybe<Scalars['String']['input']>;
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
   *         tuples of `(start_time, end_time, location)`
   */
  times_by_day: InputMaybe<Scalars['json']['input']>;
  /**
   * Course times and locations, displayed in the "Meets"
   *          row in CourseTable course modals
   */
  times_long_summary: InputMaybe<Scalars['String']['input']>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary: InputMaybe<Scalars['String']['input']>;
  /** Complete course title */
  title: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "courses" */
export type Courses_Sum_Order_By = {
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  /** Number of course credits */
  credits: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Order_By>;
};

/** update columns of table "courses" */
export enum Courses_Update_Column {
  /** column name */
  Areas = 'areas',
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
  ShortTitle = 'short_title',
  /** column name */
  Skills = 'skills',
  /** column name */
  SyllabusUrl = 'syllabus_url',
  /** column name */
  Sysem = 'sysem',
  /** column name */
  TimesByDay = 'times_by_day',
  /** column name */
  TimesLongSummary = 'times_long_summary',
  /** column name */
  TimesSummary = 'times_summary',
  /** column name */
  Title = 'title',
}

export type Courses_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Courses_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Courses_Set_Input>;
  /** filter the rows which have to be updated */
  where: Courses_Bool_Exp;
};

/** order by var_pop() on columns of table "courses" */
export type Courses_Var_Pop_Order_By = {
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  /** Number of course credits */
  credits: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "courses" */
export type Courses_Var_Samp_Order_By = {
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  /** Number of course credits */
  credits: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "courses" */
export type Courses_Variance_Order_By = {
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  /** Number of course credits */
  credits: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id: InputMaybe<Order_By>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

export type Evaluation_Narratives_Aggregate_Bool_Exp = {
  avg: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Avg>;
  corr: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Corr>;
  count: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Count>;
  covar_samp: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp>;
  max: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Max>;
  min: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Min>;
  stddev_samp: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Stddev_Samp>;
  sum: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Sum>;
  var_samp: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Var_Samp>;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Avg = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Corr = {
  arguments: Evaluation_Narratives_Aggregate_Bool_Exp_Corr_Arguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Corr_Arguments = {
  X: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Count = {
  arguments: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Max = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Min = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Sum = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Var_Samp = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

/** order by aggregate values of table "evaluation_narratives" */
export type Evaluation_Narratives_Aggregate_Order_By = {
  avg: InputMaybe<Evaluation_Narratives_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Evaluation_Narratives_Max_Order_By>;
  min: InputMaybe<Evaluation_Narratives_Min_Order_By>;
  stddev: InputMaybe<Evaluation_Narratives_Stddev_Order_By>;
  stddev_pop: InputMaybe<Evaluation_Narratives_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Evaluation_Narratives_Stddev_Samp_Order_By>;
  sum: InputMaybe<Evaluation_Narratives_Sum_Order_By>;
  var_pop: InputMaybe<Evaluation_Narratives_Var_Pop_Order_By>;
  var_samp: InputMaybe<Evaluation_Narratives_Var_Samp_Order_By>;
  variance: InputMaybe<Evaluation_Narratives_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "evaluation_narratives" */
export type Evaluation_Narratives_Arr_Rel_Insert_Input = {
  data: Array<Evaluation_Narratives_Insert_Input>;
  /** upsert condition */
  on_conflict: InputMaybe<Evaluation_Narratives_On_Conflict>;
};

/** order by avg() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Avg_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "evaluation_narratives". All fields are combined with a logical 'AND'. */
export type Evaluation_Narratives_Bool_Exp = {
  _and: InputMaybe<Array<Evaluation_Narratives_Bool_Exp>>;
  _not: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  _or: InputMaybe<Array<Evaluation_Narratives_Bool_Exp>>;
  comment: InputMaybe<String_Comparison_Exp>;
  comment_compound: InputMaybe<Float8_Comparison_Exp>;
  comment_neg: InputMaybe<Float8_Comparison_Exp>;
  comment_neu: InputMaybe<Float8_Comparison_Exp>;
  comment_pos: InputMaybe<Float8_Comparison_Exp>;
  course: InputMaybe<Courses_Bool_Exp>;
  course_id: InputMaybe<Int_Comparison_Exp>;
  evaluation_question: InputMaybe<Evaluation_Questions_Bool_Exp>;
  id: InputMaybe<Int_Comparison_Exp>;
  question_code: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "evaluation_narratives" */
export enum Evaluation_Narratives_Constraint {
  /** unique or primary key constraint on columns "id" */
  PkEvaluationNarrativesStaged = 'pk_evaluation_narratives_staged',
}

/** input type for incrementing numeric columns in table "evaluation_narratives" */
export type Evaluation_Narratives_Inc_Input = {
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
export type Evaluation_Narratives_Insert_Input = {
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
  course: InputMaybe<Courses_Obj_Rel_Insert_Input>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  evaluation_question: InputMaybe<Evaluation_Questions_Obj_Rel_Insert_Input>;
  id: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this narrative comment responds */
  question_code: InputMaybe<Scalars['String']['input']>;
};

/** order by max() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Max_Order_By = {
  /** Response to the question */
  comment: InputMaybe<Order_By>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  /** Question to which this narrative comment responds */
  question_code: InputMaybe<Order_By>;
};

/** order by min() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Min_Order_By = {
  /** Response to the question */
  comment: InputMaybe<Order_By>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  /** Question to which this narrative comment responds */
  question_code: InputMaybe<Order_By>;
};

/** on_conflict condition type for table "evaluation_narratives" */
export type Evaluation_Narratives_On_Conflict = {
  constraint: Evaluation_Narratives_Constraint;
  update_columns: Array<Evaluation_Narratives_Update_Column>;
  where: InputMaybe<Evaluation_Narratives_Bool_Exp>;
};

/** Ordering options when selecting data from "evaluation_narratives". */
export type Evaluation_Narratives_Order_By = {
  comment: InputMaybe<Order_By>;
  comment_compound: InputMaybe<Order_By>;
  comment_neg: InputMaybe<Order_By>;
  comment_neu: InputMaybe<Order_By>;
  comment_pos: InputMaybe<Order_By>;
  course: InputMaybe<Courses_Order_By>;
  course_id: InputMaybe<Order_By>;
  evaluation_question: InputMaybe<Evaluation_Questions_Order_By>;
  id: InputMaybe<Order_By>;
  question_code: InputMaybe<Order_By>;
};

/** primary key columns input for table: evaluation_narratives */
export type Evaluation_Narratives_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "evaluation_narratives" */
export enum Evaluation_Narratives_Select_Column {
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
export enum Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Avg_Arguments_Columns {
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
export enum Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Corr_Arguments_Columns {
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
export enum Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns {
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
export enum Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Max_Arguments_Columns {
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
export enum Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Min_Arguments_Columns {
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
export enum Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns {
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
export enum Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Sum_Arguments_Columns {
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
export enum Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns {
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
export type Evaluation_Narratives_Set_Input = {
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

/** order by stddev() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Stddev_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Stddev_Pop_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Stddev_Samp_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "evaluation_narratives" */
export type Evaluation_Narratives_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Evaluation_Narratives_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Evaluation_Narratives_Stream_Cursor_Value_Input = {
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

/** order by sum() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Sum_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** update columns of table "evaluation_narratives" */
export enum Evaluation_Narratives_Update_Column {
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

export type Evaluation_Narratives_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Evaluation_Narratives_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Evaluation_Narratives_Set_Input>;
  /** filter the rows which have to be updated */
  where: Evaluation_Narratives_Bool_Exp;
};

/** order by var_pop() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Var_Pop_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Var_Samp_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Variance_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "evaluation_questions". All fields are combined with a logical 'AND'. */
export type Evaluation_Questions_Bool_Exp = {
  _and: InputMaybe<Array<Evaluation_Questions_Bool_Exp>>;
  _not: InputMaybe<Evaluation_Questions_Bool_Exp>;
  _or: InputMaybe<Array<Evaluation_Questions_Bool_Exp>>;
  evaluation_narratives: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  evaluation_narratives_aggregate: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp>;
  evaluation_ratings: InputMaybe<Evaluation_Ratings_Bool_Exp>;
  evaluation_ratings_aggregate: InputMaybe<Evaluation_Ratings_Aggregate_Bool_Exp>;
  is_narrative: InputMaybe<Boolean_Comparison_Exp>;
  options: InputMaybe<Json_Comparison_Exp>;
  question_code: InputMaybe<String_Comparison_Exp>;
  question_text: InputMaybe<String_Comparison_Exp>;
  tag: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "evaluation_questions" */
export enum Evaluation_Questions_Constraint {
  /** unique or primary key constraint on columns "question_code" */
  PkEvaluationQuestionsStaged = 'pk_evaluation_questions_staged',
}

/** input type for inserting data into table "evaluation_questions" */
export type Evaluation_Questions_Insert_Input = {
  evaluation_narratives: InputMaybe<Evaluation_Narratives_Arr_Rel_Insert_Input>;
  evaluation_ratings: InputMaybe<Evaluation_Ratings_Arr_Rel_Insert_Input>;
  /**
   * True if the question has narrative responses.
   *         False if the question has categorica/numerical responses
   */
  is_narrative: InputMaybe<Scalars['Boolean']['input']>;
  /** JSON array of possible responses (only if the question is not a narrative */
  options: InputMaybe<Scalars['json']['input']>;
  /** Question code from OCE (e.g. "YC402") */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** The question text */
  question_text: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Question type (used for computing ratings, since one
   *         question may be coded differently for different respondants)
   */
  tag: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting object relation for remote table "evaluation_questions" */
export type Evaluation_Questions_Obj_Rel_Insert_Input = {
  data: Evaluation_Questions_Insert_Input;
  /** upsert condition */
  on_conflict: InputMaybe<Evaluation_Questions_On_Conflict>;
};

/** on_conflict condition type for table "evaluation_questions" */
export type Evaluation_Questions_On_Conflict = {
  constraint: Evaluation_Questions_Constraint;
  update_columns: Array<Evaluation_Questions_Update_Column>;
  where: InputMaybe<Evaluation_Questions_Bool_Exp>;
};

/** Ordering options when selecting data from "evaluation_questions". */
export type Evaluation_Questions_Order_By = {
  evaluation_narratives_aggregate: InputMaybe<Evaluation_Narratives_Aggregate_Order_By>;
  evaluation_ratings_aggregate: InputMaybe<Evaluation_Ratings_Aggregate_Order_By>;
  is_narrative: InputMaybe<Order_By>;
  options: InputMaybe<Order_By>;
  question_code: InputMaybe<Order_By>;
  question_text: InputMaybe<Order_By>;
  tag: InputMaybe<Order_By>;
};

/** primary key columns input for table: evaluation_questions */
export type Evaluation_Questions_Pk_Columns_Input = {
  /** Question code from OCE (e.g. "YC402") */
  question_code: Scalars['String']['input'];
};

/** select columns of table "evaluation_questions" */
export enum Evaluation_Questions_Select_Column {
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
export type Evaluation_Questions_Set_Input = {
  /**
   * True if the question has narrative responses.
   *         False if the question has categorica/numerical responses
   */
  is_narrative: InputMaybe<Scalars['Boolean']['input']>;
  /** JSON array of possible responses (only if the question is not a narrative */
  options: InputMaybe<Scalars['json']['input']>;
  /** Question code from OCE (e.g. "YC402") */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** The question text */
  question_text: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Question type (used for computing ratings, since one
   *         question may be coded differently for different respondants)
   */
  tag: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "evaluation_questions" */
export type Evaluation_Questions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Evaluation_Questions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Evaluation_Questions_Stream_Cursor_Value_Input = {
  /**
   * True if the question has narrative responses.
   *         False if the question has categorica/numerical responses
   */
  is_narrative: InputMaybe<Scalars['Boolean']['input']>;
  /** JSON array of possible responses (only if the question is not a narrative */
  options: InputMaybe<Scalars['json']['input']>;
  /** Question code from OCE (e.g. "YC402") */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** The question text */
  question_text: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Question type (used for computing ratings, since one
   *         question may be coded differently for different respondants)
   */
  tag: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "evaluation_questions" */
export enum Evaluation_Questions_Update_Column {
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

export type Evaluation_Questions_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Evaluation_Questions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Evaluation_Questions_Bool_Exp;
};

export type Evaluation_Ratings_Aggregate_Bool_Exp = {
  count: InputMaybe<Evaluation_Ratings_Aggregate_Bool_Exp_Count>;
};

export type Evaluation_Ratings_Aggregate_Bool_Exp_Count = {
  arguments: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Evaluation_Ratings_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "evaluation_ratings" */
export type Evaluation_Ratings_Aggregate_Order_By = {
  avg: InputMaybe<Evaluation_Ratings_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Evaluation_Ratings_Max_Order_By>;
  min: InputMaybe<Evaluation_Ratings_Min_Order_By>;
  stddev: InputMaybe<Evaluation_Ratings_Stddev_Order_By>;
  stddev_pop: InputMaybe<Evaluation_Ratings_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Evaluation_Ratings_Stddev_Samp_Order_By>;
  sum: InputMaybe<Evaluation_Ratings_Sum_Order_By>;
  var_pop: InputMaybe<Evaluation_Ratings_Var_Pop_Order_By>;
  var_samp: InputMaybe<Evaluation_Ratings_Var_Samp_Order_By>;
  variance: InputMaybe<Evaluation_Ratings_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "evaluation_ratings" */
export type Evaluation_Ratings_Arr_Rel_Insert_Input = {
  data: Array<Evaluation_Ratings_Insert_Input>;
  /** upsert condition */
  on_conflict: InputMaybe<Evaluation_Ratings_On_Conflict>;
};

/** order by avg() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Avg_Order_By = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "evaluation_ratings". All fields are combined with a logical 'AND'. */
export type Evaluation_Ratings_Bool_Exp = {
  _and: InputMaybe<Array<Evaluation_Ratings_Bool_Exp>>;
  _not: InputMaybe<Evaluation_Ratings_Bool_Exp>;
  _or: InputMaybe<Array<Evaluation_Ratings_Bool_Exp>>;
  course: InputMaybe<Courses_Bool_Exp>;
  course_id: InputMaybe<Int_Comparison_Exp>;
  evaluation_question: InputMaybe<Evaluation_Questions_Bool_Exp>;
  id: InputMaybe<Int_Comparison_Exp>;
  question_code: InputMaybe<String_Comparison_Exp>;
  rating: InputMaybe<Json_Comparison_Exp>;
};

/** unique or primary key constraints on table "evaluation_ratings" */
export enum Evaluation_Ratings_Constraint {
  /** unique or primary key constraint on columns "id" */
  PkEvaluationRatingsStaged = 'pk_evaluation_ratings_staged',
}

/** input type for incrementing numeric columns in table "evaluation_ratings" */
export type Evaluation_Ratings_Inc_Input = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "evaluation_ratings" */
export type Evaluation_Ratings_Insert_Input = {
  course: InputMaybe<Courses_Obj_Rel_Insert_Input>;
  /** The course to which this rating applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  evaluation_question: InputMaybe<Evaluation_Questions_Obj_Rel_Insert_Input>;
  id: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this rating responds */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** JSON array of the response counts for each option */
  rating: InputMaybe<Scalars['json']['input']>;
};

/** order by max() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Max_Order_By = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  /** Question to which this rating responds */
  question_code: InputMaybe<Order_By>;
};

/** order by min() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Min_Order_By = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
  /** Question to which this rating responds */
  question_code: InputMaybe<Order_By>;
};

/** on_conflict condition type for table "evaluation_ratings" */
export type Evaluation_Ratings_On_Conflict = {
  constraint: Evaluation_Ratings_Constraint;
  update_columns: Array<Evaluation_Ratings_Update_Column>;
  where: InputMaybe<Evaluation_Ratings_Bool_Exp>;
};

/** Ordering options when selecting data from "evaluation_ratings". */
export type Evaluation_Ratings_Order_By = {
  course: InputMaybe<Courses_Order_By>;
  course_id: InputMaybe<Order_By>;
  evaluation_question: InputMaybe<Evaluation_Questions_Order_By>;
  id: InputMaybe<Order_By>;
  question_code: InputMaybe<Order_By>;
  rating: InputMaybe<Order_By>;
};

/** primary key columns input for table: evaluation_ratings */
export type Evaluation_Ratings_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "evaluation_ratings" */
export enum Evaluation_Ratings_Select_Column {
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
export type Evaluation_Ratings_Set_Input = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this rating responds */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** JSON array of the response counts for each option */
  rating: InputMaybe<Scalars['json']['input']>;
};

/** order by stddev() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Stddev_Order_By = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Stddev_Pop_Order_By = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Stddev_Samp_Order_By = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "evaluation_ratings" */
export type Evaluation_Ratings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Evaluation_Ratings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Evaluation_Ratings_Stream_Cursor_Value_Input = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Scalars['Int']['input']>;
  id: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this rating responds */
  question_code: InputMaybe<Scalars['String']['input']>;
  /** JSON array of the response counts for each option */
  rating: InputMaybe<Scalars['json']['input']>;
};

/** order by sum() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Sum_Order_By = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** update columns of table "evaluation_ratings" */
export enum Evaluation_Ratings_Update_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Id = 'id',
  /** column name */
  QuestionCode = 'question_code',
  /** column name */
  Rating = 'rating',
}

export type Evaluation_Ratings_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Evaluation_Ratings_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Evaluation_Ratings_Set_Input>;
  /** filter the rows which have to be updated */
  where: Evaluation_Ratings_Bool_Exp;
};

/** order by var_pop() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Var_Pop_Order_By = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Var_Samp_Order_By = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Variance_Order_By = {
  /** The course to which this rating applies */
  course_id: InputMaybe<Order_By>;
  id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "evaluation_statistics". All fields are combined with a logical 'AND'. */
export type Evaluation_Statistics_Bool_Exp = {
  _and: InputMaybe<Array<Evaluation_Statistics_Bool_Exp>>;
  _not: InputMaybe<Evaluation_Statistics_Bool_Exp>;
  _or: InputMaybe<Array<Evaluation_Statistics_Bool_Exp>>;
  avg_rating: InputMaybe<Float8_Comparison_Exp>;
  avg_workload: InputMaybe<Float8_Comparison_Exp>;
  course: InputMaybe<Courses_Bool_Exp>;
  course_id: InputMaybe<Int_Comparison_Exp>;
  declined: InputMaybe<Int_Comparison_Exp>;
  enrolled: InputMaybe<Int_Comparison_Exp>;
  enrollment: InputMaybe<Int_Comparison_Exp>;
  extras: InputMaybe<Json_Comparison_Exp>;
  no_response: InputMaybe<Int_Comparison_Exp>;
  responses: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "evaluation_statistics" */
export enum Evaluation_Statistics_Constraint {
  /** unique or primary key constraint on columns "course_id" */
  PkEvaluationStatisticsStaged = 'pk_evaluation_statistics_staged',
}

/** input type for incrementing numeric columns in table "evaluation_statistics" */
export type Evaluation_Statistics_Inc_Input = {
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
  /** Placeholder for compatibility (previously held JSON for enrollment) */
  enrollment: InputMaybe<Scalars['Int']['input']>;
  /** Number of students who did not respond */
  no_response: InputMaybe<Scalars['Int']['input']>;
  /** Number of responses */
  responses: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "evaluation_statistics" */
export type Evaluation_Statistics_Insert_Input = {
  /** [computed] Average overall rating */
  avg_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average workload rating */
  avg_workload: InputMaybe<Scalars['float8']['input']>;
  course: InputMaybe<Courses_Obj_Rel_Insert_Input>;
  /** The course associated with these statistics */
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** Number of students who declined to respond */
  declined: InputMaybe<Scalars['Int']['input']>;
  /** Number of students enrolled in course */
  enrolled: InputMaybe<Scalars['Int']['input']>;
  /** Placeholder for compatibility (previously held JSON for enrollment) */
  enrollment: InputMaybe<Scalars['Int']['input']>;
  /** Arbitrary additional information attached to an evaluation */
  extras: InputMaybe<Scalars['json']['input']>;
  /** Number of students who did not respond */
  no_response: InputMaybe<Scalars['Int']['input']>;
  /** Number of responses */
  responses: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting object relation for remote table "evaluation_statistics" */
export type Evaluation_Statistics_Obj_Rel_Insert_Input = {
  data: Evaluation_Statistics_Insert_Input;
  /** upsert condition */
  on_conflict: InputMaybe<Evaluation_Statistics_On_Conflict>;
};

/** on_conflict condition type for table "evaluation_statistics" */
export type Evaluation_Statistics_On_Conflict = {
  constraint: Evaluation_Statistics_Constraint;
  update_columns: Array<Evaluation_Statistics_Update_Column>;
  where: InputMaybe<Evaluation_Statistics_Bool_Exp>;
};

/** Ordering options when selecting data from "evaluation_statistics". */
export type Evaluation_Statistics_Order_By = {
  avg_rating: InputMaybe<Order_By>;
  avg_workload: InputMaybe<Order_By>;
  course: InputMaybe<Courses_Order_By>;
  course_id: InputMaybe<Order_By>;
  declined: InputMaybe<Order_By>;
  enrolled: InputMaybe<Order_By>;
  enrollment: InputMaybe<Order_By>;
  extras: InputMaybe<Order_By>;
  no_response: InputMaybe<Order_By>;
  responses: InputMaybe<Order_By>;
};

/** primary key columns input for table: evaluation_statistics */
export type Evaluation_Statistics_Pk_Columns_Input = {
  /** The course associated with these statistics */
  course_id: Scalars['Int']['input'];
};

/** select columns of table "evaluation_statistics" */
export enum Evaluation_Statistics_Select_Column {
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
  Enrollment = 'enrollment',
  /** column name */
  Extras = 'extras',
  /** column name */
  NoResponse = 'no_response',
  /** column name */
  Responses = 'responses',
}

/** input type for updating data in table "evaluation_statistics" */
export type Evaluation_Statistics_Set_Input = {
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
  /** Placeholder for compatibility (previously held JSON for enrollment) */
  enrollment: InputMaybe<Scalars['Int']['input']>;
  /** Arbitrary additional information attached to an evaluation */
  extras: InputMaybe<Scalars['json']['input']>;
  /** Number of students who did not respond */
  no_response: InputMaybe<Scalars['Int']['input']>;
  /** Number of responses */
  responses: InputMaybe<Scalars['Int']['input']>;
};

/** Streaming cursor of the table "evaluation_statistics" */
export type Evaluation_Statistics_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Evaluation_Statistics_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Evaluation_Statistics_Stream_Cursor_Value_Input = {
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
  /** Placeholder for compatibility (previously held JSON for enrollment) */
  enrollment: InputMaybe<Scalars['Int']['input']>;
  /** Arbitrary additional information attached to an evaluation */
  extras: InputMaybe<Scalars['json']['input']>;
  /** Number of students who did not respond */
  no_response: InputMaybe<Scalars['Int']['input']>;
  /** Number of responses */
  responses: InputMaybe<Scalars['Int']['input']>;
};

/** update columns of table "evaluation_statistics" */
export enum Evaluation_Statistics_Update_Column {
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
  Enrollment = 'enrollment',
  /** column name */
  Extras = 'extras',
  /** column name */
  NoResponse = 'no_response',
  /** column name */
  Responses = 'responses',
}

export type Evaluation_Statistics_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Evaluation_Statistics_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Evaluation_Statistics_Set_Input>;
  /** filter the rows which have to be updated */
  where: Evaluation_Statistics_Bool_Exp;
};

/** Boolean expression to filter rows from the table "flags". All fields are combined with a logical 'AND'. */
export type Flags_Bool_Exp = {
  _and: InputMaybe<Array<Flags_Bool_Exp>>;
  _not: InputMaybe<Flags_Bool_Exp>;
  _or: InputMaybe<Array<Flags_Bool_Exp>>;
  course_flags: InputMaybe<Course_Flags_Bool_Exp>;
  course_flags_aggregate: InputMaybe<Course_Flags_Aggregate_Bool_Exp>;
  flag_id: InputMaybe<Int_Comparison_Exp>;
  flag_text: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "flags" */
export enum Flags_Constraint {
  /** unique or primary key constraint on columns "flag_id" */
  PkFlagsStaged = 'pk_flags_staged',
}

/** input type for incrementing numeric columns in table "flags" */
export type Flags_Inc_Input = {
  /** Flag ID */
  flag_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "flags" */
export type Flags_Insert_Input = {
  course_flags: InputMaybe<Course_Flags_Arr_Rel_Insert_Input>;
  /** Flag ID */
  flag_id: InputMaybe<Scalars['Int']['input']>;
  /** Flag text */
  flag_text: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting object relation for remote table "flags" */
export type Flags_Obj_Rel_Insert_Input = {
  data: Flags_Insert_Input;
  /** upsert condition */
  on_conflict: InputMaybe<Flags_On_Conflict>;
};

/** on_conflict condition type for table "flags" */
export type Flags_On_Conflict = {
  constraint: Flags_Constraint;
  update_columns: Array<Flags_Update_Column>;
  where: InputMaybe<Flags_Bool_Exp>;
};

/** Ordering options when selecting data from "flags". */
export type Flags_Order_By = {
  course_flags_aggregate: InputMaybe<Course_Flags_Aggregate_Order_By>;
  flag_id: InputMaybe<Order_By>;
  flag_text: InputMaybe<Order_By>;
};

/** primary key columns input for table: flags */
export type Flags_Pk_Columns_Input = {
  /** Flag ID */
  flag_id: Scalars['Int']['input'];
};

/** select columns of table "flags" */
export enum Flags_Select_Column {
  /** column name */
  FlagId = 'flag_id',
  /** column name */
  FlagText = 'flag_text',
}

/** input type for updating data in table "flags" */
export type Flags_Set_Input = {
  /** Flag ID */
  flag_id: InputMaybe<Scalars['Int']['input']>;
  /** Flag text */
  flag_text: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "flags" */
export type Flags_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Flags_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Flags_Stream_Cursor_Value_Input = {
  /** Flag ID */
  flag_id: InputMaybe<Scalars['Int']['input']>;
  /** Flag text */
  flag_text: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "flags" */
export enum Flags_Update_Column {
  /** column name */
  FlagId = 'flag_id',
  /** column name */
  FlagText = 'flag_text',
}

export type Flags_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Flags_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Flags_Set_Input>;
  /** filter the rows which have to be updated */
  where: Flags_Bool_Exp;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
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
export type Json_Comparison_Exp = {
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

export type Jsonb_Cast_Exp = {
  String: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast: InputMaybe<Jsonb_Cast_Exp>;
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

export type Listings_Aggregate_Bool_Exp = {
  count: InputMaybe<Listings_Aggregate_Bool_Exp_Count>;
};

export type Listings_Aggregate_Bool_Exp_Count = {
  arguments: InputMaybe<Array<Listings_Select_Column>>;
  distinct: InputMaybe<Scalars['Boolean']['input']>;
  filter: InputMaybe<Listings_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "listings" */
export type Listings_Aggregate_Order_By = {
  avg: InputMaybe<Listings_Avg_Order_By>;
  count: InputMaybe<Order_By>;
  max: InputMaybe<Listings_Max_Order_By>;
  min: InputMaybe<Listings_Min_Order_By>;
  stddev: InputMaybe<Listings_Stddev_Order_By>;
  stddev_pop: InputMaybe<Listings_Stddev_Pop_Order_By>;
  stddev_samp: InputMaybe<Listings_Stddev_Samp_Order_By>;
  sum: InputMaybe<Listings_Sum_Order_By>;
  var_pop: InputMaybe<Listings_Var_Pop_Order_By>;
  var_samp: InputMaybe<Listings_Var_Samp_Order_By>;
  variance: InputMaybe<Listings_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "listings" */
export type Listings_Arr_Rel_Insert_Input = {
  data: Array<Listings_Insert_Input>;
  /** upsert condition */
  on_conflict: InputMaybe<Listings_On_Conflict>;
};

/** order by avg() on columns of table "listings" */
export type Listings_Avg_Order_By = {
  /** Course that the listing refers to */
  course_id: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "listings". All fields are combined with a logical 'AND'. */
export type Listings_Bool_Exp = {
  _and: InputMaybe<Array<Listings_Bool_Exp>>;
  _not: InputMaybe<Listings_Bool_Exp>;
  _or: InputMaybe<Array<Listings_Bool_Exp>>;
  computed_listing_infos: InputMaybe<Computed_Listing_Info_Bool_Exp>;
  computed_listing_infos_aggregate: InputMaybe<Computed_Listing_Info_Aggregate_Bool_Exp>;
  course: InputMaybe<Courses_Bool_Exp>;
  course_code: InputMaybe<String_Comparison_Exp>;
  course_id: InputMaybe<Int_Comparison_Exp>;
  crn: InputMaybe<Int_Comparison_Exp>;
  listing_id: InputMaybe<Int_Comparison_Exp>;
  number: InputMaybe<String_Comparison_Exp>;
  school: InputMaybe<String_Comparison_Exp>;
  season: InputMaybe<Seasons_Bool_Exp>;
  season_code: InputMaybe<String_Comparison_Exp>;
  section: InputMaybe<String_Comparison_Exp>;
  subject: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "listings" */
export enum Listings_Constraint {
  /** unique or primary key constraint on columns "crn", "season_code" */
  IdxSeasonCodeCrnUnique = 'idx_season_code_crn_unique',
  /** unique or primary key constraint on columns "listing_id" */
  PkListingsStaged = 'pk_listings_staged',
}

/** input type for incrementing numeric columns in table "listings" */
export type Listings_Inc_Input = {
  /** Course that the listing refers to */
  course_id: InputMaybe<Scalars['Int']['input']>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Scalars['Int']['input']>;
  /** Listing ID */
  listing_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "listings" */
export type Listings_Insert_Input = {
  computed_listing_infos: InputMaybe<Computed_Listing_Info_Arr_Rel_Insert_Input>;
  course: InputMaybe<Courses_Obj_Rel_Insert_Input>;
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
  season: InputMaybe<Seasons_Obj_Rel_Insert_Input>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<Scalars['String']['input']>;
  /** Course section for the given subject and number */
  section: InputMaybe<Scalars['String']['input']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<Scalars['String']['input']>;
};

/** order by max() on columns of table "listings" */
export type Listings_Max_Order_By = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: InputMaybe<Order_By>;
  /** Course that the listing refers to */
  course_id: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id: InputMaybe<Order_By>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: InputMaybe<Order_By>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: InputMaybe<Order_By>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<Order_By>;
  /** Course section for the given subject and number */
  section: InputMaybe<Order_By>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<Order_By>;
};

/** order by min() on columns of table "listings" */
export type Listings_Min_Order_By = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code: InputMaybe<Order_By>;
  /** Course that the listing refers to */
  course_id: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id: InputMaybe<Order_By>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: InputMaybe<Order_By>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school: InputMaybe<Order_By>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: InputMaybe<Order_By>;
  /** Course section for the given subject and number */
  section: InputMaybe<Order_By>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<Order_By>;
};

/** input type for inserting object relation for remote table "listings" */
export type Listings_Obj_Rel_Insert_Input = {
  data: Listings_Insert_Input;
  /** upsert condition */
  on_conflict: InputMaybe<Listings_On_Conflict>;
};

/** on_conflict condition type for table "listings" */
export type Listings_On_Conflict = {
  constraint: Listings_Constraint;
  update_columns: Array<Listings_Update_Column>;
  where: InputMaybe<Listings_Bool_Exp>;
};

/** Ordering options when selecting data from "listings". */
export type Listings_Order_By = {
  computed_listing_infos_aggregate: InputMaybe<Computed_Listing_Info_Aggregate_Order_By>;
  course: InputMaybe<Courses_Order_By>;
  course_code: InputMaybe<Order_By>;
  course_id: InputMaybe<Order_By>;
  crn: InputMaybe<Order_By>;
  listing_id: InputMaybe<Order_By>;
  number: InputMaybe<Order_By>;
  school: InputMaybe<Order_By>;
  season: InputMaybe<Seasons_Order_By>;
  season_code: InputMaybe<Order_By>;
  section: InputMaybe<Order_By>;
  subject: InputMaybe<Order_By>;
};

/** primary key columns input for table: listings */
export type Listings_Pk_Columns_Input = {
  /** Listing ID */
  listing_id: Scalars['Int']['input'];
};

/** select columns of table "listings" */
export enum Listings_Select_Column {
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
export type Listings_Set_Input = {
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
  /** Course section for the given subject and number */
  section: InputMaybe<Scalars['String']['input']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<Scalars['String']['input']>;
};

/** order by stddev() on columns of table "listings" */
export type Listings_Stddev_Order_By = {
  /** Course that the listing refers to */
  course_id: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "listings" */
export type Listings_Stddev_Pop_Order_By = {
  /** Course that the listing refers to */
  course_id: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "listings" */
export type Listings_Stddev_Samp_Order_By = {
  /** Course that the listing refers to */
  course_id: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "listings" */
export type Listings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Listings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Listings_Stream_Cursor_Value_Input = {
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
  /** Course section for the given subject and number */
  section: InputMaybe<Scalars['String']['input']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "listings" */
export type Listings_Sum_Order_By = {
  /** Course that the listing refers to */
  course_id: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id: InputMaybe<Order_By>;
};

/** update columns of table "listings" */
export enum Listings_Update_Column {
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

export type Listings_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Listings_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Listings_Set_Input>;
  /** filter the rows which have to be updated */
  where: Listings_Bool_Exp;
};

/** order by var_pop() on columns of table "listings" */
export type Listings_Var_Pop_Order_By = {
  /** Course that the listing refers to */
  course_id: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "listings" */
export type Listings_Var_Samp_Order_By = {
  /** Course that the listing refers to */
  course_id: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "listings" */
export type Listings_Variance_Order_By = {
  /** Course that the listing refers to */
  course_id: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id: InputMaybe<Order_By>;
};

/** column ordering options */
export enum Order_By {
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

/** Boolean expression to filter rows from the table "professors". All fields are combined with a logical 'AND'. */
export type Professors_Bool_Exp = {
  _and: InputMaybe<Array<Professors_Bool_Exp>>;
  _not: InputMaybe<Professors_Bool_Exp>;
  _or: InputMaybe<Array<Professors_Bool_Exp>>;
  average_rating: InputMaybe<Float8_Comparison_Exp>;
  average_rating_n: InputMaybe<Int_Comparison_Exp>;
  course_professors: InputMaybe<Course_Professors_Bool_Exp>;
  course_professors_aggregate: InputMaybe<Course_Professors_Aggregate_Bool_Exp>;
  email: InputMaybe<String_Comparison_Exp>;
  name: InputMaybe<String_Comparison_Exp>;
  professor_id: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "professors" */
export enum Professors_Constraint {
  /** unique or primary key constraint on columns "professor_id" */
  PkProfessorsStaged = 'pk_professors_staged',
}

/** input type for incrementing numeric columns in table "professors" */
export type Professors_Inc_Input = {
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
export type Professors_Insert_Input = {
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n: InputMaybe<Scalars['Int']['input']>;
  course_professors: InputMaybe<Course_Professors_Arr_Rel_Insert_Input>;
  /** Email address of the professor */
  email: InputMaybe<Scalars['String']['input']>;
  /** Name of the professor */
  name: InputMaybe<Scalars['String']['input']>;
  /** Professor ID */
  professor_id: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting object relation for remote table "professors" */
export type Professors_Obj_Rel_Insert_Input = {
  data: Professors_Insert_Input;
  /** upsert condition */
  on_conflict: InputMaybe<Professors_On_Conflict>;
};

/** on_conflict condition type for table "professors" */
export type Professors_On_Conflict = {
  constraint: Professors_Constraint;
  update_columns: Array<Professors_Update_Column>;
  where: InputMaybe<Professors_Bool_Exp>;
};

/** Ordering options when selecting data from "professors". */
export type Professors_Order_By = {
  average_rating: InputMaybe<Order_By>;
  average_rating_n: InputMaybe<Order_By>;
  course_professors_aggregate: InputMaybe<Course_Professors_Aggregate_Order_By>;
  email: InputMaybe<Order_By>;
  name: InputMaybe<Order_By>;
  professor_id: InputMaybe<Order_By>;
};

/** primary key columns input for table: professors */
export type Professors_Pk_Columns_Input = {
  /** Professor ID */
  professor_id: Scalars['Int']['input'];
};

/** select columns of table "professors" */
export enum Professors_Select_Column {
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
export type Professors_Set_Input = {
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

/** Streaming cursor of the table "professors" */
export type Professors_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Professors_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Professors_Stream_Cursor_Value_Input = {
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

/** update columns of table "professors" */
export enum Professors_Update_Column {
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

export type Professors_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Professors_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Professors_Set_Input>;
  /** filter the rows which have to be updated */
  where: Professors_Bool_Exp;
};

/** Boolean expression to filter rows from the table "seasons". All fields are combined with a logical 'AND'. */
export type Seasons_Bool_Exp = {
  _and: InputMaybe<Array<Seasons_Bool_Exp>>;
  _not: InputMaybe<Seasons_Bool_Exp>;
  _or: InputMaybe<Array<Seasons_Bool_Exp>>;
  courses: InputMaybe<Courses_Bool_Exp>;
  coursesBySeasonCode: InputMaybe<Courses_Bool_Exp>;
  coursesBySeasonCode_aggregate: InputMaybe<Courses_Aggregate_Bool_Exp>;
  courses_aggregate: InputMaybe<Courses_Aggregate_Bool_Exp>;
  listings: InputMaybe<Listings_Bool_Exp>;
  listings_aggregate: InputMaybe<Listings_Aggregate_Bool_Exp>;
  season_code: InputMaybe<String_Comparison_Exp>;
  term: InputMaybe<String_Comparison_Exp>;
  year: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "seasons" */
export enum Seasons_Constraint {
  /** unique or primary key constraint on columns "season_code" */
  PkSeasonsStaged = 'pk_seasons_staged',
}

/** input type for incrementing numeric columns in table "seasons" */
export type Seasons_Inc_Input = {
  /** [computed] Year of the semester */
  year: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "seasons" */
export type Seasons_Insert_Input = {
  courses: InputMaybe<Courses_Arr_Rel_Insert_Input>;
  coursesBySeasonCode: InputMaybe<Courses_Arr_Rel_Insert_Input>;
  listings: InputMaybe<Listings_Arr_Rel_Insert_Input>;
  /** Season code (e.g. '202001') */
  season_code: InputMaybe<Scalars['String']['input']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: InputMaybe<Scalars['String']['input']>;
  /** [computed] Year of the semester */
  year: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting object relation for remote table "seasons" */
export type Seasons_Obj_Rel_Insert_Input = {
  data: Seasons_Insert_Input;
  /** upsert condition */
  on_conflict: InputMaybe<Seasons_On_Conflict>;
};

/** on_conflict condition type for table "seasons" */
export type Seasons_On_Conflict = {
  constraint: Seasons_Constraint;
  update_columns: Array<Seasons_Update_Column>;
  where: InputMaybe<Seasons_Bool_Exp>;
};

/** Ordering options when selecting data from "seasons". */
export type Seasons_Order_By = {
  coursesBySeasonCode_aggregate: InputMaybe<Courses_Aggregate_Order_By>;
  courses_aggregate: InputMaybe<Courses_Aggregate_Order_By>;
  listings_aggregate: InputMaybe<Listings_Aggregate_Order_By>;
  season_code: InputMaybe<Order_By>;
  term: InputMaybe<Order_By>;
  year: InputMaybe<Order_By>;
};

/** primary key columns input for table: seasons */
export type Seasons_Pk_Columns_Input = {
  /** Season code (e.g. '202001') */
  season_code: Scalars['String']['input'];
};

/** select columns of table "seasons" */
export enum Seasons_Select_Column {
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Term = 'term',
  /** column name */
  Year = 'year',
}

/** input type for updating data in table "seasons" */
export type Seasons_Set_Input = {
  /** Season code (e.g. '202001') */
  season_code: InputMaybe<Scalars['String']['input']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: InputMaybe<Scalars['String']['input']>;
  /** [computed] Year of the semester */
  year: InputMaybe<Scalars['Int']['input']>;
};

/** Streaming cursor of the table "seasons" */
export type Seasons_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Seasons_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Seasons_Stream_Cursor_Value_Input = {
  /** Season code (e.g. '202001') */
  season_code: InputMaybe<Scalars['String']['input']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: InputMaybe<Scalars['String']['input']>;
  /** [computed] Year of the semester */
  year: InputMaybe<Scalars['Int']['input']>;
};

/** update columns of table "seasons" */
export enum Seasons_Update_Column {
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Term = 'term',
  /** column name */
  Year = 'year',
}

export type Seasons_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc: InputMaybe<Seasons_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set: InputMaybe<Seasons_Set_Input>;
  /** filter the rows which have to be updated */
  where: Seasons_Bool_Exp;
};

export type SameCourseOrProfOfferingsQueryVariables = Exact<{
  same_course_id: Scalars['Int']['input'];
  professor_ids: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
  hasEval: Scalars['Boolean']['input'];
}>;

export type SameCourseOrProfOfferingsQuery = {
  __typename?: 'query_root';
  computed_listing_info: Array<
    {
      __typename?: 'computed_listing_info';
      professor_info?: any;
      course?: {
        __typename?: 'courses';
        evaluation_statistic: {
          __typename?: 'evaluation_statistics';
          avg_workload: number | null;
          avg_rating: number | null;
        } | null;
      };
    } & ListingFragment &
      ListingRatingsFragment
  >;
};

export type SearchEvaluationNarrativesQueryVariables = Exact<{
  season_code: InputMaybe<Scalars['String']['input']>;
  crn: InputMaybe<Scalars['Int']['input']>;
}>;

export type SearchEvaluationNarrativesQuery = {
  __typename?: 'query_root';
  computed_listing_info: Array<{
    __typename?: 'computed_listing_info';
    crn: number;
    course: {
      __typename?: 'courses';
      evaluation_narratives_aggregate: {
        __typename?: 'evaluation_narratives_aggregate';
        nodes: Array<{
          __typename?: 'evaluation_narratives';
          comment: string | null;
          evaluation_question: {
            __typename?: 'evaluation_questions';
            question_text: string | null;
          };
        }>;
      };
      evaluation_ratings: Array<{
        __typename?: 'evaluation_ratings';
        rating: any | null;
        evaluation_question: {
          __typename?: 'evaluation_questions';
          question_text: string | null;
        };
      }>;
    };
  }>;
};

export type CatalogBySeasonQueryVariables = Exact<{
  season: Scalars['String']['input'];
}>;

export type CatalogBySeasonQuery = {
  __typename?: 'query_root';
  computed_listing_info: Array<
    { __typename?: 'computed_listing_info' } & ListingFragment
  >;
};

export type EvalsBySeasonQueryVariables = Exact<{
  season: Scalars['String']['input'];
}>;

export type EvalsBySeasonQuery = {
  __typename?: 'query_root';
  computed_listing_info: Array<
    { __typename?: 'computed_listing_info' } & ListingRatingsFragment
  >;
};

export type ListingRatingsFragment = {
  __typename?: 'computed_listing_info';
  average_gut_rating: number | null;
  average_professor: number | null;
  average_rating: number | null;
  average_workload: number | null;
  average_rating_same_professors: number | null;
  average_workload_same_professors: number | null;
  crn: number;
  enrolled: number | null;
  last_enrollment: number | null;
  last_enrollment_same_professors: boolean | null;
};

export type ListingFragment = {
  __typename?: 'computed_listing_info';
  all_course_codes: any;
  areas: any;
  classnotes: string | null;
  course_code: string;
  credits: number | null;
  crn: number;
  description: string | null;
  extra_info: string;
  final_exam: string | null;
  flag_info: any;
  fysem: boolean | null;
  listing_id: number;
  locations_summary: string;
  number: string;
  professor_ids: any;
  professor_names: any;
  regnotes: string | null;
  requirements: string | null;
  rp_attr: string | null;
  same_course_id: number;
  same_course_and_profs_id: number;
  last_offered_course_id: number | null;
  school: string | null;
  season_code: string;
  section: string;
  skills: any;
  subject: string;
  syllabus_url: string | null;
  times_by_day: any;
  times_summary: string;
  title: string;
};

export const ListingRatingsFragmentDoc = gql`
  fragment ListingRatings on computed_listing_info {
    average_gut_rating
    average_professor
    average_rating
    average_workload
    average_rating_same_professors
    average_workload_same_professors
    crn
    enrolled
    last_enrollment
    last_enrollment_same_professors
  }
`;
export const ListingFragmentDoc = gql`
  fragment Listing on computed_listing_info {
    all_course_codes
    areas
    classnotes
    course_code
    credits
    crn
    description
    extra_info
    final_exam
    flag_info
    fysem
    listing_id
    locations_summary
    number
    professor_ids
    professor_names
    regnotes
    requirements
    rp_attr
    same_course_id
    same_course_and_profs_id
    last_offered_course_id
    school
    season_code
    section
    skills
    subject
    syllabus_url
    times_by_day
    times_summary
    title
  }
`;
export const SameCourseOrProfOfferingsDocument = gql`
  query SameCourseOrProfOfferings(
    $same_course_id: Int!
    $professor_ids: [String!]
    $hasEval: Boolean!
  ) {
    computed_listing_info(
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
      ...Listing
      ...ListingRatings @include(if: $hasEval)
    }
  }
  ${ListingFragmentDoc}
  ${ListingRatingsFragmentDoc}
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
    computed_listing_info(
      where: { season_code: { _eq: $season_code }, crn: { _eq: $crn } }
    ) {
      crn
      course {
        evaluation_narratives_aggregate {
          nodes {
            comment
            evaluation_question {
              question_text
            }
          }
        }
        evaluation_ratings {
          rating
          evaluation_question {
            question_text
          }
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
export const CatalogBySeasonDocument = gql`
  query catalogBySeason($season: String!) {
    computed_listing_info(where: { season_code: { _eq: $season } }) {
      ...Listing
    }
  }
  ${ListingFragmentDoc}
`;

/**
 * __useCatalogBySeasonQuery__
 *
 * To run a query within a React component, call `useCatalogBySeasonQuery` and pass it any options that fit your needs.
 * When your component renders, `useCatalogBySeasonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCatalogBySeasonQuery({
 *   variables: {
 *      season: // value for 'season'
 *   },
 * });
 */
export function useCatalogBySeasonQuery(
  baseOptions: Apollo.QueryHookOptions<
    CatalogBySeasonQuery,
    CatalogBySeasonQueryVariables
  > &
    (
      | { variables: CatalogBySeasonQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CatalogBySeasonQuery, CatalogBySeasonQueryVariables>(
    CatalogBySeasonDocument,
    options,
  );
}
export function useCatalogBySeasonLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CatalogBySeasonQuery,
    CatalogBySeasonQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CatalogBySeasonQuery,
    CatalogBySeasonQueryVariables
  >(CatalogBySeasonDocument, options);
}
export function useCatalogBySeasonSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    CatalogBySeasonQuery,
    CatalogBySeasonQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CatalogBySeasonQuery,
    CatalogBySeasonQueryVariables
  >(CatalogBySeasonDocument, options);
}
export type CatalogBySeasonQueryHookResult = ReturnType<
  typeof useCatalogBySeasonQuery
>;
export type CatalogBySeasonLazyQueryHookResult = ReturnType<
  typeof useCatalogBySeasonLazyQuery
>;
export type CatalogBySeasonSuspenseQueryHookResult = ReturnType<
  typeof useCatalogBySeasonSuspenseQuery
>;
export type CatalogBySeasonQueryResult = Apollo.QueryResult<
  CatalogBySeasonQuery,
  CatalogBySeasonQueryVariables
>;
export const EvalsBySeasonDocument = gql`
  query evalsBySeason($season: String!) {
    computed_listing_info(where: { season_code: { _eq: $season } }) {
      ...ListingRatings
    }
  }
  ${ListingRatingsFragmentDoc}
`;

/**
 * __useEvalsBySeasonQuery__
 *
 * To run a query within a React component, call `useEvalsBySeasonQuery` and pass it any options that fit your needs.
 * When your component renders, `useEvalsBySeasonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEvalsBySeasonQuery({
 *   variables: {
 *      season: // value for 'season'
 *   },
 * });
 */
export function useEvalsBySeasonQuery(
  baseOptions: Apollo.QueryHookOptions<
    EvalsBySeasonQuery,
    EvalsBySeasonQueryVariables
  > &
    (
      | { variables: EvalsBySeasonQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EvalsBySeasonQuery, EvalsBySeasonQueryVariables>(
    EvalsBySeasonDocument,
    options,
  );
}
export function useEvalsBySeasonLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    EvalsBySeasonQuery,
    EvalsBySeasonQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EvalsBySeasonQuery, EvalsBySeasonQueryVariables>(
    EvalsBySeasonDocument,
    options,
  );
}
export function useEvalsBySeasonSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    EvalsBySeasonQuery,
    EvalsBySeasonQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    EvalsBySeasonQuery,
    EvalsBySeasonQueryVariables
  >(EvalsBySeasonDocument, options);
}
export type EvalsBySeasonQueryHookResult = ReturnType<
  typeof useEvalsBySeasonQuery
>;
export type EvalsBySeasonLazyQueryHookResult = ReturnType<
  typeof useEvalsBySeasonLazyQuery
>;
export type EvalsBySeasonSuspenseQueryHookResult = ReturnType<
  typeof useEvalsBySeasonSuspenseQuery
>;
export type EvalsBySeasonQueryResult = Apollo.QueryResult<
  EvalsBySeasonQuery,
  EvalsBySeasonQueryVariables
>;
