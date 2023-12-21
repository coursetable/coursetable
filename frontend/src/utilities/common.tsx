import { expectType, type TypeOf } from 'ts-expect';
import type { CatalogBySeasonQuery } from '../generated/graphql';

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
export type Weekdays = (typeof weekdays)[number];

type RawListingResponse = CatalogBySeasonQuery['computed_listing_info'][number];
type ListingOverrides = {
  season_code: Season;

  // Narrow some of the JSON types.
  all_course_codes: string[];
  areas: string[];
  skills: string[];
  professor_names: string[];
  times_by_day: Partial<
    { [key: Weekdays]: [
        startTime: string,
        endTime: string,
        location: string,
        locationURL: string,
      ][] }
  >;
};
type ListingAugments = {
  // Add a couple types created by the preprocessing step.
  professors?: string;
  professor_avg_rating?: string;
  color?: string;
  border?: string;
  start_time?: moment.Moment;
  location_url?: string;
  currentWorksheet?: string;
};
expectType<
  // Make sure we don't override a key that wasn't there originally.
  TypeOf<keyof RawListingResponse, keyof ListingOverrides>
>(true);
export type Listing = Omit<RawListingResponse, keyof ListingOverrides> &
  ListingOverrides &
  ListingAugments;
