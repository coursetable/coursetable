import { useMemo } from 'react';
import * as Sentry from '@sentry/react';

import type { Season, Listing } from '../utilities/common';
import { useCourseData } from '../contexts/ferryContext';
import type { Worksheet } from '../contexts/userContext';

export const useWorksheetInfo = (
  worksheet: Worksheet | undefined,
  season: Season | null = null,
  worksheetNumber = '0',
) => {
  const requiredSeasons = useMemo(() => {
    if (!worksheet || worksheet.length === 0) {
      // If the worksheet is empty, we don't want to request data for any
      // seasons, even if a specific season is requested.
      return [];
    }
    const seasons = new Set<Season>();
    worksheet.forEach((item) => {
      seasons.add(item[0]);
    });
    if (season !== null) {
      if (seasons.has(season)) return [season];
      return [];
    }
    return Array.from(seasons); // Idk just need to return something i think
  }, [season, worksheet]);

  const { loading, error, courses } = useCourseData(requiredSeasons);

  const data = useMemo(() => {
    const dataReturn: Listing[] = [];
    if (!worksheet) return dataReturn;

    // Resolve the worksheet items.
    for (let i = 0; i < worksheet.length; i++) {
      const seasonCode: string = worksheet[i][0];
      const crn = parseInt(worksheet[i][1], 10);
      const worksheetNumberCourse: string = worksheet[i][2];
      if (season !== null && season != seasonCode) continue;

      if (
        courses &&
        seasonCode in courses &&
        worksheetNumberCourse == worksheetNumber
      ) {
        const course = courses[seasonCode].get(crn);
        if (!course) {
          Sentry.captureException(
            new Error(
              `failed to resolve worksheet course ${seasonCode} ${crn}`,
            ),
          );
        } else {
          dataReturn.push(course);
        }
      }
    }
    return dataReturn;
  }, [season, courses, worksheet, worksheetNumber]);
  return { loading, error, data };
};
