import { next } from '@vercel/edge';

// Utilize the identity function for safer HTML generation
const identity = (
  strings: TemplateStringsArray,
  ...values: (string | number)[]
) => String.raw({ raw: strings }, ...values);

export const config = {
  matcher: ['/catalog', '/worksheet'],
  runtime: 'edge',
};

export default async function middleware(req: Request) {
  const userAgent = req.headers.get('User-Agent') ?? '';
  const isBot =
    /facebook.*|linkedin.*|twitter.*|pinterest.*|bing.*|google.*|whatsapp.*|vercel\sedge\sfunctions/iu.test(
      userAgent,
    );

  const reqURL = new URL(req.url);
  const courseModalParam = reqURL.searchParams.get('course-modal');
  if (!isBot || !courseModalParam) return next();

  const [seasonCode, crn] = courseModalParam.split('-');
  if (!seasonCode || !crn) return next();

  const response = await fetch('https://api.coursetable.com/ferry/v1/graphql', {
    method: 'POST',
    body: JSON.stringify({
      variables: { season_code: seasonCode, crn: Number(crn) },
      query: `
        query GetCourse($season_code: String!, $crn: Int!) {
          computed_listing_info(
            where: { season_code: { _eq: $season_code }, crn: { _eq: $crn } }
          ) {
            course_code
            section
            title
            description
          }
        }
      `,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const { data } = (await response.json()) as {
    data?: {
      computed_listing_info: Array<{
        course_code: string;
        section: string;
        title: string;
        description?: string;
      }>;
    };
  };

  if (!data?.computed_listing_info.length) return next();
  const {
    course_code,
    section,
    title,
    description = 'Description not available',
  } = data.computed_listing_info[0];

  return new Response(
    identity`
    <!doctype html>
    <html>
      <head>
        <title>${course_code} ${section.padStart(2, '0')} ${title} | CourseTable</title>
        <meta name="description" content="${truncatedText(description, 300, 'No description available')}">
        <meta property="og:title" content="${course_code} ${section.padStart(2, '0')} ${title} | CourseTable">
        <meta property="og:description" content="${truncatedText(description, 300, 'No description available')}">
        <!-- TODO: Add og:image -->
        <!-- Additional OG tags as needed -->
      </head>
      <body></body>
    </html>
  `,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    },
  );
}

function truncatedText(
  text: string | null | undefined,
  max: number,
  defaultStr: string,
): string {
  if (!text) return defaultStr;
  else if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}
