// This Vercel middleware generates HTML with Open Graph tags for social media links
import { NextResponse } from '@vercel/edge';

function truncatedText(text, max, defaultStr = '') {
  return text ? (text.length <= max ? text : `${text.slice(0, max)}...`) : defaultStr;
}

export const config = {
  matcher: ['/catalog/:path*', '/worksheet/:path*'],
};

export default async function middleware(req) {
  const userAgent = req.headers.get('User-Agent') ?? '';
  const isBot = /facebookexternalhit|twitterbot|whatsapp|linkedinbot|telegrambot/i.test(userAgent);

  const url = new URL(req.url);
  const courseModalParam = url.searchParams.get('course-modal');

  if (!isBot || !courseModalParam) {
    return NextResponse.next();
  }

  const [seasonCode, crn] = courseModalParam.split('-');
  if (!seasonCode || !crn) {
    return NextResponse.next();
  }

  const apiUrl = 'https://api.coursetable.com/ferry/v1/graphql';
  const query = `
    query GetCourse($season_code: String!, $crn: Int!) {
      computed_listing_info(where: {season_code: {_eq: $season_code}, crn: {_eq: $crn}}) {
        course_code
        section
        title
        description
      }
    }
  `;
  const variables = { season_code: seasonCode, crn: parseInt(crn) };
  const body = JSON.stringify({ query, variables });

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });

    const { data } = await res.json();
    const course = data.computed_listing_info[0];

    if (course) {
      const htmlResponse = `
        <!doctype html>
        <html>
          <head>
            <title>${course.title} | CourseTable</title>
            <meta name="description" content="${truncatedText(course.description, 300)}" />
            <meta property="og:title" content="${course.course_code} ${course.section} ${course.title} | CourseTable" />
            <meta property="og:description" content="${truncatedText(course.description, 300)}" />
            <!-- <meta property="og:image" content="URL_to_an_image" /> -->
            <!-- Additional OG tags as needed -->
          </head>
          <body></body>
        </html>
      `;

      return new Response(htmlResponse, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
  } catch (error) {
    console.error('Error fetching course data:', error);
  }

  return NextResponse.next();
}
