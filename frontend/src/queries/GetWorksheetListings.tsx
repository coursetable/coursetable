import { useMemo } from 'react';
import { Season } from '../utilities/common';
import { Listing, useCourseData } from '../components/Providers/FerryProvider';
import { Worksheet } from '../contexts/userContext';
import * as Sentry from '@sentry/react';

// Search query used in Worksheet.js and CourseConflictIcon.js

export const useWorksheetInfo = (
  worksheet: Worksheet | undefined,
  season: Season | null = null,
  worksheet_number = '0'
) => {
  const required_seasons = useMemo(() => {
    if (!worksheet || worksheet.length === 0) {
      // If the worksheet is empty, we don't want to request data for any
      // seasons, even if a specific season is requested.
      return [];
    }
    //console.log('ahh', worksheet);
    const seasons = new Set<Season>();
    worksheet.forEach((item) => {
      seasons.add(item[0]);
    });
    if (season !== null) {
      if (seasons.has(season)) return [season];
      return [];
    }
  }, [season, worksheet]);

  const required_worksheet_numbers = useMemo(() => {
    if (!worksheet || worksheet.length === 0) {
      // If the worksheet is empty, we don't want to request data for any
      // seasons, even if a specific season is requested.
      return [];
    }
    //console.log('ahh', worksheet, worksheet_number);
    const worksheet_numbers = new Set<string>();
    worksheet.forEach((item) => {
      worksheet_numbers.add(item[2]);
    });
    if (worksheet_numbers.has(worksheet_number)) return [worksheet_number];
    return [];
  }, [worksheet_number, worksheet]);

  const { loading, error, courses } = useCourseData(required_seasons);

  const data = useMemo(() => {
    const data: Listing[] = [];
    if (!worksheet) return data;

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
            `failed to resolve worksheet course ${season_code} ${crn}`
          );
        } else {
          data.push(course);
        }
      }
    }

    return data;
  }, [season, courses, worksheet, worksheet_number]);

  return { loading, error, data };
};
