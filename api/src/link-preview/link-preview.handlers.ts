import type express from 'express';
import { request } from 'graphql-request';
import { GRAPHQL_ENDPOINT } from '../config.js';
import { courseMetadataQuery } from './link-preview.queries.js';

// For Prettier formatting. If you add a language tag before the template
// literal, it will recognize them as embedded languages and format those
const identity = (strings: TemplateStringsArray, ...values: unknown[]) =>
  String.raw({ raw: strings }, ...values);
const html = identity;

const defaultMetadata = {
  title: 'CourseTable',
  description:
    'CourseTable offers a clean and effective way for Yale students to find the courses they want, bringing together course information, student evaluations, and course demand statistics in an intuitive interface. It is run by a small team of volunteers within the Yale Computer Society and is completely open source.',
};

function renderTemplate({
  title,
  description,
}: {
  title: string;
  description: string;
}): string {
  return html`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <title>${title}</title>
      </head>
      <body>
        <h1>${title}</h1>
        <p>${description}</p>
      </body>
    </html>
  `;
}

export async function generateLinkPreview(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  const courseModalParam = String(req.query['course-modal'] ?? '');
  if (!courseModalParam) {
    res
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(renderTemplate(defaultMetadata));
    return;
  }

  const [seasonCode, crn] = courseModalParam.split('-');
  if (!seasonCode || !crn) {
    res
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(renderTemplate(defaultMetadata));
    return;
  }

  const data = await request<{
    computed_listing_info: {
      course_code: string;
      section: string;
      title: string;
      description: string | null;
    }[];
  }>(GRAPHQL_ENDPOINT, courseMetadataQuery, {
    seasonCode,
    crn: Number(crn),
  });

  if (!data.computed_listing_info.length) {
    res
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(renderTemplate(defaultMetadata));
    return;
  }
  const course = data.computed_listing_info[0]!;
  const title = `${course.course_code} ${course.section.padStart(2, '0')} ${course.title} | CourseTable`;
  const description = truncatedText(
    course.description,
    300,
    'No description available',
  );

  res
    .header('Content-Type', 'text/html; charset=utf-8')
    .send(renderTemplate({ title, description }));
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
