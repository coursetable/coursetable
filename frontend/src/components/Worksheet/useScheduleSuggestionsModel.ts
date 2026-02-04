import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  areCalendarEventsConflictFree,
  formatCredits,
  getCalendarBounds,
  listingSummary,
  parseCreditsInput,
  parsePositiveInteger,
  toScheduleEvents,
  type CourseOption,
  type ParsedCreditsInput,
  type RequirementTag,
} from './scheduleSuggestionsUtils';
import { useCourseData } from '../../contexts/ferryContext';
import type { CatalogListing } from '../../queries/api';
import { useStore } from '../../store';
import { skillsAreas } from '../../utilities/constants';
import {
  enumerateSchedules,
  hasSchedulableMeeting,
  isListingsConflictFree,
  SCHEDULE_MAX_NODES,
  SCHEDULE_MAX_RESULTS,
  type ScheduleEnumeration,
} from '../../utilities/schedule';

const EMPTY_RESULT: ScheduleEnumeration = {
  schedules: [],
  nodesVisited: 0,
  baseHasConflict: false,
};

const SCHEDULE_CACHE = new Map<string, ScheduleEnumeration>();
const MAX_CACHE_ENTRIES = 40;

function getCachedEnumeration(
  cacheKey: string,
  compute: () => ScheduleEnumeration,
): ScheduleEnumeration {
  const cached = SCHEDULE_CACHE.get(cacheKey);
  if (cached) return cached;

  const result = compute();
  SCHEDULE_CACHE.set(cacheKey, result);

  while (SCHEDULE_CACHE.size > MAX_CACHE_ENTRIES) {
    const oldestKey = SCHEDULE_CACHE.keys().next().value;
    if (!oldestKey) break;
    SCHEDULE_CACHE.delete(oldestKey);
  }

  return result;
}

export type ScheduleSuggestionsStatus =
  | { readonly kind: 'ok' }
  | { readonly kind: 'no_catalog' }
  | { readonly kind: 'invalid_credits' }
  | { readonly kind: 'target_below_fixed' }
  | {
      readonly kind: 'insufficient_eligible';
      readonly needed: number;
      readonly eligible: number;
    }
  | { readonly kind: 'missing_tags' }
  | { readonly kind: 'base_conflict' }
  | { readonly kind: 'no_schedules' };

type UseScheduleSuggestionsModelArgs = {
  readonly show: boolean;
};

