import { isDiscussionSection, toRangeTime, toWeekdayStrings } from './course';
import type { CatalogListing } from '../queries/api';

type Meeting = {
  days_of_week: number;
  start_time: string;
  end_time: string;
};

/**
 * @returns Hours spent in class per week across all meetings
 */
export function getWeeklyMeetingHours(meetings: Meeting[]): number {
  return meetings.reduce(
    (total, m) =>
      total +
      // Range times are in 5-minute units, so 12 units make an hour
      (toWeekdayStrings(m.days_of_week).length *
        Math.max(0, toRangeTime(m.end_time) - toRangeTime(m.start_time))) /
        12,
    0,
  );
}

export type ClassHoursSummary = {
  hours: number;
  // Courses that contributed hours
  courseCount: number;
  // Labels of courses with no scheduled times
  missing: string[];
};

// A lecture and its discussion sections share a course code
export const classHoursLabel = (listing: CatalogListing) =>
  isDiscussionSection(listing.course)
    ? `${listing.course_code} section ${listing.course.section}`
    : listing.course_code;

/**
 * Sums weekly class hours for listings already deduplicated by the caller.
 */
export function summarizeClassHours(
  listings: readonly CatalogListing[],
): ClassHoursSummary {
  const summary: ClassHoursSummary = {
    hours: 0,
    courseCount: 0,
    missing: [],
  };
  const withoutHours: CatalogListing[] = [];
  const codesWithHours = new Set<string>();
  // First pass counts only real scheduled times, so that a sibling section's
  // actual times can suppress the second pass's "missing" report
  for (const listing of listings) {
    const { course } = listing;
    const hours = getWeeklyMeetingHours(course.course_meetings);
    if (hours === 0) {
      withoutHours.push(listing);
      continue;
    }
    summary.hours += hours;
    summary.courseCount++;
    for (const l of course.listings) codesWithHours.add(l.course_code);
  }
  for (const listing of withoutHours) {
    // Another section of the same course already has times, e.g. a lab's
    // umbrella listing whose times live on its lettered sections
    if (listing.course.listings.some((l) => codesWithHours.has(l.course_code)))
      continue;
    summary.missing.push(classHoursLabel(listing));
  }
  return summary;
}
