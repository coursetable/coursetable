import { useMemo } from 'react';
import { Season } from '../utilities/common';
import { Listing, useCourseData } from '../components/Providers/FerryProvider';
import { Worksheet } from '../contexts/userContext';
import * as Sentry from '@sentry/react';

// Search query used in Worksheet.js and CourseConflictIcon.js

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
    //console.log('ahh', worksheet);
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

  /*   const required_worksheetNumbers = useMemo(() => {
    if (!worksheet || worksheet.length === 0) {
      // If the worksheet is empty, we don't want to request data for any
      // seasons, even if a specific season is requested.
      return [];
    }
    //console.log('ahh', worksheet, worksheetNumber);
    const worksheetNumbers = new Set<string>();
    worksheet.forEach((item) => {
      worksheetNumbers.add(item[2]);
    });
    if (worksheetNumbers.has(worksheetNumber)) return [worksheetNumber];
    return [];
  }, [worksheetNumber, worksheet]); */

  const { loading, error, courses } = useCourseData(requiredSeasons);

  const data = useMemo(() => {
    const data: Listing[] = [];
    if (!worksheet) return data;

    // Resolve the worksheet items.
    for (let i = 0; i < worksheet.length; i++) {
      const seasonCode = worksheet[i][0];
      const crn = parseInt(worksheet[i][1], 10);
      const worksheetNumberCourse = worksheet[i][2];
      if (season !== null && season != seasonCode) {
        continue;
      }

      if (
        courses &&
        seasonCode in courses &&
        worksheetNumberCourse == worksheetNumber
      ) {
        const course = courses[seasonCode].get(crn);
        if (!course) {
          Sentry.captureException(
            `failed to resolve worksheet course ${seasonCode} ${crn}`,
          );
        } else {
          data.push(course);
        }
      }
    }

    return data;
  }, [season, courses, worksheet, worksheetNumber]);

  return { loading, error, data };
};
