import type { CatalogListing } from '../queries/api';

const FLOAT_EPSILON = 1e-9;
export const SCHEDULE_MAX_RESULTS = 200;
export const SCHEDULE_MAX_NODES = 250_000;

type MeetingRange = {
  readonly days: number;
  readonly start: number;
  readonly end: number;
};

type ParsedMeetingResult =
  | { readonly kind: 'ok'; readonly meeting: MeetingRange }
  | { readonly kind: 'skip' }
  | { readonly kind: 'invalid' };

type ScheduleCandidate = {
  readonly listing: CatalogListing;
  readonly credits: number;
  readonly tags: string[];
  readonly meetings: MeetingRange[];
};

type ScheduleResult = {
  readonly listings: CatalogListing[];
  readonly addedListings: CatalogListing[];
  readonly credits: number;
};

type ScheduleOptions = {
  readonly fixedListings: readonly CatalogListing[];
  readonly optionalListings: readonly CatalogListing[];
  readonly additionalCourses: number;
  readonly requiredTags?: readonly string[];
  readonly targetCredits?: number;
  readonly maxResults?: number;
  readonly maxNodes?: number;
};

export type ScheduleEnumeration = {
  readonly schedules: ScheduleResult[];
  readonly nodesVisited: number;
  readonly baseHasConflict: boolean;
};

type CourseGroup = {
  readonly courseCode: string;
  readonly options: ScheduleCandidate[];
  readonly tagUnion: Set<string>;
  readonly minCredits: number;
  readonly maxCredits: number;
};

type CreditBounds = {
  readonly min: number[][];
  readonly max: number[][];
};

function listingComparator(a: CatalogListing, b: CatalogListing): number {
  if (a.course_code !== b.course_code)
    return a.course_code.localeCompare(b.course_code, 'en-US');
  return String(a.crn).localeCompare(String(b.crn), 'en-US');
}

function sortListings(listings: readonly CatalogListing[]): CatalogListing[] {
  return [...listings].sort(listingComparator);
}

function listingsKey(listings: readonly CatalogListing[]): string {
  return listings
    .map((listing) => `${listing.course_code}:${listing.crn}`)
    .join('|');
}

function parseRangeTime(rawTime: string): number | null {
  const match = /^\s*(?<hour>\d{1,2}):(?<minute>\d{2})/u.exec(rawTime);
  const groups = match?.groups;
  if (!groups) return null;
  const hourText = groups.hour;
  const minuteText = groups.minute;
  if (!hourText || !minuteText) return null;

  const hour = Number.parseInt(hourText, 10);
  const minute = Number.parseInt(minuteText, 10);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return hour * 12 + minute / 5;
}

function parseMeetingRange(
  meeting: CatalogListing['course']['course_meetings'][number],
): ParsedMeetingResult {
  if (!meeting.start_time || !meeting.end_time) return { kind: 'skip' };

  const start = parseRangeTime(meeting.start_time);
  const end = parseRangeTime(meeting.end_time);
  if (start === null || end === null || start >= end)
    return { kind: 'invalid' };

  const days = meeting.days_of_week;
  if (!Number.isInteger(days) || days < 0) return { kind: 'invalid' };
  if (days === 0) return { kind: 'skip' };

  return {
    kind: 'ok',
    meeting: {
      days,
      start,
      end,
    },
  };
}

function collectListingMeetings(listing: CatalogListing): {
  readonly meetings: MeetingRange[];
  readonly hasInvalidMeeting: boolean;
} {
  const meetings: MeetingRange[] = [];
  const seenMeetings = new Set<string>();

  for (const meeting of listing.course.course_meetings) {
    const parsedMeeting = parseMeetingRange(meeting);
    if (parsedMeeting.kind === 'invalid')
      return { meetings: [], hasInvalidMeeting: true };
    if (parsedMeeting.kind === 'skip') continue;

    const meetingRange = parsedMeeting.meeting;
    const meetingKey = `${meetingRange.days}:${meetingRange.start}:${meetingRange.end}`;
    if (seenMeetings.has(meetingKey)) continue;
    seenMeetings.add(meetingKey);
    meetings.push(meetingRange);
  }

  return { meetings, hasInvalidMeeting: false };
}

