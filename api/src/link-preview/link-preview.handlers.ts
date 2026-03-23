import type express from 'express';
import LZString from 'lz-string';
import { getSdk } from './link-preview.queries.js';
import { graphqlClient } from '../config.js';
import winston from '../logging/winston.js';

const SITE_ORIGIN = 'https://coursetable.com';

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

const defaultMetadata = {
  title: 'CourseTable',
  description:
    'CourseTable offers a clean and effective way for Yale students to find the courses they want, bringing together course information, student evaluations, and course demand statistics in an intuitive interface. It is run by a small team of volunteers within the Yale Computer Society and is completely open source.',
  image: `${SITE_ORIGIN}/favicon.png`,
};

type JsonLdObject = { [key: string]: unknown };

type PageModel = {
  title: string;
  description: string;
  image: string;
  canonicalUrl: string;
  jsonLd?: JsonLdObject;
};

function webPageJsonLd(
  url: string,
  name: string,
  description: string,
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    name,
    description,
    isPartOf: {
      '@type': 'WebSite',
      name: 'CourseTable',
      url: SITE_ORIGIN,
    },
  };
}

function jsonLdScript(data: JsonLdObject): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</gu, '\\u003c')}</script>`;
}

function renderTemplate(page: PageModel): string {
  const { title, description, image, canonicalUrl, jsonLd } = page;
  const ld = jsonLd ? jsonLdScript(jsonLd) : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
${ld}
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<p>${escapeHtml(description)}</p>
</body>
</html>`;
}

function toAbsoluteCoursetableUrl(urlOrPath: string): string {
  const base = new URL(SITE_ORIGIN);
  const u = new URL(urlOrPath, SITE_ORIGIN);
  if (u.origin !== base.origin) return `${SITE_ORIGIN}${u.pathname}${u.search}`;
  return `${u.origin}${u.pathname}${u.search}`;
}

async function getCourseLinkPreviewPage(
  courseModalParam: string,
): Promise<PageModel | null> {
  if (!/^\d{6}-\d{5}$/u.test(courseModalParam)) return null;
  const [seasonCode, crn] = courseModalParam.split('-');
  if (!seasonCode || !crn) return null;
  const data = await getSdk(graphqlClient).courseMetadata({
    listingId:
      (Number.parseInt(seasonCode, 10) - 200000) * 100000 +
      Number.parseInt(crn, 10),
  });
  if (!data.listings_by_pk) return null;
  const listing = data.listings_by_pk;
  const title = `${listing.course_code} ${listing.section.padStart(2, '0')} ${listing.course.title} | CourseTable`;
  const description = truncatedText(
    listing.course.description,
    300,
    'No description available',
  );
  const canonicalUrl = `${SITE_ORIGIN}/catalog?course-modal=${courseModalParam}`;
  const courseName = `${listing.course_code} ${listing.section.padStart(2, '0')}: ${listing.course.title}`;
  const jsonLd: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: courseName,
    description: truncatedText(listing.course.description, 500, description),
    url: canonicalUrl,
    provider: {
      '@type': 'Organization',
      name: 'CourseTable',
      url: SITE_ORIGIN,
    },
  };
  return {
    title,
    description,
    image: defaultMetadata.image,
    canonicalUrl,
    jsonLd,
  };
}

async function getProfessorLinkPreviewPage(
  professorId: number,
  rawProfParam: string,
): Promise<PageModel | null> {
  const data = await getSdk(graphqlClient).professorMetadata({
    professorId,
  });
  const [prof] = data.professors;
  if (!prof) return null;
  const canonicalUrl = `${SITE_ORIGIN}/catalog?prof-modal=${rawProfParam}`;
  const title = `${prof.name} | CourseTable`;
  const description =
    prof.courses_taught > 0
      ? `View ${prof.name}'s courses and teaching history on CourseTable (${prof.courses_taught} courses).`
      : `View ${prof.name}'s courses on CourseTable.`;
  const jsonLd: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: prof.name,
    url: canonicalUrl,
    jobTitle: 'Instructor',
    worksFor: { '@type': 'Organization', name: 'Yale University' },
  };
  return {
    title,
    description,
    image: defaultMetadata.image,
    canonicalUrl,
    jsonLd,
  };
}

