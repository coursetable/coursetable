import { expectType, TypeOf } from 'ts-expect';
import { CatalogBySeasonQuery } from '../generated/graphql';

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

type _RawListingResponse =
  CatalogBySeasonQuery['computed_listing_info'][number];
type _ListingOverrides = {
  season_code: Season;

  // Narrow some of the JSON types.
  all_course_codes: string[];
  areas: string[];
  skills: string[];
  professor_names: string[];
  times_by_day: Partial<
    Record<
      Weekdays,
      [
        startTime: string,
        endTime: string,
        location: string,
        locationURL: string,
      ][] // an array because there could by multiple times per day
    >
  >;
};
type _ListingAugments = {
  // Add a couple types created by the preprocessing step.
  professors?: string;
  professor_avg_rating?: string;
  color?: string;
  border?: string;
  start_time?: moment.Moment;
  location_url?: string;
  current_worksheet?: string;
};
expectType<
  // Make sure we don't override a key that wasn't there originally.
  TypeOf<keyof _RawListingResponse, keyof _ListingOverrides>
>(true);
export type Listing = Omit<_RawListingResponse, keyof _ListingOverrides> &
  _ListingOverrides &
  _ListingAugments;
