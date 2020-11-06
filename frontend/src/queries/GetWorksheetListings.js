import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useMemo } from 'react';
import { useCourseData } from '../components/FerryProvider';
import { flatten, preprocess_courses } from '../utilities';

// Build the graphQL query based on the courses in the user's worksheet
const buildQuery = (worksheet) => {
  // Holds the listings constraints for the gql query
  let listings = '';
  // Iterate over each listing
  for (let i = 0; i < worksheet.length; i++) {
    const season_code = worksheet[i][0];
    const crn = worksheet[i][1];
    // Append constraint
    listings += `{ season_code: { _eq: "${season_code}" }, crn: { _eq: ${crn} }},`;
  }
  return `query WorksheetCourses {
    search_listing_info(
      args: { query: "" }
      order_by: {season_code: asc}
      where: {_or: [${listings}]}
    ) {
      listing_id
      title
      description
      all_course_codes
      professor_names
      average_rating
      average_workload
      average_professor
      times_summary
      times_by_day
      locations_summary
      skills
      areas
      credits
      course_code
      school
      requirements
      season_code
      extra_info
      syllabus_url
      section
      crn
      enrolled
      last_enrollment
      last_enrollment_same_professors
      flag_info
      regnotes
      rp_attr
      classnotes
      final_exam
    }    
  }`;
};

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
      const crn = worksheet[i][1];

      if (courses && season_code in courses) {
        data.push(courses[season_code][crn]);
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

// Lazy search query used in MeDropdown.js
export const FetchWorksheetLazy = (worksheet, season_code) => {
  if (!worksheet) worksheet = [];
  // Get worksheet listings for this season
  const filtered_worksheet = (worksheet || []).filter((course) => {
    return course[0] === season_code;
  });
  // Build gql query
  const builtQuery = buildQuery(filtered_worksheet);
  // Get lazy search query function
  const [fetchWorksheetListings, { loading, data }] = useLazyQuery(
    gql(builtQuery)
  );
  return [fetchWorksheetListings, { loading, data }];
};
