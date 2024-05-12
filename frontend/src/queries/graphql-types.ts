import z from 'zod';

// These types are branded because they represent opaque identifiers. You would
// never dynamically generate them or manipulate them.
export const seasonSchema = z.string().brand('season');
export const netIdSchema = z.string().brand('netid');
export const crnSchema = z.number().brand('crn');

export type Season = z.infer<typeof seasonSchema>;
export type NetId = z.infer<typeof netIdSchema>;
export type Crn = z.infer<typeof crnSchema>;

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
