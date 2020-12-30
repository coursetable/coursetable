import { useMemo } from 'react';
import { Season } from '../common';
import { Listing, useCourseData } from '../components/FerryProvider';
import { Worksheet } from '../user';

// Search query used in Worksheet.js and CourseConflictIcon.js
export const useWorksheetInfo = (
  worksheet: Worksheet | undefined,
  season: Season | null = null
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
    return Array.from(seasons);
  }, [season, worksheet]);

  const { loading, error, courses } = useCourseData(required_seasons);

  const data = useMemo(() => {
    const data: Listing[] = [];
    if (!worksheet) return data;

    // Resolve the worksheet items.
    for (let i = 0; i < worksheet.length; i++) {
      const season_code = worksheet[i][0];
      const crn = parseInt(worksheet[i][1], 10);

      if (season !== null && season !== season_code) {
        continue;
      }

      if (courses && season_code in courses) {
        const course = courses[season_code].get(crn);
        if (!course) {
          console.warn('failed to resolve worksheet course', season_code, crn);
        } else {
          data.push(course);
        }
      }
    }

    return data;
  }, [season, courses, worksheet]);

  return { loading, error, data };
};
