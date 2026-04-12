import { useEffect, useMemo } from 'react';

import { getCourseData } from '../ferry/ferryCatalogCache';
import type { UserWorksheets } from '../queries/api';
import type { Season } from '../queries/graphql-types';
import { useStore } from '../store';
import type { WorksheetCourse } from '../types/worksheetCourse';

export function useFerry() {
  const ferryRequests = useStore((s) => s.ferryRequests);
  const ferryErrors = useStore((s) => s.ferryErrors);
  // Re-render when FerrySlice bumps revision after cache writes.
  useStore((s) => s.ferryCatalogRevision);
  const requestSeasons = useStore((s) => s.requestSeasons);

  const error = ferryErrors[0] ?? null;
  const loading = ferryRequests !== 0 && !error;
  const courses = getCourseData();

  return { requests: ferryRequests, loading, error, courses, requestSeasons };
}

export const useCourseData = (requestedSeasons: Season[]) => {
  const authStatus = useStore((s) => s.authStatus);
  const userHasEvals = useStore((s) => s.user?.hasEvals);
  const { error, courses, requestSeasons } = useFerry();

  // The store action reads auth via get() at call time, but its function
  // reference is stable (unlike the old context useCallback). Re-fetch when
  // auth or eval eligibility changes so eval ratings merge after login.
  useEffect(() => {
    void requestSeasons(requestedSeasons);
  }, [requestSeasons, requestedSeasons, authStatus, userHasEvals]);

  const loading =
    !error && !requestedSeasons.every((season) => courses[season]);

  return { loading, error, courses };
};

export function useWorksheetInfo(
  worksheets: UserWorksheets | undefined,
  season: Season[],
  getWorksheetNumber: (seasonCode: Season) => number,
): { loading: boolean; error: object | null; data: WorksheetCourse[] };
export function useWorksheetInfo(
  worksheets: UserWorksheets | undefined,
  season: Season,
  worksheetNumber: number,
): { loading: boolean; error: object | null; data: WorksheetCourse[] };
export function useWorksheetInfo(
  worksheets: UserWorksheets | undefined,
  season: Season | Season[],
  worksheetNumber: number | ((seasonCode: Season) => number),
) {
  const requestedSeasons = useMemo(() => {
    if (!worksheets) return [];
    if (Array.isArray(season)) return season.filter((x) => worksheets.has(x));
    if (worksheets.has(season)) return [season];
    return [];
  }, [season, worksheets]);

  const { loading, error, courses } = useCourseData(requestedSeasons);

  const data = useMemo(() => {
    const dataReturn: WorksheetCourse[] = [];
    if (!worksheets) return [];
    if (loading || error) return [];

    for (const seasonCode of requestedSeasons) {
      const seasonWorksheets = worksheets.get(seasonCode)!;
      const worksheet = seasonWorksheets.get(
        typeof worksheetNumber === 'number'
          ? worksheetNumber
          : worksheetNumber(seasonCode),
      );
      if (!worksheet) continue;
      for (const { crn, color, hidden } of worksheet.courses) {
        const listing = courses[seasonCode]!.data.get(crn);
        if (listing) {
          dataReturn.push({
            crn,
            color,
            listing,
            hidden,
          });
        }
      }
    }
    return dataReturn.sort((a, b) =>
      a.listing.course_code.localeCompare(b.listing.course_code, 'en-US'),
    );
  }, [requestedSeasons, courses, worksheets, worksheetNumber, loading, error]);
  return { loading, error, data };
}
