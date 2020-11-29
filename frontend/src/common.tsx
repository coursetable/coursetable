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
] as const;
export type Weekdays = typeof weekdays[number];
