import { useMemo } from 'react';
import { useCourseData } from '../components/FerryProvider';

// Search query used in Worksheet.js and CourseConflictIcon.js
export const useWorksheetInfo = (worksheet, season = null) => {
  if (!worksheet) worksheet = [];

  const required_seasons = useMemo(() => {
    if (season !== null) {
      return [season];
    }
    const seasons = new Set();
    worksheet.forEach((item) => {
      seasons.add(item[0]);
    });
    return [...seasons];
  }, [season, worksheet]);

  const { loading, error, courses } = useCourseData(required_seasons);

  const data = useMemo(() => {
    const data = [];

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
  }, [courses, worksheet]);

  return { loading, error, data };
};
