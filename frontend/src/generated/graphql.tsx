import { gql } from 'graphql-tag';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  float8: any;
  json: any;
  jsonb: any;
};

/** expression to compare columns of type Boolean. All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: Maybe<Scalars['Boolean']>;
  _gt?: Maybe<Scalars['Boolean']>;
  _gte?: Maybe<Scalars['Boolean']>;
  _in?: Maybe<Array<Scalars['Boolean']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Boolean']>;
  _lte?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Scalars['Boolean']>;
  _nin?: Maybe<Array<Scalars['Boolean']>>;
};

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: Maybe<Scalars['Int']>;
  _gt?: Maybe<Scalars['Int']>;
  _gte?: Maybe<Scalars['Int']>;
  _in?: Maybe<Array<Scalars['Int']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Int']>;
  _lte?: Maybe<Scalars['Int']>;
  _neq?: Maybe<Scalars['Int']>;
  _nin?: Maybe<Array<Scalars['Int']>>;
};

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  _nlike?: Maybe<Scalars['String']>;
  _nsimilar?: Maybe<Scalars['String']>;
  _similar?: Maybe<Scalars['String']>;
};

/** columns and relationships of "computed_listing_info" */
export type Computed_Listing_Info = {
  __typename?: 'computed_listing_info';
  all_course_codes?: Maybe<Scalars['jsonb']>;
  areas?: Maybe<Scalars['jsonb']>;
  average_gut_rating?: Maybe<Scalars['float8']>;
  average_professor?: Maybe<Scalars['float8']>;
  average_rating?: Maybe<Scalars['float8']>;
  average_workload?: Maybe<Scalars['float8']>;
  classnotes?: Maybe<Scalars['String']>;
  /** An object relationship */
  course?: Maybe<Courses>;
  course_code?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  crn?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  extra_info?: Maybe<Scalars['String']>;
  final_exam?: Maybe<Scalars['String']>;
  flag_info?: Maybe<Scalars['jsonb']>;
  fysem?: Maybe<Scalars['Boolean']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_enrollment_same_professors?: Maybe<Scalars['Boolean']>;
  last_enrollment_season_code?: Maybe<Scalars['String']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  /** An object relationship */
  listing?: Maybe<Listings>;
  listing_id?: Maybe<Scalars['Int']>;
  locations_summary?: Maybe<Scalars['String']>;
  no_response?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  professor_info?: Maybe<Scalars['jsonb']>;
  professor_names?: Maybe<Scalars['jsonb']>;
  regnotes?: Maybe<Scalars['String']>;
  requirements?: Maybe<Scalars['String']>;
  responses?: Maybe<Scalars['Int']>;
  rp_attr?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  skills?: Maybe<Scalars['jsonb']>;
  subject?: Maybe<Scalars['String']>;
  syllabus_url?: Maybe<Scalars['String']>;
  times_by_day?: Maybe<Scalars['json']>;
  times_summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};


/** columns and relationships of "computed_listing_info" */
export type Computed_Listing_InfoAll_Course_CodesArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "computed_listing_info" */
export type Computed_Listing_InfoAreasArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "computed_listing_info" */
export type Computed_Listing_InfoFlag_InfoArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "computed_listing_info" */
export type Computed_Listing_InfoProfessor_InfoArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "computed_listing_info" */
export type Computed_Listing_InfoProfessor_NamesArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "computed_listing_info" */
export type Computed_Listing_InfoSkillsArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "computed_listing_info" */
export type Computed_Listing_InfoTimes_By_DayArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "computed_listing_info" */
export type Computed_Listing_Info_Aggregate = {
  __typename?: 'computed_listing_info_aggregate';
  aggregate?: Maybe<Computed_Listing_Info_Aggregate_Fields>;
  nodes: Array<Computed_Listing_Info>;
};

/** aggregate fields of "computed_listing_info" */
export type Computed_Listing_Info_Aggregate_Fields = {
  __typename?: 'computed_listing_info_aggregate_fields';
  avg?: Maybe<Computed_Listing_Info_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Computed_Listing_Info_Max_Fields>;
  min?: Maybe<Computed_Listing_Info_Min_Fields>;
  stddev?: Maybe<Computed_Listing_Info_Stddev_Fields>;
  stddev_pop?: Maybe<Computed_Listing_Info_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Computed_Listing_Info_Stddev_Samp_Fields>;
  sum?: Maybe<Computed_Listing_Info_Sum_Fields>;
  var_pop?: Maybe<Computed_Listing_Info_Var_Pop_Fields>;
  var_samp?: Maybe<Computed_Listing_Info_Var_Samp_Fields>;
  variance?: Maybe<Computed_Listing_Info_Variance_Fields>;
};


