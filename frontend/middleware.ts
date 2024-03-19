// This is a Vercel middleware that sends HTML containing fake HTML for social
// media links
import { next } from '@vercel/edge';

// For Prettier formatting. If you add a language tag before the template
// literal, it will recognize them as embedded languages and format those
const identity = (strings: TemplateStringsArray, ...values: unknown[]) =>
  String.raw({ raw: strings }, ...values);
const html = identity;
const gql = identity;

export const config = {
  matcher: ['/catalog', '/worksheet'],
  runtime: 'edge',
};

export default async function middleware(req: Request) {
  const userAgent = req.headers.get('User-Agent') ?? '';
  const isBot =
    /facebook|linkedin|twitter|pinterest|discord|bing|google|whatsapp|slack|vercel\sedge\sfunctions/iu.test(
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
  });

  const { data } = (await response.json()) as {
    data?: {
      computed_listing_info: {
        course_code: string;
        section: string;
        title: string;
        description: string | null;
      }[];
    };
  };

  if (!data?.computed_listing_info.length) return next();
  const course = data.computed_listing_info[0]!;
  const title = `${course.course_code} ${course.section.padStart(2, '0')} ${
    course.title
  } | CourseTable`;
  const description = truncatedText(
    course.description,
    300,
    'No description available',
  );
  const encodedTitle = encodeURIComponent(title);

  return new Response(
    html`
      <!doctype html>
      <html>
        <head>
          <title>${title}</title>
          <meta name="description" content="${description}" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta
            property="og:image"
            content="https://coursetable.com/api/opengraph/${encodedTitle}"
          />
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
