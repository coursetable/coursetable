// A couple common types.

export type Season = string;
export type NetId = string;
export type Crn = number;

export const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
export type Weekdays = typeof weekdays[number];
