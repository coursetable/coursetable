// File: /api/preview.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { request } from 'graphql-request';
import { courseTitleAndProfByCrnQuery } from './catalog/catalog.queries';
import { GRAPHQL_ENDPOINT } from './config';

interface CourseTitleResponse {
  computed_listing_info: Array<{
    title: string;
    professor_names: string;
  }>;
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const courseModalParam = req.query['course-modal'];

  if (typeof courseModalParam !== 'string') {
    res.status(400).send('Invalid course-modal parameter');
    return;
  }
  const [seasonCode, crn] = courseModalParam.split('-');

  try {
    const response = await request<CourseTitleResponse>(
      GRAPHQL_ENDPOINT,
      courseTitleAndProfByCrnQuery,
      {
        season: seasonCode,
        crn: crn,
      },
    );

    const courseTitle =
      response.computed_listing_info.length > 0
        ? response.computed_listing_info[0].title
        : 'Course Not Found';

    const professorNames =
      response.computed_listing_info.length > 0
        ? response.computed_listing_info[0].professor_names
        : 'Course Not Found';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CourseTable: ${courseTitle}</title>
        <meta name="description" content="Details about ${courseTitle}">
        <meta property="og:title" content="CourseTable: ${courseTitle}">
        <meta property="og:description" content="Professors: ${professorNames}">
        <!-- Other relevant meta tags -->
      </head>
      <body>
        CourseTable: ${courseTitle}
      </body>
      </html>
    `;

    res.status(200).send(htmlContent);
  } catch (error) {
    console.error('Error fetching course title:', error);
    res.status(500).send('Internal Server Error');
  }
}
