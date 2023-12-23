import { expectType, type TypeOf } from 'ts-expect';
import type { CatalogBySeasonQuery } from '../generated/graphql';

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

type RawListingResponse = CatalogBySeasonQuery['computed_listing_info'][number];
type ListingOverrides = {
  crn: Crn;
  season_code: Season;

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
type ListingAugments = {
  // TODO: this should be in the worksheet data structure
  color?: [number, number, number];
  currentWorksheet?: string;
};
expectType<
  // Make sure we don't override a key that wasn't there originally.
  TypeOf<keyof RawListingResponse, keyof ListingOverrides>
>(true);
export type Listing = Omit<RawListingResponse, keyof ListingOverrides> &
  ListingOverrides &
  ListingAugments;

export function isEqual(a: unknown[], b: []): boolean;
export function isEqual(a: [], b: unknown[]): boolean;
export function isEqual<T extends string | number | boolean>(
  a: T[],
  b: T[],
): boolean;
export function isEqual<T extends string | number | boolean>(a: T[], b: T[]) {
  if (a.length !== b.length) return false;
  return a.every((x, i) => b[i] === x);
}
