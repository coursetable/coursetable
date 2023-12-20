import { useMemo } from 'react';
import type { Season, Listing } from '../utilities/common';
import { useCourseData } from '../contexts/ferryContext';
import type { Worksheet } from '../contexts/userContext';
import * as Sentry from '@sentry/react';

export const useWorksheetInfo = (
  worksheet: Worksheet | undefined,
  season: Season | null = null,
  worksheet_number = '0',
) => {
  const required_seasons = useMemo(() => {
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
    return Array.from(seasons); // idk just need to return something i think
  }, [season, worksheet]);

  const { loading, error, courses } = useCourseData(required_seasons);

  const data = useMemo(() => {
    const dataReturn: Listing[] = [];
    if (!worksheet) return dataReturn;

    // Resolve the worksheet items.
    for (let i = 0; i < worksheet.length; i++) {
      const season_code: string = worksheet[i][0];
      const crn = parseInt(worksheet[i][1], 10);
      const worksheet_number_course: string = worksheet[i][2];
      if (season !== null && season != season_code) {
        continue;
      }

      if (
        courses &&
        season_code in courses &&
        worksheet_number_course == worksheet_number
      ) {
        const course = courses[season_code].get(crn);
        if (!course) {
          Sentry.captureException(
            new Error(
              `failed to resolve worksheet course ${season_code} ${crn}`,
            ),
          );
        } else {
          dataReturn.push(course);
        }
      }
    }
    return dataReturn;
  }, [season, courses, worksheet, worksheet_number]);
  return { loading, error, data };
};