function getWorksheetMetadata(url: string) {
  try {
    const urlObj = new URL(url, SITE_ORIGIN);
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
        image: defaultMetadata.image,
      };
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

function getPageMetadata(url: string) {
  const worksheetMetadata = getWorksheetMetadata(url);
  if (worksheetMetadata) return worksheetMetadata;

  switch (url) {
    case '/releases/link-preview':
      return {
        title:
          'Optimizing Bot Traffic Handling for Link Previews: a Long Journey',
        description:
          "This post summarizes our recent effort to make social media links display a preview card. In the process, we gained a lot of insight about CourseTable's infrastructure setup. We will also share the paths we've explored and our eventual solution, hoping that these conclusions can help others in a similar situation.",
        image: defaultMetadata.image,
      };
    case '/releases/quist':
      return {
        title: 'Introducing Quist, a new query language for CourseTable',
        description:
          'The goal of Quist is to provide a more powerful and flexible way to filter and search for classes on CourseTable. We believe that Quist will enable a lot of advanced use cases that are otherwise difficult to express with purely graphical interfaces.',
        image: defaultMetadata.image,
      };
    case '/releases/fall23':
      return {
        title: 'CourseTable 23Fall/Winter Release Notes',
        description:
          'Discover the latest features and improvements in our Fall 2023 update.',
        image: defaultMetadata.image,
      };
    default:
      return defaultMetadata;
  }
}

function pageFromUrlQueryParam(urlParam: string): PageModel {
  const metadata = getPageMetadata(urlParam);
  const canonicalUrl = toAbsoluteCoursetableUrl(urlParam);
  return {
    ...metadata,
    canonicalUrl,
    jsonLd: webPageJsonLd(canonicalUrl, metadata.title, metadata.description),
  };
}

function defaultPageModel(canonicalUrl: string = SITE_ORIGIN): PageModel {
  return {
    ...defaultMetadata,
    canonicalUrl,
    jsonLd: webPageJsonLd(
      canonicalUrl,
      defaultMetadata.title,
      defaultMetadata.description,
    ),
  };
}

function firstQueryValue(q: unknown): string {
  if (typeof q === 'string') return q;
  if (Array.isArray(q) && typeof q[0] === 'string') return q[0];
  return '';
}

async function resolveLinkPreviewPage(
  req: express.Request,
): Promise<PageModel> {
  const courseQ = req.query['course-modal'];
  const profQ = req.query['prof-modal'];
  const urlQ = req.query.url;
  if (firstQueryValue(urlQ))
    return pageFromUrlQueryParam(firstQueryValue(urlQ));
  if (typeof courseQ === 'string') {
    const parsed = await getCourseLinkPreviewPage(courseQ);
    return (
      parsed ??
      defaultPageModel(
        `${SITE_ORIGIN}/catalog?course-modal=${encodeURIComponent(courseQ)}`,
      )
    );
  }
  if (typeof profQ === 'string') {
    const trimmed = profQ.trim();
    const id = Number.parseInt(trimmed, 10);
    if (!/^\d+$/u.test(trimmed) || !Number.isInteger(id) || id < 1) {
      return defaultPageModel(
        `${SITE_ORIGIN}/catalog?prof-modal=${encodeURIComponent(trimmed)}`,
      );
    }
    const parsed = await getProfessorLinkPreviewPage(id, trimmed);
    return (
      parsed ??
      defaultPageModel(
        `${SITE_ORIGIN}/catalog?prof-modal=${encodeURIComponent(trimmed)}`,
      )
    );
  }
  return defaultPageModel();
}

export async function generateLinkPreview(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  const courseQ = req.query['course-modal'];
  const profQ = req.query['prof-modal'];
  const urlQ = req.query.url;
  winston.info(
    `Generating link preview for course-modal=${firstQueryValue(courseQ)} prof-modal=${firstQueryValue(profQ)} url=${firstQueryValue(urlQ)}, UA=${String(req.headers['user-agent'] ?? '')}`,
  );

  const page = await resolveLinkPreviewPage(req);

  winston.info(`Generated link preview for ${page.title}`);

  res
    .header('Content-Type', 'text/html; charset=utf-8')
    .send(renderTemplate(page));
}

function truncatedText(
  text: string | null | undefined,
  max: number,
  defaultStr: string,
): string {
  if (!text) return defaultStr;
  else if (text.length > max) return `${text.slice(0, max)}...`;
  return text;
}