function buildScheduleCandidates(
  listings: readonly CatalogListing[],
): ScheduleCandidate[] {
  const candidates: ScheduleCandidate[] = [];

  for (const listing of listings) {
    const { meetings, hasInvalidMeeting } = collectListingMeetings(listing);
    if (hasInvalidMeeting) continue;
    if (!areMeetingsConflictFree(meetings)) continue;

    candidates.push({
      listing,
      credits: listing.course.credits ?? 0,
      tags: [...new Set([...listing.course.skills, ...listing.course.areas])],
      meetings,
    });
  }

  return candidates;
}

export function hasSchedulableMeeting(listing: CatalogListing): boolean {
  const { meetings, hasInvalidMeeting } = collectListingMeetings(listing);
  return (
    !hasInvalidMeeting &&
    meetings.length > 0 &&
    areMeetingsConflictFree(meetings)
  );
}

function meetingsOverlap(a: MeetingRange, b: MeetingRange): boolean {
  if (!(a.days & b.days)) return false;
  return a.start < b.end && b.start < a.end;
}

function hasConflict(
  existing: readonly MeetingRange[],
  candidate: readonly MeetingRange[],
): boolean {
  if (existing.length === 0 || candidate.length === 0) return false;

  for (const meeting of candidate) {
    for (const scheduled of existing)
      if (meetingsOverlap(meeting, scheduled)) return true;
  }

  return false;
}

function areMeetingsConflictFree(meetings: readonly MeetingRange[]): boolean {
  for (let i = 0; i < meetings.length; i += 1) {
    for (let j = i + 1; j < meetings.length; j += 1)
      if (meetingsOverlap(meetings[i]!, meetings[j]!)) return false;
  }
  return true;
}

export function isListingsConflictFree(
  listings: readonly CatalogListing[],
): boolean {
  const allMeetings: MeetingRange[] = [];

  for (const listing of listings) {
    const { meetings, hasInvalidMeeting } = collectListingMeetings(listing);
    if (hasInvalidMeeting) return false;
    if (!areMeetingsConflictFree(meetings)) return false;
    allMeetings.push(...meetings);
  }

  return areMeetingsConflictFree(allMeetings);
}

