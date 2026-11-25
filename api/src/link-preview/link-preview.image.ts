import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { Resvg } from '@resvg/resvg-js';
import satori, { type Font } from 'satori';

import type { CourseMetadataQuery } from './link-preview.queries.js';

type Listing = NonNullable<CourseMetadataQuery['listings_by_pk']>;

// Recommended size for og:image; also works for summary_large_image cards
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 630;

// Kept in sync with frontend/src/utilities/constants.ts
const skillsAreasColors: { [code: string]: string } = {
  Hu: '#9970AB',
  So: '#4393C3',
  Sc: '#5AAE61',
  QR: '#CC3311',
  WR: '#EC7014',
  L: '#000000',
  ...Object.fromEntries([1, 2, 3, 4, 5].map((i) => [`L${i}`, '#888888'])),
};
const weekdayAbbrevs = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

const MAX_PROFESSORS = 3;

type VNode = {
  type: string;
  props: { [key: string]: unknown; children?: unknown };
  key: null;
};

// Satori takes React elements, but the API doesn't depend on React
function h(
  type: string,
  style: { [key: string]: unknown },
  children?: unknown,
  props: { [key: string]: unknown } = {},
): VNode {
  return { type, props: { ...props, style, children }, key: null };
}

const require = createRequire(import.meta.url);

function readAsset(name: string) {
  return fs.readFile(new URL(`./assets/${name}`, import.meta.url));
}

// Full (unsubsetted) Inter files: satori doesn't reliably pick between
// same-named subset files, which left some characters (e.g. ʿ) as missing
// glyphs. Literal paths so depcheck can see the dependency
const fontFiles = [
  [
    400,
    require.resolve('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
  ],
  [700, require.resolve('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf')],
] as const;

function loadFonts(): Promise<Font[]> {
  return Promise.all(
    fontFiles.map(async ([weight, file]) => ({
      name: 'Inter',
      weight,
      style: 'normal' as const,
      data: await fs.readFile(file),
    })),
  );
}

async function loadResources() {
  const [fonts, icon, wordmark] = await Promise.all([
    loadFonts(),
    readAsset('bluebook.svg'),
    readAsset('wordmark_outlines.svg'),
  ]);
  const toDataUri = (svg: Buffer) =>
    `data:image/svg+xml;base64,${svg.toString('base64')}`;
  return { fonts, icon: toDataUri(icon), wordmark: toDataUri(wordmark) };
}

// Loaded once, on first use
let resources: ReturnType<typeof loadResources> | null = null;

function toSeasonString(seasonCode: string): string {
  const year = seasonCode.substring(0, 4);
  const season = ['Spring', 'Summer', 'Fall'][Number(seasonCode[5]) - 1];
  return season ? `${season} ${year}` : year;
}

function to12HourTime(time: string): string {
  const [hour = '0', minute = '0'] = time.split(':');
  const hourInt = Number.parseInt(hour, 10);
  const ampm = hourInt >= 12 ? 'pm' : 'am';
  return `${hourInt % 12 || 12}:${minute.padStart(2, '0')}${ampm}`;
}

function toTimesSummary(meetings: Listing['course']['course_meetings']) {
  const [meeting] = meetings;
  if (!meeting) return 'TBA';
  let days = weekdayAbbrevs
    .filter((_, day) => meeting.days_of_week & (1 << day))
    .join('');
  if (days === 'MTWThF') days = 'M–F';
  const summary = `${days} ${to12HourTime(meeting.start_time)}–${to12HourTime(meeting.end_time)}`;
  return meetings.length > 1 ? `${summary} + ${meetings.length - 1}` : summary;
}

function toProfessorsSummary(
  professors: Listing['course']['course_professors'],
) {
  const names = professors.map((p) => p.professor.name);
  if (names.length === 0) return 'Instructor TBA';
  if (names.length <= MAX_PROFESSORS) return names.join(', ');
  return `${names.slice(0, MAX_PROFESSORS).join(', ')} +${names.length - MAX_PROFESSORS}`;
}

function badge(code: string) {
  const color = skillsAreasColors[code] ?? '#888888';
  return h(
    'div',
    {
      display: 'flex',
      padding: '2px 14px',
      borderRadius: 8,
      border: `3px solid ${color}`,
      color,
      fontSize: 26,
      fontWeight: 700,
    },
    code,
  );
}

function detail(label: string, value: string) {
  return h('div', { display: 'flex', flexDirection: 'column', gap: 4 }, [
    h('div', { fontSize: 24, color: '#6c757d' }, label),
    h('div', { fontSize: 32, fontWeight: 700, color: '#212529' }, value),
  ]);
}

export async function renderCoursePreviewImage(
  listing: Listing,
): Promise<Buffer> {
  // Don't keep a failed load around, or every later render would fail too
  resources ??= loadResources().catch((err: unknown) => {
    resources = null;
    throw err;
  });
  const { fonts, icon, wordmark } = await resources;
  const { course } = listing;
  // Areas and skills are stored as JSON arrays of codes
  const codes = [
    ...((course.areas ?? []) as string[]),
    ...((course.skills ?? []) as string[]),
  ];
  const credits = course.credits ?? 0;

  const element = h(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      padding: '56px 72px',
      backgroundColor: '#ffffff',
      borderTop: '16px solid #468ff2',
      fontFamily: 'Inter',
    },
    [
      h('div', { display: 'flex', alignItems: 'center', gap: 16 }, [
        h('img', { height: 48 }, undefined, {
          src: icon,
          width: 48,
          height: 48,
        }),
        // The wordmark's viewBox is 944.78 × 137.6
        h('img', { height: 34 }, undefined, {
          src: wordmark,
          width: 233,
          height: 34,
        }),
      ]),
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: 12, marginTop: 56 },
        [
          h(
            'div',
            {
              display: 'flex',
              marginRight: 12,
              fontSize: 40,
              fontWeight: 700,
              color: '#468ff2',
            },
            `${listing.course_code} ${listing.section.padStart(2, '0')}`,
          ),
          ...codes.map(badge),
        ],
      ),
      h(
        'div',
        {
          display: 'block',
          marginTop: 12,
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.15,
          color: '#212529',
          lineClamp: 2,
        },
        course.title,
      ),
      h('div', { display: 'flex', flexGrow: 1 }),
      h('div', { display: 'flex', alignItems: 'flex-end', gap: 64 }, [
        detail('Season', toSeasonString(course.season_code)),
        detail('Meets', toTimesSummary(course.course_meetings)),
        ...(credits ? [detail('Credits', String(credits))] : []),
      ]),
      h(
        'div',
        {
          display: 'block',
          marginTop: 28,
          fontSize: 32,
          color: '#495057',
          lineClamp: 1,
        },
        toProfessorsSummary(course.course_professors),
      ),
    ],
  );

  const svg = await satori(element as unknown as Parameters<typeof satori>[0], {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    fonts,
  });
  // Text is already converted to paths by satori, so system fonts are unused
  // and scanning them on every render is slow
  return new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();
}
