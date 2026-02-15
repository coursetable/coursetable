import type { CatalogListing } from '../../queries/api';
import type { Season } from '../../queries/graphql-types';
import type { WorksheetCourse } from '../../slices/WorksheetSlice';
import { getCalendarEvents, type RBCEvent } from '../../utilities/calendar';
import { worksheetColors } from '../../utilities/constants';

export type ParsedCreditsInput = {
  readonly value: number | undefined;
  readonly isValid: boolean;
};

export type CourseOption = {
  readonly label: string;
  readonly value: string;
};

export type RequirementTag = {
  readonly code: string;
  readonly name: string;
  readonly type: 'area' | 'skill';
};

export function parsePositiveInteger(value: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return undefined;
  return parsed;
}

export function parseCreditsInput(value: string): ParsedCreditsInput {
  if (!value.trim()) return { value: undefined, isValid: true };

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0)
    return { value: undefined, isValid: false };

  return { value: parsed, isValid: true };
}

export function formatCredits(credits: number): string {
  if (Number.isInteger(credits)) return String(credits);
  return credits.toFixed(1);
}

export function listingSummary(listing: CatalogListing): string {
  return `${listing.course_code}-${String(listing.course.section).padStart(2, '0')}`;
}

export function toScheduleEvents(
  listings: readonly CatalogListing[],
  viewedSeason: Season,
): RBCEvent[] {
  const scheduleCourses: WorksheetCourse[] = listings.map((listing, index) => ({
    crn: listing.crn,
    listing,
    color: worksheetColors[index % worksheetColors.length]!,
    hidden: false,
  }));

  return getCalendarEvents('rbc', scheduleCourses, viewedSeason);
}

export function areCalendarEventsConflictFree(
  listings: readonly CatalogListing[],
  viewedSeason: Season,
): boolean {
  const events = toScheduleEvents(listings, viewedSeason);
  const normalizedEvents: { start: number; end: number }[] = [];

  for (const event of events) {
    const start = event.start.getTime();
    const end = event.end.getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end)
      return false;

    normalizedEvents.push({ start, end });
  }

  normalizedEvents.sort((a, b) => a.start - b.start);

  let latestEnd = Number.NEGATIVE_INFINITY;
  for (const event of normalizedEvents) {
    if (event.start < latestEnd) return false;
    latestEnd = Math.max(latestEnd, event.end);
  }

  return true;
}

export function getCalendarBounds(events: readonly RBCEvent[]): {
  readonly earliest: Date;
  readonly latest: Date;
} {
  if (events.length === 0) {
    return {
      earliest: new Date(0, 0, 0, 8),
      latest: new Date(0, 0, 0, 18),
    };
  }

  let earliestMinutes = Number.POSITIVE_INFINITY;
  let latestMinutes = Number.NEGATIVE_INFINITY;

  for (const event of events) {
    const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
    const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();
    earliestMinutes = Math.min(earliestMinutes, startMinutes);
    latestMinutes = Math.max(latestMinutes, endMinutes);
  }

  const earliestHour = Math.max(0, Math.floor(earliestMinutes / 60));
  const latestHour = Math.min(23, Math.floor(latestMinutes / 60));

  return {
    earliest: new Date(0, 0, 0, earliestHour, 0, 0, 0),
    latest: new Date(0, 0, 0, latestHour, 59, 59, 999),
  };
}