function addTags(tagCounts: Map<string, number>, tags: readonly string[]) {
  for (const tag of tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
}

function removeTags(tagCounts: Map<string, number>, tags: readonly string[]) {
  for (const tag of tags) {
    const next = (tagCounts.get(tag) ?? 1) - 1;
    if (next <= 0) tagCounts.delete(tag);
    else tagCounts.set(tag, next);
  }
}

function hasAllRequiredTags(
  requiredTags: ReadonlySet<string>,
  tagCounts: ReadonlyMap<string, number>,
): boolean {
  for (const tag of requiredTags) if (!tagCounts.has(tag)) return false;
  return true;
}

function toCourseGroups(
  candidates: readonly ScheduleCandidate[],
  fixedCourseCodes: ReadonlySet<string>,
): CourseGroup[] {
  const byCode = new Map<string, ScheduleCandidate[]>();
  const seenSections = new Set<string>();

  for (const candidate of candidates) {
    const code = candidate.listing.course_code;
    if (fixedCourseCodes.has(code)) continue;

    const sectionKey = `${code}:${candidate.listing.crn}`;
    if (seenSections.has(sectionKey)) continue;
    seenSections.add(sectionKey);

    const existing = byCode.get(code);
    if (existing) existing.push(candidate);
    else byCode.set(code, [candidate]);
  }

  const groups: CourseGroup[] = [];
  for (const [courseCode, options] of byCode.entries()) {
    if (options.length === 0) continue;

    options.sort((a, b) => {
      if (a.meetings.length !== b.meetings.length)
        return b.meetings.length - a.meetings.length;
      return String(a.listing.crn).localeCompare(
        String(b.listing.crn),
        'en-US',
      );
    });

    const tagUnion = new Set<string>();
    let minCredits = Number.POSITIVE_INFINITY;
    let maxCredits = Number.NEGATIVE_INFINITY;

    for (const option of options) {
      for (const tag of option.tags) tagUnion.add(tag);
      minCredits = Math.min(minCredits, option.credits);
      maxCredits = Math.max(maxCredits, option.credits);
    }

    groups.push({
      courseCode,
      options,
      tagUnion,
      minCredits,
      maxCredits,
    });
  }

  groups.sort((a, b) => {
    if (a.options.length !== b.options.length)
      return a.options.length - b.options.length;
    return a.courseCode.localeCompare(b.courseCode, 'en-US');
  });

  return groups;
}

function buildSuffixTags(groups: readonly CourseGroup[]): Set<string>[] {
  const suffixTags: Set<string>[] = Array.from(
    { length: groups.length + 1 },
    () => new Set<string>(),
  );

  for (let i = groups.length - 1; i >= 0; i -= 1) {
    const merged = new Set(suffixTags[i + 1]);
    for (const tag of groups[i]!.tagUnion) merged.add(tag);
    suffixTags[i] = merged;
  }

  return suffixTags;
}

function buildCreditBounds(
  groups: readonly CourseGroup[],
  maxSelected: number,
): CreditBounds {
  const min = Array.from({ length: groups.length + 1 }, () =>
    Array.from({ length: maxSelected + 1 }, () => Number.POSITIVE_INFINITY),
  );
  const max = Array.from({ length: groups.length + 1 }, () =>
    Array.from({ length: maxSelected + 1 }, () => Number.NEGATIVE_INFINITY),
  );

  min[groups.length]![0] = 0;
  max[groups.length]![0] = 0;

  for (let i = groups.length - 1; i >= 0; i -= 1) {
    min[i]![0] = 0;
    max[i]![0] = 0;

    for (let pick = 1; pick <= maxSelected; pick += 1) {
      const skipMin = min[i + 1]![pick]!;
      const takeMinBase = min[i + 1]![pick - 1]!;
      const takeMin = Number.isFinite(takeMinBase)
        ? groups[i]!.minCredits + takeMinBase
        : Number.POSITIVE_INFINITY;
      min[i]![pick] = Math.min(skipMin, takeMin);

      const skipMax = max[i + 1]![pick]!;
      const takeMaxBase = max[i + 1]![pick - 1]!;
      const takeMax = Number.isFinite(takeMaxBase)
        ? groups[i]!.maxCredits + takeMaxBase
        : Number.NEGATIVE_INFINITY;
      max[i]![pick] = Math.max(skipMax, takeMax);
    }
  }

  return { min, max };
}

export function enumerateSchedules(
  options: ScheduleOptions,
): ScheduleEnumeration {
  const {
    fixedListings: inputFixedListings,
    optionalListings,
    additionalCourses: inputAdditionalCourses,
    requiredTags: inputRequiredTags,
    targetCredits,
    maxResults = SCHEDULE_MAX_RESULTS,
    maxNodes = SCHEDULE_MAX_NODES,
  } = options;

  const fixedListings = sortListings(inputFixedListings);
  const additionalCourses = Math.max(0, Math.floor(inputAdditionalCourses));
  const requiredTags = new Set(
    (inputRequiredTags ?? []).filter((tag) => Boolean(tag)),
  );

  const fixedCandidates = buildScheduleCandidates(fixedListings);
  if (fixedCandidates.length !== fixedListings.length) {
    return {
      schedules: [],
      nodesVisited: 0,
      baseHasConflict: true,
    };
  }

  const fixedCourseCodes = new Set(
    fixedListings.map((listing) => listing.course_code),
  );

  const meetings: MeetingRange[] = [];
  const selectedTagCounts = new Map<string, number>();
  let fixedCredits = 0;

  for (const candidate of fixedCandidates) {
    if (hasConflict(meetings, candidate.meetings)) {
      return {
        schedules: [],
        nodesVisited: 0,
        baseHasConflict: true,
      };
    }

    meetings.push(...candidate.meetings);
    addTags(selectedTagCounts, candidate.tags);
    fixedCredits += candidate.credits;
  }

  if (additionalCourses === 0) {
    const creditsMatchTarget =
      targetCredits === undefined ||
      Math.abs(fixedCredits - targetCredits) <= FLOAT_EPSILON;

    const singleSchedule =
      creditsMatchTarget && hasAllRequiredTags(requiredTags, selectedTagCounts)
        ? [
            {
              listings: fixedListings,
              addedListings: [],
              credits: fixedCredits,
            },
          ]
        : [];

    return {
      schedules: singleSchedule,
      nodesVisited: 0,
      baseHasConflict: false,
    };
  }

  const optionalCandidates = buildScheduleCandidates(optionalListings);
  const groups = toCourseGroups(optionalCandidates, fixedCourseCodes);
  if (additionalCourses > groups.length) {
    return {
      schedules: [],
      nodesVisited: 0,
      baseHasConflict: false,
    };
  }

  const suffixTags = buildSuffixTags(groups);
  const creditBounds = buildCreditBounds(groups, additionalCourses);

  const selectedOptionalListings: CatalogListing[] = [];
  const schedules: ScheduleResult[] = [];

  let nodesVisited = 0;
  let shouldStop = false;

  const canStillMeetTagRequirements = (groupIndex: number): boolean => {
    if (requiredTags.size === 0) return true;

    const possibleTags = suffixTags[groupIndex];
    if (!possibleTags) return false;

    for (const tag of requiredTags) {
      if (selectedTagCounts.has(tag)) continue;
      if (!possibleTags.has(tag)) return false;
    }

    return true;
  };

  const canStillMeetCreditTarget = (
    groupIndex: number,
    remainingCourses: number,
    selectedOptionalCredits: number,
  ): boolean => {
    if (targetCredits === undefined) return true;

    const minRemaining = creditBounds.min[groupIndex]?.[remainingCourses];
    const maxRemaining = creditBounds.max[groupIndex]?.[remainingCourses];

    if (
      minRemaining === undefined ||
      maxRemaining === undefined ||
      !Number.isFinite(minRemaining) ||
      !Number.isFinite(maxRemaining)
    )
      return false;

    const minPossible = fixedCredits + selectedOptionalCredits + minRemaining;
    const maxPossible = fixedCredits + selectedOptionalCredits + maxRemaining;

    return (
      targetCredits >= minPossible - FLOAT_EPSILON &&
      targetCredits <= maxPossible + FLOAT_EPSILON
    );
  };

  const backtrack = (
    groupIndex: number,
    selectedOptionalCount: number,
    selectedOptionalCredits: number,
  ) => {
    nodesVisited += 1;
    if (nodesVisited > maxNodes) {
      shouldStop = true;
      return;
    }

    const remainingCourses = additionalCourses - selectedOptionalCount;

    if (remainingCourses === 0) {
      const totalCredits = fixedCredits + selectedOptionalCredits;
      const creditsMatchTarget =
        targetCredits === undefined ||
        Math.abs(totalCredits - targetCredits) <= FLOAT_EPSILON;

      if (
        creditsMatchTarget &&
        hasAllRequiredTags(requiredTags, selectedTagCounts) &&
        areMeetingsConflictFree(meetings)
      ) {
        const addedListings = sortListings(selectedOptionalListings);
        const listings = sortListings([...fixedListings, ...addedListings]);
        if (!isListingsConflictFree(listings)) return;

        schedules.push({
          listings,
          addedListings,
          credits: totalCredits,
        });

        if (schedules.length >= maxResults) shouldStop = true;
      }

      return;
    }

    if (groupIndex >= groups.length) return;
    if (groups.length - groupIndex < remainingCourses) return;
    if (!canStillMeetTagRequirements(groupIndex)) return;
    if (
      !canStillMeetCreditTarget(
        groupIndex,
        remainingCourses,
        selectedOptionalCredits,
      )
    )
      return;

    const group = groups[groupIndex]!;

    for (const option of group.options) {
      if (hasConflict(meetings, option.meetings)) continue;

      const previousMeetingLength = meetings.length;
      meetings.push(...option.meetings);
      selectedOptionalListings.push(option.listing);
      addTags(selectedTagCounts, option.tags);

      backtrack(
        groupIndex + 1,
        selectedOptionalCount + 1,
        selectedOptionalCredits + option.credits,
      );

      removeTags(selectedTagCounts, option.tags);
      selectedOptionalListings.pop();
      meetings.length = previousMeetingLength;

      if (shouldStop || nodesVisited > maxNodes) return;
    }

    if (shouldStop) return;
    if (groups.length - (groupIndex + 1) >= remainingCourses)
      backtrack(groupIndex + 1, selectedOptionalCount, selectedOptionalCredits);
  };

  backtrack(0, 0, 0);

  schedules.sort((a, b) => {
    if (targetCredits !== undefined) {
      const aDiff = Math.abs(a.credits - targetCredits);
      const bDiff = Math.abs(b.credits - targetCredits);
      if (aDiff !== bDiff) return aDiff - bDiff;
    }

    if (a.credits !== b.credits) return b.credits - a.credits;

    return listingsKey(a.listings).localeCompare(
      listingsKey(b.listings),
      'en-US',
    );
  });

  return {
    schedules,
    nodesVisited,
    baseHasConflict: false,
  };
}
