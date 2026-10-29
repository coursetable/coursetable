import { isDiscussionSection, toRangeTime, toWeekdayStrings } from './course';
import type { CatalogListing } from '../queries/api';
import type { Season } from '../queries/graphql-types';

type Meeting = {
  days_of_week: number;
  start_time: string;
  end_time: string;
};

export type PastOffering = {
  same_course_id: number;
  season_code: Season;
  section: string;
  course_meetings: Meeting[];
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

/**
 * Picks an offering from the most recent earlier season to borrow meeting
 * times from. Only offerings of the same kind (lecture vs. discussion section)
 * are considered, since their schedules differ. Within that season, the same
 * section number is preferred, then the lowest section.
 *
 * Older seasons are deliberately not searched: if the course had no times last
 * time either, it's likely a placeholder (e.g. a lab's umbrella listing whose
 * times live on its lettered sections), and very old offerings sometimes list
 * every section's times under one course.
 */
export function findLatestPastOffering(
  offerings: readonly PastOffering[],
  course: { same_course_id: number; season_code: Season; section: string },
): PastOffering | undefined {
  const isDiscussion = isDiscussionSection(course);
  const candidates = offerings.filter(
    (o) =>
      o.same_course_id === course.same_course_id &&
      o.season_code < course.season_code &&
      isDiscussionSection(o) === isDiscussion,
  );
  const latestSeason = candidates.reduce<Season | undefined>(
    (latest, o) =>
      latest === undefined || o.season_code > latest ? o.season_code : latest,
    undefined,
  );
  const rank = (o: PastOffering) => (o.section === course.section ? 0 : 1);
  let best: PastOffering | undefined = undefined;
  for (const o of candidates) {
    if (
      o.season_code !== latestSeason ||
      getWeeklyMeetingHours(o.course_meetings) === 0
    )
      continue;
    if (
      !best ||
      rank(o) < rank(best) ||
      (rank(o) === rank(best) &&
        o.section.localeCompare(best.section, 'en-US', { numeric: true }) < 0)
    )
      best = o;
  }
  return best;
}

export type ClassHoursEstimate = {
  label: string;
  pastOffering: PastOffering;
  hours: number;
};

export type ClassHoursSummary = {
  hours: number;
  // Courses that contributed hours
  courseCount: number;
  estimates: ClassHoursEstimate[];
  // Labels of courses with no times now or last semester
  missing: string[];
};

// A lecture and its discussion sections share a course code
export const classHoursLabel = (listing: CatalogListing) =>
  isDiscussionSection(listing.course)
    ? `${listing.course_code} section ${listing.course.section}`
    : listing.course_code;

/**
 * Sums weekly class hours for listings already deduplicated by the caller.
 * Listings without scheduled times borrow them from their most recent earlier
 * semester (see findLatestPastOffering).
 *
 * @param pending past offerings are still loading, so listings without times
 * aren't reported as missing yet
 */
export function summarizeClassHours(
  listings: readonly CatalogListing[],
  pastOfferings: readonly PastOffering[],
  pending: boolean,
): ClassHoursSummary {
  const summary: ClassHoursSummary = {
    hours: 0,
    courseCount: 0,
    estimates: [],
    missing: [],
  };
  const withoutHours: CatalogListing[] = [];
  const codesWithHours = new Set<string>();
  for (const listing of listings) {
    const { course } = listing;
    let hours = getWeeklyMeetingHours(course.course_meetings);
    if (hours === 0) {
      const pastOffering = findLatestPastOffering(pastOfferings, course);
      if (pastOffering) {
        hours = getWeeklyMeetingHours(pastOffering.course_meetings);
        summary.estimates.push({
          label: classHoursLabel(listing),
          pastOffering,
          hours,
        });
      }
    }
    if (hours === 0) {
      withoutHours.push(listing);
      continue;
    }
    summary.hours += hours;
    summary.courseCount++;
    for (const l of course.listings) codesWithHours.add(l.course_code);
  }
  if (pending) return summary;
  for (const listing of withoutHours) {
    // Another section of the same course already has times, e.g. a lab's
    // umbrella listing whose times live on its lettered sections
    if (listing.course.listings.some((l) => codesWithHours.has(l.course_code)))
      continue;
    summary.missing.push(classHoursLabel(listing));
  }
  return summary;
}
