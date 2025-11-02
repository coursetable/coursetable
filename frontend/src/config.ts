import type { Season } from './queries/graphql-types';

export const isDev = import.meta.env.DEV;

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export const GRAPHQL_API_ENDPOINT = isDev
  ? 'https://localhost:8085'
  : `${import.meta.env.VITE_API_ENDPOINT}/ferry`;

// Used for which season to show by default in catalog and worksheet
export const CUR_SEASON = '202601' as Season;

// Courses in the current year have no evaluations yet
export const CUR_YEAR = ['202502', '202503', '202601'] as Season[];

// We use this format to avoid dealing with time zones.
// TODO: this should be a Temporal.PlainDate
export type SimpleDate = [year: number, month: number, day: number];

export type SeasonCalendar = {
  /**
   * The first day of class. Note that for spring term this may be MLK day
   * which is also a holiday, but we still treat as if semester starts.
   */
  start: SimpleDate;
  /**
   * The last day of class (class still happens that day).
   */
  end: SimpleDate;
  /**
   * Each entry has a start date and an end date. The start date
   * is the first day without classes, and the end date is the
   * last day without classes.
   */
  breaks: { name: string; start: SimpleDate; end: SimpleDate }[];
  /**
   * A list of transfer schedules. On that date, class that meet on `day` (1–5)
   * meet instead.
   */
  transfers: { date: SimpleDate; day: number }[];
};

// TODO: instead of hardcoding every year, we should crawl this using Ferry
// and store it in the database
// To find historical seasons: https://registrar.yale.edu/sites/default/files/files/2021-2022_Yale%20College%20Calendar%20with%20Pertinent%20Deadlines%20_%20Yale%20University.pdf
// (Goes back to 2016–2017)
// Use fully-closed indexing, i.e. "start" and "end" both included
// For breaks, the academic calendar uses wordings such as "begins after the
// last academic obligations"—in this case, it actually starts on the next day
export const academicCalendars: { [season: Season]: SeasonCalendar } = {
  ['202203' as Season]: {
    start: [2022, 8, 31],
    end: [2022, 12, 9],
    breaks: [
      {
        name: 'Labor Day',
        start: [2022, 9, 5],
        end: [2022, 9, 5],
      },
      {
        name: 'October recess',
        start: [2022, 10, 19],
        end: [2022, 10, 23],
      },
      {
        name: 'November recess',
        start: [2022, 11, 19],
        end: [2022, 11, 27],
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
        end: [2023, 1, 16],
      },
      {
        name: 'Spring recess',
        start: [2023, 3, 11],
        end: [2023, 3, 26],
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
        end: [2023, 9, 4],
      },
      {
        name: 'October recess',
        start: [2023, 10, 18],
        end: [2023, 10, 22],
      },
      {
        name: 'November recess',
        start: [2023, 11, 18],
        end: [2023, 11, 26],
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
        end: [2024, 1, 15],
      },
      {
        name: 'Spring recess',
        start: [2024, 3, 9],
        end: [2024, 3, 24],
      },
    ],
    transfers: [{ date: [2024, 1, 19], day: 1 }],
  },
  ['202403' as Season]: {
    start: [2024, 8, 28],
    end: [2024, 12, 7],
    breaks: [
      {
        name: 'Labor Day',
        start: [2024, 9, 2],
        end: [2024, 9, 2],
      },
      {
        name: 'October recess',
        start: [2024, 10, 16],
        end: [2024, 10, 20],
      },
      {
        name: 'November recess',
        start: [2024, 11, 23],
        end: [2024, 12, 1],
      },
    ],
    transfers: [{ date: [2024, 8, 30], day: 1 }],
  },
  ['202501' as Season]: {
    start: [2025, 1, 13],
    end: [2025, 4, 25],
    breaks: [
      {
        name: 'Martin Luther King Jr. Day',
        start: [2025, 1, 20],
        end: [2025, 1, 20],
      },
      {
        name: 'Spring recess',
        start: [2025, 3, 8],
        end: [2025, 3, 23],
      },
    ],
    transfers: [{ date: [2025, 1, 24], day: 1 }],
  },
  ['202503' as Season]: {
    start: [2025, 8, 27],
    end: [2025, 12, 5],
    breaks: [
      {
        name: 'Labor Day',
        start: [2025, 9, 1],
        end: [2025, 9, 1],
      },
      {
        name: 'October recess',
        start: [2025, 10, 15],
        end: [2025, 10, 19],
      },
      {
        name: 'November recess',
        start: [2025, 11, 22],
        end: [2025, 11, 30],
      },
    ],
    transfers: [{ date: [2025, 8, 29], day: 1 }],
  },
  ['202601' as Season]: {
    start: [2026, 1, 12],
    end: [2026, 4, 24],
    breaks: [
      {
        name: 'Martin Luther King Jr. Day',
        start: [2026, 1, 19],
        end: [2026, 1, 19],
      },
      {
        name: 'Spring recess',
        start: [2026, 3, 6],
        end: [2026, 3, 23],
      },
    ],
    transfers: [{ date: [2026, 1, 23], day: 1 }],
  },
  // Add more entries above, but don't remove any
};