export default function useScheduleSuggestionsModel({
  show,
}: UseScheduleSuggestionsModelArgs) {
  const { courses: worksheetCourses } = useStore(
    useShallow((state) => ({
      courses: state.courses,
    })),
  );
  const viewedSeason = useStore((state) => state.viewedSeason);

  const { courses: catalogData, loading: catalogLoading } = useCourseData([
    viewedSeason,
  ]);
  const seasonCatalog = catalogData[viewedSeason];

  const [targetCourses, setTargetCourses] = useState(4);
  const [targetCoursesInput, setTargetCoursesInput] = useState('4');
  const [targetCreditsInput, setTargetCreditsInput] = useState('');
  const [requiredTags, setRequiredTags] = useState<string[]>([]);
  const [excludedCourseCodes, setExcludedCourseCodes] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuPortalTarget = useMemo(
    () =>
      typeof document === 'undefined'
        ? undefined
        : (document.querySelector<HTMLElement>('#portal') ?? undefined),
    [],
  );

  const visibleWorksheetListings = useMemo(
    () =>
      worksheetCourses
        .filter((course) => !course.hidden)
        .map((course) => course.listing),
    [worksheetCourses],
  );

  const fixedCourseCount = visibleWorksheetListings.length;

  useEffect(() => {
    if (!show) return;

    SCHEDULE_CACHE.clear();
    const defaultTarget = Math.max(fixedCourseCount + 1, 4);
    setTargetCourses(defaultTarget);
    setTargetCoursesInput(String(defaultTarget));
    setTargetCreditsInput('');
    setRequiredTags([]);
    setExcludedCourseCodes([]);
    setSelectedIndex(0);
  }, [show, fixedCourseCount]);

  const catalogListingsByCode = useMemo(() => {
    if (!seasonCatalog) return new Map<string, CatalogListing[]>();

    const worksheetCourseCodes = new Set(
      visibleWorksheetListings.map((listing) => listing.course_code),
    );

    const listingsByCode = new Map<string, CatalogListing[]>();
    for (const listing of seasonCatalog.data.values()) {
      const code = listing.course_code;
      if (worksheetCourseCodes.has(code)) continue;

      const current = listingsByCode.get(code);
      if (current) current.push(listing);
      else listingsByCode.set(code, [listing]);
    }

    return listingsByCode;
  }, [seasonCatalog, visibleWorksheetListings]);

  const exclusionOptions = useMemo(() => {
    const options: CourseOption[] = [];

    for (const [code, listings] of catalogListingsByCode.entries()) {
      const withMeetings = listings.filter(hasSchedulableMeeting);
      if (withMeetings.length === 0) continue;

      const firstListing = withMeetings[0]!;
      options.push({
        value: code,
        label: `${code} - ${firstListing.course.title}`,
      });
    }

    return options.sort((a, b) => a.value.localeCompare(b.value, 'en-US'));
  }, [catalogListingsByCode]);

  const exclusionOptionByCode = useMemo(
    () => new Map(exclusionOptions.map((option) => [option.value, option])),
    [exclusionOptions],
  );

  const selectedExclusionOptions = useMemo(
    () =>
      excludedCourseCodes
        .map((code) => exclusionOptionByCode.get(code))
        .filter((option): option is CourseOption => Boolean(option)),
    [excludedCourseCodes, exclusionOptionByCode],
  );

  const excludedSet = useMemo(
    () => new Set(excludedCourseCodes),
    [excludedCourseCodes],
  );

  const eligibleCourseCodes = useMemo(
    () =>
      exclusionOptions
        .map((option) => option.value)
        .filter((code) => !excludedSet.has(code)),
    [exclusionOptions, excludedSet],
  );

  const optionalListings = useMemo(() => {
    const listings: CatalogListing[] = [];

    for (const [code, codeListings] of catalogListingsByCode.entries()) {
      if (excludedSet.has(code)) continue;

      for (const listing of codeListings) {
        if (!hasSchedulableMeeting(listing)) continue;
        listings.push(listing);
      }
    }

    return listings;
  }, [catalogListingsByCode, excludedSet]);

  const parsedTargetCredits = useMemo<ParsedCreditsInput>(
    () => parseCreditsInput(targetCreditsInput),
    [targetCreditsInput],
  );

  const additionalCoursesNeeded = targetCourses - fixedCourseCount;

  const allAvailableTags = useMemo(() => {
    const tags: RequirementTag[] = [];
    for (const [code, name] of Object.entries(skillsAreas.areas))
      tags.push({ code, name, type: 'area' });
    for (const [code, name] of Object.entries(skillsAreas.skills))
      tags.push({ code, name, type: 'skill' });
    return tags.sort((a, b) => a.name.localeCompare(b.name, 'en-US'));
  }, []);

  const availableTagSet = useMemo(() => {
    const tags = new Set<string>();

    for (const listing of visibleWorksheetListings) {
      for (const tag of [...listing.course.skills, ...listing.course.areas])
        tags.add(tag);
    }

    for (const code of eligibleCourseCodes) {
      for (const listing of catalogListingsByCode.get(code) ?? []) {
        if (!hasSchedulableMeeting(listing)) continue;
        for (const tag of [...listing.course.skills, ...listing.course.areas])
          tags.add(tag);
      }
    }

    return tags;
  }, [catalogListingsByCode, eligibleCourseCodes, visibleWorksheetListings]);

  const missingRequiredTags = useMemo(
    () => requiredTags.filter((tag) => !availableTagSet.has(tag)),
    [requiredTags, availableTagSet],
  );

  const canRunEnumeration =
    show &&
    Boolean(seasonCatalog) &&
    !catalogLoading &&
    parsedTargetCredits.isValid &&
    additionalCoursesNeeded >= 0 &&
    additionalCoursesNeeded <= eligibleCourseCodes.length &&
    missingRequiredTags.length === 0;

  const cacheKey = useMemo(() => {
    if (!seasonCatalog) return '';

    const worksheetKey = visibleWorksheetListings
      .map((listing) => `${listing.course_code}:${listing.crn}`)
      .sort((a, b) => a.localeCompare(b, 'en-US'))
      .join(',');

    return [
      viewedSeason,
      seasonCatalog.metadata.last_update.getTime(),
      worksheetKey,
      excludedCourseCodes
        .slice()
        .sort((a, b) => a.localeCompare(b, 'en-US'))
        .join(','),
      additionalCoursesNeeded,
      parsedTargetCredits.value ?? 'none',
      requiredTags
        .slice()
        .sort((a, b) => a.localeCompare(b, 'en-US'))
        .join(','),
    ].join('|');
  }, [
    additionalCoursesNeeded,
    excludedCourseCodes,
    parsedTargetCredits.value,
    requiredTags,
    seasonCatalog,
    viewedSeason,
    visibleWorksheetListings,
  ]);

  const { schedules, nodesVisited, baseHasConflict } = useMemo(() => {
    if (!canRunEnumeration || !cacheKey) return EMPTY_RESULT;

    return getCachedEnumeration(cacheKey, () =>
      enumerateSchedules({
        fixedListings: visibleWorksheetListings,
        optionalListings,
        additionalCourses: additionalCoursesNeeded,
        requiredTags,
        targetCredits: parsedTargetCredits.value,
        maxResults: SCHEDULE_MAX_RESULTS,
        maxNodes: SCHEDULE_MAX_NODES,
      }),
    );
  }, [
    additionalCoursesNeeded,
    cacheKey,
    canRunEnumeration,
    optionalListings,
    parsedTargetCredits.value,
    requiredTags,
    visibleWorksheetListings,
  ]);

  const validSchedules = useMemo(
    () =>
      schedules.filter(
        (schedule) =>
          isListingsConflictFree(schedule.listings) &&
          areCalendarEventsConflictFree(schedule.listings, viewedSeason),
      ),
    [schedules, viewedSeason],
  );

  useEffect(() => {
    setSelectedIndex((current) => {
      if (validSchedules.length === 0) return 0;
      return Math.min(current, validSchedules.length - 1);
    });
  }, [validSchedules.length]);

  const currentSchedule =
    validSchedules[Math.min(selectedIndex, validSchedules.length - 1)];

  const events = useMemo(
    () =>
      currentSchedule
        ? toScheduleEvents(currentSchedule.listings, viewedSeason)
        : [],
    [currentSchedule, viewedSeason],
  );

  const { earliest, latest } = useMemo(
    () => getCalendarBounds(events),
    [events],
  );

  const addedCourseLabels = useMemo(
    () =>
      (currentSchedule?.addedListings ?? [])
        .map((listing) => listingSummary(listing))
        .sort((a, b) => a.localeCompare(b, 'en-US')),
    [currentSchedule?.addedListings],
  );

  const status: ScheduleSuggestionsStatus = useMemo(() => {
    if (seasonCatalog === undefined) return { kind: 'no_catalog' };
    if (!parsedTargetCredits.isValid) return { kind: 'invalid_credits' };
    if (additionalCoursesNeeded < 0) return { kind: 'target_below_fixed' };
    if (additionalCoursesNeeded > eligibleCourseCodes.length) {
      return {
        kind: 'insufficient_eligible',
        needed: additionalCoursesNeeded,
        eligible: eligibleCourseCodes.length,
      };
    }
    if (missingRequiredTags.length > 0) return { kind: 'missing_tags' };
    if (baseHasConflict) return { kind: 'base_conflict' };
    if (validSchedules.length === 0) return { kind: 'no_schedules' };
    return { kind: 'ok' };
  }, [
    additionalCoursesNeeded,
    baseHasConflict,
    eligibleCourseCodes.length,
    missingRequiredTags.length,
    parsedTargetCredits.isValid,
    seasonCatalog,
    validSchedules.length,
  ]);

  const onTargetCoursesInputChange = (value: string) => {
    setTargetCoursesInput(value);
    const parsed = parsePositiveInteger(value);
    if (parsed !== undefined) setTargetCourses(parsed);
  };

  const onTargetCoursesBlur = () => {
    const parsed = parsePositiveInteger(targetCoursesInput);
    const normalized = parsed ?? targetCourses;
    setTargetCourses(normalized);
    setTargetCoursesInput(String(normalized));
  };

  const onTargetCreditsBlur = () => {
    if (!parsedTargetCredits.isValid) return;
    if (parsedTargetCredits.value === undefined) return;
    setTargetCreditsInput(formatCredits(parsedTargetCredits.value));
  };

  const onToggleTag = (tagCode: string) => {
    setRequiredTags((current) =>
      current.includes(tagCode)
        ? current.filter((value) => value !== tagCode)
        : [...current, tagCode],
    );
  };

  const onPreviousSchedule = () =>
    setSelectedIndex((index) => Math.max(0, index - 1));

  const onNextSchedule = () =>
    setSelectedIndex((index) => Math.min(validSchedules.length - 1, index + 1));

  return {
    catalogLoading,
    menuPortalTarget,
    targetCoursesInput,
    targetCreditsInput,
    parsedTargetCredits,
    requiredTags,
    exclusionOptions,
    selectedExclusionOptions,
    allAvailableTags,
    status,
    canRunEnumeration,
    nodesVisited,
    addedCourseLabels,
    selectedIndex,
    validSchedulesCount: validSchedules.length,
    currentCredits: currentSchedule?.credits,
    events,
    earliest,
    latest,
    onTargetCoursesInputChange,
    onTargetCoursesBlur,
    onTargetCreditsInputChange: setTargetCreditsInput,
    onTargetCreditsBlur,
    onToggleTag,
    onExcludedCourseCodesChange: setExcludedCourseCodes,
    onPreviousSchedule,
    onNextSchedule,
  };
}
