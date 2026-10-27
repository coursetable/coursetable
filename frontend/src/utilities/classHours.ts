import { isDiscussionSection, toRangeTime, toWeekdayStrings } from './course';
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
