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
  float8: { input: any; output: any };
  jsonb: { input: any; output: any };
  timestamp: { input: any; output: any };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "buildings" */
export type Buildings = {
  __typename?: 'buildings';
  /** Building full name */
  building_name?: Maybe<Scalars['String']['output']>;
  /** Building short code/abbreviation, as in YCS */
  code: Scalars['String']['output'];
  /** An array relationship */
  locations: Array<Locations>;
  /** Yale campus map URL */
  url?: Maybe<Scalars['String']['output']>;
};

/** columns and relationships of "buildings" */
export type BuildingsLocationsArgs = {
  distinct_on?: InputMaybe<Array<Locations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Locations_Order_By>>;
  where?: InputMaybe<Locations_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "buildings". All fields are combined with a logical 'AND'. */
export type Buildings_Bool_Exp = {
  _and?: InputMaybe<Array<Buildings_Bool_Exp>>;
  _not?: InputMaybe<Buildings_Bool_Exp>;
  _or?: InputMaybe<Array<Buildings_Bool_Exp>>;
  building_name?: InputMaybe<String_Comparison_Exp>;
  code?: InputMaybe<String_Comparison_Exp>;
  locations?: InputMaybe<Locations_Bool_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "buildings". */
export type Buildings_Order_By = {
  building_name?: InputMaybe<Order_By>;
  code?: InputMaybe<Order_By>;
  locations_aggregate?: InputMaybe<Locations_Aggregate_Order_By>;
  url?: InputMaybe<Order_By>;
};

/** select columns of table "buildings" */
export enum Buildings_Select_Column {
  /** column name */
  BuildingName = 'building_name',
  /** column name */
  Code = 'code',
  /** column name */
  Url = 'url',
}

/** Streaming cursor of the table "buildings" */
export type Buildings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Buildings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Buildings_Stream_Cursor_Value_Input = {
  /** Building full name */
  building_name?: InputMaybe<Scalars['String']['input']>;
  /** Building short code/abbreviation, as in YCS */
  code?: InputMaybe<Scalars['String']['input']>;
  /** Yale campus map URL */
  url?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "course_flags" */
export type Course_Flags = {
  __typename?: 'course_flags';
  /** An object relationship */
  course: Courses;
  course_id: Scalars['Int']['output'];
  /** An object relationship */
  flag: Flags;
  flag_id: Scalars['Int']['output'];
};

/** aggregated selection of "course_flags" */
export type Course_Flags_Aggregate = {
  __typename?: 'course_flags_aggregate';
  aggregate?: Maybe<Course_Flags_Aggregate_Fields>;
  nodes: Array<Course_Flags>;
};

export type Course_Flags_Aggregate_Bool_Exp = {
  count?: InputMaybe<Course_Flags_Aggregate_Bool_Exp_Count>;
};

export type Course_Flags_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Course_Flags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Course_Flags_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "course_flags" */
export type Course_Flags_Aggregate_Fields = {
  __typename?: 'course_flags_aggregate_fields';
  avg?: Maybe<Course_Flags_Avg_Fields>;
  count: Scalars['Int']['output'];
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
  columns?: InputMaybe<Array<Course_Flags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "course_flags" */
export type Course_Flags_Aggregate_Order_By = {
  avg?: InputMaybe<Course_Flags_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Course_Flags_Max_Order_By>;
  min?: InputMaybe<Course_Flags_Min_Order_By>;
  stddev?: InputMaybe<Course_Flags_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Course_Flags_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Course_Flags_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Course_Flags_Sum_Order_By>;
  var_pop?: InputMaybe<Course_Flags_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Course_Flags_Var_Samp_Order_By>;
  variance?: InputMaybe<Course_Flags_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Course_Flags_Avg_Fields = {
  __typename?: 'course_flags_avg_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "course_flags" */
export type Course_Flags_Avg_Order_By = {
  course_id?: InputMaybe<Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_flags". All fields are combined with a logical 'AND'. */
export type Course_Flags_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Flags_Bool_Exp>>;
  _not?: InputMaybe<Course_Flags_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Flags_Bool_Exp>>;
  course?: InputMaybe<Courses_Bool_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  flag?: InputMaybe<Flags_Bool_Exp>;
  flag_id?: InputMaybe<Int_Comparison_Exp>;
};

/** aggregate max on columns */
export type Course_Flags_Max_Fields = {
  __typename?: 'course_flags_max_fields';
  course_id?: Maybe<Scalars['Int']['output']>;
  flag_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "course_flags" */
export type Course_Flags_Max_Order_By = {
  course_id?: InputMaybe<Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Course_Flags_Min_Fields = {
  __typename?: 'course_flags_min_fields';
  course_id?: Maybe<Scalars['Int']['output']>;
  flag_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "course_flags" */
export type Course_Flags_Min_Order_By = {
  course_id?: InputMaybe<Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "course_flags". */
export type Course_Flags_Order_By = {
  course?: InputMaybe<Courses_Order_By>;
  course_id?: InputMaybe<Order_By>;
  flag?: InputMaybe<Flags_Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** select columns of table "course_flags" */
export enum Course_Flags_Select_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  FlagId = 'flag_id',
}

/** aggregate stddev on columns */
export type Course_Flags_Stddev_Fields = {
  __typename?: 'course_flags_stddev_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "course_flags" */
export type Course_Flags_Stddev_Order_By = {
  course_id?: InputMaybe<Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Course_Flags_Stddev_Pop_Fields = {
  __typename?: 'course_flags_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "course_flags" */
export type Course_Flags_Stddev_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Course_Flags_Stddev_Samp_Fields = {
  __typename?: 'course_flags_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "course_flags" */
export type Course_Flags_Stddev_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "course_flags" */
export type Course_Flags_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Course_Flags_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Course_Flags_Stream_Cursor_Value_Input = {
  course_id?: InputMaybe<Scalars['Int']['input']>;
  flag_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Course_Flags_Sum_Fields = {
  __typename?: 'course_flags_sum_fields';
  course_id?: Maybe<Scalars['Int']['output']>;
  flag_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "course_flags" */
export type Course_Flags_Sum_Order_By = {
  course_id?: InputMaybe<Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Course_Flags_Var_Pop_Fields = {
  __typename?: 'course_flags_var_pop_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "course_flags" */
export type Course_Flags_Var_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Course_Flags_Var_Samp_Fields = {
  __typename?: 'course_flags_var_samp_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "course_flags" */
export type Course_Flags_Var_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Course_Flags_Variance_Fields = {
  __typename?: 'course_flags_variance_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "course_flags" */
export type Course_Flags_Variance_Order_By = {
  course_id?: InputMaybe<Order_By>;
  flag_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "course_meetings" */
export type Course_Meetings = {
  __typename?: 'course_meetings';
  /** An object relationship */
  course?: Maybe<Courses>;
  course_id?: Maybe<Scalars['Int']['output']>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week: Scalars['Int']['output'];
  /** End time of this meeting session */
  end_time: Scalars['String']['output'];
  /** An object relationship */
  location?: Maybe<Locations>;
  /** Location of this meeting session */
  location_id?: Maybe<Scalars['Int']['output']>;
  /** Start time of this meeting session */
  start_time: Scalars['String']['output'];
};

/** order by aggregate values of table "course_meetings" */
export type Course_Meetings_Aggregate_Order_By = {
  avg?: InputMaybe<Course_Meetings_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Course_Meetings_Max_Order_By>;
  min?: InputMaybe<Course_Meetings_Min_Order_By>;
  stddev?: InputMaybe<Course_Meetings_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Course_Meetings_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Course_Meetings_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Course_Meetings_Sum_Order_By>;
  var_pop?: InputMaybe<Course_Meetings_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Course_Meetings_Var_Samp_Order_By>;
  variance?: InputMaybe<Course_Meetings_Variance_Order_By>;
};

/** order by avg() on columns of table "course_meetings" */
export type Course_Meetings_Avg_Order_By = {
  course_id?: InputMaybe<Order_By>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Order_By>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_meetings". All fields are combined with a logical 'AND'. */
export type Course_Meetings_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Meetings_Bool_Exp>>;
  _not?: InputMaybe<Course_Meetings_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Meetings_Bool_Exp>>;
  course?: InputMaybe<Courses_Bool_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  days_of_week?: InputMaybe<Int_Comparison_Exp>;
  end_time?: InputMaybe<String_Comparison_Exp>;
  location?: InputMaybe<Locations_Bool_Exp>;
  location_id?: InputMaybe<Int_Comparison_Exp>;
  start_time?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "course_meetings" */
export type Course_Meetings_Max_Order_By = {
  course_id?: InputMaybe<Order_By>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Order_By>;
  /** End time of this meeting session */
  end_time?: InputMaybe<Order_By>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Order_By>;
  /** Start time of this meeting session */
  start_time?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "course_meetings" */
export type Course_Meetings_Min_Order_By = {
  course_id?: InputMaybe<Order_By>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Order_By>;
  /** End time of this meeting session */
  end_time?: InputMaybe<Order_By>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Order_By>;
  /** Start time of this meeting session */
  start_time?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "course_meetings". */
export type Course_Meetings_Order_By = {
  course?: InputMaybe<Courses_Order_By>;
  course_id?: InputMaybe<Order_By>;
  days_of_week?: InputMaybe<Order_By>;
  end_time?: InputMaybe<Order_By>;
  location?: InputMaybe<Locations_Order_By>;
  location_id?: InputMaybe<Order_By>;
  start_time?: InputMaybe<Order_By>;
};

/** select columns of table "course_meetings" */
export enum Course_Meetings_Select_Column {
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
export type Course_Meetings_Stddev_Order_By = {
  course_id?: InputMaybe<Order_By>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Order_By>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "course_meetings" */
export type Course_Meetings_Stddev_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Order_By>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "course_meetings" */
export type Course_Meetings_Stddev_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Order_By>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "course_meetings" */
export type Course_Meetings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Course_Meetings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Course_Meetings_Stream_Cursor_Value_Input = {
  course_id?: InputMaybe<Scalars['Int']['input']>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Scalars['Int']['input']>;
  /** End time of this meeting session */
  end_time?: InputMaybe<Scalars['String']['input']>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Scalars['Int']['input']>;
  /** Start time of this meeting session */
  start_time?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "course_meetings" */
export type Course_Meetings_Sum_Order_By = {
  course_id?: InputMaybe<Order_By>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Order_By>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "course_meetings" */
export type Course_Meetings_Var_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Order_By>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "course_meetings" */
export type Course_Meetings_Var_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Order_By>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "course_meetings" */
export type Course_Meetings_Variance_Order_By = {
  course_id?: InputMaybe<Order_By>;
  /** Days of the week for this session. It is formed through bitwise joining all the constituents, where (1 = Sunday, 2 = Monday, 4 = Tuesday, ..., 64 = Saturday). For example, if a course meets on Monday, Wednesday, and Friday, the value would be 2 + 8 + 32 = 42. */
  days_of_week?: InputMaybe<Order_By>;
  /** Location of this meeting session */
  location_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "course_professors" */
export type Course_Professors = {
  __typename?: 'course_professors';
  /** An object relationship */
  course: Courses;
  course_id: Scalars['Int']['output'];
  /** An object relationship */
  professor: Professors;
  professor_id: Scalars['Int']['output'];
};

/** aggregated selection of "course_professors" */
export type Course_Professors_Aggregate = {
  __typename?: 'course_professors_aggregate';
  aggregate?: Maybe<Course_Professors_Aggregate_Fields>;
  nodes: Array<Course_Professors>;
};

export type Course_Professors_Aggregate_Bool_Exp = {
  count?: InputMaybe<Course_Professors_Aggregate_Bool_Exp_Count>;
};

export type Course_Professors_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Course_Professors_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Course_Professors_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "course_professors" */
export type Course_Professors_Aggregate_Fields = {
  __typename?: 'course_professors_aggregate_fields';
  avg?: Maybe<Course_Professors_Avg_Fields>;
  count: Scalars['Int']['output'];
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
  columns?: InputMaybe<Array<Course_Professors_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "course_professors" */
export type Course_Professors_Aggregate_Order_By = {
  avg?: InputMaybe<Course_Professors_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Course_Professors_Max_Order_By>;
  min?: InputMaybe<Course_Professors_Min_Order_By>;
  stddev?: InputMaybe<Course_Professors_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Course_Professors_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Course_Professors_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Course_Professors_Sum_Order_By>;
  var_pop?: InputMaybe<Course_Professors_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Course_Professors_Var_Samp_Order_By>;
  variance?: InputMaybe<Course_Professors_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Course_Professors_Avg_Fields = {
  __typename?: 'course_professors_avg_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "course_professors" */
export type Course_Professors_Avg_Order_By = {
  course_id?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "course_professors". All fields are combined with a logical 'AND'. */
export type Course_Professors_Bool_Exp = {
  _and?: InputMaybe<Array<Course_Professors_Bool_Exp>>;
  _not?: InputMaybe<Course_Professors_Bool_Exp>;
  _or?: InputMaybe<Array<Course_Professors_Bool_Exp>>;
  course?: InputMaybe<Courses_Bool_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  professor?: InputMaybe<Professors_Bool_Exp>;
  professor_id?: InputMaybe<Int_Comparison_Exp>;
};

/** aggregate max on columns */
export type Course_Professors_Max_Fields = {
  __typename?: 'course_professors_max_fields';
  course_id?: Maybe<Scalars['Int']['output']>;
  professor_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "course_professors" */
export type Course_Professors_Max_Order_By = {
  course_id?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Course_Professors_Min_Fields = {
  __typename?: 'course_professors_min_fields';
  course_id?: Maybe<Scalars['Int']['output']>;
  professor_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "course_professors" */
export type Course_Professors_Min_Order_By = {
  course_id?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "course_professors". */
export type Course_Professors_Order_By = {
  course?: InputMaybe<Courses_Order_By>;
  course_id?: InputMaybe<Order_By>;
  professor?: InputMaybe<Professors_Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** select columns of table "course_professors" */
export enum Course_Professors_Select_Column {
  /** column name */
  CourseId = 'course_id',
  /** column name */
  ProfessorId = 'professor_id',
}

/** aggregate stddev on columns */
export type Course_Professors_Stddev_Fields = {
  __typename?: 'course_professors_stddev_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "course_professors" */
export type Course_Professors_Stddev_Order_By = {
  course_id?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Course_Professors_Stddev_Pop_Fields = {
  __typename?: 'course_professors_stddev_pop_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "course_professors" */
export type Course_Professors_Stddev_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Course_Professors_Stddev_Samp_Fields = {
  __typename?: 'course_professors_stddev_samp_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "course_professors" */
export type Course_Professors_Stddev_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "course_professors" */
export type Course_Professors_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Course_Professors_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Course_Professors_Stream_Cursor_Value_Input = {
  course_id?: InputMaybe<Scalars['Int']['input']>;
  professor_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Course_Professors_Sum_Fields = {
  __typename?: 'course_professors_sum_fields';
  course_id?: Maybe<Scalars['Int']['output']>;
  professor_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "course_professors" */
export type Course_Professors_Sum_Order_By = {
  course_id?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Course_Professors_Var_Pop_Fields = {
  __typename?: 'course_professors_var_pop_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "course_professors" */
export type Course_Professors_Var_Pop_Order_By = {
  course_id?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Course_Professors_Var_Samp_Fields = {
  __typename?: 'course_professors_var_samp_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "course_professors" */
export type Course_Professors_Var_Samp_Order_By = {
  course_id?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Course_Professors_Variance_Fields = {
  __typename?: 'course_professors_variance_fields';
  course_id?: Maybe<Scalars['Float']['output']>;
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "course_professors" */
export type Course_Professors_Variance_Order_By = {
  course_id?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "courses" */
export type Courses = {
  __typename?: 'courses';
  /** Course areas (humanities, social sciences, sciences) */
  areas: Scalars['jsonb']['output'];
  /** [computed] average_rating - average_workload */
  average_gut_rating?: Maybe<Scalars['float8']['output']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: Maybe<Scalars['float8']['output']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: Maybe<Scalars['Int']['output']>;
  /** Additional class notes */
  classnotes?: Maybe<Scalars['String']['output']>;
  /** True if the course is a college seminar. False otherwise. */
  colsem?: Maybe<Scalars['Boolean']['output']>;
  /** An array relationship */
  course_flags: Array<Course_Flags>;
  /** An aggregate relationship */
  course_flags_aggregate: Course_Flags_Aggregate;
  /** Link to the course homepage */
  course_home_url?: Maybe<Scalars['String']['output']>;
  course_id: Scalars['Int']['output'];
  /** An array relationship */
  course_meetings: Array<Course_Meetings>;
  /** An array relationship */
  course_professors: Array<Course_Professors>;
  /** An aggregate relationship */
  course_professors_aggregate: Course_Professors_Aggregate;
  /** Number of course credits */
  credits?: Maybe<Scalars['float8']['output']>;
  /** Course description */
  description?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  evaluation_narratives: Array<Evaluation_Narratives>;
  /** An aggregate relationship */
  evaluation_narratives_aggregate: Evaluation_Narratives_Aggregate;
  /** An array relationship */
  evaluation_ratings: Array<Evaluation_Ratings>;
  /** An aggregate relationship */
  evaluation_ratings_aggregate: Evaluation_Ratings_Aggregate;
  /** An object relationship */
  evaluation_statistic?: Maybe<Evaluation_Statistics>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info?: Maybe<Scalars['String']['output']>;
  /** Final exam information */
  final_exam?: Maybe<Scalars['String']['output']>;
  /** True if the course is a first-year seminar. False otherwise. */
  fysem?: Maybe<Scalars['Boolean']['output']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: Maybe<Scalars['Int']['output']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: Maybe<Scalars['Int']['output']>;
  /**
   * [computed] Whether last enrollment offering
   *         is with same professor as current.
   */
  last_enrollment_same_professors?: Maybe<Scalars['Boolean']['output']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code?: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: Maybe<Scalars['Int']['output']>;
  /** An array relationship */
  listings: Array<Listings>;
  /** An aggregate relationship */
  listings_aggregate: Listings_Aggregate;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes?: Maybe<Scalars['String']['output']>;
  /** Recommended requirements/prerequisites for the course */
  requirements?: Maybe<Scalars['String']['output']>;
  /** Reading period notes */
  rp_attr?: Maybe<Scalars['String']['output']>;
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
  season: Seasons;
  /** The season the course is being taught in */
  season_code: Scalars['String']['output'];
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: Scalars['String']['output'];
  /**
   * Skills that the course fulfills (e.g. writing,
   *         quantitative reasoning, language levels)
   */
  skills: Scalars['jsonb']['output'];
  /** Link to the syllabus */
  syllabus_url?: Maybe<Scalars['String']['output']>;
  /** True if the course is a sophomore seminar. False otherwise. */
  sysem?: Maybe<Scalars['Boolean']['output']>;
  /** Complete course title */
  title: Scalars['String']['output'];
};

/** columns and relationships of "courses" */
export type CoursesAreasArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "courses" */
export type CoursesCourse_FlagsArgs = {
  distinct_on?: InputMaybe<Array<Course_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Flags_Order_By>>;
  where?: InputMaybe<Course_Flags_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesCourse_Flags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Flags_Order_By>>;
  where?: InputMaybe<Course_Flags_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesCourse_MeetingsArgs = {
  distinct_on?: InputMaybe<Array<Course_Meetings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Meetings_Order_By>>;
  where?: InputMaybe<Course_Meetings_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesCourse_ProfessorsArgs = {
  distinct_on?: InputMaybe<Array<Course_Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Professors_Order_By>>;
  where?: InputMaybe<Course_Professors_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesCourse_Professors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Professors_Order_By>>;
  where?: InputMaybe<Course_Professors_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesEvaluation_NarrativesArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Narratives_Order_By>>;
  where?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesEvaluation_Narratives_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Narratives_Order_By>>;
  where?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesEvaluation_RatingsArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Ratings_Order_By>>;
  where?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesEvaluation_Ratings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Ratings_Order_By>>;
  where?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesListingsArgs = {
  distinct_on?: InputMaybe<Array<Listings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Listings_Order_By>>;
  where?: InputMaybe<Listings_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesListings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Listings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Listings_Order_By>>;
  where?: InputMaybe<Listings_Bool_Exp>;
};

/** columns and relationships of "courses" */
export type CoursesSkillsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** order by aggregate values of table "courses" */
export type Courses_Aggregate_Order_By = {
  avg?: InputMaybe<Courses_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Courses_Max_Order_By>;
  min?: InputMaybe<Courses_Min_Order_By>;
  stddev?: InputMaybe<Courses_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Courses_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Courses_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Courses_Sum_Order_By>;
  var_pop?: InputMaybe<Courses_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Courses_Var_Samp_Order_By>;
  variance?: InputMaybe<Courses_Variance_Order_By>;
};

/** order by avg() on columns of table "courses" */
export type Courses_Avg_Order_By = {
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Order_By>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  /** Number of course credits */
  credits?: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "courses". All fields are combined with a logical 'AND'. */
export type Courses_Bool_Exp = {
  _and?: InputMaybe<Array<Courses_Bool_Exp>>;
  _not?: InputMaybe<Courses_Bool_Exp>;
  _or?: InputMaybe<Array<Courses_Bool_Exp>>;
  areas?: InputMaybe<Jsonb_Comparison_Exp>;
  average_gut_rating?: InputMaybe<Float8_Comparison_Exp>;
  average_professor_rating?: InputMaybe<Float8_Comparison_Exp>;
  average_rating?: InputMaybe<Float8_Comparison_Exp>;
  average_rating_n?: InputMaybe<Int_Comparison_Exp>;
  average_rating_same_professors?: InputMaybe<Float8_Comparison_Exp>;
  average_rating_same_professors_n?: InputMaybe<Int_Comparison_Exp>;
  average_workload?: InputMaybe<Float8_Comparison_Exp>;
  average_workload_n?: InputMaybe<Int_Comparison_Exp>;
  average_workload_same_professors?: InputMaybe<Float8_Comparison_Exp>;
  average_workload_same_professors_n?: InputMaybe<Int_Comparison_Exp>;
  classnotes?: InputMaybe<String_Comparison_Exp>;
  colsem?: InputMaybe<Boolean_Comparison_Exp>;
  course_flags?: InputMaybe<Course_Flags_Bool_Exp>;
  course_flags_aggregate?: InputMaybe<Course_Flags_Aggregate_Bool_Exp>;
  course_home_url?: InputMaybe<String_Comparison_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  course_meetings?: InputMaybe<Course_Meetings_Bool_Exp>;
  course_professors?: InputMaybe<Course_Professors_Bool_Exp>;
  course_professors_aggregate?: InputMaybe<Course_Professors_Aggregate_Bool_Exp>;
  credits?: InputMaybe<Float8_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  evaluation_narratives?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  evaluation_narratives_aggregate?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp>;
  evaluation_ratings?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
  evaluation_ratings_aggregate?: InputMaybe<Evaluation_Ratings_Aggregate_Bool_Exp>;
  evaluation_statistic?: InputMaybe<Evaluation_Statistics_Bool_Exp>;
  extra_info?: InputMaybe<String_Comparison_Exp>;
  final_exam?: InputMaybe<String_Comparison_Exp>;
  fysem?: InputMaybe<Boolean_Comparison_Exp>;
  last_enrollment?: InputMaybe<Int_Comparison_Exp>;
  last_enrollment_course_id?: InputMaybe<Int_Comparison_Exp>;
  last_enrollment_same_professors?: InputMaybe<Boolean_Comparison_Exp>;
  last_enrollment_season_code?: InputMaybe<String_Comparison_Exp>;
  last_offered_course_id?: InputMaybe<Int_Comparison_Exp>;
  listings?: InputMaybe<Listings_Bool_Exp>;
  listings_aggregate?: InputMaybe<Listings_Aggregate_Bool_Exp>;
  regnotes?: InputMaybe<String_Comparison_Exp>;
  requirements?: InputMaybe<String_Comparison_Exp>;
  rp_attr?: InputMaybe<String_Comparison_Exp>;
  same_course_and_profs_id?: InputMaybe<Int_Comparison_Exp>;
  same_course_id?: InputMaybe<Int_Comparison_Exp>;
  season?: InputMaybe<Seasons_Bool_Exp>;
  season_code?: InputMaybe<String_Comparison_Exp>;
  section?: InputMaybe<String_Comparison_Exp>;
  skills?: InputMaybe<Jsonb_Comparison_Exp>;
  syllabus_url?: InputMaybe<String_Comparison_Exp>;
  sysem?: InputMaybe<Boolean_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "courses" */
export type Courses_Max_Order_By = {
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Order_By>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  /** Additional class notes */
  classnotes?: InputMaybe<Order_By>;
  /** Link to the course homepage */
  course_home_url?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  /** Number of course credits */
  credits?: InputMaybe<Order_By>;
  /** Course description */
  description?: InputMaybe<Order_By>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info?: InputMaybe<Order_By>;
  /** Final exam information */
  final_exam?: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Order_By>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code?: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Order_By>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes?: InputMaybe<Order_By>;
  /** Recommended requirements/prerequisites for the course */
  requirements?: InputMaybe<Order_By>;
  /** Reading period notes */
  rp_attr?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Order_By>;
  /** The season the course is being taught in */
  season_code?: InputMaybe<Order_By>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section?: InputMaybe<Order_By>;
  /** Link to the syllabus */
  syllabus_url?: InputMaybe<Order_By>;
  /** Complete course title */
  title?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "courses" */
export type Courses_Min_Order_By = {
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Order_By>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  /** Additional class notes */
  classnotes?: InputMaybe<Order_By>;
  /** Link to the course homepage */
  course_home_url?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  /** Number of course credits */
  credits?: InputMaybe<Order_By>;
  /** Course description */
  description?: InputMaybe<Order_By>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info?: InputMaybe<Order_By>;
  /** Final exam information */
  final_exam?: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Order_By>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code?: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Order_By>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes?: InputMaybe<Order_By>;
  /** Recommended requirements/prerequisites for the course */
  requirements?: InputMaybe<Order_By>;
  /** Reading period notes */
  rp_attr?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Order_By>;
  /** The season the course is being taught in */
  season_code?: InputMaybe<Order_By>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section?: InputMaybe<Order_By>;
  /** Link to the syllabus */
  syllabus_url?: InputMaybe<Order_By>;
  /** Complete course title */
  title?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "courses". */
export type Courses_Order_By = {
  areas?: InputMaybe<Order_By>;
  average_gut_rating?: InputMaybe<Order_By>;
  average_professor_rating?: InputMaybe<Order_By>;
  average_rating?: InputMaybe<Order_By>;
  average_rating_n?: InputMaybe<Order_By>;
  average_rating_same_professors?: InputMaybe<Order_By>;
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  average_workload?: InputMaybe<Order_By>;
  average_workload_n?: InputMaybe<Order_By>;
  average_workload_same_professors?: InputMaybe<Order_By>;
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  classnotes?: InputMaybe<Order_By>;
  colsem?: InputMaybe<Order_By>;
  course_flags_aggregate?: InputMaybe<Course_Flags_Aggregate_Order_By>;
  course_home_url?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  course_meetings_aggregate?: InputMaybe<Course_Meetings_Aggregate_Order_By>;
  course_professors_aggregate?: InputMaybe<Course_Professors_Aggregate_Order_By>;
  credits?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  evaluation_narratives_aggregate?: InputMaybe<Evaluation_Narratives_Aggregate_Order_By>;
  evaluation_ratings_aggregate?: InputMaybe<Evaluation_Ratings_Aggregate_Order_By>;
  evaluation_statistic?: InputMaybe<Evaluation_Statistics_Order_By>;
  extra_info?: InputMaybe<Order_By>;
  final_exam?: InputMaybe<Order_By>;
  fysem?: InputMaybe<Order_By>;
  last_enrollment?: InputMaybe<Order_By>;
  last_enrollment_course_id?: InputMaybe<Order_By>;
  last_enrollment_same_professors?: InputMaybe<Order_By>;
  last_enrollment_season_code?: InputMaybe<Order_By>;
  last_offered_course_id?: InputMaybe<Order_By>;
  listings_aggregate?: InputMaybe<Listings_Aggregate_Order_By>;
  regnotes?: InputMaybe<Order_By>;
  requirements?: InputMaybe<Order_By>;
  rp_attr?: InputMaybe<Order_By>;
  same_course_and_profs_id?: InputMaybe<Order_By>;
  same_course_id?: InputMaybe<Order_By>;
  season?: InputMaybe<Seasons_Order_By>;
  season_code?: InputMaybe<Order_By>;
  section?: InputMaybe<Order_By>;
  skills?: InputMaybe<Order_By>;
  syllabus_url?: InputMaybe<Order_By>;
  sysem?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
};

/** select columns of table "courses" */
export enum Courses_Select_Column {
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
  Title = 'title',
}

/** order by stddev() on columns of table "courses" */
export type Courses_Stddev_Order_By = {
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Order_By>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  /** Number of course credits */
  credits?: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "courses" */
export type Courses_Stddev_Pop_Order_By = {
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Order_By>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  /** Number of course credits */
  credits?: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "courses" */
export type Courses_Stddev_Samp_Order_By = {
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Order_By>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  /** Number of course credits */
  credits?: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "courses" */
export type Courses_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Courses_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Courses_Stream_Cursor_Value_Input = {
  /** Course areas (humanities, social sciences, sciences) */
  areas?: InputMaybe<Scalars['jsonb']['input']>;
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Scalars['float8']['input']>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Scalars['Int']['input']>;
  /** Additional class notes */
  classnotes?: InputMaybe<Scalars['String']['input']>;
  /** True if the course is a college seminar. False otherwise. */
  colsem?: InputMaybe<Scalars['Boolean']['input']>;
  /** Link to the course homepage */
  course_home_url?: InputMaybe<Scalars['String']['input']>;
  course_id?: InputMaybe<Scalars['Int']['input']>;
  /** Number of course credits */
  credits?: InputMaybe<Scalars['float8']['input']>;
  /** Course description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Additional information (indicates if class has been cancelled) */
  extra_info?: InputMaybe<Scalars['String']['input']>;
  /** Final exam information */
  final_exam?: InputMaybe<Scalars['String']['input']>;
  /** True if the course is a first-year seminar. False otherwise. */
  fysem?: InputMaybe<Scalars['Boolean']['input']>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Scalars['Int']['input']>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Whether last enrollment offering
   *         is with same professor as current.
   */
  last_enrollment_same_professors?: InputMaybe<Scalars['Boolean']['input']>;
  /** [computed] Season in which last enrollment offering is from */
  last_enrollment_season_code?: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Scalars['Int']['input']>;
  /**
   * Registrar's notes (e.g. preference selection links,
   *         optional writing credits, etc.)
   */
  regnotes?: InputMaybe<Scalars['String']['input']>;
  /** Recommended requirements/prerequisites for the course */
  requirements?: InputMaybe<Scalars['String']['input']>;
  /** Reading period notes */
  rp_attr?: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Scalars['Int']['input']>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Scalars['Int']['input']>;
  /** The season the course is being taught in */
  season_code?: InputMaybe<Scalars['String']['input']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section?: InputMaybe<Scalars['String']['input']>;
  /**
   * Skills that the course fulfills (e.g. writing,
   *         quantitative reasoning, language levels)
   */
  skills?: InputMaybe<Scalars['jsonb']['input']>;
  /** Link to the syllabus */
  syllabus_url?: InputMaybe<Scalars['String']['input']>;
  /** True if the course is a sophomore seminar. False otherwise. */
  sysem?: InputMaybe<Scalars['Boolean']['input']>;
  /** Complete course title */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "courses" */
export type Courses_Sum_Order_By = {
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Order_By>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  /** Number of course credits */
  credits?: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "courses" */
export type Courses_Var_Pop_Order_By = {
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Order_By>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  /** Number of course credits */
  credits?: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "courses" */
export type Courses_Var_Samp_Order_By = {
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Order_By>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  /** Number of course credits */
  credits?: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "courses" */
export type Courses_Variance_Order_By = {
  /** [computed] average_rating - average_workload */
  average_gut_rating?: InputMaybe<Order_By>;
  /** [computed] Average of the average ratings of all professors for this course. */
  average_professor_rating?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings
   */
  average_rating?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average course rating for this course code,
   *         aggregated across all cross-listings with same set of professors
   */
  average_rating_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_rating_same_professors`
   */
  average_rating_same_professors_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings
   */
  average_workload?: InputMaybe<Order_By>;
  /** [computed] Number of courses used to compute `average_workload` */
  average_workload_n?: InputMaybe<Order_By>;
  /**
   * [computed] Historical average workload rating,
   *         aggregated across all cross-listings with same set of professors
   */
  average_workload_same_professors?: InputMaybe<Order_By>;
  /**
   * [computed] Number of courses used to compute
   *         `average_workload_same_professors`
   */
  average_workload_same_professors_n?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  /** Number of course credits */
  credits?: InputMaybe<Order_By>;
  /** [computed] Number of students enrolled in last offering of course */
  last_enrollment?: InputMaybe<Order_By>;
  /** [computed] Course from which last enrollment offering was pulled */
  last_enrollment_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Most recent previous offering of
   *         course (excluding future ones)
   */
  last_offered_course_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *         Same as 'same_course_id' with the constraint that all courses in a group were
   *         taught by the same professors.
   *
   */
  same_course_and_profs_id?: InputMaybe<Order_By>;
  /**
   * [computed] Unique ID for grouping courses by historical offering.
   *         All courses with a given ID are identical offerings across different semesters.
   *
   */
  same_course_id?: InputMaybe<Order_By>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** columns and relationships of "evaluation_narratives" */
export type Evaluation_Narratives = {
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
  evaluation_question: Evaluation_Questions;
  id: Scalars['Int']['output'];
  /** Question to which this narrative comment responds */
  question_code: Scalars['String']['output'];
  /** The number of the response for the given course and question */
  response_number: Scalars['Int']['output'];
};

/** aggregated selection of "evaluation_narratives" */
export type Evaluation_Narratives_Aggregate = {
  __typename?: 'evaluation_narratives_aggregate';
  aggregate?: Maybe<Evaluation_Narratives_Aggregate_Fields>;
  nodes: Array<Evaluation_Narratives>;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp = {
  avg?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Avg>;
  corr?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Corr>;
  count?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Count>;
  covar_samp?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp>;
  max?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Max>;
  min?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Min>;
  stddev_samp?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Stddev_Samp>;
  sum?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Sum>;
  var_samp?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp_Var_Samp>;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Avg = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Corr = {
  arguments: Evaluation_Narratives_Aggregate_Bool_Exp_Corr_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Corr_Arguments = {
  X: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Max = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Min = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Sum = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

export type Evaluation_Narratives_Aggregate_Bool_Exp_Var_Samp = {
  arguments: Evaluation_Narratives_Select_Column_Evaluation_Narratives_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  predicate: Float8_Comparison_Exp;
};

/** aggregate fields of "evaluation_narratives" */
export type Evaluation_Narratives_Aggregate_Fields = {
  __typename?: 'evaluation_narratives_aggregate_fields';
  avg?: Maybe<Evaluation_Narratives_Avg_Fields>;
  count: Scalars['Int']['output'];
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
  columns?: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "evaluation_narratives" */
export type Evaluation_Narratives_Aggregate_Order_By = {
  avg?: InputMaybe<Evaluation_Narratives_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Evaluation_Narratives_Max_Order_By>;
  min?: InputMaybe<Evaluation_Narratives_Min_Order_By>;
  stddev?: InputMaybe<Evaluation_Narratives_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Evaluation_Narratives_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Evaluation_Narratives_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Evaluation_Narratives_Sum_Order_By>;
  var_pop?: InputMaybe<Evaluation_Narratives_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Evaluation_Narratives_Var_Samp_Order_By>;
  variance?: InputMaybe<Evaluation_Narratives_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Evaluation_Narratives_Avg_Fields = {
  __typename?: 'evaluation_narratives_avg_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** The number of the response for the given course and question */
  response_number?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Avg_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "evaluation_narratives". All fields are combined with a logical 'AND'. */
export type Evaluation_Narratives_Bool_Exp = {
  _and?: InputMaybe<Array<Evaluation_Narratives_Bool_Exp>>;
  _not?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  _or?: InputMaybe<Array<Evaluation_Narratives_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  comment_compound?: InputMaybe<Float8_Comparison_Exp>;
  comment_neg?: InputMaybe<Float8_Comparison_Exp>;
  comment_neu?: InputMaybe<Float8_Comparison_Exp>;
  comment_pos?: InputMaybe<Float8_Comparison_Exp>;
  course?: InputMaybe<Courses_Bool_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  evaluation_question?: InputMaybe<Evaluation_Questions_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  question_code?: InputMaybe<String_Comparison_Exp>;
  response_number?: InputMaybe<Int_Comparison_Exp>;
};

/** aggregate max on columns */
export type Evaluation_Narratives_Max_Fields = {
  __typename?: 'evaluation_narratives_max_fields';
  /** Response to the question */
  comment?: Maybe<Scalars['String']['output']>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['float8']['output']>;
  /** The course to which this narrative comment applies */
  course_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  /** Question to which this narrative comment responds */
  question_code?: Maybe<Scalars['String']['output']>;
  /** The number of the response for the given course and question */
  response_number?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Max_Order_By = {
  /** Response to the question */
  comment?: InputMaybe<Order_By>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Question to which this narrative comment responds */
  question_code?: InputMaybe<Order_By>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Evaluation_Narratives_Min_Fields = {
  __typename?: 'evaluation_narratives_min_fields';
  /** Response to the question */
  comment?: Maybe<Scalars['String']['output']>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['float8']['output']>;
  /** The course to which this narrative comment applies */
  course_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  /** Question to which this narrative comment responds */
  question_code?: Maybe<Scalars['String']['output']>;
  /** The number of the response for the given course and question */
  response_number?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Min_Order_By = {
  /** Response to the question */
  comment?: InputMaybe<Order_By>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Question to which this narrative comment responds */
  question_code?: InputMaybe<Order_By>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "evaluation_narratives". */
export type Evaluation_Narratives_Order_By = {
  comment?: InputMaybe<Order_By>;
  comment_compound?: InputMaybe<Order_By>;
  comment_neg?: InputMaybe<Order_By>;
  comment_neu?: InputMaybe<Order_By>;
  comment_pos?: InputMaybe<Order_By>;
  course?: InputMaybe<Courses_Order_By>;
  course_id?: InputMaybe<Order_By>;
  evaluation_question?: InputMaybe<Evaluation_Questions_Order_By>;
  id?: InputMaybe<Order_By>;
  question_code?: InputMaybe<Order_By>;
  response_number?: InputMaybe<Order_By>;
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
  /** column name */
  ResponseNumber = 'response_number',
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

/** aggregate stddev on columns */
export type Evaluation_Narratives_Stddev_Fields = {
  __typename?: 'evaluation_narratives_stddev_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** The number of the response for the given course and question */
  response_number?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Stddev_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Evaluation_Narratives_Stddev_Pop_Fields = {
  __typename?: 'evaluation_narratives_stddev_pop_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** The number of the response for the given course and question */
  response_number?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Stddev_Pop_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Evaluation_Narratives_Stddev_Samp_Fields = {
  __typename?: 'evaluation_narratives_stddev_samp_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** The number of the response for the given course and question */
  response_number?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Stddev_Samp_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "evaluation_narratives" */
export type Evaluation_Narratives_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Evaluation_Narratives_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Evaluation_Narratives_Stream_Cursor_Value_Input = {
  /** Response to the question */
  comment?: InputMaybe<Scalars['String']['input']>;
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Scalars['float8']['input']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Scalars['float8']['input']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Scalars['float8']['input']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Scalars['float8']['input']>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this narrative comment responds */
  question_code?: InputMaybe<Scalars['String']['input']>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Evaluation_Narratives_Sum_Fields = {
  __typename?: 'evaluation_narratives_sum_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['float8']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['float8']['output']>;
  /** The course to which this narrative comment applies */
  course_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  /** The number of the response for the given course and question */
  response_number?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Sum_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Evaluation_Narratives_Var_Pop_Fields = {
  __typename?: 'evaluation_narratives_var_pop_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** The number of the response for the given course and question */
  response_number?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Var_Pop_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Evaluation_Narratives_Var_Samp_Fields = {
  __typename?: 'evaluation_narratives_var_samp_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** The number of the response for the given course and question */
  response_number?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Var_Samp_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Evaluation_Narratives_Variance_Fields = {
  __typename?: 'evaluation_narratives_variance_fields';
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: Maybe<Scalars['Float']['output']>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: Maybe<Scalars['Float']['output']>;
  /** The course to which this narrative comment applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  /** The number of the response for the given course and question */
  response_number?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "evaluation_narratives" */
export type Evaluation_Narratives_Variance_Order_By = {
  /** VADER sentiment 'compound' score (valence aggregate of neg, neu, pos) */
  comment_compound?: InputMaybe<Order_By>;
  /** VADER sentiment 'neg' score (negativity) */
  comment_neg?: InputMaybe<Order_By>;
  /** VADER sentiment 'neu' score (neutrality) */
  comment_neu?: InputMaybe<Order_By>;
  /** VADER sentiment 'pos' score (positivity) */
  comment_pos?: InputMaybe<Order_By>;
  /** The course to which this narrative comment applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** The number of the response for the given course and question */
  response_number?: InputMaybe<Order_By>;
};

/** columns and relationships of "evaluation_questions" */
export type Evaluation_Questions = {
  __typename?: 'evaluation_questions';
  /** An array relationship */
  evaluation_narratives: Array<Evaluation_Narratives>;
  /** An aggregate relationship */
  evaluation_narratives_aggregate: Evaluation_Narratives_Aggregate;
  /** An array relationship */
  evaluation_ratings: Array<Evaluation_Ratings>;
  /** An aggregate relationship */
  evaluation_ratings_aggregate: Evaluation_Ratings_Aggregate;
  /**
   * True if the question has narrative responses.
   *         False if the question has categorica/numerical responses
   */
  is_narrative: Scalars['Boolean']['output'];
  /** JSON array of possible responses (only if the question is not a narrative) */
  options?: Maybe<Scalars['jsonb']['output']>;
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
  tag?: Maybe<Scalars['String']['output']>;
};

/** columns and relationships of "evaluation_questions" */
export type Evaluation_QuestionsEvaluation_NarrativesArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Narratives_Order_By>>;
  where?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
};

/** columns and relationships of "evaluation_questions" */
export type Evaluation_QuestionsEvaluation_Narratives_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Narratives_Order_By>>;
  where?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
};

/** columns and relationships of "evaluation_questions" */
export type Evaluation_QuestionsEvaluation_RatingsArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Ratings_Order_By>>;
  where?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
};

/** columns and relationships of "evaluation_questions" */
export type Evaluation_QuestionsEvaluation_Ratings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Ratings_Order_By>>;
  where?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
};

/** columns and relationships of "evaluation_questions" */
export type Evaluation_QuestionsOptionsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
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
  count: Scalars['Int']['output'];
  max?: Maybe<Evaluation_Questions_Max_Fields>;
  min?: Maybe<Evaluation_Questions_Min_Fields>;
};

/** aggregate fields of "evaluation_questions" */
export type Evaluation_Questions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Evaluation_Questions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "evaluation_questions". All fields are combined with a logical 'AND'. */
export type Evaluation_Questions_Bool_Exp = {
  _and?: InputMaybe<Array<Evaluation_Questions_Bool_Exp>>;
  _not?: InputMaybe<Evaluation_Questions_Bool_Exp>;
  _or?: InputMaybe<Array<Evaluation_Questions_Bool_Exp>>;
  evaluation_narratives?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
  evaluation_narratives_aggregate?: InputMaybe<Evaluation_Narratives_Aggregate_Bool_Exp>;
  evaluation_ratings?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
  evaluation_ratings_aggregate?: InputMaybe<Evaluation_Ratings_Aggregate_Bool_Exp>;
  is_narrative?: InputMaybe<Boolean_Comparison_Exp>;
  options?: InputMaybe<Jsonb_Comparison_Exp>;
  question_code?: InputMaybe<String_Comparison_Exp>;
  question_text?: InputMaybe<String_Comparison_Exp>;
  tag?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Evaluation_Questions_Max_Fields = {
  __typename?: 'evaluation_questions_max_fields';
  /** Question code from OCE (e.g. "YC402") */
  question_code?: Maybe<Scalars['String']['output']>;
  /** The question text */
  question_text?: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Question type. The 'Overall' and 'Workload' tags
   *         are used to compute average ratings, while others are purely for
   *         identification purposes. No other commonality, other than that they
   *         contain similar keywords, is guaranteed—for example, they may have
   *         different options, or even differ in being narrative or not.
   */
  tag?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Evaluation_Questions_Min_Fields = {
  __typename?: 'evaluation_questions_min_fields';
  /** Question code from OCE (e.g. "YC402") */
  question_code?: Maybe<Scalars['String']['output']>;
  /** The question text */
  question_text?: Maybe<Scalars['String']['output']>;
  /**
   * [computed] Question type. The 'Overall' and 'Workload' tags
   *         are used to compute average ratings, while others are purely for
   *         identification purposes. No other commonality, other than that they
   *         contain similar keywords, is guaranteed—for example, they may have
   *         different options, or even differ in being narrative or not.
   */
  tag?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "evaluation_questions". */
export type Evaluation_Questions_Order_By = {
  evaluation_narratives_aggregate?: InputMaybe<Evaluation_Narratives_Aggregate_Order_By>;
  evaluation_ratings_aggregate?: InputMaybe<Evaluation_Ratings_Aggregate_Order_By>;
  is_narrative?: InputMaybe<Order_By>;
  options?: InputMaybe<Order_By>;
  question_code?: InputMaybe<Order_By>;
  question_text?: InputMaybe<Order_By>;
  tag?: InputMaybe<Order_By>;
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

/** Streaming cursor of the table "evaluation_questions" */
export type Evaluation_Questions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Evaluation_Questions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Evaluation_Questions_Stream_Cursor_Value_Input = {
  /**
   * True if the question has narrative responses.
   *         False if the question has categorica/numerical responses
   */
  is_narrative?: InputMaybe<Scalars['Boolean']['input']>;
  /** JSON array of possible responses (only if the question is not a narrative) */
  options?: InputMaybe<Scalars['jsonb']['input']>;
  /** Question code from OCE (e.g. "YC402") */
  question_code?: InputMaybe<Scalars['String']['input']>;
  /** The question text */
  question_text?: InputMaybe<Scalars['String']['input']>;
  /**
   * [computed] Question type. The 'Overall' and 'Workload' tags
   *         are used to compute average ratings, while others are purely for
   *         identification purposes. No other commonality, other than that they
   *         contain similar keywords, is guaranteed—for example, they may have
   *         different options, or even differ in being narrative or not.
   */
  tag?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "evaluation_ratings" */
export type Evaluation_Ratings = {
  __typename?: 'evaluation_ratings';
  /** An object relationship */
  course: Courses;
  /** The course to which this rating applies */
  course_id: Scalars['Int']['output'];
  /** An object relationship */
  evaluation_question: Evaluation_Questions;
  id: Scalars['Int']['output'];
  /** Question to which this rating responds */
  question_code: Scalars['String']['output'];
  /** JSON array of the response counts for each option */
  rating: Scalars['jsonb']['output'];
};

/** columns and relationships of "evaluation_ratings" */
export type Evaluation_RatingsRatingArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "evaluation_ratings" */
export type Evaluation_Ratings_Aggregate = {
  __typename?: 'evaluation_ratings_aggregate';
  aggregate?: Maybe<Evaluation_Ratings_Aggregate_Fields>;
  nodes: Array<Evaluation_Ratings>;
};

export type Evaluation_Ratings_Aggregate_Bool_Exp = {
  count?: InputMaybe<Evaluation_Ratings_Aggregate_Bool_Exp_Count>;
};

export type Evaluation_Ratings_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "evaluation_ratings" */
export type Evaluation_Ratings_Aggregate_Fields = {
  __typename?: 'evaluation_ratings_aggregate_fields';
  avg?: Maybe<Evaluation_Ratings_Avg_Fields>;
  count: Scalars['Int']['output'];
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
  columns?: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "evaluation_ratings" */
export type Evaluation_Ratings_Aggregate_Order_By = {
  avg?: InputMaybe<Evaluation_Ratings_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Evaluation_Ratings_Max_Order_By>;
  min?: InputMaybe<Evaluation_Ratings_Min_Order_By>;
  stddev?: InputMaybe<Evaluation_Ratings_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Evaluation_Ratings_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Evaluation_Ratings_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Evaluation_Ratings_Sum_Order_By>;
  var_pop?: InputMaybe<Evaluation_Ratings_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Evaluation_Ratings_Var_Samp_Order_By>;
  variance?: InputMaybe<Evaluation_Ratings_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Evaluation_Ratings_Avg_Fields = {
  __typename?: 'evaluation_ratings_avg_fields';
  /** The course to which this rating applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Avg_Order_By = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "evaluation_ratings". All fields are combined with a logical 'AND'. */
export type Evaluation_Ratings_Bool_Exp = {
  _and?: InputMaybe<Array<Evaluation_Ratings_Bool_Exp>>;
  _not?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
  _or?: InputMaybe<Array<Evaluation_Ratings_Bool_Exp>>;
  course?: InputMaybe<Courses_Bool_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  evaluation_question?: InputMaybe<Evaluation_Questions_Bool_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  question_code?: InputMaybe<String_Comparison_Exp>;
  rating?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** aggregate max on columns */
export type Evaluation_Ratings_Max_Fields = {
  __typename?: 'evaluation_ratings_max_fields';
  /** The course to which this rating applies */
  course_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  /** Question to which this rating responds */
  question_code?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Max_Order_By = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Question to which this rating responds */
  question_code?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Evaluation_Ratings_Min_Fields = {
  __typename?: 'evaluation_ratings_min_fields';
  /** The course to which this rating applies */
  course_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  /** Question to which this rating responds */
  question_code?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Min_Order_By = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Question to which this rating responds */
  question_code?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "evaluation_ratings". */
export type Evaluation_Ratings_Order_By = {
  course?: InputMaybe<Courses_Order_By>;
  course_id?: InputMaybe<Order_By>;
  evaluation_question?: InputMaybe<Evaluation_Questions_Order_By>;
  id?: InputMaybe<Order_By>;
  question_code?: InputMaybe<Order_By>;
  rating?: InputMaybe<Order_By>;
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

/** aggregate stddev on columns */
export type Evaluation_Ratings_Stddev_Fields = {
  __typename?: 'evaluation_ratings_stddev_fields';
  /** The course to which this rating applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Stddev_Order_By = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Evaluation_Ratings_Stddev_Pop_Fields = {
  __typename?: 'evaluation_ratings_stddev_pop_fields';
  /** The course to which this rating applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Stddev_Pop_Order_By = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Evaluation_Ratings_Stddev_Samp_Fields = {
  __typename?: 'evaluation_ratings_stddev_samp_fields';
  /** The course to which this rating applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Stddev_Samp_Order_By = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "evaluation_ratings" */
export type Evaluation_Ratings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Evaluation_Ratings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Evaluation_Ratings_Stream_Cursor_Value_Input = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Question to which this rating responds */
  question_code?: InputMaybe<Scalars['String']['input']>;
  /** JSON array of the response counts for each option */
  rating?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate sum on columns */
export type Evaluation_Ratings_Sum_Fields = {
  __typename?: 'evaluation_ratings_sum_fields';
  /** The course to which this rating applies */
  course_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Sum_Order_By = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Evaluation_Ratings_Var_Pop_Fields = {
  __typename?: 'evaluation_ratings_var_pop_fields';
  /** The course to which this rating applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Var_Pop_Order_By = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Evaluation_Ratings_Var_Samp_Fields = {
  __typename?: 'evaluation_ratings_var_samp_fields';
  /** The course to which this rating applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Var_Samp_Order_By = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Evaluation_Ratings_Variance_Fields = {
  __typename?: 'evaluation_ratings_variance_fields';
  /** The course to which this rating applies */
  course_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "evaluation_ratings" */
export type Evaluation_Ratings_Variance_Order_By = {
  /** The course to which this rating applies */
  course_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** columns and relationships of "evaluation_statistics" */
export type Evaluation_Statistics = {
  __typename?: 'evaluation_statistics';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['float8']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['float8']['output']>;
  /** An object relationship */
  course: Courses;
  /** The course associated with these statistics */
  course_id: Scalars['Int']['output'];
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Int']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Int']['output']>;
  /** Arbitrary additional information attached to an evaluation */
  extras?: Maybe<Scalars['jsonb']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Int']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Int']['output']>;
};

/** columns and relationships of "evaluation_statistics" */
export type Evaluation_StatisticsExtrasArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
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
  count: Scalars['Int']['output'];
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
  columns?: InputMaybe<Array<Evaluation_Statistics_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Evaluation_Statistics_Avg_Fields = {
  __typename?: 'evaluation_statistics_avg_fields';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "evaluation_statistics". All fields are combined with a logical 'AND'. */
export type Evaluation_Statistics_Bool_Exp = {
  _and?: InputMaybe<Array<Evaluation_Statistics_Bool_Exp>>;
  _not?: InputMaybe<Evaluation_Statistics_Bool_Exp>;
  _or?: InputMaybe<Array<Evaluation_Statistics_Bool_Exp>>;
  avg_rating?: InputMaybe<Float8_Comparison_Exp>;
  avg_workload?: InputMaybe<Float8_Comparison_Exp>;
  course?: InputMaybe<Courses_Bool_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  declined?: InputMaybe<Int_Comparison_Exp>;
  enrolled?: InputMaybe<Int_Comparison_Exp>;
  extras?: InputMaybe<Jsonb_Comparison_Exp>;
  no_response?: InputMaybe<Int_Comparison_Exp>;
  responses?: InputMaybe<Int_Comparison_Exp>;
};

/** aggregate max on columns */
export type Evaluation_Statistics_Max_Fields = {
  __typename?: 'evaluation_statistics_max_fields';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['float8']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['float8']['output']>;
  /** The course associated with these statistics */
  course_id?: Maybe<Scalars['Int']['output']>;
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Int']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Int']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Int']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Evaluation_Statistics_Min_Fields = {
  __typename?: 'evaluation_statistics_min_fields';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['float8']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['float8']['output']>;
  /** The course associated with these statistics */
  course_id?: Maybe<Scalars['Int']['output']>;
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Int']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Int']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Int']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Int']['output']>;
};

/** Ordering options when selecting data from "evaluation_statistics". */
export type Evaluation_Statistics_Order_By = {
  avg_rating?: InputMaybe<Order_By>;
  avg_workload?: InputMaybe<Order_By>;
  course?: InputMaybe<Courses_Order_By>;
  course_id?: InputMaybe<Order_By>;
  declined?: InputMaybe<Order_By>;
  enrolled?: InputMaybe<Order_By>;
  extras?: InputMaybe<Order_By>;
  no_response?: InputMaybe<Order_By>;
  responses?: InputMaybe<Order_By>;
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
  Extras = 'extras',
  /** column name */
  NoResponse = 'no_response',
  /** column name */
  Responses = 'responses',
}

/** aggregate stddev on columns */
export type Evaluation_Statistics_Stddev_Fields = {
  __typename?: 'evaluation_statistics_stddev_fields';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Evaluation_Statistics_Stddev_Pop_Fields = {
  __typename?: 'evaluation_statistics_stddev_pop_fields';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Evaluation_Statistics_Stddev_Samp_Fields = {
  __typename?: 'evaluation_statistics_stddev_samp_fields';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "evaluation_statistics" */
export type Evaluation_Statistics_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Evaluation_Statistics_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Evaluation_Statistics_Stream_Cursor_Value_Input = {
  /** [computed] Average overall rating */
  avg_rating?: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Average workload rating */
  avg_workload?: InputMaybe<Scalars['float8']['input']>;
  /** The course associated with these statistics */
  course_id?: InputMaybe<Scalars['Int']['input']>;
  /** Number of students who declined to respond */
  declined?: InputMaybe<Scalars['Int']['input']>;
  /** Number of students enrolled in course */
  enrolled?: InputMaybe<Scalars['Int']['input']>;
  /** Arbitrary additional information attached to an evaluation */
  extras?: InputMaybe<Scalars['jsonb']['input']>;
  /** Number of students who did not respond */
  no_response?: InputMaybe<Scalars['Int']['input']>;
  /** Number of responses */
  responses?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Evaluation_Statistics_Sum_Fields = {
  __typename?: 'evaluation_statistics_sum_fields';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['float8']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['float8']['output']>;
  /** The course associated with these statistics */
  course_id?: Maybe<Scalars['Int']['output']>;
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Int']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Int']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Int']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type Evaluation_Statistics_Var_Pop_Fields = {
  __typename?: 'evaluation_statistics_var_pop_fields';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Evaluation_Statistics_Var_Samp_Fields = {
  __typename?: 'evaluation_statistics_var_samp_fields';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Evaluation_Statistics_Variance_Fields = {
  __typename?: 'evaluation_statistics_variance_fields';
  /** [computed] Average overall rating */
  avg_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Average workload rating */
  avg_workload?: Maybe<Scalars['Float']['output']>;
  /** The course associated with these statistics */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** Number of students who declined to respond */
  declined?: Maybe<Scalars['Float']['output']>;
  /** Number of students enrolled in course */
  enrolled?: Maybe<Scalars['Float']['output']>;
  /** Number of students who did not respond */
  no_response?: Maybe<Scalars['Float']['output']>;
  /** Number of responses */
  responses?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "flags" */
export type Flags = {
  __typename?: 'flags';
  /** An array relationship */
  course_flags: Array<Course_Flags>;
  /** An aggregate relationship */
  course_flags_aggregate: Course_Flags_Aggregate;
  /** Flag ID */
  flag_id: Scalars['Int']['output'];
  /** Flag text */
  flag_text: Scalars['String']['output'];
};

/** columns and relationships of "flags" */
export type FlagsCourse_FlagsArgs = {
  distinct_on?: InputMaybe<Array<Course_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Flags_Order_By>>;
  where?: InputMaybe<Course_Flags_Bool_Exp>;
};

/** columns and relationships of "flags" */
export type FlagsCourse_Flags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Flags_Order_By>>;
  where?: InputMaybe<Course_Flags_Bool_Exp>;
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
  count: Scalars['Int']['output'];
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
  columns?: InputMaybe<Array<Flags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Flags_Avg_Fields = {
  __typename?: 'flags_avg_fields';
  /** Flag ID */
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "flags". All fields are combined with a logical 'AND'. */
export type Flags_Bool_Exp = {
  _and?: InputMaybe<Array<Flags_Bool_Exp>>;
  _not?: InputMaybe<Flags_Bool_Exp>;
  _or?: InputMaybe<Array<Flags_Bool_Exp>>;
  course_flags?: InputMaybe<Course_Flags_Bool_Exp>;
  course_flags_aggregate?: InputMaybe<Course_Flags_Aggregate_Bool_Exp>;
  flag_id?: InputMaybe<Int_Comparison_Exp>;
  flag_text?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Flags_Max_Fields = {
  __typename?: 'flags_max_fields';
  /** Flag ID */
  flag_id?: Maybe<Scalars['Int']['output']>;
  /** Flag text */
  flag_text?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Flags_Min_Fields = {
  __typename?: 'flags_min_fields';
  /** Flag ID */
  flag_id?: Maybe<Scalars['Int']['output']>;
  /** Flag text */
  flag_text?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "flags". */
export type Flags_Order_By = {
  course_flags_aggregate?: InputMaybe<Course_Flags_Aggregate_Order_By>;
  flag_id?: InputMaybe<Order_By>;
  flag_text?: InputMaybe<Order_By>;
};

/** select columns of table "flags" */
export enum Flags_Select_Column {
  /** column name */
  FlagId = 'flag_id',
  /** column name */
  FlagText = 'flag_text',
}

/** aggregate stddev on columns */
export type Flags_Stddev_Fields = {
  __typename?: 'flags_stddev_fields';
  /** Flag ID */
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Flags_Stddev_Pop_Fields = {
  __typename?: 'flags_stddev_pop_fields';
  /** Flag ID */
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Flags_Stddev_Samp_Fields = {
  __typename?: 'flags_stddev_samp_fields';
  /** Flag ID */
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "flags" */
export type Flags_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Flags_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Flags_Stream_Cursor_Value_Input = {
  /** Flag ID */
  flag_id?: InputMaybe<Scalars['Int']['input']>;
  /** Flag text */
  flag_text?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Flags_Sum_Fields = {
  __typename?: 'flags_sum_fields';
  /** Flag ID */
  flag_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type Flags_Var_Pop_Fields = {
  __typename?: 'flags_var_pop_fields';
  /** Flag ID */
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Flags_Var_Samp_Fields = {
  __typename?: 'flags_var_samp_fields';
  /** Flag ID */
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Flags_Variance_Fields = {
  __typename?: 'flags_variance_fields';
  /** Flag ID */
  flag_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['float8']['input']>;
  _gt?: InputMaybe<Scalars['float8']['input']>;
  _gte?: InputMaybe<Scalars['float8']['input']>;
  _in?: InputMaybe<Array<Scalars['float8']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['float8']['input']>;
  _lte?: InputMaybe<Scalars['float8']['input']>;
  _neq?: InputMaybe<Scalars['float8']['input']>;
  _nin?: InputMaybe<Array<Scalars['float8']['input']>>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
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
  crn: Scalars['Int']['output'];
  /** Listing ID */
  listing_id: Scalars['Int']['output'];
  /** Course number in the given subject (e.g. "120" or "S120") */
  number: Scalars['String']['output'];
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  season: Seasons;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code: Scalars['String']['output'];
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section: Scalars['String']['output'];
  /** Subject the course is listed under (e.g. "AMST") */
  subject: Scalars['String']['output'];
};

/** aggregated selection of "listings" */
export type Listings_Aggregate = {
  __typename?: 'listings_aggregate';
  aggregate?: Maybe<Listings_Aggregate_Fields>;
  nodes: Array<Listings>;
};

export type Listings_Aggregate_Bool_Exp = {
  count?: InputMaybe<Listings_Aggregate_Bool_Exp_Count>;
};

export type Listings_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Listings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Listings_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "listings" */
export type Listings_Aggregate_Fields = {
  __typename?: 'listings_aggregate_fields';
  avg?: Maybe<Listings_Avg_Fields>;
  count: Scalars['Int']['output'];
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
  columns?: InputMaybe<Array<Listings_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "listings" */
export type Listings_Aggregate_Order_By = {
  avg?: InputMaybe<Listings_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Listings_Max_Order_By>;
  min?: InputMaybe<Listings_Min_Order_By>;
  stddev?: InputMaybe<Listings_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Listings_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Listings_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Listings_Sum_Order_By>;
  var_pop?: InputMaybe<Listings_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Listings_Var_Samp_Order_By>;
  variance?: InputMaybe<Listings_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Listings_Avg_Fields = {
  __typename?: 'listings_avg_fields';
  /** Course that the listing refers to */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn?: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "listings" */
export type Listings_Avg_Order_By = {
  /** Course that the listing refers to */
  course_id?: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "listings". All fields are combined with a logical 'AND'. */
export type Listings_Bool_Exp = {
  _and?: InputMaybe<Array<Listings_Bool_Exp>>;
  _not?: InputMaybe<Listings_Bool_Exp>;
  _or?: InputMaybe<Array<Listings_Bool_Exp>>;
  course?: InputMaybe<Courses_Bool_Exp>;
  course_code?: InputMaybe<String_Comparison_Exp>;
  course_id?: InputMaybe<Int_Comparison_Exp>;
  crn?: InputMaybe<Int_Comparison_Exp>;
  listing_id?: InputMaybe<Int_Comparison_Exp>;
  number?: InputMaybe<String_Comparison_Exp>;
  school?: InputMaybe<String_Comparison_Exp>;
  season?: InputMaybe<Seasons_Bool_Exp>;
  season_code?: InputMaybe<String_Comparison_Exp>;
  section?: InputMaybe<String_Comparison_Exp>;
  subject?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Listings_Max_Fields = {
  __typename?: 'listings_max_fields';
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code?: Maybe<Scalars['String']['output']>;
  /** Course that the listing refers to */
  course_id?: Maybe<Scalars['Int']['output']>;
  /** The CRN associated with this listing */
  crn?: Maybe<Scalars['Int']['output']>;
  /** Listing ID */
  listing_id?: Maybe<Scalars['Int']['output']>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number?: Maybe<Scalars['String']['output']>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school?: Maybe<Scalars['String']['output']>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code?: Maybe<Scalars['String']['output']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section?: Maybe<Scalars['String']['output']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "listings" */
export type Listings_Max_Order_By = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code?: InputMaybe<Order_By>;
  /** Course that the listing refers to */
  course_id?: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id?: InputMaybe<Order_By>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number?: InputMaybe<Order_By>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school?: InputMaybe<Order_By>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code?: InputMaybe<Order_By>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section?: InputMaybe<Order_By>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Listings_Min_Fields = {
  __typename?: 'listings_min_fields';
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code?: Maybe<Scalars['String']['output']>;
  /** Course that the listing refers to */
  course_id?: Maybe<Scalars['Int']['output']>;
  /** The CRN associated with this listing */
  crn?: Maybe<Scalars['Int']['output']>;
  /** Listing ID */
  listing_id?: Maybe<Scalars['Int']['output']>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number?: Maybe<Scalars['String']['output']>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school?: Maybe<Scalars['String']['output']>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code?: Maybe<Scalars['String']['output']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section?: Maybe<Scalars['String']['output']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "listings" */
export type Listings_Min_Order_By = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code?: InputMaybe<Order_By>;
  /** Course that the listing refers to */
  course_id?: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id?: InputMaybe<Order_By>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number?: InputMaybe<Order_By>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school?: InputMaybe<Order_By>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code?: InputMaybe<Order_By>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section?: InputMaybe<Order_By>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "listings". */
export type Listings_Order_By = {
  course?: InputMaybe<Courses_Order_By>;
  course_code?: InputMaybe<Order_By>;
  course_id?: InputMaybe<Order_By>;
  crn?: InputMaybe<Order_By>;
  listing_id?: InputMaybe<Order_By>;
  number?: InputMaybe<Order_By>;
  school?: InputMaybe<Order_By>;
  season?: InputMaybe<Seasons_Order_By>;
  season_code?: InputMaybe<Order_By>;
  section?: InputMaybe<Order_By>;
  subject?: InputMaybe<Order_By>;
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

/** aggregate stddev on columns */
export type Listings_Stddev_Fields = {
  __typename?: 'listings_stddev_fields';
  /** Course that the listing refers to */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn?: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "listings" */
export type Listings_Stddev_Order_By = {
  /** Course that the listing refers to */
  course_id?: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Listings_Stddev_Pop_Fields = {
  __typename?: 'listings_stddev_pop_fields';
  /** Course that the listing refers to */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn?: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "listings" */
export type Listings_Stddev_Pop_Order_By = {
  /** Course that the listing refers to */
  course_id?: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Listings_Stddev_Samp_Fields = {
  __typename?: 'listings_stddev_samp_fields';
  /** Course that the listing refers to */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn?: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "listings" */
export type Listings_Stddev_Samp_Order_By = {
  /** Course that the listing refers to */
  course_id?: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "listings" */
export type Listings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Listings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Listings_Stream_Cursor_Value_Input = {
  /** [computed] subject + number (e.g. "AMST 312") */
  course_code?: InputMaybe<Scalars['String']['input']>;
  /** Course that the listing refers to */
  course_id?: InputMaybe<Scalars['Int']['input']>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Scalars['Int']['input']>;
  /** Listing ID */
  listing_id?: InputMaybe<Scalars['Int']['input']>;
  /** Course number in the given subject (e.g. "120" or "S120") */
  number?: InputMaybe<Scalars['String']['input']>;
  /** School (e.g. YC, GS, MG) that the course is listed under */
  school?: InputMaybe<Scalars['String']['input']>;
  /** When the course/listing is being taught, mapping to `seasons` */
  season_code?: InputMaybe<Scalars['String']['input']>;
  /**
   * Course section. Note that the section number is the same for
   *         all cross-listings.
   */
  section?: InputMaybe<Scalars['String']['input']>;
  /** Subject the course is listed under (e.g. "AMST") */
  subject?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Listings_Sum_Fields = {
  __typename?: 'listings_sum_fields';
  /** Course that the listing refers to */
  course_id?: Maybe<Scalars['Int']['output']>;
  /** The CRN associated with this listing */
  crn?: Maybe<Scalars['Int']['output']>;
  /** Listing ID */
  listing_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "listings" */
export type Listings_Sum_Order_By = {
  /** Course that the listing refers to */
  course_id?: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Listings_Var_Pop_Fields = {
  __typename?: 'listings_var_pop_fields';
  /** Course that the listing refers to */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn?: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "listings" */
export type Listings_Var_Pop_Order_By = {
  /** Course that the listing refers to */
  course_id?: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Listings_Var_Samp_Fields = {
  __typename?: 'listings_var_samp_fields';
  /** Course that the listing refers to */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn?: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "listings" */
export type Listings_Var_Samp_Order_By = {
  /** Course that the listing refers to */
  course_id?: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Listings_Variance_Fields = {
  __typename?: 'listings_variance_fields';
  /** Course that the listing refers to */
  course_id?: Maybe<Scalars['Float']['output']>;
  /** The CRN associated with this listing */
  crn?: Maybe<Scalars['Float']['output']>;
  /** Listing ID */
  listing_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "listings" */
export type Listings_Variance_Order_By = {
  /** Course that the listing refers to */
  course_id?: InputMaybe<Order_By>;
  /** The CRN associated with this listing */
  crn?: InputMaybe<Order_By>;
  /** Listing ID */
  listing_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "locations" */
export type Locations = {
  __typename?: 'locations';
  /** An object relationship */
  building: Buildings;
  /** Building code */
  building_code: Scalars['String']['output'];
  /** An array relationship */
  course_meetings: Array<Course_Meetings>;
  location_id: Scalars['Int']['output'];
  /** Room number */
  room?: Maybe<Scalars['String']['output']>;
};

/** columns and relationships of "locations" */
export type LocationsCourse_MeetingsArgs = {
  distinct_on?: InputMaybe<Array<Course_Meetings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Meetings_Order_By>>;
  where?: InputMaybe<Course_Meetings_Bool_Exp>;
};

/** order by aggregate values of table "locations" */
export type Locations_Aggregate_Order_By = {
  avg?: InputMaybe<Locations_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Locations_Max_Order_By>;
  min?: InputMaybe<Locations_Min_Order_By>;
  stddev?: InputMaybe<Locations_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Locations_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Locations_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Locations_Sum_Order_By>;
  var_pop?: InputMaybe<Locations_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Locations_Var_Samp_Order_By>;
  variance?: InputMaybe<Locations_Variance_Order_By>;
};

/** order by avg() on columns of table "locations" */
export type Locations_Avg_Order_By = {
  location_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "locations". All fields are combined with a logical 'AND'. */
export type Locations_Bool_Exp = {
  _and?: InputMaybe<Array<Locations_Bool_Exp>>;
  _not?: InputMaybe<Locations_Bool_Exp>;
  _or?: InputMaybe<Array<Locations_Bool_Exp>>;
  building?: InputMaybe<Buildings_Bool_Exp>;
  building_code?: InputMaybe<String_Comparison_Exp>;
  course_meetings?: InputMaybe<Course_Meetings_Bool_Exp>;
  location_id?: InputMaybe<Int_Comparison_Exp>;
  room?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "locations" */
export type Locations_Max_Order_By = {
  /** Building code */
  building_code?: InputMaybe<Order_By>;
  location_id?: InputMaybe<Order_By>;
  /** Room number */
  room?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "locations" */
export type Locations_Min_Order_By = {
  /** Building code */
  building_code?: InputMaybe<Order_By>;
  location_id?: InputMaybe<Order_By>;
  /** Room number */
  room?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "locations". */
export type Locations_Order_By = {
  building?: InputMaybe<Buildings_Order_By>;
  building_code?: InputMaybe<Order_By>;
  course_meetings_aggregate?: InputMaybe<Course_Meetings_Aggregate_Order_By>;
  location_id?: InputMaybe<Order_By>;
  room?: InputMaybe<Order_By>;
};

/** select columns of table "locations" */
export enum Locations_Select_Column {
  /** column name */
  BuildingCode = 'building_code',
  /** column name */
  LocationId = 'location_id',
  /** column name */
  Room = 'room',
}

/** order by stddev() on columns of table "locations" */
export type Locations_Stddev_Order_By = {
  location_id?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "locations" */
export type Locations_Stddev_Pop_Order_By = {
  location_id?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "locations" */
export type Locations_Stddev_Samp_Order_By = {
  location_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "locations" */
export type Locations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Locations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Locations_Stream_Cursor_Value_Input = {
  /** Building code */
  building_code?: InputMaybe<Scalars['String']['input']>;
  location_id?: InputMaybe<Scalars['Int']['input']>;
  /** Room number */
  room?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "locations" */
export type Locations_Sum_Order_By = {
  location_id?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "locations" */
export type Locations_Var_Pop_Order_By = {
  location_id?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "locations" */
export type Locations_Var_Samp_Order_By = {
  location_id?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "locations" */
export type Locations_Variance_Order_By = {
  location_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "metadata" */
export type Metadata = {
  __typename?: 'metadata';
  id: Scalars['Int']['output'];
  last_update?: Maybe<Scalars['timestamp']['output']>;
};

/** Boolean expression to filter rows from the table "metadata". All fields are combined with a logical 'AND'. */
export type Metadata_Bool_Exp = {
  _and?: InputMaybe<Array<Metadata_Bool_Exp>>;
  _not?: InputMaybe<Metadata_Bool_Exp>;
  _or?: InputMaybe<Array<Metadata_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  last_update?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** Ordering options when selecting data from "metadata". */
export type Metadata_Order_By = {
  id?: InputMaybe<Order_By>;
  last_update?: InputMaybe<Order_By>;
};

/** select columns of table "metadata" */
export enum Metadata_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  LastUpdate = 'last_update',
}

/** Streaming cursor of the table "metadata" */
export type Metadata_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Metadata_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Metadata_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  last_update?: InputMaybe<Scalars['timestamp']['input']>;
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

/** columns and relationships of "professors" */
export type Professors = {
  __typename?: 'professors';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Int']['output']>;
  /** An array relationship */
  course_professors: Array<Course_Professors>;
  /** An aggregate relationship */
  course_professors_aggregate: Course_Professors_Aggregate;
  /** [computed] Number of courses taught */
  courses_taught: Scalars['Int']['output'];
  /** Email address of the professor */
  email?: Maybe<Scalars['String']['output']>;
  /** Name of the professor */
  name: Scalars['String']['output'];
  /** Professor ID */
  professor_id: Scalars['Int']['output'];
};

/** columns and relationships of "professors" */
export type ProfessorsCourse_ProfessorsArgs = {
  distinct_on?: InputMaybe<Array<Course_Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Professors_Order_By>>;
  where?: InputMaybe<Course_Professors_Bool_Exp>;
};

/** columns and relationships of "professors" */
export type ProfessorsCourse_Professors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Professors_Order_By>>;
  where?: InputMaybe<Course_Professors_Bool_Exp>;
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
  count: Scalars['Int']['output'];
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
  columns?: InputMaybe<Array<Professors_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Professors_Avg_Fields = {
  __typename?: 'professors_avg_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses taught */
  courses_taught?: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "professors". All fields are combined with a logical 'AND'. */
export type Professors_Bool_Exp = {
  _and?: InputMaybe<Array<Professors_Bool_Exp>>;
  _not?: InputMaybe<Professors_Bool_Exp>;
  _or?: InputMaybe<Array<Professors_Bool_Exp>>;
  average_rating?: InputMaybe<Float8_Comparison_Exp>;
  average_rating_n?: InputMaybe<Int_Comparison_Exp>;
  course_professors?: InputMaybe<Course_Professors_Bool_Exp>;
  course_professors_aggregate?: InputMaybe<Course_Professors_Aggregate_Bool_Exp>;
  courses_taught?: InputMaybe<Int_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  professor_id?: InputMaybe<Int_Comparison_Exp>;
};

/** aggregate max on columns */
export type Professors_Max_Fields = {
  __typename?: 'professors_max_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Int']['output']>;
  /** [computed] Number of courses taught */
  courses_taught?: Maybe<Scalars['Int']['output']>;
  /** Email address of the professor */
  email?: Maybe<Scalars['String']['output']>;
  /** Name of the professor */
  name?: Maybe<Scalars['String']['output']>;
  /** Professor ID */
  professor_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Professors_Min_Fields = {
  __typename?: 'professors_min_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Int']['output']>;
  /** [computed] Number of courses taught */
  courses_taught?: Maybe<Scalars['Int']['output']>;
  /** Email address of the professor */
  email?: Maybe<Scalars['String']['output']>;
  /** Name of the professor */
  name?: Maybe<Scalars['String']['output']>;
  /** Professor ID */
  professor_id?: Maybe<Scalars['Int']['output']>;
};

/** Ordering options when selecting data from "professors". */
export type Professors_Order_By = {
  average_rating?: InputMaybe<Order_By>;
  average_rating_n?: InputMaybe<Order_By>;
  course_professors_aggregate?: InputMaybe<Course_Professors_Aggregate_Order_By>;
  courses_taught?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  professor_id?: InputMaybe<Order_By>;
};

/** select columns of table "professors" */
export enum Professors_Select_Column {
  /** column name */
  AverageRating = 'average_rating',
  /** column name */
  AverageRatingN = 'average_rating_n',
  /** column name */
  CoursesTaught = 'courses_taught',
  /** column name */
  Email = 'email',
  /** column name */
  Name = 'name',
  /** column name */
  ProfessorId = 'professor_id',
}

/** aggregate stddev on columns */
export type Professors_Stddev_Fields = {
  __typename?: 'professors_stddev_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses taught */
  courses_taught?: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Professors_Stddev_Pop_Fields = {
  __typename?: 'professors_stddev_pop_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses taught */
  courses_taught?: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Professors_Stddev_Samp_Fields = {
  __typename?: 'professors_stddev_samp_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses taught */
  courses_taught?: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "professors" */
export type Professors_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Professors_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Professors_Stream_Cursor_Value_Input = {
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: InputMaybe<Scalars['float8']['input']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: InputMaybe<Scalars['Int']['input']>;
  /** [computed] Number of courses taught */
  courses_taught?: InputMaybe<Scalars['Int']['input']>;
  /** Email address of the professor */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Name of the professor */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Professor ID */
  professor_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Professors_Sum_Fields = {
  __typename?: 'professors_sum_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['float8']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Int']['output']>;
  /** [computed] Number of courses taught */
  courses_taught?: Maybe<Scalars['Int']['output']>;
  /** Professor ID */
  professor_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type Professors_Var_Pop_Fields = {
  __typename?: 'professors_var_pop_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses taught */
  courses_taught?: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Professors_Var_Samp_Fields = {
  __typename?: 'professors_var_samp_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses taught */
  courses_taught?: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Professors_Variance_Fields = {
  __typename?: 'professors_variance_fields';
  /**
   * [computed] Average rating of the professor assessed via
   *         the "Overall assessment" question in courses taught
   */
  average_rating?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses used to compute `average_rating` */
  average_rating_n?: Maybe<Scalars['Float']['output']>;
  /** [computed] Number of courses taught */
  courses_taught?: Maybe<Scalars['Float']['output']>;
  /** Professor ID */
  professor_id?: Maybe<Scalars['Float']['output']>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "buildings" */
  buildings: Array<Buildings>;
  /** fetch data from the table: "buildings" using primary key columns */
  buildings_by_pk?: Maybe<Buildings>;
  /** An array relationship */
  course_flags: Array<Course_Flags>;
  /** An aggregate relationship */
  course_flags_aggregate: Course_Flags_Aggregate;
  /** fetch data from the table: "course_flags" using primary key columns */
  course_flags_by_pk?: Maybe<Course_Flags>;
  /** An array relationship */
  course_meetings: Array<Course_Meetings>;
  /** An array relationship */
  course_professors: Array<Course_Professors>;
  /** An aggregate relationship */
  course_professors_aggregate: Course_Professors_Aggregate;
  /** fetch data from the table: "course_professors" using primary key columns */
  course_professors_by_pk?: Maybe<Course_Professors>;
  /** An array relationship */
  courses: Array<Courses>;
  /** fetch data from the table: "courses" using primary key columns */
  courses_by_pk?: Maybe<Courses>;
  /** An array relationship */
  evaluation_narratives: Array<Evaluation_Narratives>;
  /** An aggregate relationship */
  evaluation_narratives_aggregate: Evaluation_Narratives_Aggregate;
  /** fetch data from the table: "evaluation_narratives" using primary key columns */
  evaluation_narratives_by_pk?: Maybe<Evaluation_Narratives>;
  /** fetch data from the table: "evaluation_questions" */
  evaluation_questions: Array<Evaluation_Questions>;
  /** fetch aggregated fields from the table: "evaluation_questions" */
  evaluation_questions_aggregate: Evaluation_Questions_Aggregate;
  /** fetch data from the table: "evaluation_questions" using primary key columns */
  evaluation_questions_by_pk?: Maybe<Evaluation_Questions>;
  /** An array relationship */
  evaluation_ratings: Array<Evaluation_Ratings>;
  /** An aggregate relationship */
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
  /** An array relationship */
  listings: Array<Listings>;
  /** An aggregate relationship */
  listings_aggregate: Listings_Aggregate;
  /** fetch data from the table: "listings" using primary key columns */
  listings_by_pk?: Maybe<Listings>;
  /** An array relationship */
  locations: Array<Locations>;
  /** fetch data from the table: "locations" using primary key columns */
  locations_by_pk?: Maybe<Locations>;
  /** fetch data from the table: "metadata" */
  metadata: Array<Metadata>;
  /** fetch data from the table: "metadata" using primary key columns */
  metadata_by_pk?: Maybe<Metadata>;
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

export type Query_RootBuildingsArgs = {
  distinct_on?: InputMaybe<Array<Buildings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buildings_Order_By>>;
  where?: InputMaybe<Buildings_Bool_Exp>;
};

export type Query_RootBuildings_By_PkArgs = {
  code: Scalars['String']['input'];
};

export type Query_RootCourse_FlagsArgs = {
  distinct_on?: InputMaybe<Array<Course_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Flags_Order_By>>;
  where?: InputMaybe<Course_Flags_Bool_Exp>;
};

export type Query_RootCourse_Flags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Flags_Order_By>>;
  where?: InputMaybe<Course_Flags_Bool_Exp>;
};

export type Query_RootCourse_Flags_By_PkArgs = {
  course_id: Scalars['Int']['input'];
  flag_id: Scalars['Int']['input'];
};

export type Query_RootCourse_MeetingsArgs = {
  distinct_on?: InputMaybe<Array<Course_Meetings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Meetings_Order_By>>;
  where?: InputMaybe<Course_Meetings_Bool_Exp>;
};

export type Query_RootCourse_ProfessorsArgs = {
  distinct_on?: InputMaybe<Array<Course_Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Professors_Order_By>>;
  where?: InputMaybe<Course_Professors_Bool_Exp>;
};

export type Query_RootCourse_Professors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Professors_Order_By>>;
  where?: InputMaybe<Course_Professors_Bool_Exp>;
};

export type Query_RootCourse_Professors_By_PkArgs = {
  course_id: Scalars['Int']['input'];
  professor_id: Scalars['Int']['input'];
};

export type Query_RootCoursesArgs = {
  distinct_on?: InputMaybe<Array<Courses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Courses_Order_By>>;
  where?: InputMaybe<Courses_Bool_Exp>;
};

export type Query_RootCourses_By_PkArgs = {
  course_id: Scalars['Int']['input'];
};

export type Query_RootEvaluation_NarrativesArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Narratives_Order_By>>;
  where?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
};

export type Query_RootEvaluation_Narratives_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Narratives_Order_By>>;
  where?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
};

export type Query_RootEvaluation_Narratives_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootEvaluation_QuestionsArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Questions_Order_By>>;
  where?: InputMaybe<Evaluation_Questions_Bool_Exp>;
};

export type Query_RootEvaluation_Questions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Questions_Order_By>>;
  where?: InputMaybe<Evaluation_Questions_Bool_Exp>;
};

export type Query_RootEvaluation_Questions_By_PkArgs = {
  question_code: Scalars['String']['input'];
};

export type Query_RootEvaluation_RatingsArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Ratings_Order_By>>;
  where?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
};

export type Query_RootEvaluation_Ratings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Ratings_Order_By>>;
  where?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
};

export type Query_RootEvaluation_Ratings_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootEvaluation_StatisticsArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Statistics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Statistics_Order_By>>;
  where?: InputMaybe<Evaluation_Statistics_Bool_Exp>;
};

export type Query_RootEvaluation_Statistics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Statistics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Statistics_Order_By>>;
  where?: InputMaybe<Evaluation_Statistics_Bool_Exp>;
};

export type Query_RootEvaluation_Statistics_By_PkArgs = {
  course_id: Scalars['Int']['input'];
};

export type Query_RootFlagsArgs = {
  distinct_on?: InputMaybe<Array<Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Flags_Order_By>>;
  where?: InputMaybe<Flags_Bool_Exp>;
};

export type Query_RootFlags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Flags_Order_By>>;
  where?: InputMaybe<Flags_Bool_Exp>;
};

export type Query_RootFlags_By_PkArgs = {
  flag_id: Scalars['Int']['input'];
};

export type Query_RootListingsArgs = {
  distinct_on?: InputMaybe<Array<Listings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Listings_Order_By>>;
  where?: InputMaybe<Listings_Bool_Exp>;
};

export type Query_RootListings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Listings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Listings_Order_By>>;
  where?: InputMaybe<Listings_Bool_Exp>;
};

export type Query_RootListings_By_PkArgs = {
  listing_id: Scalars['Int']['input'];
};

export type Query_RootLocationsArgs = {
  distinct_on?: InputMaybe<Array<Locations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Locations_Order_By>>;
  where?: InputMaybe<Locations_Bool_Exp>;
};

export type Query_RootLocations_By_PkArgs = {
  location_id: Scalars['Int']['input'];
};

export type Query_RootMetadataArgs = {
  distinct_on?: InputMaybe<Array<Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metadata_Order_By>>;
  where?: InputMaybe<Metadata_Bool_Exp>;
};

export type Query_RootMetadata_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootProfessorsArgs = {
  distinct_on?: InputMaybe<Array<Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Professors_Order_By>>;
  where?: InputMaybe<Professors_Bool_Exp>;
};

export type Query_RootProfessors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Professors_Order_By>>;
  where?: InputMaybe<Professors_Bool_Exp>;
};

export type Query_RootProfessors_By_PkArgs = {
  professor_id: Scalars['Int']['input'];
};

export type Query_RootSeasonsArgs = {
  distinct_on?: InputMaybe<Array<Seasons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seasons_Order_By>>;
  where?: InputMaybe<Seasons_Bool_Exp>;
};

export type Query_RootSeasons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Seasons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seasons_Order_By>>;
  where?: InputMaybe<Seasons_Bool_Exp>;
};

export type Query_RootSeasons_By_PkArgs = {
  season_code: Scalars['String']['input'];
};

/** columns and relationships of "seasons" */
export type Seasons = {
  __typename?: 'seasons';
  /** An array relationship */
  courses: Array<Courses>;
  /** An array relationship */
  listings: Array<Listings>;
  /** An aggregate relationship */
  listings_aggregate: Listings_Aggregate;
  /** Season code (e.g. '202001') */
  season_code: Scalars['String']['output'];
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term: Scalars['String']['output'];
  /** [computed] Year of the semester */
  year: Scalars['Int']['output'];
};

/** columns and relationships of "seasons" */
export type SeasonsCoursesArgs = {
  distinct_on?: InputMaybe<Array<Courses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Courses_Order_By>>;
  where?: InputMaybe<Courses_Bool_Exp>;
};

/** columns and relationships of "seasons" */
export type SeasonsListingsArgs = {
  distinct_on?: InputMaybe<Array<Listings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Listings_Order_By>>;
  where?: InputMaybe<Listings_Bool_Exp>;
};

/** columns and relationships of "seasons" */
export type SeasonsListings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Listings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Listings_Order_By>>;
  where?: InputMaybe<Listings_Bool_Exp>;
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
  count: Scalars['Int']['output'];
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
  columns?: InputMaybe<Array<Seasons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Seasons_Avg_Fields = {
  __typename?: 'seasons_avg_fields';
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "seasons". All fields are combined with a logical 'AND'. */
export type Seasons_Bool_Exp = {
  _and?: InputMaybe<Array<Seasons_Bool_Exp>>;
  _not?: InputMaybe<Seasons_Bool_Exp>;
  _or?: InputMaybe<Array<Seasons_Bool_Exp>>;
  courses?: InputMaybe<Courses_Bool_Exp>;
  listings?: InputMaybe<Listings_Bool_Exp>;
  listings_aggregate?: InputMaybe<Listings_Aggregate_Bool_Exp>;
  season_code?: InputMaybe<String_Comparison_Exp>;
  term?: InputMaybe<String_Comparison_Exp>;
  year?: InputMaybe<Int_Comparison_Exp>;
};

/** aggregate max on columns */
export type Seasons_Max_Fields = {
  __typename?: 'seasons_max_fields';
  /** Season code (e.g. '202001') */
  season_code?: Maybe<Scalars['String']['output']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term?: Maybe<Scalars['String']['output']>;
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Seasons_Min_Fields = {
  __typename?: 'seasons_min_fields';
  /** Season code (e.g. '202001') */
  season_code?: Maybe<Scalars['String']['output']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term?: Maybe<Scalars['String']['output']>;
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Int']['output']>;
};

/** Ordering options when selecting data from "seasons". */
export type Seasons_Order_By = {
  courses_aggregate?: InputMaybe<Courses_Aggregate_Order_By>;
  listings_aggregate?: InputMaybe<Listings_Aggregate_Order_By>;
  season_code?: InputMaybe<Order_By>;
  term?: InputMaybe<Order_By>;
  year?: InputMaybe<Order_By>;
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

/** aggregate stddev on columns */
export type Seasons_Stddev_Fields = {
  __typename?: 'seasons_stddev_fields';
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Seasons_Stddev_Pop_Fields = {
  __typename?: 'seasons_stddev_pop_fields';
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Seasons_Stddev_Samp_Fields = {
  __typename?: 'seasons_stddev_samp_fields';
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "seasons" */
export type Seasons_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Seasons_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Seasons_Stream_Cursor_Value_Input = {
  /** Season code (e.g. '202001') */
  season_code?: InputMaybe<Scalars['String']['input']>;
  /** [computed] Season of the semester - one of spring, summer, or fall */
  term?: InputMaybe<Scalars['String']['input']>;
  /** [computed] Year of the semester */
  year?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Seasons_Sum_Fields = {
  __typename?: 'seasons_sum_fields';
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type Seasons_Var_Pop_Fields = {
  __typename?: 'seasons_var_pop_fields';
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Seasons_Var_Samp_Fields = {
  __typename?: 'seasons_var_samp_fields';
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Seasons_Variance_Fields = {
  __typename?: 'seasons_variance_fields';
  /** [computed] Year of the semester */
  year?: Maybe<Scalars['Float']['output']>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "buildings" */
  buildings: Array<Buildings>;
  /** fetch data from the table: "buildings" using primary key columns */
  buildings_by_pk?: Maybe<Buildings>;
  /** fetch data from the table in a streaming manner: "buildings" */
  buildings_stream: Array<Buildings>;
  /** An array relationship */
  course_flags: Array<Course_Flags>;
  /** An aggregate relationship */
  course_flags_aggregate: Course_Flags_Aggregate;
  /** fetch data from the table: "course_flags" using primary key columns */
  course_flags_by_pk?: Maybe<Course_Flags>;
  /** fetch data from the table in a streaming manner: "course_flags" */
  course_flags_stream: Array<Course_Flags>;
  /** An array relationship */
  course_meetings: Array<Course_Meetings>;
  /** fetch data from the table in a streaming manner: "course_meetings" */
  course_meetings_stream: Array<Course_Meetings>;
  /** An array relationship */
  course_professors: Array<Course_Professors>;
  /** An aggregate relationship */
  course_professors_aggregate: Course_Professors_Aggregate;
  /** fetch data from the table: "course_professors" using primary key columns */
  course_professors_by_pk?: Maybe<Course_Professors>;
  /** fetch data from the table in a streaming manner: "course_professors" */
  course_professors_stream: Array<Course_Professors>;
  /** An array relationship */
  courses: Array<Courses>;
  /** fetch data from the table: "courses" using primary key columns */
  courses_by_pk?: Maybe<Courses>;
  /** fetch data from the table in a streaming manner: "courses" */
  courses_stream: Array<Courses>;
  /** An array relationship */
  evaluation_narratives: Array<Evaluation_Narratives>;
  /** An aggregate relationship */
  evaluation_narratives_aggregate: Evaluation_Narratives_Aggregate;
  /** fetch data from the table: "evaluation_narratives" using primary key columns */
  evaluation_narratives_by_pk?: Maybe<Evaluation_Narratives>;
  /** fetch data from the table in a streaming manner: "evaluation_narratives" */
  evaluation_narratives_stream: Array<Evaluation_Narratives>;
  /** fetch data from the table: "evaluation_questions" */
  evaluation_questions: Array<Evaluation_Questions>;
  /** fetch aggregated fields from the table: "evaluation_questions" */
  evaluation_questions_aggregate: Evaluation_Questions_Aggregate;
  /** fetch data from the table: "evaluation_questions" using primary key columns */
  evaluation_questions_by_pk?: Maybe<Evaluation_Questions>;
  /** fetch data from the table in a streaming manner: "evaluation_questions" */
  evaluation_questions_stream: Array<Evaluation_Questions>;
  /** An array relationship */
  evaluation_ratings: Array<Evaluation_Ratings>;
  /** An aggregate relationship */
  evaluation_ratings_aggregate: Evaluation_Ratings_Aggregate;
  /** fetch data from the table: "evaluation_ratings" using primary key columns */
  evaluation_ratings_by_pk?: Maybe<Evaluation_Ratings>;
  /** fetch data from the table in a streaming manner: "evaluation_ratings" */
  evaluation_ratings_stream: Array<Evaluation_Ratings>;
  /** fetch data from the table: "evaluation_statistics" */
  evaluation_statistics: Array<Evaluation_Statistics>;
  /** fetch aggregated fields from the table: "evaluation_statistics" */
  evaluation_statistics_aggregate: Evaluation_Statistics_Aggregate;
  /** fetch data from the table: "evaluation_statistics" using primary key columns */
  evaluation_statistics_by_pk?: Maybe<Evaluation_Statistics>;
  /** fetch data from the table in a streaming manner: "evaluation_statistics" */
  evaluation_statistics_stream: Array<Evaluation_Statistics>;
  /** fetch data from the table: "flags" */
  flags: Array<Flags>;
  /** fetch aggregated fields from the table: "flags" */
  flags_aggregate: Flags_Aggregate;
  /** fetch data from the table: "flags" using primary key columns */
  flags_by_pk?: Maybe<Flags>;
  /** fetch data from the table in a streaming manner: "flags" */
  flags_stream: Array<Flags>;
  /** An array relationship */
  listings: Array<Listings>;
  /** An aggregate relationship */
  listings_aggregate: Listings_Aggregate;
  /** fetch data from the table: "listings" using primary key columns */
  listings_by_pk?: Maybe<Listings>;
  /** fetch data from the table in a streaming manner: "listings" */
  listings_stream: Array<Listings>;
  /** An array relationship */
  locations: Array<Locations>;
  /** fetch data from the table: "locations" using primary key columns */
  locations_by_pk?: Maybe<Locations>;
  /** fetch data from the table in a streaming manner: "locations" */
  locations_stream: Array<Locations>;
  /** fetch data from the table: "metadata" */
  metadata: Array<Metadata>;
  /** fetch data from the table: "metadata" using primary key columns */
  metadata_by_pk?: Maybe<Metadata>;
  /** fetch data from the table in a streaming manner: "metadata" */
  metadata_stream: Array<Metadata>;
  /** fetch data from the table: "professors" */
  professors: Array<Professors>;
  /** fetch aggregated fields from the table: "professors" */
  professors_aggregate: Professors_Aggregate;
  /** fetch data from the table: "professors" using primary key columns */
  professors_by_pk?: Maybe<Professors>;
  /** fetch data from the table in a streaming manner: "professors" */
  professors_stream: Array<Professors>;
  /** fetch data from the table: "seasons" */
  seasons: Array<Seasons>;
  /** fetch aggregated fields from the table: "seasons" */
  seasons_aggregate: Seasons_Aggregate;
  /** fetch data from the table: "seasons" using primary key columns */
  seasons_by_pk?: Maybe<Seasons>;
  /** fetch data from the table in a streaming manner: "seasons" */
  seasons_stream: Array<Seasons>;
};

export type Subscription_RootBuildingsArgs = {
  distinct_on?: InputMaybe<Array<Buildings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Buildings_Order_By>>;
  where?: InputMaybe<Buildings_Bool_Exp>;
};

export type Subscription_RootBuildings_By_PkArgs = {
  code: Scalars['String']['input'];
};

export type Subscription_RootBuildings_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Buildings_Stream_Cursor_Input>>;
  where?: InputMaybe<Buildings_Bool_Exp>;
};

export type Subscription_RootCourse_FlagsArgs = {
  distinct_on?: InputMaybe<Array<Course_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Flags_Order_By>>;
  where?: InputMaybe<Course_Flags_Bool_Exp>;
};

export type Subscription_RootCourse_Flags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Flags_Order_By>>;
  where?: InputMaybe<Course_Flags_Bool_Exp>;
};

export type Subscription_RootCourse_Flags_By_PkArgs = {
  course_id: Scalars['Int']['input'];
  flag_id: Scalars['Int']['input'];
};

export type Subscription_RootCourse_Flags_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Course_Flags_Stream_Cursor_Input>>;
  where?: InputMaybe<Course_Flags_Bool_Exp>;
};

export type Subscription_RootCourse_MeetingsArgs = {
  distinct_on?: InputMaybe<Array<Course_Meetings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Meetings_Order_By>>;
  where?: InputMaybe<Course_Meetings_Bool_Exp>;
};

export type Subscription_RootCourse_Meetings_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Course_Meetings_Stream_Cursor_Input>>;
  where?: InputMaybe<Course_Meetings_Bool_Exp>;
};

export type Subscription_RootCourse_ProfessorsArgs = {
  distinct_on?: InputMaybe<Array<Course_Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Professors_Order_By>>;
  where?: InputMaybe<Course_Professors_Bool_Exp>;
};

export type Subscription_RootCourse_Professors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Course_Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Course_Professors_Order_By>>;
  where?: InputMaybe<Course_Professors_Bool_Exp>;
};

export type Subscription_RootCourse_Professors_By_PkArgs = {
  course_id: Scalars['Int']['input'];
  professor_id: Scalars['Int']['input'];
};

export type Subscription_RootCourse_Professors_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Course_Professors_Stream_Cursor_Input>>;
  where?: InputMaybe<Course_Professors_Bool_Exp>;
};

export type Subscription_RootCoursesArgs = {
  distinct_on?: InputMaybe<Array<Courses_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Courses_Order_By>>;
  where?: InputMaybe<Courses_Bool_Exp>;
};

export type Subscription_RootCourses_By_PkArgs = {
  course_id: Scalars['Int']['input'];
};

export type Subscription_RootCourses_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Courses_Stream_Cursor_Input>>;
  where?: InputMaybe<Courses_Bool_Exp>;
};

export type Subscription_RootEvaluation_NarrativesArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Narratives_Order_By>>;
  where?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
};

export type Subscription_RootEvaluation_Narratives_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Narratives_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Narratives_Order_By>>;
  where?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
};

export type Subscription_RootEvaluation_Narratives_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootEvaluation_Narratives_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Evaluation_Narratives_Stream_Cursor_Input>>;
  where?: InputMaybe<Evaluation_Narratives_Bool_Exp>;
};

export type Subscription_RootEvaluation_QuestionsArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Questions_Order_By>>;
  where?: InputMaybe<Evaluation_Questions_Bool_Exp>;
};

export type Subscription_RootEvaluation_Questions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Questions_Order_By>>;
  where?: InputMaybe<Evaluation_Questions_Bool_Exp>;
};

export type Subscription_RootEvaluation_Questions_By_PkArgs = {
  question_code: Scalars['String']['input'];
};

export type Subscription_RootEvaluation_Questions_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Evaluation_Questions_Stream_Cursor_Input>>;
  where?: InputMaybe<Evaluation_Questions_Bool_Exp>;
};

export type Subscription_RootEvaluation_RatingsArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Ratings_Order_By>>;
  where?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
};

export type Subscription_RootEvaluation_Ratings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Ratings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Ratings_Order_By>>;
  where?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
};

export type Subscription_RootEvaluation_Ratings_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootEvaluation_Ratings_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Evaluation_Ratings_Stream_Cursor_Input>>;
  where?: InputMaybe<Evaluation_Ratings_Bool_Exp>;
};

export type Subscription_RootEvaluation_StatisticsArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Statistics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Statistics_Order_By>>;
  where?: InputMaybe<Evaluation_Statistics_Bool_Exp>;
};

export type Subscription_RootEvaluation_Statistics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Evaluation_Statistics_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Evaluation_Statistics_Order_By>>;
  where?: InputMaybe<Evaluation_Statistics_Bool_Exp>;
};

export type Subscription_RootEvaluation_Statistics_By_PkArgs = {
  course_id: Scalars['Int']['input'];
};

export type Subscription_RootEvaluation_Statistics_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Evaluation_Statistics_Stream_Cursor_Input>>;
  where?: InputMaybe<Evaluation_Statistics_Bool_Exp>;
};

export type Subscription_RootFlagsArgs = {
  distinct_on?: InputMaybe<Array<Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Flags_Order_By>>;
  where?: InputMaybe<Flags_Bool_Exp>;
};

export type Subscription_RootFlags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Flags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Flags_Order_By>>;
  where?: InputMaybe<Flags_Bool_Exp>;
};

export type Subscription_RootFlags_By_PkArgs = {
  flag_id: Scalars['Int']['input'];
};

export type Subscription_RootFlags_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Flags_Stream_Cursor_Input>>;
  where?: InputMaybe<Flags_Bool_Exp>;
};

export type Subscription_RootListingsArgs = {
  distinct_on?: InputMaybe<Array<Listings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Listings_Order_By>>;
  where?: InputMaybe<Listings_Bool_Exp>;
};

export type Subscription_RootListings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Listings_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Listings_Order_By>>;
  where?: InputMaybe<Listings_Bool_Exp>;
};

export type Subscription_RootListings_By_PkArgs = {
  listing_id: Scalars['Int']['input'];
};

export type Subscription_RootListings_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Listings_Stream_Cursor_Input>>;
  where?: InputMaybe<Listings_Bool_Exp>;
};

export type Subscription_RootLocationsArgs = {
  distinct_on?: InputMaybe<Array<Locations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Locations_Order_By>>;
  where?: InputMaybe<Locations_Bool_Exp>;
};

export type Subscription_RootLocations_By_PkArgs = {
  location_id: Scalars['Int']['input'];
};

export type Subscription_RootLocations_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Locations_Stream_Cursor_Input>>;
  where?: InputMaybe<Locations_Bool_Exp>;
};

export type Subscription_RootMetadataArgs = {
  distinct_on?: InputMaybe<Array<Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Metadata_Order_By>>;
  where?: InputMaybe<Metadata_Bool_Exp>;
};

export type Subscription_RootMetadata_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootMetadata_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Metadata_Stream_Cursor_Input>>;
  where?: InputMaybe<Metadata_Bool_Exp>;
};

export type Subscription_RootProfessorsArgs = {
  distinct_on?: InputMaybe<Array<Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Professors_Order_By>>;
  where?: InputMaybe<Professors_Bool_Exp>;
};

export type Subscription_RootProfessors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Professors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Professors_Order_By>>;
  where?: InputMaybe<Professors_Bool_Exp>;
};

export type Subscription_RootProfessors_By_PkArgs = {
  professor_id: Scalars['Int']['input'];
};

export type Subscription_RootProfessors_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Professors_Stream_Cursor_Input>>;
  where?: InputMaybe<Professors_Bool_Exp>;
};

export type Subscription_RootSeasonsArgs = {
  distinct_on?: InputMaybe<Array<Seasons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seasons_Order_By>>;
  where?: InputMaybe<Seasons_Bool_Exp>;
};

export type Subscription_RootSeasons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Seasons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Seasons_Order_By>>;
  where?: InputMaybe<Seasons_Bool_Exp>;
};

export type Subscription_RootSeasons_By_PkArgs = {
  season_code: Scalars['String']['input'];
};

export type Subscription_RootSeasons_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Seasons_Stream_Cursor_Input>>;
  where?: InputMaybe<Seasons_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};
