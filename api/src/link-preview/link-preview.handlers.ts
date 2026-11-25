import type express from 'express';
import LZString from 'lz-string';
import { renderCoursePreviewImage } from './link-preview.image.js';
import { getSdk } from './link-preview.queries.js';
import { graphqlClient } from '../config.js';
import winston from '../logging/winston.js';

// Escapes special HTML characters to prevent XSS when interpolating
// user-controlled values into HTML strings
function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#39;');
}

// Tagged template literal that auto-escapes all interpolated values
const html = (strings: TemplateStringsArray, ...values: unknown[]): string =>
  strings.reduce(
    (result, str, i) =>
      result + str + (i < values.length ? escapeHtml(values[i]) : ''),
    '',
  );

type Metadata = {
  title: string;
  description: string;
  image: string;
  // Whether the image is a wide card rather than a small logo
  largeImage?: boolean;
};

const defaultMetadata: Metadata = {
  title: 'CourseTable',
  description:
    'CourseTable offers a clean and effective way for Yale students to find the courses they want, bringing together course information, student evaluations, and course demand statistics in an intuitive interface. It is run by a small team of volunteers within the Yale Computer Society and is completely open source.',
  image: 'https://coursetable.com/favicon.png',
};

function renderTemplate({
  title,
  description,
  image,
  largeImage,
}: Metadata): string {
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
        <meta
          name="twitter:card"
          content="${largeImage ? 'summary_large_image' : 'summary'}"
        />
        <meta name="twitter:image" content="${image}" />
      </head>
      <body>
        <h1>${title}</h1>
        <p>${description}</p>
      </body>
    </html>
  `;
}

// The course-modal query looks like 202403-10471 (season code-CRN)
async function fetchListing(query: unknown) {
  if (!/^\d{6}-\d{5}$/u.test(String(query))) return null;
  const [seasonCode, crn] = String(query).split('-');
  if (!seasonCode || !crn) return null;
  const data = await getSdk(graphqlClient).courseMetadata({
    listingId:
      (Number.parseInt(seasonCode, 10) - 200000) * 100000 +
      Number.parseInt(crn, 10),
  });
  return data.listings_by_pk;
}

async function getCourseMetadata(
  query: unknown,
  origin: string,
): Promise<Metadata> {
  const listing = await fetchListing(query);
  if (!listing) return defaultMetadata;
  return {
    title: `${listing.course_code} ${listing.section.padStart(2, '0')} ${listing.course.title} | CourseTable`,
    description: truncatedText(
      listing.course.description,
      300,
      'No description available',
    ),
    image: `${origin}/api/link-preview/image?course-modal=${encodeURIComponent(String(query))}`,
    largeImage: true,
  };
}

function getWorksheetMetadata(url: string) {
  try {
    const urlObj = new URL(url, 'https://coursetable.com');
    if (urlObj.pathname !== '/worksheet') return null;

    const wsParam = urlObj.searchParams.get('ws');
    if (!wsParam) return null;

    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(wsParam);
      if (!decompressed) return null;

      const parsed = JSON.parse(decompressed) as {
        name?: string;
        creatorName?: string;
      };

      if (!parsed.name) return null;

      const title = parsed.creatorName
        ? `${parsed.name} by ${parsed.creatorName} | CourseTable Worksheet`
        : `${parsed.name} | CourseTable Worksheet`;
      const description = parsed.creatorName
        ? `View ${parsed.creatorName}'s worksheet: ${parsed.name}`
        : `View worksheet: ${parsed.name}`;

      return {
        title,
        description,
        image: 'https://coursetable.com/favicon.png',
      };
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

function getPageMetadata(url: string): Metadata {
  // Check if it's a worksheet URL first
  const worksheetMetadata = getWorksheetMetadata(url);
  if (worksheetMetadata) return worksheetMetadata;

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
    case '/releases/spring26':
      return {
        title: 'CourseTable 2025 + Spring 2026 Release Notes',
        description:
          'Discover the latest features and improvements in our 2025 + Spring 2026 update.',
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
  // Log url accessed
  winston.info(
    `Generating link preview for ${String(req.query['course-modal']?.toString() ?? req.query.url?.toString() ?? 'unknown')}, request by ${req.headers['user-agent'] ?? 'unknown'}`,
  );
  let metadata = defaultMetadata;
  if (req.query.url) {
    metadata = getPageMetadata(req.query.url as string);
  } else if (req.query['course-modal']) {
    metadata = await getCourseMetadata(
      req.query['course-modal'],
      // The image is served by this same API
      `${req.protocol}://${req.get('host') ?? 'api.coursetable.com'}`,
    );
  }
  winston.info(`Generated link preview for ${metadata.title}`);

  res
    .header('Content-Type', 'text/html; charset=utf-8')
    .send(renderTemplate(metadata));
}

// Rendered images by course-modal value. Bounded so it can't grow without
// limit, expiring with the same lifetime as the Cache-Control header, and
// storing the promise so concurrent requests for a course share one render.
const IMAGE_CACHE_MAX_ENTRIES = 200;
const IMAGE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const imageCache = new Map<
  string,
  { expiresAt: number; image: Promise<Buffer | null> }
>();

function getCoursePreviewImage(query: string): Promise<Buffer | null> {
  const cached = imageCache.get(query);
  if (cached && cached.expiresAt > Date.now()) return cached.image;
  imageCache.delete(query);

  const image = fetchListing(query).then((listing) =>
    listing ? renderCoursePreviewImage(listing) : null,
  );
  imageCache.set(query, { expiresAt: Date.now() + IMAGE_CACHE_TTL_MS, image });
  // Maps iterate in insertion order, so the first key is the oldest entry
  if (imageCache.size > IMAGE_CACHE_MAX_ENTRIES)
    imageCache.delete(imageCache.keys().next().value!);

  // Only keep successful renders; unknown courses and failures are retried
  const evict = () => {
    if (imageCache.get(query)?.image === image) imageCache.delete(query);
  };
  image.then((png) => {
    if (!png) evict();
  }, evict);
  return image;
}

export async function generateLinkPreviewImage(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  const query = req.query['course-modal'];
  const image =
    typeof query === 'string' ? await getCoursePreviewImage(query) : null;
  if (!image) {
    res.status(404).send('Course not found');
    return;
  }
  res
    .header('Content-Type', 'image/png')
    // Crawlers cache previews anyway, and course info rarely changes
    .header('Cache-Control', 'public, max-age=86400')
    .send(image);
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
