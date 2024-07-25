import type express from 'express';
import { getSdk } from './link-preview.queries.js';
import { graphqlClient } from '../config.js';
import winston from '../logging/winston.js';

// For Prettier formatting. If you add a language tag before the template
// literal, it will recognize them as embedded languages and format those
const identity = (strings: TemplateStringsArray, ...values: unknown[]) =>
  String.raw({ raw: strings }, ...values);
const html = identity;

const defaultMetadata = {
  title: 'CourseTable',
  description:
    'CourseTable offers a clean and effective way for Yale students to find the courses they want, bringing together course information, student evaluations, and course demand statistics in an intuitive interface. It is run by a small team of volunteers within the Yale Computer Society and is completely open source.',
  image: 'https://coursetable.com/favicon.png',
};

function renderTemplate({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}): string {
  // TODO: use summary_large_image for Twitter cards once we have images
  return html`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <meta name="og:title" content="${title}" />
        <meta name="og:description" content="${description}" />
        <meta name="og:locale" content="en" />
        <meta name="og:image" content="${image}" />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="${image}" />
      </head>
      <body>
        <h1>${title}</h1>
        <p>${description}</p>
      </body>
    </html>
  `;
}

async function getCourseMetadata(query: unknown) {
  const [seasonCode, crn] = String(query).split('-');
  if (!seasonCode || !crn) return defaultMetadata;
  const data = await getSdk(graphqlClient).courseMetadata({
    seasonCode,
    crn: Number(crn),
  });
  if (!data.listings.length) return defaultMetadata;
  const listing = data.listings[0]!;
  return {
    title: `${listing.course_code} ${listing.section.padStart(2, '0')} ${listing.course.title} | CourseTable`,
    description: truncatedText(
      listing.course.description,
      300,
      'No description available',
    ),
    image: 'https://coursetable.com/favicon.png',
  };
}

async function getPageMetadata(url: unknown) {
  // TODO: we should probably just dynamically render these HTML pages
  switch (url) {
    case '/releases/link-preview':
      return {
        title:
          'Optimizing Bot Traffic Handling for Link Previews: a Long Journey',
        description:
          "This post summarizes our recent effort to make social media links display a preview card. In the process, we gained a lot of insight about CourseTable's infrastructure setup. We will also share the paths we've explored and our eventual solution, hoping that these conclusions can help others in a similar situation.",
        image: 'https://coursetable.com/favicon.png',
      };
    case '/releases/quist':
      return {
        title: 'Introducing Quist, a new query language for CourseTable',
        description:
          'The goal of Quist is to provide a more powerful and flexible way to filter and search for classes on CourseTable. We believe that Quist will enable a lot of advanced use cases that are otherwise difficult to express with purely graphical interfaces.',
        image: 'https://coursetable.com/favicon.png',
      };
    case '/releases/fall23':
      return {
        title: 'CourseTable 23Fall/Winter Release Notes',
        description:
          'Discover the latest features and improvements in our Fall 2023 update.',
        image: 'https://coursetable.com/favicon.png',
      };
    default:
      return defaultMetadata;
  }
}

export async function generateLinkPreview(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  // log url accessed
  winston.info(
    `Preview request sent to url: ${req.url} by ${req.headers['user-agent'] ?? 'unknown'}`,
  );
  winston.info(
    `Generating link preview for ${String(req.query['course-modal'] ?? req.query.url ?? 'unknown')}, request by ${req.headers['user-agent'] ?? 'unknown'}`,
  );
  let metadata = defaultMetadata;
  if (req.query.url) metadata = await getPageMetadata(req.query.url);
  else if (req.query['course-modal'])
    metadata = await getCourseMetadata(req.query['course-modal']);
  winston.info(`Generated link preview for ${metadata.title}`);

  res
    .header('Content-Type', 'text/html; charset=utf-8')
    .send(renderTemplate(metadata));
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