/** aggregate fields of "computed_listing_info" */
export type Computed_Listing_Info_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Computed_Listing_Info_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "computed_listing_info" */
export type Computed_Listing_Info_Aggregate_Order_By = {
  avg?: Maybe<Computed_Listing_Info_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Computed_Listing_Info_Max_Order_By>;
  min?: Maybe<Computed_Listing_Info_Min_Order_By>;
  stddev?: Maybe<Computed_Listing_Info_Stddev_Order_By>;
  stddev_pop?: Maybe<Computed_Listing_Info_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Computed_Listing_Info_Stddev_Samp_Order_By>;
  sum?: Maybe<Computed_Listing_Info_Sum_Order_By>;
  var_pop?: Maybe<Computed_Listing_Info_Var_Pop_Order_By>;
  var_samp?: Maybe<Computed_Listing_Info_Var_Samp_Order_By>;
  variance?: Maybe<Computed_Listing_Info_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Computed_Listing_Info_Append_Input = {
  all_course_codes?: Maybe<Scalars['jsonb']>;
  areas?: Maybe<Scalars['jsonb']>;
  flag_info?: Maybe<Scalars['jsonb']>;
  professor_info?: Maybe<Scalars['jsonb']>;
  professor_names?: Maybe<Scalars['jsonb']>;
  skills?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "computed_listing_info" */
export type Computed_Listing_Info_Arr_Rel_Insert_Input = {
  data: Array<Computed_Listing_Info_Insert_Input>;
  on_conflict?: Maybe<Computed_Listing_Info_On_Conflict>;
};

/** aggregate avg on columns */
export type Computed_Listing_Info_Avg_Fields = {
  __typename?: 'computed_listing_info_avg_fields';
  average_gut_rating?: Maybe<Scalars['Float']>;
  average_professor?: Maybe<Scalars['Float']>;
  average_rating?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Avg_Order_By = {
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "computed_listing_info". All fields are combined with a logical 'AND'. */
export type Computed_Listing_Info_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Computed_Listing_Info_Bool_Exp>>>;
  _not?: Maybe<Computed_Listing_Info_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Computed_Listing_Info_Bool_Exp>>>;
  all_course_codes?: Maybe<Jsonb_Comparison_Exp>;
  areas?: Maybe<Jsonb_Comparison_Exp>;
  average_gut_rating?: Maybe<Float8_Comparison_Exp>;
  average_professor?: Maybe<Float8_Comparison_Exp>;
  average_rating?: Maybe<Float8_Comparison_Exp>;
  average_workload?: Maybe<Float8_Comparison_Exp>;
  classnotes?: Maybe<String_Comparison_Exp>;
  course?: Maybe<Courses_Bool_Exp>;
  course_code?: Maybe<String_Comparison_Exp>;
  course_id?: Maybe<Int_Comparison_Exp>;
  credits?: Maybe<Float8_Comparison_Exp>;
  crn?: Maybe<Int_Comparison_Exp>;
  declined?: Maybe<Int_Comparison_Exp>;
  description?: Maybe<String_Comparison_Exp>;
  enrolled?: Maybe<Int_Comparison_Exp>;
  enrollment?: Maybe<Int_Comparison_Exp>;
  extra_info?: Maybe<String_Comparison_Exp>;
  final_exam?: Maybe<String_Comparison_Exp>;
  flag_info?: Maybe<Jsonb_Comparison_Exp>;
  fysem?: Maybe<Boolean_Comparison_Exp>;
  last_enrollment?: Maybe<Int_Comparison_Exp>;
  last_enrollment_course_id?: Maybe<Int_Comparison_Exp>;
  last_enrollment_same_professors?: Maybe<Boolean_Comparison_Exp>;
  last_enrollment_season_code?: Maybe<String_Comparison_Exp>;
  last_offered_course_id?: Maybe<Int_Comparison_Exp>;
  listing?: Maybe<Listings_Bool_Exp>;
  listing_id?: Maybe<Int_Comparison_Exp>;
  locations_summary?: Maybe<String_Comparison_Exp>;
  no_response?: Maybe<Int_Comparison_Exp>;
  number?: Maybe<String_Comparison_Exp>;
  professor_info?: Maybe<Jsonb_Comparison_Exp>;
  professor_names?: Maybe<Jsonb_Comparison_Exp>;
  regnotes?: Maybe<String_Comparison_Exp>;
  requirements?: Maybe<String_Comparison_Exp>;
  responses?: Maybe<Int_Comparison_Exp>;
  rp_attr?: Maybe<String_Comparison_Exp>;
  school?: Maybe<String_Comparison_Exp>;
  season_code?: Maybe<String_Comparison_Exp>;
  section?: Maybe<String_Comparison_Exp>;
  skills?: Maybe<Jsonb_Comparison_Exp>;
  subject?: Maybe<String_Comparison_Exp>;
  syllabus_url?: Maybe<String_Comparison_Exp>;
  times_by_day?: Maybe<Json_Comparison_Exp>;
  times_summary?: Maybe<String_Comparison_Exp>;
  title?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "computed_listing_info" */
export enum Computed_Listing_Info_Constraint {
  /** unique or primary key constraint */
  IdxComputedListingListingId = 'idx_computed_listing_listing_id'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Computed_Listing_Info_Delete_At_Path_Input = {
  all_course_codes?: Maybe<Array<Maybe<Scalars['String']>>>;
  areas?: Maybe<Array<Maybe<Scalars['String']>>>;
  flag_info?: Maybe<Array<Maybe<Scalars['String']>>>;
  professor_info?: Maybe<Array<Maybe<Scalars['String']>>>;
  professor_names?: Maybe<Array<Maybe<Scalars['String']>>>;
  skills?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Computed_Listing_Info_Delete_Elem_Input = {
  all_course_codes?: Maybe<Scalars['Int']>;
  areas?: Maybe<Scalars['Int']>;
  flag_info?: Maybe<Scalars['Int']>;
  professor_info?: Maybe<Scalars['Int']>;
  professor_names?: Maybe<Scalars['Int']>;
  skills?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Computed_Listing_Info_Delete_Key_Input = {
  all_course_codes?: Maybe<Scalars['String']>;
  areas?: Maybe<Scalars['String']>;
  flag_info?: Maybe<Scalars['String']>;
  professor_info?: Maybe<Scalars['String']>;
  professor_names?: Maybe<Scalars['String']>;
  skills?: Maybe<Scalars['String']>;
};

/** input type for incrementing integer column in table "computed_listing_info" */
export type Computed_Listing_Info_Inc_Input = {
  average_gut_rating?: Maybe<Scalars['float8']>;
  average_professor?: Maybe<Scalars['float8']>;
  average_rating?: Maybe<Scalars['float8']>;
  average_workload?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  crn?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
  no_response?: Maybe<Scalars['Int']>;
  responses?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "computed_listing_info" */
export type Computed_Listing_Info_Insert_Input = {
  all_course_codes?: Maybe<Scalars['jsonb']>;
  areas?: Maybe<Scalars['jsonb']>;
  average_gut_rating?: Maybe<Scalars['float8']>;
  average_professor?: Maybe<Scalars['float8']>;
  average_rating?: Maybe<Scalars['float8']>;
  average_workload?: Maybe<Scalars['float8']>;
  classnotes?: Maybe<Scalars['String']>;
  course?: Maybe<Courses_Obj_Rel_Insert_Input>;
  course_code?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  crn?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  extra_info?: Maybe<Scalars['String']>;
  final_exam?: Maybe<Scalars['String']>;
  flag_info?: Maybe<Scalars['jsonb']>;
  fysem?: Maybe<Scalars['Boolean']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_enrollment_same_professors?: Maybe<Scalars['Boolean']>;
  last_enrollment_season_code?: Maybe<Scalars['String']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  listing?: Maybe<Listings_Obj_Rel_Insert_Input>;
  listing_id?: Maybe<Scalars['Int']>;
  locations_summary?: Maybe<Scalars['String']>;
  no_response?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  professor_info?: Maybe<Scalars['jsonb']>;
  professor_names?: Maybe<Scalars['jsonb']>;
  regnotes?: Maybe<Scalars['String']>;
  requirements?: Maybe<Scalars['String']>;
  responses?: Maybe<Scalars['Int']>;
  rp_attr?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  skills?: Maybe<Scalars['jsonb']>;
  subject?: Maybe<Scalars['String']>;
  syllabus_url?: Maybe<Scalars['String']>;
  times_by_day?: Maybe<Scalars['json']>;
  times_summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Computed_Listing_Info_Max_Fields = {
  __typename?: 'computed_listing_info_max_fields';
  average_gut_rating?: Maybe<Scalars['float8']>;
  average_professor?: Maybe<Scalars['float8']>;
  average_rating?: Maybe<Scalars['float8']>;
  average_workload?: Maybe<Scalars['float8']>;
  classnotes?: Maybe<Scalars['String']>;
  course_code?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  crn?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  extra_info?: Maybe<Scalars['String']>;
  final_exam?: Maybe<Scalars['String']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_enrollment_season_code?: Maybe<Scalars['String']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
  locations_summary?: Maybe<Scalars['String']>;
  no_response?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  regnotes?: Maybe<Scalars['String']>;
  requirements?: Maybe<Scalars['String']>;
  responses?: Maybe<Scalars['Int']>;
  rp_attr?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  syllabus_url?: Maybe<Scalars['String']>;
  times_summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Max_Order_By = {
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  classnotes?: Maybe<Order_By>;
  course_code?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  description?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  extra_info?: Maybe<Order_By>;
  final_exam?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_enrollment_season_code?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  locations_summary?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  number?: Maybe<Order_By>;
  regnotes?: Maybe<Order_By>;
  requirements?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
  rp_attr?: Maybe<Order_By>;
  school?: Maybe<Order_By>;
  season_code?: Maybe<Order_By>;
  section?: Maybe<Order_By>;
  subject?: Maybe<Order_By>;
  syllabus_url?: Maybe<Order_By>;
  times_summary?: Maybe<Order_By>;
  title?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Computed_Listing_Info_Min_Fields = {
  __typename?: 'computed_listing_info_min_fields';
  average_gut_rating?: Maybe<Scalars['float8']>;
  average_professor?: Maybe<Scalars['float8']>;
  average_rating?: Maybe<Scalars['float8']>;
  average_workload?: Maybe<Scalars['float8']>;
  classnotes?: Maybe<Scalars['String']>;
  course_code?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  crn?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  extra_info?: Maybe<Scalars['String']>;
  final_exam?: Maybe<Scalars['String']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_enrollment_season_code?: Maybe<Scalars['String']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
  locations_summary?: Maybe<Scalars['String']>;
  no_response?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  regnotes?: Maybe<Scalars['String']>;
  requirements?: Maybe<Scalars['String']>;
  responses?: Maybe<Scalars['Int']>;
  rp_attr?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  syllabus_url?: Maybe<Scalars['String']>;
  times_summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Min_Order_By = {
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  classnotes?: Maybe<Order_By>;
  course_code?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  description?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  extra_info?: Maybe<Order_By>;
  final_exam?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_enrollment_season_code?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  locations_summary?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  number?: Maybe<Order_By>;
  regnotes?: Maybe<Order_By>;
  requirements?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
  rp_attr?: Maybe<Order_By>;
  school?: Maybe<Order_By>;
  season_code?: Maybe<Order_By>;
  section?: Maybe<Order_By>;
  subject?: Maybe<Order_By>;
  syllabus_url?: Maybe<Order_By>;
  times_summary?: Maybe<Order_By>;
  title?: Maybe<Order_By>;
};

/** response of any mutation on the table "computed_listing_info" */
export type Computed_Listing_Info_Mutation_Response = {
  __typename?: 'computed_listing_info_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Computed_Listing_Info>;
};

/** input type for inserting object relation for remote table "computed_listing_info" */
export type Computed_Listing_Info_Obj_Rel_Insert_Input = {
  data: Computed_Listing_Info_Insert_Input;
  on_conflict?: Maybe<Computed_Listing_Info_On_Conflict>;
};

/** on conflict condition type for table "computed_listing_info" */
export type Computed_Listing_Info_On_Conflict = {
  constraint: Computed_Listing_Info_Constraint;
  update_columns: Array<Computed_Listing_Info_Update_Column>;
  where?: Maybe<Computed_Listing_Info_Bool_Exp>;
};

/** ordering options when selecting data from "computed_listing_info" */
export type Computed_Listing_Info_Order_By = {
  all_course_codes?: Maybe<Order_By>;
  areas?: Maybe<Order_By>;
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  classnotes?: Maybe<Order_By>;
  course?: Maybe<Courses_Order_By>;
  course_code?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  description?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  extra_info?: Maybe<Order_By>;
  final_exam?: Maybe<Order_By>;
  flag_info?: Maybe<Order_By>;
  fysem?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_enrollment_same_professors?: Maybe<Order_By>;
  last_enrollment_season_code?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing?: Maybe<Listings_Order_By>;
  listing_id?: Maybe<Order_By>;
  locations_summary?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  number?: Maybe<Order_By>;
  professor_info?: Maybe<Order_By>;
  professor_names?: Maybe<Order_By>;
  regnotes?: Maybe<Order_By>;
  requirements?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
  rp_attr?: Maybe<Order_By>;
  school?: Maybe<Order_By>;
  season_code?: Maybe<Order_By>;
  section?: Maybe<Order_By>;
  skills?: Maybe<Order_By>;
  subject?: Maybe<Order_By>;
  syllabus_url?: Maybe<Order_By>;
  times_by_day?: Maybe<Order_By>;
  times_summary?: Maybe<Order_By>;
  title?: Maybe<Order_By>;
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Computed_Listing_Info_Prepend_Input = {
  all_course_codes?: Maybe<Scalars['jsonb']>;
  areas?: Maybe<Scalars['jsonb']>;
  flag_info?: Maybe<Scalars['jsonb']>;
  professor_info?: Maybe<Scalars['jsonb']>;
  professor_names?: Maybe<Scalars['jsonb']>;
  skills?: Maybe<Scalars['jsonb']>;
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
  AverageWorkload = 'average_workload',
  /** column name */
  Classnotes = 'classnotes',
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
  TimesByDay = 'times_by_day',
  /** column name */
  TimesSummary = 'times_summary',
  /** column name */
  Title = 'title'
}

/** input type for updating data in table "computed_listing_info" */
export type Computed_Listing_Info_Set_Input = {
  all_course_codes?: Maybe<Scalars['jsonb']>;
  areas?: Maybe<Scalars['jsonb']>;
  average_gut_rating?: Maybe<Scalars['float8']>;
  average_professor?: Maybe<Scalars['float8']>;
  average_rating?: Maybe<Scalars['float8']>;
  average_workload?: Maybe<Scalars['float8']>;
  classnotes?: Maybe<Scalars['String']>;
  course_code?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  crn?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  extra_info?: Maybe<Scalars['String']>;
  final_exam?: Maybe<Scalars['String']>;
  flag_info?: Maybe<Scalars['jsonb']>;
  fysem?: Maybe<Scalars['Boolean']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_enrollment_same_professors?: Maybe<Scalars['Boolean']>;
  last_enrollment_season_code?: Maybe<Scalars['String']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
  locations_summary?: Maybe<Scalars['String']>;
  no_response?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  professor_info?: Maybe<Scalars['jsonb']>;
  professor_names?: Maybe<Scalars['jsonb']>;
  regnotes?: Maybe<Scalars['String']>;
  requirements?: Maybe<Scalars['String']>;
  responses?: Maybe<Scalars['Int']>;
  rp_attr?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  skills?: Maybe<Scalars['jsonb']>;
  subject?: Maybe<Scalars['String']>;
  syllabus_url?: Maybe<Scalars['String']>;
  times_by_day?: Maybe<Scalars['json']>;
  times_summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Computed_Listing_Info_Stddev_Fields = {
  __typename?: 'computed_listing_info_stddev_fields';
  average_gut_rating?: Maybe<Scalars['Float']>;
  average_professor?: Maybe<Scalars['Float']>;
  average_rating?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Stddev_Order_By = {
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Computed_Listing_Info_Stddev_Pop_Fields = {
  __typename?: 'computed_listing_info_stddev_pop_fields';
  average_gut_rating?: Maybe<Scalars['Float']>;
  average_professor?: Maybe<Scalars['Float']>;
  average_rating?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Stddev_Pop_Order_By = {
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Computed_Listing_Info_Stddev_Samp_Fields = {
  __typename?: 'computed_listing_info_stddev_samp_fields';
  average_gut_rating?: Maybe<Scalars['Float']>;
  average_professor?: Maybe<Scalars['Float']>;
  average_rating?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Stddev_Samp_Order_By = {
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Computed_Listing_Info_Sum_Fields = {
  __typename?: 'computed_listing_info_sum_fields';
  average_gut_rating?: Maybe<Scalars['float8']>;
  average_professor?: Maybe<Scalars['float8']>;
  average_rating?: Maybe<Scalars['float8']>;
  average_workload?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  crn?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
  no_response?: Maybe<Scalars['Int']>;
  responses?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Sum_Order_By = {
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
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
  AverageWorkload = 'average_workload',
  /** column name */
  Classnotes = 'classnotes',
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
  TimesByDay = 'times_by_day',
  /** column name */
  TimesSummary = 'times_summary',
  /** column name */
  Title = 'title'
}

/** aggregate var_pop on columns */
export type Computed_Listing_Info_Var_Pop_Fields = {
  __typename?: 'computed_listing_info_var_pop_fields';
  average_gut_rating?: Maybe<Scalars['Float']>;
  average_professor?: Maybe<Scalars['Float']>;
  average_rating?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Var_Pop_Order_By = {
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Computed_Listing_Info_Var_Samp_Fields = {
  __typename?: 'computed_listing_info_var_samp_fields';
  average_gut_rating?: Maybe<Scalars['Float']>;
  average_professor?: Maybe<Scalars['Float']>;
  average_rating?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Var_Samp_Order_By = {
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Computed_Listing_Info_Variance_Fields = {
  __typename?: 'computed_listing_info_variance_fields';
  average_gut_rating?: Maybe<Scalars['Float']>;
  average_professor?: Maybe<Scalars['Float']>;
  average_rating?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "computed_listing_info" */
export type Computed_Listing_Info_Variance_Order_By = {
  average_gut_rating?: Maybe<Order_By>;
  average_professor?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** columns and relationships of "course_flags" */
export type Course_Flags = {
  __typename?: 'course_flags';
  /** An object relationship */
  course: Courses;
  course_id: Scalars['Int'];
  /** An object relationship */
  flag: Flags;
  flag_id: Scalars['Int'];
};

/** aggregated selection of "course_flags" */
export type Course_Flags_Aggregate = {
  __typename?: 'course_flags_aggregate';
  aggregate?: Maybe<Course_Flags_Aggregate_Fields>;
  nodes: Array<Course_Flags>;
};

/** aggregate fields of "course_flags" */
export type Course_Flags_Aggregate_Fields = {
  __typename?: 'course_flags_aggregate_fields';
  avg?: Maybe<Course_Flags_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Course_Flags_Max_Fields>;
  min?: Maybe<Course_Flags_Min_Fields>;
  stddev?: Maybe<Course_Flags_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Flags_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Flags_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Flags_Sum_Fields>;
  var_pop?: Maybe<Course_Flags_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Flags_Var_Samp_Fields>;
  variance?: Maybe<Course_Flags_Variance_Fields>;
};


/** aggregate fields of "course_flags" */
export type Course_Flags_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Course_Flags_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "course_flags" */
export type Course_Flags_Aggregate_Order_By = {
  avg?: Maybe<Course_Flags_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Course_Flags_Max_Order_By>;
  min?: Maybe<Course_Flags_Min_Order_By>;
  stddev?: Maybe<Course_Flags_Stddev_Order_By>;
  stddev_pop?: Maybe<Course_Flags_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Course_Flags_Stddev_Samp_Order_By>;
  sum?: Maybe<Course_Flags_Sum_Order_By>;
  var_pop?: Maybe<Course_Flags_Var_Pop_Order_By>;
  var_samp?: Maybe<Course_Flags_Var_Samp_Order_By>;
  variance?: Maybe<Course_Flags_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "course_flags" */
export type Course_Flags_Arr_Rel_Insert_Input = {
  data: Array<Course_Flags_Insert_Input>;
  on_conflict?: Maybe<Course_Flags_On_Conflict>;
};

/** aggregate avg on columns */
export type Course_Flags_Avg_Fields = {
  __typename?: 'course_flags_avg_fields';
  course_id?: Maybe<Scalars['Float']>;
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "course_flags" */
export type Course_Flags_Avg_Order_By = {
  course_id?: Maybe<Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_flags". All fields are combined with a logical 'AND'. */
export type Course_Flags_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Course_Flags_Bool_Exp>>>;
  _not?: Maybe<Course_Flags_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Course_Flags_Bool_Exp>>>;
  course?: Maybe<Courses_Bool_Exp>;
  course_id?: Maybe<Int_Comparison_Exp>;
  flag?: Maybe<Flags_Bool_Exp>;
  flag_id?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_flags" */
export enum Course_Flags_Constraint {
  /** unique or primary key constraint */
  PkCourseFlagsStaged = 'pk_course_flags_staged'
}

/** input type for incrementing integer column in table "course_flags" */
export type Course_Flags_Inc_Input = {
  course_id?: Maybe<Scalars['Int']>;
  flag_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "course_flags" */
export type Course_Flags_Insert_Input = {
  course?: Maybe<Courses_Obj_Rel_Insert_Input>;
  course_id?: Maybe<Scalars['Int']>;
  flag?: Maybe<Flags_Obj_Rel_Insert_Input>;
  flag_id?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Course_Flags_Max_Fields = {
  __typename?: 'course_flags_max_fields';
  course_id?: Maybe<Scalars['Int']>;
  flag_id?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "course_flags" */
export type Course_Flags_Max_Order_By = {
  course_id?: Maybe<Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Course_Flags_Min_Fields = {
  __typename?: 'course_flags_min_fields';
  course_id?: Maybe<Scalars['Int']>;
  flag_id?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "course_flags" */
export type Course_Flags_Min_Order_By = {
  course_id?: Maybe<Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "course_flags" */
export type Course_Flags_Mutation_Response = {
  __typename?: 'course_flags_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Course_Flags>;
};

/** input type for inserting object relation for remote table "course_flags" */
export type Course_Flags_Obj_Rel_Insert_Input = {
  data: Course_Flags_Insert_Input;
  on_conflict?: Maybe<Course_Flags_On_Conflict>;
};

/** on conflict condition type for table "course_flags" */
export type Course_Flags_On_Conflict = {
  constraint: Course_Flags_Constraint;
  update_columns: Array<Course_Flags_Update_Column>;
  where?: Maybe<Course_Flags_Bool_Exp>;
};

/** ordering options when selecting data from "course_flags" */
export type Course_Flags_Order_By = {
  course?: Maybe<Courses_Order_By>;
  course_id?: Maybe<Order_By>;
  flag?: Maybe<Flags_Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "course_flags" */
export type Course_Flags_Pk_Columns_Input = {
  course_id: Scalars['Int'];
  flag_id: Scalars['Int'];
};

/** select columns of table "course_flags" */
export enum Course_Flags_Select_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  FlagId = 'flag_id'
}

/** input type for updating data in table "course_flags" */
export type Course_Flags_Set_Input = {
  course_id?: Maybe<Scalars['Int']>;
  flag_id?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Course_Flags_Stddev_Fields = {
  __typename?: 'course_flags_stddev_fields';
  course_id?: Maybe<Scalars['Float']>;
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "course_flags" */
export type Course_Flags_Stddev_Order_By = {
  course_id?: Maybe<Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Course_Flags_Stddev_Pop_Fields = {
  __typename?: 'course_flags_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "course_flags" */
export type Course_Flags_Stddev_Pop_Order_By = {
  course_id?: Maybe<Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Course_Flags_Stddev_Samp_Fields = {
  __typename?: 'course_flags_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "course_flags" */
export type Course_Flags_Stddev_Samp_Order_By = {
  course_id?: Maybe<Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Course_Flags_Sum_Fields = {
  __typename?: 'course_flags_sum_fields';
  course_id?: Maybe<Scalars['Int']>;
  flag_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "course_flags" */
export type Course_Flags_Sum_Order_By = {
  course_id?: Maybe<Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** update columns of table "course_flags" */
export enum Course_Flags_Update_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  FlagId = 'flag_id'
}

/** aggregate var_pop on columns */
export type Course_Flags_Var_Pop_Fields = {
  __typename?: 'course_flags_var_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "course_flags" */
export type Course_Flags_Var_Pop_Order_By = {
  course_id?: Maybe<Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Course_Flags_Var_Samp_Fields = {
  __typename?: 'course_flags_var_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "course_flags" */
export type Course_Flags_Var_Samp_Order_By = {
  course_id?: Maybe<Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Course_Flags_Variance_Fields = {
  __typename?: 'course_flags_variance_fields';
  course_id?: Maybe<Scalars['Float']>;
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "course_flags" */
export type Course_Flags_Variance_Order_By = {
  course_id?: Maybe<Order_By>;
  flag_id?: Maybe<Order_By>;
};

/** columns and relationships of "course_professors" */
export type Course_Professors = {
  __typename?: 'course_professors';
  /** An object relationship */
  course: Courses;
  course_id: Scalars['Int'];
  /** An object relationship */
  professor: Professors;
  professor_id: Scalars['Int'];
};

/** aggregated selection of "course_professors" */
export type Course_Professors_Aggregate = {
  __typename?: 'course_professors_aggregate';
  aggregate?: Maybe<Course_Professors_Aggregate_Fields>;
  nodes: Array<Course_Professors>;
};

/** aggregate fields of "course_professors" */
export type Course_Professors_Aggregate_Fields = {
  __typename?: 'course_professors_aggregate_fields';
  avg?: Maybe<Course_Professors_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Course_Professors_Max_Fields>;
  min?: Maybe<Course_Professors_Min_Fields>;
  stddev?: Maybe<Course_Professors_Stddev_Fields>;
  stddev_pop?: Maybe<Course_Professors_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Course_Professors_Stddev_Samp_Fields>;
  sum?: Maybe<Course_Professors_Sum_Fields>;
  var_pop?: Maybe<Course_Professors_Var_Pop_Fields>;
  var_samp?: Maybe<Course_Professors_Var_Samp_Fields>;
  variance?: Maybe<Course_Professors_Variance_Fields>;
};


/** aggregate fields of "course_professors" */
export type Course_Professors_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Course_Professors_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "course_professors" */
export type Course_Professors_Aggregate_Order_By = {
  avg?: Maybe<Course_Professors_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Course_Professors_Max_Order_By>;
  min?: Maybe<Course_Professors_Min_Order_By>;
  stddev?: Maybe<Course_Professors_Stddev_Order_By>;
  stddev_pop?: Maybe<Course_Professors_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Course_Professors_Stddev_Samp_Order_By>;
  sum?: Maybe<Course_Professors_Sum_Order_By>;
  var_pop?: Maybe<Course_Professors_Var_Pop_Order_By>;
  var_samp?: Maybe<Course_Professors_Var_Samp_Order_By>;
  variance?: Maybe<Course_Professors_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "course_professors" */
export type Course_Professors_Arr_Rel_Insert_Input = {
  data: Array<Course_Professors_Insert_Input>;
  on_conflict?: Maybe<Course_Professors_On_Conflict>;
};

/** aggregate avg on columns */
export type Course_Professors_Avg_Fields = {
  __typename?: 'course_professors_avg_fields';
  course_id?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "course_professors" */
export type Course_Professors_Avg_Order_By = {
  course_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_professors". All fields are combined with a logical 'AND'. */
export type Course_Professors_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Course_Professors_Bool_Exp>>>;
  _not?: Maybe<Course_Professors_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Course_Professors_Bool_Exp>>>;
  course?: Maybe<Courses_Bool_Exp>;
  course_id?: Maybe<Int_Comparison_Exp>;
  professor?: Maybe<Professors_Bool_Exp>;
  professor_id?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "course_professors" */
export enum Course_Professors_Constraint {
  /** unique or primary key constraint */
  PkCourseProfessorsStaged = 'pk_course_professors_staged'
}

/** input type for incrementing integer column in table "course_professors" */
export type Course_Professors_Inc_Input = {
  course_id?: Maybe<Scalars['Int']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "course_professors" */
export type Course_Professors_Insert_Input = {
  course?: Maybe<Courses_Obj_Rel_Insert_Input>;
  course_id?: Maybe<Scalars['Int']>;
  professor?: Maybe<Professors_Obj_Rel_Insert_Input>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Course_Professors_Max_Fields = {
  __typename?: 'course_professors_max_fields';
  course_id?: Maybe<Scalars['Int']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "course_professors" */
export type Course_Professors_Max_Order_By = {
  course_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Course_Professors_Min_Fields = {
  __typename?: 'course_professors_min_fields';
  course_id?: Maybe<Scalars['Int']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "course_professors" */
export type Course_Professors_Min_Order_By = {
  course_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "course_professors" */
export type Course_Professors_Mutation_Response = {
  __typename?: 'course_professors_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Course_Professors>;
};

/** input type for inserting object relation for remote table "course_professors" */
export type Course_Professors_Obj_Rel_Insert_Input = {
  data: Course_Professors_Insert_Input;
  on_conflict?: Maybe<Course_Professors_On_Conflict>;
};

/** on conflict condition type for table "course_professors" */
export type Course_Professors_On_Conflict = {
  constraint: Course_Professors_Constraint;
  update_columns: Array<Course_Professors_Update_Column>;
  where?: Maybe<Course_Professors_Bool_Exp>;
};

/** ordering options when selecting data from "course_professors" */
export type Course_Professors_Order_By = {
  course?: Maybe<Courses_Order_By>;
  course_id?: Maybe<Order_By>;
  professor?: Maybe<Professors_Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "course_professors" */
export type Course_Professors_Pk_Columns_Input = {
  course_id: Scalars['Int'];
  professor_id: Scalars['Int'];
};

/** select columns of table "course_professors" */
export enum Course_Professors_Select_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  ProfessorId = 'professor_id'
}

/** input type for updating data in table "course_professors" */
export type Course_Professors_Set_Input = {
  course_id?: Maybe<Scalars['Int']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Course_Professors_Stddev_Fields = {
  __typename?: 'course_professors_stddev_fields';
  course_id?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "course_professors" */
export type Course_Professors_Stddev_Order_By = {
  course_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Course_Professors_Stddev_Pop_Fields = {
  __typename?: 'course_professors_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "course_professors" */
export type Course_Professors_Stddev_Pop_Order_By = {
  course_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Course_Professors_Stddev_Samp_Fields = {
  __typename?: 'course_professors_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "course_professors" */
export type Course_Professors_Stddev_Samp_Order_By = {
  course_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Course_Professors_Sum_Fields = {
  __typename?: 'course_professors_sum_fields';
  course_id?: Maybe<Scalars['Int']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "course_professors" */
export type Course_Professors_Sum_Order_By = {
  course_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** update columns of table "course_professors" */
export enum Course_Professors_Update_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  ProfessorId = 'professor_id'
}

/** aggregate var_pop on columns */
export type Course_Professors_Var_Pop_Fields = {
  __typename?: 'course_professors_var_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "course_professors" */
export type Course_Professors_Var_Pop_Order_By = {
  course_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Course_Professors_Var_Samp_Fields = {
  __typename?: 'course_professors_var_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "course_professors" */
export type Course_Professors_Var_Samp_Order_By = {
  course_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Course_Professors_Variance_Fields = {
  __typename?: 'course_professors_variance_fields';
  course_id?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "course_professors" */
export type Course_Professors_Variance_Order_By = {
  course_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** columns and relationships of "courses" */
export type Courses = {
  __typename?: 'courses';
  /** Course areas (humanities, social sciences, sciences) */
  areas?: Maybe<Scalars['json']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: Maybe<Scalars['float8']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Int']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: Maybe<Scalars['float8']>;
  /**
   * [[computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: Maybe<Scalars['Int']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: Maybe<Scalars['float8']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: Maybe<Scalars['Int']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: Maybe<Scalars['float8']>;
  /**
   * [[computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: Maybe<Scalars['Int']>;
  /** Additional class notes */
  classnotes?: Maybe<Scalars['String']>;
  /** An array relationship */
  computed_listing_infos: Array<Computed_Listing_Info>;
  /** An aggregated array relationship */
  computed_listing_infos_aggregate: Computed_Listing_Info_Aggregate;
  /** An array relationship */
  course_flags: Array<Course_Flags>;
  /** An aggregated array relationship */
  course_flags_aggregate: Course_Flags_Aggregate;
  /** Link to the course homepage */
  course_home_url?: Maybe<Scalars['String']>;
  course_id: Scalars['Int'];
  /** An array relationship */
  course_professors: Array<Course_Professors>;
  /** An aggregated array relationship */
  course_professors_aggregate: Course_Professors_Aggregate;
  /** Number of course credits */
  credits?: Maybe<Scalars['float8']>;
  /** An array relationship */
  demand_statistics: Array<Demand_Statistics>;
  /** An aggregated array relationship */
  demand_statistics_aggregate: Demand_Statistics_Aggregate;
  /** Course description */
  description?: Maybe<Scalars['String']>;
  /** An array relationship */
  evaluation_narratives: Array<Evaluation_Narratives>;
  /** An aggregated array relationship */
  evaluation_narratives_aggregate: Evaluation_Narratives_Aggregate;
  /** An array relationship */
  evaluation_ratings: Array<Evaluation_Ratings>;
  /** An aggregated array relationship */
  evaluation_ratings_aggregate: Evaluation_Ratings_Aggregate;
  /** An array relationship */
  evaluation_statistics: Array<Evaluation_Statistics>;
  /** An aggregated array relationship */
  evaluation_statistics_aggregate: Evaluation_Statistics_Aggregate;
  /** Additional information (indicates if class has been cancelled) */
  extra_info?: Maybe<Scalars['String']>;
  /** Final exam information */
  final_exam?: Maybe<Scalars['String']>;
  /** True if the course is a first-year seminar. False otherwise. */
  fysem?: Maybe<Scalars['Boolean']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: Maybe<Scalars['Int']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  /**
   * [computed] Whether last enrollment offering
   *         is with same professor as current.
   */
  last_enrollment_same_professors?: Maybe<Scalars['Boolean']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code?: Maybe<Scalars['String']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: Maybe<Scalars['Int']>;
  /** An array relationship */
  listings: Array<Listings>;
  /** An aggregated array relationship */
  listings_aggregate: Listings_Aggregate;
  /** Key-value pairs consisting of `<location>:<list of times>` */
  location_times?: Maybe<Scalars['String']>;
  /**
   * If single location, is `<location>`; otherwise is
   *         `<location> + <n_other_locations>` where the first location is the one
   *         with the greatest number of days. Displayed in the "Locations" column
   *         in CourseTable.
   */
  locations_summary?: Maybe<Scalars['String']>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes?: Maybe<Scalars['String']>;
  /** Recommended requirements/prerequisites for the course */
  requirements?: Maybe<Scalars['String']>;
  /** Reading period notes */
  rp_attr?: Maybe<Scalars['String']>;
  /** School (e.g. YC, GS, MG) that the course is taught in */
  school?: Maybe<Scalars['String']>;
  /** An object relationship */
  season: Seasons;
  /** The season the course is being taught in */
  season_code: Scalars['String'];
  /**
   * Shortened course title (first 29 characters + "...")
   *         if the length exceeds 32, otherwise just the title itself
   */
  short_title?: Maybe<Scalars['String']>;
  /**
   * Skills that the course fulfills (e.g. writing,
   *         quantitative reasoning, language levels)
   */
  skills?: Maybe<Scalars['json']>;
  /** Link to the syllabus */
  syllabus_url?: Maybe<Scalars['String']>;
  /**
   * Course meeting times by day, with days as keys and
   *         tuples of `(start_time, end_time, location)`
   */
  times_by_day?: Maybe<Scalars['json']>;
  /**
   * Course times and locations, displayed in the "Meets"
   *          row in CourseTable course modals
   */
  times_long_summary?: Maybe<Scalars['String']>;
  /** Course times, displayed in the "Times" column in CourseTable */
  times_summary?: Maybe<Scalars['String']>;
  /** Complete course title */
  title?: Maybe<Scalars['String']>;
};


/** columns and relationships of "courses" */
export type CoursesAreasArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "courses" */
export type CoursesComputed_Listing_InfosArgs = {
  distinct_on?: Maybe<Array<Computed_Listing_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Computed_Listing_Info_Order_By>>;
  where?: Maybe<Computed_Listing_Info_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesComputed_Listing_Infos_AggregateArgs = {
  distinct_on?: Maybe<Array<Computed_Listing_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Computed_Listing_Info_Order_By>>;
  where?: Maybe<Computed_Listing_Info_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesCourse_FlagsArgs = {
  distinct_on?: Maybe<Array<Course_Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Flags_Order_By>>;
  where?: Maybe<Course_Flags_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesCourse_Flags_AggregateArgs = {
  distinct_on?: Maybe<Array<Course_Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Flags_Order_By>>;
  where?: Maybe<Course_Flags_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesCourse_ProfessorsArgs = {
  distinct_on?: Maybe<Array<Course_Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Professors_Order_By>>;
  where?: Maybe<Course_Professors_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesCourse_Professors_AggregateArgs = {
  distinct_on?: Maybe<Array<Course_Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Professors_Order_By>>;
  where?: Maybe<Course_Professors_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesDemand_StatisticsArgs = {
  distinct_on?: Maybe<Array<Demand_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Demand_Statistics_Order_By>>;
  where?: Maybe<Demand_Statistics_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesDemand_Statistics_AggregateArgs = {
  distinct_on?: Maybe<Array<Demand_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Demand_Statistics_Order_By>>;
  where?: Maybe<Demand_Statistics_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesEvaluation_NarrativesArgs = {
  distinct_on?: Maybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Narratives_Order_By>>;
  where?: Maybe<Evaluation_Narratives_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesEvaluation_Narratives_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Narratives_Order_By>>;
  where?: Maybe<Evaluation_Narratives_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesEvaluation_RatingsArgs = {
  distinct_on?: Maybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Ratings_Order_By>>;
  where?: Maybe<Evaluation_Ratings_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesEvaluation_Ratings_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Ratings_Order_By>>;
  where?: Maybe<Evaluation_Ratings_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesEvaluation_StatisticsArgs = {
  distinct_on?: Maybe<Array<Evaluation_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Statistics_Order_By>>;
  where?: Maybe<Evaluation_Statistics_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesEvaluation_Statistics_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Statistics_Order_By>>;
  where?: Maybe<Evaluation_Statistics_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesListingsArgs = {
  distinct_on?: Maybe<Array<Listings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Listings_Order_By>>;
  where?: Maybe<Listings_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesListings_AggregateArgs = {
  distinct_on?: Maybe<Array<Listings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Listings_Order_By>>;
  where?: Maybe<Listings_Bool_Exp>;
};


/** columns and relationships of "courses" */
export type CoursesSkillsArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "courses" */
export type CoursesTimes_By_DayArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "courses" */
export type Courses_Aggregate = {
  __typename?: 'courses_aggregate';
  aggregate?: Maybe<Courses_Aggregate_Fields>;
  nodes: Array<Courses>;
};

/** aggregate fields of "courses" */
export type Courses_Aggregate_Fields = {
  __typename?: 'courses_aggregate_fields';
  avg?: Maybe<Courses_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Courses_Max_Fields>;
  min?: Maybe<Courses_Min_Fields>;
  stddev?: Maybe<Courses_Stddev_Fields>;
  stddev_pop?: Maybe<Courses_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Courses_Stddev_Samp_Fields>;
  sum?: Maybe<Courses_Sum_Fields>;
  var_pop?: Maybe<Courses_Var_Pop_Fields>;
  var_samp?: Maybe<Courses_Var_Samp_Fields>;
  variance?: Maybe<Courses_Variance_Fields>;
};


/** aggregate fields of "courses" */
export type Courses_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Courses_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "courses" */
export type Courses_Aggregate_Order_By = {
  avg?: Maybe<Courses_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Courses_Max_Order_By>;
  min?: Maybe<Courses_Min_Order_By>;
  stddev?: Maybe<Courses_Stddev_Order_By>;
  stddev_pop?: Maybe<Courses_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Courses_Stddev_Samp_Order_By>;
  sum?: Maybe<Courses_Sum_Order_By>;
  var_pop?: Maybe<Courses_Var_Pop_Order_By>;
  var_samp?: Maybe<Courses_Var_Samp_Order_By>;
  variance?: Maybe<Courses_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "courses" */
export type Courses_Arr_Rel_Insert_Input = {
  data: Array<Courses_Insert_Input>;
  on_conflict?: Maybe<Courses_On_Conflict>;
};

/** aggregate avg on columns */
export type Courses_Avg_Fields = {
  __typename?: 'courses_avg_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  average_rating_same_professors?: Maybe<Scalars['Float']>;
  average_rating_same_professors_n?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  average_workload_n?: Maybe<Scalars['Float']>;
  average_workload_same_professors?: Maybe<Scalars['Float']>;
  average_workload_same_professors_n?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "courses" */
export type Courses_Avg_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "courses". All fields are combined with a logical 'AND'. */
export type Courses_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Courses_Bool_Exp>>>;
  _not?: Maybe<Courses_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Courses_Bool_Exp>>>;
  areas?: Maybe<Json_Comparison_Exp>;
  average_rating?: Maybe<Float8_Comparison_Exp>;
  average_rating_n?: Maybe<Int_Comparison_Exp>;
  average_rating_same_professors?: Maybe<Float8_Comparison_Exp>;
  average_rating_same_professors_n?: Maybe<Int_Comparison_Exp>;
  average_workload?: Maybe<Float8_Comparison_Exp>;
  average_workload_n?: Maybe<Int_Comparison_Exp>;
  average_workload_same_professors?: Maybe<Float8_Comparison_Exp>;
  average_workload_same_professors_n?: Maybe<Int_Comparison_Exp>;
  classnotes?: Maybe<String_Comparison_Exp>;
  computed_listing_infos?: Maybe<Computed_Listing_Info_Bool_Exp>;
  course_flags?: Maybe<Course_Flags_Bool_Exp>;
  course_home_url?: Maybe<String_Comparison_Exp>;
  course_id?: Maybe<Int_Comparison_Exp>;
  course_professors?: Maybe<Course_Professors_Bool_Exp>;
  credits?: Maybe<Float8_Comparison_Exp>;
  demand_statistics?: Maybe<Demand_Statistics_Bool_Exp>;
  description?: Maybe<String_Comparison_Exp>;
  evaluation_narratives?: Maybe<Evaluation_Narratives_Bool_Exp>;
  evaluation_ratings?: Maybe<Evaluation_Ratings_Bool_Exp>;
  evaluation_statistics?: Maybe<Evaluation_Statistics_Bool_Exp>;
  extra_info?: Maybe<String_Comparison_Exp>;
  final_exam?: Maybe<String_Comparison_Exp>;
  fysem?: Maybe<Boolean_Comparison_Exp>;
  last_enrollment?: Maybe<Int_Comparison_Exp>;
  last_enrollment_course_id?: Maybe<Int_Comparison_Exp>;
  last_enrollment_same_professors?: Maybe<Boolean_Comparison_Exp>;
  last_enrollment_season_code?: Maybe<String_Comparison_Exp>;
  last_offered_course_id?: Maybe<Int_Comparison_Exp>;
  listings?: Maybe<Listings_Bool_Exp>;
  location_times?: Maybe<String_Comparison_Exp>;
  locations_summary?: Maybe<String_Comparison_Exp>;
  regnotes?: Maybe<String_Comparison_Exp>;
  requirements?: Maybe<String_Comparison_Exp>;
  rp_attr?: Maybe<String_Comparison_Exp>;
  school?: Maybe<String_Comparison_Exp>;
  season?: Maybe<Seasons_Bool_Exp>;
  season_code?: Maybe<String_Comparison_Exp>;
  short_title?: Maybe<String_Comparison_Exp>;
  skills?: Maybe<Json_Comparison_Exp>;
  syllabus_url?: Maybe<String_Comparison_Exp>;
  times_by_day?: Maybe<Json_Comparison_Exp>;
  times_long_summary?: Maybe<String_Comparison_Exp>;
  times_summary?: Maybe<String_Comparison_Exp>;
  title?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "courses" */
export enum Courses_Constraint {
  /** unique or primary key constraint */
  PkCoursesStaged = 'pk_courses_staged'
}

/** input type for incrementing integer column in table "courses" */
export type Courses_Inc_Input = {
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  average_rating_same_professors?: Maybe<Scalars['float8']>;
  average_rating_same_professors_n?: Maybe<Scalars['Int']>;
  average_workload?: Maybe<Scalars['float8']>;
  average_workload_n?: Maybe<Scalars['Int']>;
  average_workload_same_professors?: Maybe<Scalars['float8']>;
  average_workload_same_professors_n?: Maybe<Scalars['Int']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "courses" */
export type Courses_Insert_Input = {
  areas?: Maybe<Scalars['json']>;
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  average_rating_same_professors?: Maybe<Scalars['float8']>;
  average_rating_same_professors_n?: Maybe<Scalars['Int']>;
  average_workload?: Maybe<Scalars['float8']>;
  average_workload_n?: Maybe<Scalars['Int']>;
  average_workload_same_professors?: Maybe<Scalars['float8']>;
  average_workload_same_professors_n?: Maybe<Scalars['Int']>;
  classnotes?: Maybe<Scalars['String']>;
  computed_listing_infos?: Maybe<Computed_Listing_Info_Arr_Rel_Insert_Input>;
  course_flags?: Maybe<Course_Flags_Arr_Rel_Insert_Input>;
  course_home_url?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  course_professors?: Maybe<Course_Professors_Arr_Rel_Insert_Input>;
  credits?: Maybe<Scalars['float8']>;
  demand_statistics?: Maybe<Demand_Statistics_Arr_Rel_Insert_Input>;
  description?: Maybe<Scalars['String']>;
  evaluation_narratives?: Maybe<Evaluation_Narratives_Arr_Rel_Insert_Input>;
  evaluation_ratings?: Maybe<Evaluation_Ratings_Arr_Rel_Insert_Input>;
  evaluation_statistics?: Maybe<Evaluation_Statistics_Arr_Rel_Insert_Input>;
  extra_info?: Maybe<Scalars['String']>;
  final_exam?: Maybe<Scalars['String']>;
  fysem?: Maybe<Scalars['Boolean']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_enrollment_same_professors?: Maybe<Scalars['Boolean']>;
  last_enrollment_season_code?: Maybe<Scalars['String']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  listings?: Maybe<Listings_Arr_Rel_Insert_Input>;
  location_times?: Maybe<Scalars['String']>;
  locations_summary?: Maybe<Scalars['String']>;
  regnotes?: Maybe<Scalars['String']>;
  requirements?: Maybe<Scalars['String']>;
  rp_attr?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['String']>;
  season?: Maybe<Seasons_Obj_Rel_Insert_Input>;
  season_code?: Maybe<Scalars['String']>;
  short_title?: Maybe<Scalars['String']>;
  skills?: Maybe<Scalars['json']>;
  syllabus_url?: Maybe<Scalars['String']>;
  times_by_day?: Maybe<Scalars['json']>;
  times_long_summary?: Maybe<Scalars['String']>;
  times_summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Courses_Max_Fields = {
  __typename?: 'courses_max_fields';
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  average_rating_same_professors?: Maybe<Scalars['float8']>;
  average_rating_same_professors_n?: Maybe<Scalars['Int']>;
  average_workload?: Maybe<Scalars['float8']>;
  average_workload_n?: Maybe<Scalars['Int']>;
  average_workload_same_professors?: Maybe<Scalars['float8']>;
  average_workload_same_professors_n?: Maybe<Scalars['Int']>;
  classnotes?: Maybe<Scalars['String']>;
  course_home_url?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  description?: Maybe<Scalars['String']>;
  extra_info?: Maybe<Scalars['String']>;
  final_exam?: Maybe<Scalars['String']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_enrollment_season_code?: Maybe<Scalars['String']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  location_times?: Maybe<Scalars['String']>;
  locations_summary?: Maybe<Scalars['String']>;
  regnotes?: Maybe<Scalars['String']>;
  requirements?: Maybe<Scalars['String']>;
  rp_attr?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  short_title?: Maybe<Scalars['String']>;
  syllabus_url?: Maybe<Scalars['String']>;
  times_long_summary?: Maybe<Scalars['String']>;
  times_summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "courses" */
export type Courses_Max_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  classnotes?: Maybe<Order_By>;
  course_home_url?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  description?: Maybe<Order_By>;
  extra_info?: Maybe<Order_By>;
  final_exam?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_enrollment_season_code?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  location_times?: Maybe<Order_By>;
  locations_summary?: Maybe<Order_By>;
  regnotes?: Maybe<Order_By>;
  requirements?: Maybe<Order_By>;
  rp_attr?: Maybe<Order_By>;
  school?: Maybe<Order_By>;
  season_code?: Maybe<Order_By>;
  short_title?: Maybe<Order_By>;
  syllabus_url?: Maybe<Order_By>;
  times_long_summary?: Maybe<Order_By>;
  times_summary?: Maybe<Order_By>;
  title?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Courses_Min_Fields = {
  __typename?: 'courses_min_fields';
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  average_rating_same_professors?: Maybe<Scalars['float8']>;
  average_rating_same_professors_n?: Maybe<Scalars['Int']>;
  average_workload?: Maybe<Scalars['float8']>;
  average_workload_n?: Maybe<Scalars['Int']>;
  average_workload_same_professors?: Maybe<Scalars['float8']>;
  average_workload_same_professors_n?: Maybe<Scalars['Int']>;
  classnotes?: Maybe<Scalars['String']>;
  course_home_url?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  description?: Maybe<Scalars['String']>;
  extra_info?: Maybe<Scalars['String']>;
  final_exam?: Maybe<Scalars['String']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_enrollment_season_code?: Maybe<Scalars['String']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  location_times?: Maybe<Scalars['String']>;
  locations_summary?: Maybe<Scalars['String']>;
  regnotes?: Maybe<Scalars['String']>;
  requirements?: Maybe<Scalars['String']>;
  rp_attr?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  short_title?: Maybe<Scalars['String']>;
  syllabus_url?: Maybe<Scalars['String']>;
  times_long_summary?: Maybe<Scalars['String']>;
  times_summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "courses" */
export type Courses_Min_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  classnotes?: Maybe<Order_By>;
  course_home_url?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  description?: Maybe<Order_By>;
  extra_info?: Maybe<Order_By>;
  final_exam?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_enrollment_season_code?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  location_times?: Maybe<Order_By>;
  locations_summary?: Maybe<Order_By>;
  regnotes?: Maybe<Order_By>;
  requirements?: Maybe<Order_By>;
  rp_attr?: Maybe<Order_By>;
  school?: Maybe<Order_By>;
  season_code?: Maybe<Order_By>;
  short_title?: Maybe<Order_By>;
  syllabus_url?: Maybe<Order_By>;
  times_long_summary?: Maybe<Order_By>;
  times_summary?: Maybe<Order_By>;
  title?: Maybe<Order_By>;
};

/** response of any mutation on the table "courses" */
export type Courses_Mutation_Response = {
  __typename?: 'courses_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Courses>;
};

/** input type for inserting object relation for remote table "courses" */
export type Courses_Obj_Rel_Insert_Input = {
  data: Courses_Insert_Input;
  on_conflict?: Maybe<Courses_On_Conflict>;
};

/** on conflict condition type for table "courses" */
export type Courses_On_Conflict = {
  constraint: Courses_Constraint;
  update_columns: Array<Courses_Update_Column>;
  where?: Maybe<Courses_Bool_Exp>;
};

/** ordering options when selecting data from "courses" */
export type Courses_Order_By = {
  areas?: Maybe<Order_By>;
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  classnotes?: Maybe<Order_By>;
  computed_listing_infos_aggregate?: Maybe<Computed_Listing_Info_Aggregate_Order_By>;
  course_flags_aggregate?: Maybe<Course_Flags_Aggregate_Order_By>;
  course_home_url?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  course_professors_aggregate?: Maybe<Course_Professors_Aggregate_Order_By>;
  credits?: Maybe<Order_By>;
  demand_statistics_aggregate?: Maybe<Demand_Statistics_Aggregate_Order_By>;
  description?: Maybe<Order_By>;
  evaluation_narratives_aggregate?: Maybe<Evaluation_Narratives_Aggregate_Order_By>;
  evaluation_ratings_aggregate?: Maybe<Evaluation_Ratings_Aggregate_Order_By>;
  evaluation_statistics_aggregate?: Maybe<Evaluation_Statistics_Aggregate_Order_By>;
  extra_info?: Maybe<Order_By>;
  final_exam?: Maybe<Order_By>;
  fysem?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_enrollment_same_professors?: Maybe<Order_By>;
  last_enrollment_season_code?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
  listings_aggregate?: Maybe<Listings_Aggregate_Order_By>;
  location_times?: Maybe<Order_By>;
  locations_summary?: Maybe<Order_By>;
  regnotes?: Maybe<Order_By>;
  requirements?: Maybe<Order_By>;
  rp_attr?: Maybe<Order_By>;
  school?: Maybe<Order_By>;
  season?: Maybe<Seasons_Order_By>;
  season_code?: Maybe<Order_By>;
  short_title?: Maybe<Order_By>;
  skills?: Maybe<Order_By>;
  syllabus_url?: Maybe<Order_By>;
  times_by_day?: Maybe<Order_By>;
  times_long_summary?: Maybe<Order_By>;
  times_summary?: Maybe<Order_By>;
  title?: Maybe<Order_By>;
};

/** primary key columns input for table: "courses" */
export type Courses_Pk_Columns_Input = {
  course_id: Scalars['Int'];
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
  LocationTimes = 'location_times',
  /** column name */
  LocationsSummary = 'locations_summary',
  /** column name */
  Regnotes = 'regnotes',
  /** column name */
  Requirements = 'requirements',
  /** column name */
  RpAttr = 'rp_attr',
  /** column name */
  School = 'school',
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  ShortTitle = 'short_title',
  /** column name */
  Skills = 'skills',
  /** column name */
  SyllabusUrl = 'syllabus_url',
  /** column name */
  TimesByDay = 'times_by_day',
  /** column name */
  TimesLongSummary = 'times_long_summary',
  /** column name */
  TimesSummary = 'times_summary',
  /** column name */
  Title = 'title'
}

/** input type for updating data in table "courses" */
export type Courses_Set_Input = {
  areas?: Maybe<Scalars['json']>;
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  average_rating_same_professors?: Maybe<Scalars['float8']>;
  average_rating_same_professors_n?: Maybe<Scalars['Int']>;
  average_workload?: Maybe<Scalars['float8']>;
  average_workload_n?: Maybe<Scalars['Int']>;
  average_workload_same_professors?: Maybe<Scalars['float8']>;
  average_workload_same_professors_n?: Maybe<Scalars['Int']>;
  classnotes?: Maybe<Scalars['String']>;
  course_home_url?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  description?: Maybe<Scalars['String']>;
  extra_info?: Maybe<Scalars['String']>;
  final_exam?: Maybe<Scalars['String']>;
  fysem?: Maybe<Scalars['Boolean']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_enrollment_same_professors?: Maybe<Scalars['Boolean']>;
  last_enrollment_season_code?: Maybe<Scalars['String']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
  location_times?: Maybe<Scalars['String']>;
  locations_summary?: Maybe<Scalars['String']>;
  regnotes?: Maybe<Scalars['String']>;
  requirements?: Maybe<Scalars['String']>;
  rp_attr?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  short_title?: Maybe<Scalars['String']>;
  skills?: Maybe<Scalars['json']>;
  syllabus_url?: Maybe<Scalars['String']>;
  times_by_day?: Maybe<Scalars['json']>;
  times_long_summary?: Maybe<Scalars['String']>;
  times_summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Courses_Stddev_Fields = {
  __typename?: 'courses_stddev_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  average_rating_same_professors?: Maybe<Scalars['Float']>;
  average_rating_same_professors_n?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  average_workload_n?: Maybe<Scalars['Float']>;
  average_workload_same_professors?: Maybe<Scalars['Float']>;
  average_workload_same_professors_n?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "courses" */
export type Courses_Stddev_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Courses_Stddev_Pop_Fields = {
  __typename?: 'courses_stddev_pop_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  average_rating_same_professors?: Maybe<Scalars['Float']>;
  average_rating_same_professors_n?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  average_workload_n?: Maybe<Scalars['Float']>;
  average_workload_same_professors?: Maybe<Scalars['Float']>;
  average_workload_same_professors_n?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "courses" */
export type Courses_Stddev_Pop_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Courses_Stddev_Samp_Fields = {
  __typename?: 'courses_stddev_samp_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  average_rating_same_professors?: Maybe<Scalars['Float']>;
  average_rating_same_professors_n?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  average_workload_n?: Maybe<Scalars['Float']>;
  average_workload_same_professors?: Maybe<Scalars['Float']>;
  average_workload_same_professors_n?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "courses" */
export type Courses_Stddev_Samp_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Courses_Sum_Fields = {
  __typename?: 'courses_sum_fields';
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  average_rating_same_professors?: Maybe<Scalars['float8']>;
  average_rating_same_professors_n?: Maybe<Scalars['Int']>;
  average_workload?: Maybe<Scalars['float8']>;
  average_workload_n?: Maybe<Scalars['Int']>;
  average_workload_same_professors?: Maybe<Scalars['float8']>;
  average_workload_same_professors_n?: Maybe<Scalars['Int']>;
  course_id?: Maybe<Scalars['Int']>;
  credits?: Maybe<Scalars['float8']>;
  last_enrollment?: Maybe<Scalars['Int']>;
  last_enrollment_course_id?: Maybe<Scalars['Int']>;
  last_offered_course_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "courses" */
export type Courses_Sum_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
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
  LocationTimes = 'location_times',
  /** column name */
  LocationsSummary = 'locations_summary',
  /** column name */
  Regnotes = 'regnotes',
  /** column name */
  Requirements = 'requirements',
  /** column name */
  RpAttr = 'rp_attr',
  /** column name */
  School = 'school',
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  ShortTitle = 'short_title',
  /** column name */
  Skills = 'skills',
  /** column name */
  SyllabusUrl = 'syllabus_url',
  /** column name */
  TimesByDay = 'times_by_day',
  /** column name */
  TimesLongSummary = 'times_long_summary',
  /** column name */
  TimesSummary = 'times_summary',
  /** column name */
  Title = 'title'
}

/** aggregate var_pop on columns */
export type Courses_Var_Pop_Fields = {
  __typename?: 'courses_var_pop_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  average_rating_same_professors?: Maybe<Scalars['Float']>;
  average_rating_same_professors_n?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  average_workload_n?: Maybe<Scalars['Float']>;
  average_workload_same_professors?: Maybe<Scalars['Float']>;
  average_workload_same_professors_n?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "courses" */
export type Courses_Var_Pop_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Courses_Var_Samp_Fields = {
  __typename?: 'courses_var_samp_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  average_rating_same_professors?: Maybe<Scalars['Float']>;
  average_rating_same_professors_n?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  average_workload_n?: Maybe<Scalars['Float']>;
  average_workload_same_professors?: Maybe<Scalars['Float']>;
  average_workload_same_professors_n?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "courses" */
export type Courses_Var_Samp_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Courses_Variance_Fields = {
  __typename?: 'courses_variance_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  average_rating_same_professors?: Maybe<Scalars['Float']>;
  average_rating_same_professors_n?: Maybe<Scalars['Float']>;
  average_workload?: Maybe<Scalars['Float']>;
  average_workload_n?: Maybe<Scalars['Float']>;
  average_workload_same_professors?: Maybe<Scalars['Float']>;
  average_workload_same_professors_n?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  credits?: Maybe<Scalars['Float']>;
  last_enrollment?: Maybe<Scalars['Float']>;
  last_enrollment_course_id?: Maybe<Scalars['Float']>;
  last_offered_course_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "courses" */
export type Courses_Variance_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  average_rating_same_professors?: Maybe<Order_By>;
  average_rating_same_professors_n?: Maybe<Order_By>;
  average_workload?: Maybe<Order_By>;
  average_workload_n?: Maybe<Order_By>;
  average_workload_same_professors?: Maybe<Order_By>;
  average_workload_same_professors_n?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  credits?: Maybe<Order_By>;
  last_enrollment?: Maybe<Order_By>;
  last_enrollment_course_id?: Maybe<Order_By>;
  last_offered_course_id?: Maybe<Order_By>;
};

/** columns and relationships of "demand_statistics" */
export type Demand_Statistics = {
  __typename?: 'demand_statistics';
  /** An object relationship */
  course: Courses;
  /** The course to which these demand statistics apply */
  course_id: Scalars['Int'];
  /** JSON dict containing demand stats by day */
  demand?: Maybe<Scalars['json']>;
  /** Latest demand count */
  latest_demand?: Maybe<Scalars['Int']>;
  /** Latest demand date */
  latest_demand_date?: Maybe<Scalars['String']>;
};


/** columns and relationships of "demand_statistics" */
export type Demand_StatisticsDemandArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "demand_statistics" */
export type Demand_Statistics_Aggregate = {
  __typename?: 'demand_statistics_aggregate';
  aggregate?: Maybe<Demand_Statistics_Aggregate_Fields>;
  nodes: Array<Demand_Statistics>;
};

/** aggregate fields of "demand_statistics" */
export type Demand_Statistics_Aggregate_Fields = {
  __typename?: 'demand_statistics_aggregate_fields';
  avg?: Maybe<Demand_Statistics_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Demand_Statistics_Max_Fields>;
  min?: Maybe<Demand_Statistics_Min_Fields>;
  stddev?: Maybe<Demand_Statistics_Stddev_Fields>;
  stddev_pop?: Maybe<Demand_Statistics_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Demand_Statistics_Stddev_Samp_Fields>;
  sum?: Maybe<Demand_Statistics_Sum_Fields>;
  var_pop?: Maybe<Demand_Statistics_Var_Pop_Fields>;
  var_samp?: Maybe<Demand_Statistics_Var_Samp_Fields>;
  variance?: Maybe<Demand_Statistics_Variance_Fields>;
};


/** aggregate fields of "demand_statistics" */
export type Demand_Statistics_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Demand_Statistics_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "demand_statistics" */
export type Demand_Statistics_Aggregate_Order_By = {
  avg?: Maybe<Demand_Statistics_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Demand_Statistics_Max_Order_By>;
  min?: Maybe<Demand_Statistics_Min_Order_By>;
  stddev?: Maybe<Demand_Statistics_Stddev_Order_By>;
  stddev_pop?: Maybe<Demand_Statistics_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Demand_Statistics_Stddev_Samp_Order_By>;
  sum?: Maybe<Demand_Statistics_Sum_Order_By>;
  var_pop?: Maybe<Demand_Statistics_Var_Pop_Order_By>;
  var_samp?: Maybe<Demand_Statistics_Var_Samp_Order_By>;
  variance?: Maybe<Demand_Statistics_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "demand_statistics" */
export type Demand_Statistics_Arr_Rel_Insert_Input = {
  data: Array<Demand_Statistics_Insert_Input>;
  on_conflict?: Maybe<Demand_Statistics_On_Conflict>;
};

/** aggregate avg on columns */
export type Demand_Statistics_Avg_Fields = {
  __typename?: 'demand_statistics_avg_fields';
  course_id?: Maybe<Scalars['Float']>;
  latest_demand?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "demand_statistics" */
export type Demand_Statistics_Avg_Order_By = {
  course_id?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "demand_statistics". All fields are combined with a logical 'AND'. */
export type Demand_Statistics_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Demand_Statistics_Bool_Exp>>>;
  _not?: Maybe<Demand_Statistics_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Demand_Statistics_Bool_Exp>>>;
  course?: Maybe<Courses_Bool_Exp>;
  course_id?: Maybe<Int_Comparison_Exp>;
  demand?: Maybe<Json_Comparison_Exp>;
  latest_demand?: Maybe<Int_Comparison_Exp>;
  latest_demand_date?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "demand_statistics" */
export enum Demand_Statistics_Constraint {
  /** unique or primary key constraint */
  PkDemandStatisticsStaged = 'pk_demand_statistics_staged'
}

/** input type for incrementing integer column in table "demand_statistics" */
export type Demand_Statistics_Inc_Input = {
  course_id?: Maybe<Scalars['Int']>;
  latest_demand?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "demand_statistics" */
export type Demand_Statistics_Insert_Input = {
  course?: Maybe<Courses_Obj_Rel_Insert_Input>;
  course_id?: Maybe<Scalars['Int']>;
  demand?: Maybe<Scalars['json']>;
  latest_demand?: Maybe<Scalars['Int']>;
  latest_demand_date?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Demand_Statistics_Max_Fields = {
  __typename?: 'demand_statistics_max_fields';
  course_id?: Maybe<Scalars['Int']>;
  latest_demand?: Maybe<Scalars['Int']>;
  latest_demand_date?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "demand_statistics" */
export type Demand_Statistics_Max_Order_By = {
  course_id?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
  latest_demand_date?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Demand_Statistics_Min_Fields = {
  __typename?: 'demand_statistics_min_fields';
  course_id?: Maybe<Scalars['Int']>;
  latest_demand?: Maybe<Scalars['Int']>;
  latest_demand_date?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "demand_statistics" */
export type Demand_Statistics_Min_Order_By = {
  course_id?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
  latest_demand_date?: Maybe<Order_By>;
};

/** response of any mutation on the table "demand_statistics" */
export type Demand_Statistics_Mutation_Response = {
  __typename?: 'demand_statistics_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Demand_Statistics>;
};

/** input type for inserting object relation for remote table "demand_statistics" */
export type Demand_Statistics_Obj_Rel_Insert_Input = {
  data: Demand_Statistics_Insert_Input;
  on_conflict?: Maybe<Demand_Statistics_On_Conflict>;
};

/** on conflict condition type for table "demand_statistics" */
export type Demand_Statistics_On_Conflict = {
  constraint: Demand_Statistics_Constraint;
  update_columns: Array<Demand_Statistics_Update_Column>;
  where?: Maybe<Demand_Statistics_Bool_Exp>;
};

/** ordering options when selecting data from "demand_statistics" */
export type Demand_Statistics_Order_By = {
  course?: Maybe<Courses_Order_By>;
  course_id?: Maybe<Order_By>;
  demand?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
  latest_demand_date?: Maybe<Order_By>;
};

/** primary key columns input for table: "demand_statistics" */
export type Demand_Statistics_Pk_Columns_Input = {
  /** The course to which these demand statistics apply */
  course_id: Scalars['Int'];
};

/** select columns of table "demand_statistics" */
export enum Demand_Statistics_Select_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Demand = 'demand',
  /** column name */
  LatestDemand = 'latest_demand',
  /** column name */
  LatestDemandDate = 'latest_demand_date'
}

/** input type for updating data in table "demand_statistics" */
export type Demand_Statistics_Set_Input = {
  course_id?: Maybe<Scalars['Int']>;
  demand?: Maybe<Scalars['json']>;
  latest_demand?: Maybe<Scalars['Int']>;
  latest_demand_date?: Maybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Demand_Statistics_Stddev_Fields = {
  __typename?: 'demand_statistics_stddev_fields';
  course_id?: Maybe<Scalars['Float']>;
  latest_demand?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "demand_statistics" */
export type Demand_Statistics_Stddev_Order_By = {
  course_id?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Demand_Statistics_Stddev_Pop_Fields = {
  __typename?: 'demand_statistics_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  latest_demand?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "demand_statistics" */
export type Demand_Statistics_Stddev_Pop_Order_By = {
  course_id?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Demand_Statistics_Stddev_Samp_Fields = {
  __typename?: 'demand_statistics_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  latest_demand?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "demand_statistics" */
export type Demand_Statistics_Stddev_Samp_Order_By = {
  course_id?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Demand_Statistics_Sum_Fields = {
  __typename?: 'demand_statistics_sum_fields';
  course_id?: Maybe<Scalars['Int']>;
  latest_demand?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "demand_statistics" */
export type Demand_Statistics_Sum_Order_By = {
  course_id?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
};

/** update columns of table "demand_statistics" */
export enum Demand_Statistics_Update_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  Demand = 'demand',
  /** column name */
  LatestDemand = 'latest_demand',
  /** column name */
  LatestDemandDate = 'latest_demand_date'
}

/** aggregate var_pop on columns */
export type Demand_Statistics_Var_Pop_Fields = {
  __typename?: 'demand_statistics_var_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  latest_demand?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "demand_statistics" */
export type Demand_Statistics_Var_Pop_Order_By = {
  course_id?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Demand_Statistics_Var_Samp_Fields = {
  __typename?: 'demand_statistics_var_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  latest_demand?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "demand_statistics" */
export type Demand_Statistics_Var_Samp_Order_By = {
  course_id?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Demand_Statistics_Variance_Fields = {
  __typename?: 'demand_statistics_variance_fields';
  course_id?: Maybe<Scalars['Float']>;
  latest_demand?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "demand_statistics" */
export type Demand_Statistics_Variance_Order_By = {
  course_id?: Maybe<Order_By>;
  latest_demand?: Maybe<Order_By>;
};

/** columns and relationships of "evaluation_narratives" */
export type Evaluation_Narratives = {
  __typename?: 'evaluation_narratives';
  /** Response to the question */
  comment?: Maybe<Scalars['String']>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['float8']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['float8']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['float8']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['float8']>;
  /** An object relationship */
  course: Courses;
  /** The course to which this narrative comment applies */
  course_id: Scalars['Int'];
  /** An object relationship */
  evaluation_question: Evaluation_Questions;
  id: Scalars['Int'];
  /** Question to which this narrative comment responds */
  question_code: Scalars['String'];
};

/** aggregated selection of "evaluation_narratives" */
export type Evaluation_Narratives_Aggregate = {
  __typename?: 'evaluation_narratives_aggregate';
  aggregate?: Maybe<Evaluation_Narratives_Aggregate_Fields>;
  nodes: Array<Evaluation_Narratives>;
};

/** aggregate fields of "evaluation_narratives" */
export type Evaluation_Narratives_Aggregate_Fields = {
  __typename?: 'evaluation_narratives_aggregate_fields';
  avg?: Maybe<Evaluation_Narratives_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Evaluation_Narratives_Max_Fields>;
  min?: Maybe<Evaluation_Narratives_Min_Fields>;
  stddev?: Maybe<Evaluation_Narratives_Stddev_Fields>;
  stddev_pop?: Maybe<Evaluation_Narratives_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Evaluation_Narratives_Stddev_Samp_Fields>;
  sum?: Maybe<Evaluation_Narratives_Sum_Fields>;
  var_pop?: Maybe<Evaluation_Narratives_Var_Pop_Fields>;
  var_samp?: Maybe<Evaluation_Narratives_Var_Samp_Fields>;
  variance?: Maybe<Evaluation_Narratives_Variance_Fields>;
};


/** aggregate fields of "evaluation_narratives" */
export type Evaluation_Narratives_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Evaluation_Narratives_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "evaluation_narratives" */
export type Evaluation_Narratives_Aggregate_Order_By = {
  avg?: Maybe<Evaluation_Narratives_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Evaluation_Narratives_Max_Order_By>;
  min?: Maybe<Evaluation_Narratives_Min_Order_By>;
  stddev?: Maybe<Evaluation_Narratives_Stddev_Order_By>;
  stddev_pop?: Maybe<Evaluation_Narratives_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Evaluation_Narratives_Stddev_Samp_Order_By>;
  sum?: Maybe<Evaluation_Narratives_Sum_Order_By>;
  var_pop?: Maybe<Evaluation_Narratives_Var_Pop_Order_By>;
  var_samp?: Maybe<Evaluation_Narratives_Var_Samp_Order_By>;
  variance?: Maybe<Evaluation_Narratives_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "evaluation_narratives" */
export type Evaluation_Narratives_Arr_Rel_Insert_Input = {
  data: Array<Evaluation_Narratives_Insert_Input>;
  on_conflict?: Maybe<Evaluation_Narratives_On_Conflict>;
};

/** aggregate avg on columns */
export type Evaluation_Narratives_Avg_Fields = {
  __typename?: 'evaluation_narratives_avg_fields';
  comment_compound?: Maybe<Scalars['Float']>;
  comment_neg?: Maybe<Scalars['Float']>;
  comment_neu?: Maybe<Scalars['Float']>;
  comment_pos?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Avg_Order_By = {
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "evaluation_narratives". All fields are combined with a logical 'AND'. */
export type Evaluation_Narratives_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Evaluation_Narratives_Bool_Exp>>>;
  _not?: Maybe<Evaluation_Narratives_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Evaluation_Narratives_Bool_Exp>>>;
  comment?: Maybe<String_Comparison_Exp>;
  comment_compound?: Maybe<Float8_Comparison_Exp>;
  comment_neg?: Maybe<Float8_Comparison_Exp>;
  comment_neu?: Maybe<Float8_Comparison_Exp>;
  comment_pos?: Maybe<Float8_Comparison_Exp>;
  course?: Maybe<Courses_Bool_Exp>;
  course_id?: Maybe<Int_Comparison_Exp>;
  evaluation_question?: Maybe<Evaluation_Questions_Bool_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  question_code?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "evaluation_narratives" */
export enum Evaluation_Narratives_Constraint {
  /** unique or primary key constraint */
  PkEvaluationNarrativesStaged = 'pk_evaluation_narratives_staged'
}

/** input type for incrementing integer column in table "evaluation_narratives" */
export type Evaluation_Narratives_Inc_Input = {
  comment_compound?: Maybe<Scalars['float8']>;
  comment_neg?: Maybe<Scalars['float8']>;
  comment_neu?: Maybe<Scalars['float8']>;
  comment_pos?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "evaluation_narratives" */
export type Evaluation_Narratives_Insert_Input = {
  comment?: Maybe<Scalars['String']>;
  comment_compound?: Maybe<Scalars['float8']>;
  comment_neg?: Maybe<Scalars['float8']>;
  comment_neu?: Maybe<Scalars['float8']>;
  comment_pos?: Maybe<Scalars['float8']>;
  course?: Maybe<Courses_Obj_Rel_Insert_Input>;
  course_id?: Maybe<Scalars['Int']>;
  evaluation_question?: Maybe<Evaluation_Questions_Obj_Rel_Insert_Input>;
  id?: Maybe<Scalars['Int']>;
  question_code?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Evaluation_Narratives_Max_Fields = {
  __typename?: 'evaluation_narratives_max_fields';
  comment?: Maybe<Scalars['String']>;
  comment_compound?: Maybe<Scalars['float8']>;
  comment_neg?: Maybe<Scalars['float8']>;
  comment_neu?: Maybe<Scalars['float8']>;
  comment_pos?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  question_code?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Max_Order_By = {
  comment?: Maybe<Order_By>;
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  question_code?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Evaluation_Narratives_Min_Fields = {
  __typename?: 'evaluation_narratives_min_fields';
  comment?: Maybe<Scalars['String']>;
  comment_compound?: Maybe<Scalars['float8']>;
  comment_neg?: Maybe<Scalars['float8']>;
  comment_neu?: Maybe<Scalars['float8']>;
  comment_pos?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  question_code?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Min_Order_By = {
  comment?: Maybe<Order_By>;
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  question_code?: Maybe<Order_By>;
};

/** response of any mutation on the table "evaluation_narratives" */
export type Evaluation_Narratives_Mutation_Response = {
  __typename?: 'evaluation_narratives_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Evaluation_Narratives>;
};

/** input type for inserting object relation for remote table "evaluation_narratives" */
export type Evaluation_Narratives_Obj_Rel_Insert_Input = {
  data: Evaluation_Narratives_Insert_Input;
  on_conflict?: Maybe<Evaluation_Narratives_On_Conflict>;
};

/** on conflict condition type for table "evaluation_narratives" */
export type Evaluation_Narratives_On_Conflict = {
  constraint: Evaluation_Narratives_Constraint;
  update_columns: Array<Evaluation_Narratives_Update_Column>;
  where?: Maybe<Evaluation_Narratives_Bool_Exp>;
};

/** ordering options when selecting data from "evaluation_narratives" */
export type Evaluation_Narratives_Order_By = {
  comment?: Maybe<Order_By>;
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course?: Maybe<Courses_Order_By>;
  course_id?: Maybe<Order_By>;
  evaluation_question?: Maybe<Evaluation_Questions_Order_By>;
  id?: Maybe<Order_By>;
  question_code?: Maybe<Order_By>;
};

/** primary key columns input for table: "evaluation_narratives" */
export type Evaluation_Narratives_Pk_Columns_Input = {
  id: Scalars['Int'];
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
  QuestionCode = 'question_code'
}

/** input type for updating data in table "evaluation_narratives" */
export type Evaluation_Narratives_Set_Input = {
  comment?: Maybe<Scalars['String']>;
  comment_compound?: Maybe<Scalars['float8']>;
  comment_neg?: Maybe<Scalars['float8']>;
  comment_neu?: Maybe<Scalars['float8']>;
  comment_pos?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  question_code?: Maybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Evaluation_Narratives_Stddev_Fields = {
  __typename?: 'evaluation_narratives_stddev_fields';
  comment_compound?: Maybe<Scalars['Float']>;
  comment_neg?: Maybe<Scalars['Float']>;
  comment_neu?: Maybe<Scalars['Float']>;
  comment_pos?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Stddev_Order_By = {
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Evaluation_Narratives_Stddev_Pop_Fields = {
  __typename?: 'evaluation_narratives_stddev_pop_fields';
  comment_compound?: Maybe<Scalars['Float']>;
  comment_neg?: Maybe<Scalars['Float']>;
  comment_neu?: Maybe<Scalars['Float']>;
  comment_pos?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Stddev_Pop_Order_By = {
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Evaluation_Narratives_Stddev_Samp_Fields = {
  __typename?: 'evaluation_narratives_stddev_samp_fields';
  comment_compound?: Maybe<Scalars['Float']>;
  comment_neg?: Maybe<Scalars['Float']>;
  comment_neu?: Maybe<Scalars['Float']>;
  comment_pos?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Stddev_Samp_Order_By = {
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Evaluation_Narratives_Sum_Fields = {
  __typename?: 'evaluation_narratives_sum_fields';
  comment_compound?: Maybe<Scalars['float8']>;
  comment_neg?: Maybe<Scalars['float8']>;
  comment_neu?: Maybe<Scalars['float8']>;
  comment_pos?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Sum_Order_By = {
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
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
  QuestionCode = 'question_code'
}

/** aggregate var_pop on columns */
export type Evaluation_Narratives_Var_Pop_Fields = {
  __typename?: 'evaluation_narratives_var_pop_fields';
  comment_compound?: Maybe<Scalars['Float']>;
  comment_neg?: Maybe<Scalars['Float']>;
  comment_neu?: Maybe<Scalars['Float']>;
  comment_pos?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Var_Pop_Order_By = {
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Evaluation_Narratives_Var_Samp_Fields = {
  __typename?: 'evaluation_narratives_var_samp_fields';
  comment_compound?: Maybe<Scalars['Float']>;
  comment_neg?: Maybe<Scalars['Float']>;
  comment_neu?: Maybe<Scalars['Float']>;
  comment_pos?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Var_Samp_Order_By = {
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Evaluation_Narratives_Variance_Fields = {
  __typename?: 'evaluation_narratives_variance_fields';
  comment_compound?: Maybe<Scalars['Float']>;
  comment_neg?: Maybe<Scalars['Float']>;
  comment_neu?: Maybe<Scalars['Float']>;
  comment_pos?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Variance_Order_By = {
  comment_compound?: Maybe<Order_By>;
  comment_neg?: Maybe<Order_By>;
  comment_neu?: Maybe<Order_By>;
  comment_pos?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** columns and relationships of "evaluation_questions" */
export type Evaluation_Questions = {
  __typename?: 'evaluation_questions';
  /** An array relationship */
  evaluation_narratives: Array<Evaluation_Narratives>;
  /** An aggregated array relationship */
  evaluation_narratives_aggregate: Evaluation_Narratives_Aggregate;
  /** An array relationship */
  evaluation_ratings: Array<Evaluation_Ratings>;
  /** An aggregated array relationship */
  evaluation_ratings_aggregate: Evaluation_Ratings_Aggregate;
  /**
   * True if the question has narrative responses.
   *         False if the question has categorica/numerical responses
   */
  is_narrative?: Maybe<Scalars['Boolean']>;
  /** JSON array of possible responses (only if the question is not a narrative */
  options?: Maybe<Scalars['json']>;
  /** Question code from OCE (e.g. "YC402") */
  question_code: Scalars['String'];
  /** The question text */
  question_text?: Maybe<Scalars['String']>;
  /**
   * [computed] Question type (used for computing ratings, since one
   *         question may be coded differently for different respondants)
   */
  tag?: Maybe<Scalars['String']>;
};


/** columns and relationships of "evaluation_questions" */
export type Evaluation_QuestionsEvaluation_NarrativesArgs = {
  distinct_on?: Maybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Narratives_Order_By>>;
  where?: Maybe<Evaluation_Narratives_Bool_Exp>;
};


/** columns and relationships of "evaluation_questions" */
export type Evaluation_QuestionsEvaluation_Narratives_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Narratives_Order_By>>;
  where?: Maybe<Evaluation_Narratives_Bool_Exp>;
};


/** columns and relationships of "evaluation_questions" */
export type Evaluation_QuestionsEvaluation_RatingsArgs = {
  distinct_on?: Maybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Ratings_Order_By>>;
  where?: Maybe<Evaluation_Ratings_Bool_Exp>;
};


/** columns and relationships of "evaluation_questions" */
export type Evaluation_QuestionsEvaluation_Ratings_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Ratings_Order_By>>;
  where?: Maybe<Evaluation_Ratings_Bool_Exp>;
};


/** columns and relationships of "evaluation_questions" */
export type Evaluation_QuestionsOptionsArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "evaluation_questions" */
export type Evaluation_Questions_Aggregate = {
  __typename?: 'evaluation_questions_aggregate';
  aggregate?: Maybe<Evaluation_Questions_Aggregate_Fields>;
  nodes: Array<Evaluation_Questions>;
};

/** aggregate fields of "evaluation_questions" */
export type Evaluation_Questions_Aggregate_Fields = {
  __typename?: 'evaluation_questions_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Evaluation_Questions_Max_Fields>;
  min?: Maybe<Evaluation_Questions_Min_Fields>;
};


/** aggregate fields of "evaluation_questions" */
export type Evaluation_Questions_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Evaluation_Questions_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "evaluation_questions" */
export type Evaluation_Questions_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Evaluation_Questions_Max_Order_By>;
  min?: Maybe<Evaluation_Questions_Min_Order_By>;
};

/** input type for inserting array relation for remote table "evaluation_questions" */
export type Evaluation_Questions_Arr_Rel_Insert_Input = {
  data: Array<Evaluation_Questions_Insert_Input>;
  on_conflict?: Maybe<Evaluation_Questions_On_Conflict>;
};

/** Boolean expression to filter rows from the table "evaluation_questions". All fields are combined with a logical 'AND'. */
export type Evaluation_Questions_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Evaluation_Questions_Bool_Exp>>>;
  _not?: Maybe<Evaluation_Questions_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Evaluation_Questions_Bool_Exp>>>;
  evaluation_narratives?: Maybe<Evaluation_Narratives_Bool_Exp>;
  evaluation_ratings?: Maybe<Evaluation_Ratings_Bool_Exp>;
  is_narrative?: Maybe<Boolean_Comparison_Exp>;
  options?: Maybe<Json_Comparison_Exp>;
  question_code?: Maybe<String_Comparison_Exp>;
  question_text?: Maybe<String_Comparison_Exp>;
  tag?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "evaluation_questions" */
export enum Evaluation_Questions_Constraint {
  /** unique or primary key constraint */
  PkEvaluationQuestionsStaged = 'pk_evaluation_questions_staged'
}

/** input type for inserting data into table "evaluation_questions" */
export type Evaluation_Questions_Insert_Input = {
  evaluation_narratives?: Maybe<Evaluation_Narratives_Arr_Rel_Insert_Input>;
  evaluation_ratings?: Maybe<Evaluation_Ratings_Arr_Rel_Insert_Input>;
  is_narrative?: Maybe<Scalars['Boolean']>;
  options?: Maybe<Scalars['json']>;
  question_code?: Maybe<Scalars['String']>;
  question_text?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Evaluation_Questions_Max_Fields = {
  __typename?: 'evaluation_questions_max_fields';
  question_code?: Maybe<Scalars['String']>;
  question_text?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "evaluation_questions" */
export type Evaluation_Questions_Max_Order_By = {
  question_code?: Maybe<Order_By>;
  question_text?: Maybe<Order_By>;
  tag?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Evaluation_Questions_Min_Fields = {
  __typename?: 'evaluation_questions_min_fields';
  question_code?: Maybe<Scalars['String']>;
  question_text?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "evaluation_questions" */
export type Evaluation_Questions_Min_Order_By = {
  question_code?: Maybe<Order_By>;
  question_text?: Maybe<Order_By>;
  tag?: Maybe<Order_By>;
};

/** response of any mutation on the table "evaluation_questions" */
export type Evaluation_Questions_Mutation_Response = {
  __typename?: 'evaluation_questions_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Evaluation_Questions>;
};

/** input type for inserting object relation for remote table "evaluation_questions" */
export type Evaluation_Questions_Obj_Rel_Insert_Input = {
  data: Evaluation_Questions_Insert_Input;
  on_conflict?: Maybe<Evaluation_Questions_On_Conflict>;
};

/** on conflict condition type for table "evaluation_questions" */
export type Evaluation_Questions_On_Conflict = {
  constraint: Evaluation_Questions_Constraint;
  update_columns: Array<Evaluation_Questions_Update_Column>;
  where?: Maybe<Evaluation_Questions_Bool_Exp>;
};

/** ordering options when selecting data from "evaluation_questions" */
export type Evaluation_Questions_Order_By = {
  evaluation_narratives_aggregate?: Maybe<Evaluation_Narratives_Aggregate_Order_By>;
  evaluation_ratings_aggregate?: Maybe<Evaluation_Ratings_Aggregate_Order_By>;
  is_narrative?: Maybe<Order_By>;
  options?: Maybe<Order_By>;
  question_code?: Maybe<Order_By>;
  question_text?: Maybe<Order_By>;
  tag?: Maybe<Order_By>;
};

/** primary key columns input for table: "evaluation_questions" */
export type Evaluation_Questions_Pk_Columns_Input = {
  /** Question code from OCE (e.g. "YC402") */
  question_code: Scalars['String'];
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
  Tag = 'tag'
}

/** input type for updating data in table "evaluation_questions" */
export type Evaluation_Questions_Set_Input = {
  is_narrative?: Maybe<Scalars['Boolean']>;
  options?: Maybe<Scalars['json']>;
  question_code?: Maybe<Scalars['String']>;
  question_text?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
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
  Tag = 'tag'
}

/** columns and relationships of "evaluation_ratings" */
export type Evaluation_Ratings = {
  __typename?: 'evaluation_ratings';
  /** An object relationship */
  course: Courses;
  /** The course to which this rating applies */
  course_id: Scalars['Int'];
  /** An object relationship */
  evaluation_question: Evaluation_Questions;
  id: Scalars['Int'];
  /** Question to which this rating responds */
  question_code: Scalars['String'];
  /** JSON array of the response counts for each option */
  rating?: Maybe<Scalars['json']>;
};


/** columns and relationships of "evaluation_ratings" */
export type Evaluation_RatingsRatingArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "evaluation_ratings" */
export type Evaluation_Ratings_Aggregate = {
  __typename?: 'evaluation_ratings_aggregate';
  aggregate?: Maybe<Evaluation_Ratings_Aggregate_Fields>;
  nodes: Array<Evaluation_Ratings>;
};

/** aggregate fields of "evaluation_ratings" */
export type Evaluation_Ratings_Aggregate_Fields = {
  __typename?: 'evaluation_ratings_aggregate_fields';
  avg?: Maybe<Evaluation_Ratings_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Evaluation_Ratings_Max_Fields>;
  min?: Maybe<Evaluation_Ratings_Min_Fields>;
  stddev?: Maybe<Evaluation_Ratings_Stddev_Fields>;
  stddev_pop?: Maybe<Evaluation_Ratings_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Evaluation_Ratings_Stddev_Samp_Fields>;
  sum?: Maybe<Evaluation_Ratings_Sum_Fields>;
  var_pop?: Maybe<Evaluation_Ratings_Var_Pop_Fields>;
  var_samp?: Maybe<Evaluation_Ratings_Var_Samp_Fields>;
  variance?: Maybe<Evaluation_Ratings_Variance_Fields>;
};


/** aggregate fields of "evaluation_ratings" */
export type Evaluation_Ratings_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Evaluation_Ratings_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "evaluation_ratings" */
export type Evaluation_Ratings_Aggregate_Order_By = {
  avg?: Maybe<Evaluation_Ratings_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Evaluation_Ratings_Max_Order_By>;
  min?: Maybe<Evaluation_Ratings_Min_Order_By>;
  stddev?: Maybe<Evaluation_Ratings_Stddev_Order_By>;
  stddev_pop?: Maybe<Evaluation_Ratings_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Evaluation_Ratings_Stddev_Samp_Order_By>;
  sum?: Maybe<Evaluation_Ratings_Sum_Order_By>;
  var_pop?: Maybe<Evaluation_Ratings_Var_Pop_Order_By>;
  var_samp?: Maybe<Evaluation_Ratings_Var_Samp_Order_By>;
  variance?: Maybe<Evaluation_Ratings_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "evaluation_ratings" */
export type Evaluation_Ratings_Arr_Rel_Insert_Input = {
  data: Array<Evaluation_Ratings_Insert_Input>;
  on_conflict?: Maybe<Evaluation_Ratings_On_Conflict>;
};

/** aggregate avg on columns */
export type Evaluation_Ratings_Avg_Fields = {
  __typename?: 'evaluation_ratings_avg_fields';
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Avg_Order_By = {
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "evaluation_ratings". All fields are combined with a logical 'AND'. */
export type Evaluation_Ratings_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Evaluation_Ratings_Bool_Exp>>>;
  _not?: Maybe<Evaluation_Ratings_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Evaluation_Ratings_Bool_Exp>>>;
  course?: Maybe<Courses_Bool_Exp>;
  course_id?: Maybe<Int_Comparison_Exp>;
  evaluation_question?: Maybe<Evaluation_Questions_Bool_Exp>;
  id?: Maybe<Int_Comparison_Exp>;
  question_code?: Maybe<String_Comparison_Exp>;
  rating?: Maybe<Json_Comparison_Exp>;
};

/** unique or primary key constraints on table "evaluation_ratings" */
export enum Evaluation_Ratings_Constraint {
  /** unique or primary key constraint */
  PkEvaluationRatingsStaged = 'pk_evaluation_ratings_staged'
}

/** input type for incrementing integer column in table "evaluation_ratings" */
export type Evaluation_Ratings_Inc_Input = {
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "evaluation_ratings" */
export type Evaluation_Ratings_Insert_Input = {
  course?: Maybe<Courses_Obj_Rel_Insert_Input>;
  course_id?: Maybe<Scalars['Int']>;
  evaluation_question?: Maybe<Evaluation_Questions_Obj_Rel_Insert_Input>;
  id?: Maybe<Scalars['Int']>;
  question_code?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['json']>;
};

/** aggregate max on columns */
export type Evaluation_Ratings_Max_Fields = {
  __typename?: 'evaluation_ratings_max_fields';
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  question_code?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Max_Order_By = {
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  question_code?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Evaluation_Ratings_Min_Fields = {
  __typename?: 'evaluation_ratings_min_fields';
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  question_code?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Min_Order_By = {
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  question_code?: Maybe<Order_By>;
};

/** response of any mutation on the table "evaluation_ratings" */
export type Evaluation_Ratings_Mutation_Response = {
  __typename?: 'evaluation_ratings_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Evaluation_Ratings>;
};

/** input type for inserting object relation for remote table "evaluation_ratings" */
export type Evaluation_Ratings_Obj_Rel_Insert_Input = {
  data: Evaluation_Ratings_Insert_Input;
  on_conflict?: Maybe<Evaluation_Ratings_On_Conflict>;
};

/** on conflict condition type for table "evaluation_ratings" */
export type Evaluation_Ratings_On_Conflict = {
  constraint: Evaluation_Ratings_Constraint;
  update_columns: Array<Evaluation_Ratings_Update_Column>;
  where?: Maybe<Evaluation_Ratings_Bool_Exp>;
};

/** ordering options when selecting data from "evaluation_ratings" */
export type Evaluation_Ratings_Order_By = {
  course?: Maybe<Courses_Order_By>;
  course_id?: Maybe<Order_By>;
  evaluation_question?: Maybe<Evaluation_Questions_Order_By>;
  id?: Maybe<Order_By>;
  question_code?: Maybe<Order_By>;
  rating?: Maybe<Order_By>;
};

/** primary key columns input for table: "evaluation_ratings" */
export type Evaluation_Ratings_Pk_Columns_Input = {
  id: Scalars['Int'];
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
  Rating = 'rating'
}

/** input type for updating data in table "evaluation_ratings" */
export type Evaluation_Ratings_Set_Input = {
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  question_code?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['json']>;
};

/** aggregate stddev on columns */
export type Evaluation_Ratings_Stddev_Fields = {
  __typename?: 'evaluation_ratings_stddev_fields';
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Stddev_Order_By = {
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Evaluation_Ratings_Stddev_Pop_Fields = {
  __typename?: 'evaluation_ratings_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Stddev_Pop_Order_By = {
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Evaluation_Ratings_Stddev_Samp_Fields = {
  __typename?: 'evaluation_ratings_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Stddev_Samp_Order_By = {
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Evaluation_Ratings_Sum_Fields = {
  __typename?: 'evaluation_ratings_sum_fields';
  course_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Sum_Order_By = {
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
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
  Rating = 'rating'
}

/** aggregate var_pop on columns */
export type Evaluation_Ratings_Var_Pop_Fields = {
  __typename?: 'evaluation_ratings_var_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Var_Pop_Order_By = {
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Evaluation_Ratings_Var_Samp_Fields = {
  __typename?: 'evaluation_ratings_var_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Var_Samp_Order_By = {
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Evaluation_Ratings_Variance_Fields = {
  __typename?: 'evaluation_ratings_variance_fields';
  course_id?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Variance_Order_By = {
  course_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
};

/** columns and relationships of "evaluation_statistics" */
export type Evaluation_Statistics = {
  __typename?: 'evaluation_statistics';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['float8']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['float8']>;
  /** An object relationship */
  course: Courses;
  /** The course associated with these statistics */
  course_id: Scalars['Int'];
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Int']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Int']>;
  /** Placeholder for compatibility (previously held JSON for enrollment) */
  enrollment?: Maybe<Scalars['Int']>;
  /** Arbitrary additional information attached to an evaluation */
  extras?: Maybe<Scalars['json']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Int']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Int']>;
};


/** columns and relationships of "evaluation_statistics" */
export type Evaluation_StatisticsExtrasArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "evaluation_statistics" */
export type Evaluation_Statistics_Aggregate = {
  __typename?: 'evaluation_statistics_aggregate';
  aggregate?: Maybe<Evaluation_Statistics_Aggregate_Fields>;
  nodes: Array<Evaluation_Statistics>;
};

/** aggregate fields of "evaluation_statistics" */
export type Evaluation_Statistics_Aggregate_Fields = {
  __typename?: 'evaluation_statistics_aggregate_fields';
  avg?: Maybe<Evaluation_Statistics_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Evaluation_Statistics_Max_Fields>;
  min?: Maybe<Evaluation_Statistics_Min_Fields>;
  stddev?: Maybe<Evaluation_Statistics_Stddev_Fields>;
  stddev_pop?: Maybe<Evaluation_Statistics_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Evaluation_Statistics_Stddev_Samp_Fields>;
  sum?: Maybe<Evaluation_Statistics_Sum_Fields>;
  var_pop?: Maybe<Evaluation_Statistics_Var_Pop_Fields>;
  var_samp?: Maybe<Evaluation_Statistics_Var_Samp_Fields>;
  variance?: Maybe<Evaluation_Statistics_Variance_Fields>;
};


/** aggregate fields of "evaluation_statistics" */
export type Evaluation_Statistics_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Evaluation_Statistics_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "evaluation_statistics" */
export type Evaluation_Statistics_Aggregate_Order_By = {
  avg?: Maybe<Evaluation_Statistics_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Evaluation_Statistics_Max_Order_By>;
  min?: Maybe<Evaluation_Statistics_Min_Order_By>;
  stddev?: Maybe<Evaluation_Statistics_Stddev_Order_By>;
  stddev_pop?: Maybe<Evaluation_Statistics_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Evaluation_Statistics_Stddev_Samp_Order_By>;
  sum?: Maybe<Evaluation_Statistics_Sum_Order_By>;
  var_pop?: Maybe<Evaluation_Statistics_Var_Pop_Order_By>;
  var_samp?: Maybe<Evaluation_Statistics_Var_Samp_Order_By>;
  variance?: Maybe<Evaluation_Statistics_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "evaluation_statistics" */
export type Evaluation_Statistics_Arr_Rel_Insert_Input = {
  data: Array<Evaluation_Statistics_Insert_Input>;
  on_conflict?: Maybe<Evaluation_Statistics_On_Conflict>;
};

/** aggregate avg on columns */
export type Evaluation_Statistics_Avg_Fields = {
  __typename?: 'evaluation_statistics_avg_fields';
  avg_rating?: Maybe<Scalars['Float']>;
  avg_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "evaluation_statistics" */
export type Evaluation_Statistics_Avg_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "evaluation_statistics". All fields are combined with a logical 'AND'. */
export type Evaluation_Statistics_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Evaluation_Statistics_Bool_Exp>>>;
  _not?: Maybe<Evaluation_Statistics_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Evaluation_Statistics_Bool_Exp>>>;
  avg_rating?: Maybe<Float8_Comparison_Exp>;
  avg_workload?: Maybe<Float8_Comparison_Exp>;
  course?: Maybe<Courses_Bool_Exp>;
  course_id?: Maybe<Int_Comparison_Exp>;
  declined?: Maybe<Int_Comparison_Exp>;
  enrolled?: Maybe<Int_Comparison_Exp>;
  enrollment?: Maybe<Int_Comparison_Exp>;
  extras?: Maybe<Json_Comparison_Exp>;
  no_response?: Maybe<Int_Comparison_Exp>;
  responses?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "evaluation_statistics" */
export enum Evaluation_Statistics_Constraint {
  /** unique or primary key constraint */
  PkEvaluationStatisticsStaged = 'pk_evaluation_statistics_staged'
}

/** input type for incrementing integer column in table "evaluation_statistics" */
export type Evaluation_Statistics_Inc_Input = {
  avg_rating?: Maybe<Scalars['float8']>;
  avg_workload?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  no_response?: Maybe<Scalars['Int']>;
  responses?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "evaluation_statistics" */
export type Evaluation_Statistics_Insert_Input = {
  avg_rating?: Maybe<Scalars['float8']>;
  avg_workload?: Maybe<Scalars['float8']>;
  course?: Maybe<Courses_Obj_Rel_Insert_Input>;
  course_id?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  extras?: Maybe<Scalars['json']>;
  no_response?: Maybe<Scalars['Int']>;
  responses?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Evaluation_Statistics_Max_Fields = {
  __typename?: 'evaluation_statistics_max_fields';
  avg_rating?: Maybe<Scalars['float8']>;
  avg_workload?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  no_response?: Maybe<Scalars['Int']>;
  responses?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "evaluation_statistics" */
export type Evaluation_Statistics_Max_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Evaluation_Statistics_Min_Fields = {
  __typename?: 'evaluation_statistics_min_fields';
  avg_rating?: Maybe<Scalars['float8']>;
  avg_workload?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  no_response?: Maybe<Scalars['Int']>;
  responses?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "evaluation_statistics" */
export type Evaluation_Statistics_Min_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** response of any mutation on the table "evaluation_statistics" */
export type Evaluation_Statistics_Mutation_Response = {
  __typename?: 'evaluation_statistics_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Evaluation_Statistics>;
};

/** input type for inserting object relation for remote table "evaluation_statistics" */
export type Evaluation_Statistics_Obj_Rel_Insert_Input = {
  data: Evaluation_Statistics_Insert_Input;
  on_conflict?: Maybe<Evaluation_Statistics_On_Conflict>;
};

/** on conflict condition type for table "evaluation_statistics" */
export type Evaluation_Statistics_On_Conflict = {
  constraint: Evaluation_Statistics_Constraint;
  update_columns: Array<Evaluation_Statistics_Update_Column>;
  where?: Maybe<Evaluation_Statistics_Bool_Exp>;
};

/** ordering options when selecting data from "evaluation_statistics" */
export type Evaluation_Statistics_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course?: Maybe<Courses_Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  extras?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** primary key columns input for table: "evaluation_statistics" */
export type Evaluation_Statistics_Pk_Columns_Input = {
  /** The course associated with these statistics */
  course_id: Scalars['Int'];
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
  Responses = 'responses'
}

/** input type for updating data in table "evaluation_statistics" */
export type Evaluation_Statistics_Set_Input = {
  avg_rating?: Maybe<Scalars['float8']>;
  avg_workload?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  extras?: Maybe<Scalars['json']>;
  no_response?: Maybe<Scalars['Int']>;
  responses?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Evaluation_Statistics_Stddev_Fields = {
  __typename?: 'evaluation_statistics_stddev_fields';
  avg_rating?: Maybe<Scalars['Float']>;
  avg_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "evaluation_statistics" */
export type Evaluation_Statistics_Stddev_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Evaluation_Statistics_Stddev_Pop_Fields = {
  __typename?: 'evaluation_statistics_stddev_pop_fields';
  avg_rating?: Maybe<Scalars['Float']>;
  avg_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "evaluation_statistics" */
export type Evaluation_Statistics_Stddev_Pop_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Evaluation_Statistics_Stddev_Samp_Fields = {
  __typename?: 'evaluation_statistics_stddev_samp_fields';
  avg_rating?: Maybe<Scalars['Float']>;
  avg_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "evaluation_statistics" */
export type Evaluation_Statistics_Stddev_Samp_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Evaluation_Statistics_Sum_Fields = {
  __typename?: 'evaluation_statistics_sum_fields';
  avg_rating?: Maybe<Scalars['float8']>;
  avg_workload?: Maybe<Scalars['float8']>;
  course_id?: Maybe<Scalars['Int']>;
  declined?: Maybe<Scalars['Int']>;
  enrolled?: Maybe<Scalars['Int']>;
  enrollment?: Maybe<Scalars['Int']>;
  no_response?: Maybe<Scalars['Int']>;
  responses?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "evaluation_statistics" */
export type Evaluation_Statistics_Sum_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
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
  Responses = 'responses'
}

/** aggregate var_pop on columns */
export type Evaluation_Statistics_Var_Pop_Fields = {
  __typename?: 'evaluation_statistics_var_pop_fields';
  avg_rating?: Maybe<Scalars['Float']>;
  avg_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "evaluation_statistics" */
export type Evaluation_Statistics_Var_Pop_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Evaluation_Statistics_Var_Samp_Fields = {
  __typename?: 'evaluation_statistics_var_samp_fields';
  avg_rating?: Maybe<Scalars['Float']>;
  avg_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "evaluation_statistics" */
export type Evaluation_Statistics_Var_Samp_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Evaluation_Statistics_Variance_Fields = {
  __typename?: 'evaluation_statistics_variance_fields';
  avg_rating?: Maybe<Scalars['Float']>;
  avg_workload?: Maybe<Scalars['Float']>;
  course_id?: Maybe<Scalars['Float']>;
  declined?: Maybe<Scalars['Float']>;
  enrolled?: Maybe<Scalars['Float']>;
  enrollment?: Maybe<Scalars['Float']>;
  no_response?: Maybe<Scalars['Float']>;
  responses?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "evaluation_statistics" */
export type Evaluation_Statistics_Variance_Order_By = {
  avg_rating?: Maybe<Order_By>;
  avg_workload?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  declined?: Maybe<Order_By>;
  enrolled?: Maybe<Order_By>;
  enrollment?: Maybe<Order_By>;
  no_response?: Maybe<Order_By>;
  responses?: Maybe<Order_By>;
};

/** columns and relationships of "flags" */
export type Flags = {
  __typename?: 'flags';
  /** An array relationship */
  course_flags: Array<Course_Flags>;
  /** An aggregated array relationship */
  course_flags_aggregate: Course_Flags_Aggregate;
  /** Flag ID */
  flag_id: Scalars['Int'];
  /** Flag text */
  flag_text: Scalars['String'];
};


/** columns and relationships of "flags" */
export type FlagsCourse_FlagsArgs = {
  distinct_on?: Maybe<Array<Course_Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Flags_Order_By>>;
  where?: Maybe<Course_Flags_Bool_Exp>;
};


/** columns and relationships of "flags" */
export type FlagsCourse_Flags_AggregateArgs = {
  distinct_on?: Maybe<Array<Course_Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Flags_Order_By>>;
  where?: Maybe<Course_Flags_Bool_Exp>;
};

/** aggregated selection of "flags" */
export type Flags_Aggregate = {
  __typename?: 'flags_aggregate';
  aggregate?: Maybe<Flags_Aggregate_Fields>;
  nodes: Array<Flags>;
};

/** aggregate fields of "flags" */
export type Flags_Aggregate_Fields = {
  __typename?: 'flags_aggregate_fields';
  avg?: Maybe<Flags_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Flags_Max_Fields>;
  min?: Maybe<Flags_Min_Fields>;
  stddev?: Maybe<Flags_Stddev_Fields>;
  stddev_pop?: Maybe<Flags_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Flags_Stddev_Samp_Fields>;
  sum?: Maybe<Flags_Sum_Fields>;
  var_pop?: Maybe<Flags_Var_Pop_Fields>;
  var_samp?: Maybe<Flags_Var_Samp_Fields>;
  variance?: Maybe<Flags_Variance_Fields>;
};


/** aggregate fields of "flags" */
export type Flags_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Flags_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "flags" */
export type Flags_Aggregate_Order_By = {
  avg?: Maybe<Flags_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Flags_Max_Order_By>;
  min?: Maybe<Flags_Min_Order_By>;
  stddev?: Maybe<Flags_Stddev_Order_By>;
  stddev_pop?: Maybe<Flags_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Flags_Stddev_Samp_Order_By>;
  sum?: Maybe<Flags_Sum_Order_By>;
  var_pop?: Maybe<Flags_Var_Pop_Order_By>;
  var_samp?: Maybe<Flags_Var_Samp_Order_By>;
  variance?: Maybe<Flags_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "flags" */
export type Flags_Arr_Rel_Insert_Input = {
  data: Array<Flags_Insert_Input>;
  on_conflict?: Maybe<Flags_On_Conflict>;
};

/** aggregate avg on columns */
export type Flags_Avg_Fields = {
  __typename?: 'flags_avg_fields';
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "flags" */
export type Flags_Avg_Order_By = {
  flag_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "flags". All fields are combined with a logical 'AND'. */
export type Flags_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Flags_Bool_Exp>>>;
  _not?: Maybe<Flags_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Flags_Bool_Exp>>>;
  course_flags?: Maybe<Course_Flags_Bool_Exp>;
  flag_id?: Maybe<Int_Comparison_Exp>;
  flag_text?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "flags" */
export enum Flags_Constraint {
  /** unique or primary key constraint */
  PkFlagsStaged = 'pk_flags_staged'
}

/** input type for incrementing integer column in table "flags" */
export type Flags_Inc_Input = {
  flag_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "flags" */
export type Flags_Insert_Input = {
  course_flags?: Maybe<Course_Flags_Arr_Rel_Insert_Input>;
  flag_id?: Maybe<Scalars['Int']>;
  flag_text?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Flags_Max_Fields = {
  __typename?: 'flags_max_fields';
  flag_id?: Maybe<Scalars['Int']>;
  flag_text?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "flags" */
export type Flags_Max_Order_By = {
  flag_id?: Maybe<Order_By>;
  flag_text?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Flags_Min_Fields = {
  __typename?: 'flags_min_fields';
  flag_id?: Maybe<Scalars['Int']>;
  flag_text?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "flags" */
export type Flags_Min_Order_By = {
  flag_id?: Maybe<Order_By>;
  flag_text?: Maybe<Order_By>;
};

/** response of any mutation on the table "flags" */
export type Flags_Mutation_Response = {
  __typename?: 'flags_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Flags>;
};

/** input type for inserting object relation for remote table "flags" */
export type Flags_Obj_Rel_Insert_Input = {
  data: Flags_Insert_Input;
  on_conflict?: Maybe<Flags_On_Conflict>;
};

/** on conflict condition type for table "flags" */
export type Flags_On_Conflict = {
  constraint: Flags_Constraint;
  update_columns: Array<Flags_Update_Column>;
  where?: Maybe<Flags_Bool_Exp>;
};

/** ordering options when selecting data from "flags" */
export type Flags_Order_By = {
  course_flags_aggregate?: Maybe<Course_Flags_Aggregate_Order_By>;
  flag_id?: Maybe<Order_By>;
  flag_text?: Maybe<Order_By>;
};

/** primary key columns input for table: "flags" */
export type Flags_Pk_Columns_Input = {
  /** Flag ID */
  flag_id: Scalars['Int'];
};

/** select columns of table "flags" */
export enum Flags_Select_Column {
  /** column name */
  FlagId = 'flag_id',
  /** column name */
  FlagText = 'flag_text'
}

/** input type for updating data in table "flags" */
export type Flags_Set_Input = {
  flag_id?: Maybe<Scalars['Int']>;
  flag_text?: Maybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Flags_Stddev_Fields = {
  __typename?: 'flags_stddev_fields';
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "flags" */
export type Flags_Stddev_Order_By = {
  flag_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Flags_Stddev_Pop_Fields = {
  __typename?: 'flags_stddev_pop_fields';
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "flags" */
export type Flags_Stddev_Pop_Order_By = {
  flag_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Flags_Stddev_Samp_Fields = {
  __typename?: 'flags_stddev_samp_fields';
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "flags" */
export type Flags_Stddev_Samp_Order_By = {
  flag_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Flags_Sum_Fields = {
  __typename?: 'flags_sum_fields';
  flag_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "flags" */
export type Flags_Sum_Order_By = {
  flag_id?: Maybe<Order_By>;
};

/** update columns of table "flags" */
export enum Flags_Update_Column {
  /** column name */
  FlagId = 'flag_id',
  /** column name */
  FlagText = 'flag_text'
}

/** aggregate var_pop on columns */
export type Flags_Var_Pop_Fields = {
  __typename?: 'flags_var_pop_fields';
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "flags" */
export type Flags_Var_Pop_Order_By = {
  flag_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Flags_Var_Samp_Fields = {
  __typename?: 'flags_var_samp_fields';
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "flags" */
export type Flags_Var_Samp_Order_By = {
  flag_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Flags_Variance_Fields = {
  __typename?: 'flags_variance_fields';
  flag_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "flags" */
export type Flags_Variance_Order_By = {
  flag_id?: Maybe<Order_By>;
};


/** expression to compare columns of type float8. All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq?: Maybe<Scalars['float8']>;
  _gt?: Maybe<Scalars['float8']>;
  _gte?: Maybe<Scalars['float8']>;
  _in?: Maybe<Array<Scalars['float8']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['float8']>;
  _lte?: Maybe<Scalars['float8']>;
  _neq?: Maybe<Scalars['float8']>;
  _nin?: Maybe<Array<Scalars['float8']>>;
};


/** expression to compare columns of type json. All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: Maybe<Scalars['json']>;
  _gt?: Maybe<Scalars['json']>;
  _gte?: Maybe<Scalars['json']>;
  _in?: Maybe<Array<Scalars['json']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['json']>;
  _lte?: Maybe<Scalars['json']>;
  _neq?: Maybe<Scalars['json']>;
  _nin?: Maybe<Array<Scalars['json']>>;
};


/** expression to compare columns of type jsonb. All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  /** is the column contained in the given json value */
  _contained_in?: Maybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: Maybe<Scalars['jsonb']>;
  _eq?: Maybe<Scalars['jsonb']>;
  _gt?: Maybe<Scalars['jsonb']>;
  _gte?: Maybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: Maybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Maybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Maybe<Array<Scalars['String']>>;
  _in?: Maybe<Array<Scalars['jsonb']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['jsonb']>;
  _lte?: Maybe<Scalars['jsonb']>;
  _neq?: Maybe<Scalars['jsonb']>;
  _nin?: Maybe<Array<Scalars['jsonb']>>;
};

/** columns and relationships of "listings" */
export type Listings = {
  __typename?: 'listings';
  /** An array relationship */
  computed_listing_infos: Array<Computed_Listing_Info>;
  /** An aggregated array relationship */
  computed_listing_infos_aggregate: Computed_Listing_Info_Aggregate;
  /** An object relationship */
  course: Courses;
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code?: Maybe<Scalars['String']>;
  /** Course that the listing refers to */
  course_id: Scalars['Int'];
  /** The CRN associated with this listing */
  crn: Scalars['Int'];
  /** Listing ID */
  listing_id: Scalars['Int'];
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: Scalars['String'];
  /** An object relationship */
  season: Seasons;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: Scalars['String'];
  /** Course section for the given subject and number */
  section: Scalars['String'];
  /** Subject the course is listed under (e.g. "AMST") */
  subject: Scalars['String'];
};


/** columns and relationships of "listings" */
export type ListingsComputed_Listing_InfosArgs = {
  distinct_on?: Maybe<Array<Computed_Listing_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Computed_Listing_Info_Order_By>>;
  where?: Maybe<Computed_Listing_Info_Bool_Exp>;
};


/** columns and relationships of "listings" */
export type ListingsComputed_Listing_Infos_AggregateArgs = {
  distinct_on?: Maybe<Array<Computed_Listing_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Computed_Listing_Info_Order_By>>;
  where?: Maybe<Computed_Listing_Info_Bool_Exp>;
};

/** aggregated selection of "listings" */
export type Listings_Aggregate = {
  __typename?: 'listings_aggregate';
  aggregate?: Maybe<Listings_Aggregate_Fields>;
  nodes: Array<Listings>;
};

/** aggregate fields of "listings" */
export type Listings_Aggregate_Fields = {
  __typename?: 'listings_aggregate_fields';
  avg?: Maybe<Listings_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Listings_Max_Fields>;
  min?: Maybe<Listings_Min_Fields>;
  stddev?: Maybe<Listings_Stddev_Fields>;
  stddev_pop?: Maybe<Listings_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Listings_Stddev_Samp_Fields>;
  sum?: Maybe<Listings_Sum_Fields>;
  var_pop?: Maybe<Listings_Var_Pop_Fields>;
  var_samp?: Maybe<Listings_Var_Samp_Fields>;
  variance?: Maybe<Listings_Variance_Fields>;
};


/** aggregate fields of "listings" */
export type Listings_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Listings_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "listings" */
export type Listings_Aggregate_Order_By = {
  avg?: Maybe<Listings_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Listings_Max_Order_By>;
  min?: Maybe<Listings_Min_Order_By>;
  stddev?: Maybe<Listings_Stddev_Order_By>;
  stddev_pop?: Maybe<Listings_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Listings_Stddev_Samp_Order_By>;
  sum?: Maybe<Listings_Sum_Order_By>;
  var_pop?: Maybe<Listings_Var_Pop_Order_By>;
  var_samp?: Maybe<Listings_Var_Samp_Order_By>;
  variance?: Maybe<Listings_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "listings" */
export type Listings_Arr_Rel_Insert_Input = {
  data: Array<Listings_Insert_Input>;
  on_conflict?: Maybe<Listings_On_Conflict>;
};

/** aggregate avg on columns */
export type Listings_Avg_Fields = {
  __typename?: 'listings_avg_fields';
  course_id?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "listings" */
export type Listings_Avg_Order_By = {
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "listings". All fields are combined with a logical 'AND'. */
export type Listings_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Listings_Bool_Exp>>>;
  _not?: Maybe<Listings_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Listings_Bool_Exp>>>;
  computed_listing_infos?: Maybe<Computed_Listing_Info_Bool_Exp>;
  course?: Maybe<Courses_Bool_Exp>;
  course_code?: Maybe<String_Comparison_Exp>;
  course_id?: Maybe<Int_Comparison_Exp>;
  crn?: Maybe<Int_Comparison_Exp>;
  listing_id?: Maybe<Int_Comparison_Exp>;
  number?: Maybe<String_Comparison_Exp>;
  season?: Maybe<Seasons_Bool_Exp>;
  season_code?: Maybe<String_Comparison_Exp>;
  section?: Maybe<String_Comparison_Exp>;
  subject?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "listings" */
export enum Listings_Constraint {
  /** unique or primary key constraint */
  IdxSeasonCodeCrnUnique = 'idx_season_code_crn_unique',
  /** unique or primary key constraint */
  PkListingsStaged = 'pk_listings_staged'
}

/** input type for incrementing integer column in table "listings" */
export type Listings_Inc_Input = {
  course_id?: Maybe<Scalars['Int']>;
  crn?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "listings" */
export type Listings_Insert_Input = {
  computed_listing_infos?: Maybe<Computed_Listing_Info_Arr_Rel_Insert_Input>;
  course?: Maybe<Courses_Obj_Rel_Insert_Input>;
  course_code?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  crn?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  season?: Maybe<Seasons_Obj_Rel_Insert_Input>;
  season_code?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Listings_Max_Fields = {
  __typename?: 'listings_max_fields';
  course_code?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  crn?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "listings" */
export type Listings_Max_Order_By = {
  course_code?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  number?: Maybe<Order_By>;
  season_code?: Maybe<Order_By>;
  section?: Maybe<Order_By>;
  subject?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Listings_Min_Fields = {
  __typename?: 'listings_min_fields';
  course_code?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  crn?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "listings" */
export type Listings_Min_Order_By = {
  course_code?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  number?: Maybe<Order_By>;
  season_code?: Maybe<Order_By>;
  section?: Maybe<Order_By>;
  subject?: Maybe<Order_By>;
};

/** response of any mutation on the table "listings" */
export type Listings_Mutation_Response = {
  __typename?: 'listings_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Listings>;
};

/** input type for inserting object relation for remote table "listings" */
export type Listings_Obj_Rel_Insert_Input = {
  data: Listings_Insert_Input;
  on_conflict?: Maybe<Listings_On_Conflict>;
};

/** on conflict condition type for table "listings" */
export type Listings_On_Conflict = {
  constraint: Listings_Constraint;
  update_columns: Array<Listings_Update_Column>;
  where?: Maybe<Listings_Bool_Exp>;
};

/** ordering options when selecting data from "listings" */
export type Listings_Order_By = {
  computed_listing_infos_aggregate?: Maybe<Computed_Listing_Info_Aggregate_Order_By>;
  course?: Maybe<Courses_Order_By>;
  course_code?: Maybe<Order_By>;
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
  number?: Maybe<Order_By>;
  season?: Maybe<Seasons_Order_By>;
  season_code?: Maybe<Order_By>;
  section?: Maybe<Order_By>;
  subject?: Maybe<Order_By>;
};

/** primary key columns input for table: "listings" */
export type Listings_Pk_Columns_Input = {
  /** Listing ID */
  listing_id: Scalars['Int'];
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
  SeasonCode = 'season_code',
  /** column name */
  Section = 'section',
  /** column name */
  Subject = 'subject'
}

/** input type for updating data in table "listings" */
export type Listings_Set_Input = {
  course_code?: Maybe<Scalars['String']>;
  course_id?: Maybe<Scalars['Int']>;
  crn?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['String']>;
  season_code?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Listings_Stddev_Fields = {
  __typename?: 'listings_stddev_fields';
  course_id?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "listings" */
export type Listings_Stddev_Order_By = {
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Listings_Stddev_Pop_Fields = {
  __typename?: 'listings_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "listings" */
export type Listings_Stddev_Pop_Order_By = {
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Listings_Stddev_Samp_Fields = {
  __typename?: 'listings_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "listings" */
export type Listings_Stddev_Samp_Order_By = {
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Listings_Sum_Fields = {
  __typename?: 'listings_sum_fields';
  course_id?: Maybe<Scalars['Int']>;
  crn?: Maybe<Scalars['Int']>;
  listing_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "listings" */
export type Listings_Sum_Order_By = {
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
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
  SeasonCode = 'season_code',
  /** column name */
  Section = 'section',
  /** column name */
  Subject = 'subject'
}

/** aggregate var_pop on columns */
export type Listings_Var_Pop_Fields = {
  __typename?: 'listings_var_pop_fields';
  course_id?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "listings" */
export type Listings_Var_Pop_Order_By = {
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Listings_Var_Samp_Fields = {
  __typename?: 'listings_var_samp_fields';
  course_id?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "listings" */
export type Listings_Var_Samp_Order_By = {
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Listings_Variance_Fields = {
  __typename?: 'listings_variance_fields';
  course_id?: Maybe<Scalars['Float']>;
  crn?: Maybe<Scalars['Float']>;
  listing_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "listings" */
export type Listings_Variance_Order_By = {
  course_id?: Maybe<Order_By>;
  crn?: Maybe<Order_By>;
  listing_id?: Maybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "computed_listing_info" */
  delete_computed_listing_info?: Maybe<Computed_Listing_Info_Mutation_Response>;
  /** delete data from the table: "course_flags" */
  delete_course_flags?: Maybe<Course_Flags_Mutation_Response>;
  /** delete single row from the table: "course_flags" */
  delete_course_flags_by_pk?: Maybe<Course_Flags>;
  /** delete data from the table: "course_professors" */
  delete_course_professors?: Maybe<Course_Professors_Mutation_Response>;
  /** delete single row from the table: "course_professors" */
  delete_course_professors_by_pk?: Maybe<Course_Professors>;
  /** delete data from the table: "courses" */
  delete_courses?: Maybe<Courses_Mutation_Response>;
  /** delete single row from the table: "courses" */
  delete_courses_by_pk?: Maybe<Courses>;
  /** delete data from the table: "demand_statistics" */
  delete_demand_statistics?: Maybe<Demand_Statistics_Mutation_Response>;
  /** delete single row from the table: "demand_statistics" */
  delete_demand_statistics_by_pk?: Maybe<Demand_Statistics>;
  /** delete data from the table: "evaluation_narratives" */
  delete_evaluation_narratives?: Maybe<Evaluation_Narratives_Mutation_Response>;
  /** delete single row from the table: "evaluation_narratives" */
  delete_evaluation_narratives_by_pk?: Maybe<Evaluation_Narratives>;
  /** delete data from the table: "evaluation_questions" */
  delete_evaluation_questions?: Maybe<Evaluation_Questions_Mutation_Response>;
  /** delete single row from the table: "evaluation_questions" */
  delete_evaluation_questions_by_pk?: Maybe<Evaluation_Questions>;
  /** delete data from the table: "evaluation_ratings" */
  delete_evaluation_ratings?: Maybe<Evaluation_Ratings_Mutation_Response>;
  /** delete single row from the table: "evaluation_ratings" */
  delete_evaluation_ratings_by_pk?: Maybe<Evaluation_Ratings>;
  /** delete data from the table: "evaluation_statistics" */
  delete_evaluation_statistics?: Maybe<Evaluation_Statistics_Mutation_Response>;
  /** delete single row from the table: "evaluation_statistics" */
  delete_evaluation_statistics_by_pk?: Maybe<Evaluation_Statistics>;
  /** delete data from the table: "flags" */
  delete_flags?: Maybe<Flags_Mutation_Response>;
  /** delete single row from the table: "flags" */
  delete_flags_by_pk?: Maybe<Flags>;
  /** delete data from the table: "listings" */
  delete_listings?: Maybe<Listings_Mutation_Response>;
  /** delete single row from the table: "listings" */
  delete_listings_by_pk?: Maybe<Listings>;
  /** delete data from the table: "professors" */
  delete_professors?: Maybe<Professors_Mutation_Response>;
  /** delete single row from the table: "professors" */
  delete_professors_by_pk?: Maybe<Professors>;
  /** delete data from the table: "seasons" */
  delete_seasons?: Maybe<Seasons_Mutation_Response>;
  /** delete single row from the table: "seasons" */
  delete_seasons_by_pk?: Maybe<Seasons>;
  /** insert data into the table: "computed_listing_info" */
  insert_computed_listing_info?: Maybe<Computed_Listing_Info_Mutation_Response>;
  /** insert a single row into the table: "computed_listing_info" */
  insert_computed_listing_info_one?: Maybe<Computed_Listing_Info>;
  /** insert data into the table: "course_flags" */
  insert_course_flags?: Maybe<Course_Flags_Mutation_Response>;
  /** insert a single row into the table: "course_flags" */
  insert_course_flags_one?: Maybe<Course_Flags>;
  /** insert data into the table: "course_professors" */
  insert_course_professors?: Maybe<Course_Professors_Mutation_Response>;
  /** insert a single row into the table: "course_professors" */
  insert_course_professors_one?: Maybe<Course_Professors>;
  /** insert data into the table: "courses" */
  insert_courses?: Maybe<Courses_Mutation_Response>;
  /** insert a single row into the table: "courses" */
  insert_courses_one?: Maybe<Courses>;
  /** insert data into the table: "demand_statistics" */
  insert_demand_statistics?: Maybe<Demand_Statistics_Mutation_Response>;
  /** insert a single row into the table: "demand_statistics" */
  insert_demand_statistics_one?: Maybe<Demand_Statistics>;
  /** insert data into the table: "evaluation_narratives" */
  insert_evaluation_narratives?: Maybe<Evaluation_Narratives_Mutation_Response>;
  /** insert a single row into the table: "evaluation_narratives" */
  insert_evaluation_narratives_one?: Maybe<Evaluation_Narratives>;
  /** insert data into the table: "evaluation_questions" */
  insert_evaluation_questions?: Maybe<Evaluation_Questions_Mutation_Response>;
  /** insert a single row into the table: "evaluation_questions" */
  insert_evaluation_questions_one?: Maybe<Evaluation_Questions>;
  /** insert data into the table: "evaluation_ratings" */
  insert_evaluation_ratings?: Maybe<Evaluation_Ratings_Mutation_Response>;
  /** insert a single row into the table: "evaluation_ratings" */
  insert_evaluation_ratings_one?: Maybe<Evaluation_Ratings>;
  /** insert data into the table: "evaluation_statistics" */
  insert_evaluation_statistics?: Maybe<Evaluation_Statistics_Mutation_Response>;
  /** insert a single row into the table: "evaluation_statistics" */
  insert_evaluation_statistics_one?: Maybe<Evaluation_Statistics>;
  /** insert data into the table: "flags" */
  insert_flags?: Maybe<Flags_Mutation_Response>;
  /** insert a single row into the table: "flags" */
  insert_flags_one?: Maybe<Flags>;
  /** insert data into the table: "listings" */
  insert_listings?: Maybe<Listings_Mutation_Response>;
  /** insert a single row into the table: "listings" */
  insert_listings_one?: Maybe<Listings>;
  /** insert data into the table: "professors" */
  insert_professors?: Maybe<Professors_Mutation_Response>;
  /** insert a single row into the table: "professors" */
  insert_professors_one?: Maybe<Professors>;
  /** insert data into the table: "seasons" */
  insert_seasons?: Maybe<Seasons_Mutation_Response>;
  /** insert a single row into the table: "seasons" */
  insert_seasons_one?: Maybe<Seasons>;
  /** update data of the table: "computed_listing_info" */
  update_computed_listing_info?: Maybe<Computed_Listing_Info_Mutation_Response>;
  /** update data of the table: "course_flags" */
  update_course_flags?: Maybe<Course_Flags_Mutation_Response>;
  /** update single row of the table: "course_flags" */
  update_course_flags_by_pk?: Maybe<Course_Flags>;
  /** update data of the table: "course_professors" */
  update_course_professors?: Maybe<Course_Professors_Mutation_Response>;
  /** update single row of the table: "course_professors" */
  update_course_professors_by_pk?: Maybe<Course_Professors>;
  /** update data of the table: "courses" */
  update_courses?: Maybe<Courses_Mutation_Response>;
  /** update single row of the table: "courses" */
  update_courses_by_pk?: Maybe<Courses>;
  /** update data of the table: "demand_statistics" */
  update_demand_statistics?: Maybe<Demand_Statistics_Mutation_Response>;
  /** update single row of the table: "demand_statistics" */
  update_demand_statistics_by_pk?: Maybe<Demand_Statistics>;
  /** update data of the table: "evaluation_narratives" */
  update_evaluation_narratives?: Maybe<Evaluation_Narratives_Mutation_Response>;
  /** update single row of the table: "evaluation_narratives" */
  update_evaluation_narratives_by_pk?: Maybe<Evaluation_Narratives>;
  /** update data of the table: "evaluation_questions" */
  update_evaluation_questions?: Maybe<Evaluation_Questions_Mutation_Response>;
  /** update single row of the table: "evaluation_questions" */
  update_evaluation_questions_by_pk?: Maybe<Evaluation_Questions>;
  /** update data of the table: "evaluation_ratings" */
  update_evaluation_ratings?: Maybe<Evaluation_Ratings_Mutation_Response>;
  /** update single row of the table: "evaluation_ratings" */
  update_evaluation_ratings_by_pk?: Maybe<Evaluation_Ratings>;
  /** update data of the table: "evaluation_statistics" */
  update_evaluation_statistics?: Maybe<Evaluation_Statistics_Mutation_Response>;
  /** update single row of the table: "evaluation_statistics" */
  update_evaluation_statistics_by_pk?: Maybe<Evaluation_Statistics>;
  /** update data of the table: "flags" */
  update_flags?: Maybe<Flags_Mutation_Response>;
  /** update single row of the table: "flags" */
  update_flags_by_pk?: Maybe<Flags>;
  /** update data of the table: "listings" */
  update_listings?: Maybe<Listings_Mutation_Response>;
  /** update single row of the table: "listings" */
  update_listings_by_pk?: Maybe<Listings>;
  /** update data of the table: "professors" */
  update_professors?: Maybe<Professors_Mutation_Response>;
  /** update single row of the table: "professors" */
  update_professors_by_pk?: Maybe<Professors>;
  /** update data of the table: "seasons" */
  update_seasons?: Maybe<Seasons_Mutation_Response>;
  /** update single row of the table: "seasons" */
  update_seasons_by_pk?: Maybe<Seasons>;
};


/** mutation root */
export type Mutation_RootDelete_Computed_Listing_InfoArgs = {
  where: Computed_Listing_Info_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_FlagsArgs = {
  where: Course_Flags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Flags_By_PkArgs = {
  course_id: Scalars['Int'];
  flag_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Course_ProfessorsArgs = {
  where: Course_Professors_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Course_Professors_By_PkArgs = {
  course_id: Scalars['Int'];
  professor_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_CoursesArgs = {
  where: Courses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Courses_By_PkArgs = {
  course_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Demand_StatisticsArgs = {
  where: Demand_Statistics_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Demand_Statistics_By_PkArgs = {
  course_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Evaluation_NarrativesArgs = {
  where: Evaluation_Narratives_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Evaluation_Narratives_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Evaluation_QuestionsArgs = {
  where: Evaluation_Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Evaluation_Questions_By_PkArgs = {
  question_code: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Evaluation_RatingsArgs = {
  where: Evaluation_Ratings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Evaluation_Ratings_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Evaluation_StatisticsArgs = {
  where: Evaluation_Statistics_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Evaluation_Statistics_By_PkArgs = {
  course_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_FlagsArgs = {
  where: Flags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Flags_By_PkArgs = {
  flag_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_ListingsArgs = {
  where: Listings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Listings_By_PkArgs = {
  listing_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_ProfessorsArgs = {
  where: Professors_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Professors_By_PkArgs = {
  professor_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_SeasonsArgs = {
  where: Seasons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Seasons_By_PkArgs = {
  season_code: Scalars['String'];
};


/** mutation root */
export type Mutation_RootInsert_Computed_Listing_InfoArgs = {
  objects: Array<Computed_Listing_Info_Insert_Input>;
  on_conflict?: Maybe<Computed_Listing_Info_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Computed_Listing_Info_OneArgs = {
  object: Computed_Listing_Info_Insert_Input;
  on_conflict?: Maybe<Computed_Listing_Info_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_FlagsArgs = {
  objects: Array<Course_Flags_Insert_Input>;
  on_conflict?: Maybe<Course_Flags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Flags_OneArgs = {
  object: Course_Flags_Insert_Input;
  on_conflict?: Maybe<Course_Flags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_ProfessorsArgs = {
  objects: Array<Course_Professors_Insert_Input>;
  on_conflict?: Maybe<Course_Professors_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Course_Professors_OneArgs = {
  object: Course_Professors_Insert_Input;
  on_conflict?: Maybe<Course_Professors_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CoursesArgs = {
  objects: Array<Courses_Insert_Input>;
  on_conflict?: Maybe<Courses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Courses_OneArgs = {
  object: Courses_Insert_Input;
  on_conflict?: Maybe<Courses_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Demand_StatisticsArgs = {
  objects: Array<Demand_Statistics_Insert_Input>;
  on_conflict?: Maybe<Demand_Statistics_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Demand_Statistics_OneArgs = {
  object: Demand_Statistics_Insert_Input;
  on_conflict?: Maybe<Demand_Statistics_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Evaluation_NarrativesArgs = {
  objects: Array<Evaluation_Narratives_Insert_Input>;
  on_conflict?: Maybe<Evaluation_Narratives_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Evaluation_Narratives_OneArgs = {
  object: Evaluation_Narratives_Insert_Input;
  on_conflict?: Maybe<Evaluation_Narratives_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Evaluation_QuestionsArgs = {
  objects: Array<Evaluation_Questions_Insert_Input>;
  on_conflict?: Maybe<Evaluation_Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Evaluation_Questions_OneArgs = {
  object: Evaluation_Questions_Insert_Input;
  on_conflict?: Maybe<Evaluation_Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Evaluation_RatingsArgs = {
  objects: Array<Evaluation_Ratings_Insert_Input>;
  on_conflict?: Maybe<Evaluation_Ratings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Evaluation_Ratings_OneArgs = {
  object: Evaluation_Ratings_Insert_Input;
  on_conflict?: Maybe<Evaluation_Ratings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Evaluation_StatisticsArgs = {
  objects: Array<Evaluation_Statistics_Insert_Input>;
  on_conflict?: Maybe<Evaluation_Statistics_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Evaluation_Statistics_OneArgs = {
  object: Evaluation_Statistics_Insert_Input;
  on_conflict?: Maybe<Evaluation_Statistics_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FlagsArgs = {
  objects: Array<Flags_Insert_Input>;
  on_conflict?: Maybe<Flags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Flags_OneArgs = {
  object: Flags_Insert_Input;
  on_conflict?: Maybe<Flags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ListingsArgs = {
  objects: Array<Listings_Insert_Input>;
  on_conflict?: Maybe<Listings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Listings_OneArgs = {
  object: Listings_Insert_Input;
  on_conflict?: Maybe<Listings_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ProfessorsArgs = {
  objects: Array<Professors_Insert_Input>;
  on_conflict?: Maybe<Professors_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Professors_OneArgs = {
  object: Professors_Insert_Input;
  on_conflict?: Maybe<Professors_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_SeasonsArgs = {
  objects: Array<Seasons_Insert_Input>;
  on_conflict?: Maybe<Seasons_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Seasons_OneArgs = {
  object: Seasons_Insert_Input;
  on_conflict?: Maybe<Seasons_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Computed_Listing_InfoArgs = {
  _append?: Maybe<Computed_Listing_Info_Append_Input>;
  _delete_at_path?: Maybe<Computed_Listing_Info_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Computed_Listing_Info_Delete_Elem_Input>;
  _delete_key?: Maybe<Computed_Listing_Info_Delete_Key_Input>;
  _inc?: Maybe<Computed_Listing_Info_Inc_Input>;
  _prepend?: Maybe<Computed_Listing_Info_Prepend_Input>;
  _set?: Maybe<Computed_Listing_Info_Set_Input>;
  where: Computed_Listing_Info_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_FlagsArgs = {
  _inc?: Maybe<Course_Flags_Inc_Input>;
  _set?: Maybe<Course_Flags_Set_Input>;
  where: Course_Flags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Flags_By_PkArgs = {
  _inc?: Maybe<Course_Flags_Inc_Input>;
  _set?: Maybe<Course_Flags_Set_Input>;
  pk_columns: Course_Flags_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Course_ProfessorsArgs = {
  _inc?: Maybe<Course_Professors_Inc_Input>;
  _set?: Maybe<Course_Professors_Set_Input>;
  where: Course_Professors_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Course_Professors_By_PkArgs = {
  _inc?: Maybe<Course_Professors_Inc_Input>;
  _set?: Maybe<Course_Professors_Set_Input>;
  pk_columns: Course_Professors_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_CoursesArgs = {
  _inc?: Maybe<Courses_Inc_Input>;
  _set?: Maybe<Courses_Set_Input>;
  where: Courses_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Courses_By_PkArgs = {
  _inc?: Maybe<Courses_Inc_Input>;
  _set?: Maybe<Courses_Set_Input>;
  pk_columns: Courses_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Demand_StatisticsArgs = {
  _inc?: Maybe<Demand_Statistics_Inc_Input>;
  _set?: Maybe<Demand_Statistics_Set_Input>;
  where: Demand_Statistics_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Demand_Statistics_By_PkArgs = {
  _inc?: Maybe<Demand_Statistics_Inc_Input>;
  _set?: Maybe<Demand_Statistics_Set_Input>;
  pk_columns: Demand_Statistics_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Evaluation_NarrativesArgs = {
  _inc?: Maybe<Evaluation_Narratives_Inc_Input>;
  _set?: Maybe<Evaluation_Narratives_Set_Input>;
  where: Evaluation_Narratives_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Evaluation_Narratives_By_PkArgs = {
  _inc?: Maybe<Evaluation_Narratives_Inc_Input>;
  _set?: Maybe<Evaluation_Narratives_Set_Input>;
  pk_columns: Evaluation_Narratives_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Evaluation_QuestionsArgs = {
  _set?: Maybe<Evaluation_Questions_Set_Input>;
  where: Evaluation_Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Evaluation_Questions_By_PkArgs = {
  _set?: Maybe<Evaluation_Questions_Set_Input>;
  pk_columns: Evaluation_Questions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Evaluation_RatingsArgs = {
  _inc?: Maybe<Evaluation_Ratings_Inc_Input>;
  _set?: Maybe<Evaluation_Ratings_Set_Input>;
  where: Evaluation_Ratings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Evaluation_Ratings_By_PkArgs = {
  _inc?: Maybe<Evaluation_Ratings_Inc_Input>;
  _set?: Maybe<Evaluation_Ratings_Set_Input>;
  pk_columns: Evaluation_Ratings_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Evaluation_StatisticsArgs = {
  _inc?: Maybe<Evaluation_Statistics_Inc_Input>;
  _set?: Maybe<Evaluation_Statistics_Set_Input>;
  where: Evaluation_Statistics_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Evaluation_Statistics_By_PkArgs = {
  _inc?: Maybe<Evaluation_Statistics_Inc_Input>;
  _set?: Maybe<Evaluation_Statistics_Set_Input>;
  pk_columns: Evaluation_Statistics_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_FlagsArgs = {
  _inc?: Maybe<Flags_Inc_Input>;
  _set?: Maybe<Flags_Set_Input>;
  where: Flags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Flags_By_PkArgs = {
  _inc?: Maybe<Flags_Inc_Input>;
  _set?: Maybe<Flags_Set_Input>;
  pk_columns: Flags_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_ListingsArgs = {
  _inc?: Maybe<Listings_Inc_Input>;
  _set?: Maybe<Listings_Set_Input>;
  where: Listings_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Listings_By_PkArgs = {
  _inc?: Maybe<Listings_Inc_Input>;
  _set?: Maybe<Listings_Set_Input>;
  pk_columns: Listings_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_ProfessorsArgs = {
  _inc?: Maybe<Professors_Inc_Input>;
  _set?: Maybe<Professors_Set_Input>;
  where: Professors_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Professors_By_PkArgs = {
  _inc?: Maybe<Professors_Inc_Input>;
  _set?: Maybe<Professors_Set_Input>;
  pk_columns: Professors_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_SeasonsArgs = {
  _inc?: Maybe<Seasons_Inc_Input>;
  _set?: Maybe<Seasons_Set_Input>;
  where: Seasons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Seasons_By_PkArgs = {
  _inc?: Maybe<Seasons_Inc_Input>;
  _set?: Maybe<Seasons_Set_Input>;
  pk_columns: Seasons_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in the ascending order, nulls last */
  Asc = 'asc',
  /** in the ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in the descending order, nulls first */
  Desc = 'desc',
  /** in the descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in the descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "professors" */
export type Professors = {
  __typename?: 'professors';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['float8']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Int']>;
  /** An array relationship */
  course_professors: Array<Course_Professors>;
  /** An aggregated array relationship */
  course_professors_aggregate: Course_Professors_Aggregate;
  /** Email address of the professor */
  email?: Maybe<Scalars['String']>;
  /** Name of the professor */
  name: Scalars['String'];
  /** Professor ID used by Yale OCS */
  ocs_id?: Maybe<Scalars['String']>;
  /** Professor ID */
  professor_id: Scalars['Int'];
};


/** columns and relationships of "professors" */
export type ProfessorsCourse_ProfessorsArgs = {
  distinct_on?: Maybe<Array<Course_Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Professors_Order_By>>;
  where?: Maybe<Course_Professors_Bool_Exp>;
};


/** columns and relationships of "professors" */
export type ProfessorsCourse_Professors_AggregateArgs = {
  distinct_on?: Maybe<Array<Course_Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Professors_Order_By>>;
  where?: Maybe<Course_Professors_Bool_Exp>;
};

/** aggregated selection of "professors" */
export type Professors_Aggregate = {
  __typename?: 'professors_aggregate';
  aggregate?: Maybe<Professors_Aggregate_Fields>;
  nodes: Array<Professors>;
};

/** aggregate fields of "professors" */
export type Professors_Aggregate_Fields = {
  __typename?: 'professors_aggregate_fields';
  avg?: Maybe<Professors_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Professors_Max_Fields>;
  min?: Maybe<Professors_Min_Fields>;
  stddev?: Maybe<Professors_Stddev_Fields>;
  stddev_pop?: Maybe<Professors_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Professors_Stddev_Samp_Fields>;
  sum?: Maybe<Professors_Sum_Fields>;
  var_pop?: Maybe<Professors_Var_Pop_Fields>;
  var_samp?: Maybe<Professors_Var_Samp_Fields>;
  variance?: Maybe<Professors_Variance_Fields>;
};


/** aggregate fields of "professors" */
export type Professors_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Professors_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "professors" */
export type Professors_Aggregate_Order_By = {
  avg?: Maybe<Professors_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Professors_Max_Order_By>;
  min?: Maybe<Professors_Min_Order_By>;
  stddev?: Maybe<Professors_Stddev_Order_By>;
  stddev_pop?: Maybe<Professors_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Professors_Stddev_Samp_Order_By>;
  sum?: Maybe<Professors_Sum_Order_By>;
  var_pop?: Maybe<Professors_Var_Pop_Order_By>;
  var_samp?: Maybe<Professors_Var_Samp_Order_By>;
  variance?: Maybe<Professors_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "professors" */
export type Professors_Arr_Rel_Insert_Input = {
  data: Array<Professors_Insert_Input>;
  on_conflict?: Maybe<Professors_On_Conflict>;
};

/** aggregate avg on columns */
export type Professors_Avg_Fields = {
  __typename?: 'professors_avg_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "professors" */
export type Professors_Avg_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "professors". All fields are combined with a logical 'AND'. */
export type Professors_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Professors_Bool_Exp>>>;
  _not?: Maybe<Professors_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Professors_Bool_Exp>>>;
  average_rating?: Maybe<Float8_Comparison_Exp>;
  average_rating_n?: Maybe<Int_Comparison_Exp>;
  course_professors?: Maybe<Course_Professors_Bool_Exp>;
  email?: Maybe<String_Comparison_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  ocs_id?: Maybe<String_Comparison_Exp>;
  professor_id?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "professors" */
export enum Professors_Constraint {
  /** unique or primary key constraint */
  PkProfessorsStaged = 'pk_professors_staged'
}

/** input type for incrementing integer column in table "professors" */
export type Professors_Inc_Input = {
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "professors" */
export type Professors_Insert_Input = {
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  course_professors?: Maybe<Course_Professors_Arr_Rel_Insert_Input>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ocs_id?: Maybe<Scalars['String']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Professors_Max_Fields = {
  __typename?: 'professors_max_fields';
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ocs_id?: Maybe<Scalars['String']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "professors" */
export type Professors_Max_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  ocs_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Professors_Min_Fields = {
  __typename?: 'professors_min_fields';
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ocs_id?: Maybe<Scalars['String']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "professors" */
export type Professors_Min_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  ocs_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "professors" */
export type Professors_Mutation_Response = {
  __typename?: 'professors_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Professors>;
};

/** input type for inserting object relation for remote table "professors" */
export type Professors_Obj_Rel_Insert_Input = {
  data: Professors_Insert_Input;
  on_conflict?: Maybe<Professors_On_Conflict>;
};

/** on conflict condition type for table "professors" */
export type Professors_On_Conflict = {
  constraint: Professors_Constraint;
  update_columns: Array<Professors_Update_Column>;
  where?: Maybe<Professors_Bool_Exp>;
};

/** ordering options when selecting data from "professors" */
export type Professors_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  course_professors_aggregate?: Maybe<Course_Professors_Aggregate_Order_By>;
  email?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  ocs_id?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "professors" */
export type Professors_Pk_Columns_Input = {
  /** Professor ID */
  professor_id: Scalars['Int'];
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
  OcsId = 'ocs_id',
  /** column name */
  ProfessorId = 'professor_id'
}

/** input type for updating data in table "professors" */
export type Professors_Set_Input = {
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ocs_id?: Maybe<Scalars['String']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Professors_Stddev_Fields = {
  __typename?: 'professors_stddev_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "professors" */
export type Professors_Stddev_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Professors_Stddev_Pop_Fields = {
  __typename?: 'professors_stddev_pop_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "professors" */
export type Professors_Stddev_Pop_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Professors_Stddev_Samp_Fields = {
  __typename?: 'professors_stddev_samp_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "professors" */
export type Professors_Stddev_Samp_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Professors_Sum_Fields = {
  __typename?: 'professors_sum_fields';
  average_rating?: Maybe<Scalars['float8']>;
  average_rating_n?: Maybe<Scalars['Int']>;
  professor_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "professors" */
export type Professors_Sum_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
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
  OcsId = 'ocs_id',
  /** column name */
  ProfessorId = 'professor_id'
}

/** aggregate var_pop on columns */
export type Professors_Var_Pop_Fields = {
  __typename?: 'professors_var_pop_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "professors" */
export type Professors_Var_Pop_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Professors_Var_Samp_Fields = {
  __typename?: 'professors_var_samp_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "professors" */
export type Professors_Var_Samp_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Professors_Variance_Fields = {
  __typename?: 'professors_variance_fields';
  average_rating?: Maybe<Scalars['Float']>;
  average_rating_n?: Maybe<Scalars['Float']>;
  professor_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "professors" */
export type Professors_Variance_Order_By = {
  average_rating?: Maybe<Order_By>;
  average_rating_n?: Maybe<Order_By>;
  professor_id?: Maybe<Order_By>;
};

/** query root */
export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "computed_listing_info" */
  computed_listing_info: Array<Computed_Listing_Info>;
  /** fetch aggregated fields from the table: "computed_listing_info" */
  computed_listing_info_aggregate: Computed_Listing_Info_Aggregate;
  /** fetch data from the table: "course_flags" */
  course_flags: Array<Course_Flags>;
  /** fetch aggregated fields from the table: "course_flags" */
  course_flags_aggregate: Course_Flags_Aggregate;
  /** fetch data from the table: "course_flags" using primary key columns */
  course_flags_by_pk?: Maybe<Course_Flags>;
  /** fetch data from the table: "course_professors" */
  course_professors: Array<Course_Professors>;
  /** fetch aggregated fields from the table: "course_professors" */
  course_professors_aggregate: Course_Professors_Aggregate;
  /** fetch data from the table: "course_professors" using primary key columns */
  course_professors_by_pk?: Maybe<Course_Professors>;
  /** fetch data from the table: "courses" */
  courses: Array<Courses>;
  /** fetch aggregated fields from the table: "courses" */
  courses_aggregate: Courses_Aggregate;
  /** fetch data from the table: "courses" using primary key columns */
  courses_by_pk?: Maybe<Courses>;
  /** fetch data from the table: "demand_statistics" */
  demand_statistics: Array<Demand_Statistics>;
  /** fetch aggregated fields from the table: "demand_statistics" */
  demand_statistics_aggregate: Demand_Statistics_Aggregate;
  /** fetch data from the table: "demand_statistics" using primary key columns */
  demand_statistics_by_pk?: Maybe<Demand_Statistics>;
  /** fetch data from the table: "evaluation_narratives" */
  evaluation_narratives: Array<Evaluation_Narratives>;
  /** fetch aggregated fields from the table: "evaluation_narratives" */
  evaluation_narratives_aggregate: Evaluation_Narratives_Aggregate;
  /** fetch data from the table: "evaluation_narratives" using primary key columns */
  evaluation_narratives_by_pk?: Maybe<Evaluation_Narratives>;
  /** fetch data from the table: "evaluation_questions" */
  evaluation_questions: Array<Evaluation_Questions>;
  /** fetch aggregated fields from the table: "evaluation_questions" */
  evaluation_questions_aggregate: Evaluation_Questions_Aggregate;
  /** fetch data from the table: "evaluation_questions" using primary key columns */
  evaluation_questions_by_pk?: Maybe<Evaluation_Questions>;
  /** fetch data from the table: "evaluation_ratings" */
  evaluation_ratings: Array<Evaluation_Ratings>;
  /** fetch aggregated fields from the table: "evaluation_ratings" */
  evaluation_ratings_aggregate: Evaluation_Ratings_Aggregate;
  /** fetch data from the table: "evaluation_ratings" using primary key columns */
  evaluation_ratings_by_pk?: Maybe<Evaluation_Ratings>;
  /** fetch data from the table: "evaluation_statistics" */
  evaluation_statistics: Array<Evaluation_Statistics>;
  /** fetch aggregated fields from the table: "evaluation_statistics" */
  evaluation_statistics_aggregate: Evaluation_Statistics_Aggregate;
  /** fetch data from the table: "evaluation_statistics" using primary key columns */
  evaluation_statistics_by_pk?: Maybe<Evaluation_Statistics>;
  /** fetch data from the table: "flags" */
  flags: Array<Flags>;
  /** fetch aggregated fields from the table: "flags" */
  flags_aggregate: Flags_Aggregate;
  /** fetch data from the table: "flags" using primary key columns */
  flags_by_pk?: Maybe<Flags>;
  /** fetch data from the table: "listings" */
  listings: Array<Listings>;
  /** fetch aggregated fields from the table: "listings" */
  listings_aggregate: Listings_Aggregate;
  /** fetch data from the table: "listings" using primary key columns */
  listings_by_pk?: Maybe<Listings>;
  /** fetch data from the table: "professors" */
  professors: Array<Professors>;
  /** fetch aggregated fields from the table: "professors" */
  professors_aggregate: Professors_Aggregate;
  /** fetch data from the table: "professors" using primary key columns */
  professors_by_pk?: Maybe<Professors>;
  /** fetch data from the table: "seasons" */
  seasons: Array<Seasons>;
  /** fetch aggregated fields from the table: "seasons" */
  seasons_aggregate: Seasons_Aggregate;
  /** fetch data from the table: "seasons" using primary key columns */
  seasons_by_pk?: Maybe<Seasons>;
};


/** query root */
export type Query_RootComputed_Listing_InfoArgs = {
  distinct_on?: Maybe<Array<Computed_Listing_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Computed_Listing_Info_Order_By>>;
  where?: Maybe<Computed_Listing_Info_Bool_Exp>;
};


/** query root */
export type Query_RootComputed_Listing_Info_AggregateArgs = {
  distinct_on?: Maybe<Array<Computed_Listing_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Computed_Listing_Info_Order_By>>;
  where?: Maybe<Computed_Listing_Info_Bool_Exp>;
};


/** query root */
export type Query_RootCourse_FlagsArgs = {
  distinct_on?: Maybe<Array<Course_Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Flags_Order_By>>;
  where?: Maybe<Course_Flags_Bool_Exp>;
};


/** query root */
export type Query_RootCourse_Flags_AggregateArgs = {
  distinct_on?: Maybe<Array<Course_Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Flags_Order_By>>;
  where?: Maybe<Course_Flags_Bool_Exp>;
};


/** query root */
export type Query_RootCourse_Flags_By_PkArgs = {
  course_id: Scalars['Int'];
  flag_id: Scalars['Int'];
};


/** query root */
export type Query_RootCourse_ProfessorsArgs = {
  distinct_on?: Maybe<Array<Course_Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Professors_Order_By>>;
  where?: Maybe<Course_Professors_Bool_Exp>;
};


/** query root */
export type Query_RootCourse_Professors_AggregateArgs = {
  distinct_on?: Maybe<Array<Course_Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Professors_Order_By>>;
  where?: Maybe<Course_Professors_Bool_Exp>;
};


/** query root */
export type Query_RootCourse_Professors_By_PkArgs = {
  course_id: Scalars['Int'];
  professor_id: Scalars['Int'];
};


/** query root */
export type Query_RootCoursesArgs = {
  distinct_on?: Maybe<Array<Courses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Courses_Order_By>>;
  where?: Maybe<Courses_Bool_Exp>;
};


/** query root */
export type Query_RootCourses_AggregateArgs = {
  distinct_on?: Maybe<Array<Courses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Courses_Order_By>>;
  where?: Maybe<Courses_Bool_Exp>;
};


/** query root */
export type Query_RootCourses_By_PkArgs = {
  course_id: Scalars['Int'];
};


/** query root */
export type Query_RootDemand_StatisticsArgs = {
  distinct_on?: Maybe<Array<Demand_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Demand_Statistics_Order_By>>;
  where?: Maybe<Demand_Statistics_Bool_Exp>;
};


/** query root */
export type Query_RootDemand_Statistics_AggregateArgs = {
  distinct_on?: Maybe<Array<Demand_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Demand_Statistics_Order_By>>;
  where?: Maybe<Demand_Statistics_Bool_Exp>;
};


/** query root */
export type Query_RootDemand_Statistics_By_PkArgs = {
  course_id: Scalars['Int'];
};


/** query root */
export type Query_RootEvaluation_NarrativesArgs = {
  distinct_on?: Maybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Narratives_Order_By>>;
  where?: Maybe<Evaluation_Narratives_Bool_Exp>;
};


/** query root */
export type Query_RootEvaluation_Narratives_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Narratives_Order_By>>;
  where?: Maybe<Evaluation_Narratives_Bool_Exp>;
};


/** query root */
export type Query_RootEvaluation_Narratives_By_PkArgs = {
  id: Scalars['Int'];
};


/** query root */
export type Query_RootEvaluation_QuestionsArgs = {
  distinct_on?: Maybe<Array<Evaluation_Questions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Questions_Order_By>>;
  where?: Maybe<Evaluation_Questions_Bool_Exp>;
};


/** query root */
export type Query_RootEvaluation_Questions_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Questions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Questions_Order_By>>;
  where?: Maybe<Evaluation_Questions_Bool_Exp>;
};


/** query root */
export type Query_RootEvaluation_Questions_By_PkArgs = {
  question_code: Scalars['String'];
};


/** query root */
export type Query_RootEvaluation_RatingsArgs = {
  distinct_on?: Maybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Ratings_Order_By>>;
  where?: Maybe<Evaluation_Ratings_Bool_Exp>;
};


/** query root */
export type Query_RootEvaluation_Ratings_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Ratings_Order_By>>;
  where?: Maybe<Evaluation_Ratings_Bool_Exp>;
};


/** query root */
export type Query_RootEvaluation_Ratings_By_PkArgs = {
  id: Scalars['Int'];
};


/** query root */
export type Query_RootEvaluation_StatisticsArgs = {
  distinct_on?: Maybe<Array<Evaluation_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Statistics_Order_By>>;
  where?: Maybe<Evaluation_Statistics_Bool_Exp>;
};


/** query root */
export type Query_RootEvaluation_Statistics_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Statistics_Order_By>>;
  where?: Maybe<Evaluation_Statistics_Bool_Exp>;
};


/** query root */
export type Query_RootEvaluation_Statistics_By_PkArgs = {
  course_id: Scalars['Int'];
};


/** query root */
export type Query_RootFlagsArgs = {
  distinct_on?: Maybe<Array<Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Flags_Order_By>>;
  where?: Maybe<Flags_Bool_Exp>;
};


/** query root */
export type Query_RootFlags_AggregateArgs = {
  distinct_on?: Maybe<Array<Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Flags_Order_By>>;
  where?: Maybe<Flags_Bool_Exp>;
};


/** query root */
export type Query_RootFlags_By_PkArgs = {
  flag_id: Scalars['Int'];
};


/** query root */
export type Query_RootListingsArgs = {
  distinct_on?: Maybe<Array<Listings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Listings_Order_By>>;
  where?: Maybe<Listings_Bool_Exp>;
};


/** query root */
export type Query_RootListings_AggregateArgs = {
  distinct_on?: Maybe<Array<Listings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Listings_Order_By>>;
  where?: Maybe<Listings_Bool_Exp>;
};


/** query root */
export type Query_RootListings_By_PkArgs = {
  listing_id: Scalars['Int'];
};


/** query root */
export type Query_RootProfessorsArgs = {
  distinct_on?: Maybe<Array<Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Professors_Order_By>>;
  where?: Maybe<Professors_Bool_Exp>;
};


/** query root */
export type Query_RootProfessors_AggregateArgs = {
  distinct_on?: Maybe<Array<Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Professors_Order_By>>;
  where?: Maybe<Professors_Bool_Exp>;
};


/** query root */
export type Query_RootProfessors_By_PkArgs = {
  professor_id: Scalars['Int'];
};


/** query root */
export type Query_RootSeasonsArgs = {
  distinct_on?: Maybe<Array<Seasons_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Seasons_Order_By>>;
  where?: Maybe<Seasons_Bool_Exp>;
};


/** query root */
export type Query_RootSeasons_AggregateArgs = {
  distinct_on?: Maybe<Array<Seasons_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Seasons_Order_By>>;
  where?: Maybe<Seasons_Bool_Exp>;
};


/** query root */
export type Query_RootSeasons_By_PkArgs = {
  season_code: Scalars['String'];
};

/** columns and relationships of "seasons" */
export type Seasons = {
  __typename?: 'seasons';
  /** An array relationship */
  courses: Array<Courses>;
  /** An aggregated array relationship */
  courses_aggregate: Courses_Aggregate;
  /** An array relationship */
  listings: Array<Listings>;
  /** An aggregated array relationship */
  listings_aggregate: Listings_Aggregate;
  /** Season code (e.g. '202001') */
  season_code: Scalars['String'];
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term?: Maybe<Scalars['String']>;
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Int']>;
};


/** columns and relationships of "seasons" */
export type SeasonsCoursesArgs = {
  distinct_on?: Maybe<Array<Courses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Courses_Order_By>>;
  where?: Maybe<Courses_Bool_Exp>;
};


/** columns and relationships of "seasons" */
export type SeasonsCourses_AggregateArgs = {
  distinct_on?: Maybe<Array<Courses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Courses_Order_By>>;
  where?: Maybe<Courses_Bool_Exp>;
};


/** columns and relationships of "seasons" */
export type SeasonsListingsArgs = {
  distinct_on?: Maybe<Array<Listings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Listings_Order_By>>;
  where?: Maybe<Listings_Bool_Exp>;
};


/** columns and relationships of "seasons" */
export type SeasonsListings_AggregateArgs = {
  distinct_on?: Maybe<Array<Listings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Listings_Order_By>>;
  where?: Maybe<Listings_Bool_Exp>;
};

/** aggregated selection of "seasons" */
export type Seasons_Aggregate = {
  __typename?: 'seasons_aggregate';
  aggregate?: Maybe<Seasons_Aggregate_Fields>;
  nodes: Array<Seasons>;
};

/** aggregate fields of "seasons" */
export type Seasons_Aggregate_Fields = {
  __typename?: 'seasons_aggregate_fields';
  avg?: Maybe<Seasons_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Seasons_Max_Fields>;
  min?: Maybe<Seasons_Min_Fields>;
  stddev?: Maybe<Seasons_Stddev_Fields>;
  stddev_pop?: Maybe<Seasons_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Seasons_Stddev_Samp_Fields>;
  sum?: Maybe<Seasons_Sum_Fields>;
  var_pop?: Maybe<Seasons_Var_Pop_Fields>;
  var_samp?: Maybe<Seasons_Var_Samp_Fields>;
  variance?: Maybe<Seasons_Variance_Fields>;
};


/** aggregate fields of "seasons" */
export type Seasons_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Seasons_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "seasons" */
export type Seasons_Aggregate_Order_By = {
  avg?: Maybe<Seasons_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Seasons_Max_Order_By>;
  min?: Maybe<Seasons_Min_Order_By>;
  stddev?: Maybe<Seasons_Stddev_Order_By>;
  stddev_pop?: Maybe<Seasons_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Seasons_Stddev_Samp_Order_By>;
  sum?: Maybe<Seasons_Sum_Order_By>;
  var_pop?: Maybe<Seasons_Var_Pop_Order_By>;
  var_samp?: Maybe<Seasons_Var_Samp_Order_By>;
  variance?: Maybe<Seasons_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "seasons" */
export type Seasons_Arr_Rel_Insert_Input = {
  data: Array<Seasons_Insert_Input>;
  on_conflict?: Maybe<Seasons_On_Conflict>;
};

/** aggregate avg on columns */
export type Seasons_Avg_Fields = {
  __typename?: 'seasons_avg_fields';
  year?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "seasons" */
export type Seasons_Avg_Order_By = {
  year?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "seasons". All fields are combined with a logical 'AND'. */
export type Seasons_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Seasons_Bool_Exp>>>;
  _not?: Maybe<Seasons_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Seasons_Bool_Exp>>>;
  courses?: Maybe<Courses_Bool_Exp>;
  listings?: Maybe<Listings_Bool_Exp>;
  season_code?: Maybe<String_Comparison_Exp>;
  term?: Maybe<String_Comparison_Exp>;
  year?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "seasons" */
export enum Seasons_Constraint {
  /** unique or primary key constraint */
  PkSeasonsStaged = 'pk_seasons_staged'
}

/** input type for incrementing integer column in table "seasons" */
export type Seasons_Inc_Input = {
  year?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "seasons" */
export type Seasons_Insert_Input = {
  courses?: Maybe<Courses_Arr_Rel_Insert_Input>;
  listings?: Maybe<Listings_Arr_Rel_Insert_Input>;
  season_code?: Maybe<Scalars['String']>;
  term?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Seasons_Max_Fields = {
  __typename?: 'seasons_max_fields';
  season_code?: Maybe<Scalars['String']>;
  term?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "seasons" */
export type Seasons_Max_Order_By = {
  season_code?: Maybe<Order_By>;
  term?: Maybe<Order_By>;
  year?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Seasons_Min_Fields = {
  __typename?: 'seasons_min_fields';
  season_code?: Maybe<Scalars['String']>;
  term?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "seasons" */
export type Seasons_Min_Order_By = {
  season_code?: Maybe<Order_By>;
  term?: Maybe<Order_By>;
  year?: Maybe<Order_By>;
};

/** response of any mutation on the table "seasons" */
export type Seasons_Mutation_Response = {
  __typename?: 'seasons_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Seasons>;
};

/** input type for inserting object relation for remote table "seasons" */
export type Seasons_Obj_Rel_Insert_Input = {
  data: Seasons_Insert_Input;
  on_conflict?: Maybe<Seasons_On_Conflict>;
};

/** on conflict condition type for table "seasons" */
export type Seasons_On_Conflict = {
  constraint: Seasons_Constraint;
  update_columns: Array<Seasons_Update_Column>;
  where?: Maybe<Seasons_Bool_Exp>;
};

/** ordering options when selecting data from "seasons" */
export type Seasons_Order_By = {
  courses_aggregate?: Maybe<Courses_Aggregate_Order_By>;
  listings_aggregate?: Maybe<Listings_Aggregate_Order_By>;
  season_code?: Maybe<Order_By>;
  term?: Maybe<Order_By>;
  year?: Maybe<Order_By>;
};

/** primary key columns input for table: "seasons" */
export type Seasons_Pk_Columns_Input = {
  /** Season code (e.g. '202001') */
  season_code: Scalars['String'];
};

/** select columns of table "seasons" */
export enum Seasons_Select_Column {
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Term = 'term',
  /** column name */
  Year = 'year'
}

/** input type for updating data in table "seasons" */
export type Seasons_Set_Input = {
  season_code?: Maybe<Scalars['String']>;
  term?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Seasons_Stddev_Fields = {
  __typename?: 'seasons_stddev_fields';
  year?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "seasons" */
export type Seasons_Stddev_Order_By = {
  year?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Seasons_Stddev_Pop_Fields = {
  __typename?: 'seasons_stddev_pop_fields';
  year?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "seasons" */
export type Seasons_Stddev_Pop_Order_By = {
  year?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Seasons_Stddev_Samp_Fields = {
  __typename?: 'seasons_stddev_samp_fields';
  year?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "seasons" */
export type Seasons_Stddev_Samp_Order_By = {
  year?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Seasons_Sum_Fields = {
  __typename?: 'seasons_sum_fields';
  year?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "seasons" */
export type Seasons_Sum_Order_By = {
  year?: Maybe<Order_By>;
};

/** update columns of table "seasons" */
export enum Seasons_Update_Column {
  /** column name */
  SeasonCode = 'season_code',
  /** column name */
  Term = 'term',
  /** column name */
  Year = 'year'
}

/** aggregate var_pop on columns */
export type Seasons_Var_Pop_Fields = {
  __typename?: 'seasons_var_pop_fields';
  year?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "seasons" */
export type Seasons_Var_Pop_Order_By = {
  year?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Seasons_Var_Samp_Fields = {
  __typename?: 'seasons_var_samp_fields';
  year?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "seasons" */
export type Seasons_Var_Samp_Order_By = {
  year?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Seasons_Variance_Fields = {
  __typename?: 'seasons_variance_fields';
  year?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "seasons" */
export type Seasons_Variance_Order_By = {
  year?: Maybe<Order_By>;
};

/** subscription root */
export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "computed_listing_info" */
  computed_listing_info: Array<Computed_Listing_Info>;
  /** fetch aggregated fields from the table: "computed_listing_info" */
  computed_listing_info_aggregate: Computed_Listing_Info_Aggregate;
  /** fetch data from the table: "course_flags" */
  course_flags: Array<Course_Flags>;
  /** fetch aggregated fields from the table: "course_flags" */
  course_flags_aggregate: Course_Flags_Aggregate;
  /** fetch data from the table: "course_flags" using primary key columns */
  course_flags_by_pk?: Maybe<Course_Flags>;
  /** fetch data from the table: "course_professors" */
  course_professors: Array<Course_Professors>;
  /** fetch aggregated fields from the table: "course_professors" */
  course_professors_aggregate: Course_Professors_Aggregate;
  /** fetch data from the table: "course_professors" using primary key columns */
  course_professors_by_pk?: Maybe<Course_Professors>;
  /** fetch data from the table: "courses" */
  courses: Array<Courses>;
  /** fetch aggregated fields from the table: "courses" */
  courses_aggregate: Courses_Aggregate;
  /** fetch data from the table: "courses" using primary key columns */
  courses_by_pk?: Maybe<Courses>;
  /** fetch data from the table: "demand_statistics" */
  demand_statistics: Array<Demand_Statistics>;
  /** fetch aggregated fields from the table: "demand_statistics" */
  demand_statistics_aggregate: Demand_Statistics_Aggregate;
  /** fetch data from the table: "demand_statistics" using primary key columns */
  demand_statistics_by_pk?: Maybe<Demand_Statistics>;
  /** fetch data from the table: "evaluation_narratives" */
  evaluation_narratives: Array<Evaluation_Narratives>;
  /** fetch aggregated fields from the table: "evaluation_narratives" */
  evaluation_narratives_aggregate: Evaluation_Narratives_Aggregate;
  /** fetch data from the table: "evaluation_narratives" using primary key columns */
  evaluation_narratives_by_pk?: Maybe<Evaluation_Narratives>;
  /** fetch data from the table: "evaluation_questions" */
  evaluation_questions: Array<Evaluation_Questions>;
  /** fetch aggregated fields from the table: "evaluation_questions" */
  evaluation_questions_aggregate: Evaluation_Questions_Aggregate;
  /** fetch data from the table: "evaluation_questions" using primary key columns */
  evaluation_questions_by_pk?: Maybe<Evaluation_Questions>;
  /** fetch data from the table: "evaluation_ratings" */
  evaluation_ratings: Array<Evaluation_Ratings>;
  /** fetch aggregated fields from the table: "evaluation_ratings" */
  evaluation_ratings_aggregate: Evaluation_Ratings_Aggregate;
  /** fetch data from the table: "evaluation_ratings" using primary key columns */
  evaluation_ratings_by_pk?: Maybe<Evaluation_Ratings>;
  /** fetch data from the table: "evaluation_statistics" */
  evaluation_statistics: Array<Evaluation_Statistics>;
  /** fetch aggregated fields from the table: "evaluation_statistics" */
  evaluation_statistics_aggregate: Evaluation_Statistics_Aggregate;
  /** fetch data from the table: "evaluation_statistics" using primary key columns */
  evaluation_statistics_by_pk?: Maybe<Evaluation_Statistics>;
  /** fetch data from the table: "flags" */
  flags: Array<Flags>;
  /** fetch aggregated fields from the table: "flags" */
  flags_aggregate: Flags_Aggregate;
  /** fetch data from the table: "flags" using primary key columns */
  flags_by_pk?: Maybe<Flags>;
  /** fetch data from the table: "listings" */
  listings: Array<Listings>;
  /** fetch aggregated fields from the table: "listings" */
  listings_aggregate: Listings_Aggregate;
  /** fetch data from the table: "listings" using primary key columns */
  listings_by_pk?: Maybe<Listings>;
  /** fetch data from the table: "professors" */
  professors: Array<Professors>;
  /** fetch aggregated fields from the table: "professors" */
  professors_aggregate: Professors_Aggregate;
  /** fetch data from the table: "professors" using primary key columns */
  professors_by_pk?: Maybe<Professors>;
  /** fetch data from the table: "seasons" */
  seasons: Array<Seasons>;
  /** fetch aggregated fields from the table: "seasons" */
  seasons_aggregate: Seasons_Aggregate;
  /** fetch data from the table: "seasons" using primary key columns */
  seasons_by_pk?: Maybe<Seasons>;
};


/** subscription root */
export type Subscription_RootComputed_Listing_InfoArgs = {
  distinct_on?: Maybe<Array<Computed_Listing_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Computed_Listing_Info_Order_By>>;
  where?: Maybe<Computed_Listing_Info_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootComputed_Listing_Info_AggregateArgs = {
  distinct_on?: Maybe<Array<Computed_Listing_Info_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Computed_Listing_Info_Order_By>>;
  where?: Maybe<Computed_Listing_Info_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCourse_FlagsArgs = {
  distinct_on?: Maybe<Array<Course_Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Flags_Order_By>>;
  where?: Maybe<Course_Flags_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCourse_Flags_AggregateArgs = {
  distinct_on?: Maybe<Array<Course_Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Flags_Order_By>>;
  where?: Maybe<Course_Flags_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCourse_Flags_By_PkArgs = {
  course_id: Scalars['Int'];
  flag_id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootCourse_ProfessorsArgs = {
  distinct_on?: Maybe<Array<Course_Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Professors_Order_By>>;
  where?: Maybe<Course_Professors_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCourse_Professors_AggregateArgs = {
  distinct_on?: Maybe<Array<Course_Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Course_Professors_Order_By>>;
  where?: Maybe<Course_Professors_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCourse_Professors_By_PkArgs = {
  course_id: Scalars['Int'];
  professor_id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootCoursesArgs = {
  distinct_on?: Maybe<Array<Courses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Courses_Order_By>>;
  where?: Maybe<Courses_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCourses_AggregateArgs = {
  distinct_on?: Maybe<Array<Courses_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Courses_Order_By>>;
  where?: Maybe<Courses_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootCourses_By_PkArgs = {
  course_id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootDemand_StatisticsArgs = {
  distinct_on?: Maybe<Array<Demand_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Demand_Statistics_Order_By>>;
  where?: Maybe<Demand_Statistics_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootDemand_Statistics_AggregateArgs = {
  distinct_on?: Maybe<Array<Demand_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Demand_Statistics_Order_By>>;
  where?: Maybe<Demand_Statistics_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootDemand_Statistics_By_PkArgs = {
  course_id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootEvaluation_NarrativesArgs = {
  distinct_on?: Maybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Narratives_Order_By>>;
  where?: Maybe<Evaluation_Narratives_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEvaluation_Narratives_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Narratives_Order_By>>;
  where?: Maybe<Evaluation_Narratives_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEvaluation_Narratives_By_PkArgs = {
  id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootEvaluation_QuestionsArgs = {
  distinct_on?: Maybe<Array<Evaluation_Questions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Questions_Order_By>>;
  where?: Maybe<Evaluation_Questions_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEvaluation_Questions_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Questions_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Questions_Order_By>>;
  where?: Maybe<Evaluation_Questions_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEvaluation_Questions_By_PkArgs = {
  question_code: Scalars['String'];
};


/** subscription root */
export type Subscription_RootEvaluation_RatingsArgs = {
  distinct_on?: Maybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Ratings_Order_By>>;
  where?: Maybe<Evaluation_Ratings_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEvaluation_Ratings_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Ratings_Order_By>>;
  where?: Maybe<Evaluation_Ratings_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEvaluation_Ratings_By_PkArgs = {
  id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootEvaluation_StatisticsArgs = {
  distinct_on?: Maybe<Array<Evaluation_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Statistics_Order_By>>;
  where?: Maybe<Evaluation_Statistics_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEvaluation_Statistics_AggregateArgs = {
  distinct_on?: Maybe<Array<Evaluation_Statistics_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Evaluation_Statistics_Order_By>>;
  where?: Maybe<Evaluation_Statistics_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootEvaluation_Statistics_By_PkArgs = {
  course_id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootFlagsArgs = {
  distinct_on?: Maybe<Array<Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Flags_Order_By>>;
  where?: Maybe<Flags_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootFlags_AggregateArgs = {
  distinct_on?: Maybe<Array<Flags_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Flags_Order_By>>;
  where?: Maybe<Flags_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootFlags_By_PkArgs = {
  flag_id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootListingsArgs = {
  distinct_on?: Maybe<Array<Listings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Listings_Order_By>>;
  where?: Maybe<Listings_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootListings_AggregateArgs = {
  distinct_on?: Maybe<Array<Listings_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Listings_Order_By>>;
  where?: Maybe<Listings_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootListings_By_PkArgs = {
  listing_id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootProfessorsArgs = {
  distinct_on?: Maybe<Array<Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Professors_Order_By>>;
  where?: Maybe<Professors_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootProfessors_AggregateArgs = {
  distinct_on?: Maybe<Array<Professors_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Professors_Order_By>>;
  where?: Maybe<Professors_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootProfessors_By_PkArgs = {
  professor_id: Scalars['Int'];
};


/** subscription root */
export type Subscription_RootSeasonsArgs = {
  distinct_on?: Maybe<Array<Seasons_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Seasons_Order_By>>;
  where?: Maybe<Seasons_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootSeasons_AggregateArgs = {
  distinct_on?: Maybe<Array<Seasons_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Seasons_Order_By>>;
  where?: Maybe<Seasons_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootSeasons_By_PkArgs = {
  season_code: Scalars['String'];
};

export type ListSeasonsQueryVariables = Exact<{
  season?: Maybe<Array<Scalars['String']>>;
}>;


export type ListSeasonsQuery = { __typename?: 'query_root', seasons: Array<{ __typename?: 'seasons', season_code: string, term?: Maybe<string>, year?: Maybe<number> }> };

export type CatalogBySeasonQueryVariables = Exact<{
  season: Scalars['String'];
}>;


export type CatalogBySeasonQuery = { __typename?: 'query_root', computed_listing_info: Array<{ __typename?: 'computed_listing_info', all_course_codes?: Maybe<any>, areas?: Maybe<any>, average_gut_rating?: Maybe<any>, average_professor?: Maybe<any>, average_rating?: Maybe<any>, average_workload?: Maybe<any>, classnotes?: Maybe<string>, course_code?: Maybe<string>, credits?: Maybe<any>, crn?: Maybe<number>, description?: Maybe<string>, enrolled?: Maybe<number>, extra_info?: Maybe<string>, final_exam?: Maybe<string>, flag_info?: Maybe<any>, fysem?: Maybe<boolean>, last_enrollment?: Maybe<number>, last_enrollment_same_professors?: Maybe<boolean>, listing_id?: Maybe<number>, locations_summary?: Maybe<string>, number?: Maybe<string>, professor_names?: Maybe<any>, regnotes?: Maybe<string>, requirements?: Maybe<string>, rp_attr?: Maybe<string>, school?: Maybe<string>, season_code?: Maybe<string>, section?: Maybe<string>, skills?: Maybe<any>, subject?: Maybe<string>, syllabus_url?: Maybe<string>, times_by_day?: Maybe<any>, times_summary?: Maybe<string>, title?: Maybe<string>, course?: Maybe<{ __typename?: 'courses', average_rating_same_professors?: Maybe<any>, average_workload_same_professors?: Maybe<any> }> }> };

export type SearchAverageAcrossSeasonsQueryVariables = Exact<{
  course_code?: Maybe<Scalars['String']>;
  professor_name?: Maybe<Array<Scalars['String']>>;
}>;


export type SearchAverageAcrossSeasonsQuery = { __typename?: 'query_root', computed_listing_info: Array<{ __typename?: 'computed_listing_info', all_course_codes?: Maybe<any>, areas?: Maybe<any>, average_gut_rating?: Maybe<any>, average_professor?: Maybe<any>, average_rating?: Maybe<any>, average_workload?: Maybe<any>, classnotes?: Maybe<string>, course_code?: Maybe<string>, credits?: Maybe<any>, crn?: Maybe<number>, description?: Maybe<string>, enrolled?: Maybe<number>, extra_info?: Maybe<string>, final_exam?: Maybe<string>, flag_info?: Maybe<any>, fysem?: Maybe<boolean>, last_enrollment?: Maybe<number>, last_enrollment_same_professors?: Maybe<boolean>, listing_id?: Maybe<number>, locations_summary?: Maybe<string>, number?: Maybe<string>, professor_info?: Maybe<any>, professor_names?: Maybe<any>, regnotes?: Maybe<string>, requirements?: Maybe<string>, rp_attr?: Maybe<string>, school?: Maybe<string>, season_code?: Maybe<string>, section?: Maybe<string>, skills?: Maybe<any>, subject?: Maybe<string>, syllabus_url?: Maybe<string>, times_by_day?: Maybe<any>, times_summary?: Maybe<string>, title?: Maybe<string>, course?: Maybe<{ __typename?: 'courses', evaluation_statistics: Array<{ __typename?: 'evaluation_statistics', avg_workload?: Maybe<any>, avg_rating?: Maybe<any> }> }> }> };

export type SearchEvaluationNarrativesQueryVariables = Exact<{
  season_code?: Maybe<Scalars['String']>;
  course_code?: Maybe<Scalars['String']>;
}>;


export type SearchEvaluationNarrativesQuery = { __typename?: 'query_root', computed_listing_info: Array<{ __typename?: 'computed_listing_info', crn?: Maybe<number>, course?: Maybe<{ __typename?: 'courses', evaluation_narratives_aggregate: { __typename?: 'evaluation_narratives_aggregate', nodes: Array<{ __typename?: 'evaluation_narratives', comment?: Maybe<string>, evaluation_question: { __typename?: 'evaluation_questions', question_text?: Maybe<string> } }> }, evaluation_ratings: Array<{ __typename?: 'evaluation_ratings', rating?: Maybe<any>, evaluation_question: { __typename?: 'evaluation_questions', question_text?: Maybe<string> } }> }> }> };


export const ListSeasonsDocument = gql`
    query listSeasons($season: [String!]) {
  seasons {
    season_code
    term
    year
  }
}
    `;

/**
 * __useListSeasonsQuery__
 *
 * To run a query within a React component, call `useListSeasonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListSeasonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListSeasonsQuery({
 *   variables: {
 *      season: // value for 'season'
 *   },
 * });
 */
export function useListSeasonsQuery(baseOptions?: Apollo.QueryHookOptions<ListSeasonsQuery, ListSeasonsQueryVariables>) {
        return Apollo.useQuery<ListSeasonsQuery, ListSeasonsQueryVariables>(ListSeasonsDocument, baseOptions);
      }
export function useListSeasonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListSeasonsQuery, ListSeasonsQueryVariables>) {
          return Apollo.useLazyQuery<ListSeasonsQuery, ListSeasonsQueryVariables>(ListSeasonsDocument, baseOptions);
        }
export type ListSeasonsQueryHookResult = ReturnType<typeof useListSeasonsQuery>;
export type ListSeasonsLazyQueryHookResult = ReturnType<typeof useListSeasonsLazyQuery>;
export type ListSeasonsQueryResult = Apollo.QueryResult<ListSeasonsQuery, ListSeasonsQueryVariables>;
export const CatalogBySeasonDocument = gql`
    query catalogBySeason($season: String!) {
  computed_listing_info(where: {season_code: {_eq: $season}}) {
    all_course_codes
    areas
    average_gut_rating
    average_professor
    average_rating
    average_workload
    course {
      average_rating_same_professors
      average_workload_same_professors
    }
    classnotes
    course_code
    credits
    crn
    description
    enrolled
    extra_info
    final_exam
    flag_info
    fysem
    last_enrollment
    last_enrollment_same_professors
    listing_id
    locations_summary
    number
    professor_names
    regnotes
    requirements
    rp_attr
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
}
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
export function useCatalogBySeasonQuery(baseOptions: Apollo.QueryHookOptions<CatalogBySeasonQuery, CatalogBySeasonQueryVariables>) {
        return Apollo.useQuery<CatalogBySeasonQuery, CatalogBySeasonQueryVariables>(CatalogBySeasonDocument, baseOptions);
      }
export function useCatalogBySeasonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CatalogBySeasonQuery, CatalogBySeasonQueryVariables>) {
          return Apollo.useLazyQuery<CatalogBySeasonQuery, CatalogBySeasonQueryVariables>(CatalogBySeasonDocument, baseOptions);
        }
export type CatalogBySeasonQueryHookResult = ReturnType<typeof useCatalogBySeasonQuery>;
export type CatalogBySeasonLazyQueryHookResult = ReturnType<typeof useCatalogBySeasonLazyQuery>;
export type CatalogBySeasonQueryResult = Apollo.QueryResult<CatalogBySeasonQuery, CatalogBySeasonQueryVariables>;
export const SearchAverageAcrossSeasonsDocument = gql`
    query SearchAverageAcrossSeasons($course_code: String, $professor_name: [String!]) {
  computed_listing_info(
    where: {_or: [{course_code: {_eq: $course_code}}, {professor_names: {_has_keys_any: $professor_name}}]}
  ) {
    course {
      evaluation_statistics {
        avg_workload
        avg_rating
      }
    }
    all_course_codes
    areas
    average_gut_rating
    average_professor
    average_rating
    average_workload
    classnotes
    course_code
    credits
    crn
    description
    enrolled
    extra_info
    final_exam
    flag_info
    fysem
    last_enrollment
    last_enrollment_same_professors
    listing_id
    locations_summary
    number
    professor_info
    professor_names
    regnotes
    requirements
    rp_attr
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
}
    `;

/**
 * __useSearchAverageAcrossSeasonsQuery__
 *
 * To run a query within a React component, call `useSearchAverageAcrossSeasonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAverageAcrossSeasonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAverageAcrossSeasonsQuery({
 *   variables: {
 *      course_code: // value for 'course_code'
 *      professor_name: // value for 'professor_name'
 *   },
 * });
 */
export function useSearchAverageAcrossSeasonsQuery(baseOptions?: Apollo.QueryHookOptions<SearchAverageAcrossSeasonsQuery, SearchAverageAcrossSeasonsQueryVariables>) {
        return Apollo.useQuery<SearchAverageAcrossSeasonsQuery, SearchAverageAcrossSeasonsQueryVariables>(SearchAverageAcrossSeasonsDocument, baseOptions);
      }
export function useSearchAverageAcrossSeasonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchAverageAcrossSeasonsQuery, SearchAverageAcrossSeasonsQueryVariables>) {
          return Apollo.useLazyQuery<SearchAverageAcrossSeasonsQuery, SearchAverageAcrossSeasonsQueryVariables>(SearchAverageAcrossSeasonsDocument, baseOptions);
        }
export type SearchAverageAcrossSeasonsQueryHookResult = ReturnType<typeof useSearchAverageAcrossSeasonsQuery>;
export type SearchAverageAcrossSeasonsLazyQueryHookResult = ReturnType<typeof useSearchAverageAcrossSeasonsLazyQuery>;
export type SearchAverageAcrossSeasonsQueryResult = Apollo.QueryResult<SearchAverageAcrossSeasonsQuery, SearchAverageAcrossSeasonsQueryVariables>;
export const SearchEvaluationNarrativesDocument = gql`
    query SearchEvaluationNarratives($season_code: String, $course_code: String) {
  computed_listing_info(
    where: {season_code: {_eq: $season_code}, course_code: {_eq: $course_code}}
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
 *      course_code: // value for 'course_code'
 *   },
 * });
 */
export function useSearchEvaluationNarrativesQuery(baseOptions?: Apollo.QueryHookOptions<SearchEvaluationNarrativesQuery, SearchEvaluationNarrativesQueryVariables>) {
        return Apollo.useQuery<SearchEvaluationNarrativesQuery, SearchEvaluationNarrativesQueryVariables>(SearchEvaluationNarrativesDocument, baseOptions);
      }
export function useSearchEvaluationNarrativesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchEvaluationNarrativesQuery, SearchEvaluationNarrativesQueryVariables>) {
          return Apollo.useLazyQuery<SearchEvaluationNarrativesQuery, SearchEvaluationNarrativesQueryVariables>(SearchEvaluationNarrativesDocument, baseOptions);
        }
export type SearchEvaluationNarrativesQueryHookResult = ReturnType<typeof useSearchEvaluationNarrativesQuery>;
export type SearchEvaluationNarrativesLazyQueryHookResult = ReturnType<typeof useSearchEvaluationNarrativesLazyQuery>;
export type SearchEvaluationNarrativesQueryResult = Apollo.QueryResult<SearchEvaluationNarrativesQuery, SearchEvaluationNarrativesQueryVariables>;