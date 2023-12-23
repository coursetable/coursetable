import type { Season } from './utilities/common';

export const isDev = import.meta.env.DEV;

export const API_ENDPOINT = isDev
  ? 'https://localhost:3001'
  : import.meta.env.VITE_API_ENDPOINT;

export const GRAPHQL_API_ENDPOINT = isDev
  ? 'https://localhost:8085'
  : `${import.meta.env.VITE_API_ENDPOINT}/ferry`;

// Used for which season to show by default in catalog and worksheet
export const CUR_SEASON = '202401' as Season;

// Courses in the current year have no evaluations yet
export const CUR_YEAR = ['202303', '202401'] as Season[];

// We use this format to avoid dealing with time zones.
// TODO: this should be a Temporal.ZonedDateTime
export type SimpleDate = [year: number, month: number, day: number];

export type SeasonCalendar = {
  /**
   * The first day of class. Note that for spring term this will be MLK day
   * which is also a holiday, but semester starts on Monday always.
   */
  start: SimpleDate;
  /**
   * The last day of class (class still happens that day).
   */
  end: SimpleDate;
  /**
   * Each entry has a start date and an end date. The start date
   * is the first day without classes, and the end date is the
   * first day with classes.
   */
  breaks: { name: string; start: SimpleDate; end: SimpleDate }[];
  /**
   * A list of transfer schedules. On that date, class that meet on `day` (1–5)
   * meet instead.
   */
  transfers: { date: SimpleDate; day: number }[];
};

// TODO: instead of hardcoding every year, we should compute this, because
// each time point is always the same day of the week.
export const academicCalendars: { [season: Season]: SeasonCalendar } = {
  ['202203' as Season]: {
    start: [2022, 8, 31],
    end: [2022, 12, 9],
    breaks: [
      {
        name: 'Labor Day',
        start: [2022, 9, 5],
        end: [2022, 9, 6],
      },
      {
        name: 'October recess',
        start: [2022, 10, 19],
        end: [2022, 10, 24],
      },
      {
        name: 'November recess',
        start: [2022, 11, 19],
        end: [2022, 11, 28],
      },
    ],
    transfers: [{ date: [2022, 9, 2], day: 1 }],
  },
  ['202301' as Season]: {
    start: [2023, 1, 16],
    end: [2023, 4, 28],
    breaks: [
      {
        name: 'Martin Luther King Jr. Day',
        start: [2023, 1, 16],
        end: [2023, 1, 17],
      },
      {
        name: 'Spring recess',
        start: [2023, 3, 11],
        end: [2023, 3, 27],
      },
    ],
    transfers: [{ date: [2023, 1, 20], day: 1 }],
  },
  ['202303' as Season]: {
    start: [2023, 8, 30],
    end: [2023, 12, 8],
    breaks: [
      {
        name: 'Labor Day',
        start: [2023, 9, 4],
        end: [2023, 9, 5],
      },
      {
        name: 'October recess',
        start: [2023, 10, 18],
        end: [2023, 10, 23],
      },
      {
        name: 'November recess',
        start: [2023, 11, 18],
        end: [2023, 11, 27],
      },
    ],
    transfers: [{ date: [2023, 9, 1], day: 1 }],
  },
  ['202401' as Season]: {
    start: [2024, 1, 15],
    end: [2024, 4, 26],
    breaks: [
      {
        name: 'Martin Luther King Jr. Day',
        start: [2024, 1, 15],
        end: [2024, 1, 16],
      },
      {
        name: 'Spring recess',
        start: [2024, 3, 9],
        end: [2024, 3, 25],
      },
    ],
    transfers: [{ date: [2024, 1, 19], day: 1 }],
  },
  // Add more entries above, but don't remove any
};
