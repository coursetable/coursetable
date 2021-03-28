export interface CourseEvaluation {
  names: CourseName[];
  comments: EvaluationComment;
  long_title: string;
  season: string;
  ratings: EvaluationRatings;
  professors: string[];
}

export interface EvaluationComment {
  knowledge?: string[];
  strengthsWeaknesses?: string[];
  recommend?: string[];
}

export const ratingTypes = [
  'rating',
  'workload',
  'engagement',
  'organization',
  'feedback',
  'challenge',
];

export interface EvaluationRatings {
  rating: number[];
  workload: number[];
  engagement?: number[];
  organization?: number[];
  feedback?: number[];
  challenge?: number[];
}

export interface CourseName {
  subject: string;
  number: string;
  section: string;
}

/** A Course object with extra fields added by init.js */
export interface CourseWithExtras extends Course {
  taken_before: FriendTakenCourse[];
  num_friends: number;
  friends: FriendInfo[];
}

export interface Course {
  course_name_id: string;
  subject: string;
  number: string;
  section: string;
  oci_id: string;
  title: string;
  long_title: string;
  description: string;
  requirements: string;
  exam_group: number;
  extra_info: string;
  syllabus_url: string;
  course_home_url: string;
  row: number;
  exam_timestamp: string;
  professors: string[];
  skills: string[];
  areas: string[];
  flags: string[];
  average: RatingAverages;
  num_students: string;
  num_students_is_same_prof: boolean;
  evaluations: Evaluations;
  locations_summary: string;
  location_times: LocationTimes;
  times: Times;
  codes: CourseNameWithId[];
  oci_ids: string[];
  row_id: number;
}

export interface RatingAverages {
  same_both: RatingSummary | null;
  same_class: RatingSummary | null;
  same_professors: RatingSummary | null;
}

export interface RatingSummary {
  rating: number;
  workload: number;
  engagement?: number;
  organization?: number;
  feedback?: number;
  challenge?: number;
  major?: number;
}

export interface CourseNameWithId extends CourseName {
  row_id: number;
}

export interface Evaluations {
  same_both: EvaluationSummary[];
  same_class: EvaluationSummary[];
  same_professors: EvaluationSummary[];
}

export interface EvaluationSummary {
  id: string;
  season: string;
  year: number;
  term: Term;
  enrollment: string;
  average: RatingSummary;
  names: CourseName[];
}

export enum Term {
  Fall = 'Fall',
  Spring = 'Spring',
  Summer = 'Summer',
}

export interface LocationTimes {
  [location: string]: string[];
}

export interface Times {
  summary: string;
  long_summary: string;
  by_day: ByDay;
}

export interface ByDay {
  Monday?: string[][];
  Tuesday?: string[][];
  Wednesday?: string[][];
  Thursday?: string[][];
  Friday?: string[][];
  Saturday?: string[][];
  Sunday?: string[][];
}

export interface FriendTakenCourse {
  name: string;
  season: string;
}

export interface FriendInfo {
  name: string;
  facebookId: string;
}
