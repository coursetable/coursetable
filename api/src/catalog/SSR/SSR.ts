import { request, gql } from 'graphql-request';
import type { Request, Response } from 'express';
import { GRAPHQL_ENDPOINT } from '../../config';

const courseInfoMessagePreview = gql`
  query courseInfoMessagePreview($season: String!, $crn: Int!) {
    computed_listing_info(
      where: { season_code: { _eq: $season }, crn: { _eq: $crn } }
    ) {
      course_code
      crn
      description
      professor_names
      season_code
      title
    }
  }
`;

interface CourseInfo {
  course_code: string;
  crn: string;
  description: string;
  professor_names: string[];
  season_code: string;
  title: string;
}

async function findCourseBySeasonAndCrn(
  seasonCode: string,
  crn: string,
): Promise<CourseInfo | undefined> {
  try {
    const response = await request<{ computed_listing_info: CourseInfo[] }>(
      GRAPHQL_ENDPOINT,
      courseInfoMessagePreview,
      {
        season: seasonCode,
        crn: parseInt(crn),
      },
    );

    if (response.computed_listing_info.length > 0)
      return response.computed_listing_info[0];

    console.log(`No course found for season ${seasonCode} and CRN ${crn}`);
    return undefined;
  } catch (error) {
    console.error(`Error fetching course data: ${error}`);
    return undefined;
  }
}

export function serveDynamicMeta(req: Request, res: Response) {
  const { seasonCode, crn } = req.params;
  if (!seasonCode || !crn) {
    res.status(400).send('Invalid request');
    return;
  }
  findCourseBySeasonAndCrn(seasonCode, crn).then((course) => {
    if (course) {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${course.title}</title>
          <meta property="og:title" content="${course.title}">
          <meta property="og:description" content="${course.description || 'Course description here'}">
          <!-- Add more meta tags as necessary -->
        </head>
        <body>
          <!-- You might want to include minimal content or instructions on how to view the course in a browser -->
        </body>
        </html>
      `);
    } else {
      res.status(404).send('Course not found');
    }
  });
}
