// This is a Vercel middleware that sends HTML containing fake HTML for social
// media links
import { next } from '@vercel/edge';

function truncatedText(
  text: string | null | undefined,
  max: number,
  defaultStr: string,
) {
  if (!text) return defaultStr;
  else if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

export const config = {
  matcher: ['/catalog', '/worksheet'],
  runtime: 'edge',
};

// For Prettier formatting
const identity = (strings: TemplateStringsArray, ...values: unknown[]) =>
  String.raw({ raw: strings }, ...values);
const html = identity;
const gql = identity;

export default async function middleware(req: Request) {
  const userAgent = req.headers.get('User-Agent') ?? '';
  const isBot =
    /facebook.*|linkedin.*|twitter.*|pinterest.*|bing.*|google.*|whatsapp.*/iu.test(
      userAgent,
    );

  const reqURL = new URL(req.url);
  const courseModalParam = reqURL.searchParams.get('course-modal');
  if (!isBot || !courseModalParam) return next();

  const [seasonCode, crn] = courseModalParam.split('-');
  if (!seasonCode || !crn) return next();
  const res = (await fetch('https://api.coursetable.com/ferry/v1/graphql', {
    method: 'POST',
    body: JSON.stringify({
      variables: { season_code: seasonCode, crn: Number(crn) },
      query: gql`
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
  }).then((res) => res.json())) as {
    data?: {
      computed_listing_info: {
        course_code: string;
        section: string;
        title: string;
        description: string | null;
      }[];
    };
  };
  if (!res.data?.computed_listing_info.length) return next();
  const course = res.data.computed_listing_info[0]!;
  return new Response(
    html`
      <!doctype html>
      <html>
        <head>
          <title>
            ${course.course_code} ${course.section.padStart(2, '0')}
            ${course.title} | CourseTable
          </title>
          <meta
            name="description"
            content="${truncatedText(course.description, 300, '')}"
          />
          <meta
            property="og:title"
            content="${course.course_code} ${course.section.padStart(
              2,
              '0',
            )} ${course.title} | CourseTable"
          />
          <meta
            property="og:description"
            content="${truncatedText(course.description, 300, '')}"
          />
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
