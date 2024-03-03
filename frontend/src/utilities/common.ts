import { expectType, type TypeOf } from 'ts-expect';
import type { ListingFragment } from '../generated/graphql';

// A couple common types.

// These types are branded so you never pass the wrong thing
declare const type: unique symbol;
export type Season = string & { [type]: 'season' };
export type NetId = string & { [type]: 'netid' };
export type Crn = number & { [type]: 'crn' };

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

// TODO: can this narrowing be done within graphql-codegen?
export type NarrowListing<T extends ListingFragment> = Omit<
  T,
  keyof ListingOverrides
> &
  ListingOverrides;
type ListingOverrides = {
  crn: Crn;
  season_code: Season;
  extra_info:
    | 'ACTIVE'
    | 'MOVED_TO_SPRING_TERM'
    | 'CANCELLED'
    | 'MOVED_TO_FALL_TERM'
    | 'CLOSED'
    | 'NUMBER_CHANGED';

  // Narrow some of the JSON types.
  all_course_codes: string[];
  areas: string[];
  flag_info: string[];
  skills: string[];
  professor_ids: string[];
  professor_names: string[];
  times_by_day: Partial<{
    [day in Weekdays]: [
      startTime: string,
      endTime: string,
      location: string,
      locationURL: string,
    ][];
  }>;
};

expectType<
  // Make sure we don't override a key that wasn't there originally.
  TypeOf<keyof ListingFragment, keyof ListingOverrides>
>(true);
export type Listing = NarrowListing<ListingFragment>;

export function isEqual<T>(a: T, b: T): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => isEqual(b[i], x));
  } else if (a && typeof a === 'object' && b && typeof b === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => isEqual(a[key as never], b[key as never]));
  }
  return a === b;
}

export function generateRandomColor(colorMap: chroma.Scale) {
  return colorMap(Math.random() * 4 + 1).hex();
}
