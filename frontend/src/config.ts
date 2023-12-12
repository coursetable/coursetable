export const isDev = import.meta.env.DEV;

export const API_ENDPOINT = isDev
  ? 'https://localhost:3001'
  : import.meta.env.VITE_API_ENDPOINT;

export const GRAPHQL_API_ENDPOINT = isDev
  ? 'https://localhost:8085'
  : import.meta.env.VITE_API_ENDPOINT + '/ferry';

// Used for which season to show by default in catalog
export const CUR_SEASON = '202401';

// We use this format to avoid dealing with time zones.
// TODO: this should be a Temporal.ZonedDateTime
export type SimpleDate = [year: number, month: number, day: number];

export type SeasonCalendar = {
  /**
   * The first day of class.
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

// TODO: move to api?
export const academicCalendars: { [season: string]: SeasonCalendar } = {
  202303: {
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
  202401: {
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
