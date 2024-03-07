import { expectType, type TypeOf } from 'ts-expect';
import type { ListingFragment } from '../generated/graphql';
import chroma from 'chroma-js';

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
// Stable based on crn and season
const startColor = '#aab8c2'; // Lighter grey
const endColor = '#7eb6ff'; // Lighter blue
export function generateRandomColor(identifier: string) {
  // Calculate a hash from the identifier
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }

  // Normalize the hash to a value between 0 and 1 to use it for color interpolation
  const normalizedHash = (Math.abs(hash) % 1000) / 1000;

  // Interpolate between startColor and endColor based on normalizedHash
  const color = chroma.scale([startColor, endColor])(normalizedHash).hex();

  return color;
}
