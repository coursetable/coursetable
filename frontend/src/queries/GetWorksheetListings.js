import { useMemo } from 'react';
import { useCourseData } from '../components/FerryProvider';
import { flatten, preprocess_courses } from '../utilities';

// Search query used in Worksheet.js and CourseConflictIcon.js
export const useWorksheetInfo = (worksheet) => {
  if (!worksheet) worksheet = [];

  const required_seasons = useMemo(() => {
    const seasons = new Set();
    worksheet.forEach((item) => {
      seasons.add(item[0]);
    });
    return [...seasons];
  }, [worksheet]);

  const { loading, error, courses } = useCourseData(required_seasons);

  const data = useMemo(() => {
    const data = [];

    // Resolve the worksheet items.
    for (let i = 0; i < worksheet.length; i++) {
      const season_code = worksheet[i][0];
      const crn = parseInt(worksheet[i][1], 10);

      if (courses && season_code in courses) {
        data.push(courses[season_code].get(crn));
      }
    }

    const res = data
      .map((x) => {
        return flatten(x);
      })
      .map((x) => {
        return preprocess_courses(x);
      });
    return res;
  }, [courses, worksheet]);

  return { loading, error, data };
};
