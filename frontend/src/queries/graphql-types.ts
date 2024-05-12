// These types are branded so you never pass the wrong thing
declare const type: unique symbol;
export type Season = string & { [type]: 'season' };
export type NetId = string & { [type]: 'netid' };
export type Crn = number & { [type]: 'crn' };
export type ExtraInfo =
  | 'ACTIVE'
  | 'MOVED_TO_SPRING_TERM'
  | 'CANCELLED'
  | 'MOVED_TO_FALL_TERM'
  | 'CLOSED'
  | 'NUMBER_CHANGED';
export type StringArr = string[];
export type NumberArr = number[];

export const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
export type Weekdays = (typeof weekdays)[number];
export type TimesByDay = {
  [day in Weekdays]?: [
    startTime: string,
    endTime: string,
    location: string,
    locationURL: string,
  ][];
};
export type ProfessorInfo = {
  average_rating: number;
  email: string;
  name: string;
}[];
