import { and, eq, inArray, sql } from 'drizzle-orm';

import {
  colorThemes,
  studentBluebookSettings,
  worksheetCourses,
  worksheets,
} from '../../drizzle/schema.js';
import { db } from '../config.js';

// Copied to each user the first time they load their themes. The frontend
// keeps its own copy of Classic as a fallback; keep the two in sync.
const defaultColorThemes = [
  {
    name: 'Classic',
    colors: [
      '#31a4d4',
      '#2cafb7',
      '#26ba9a',
      '#49be85',
      '#6cc26f',
      '#a3b24b',
      '#daa126',
      '#df8653',
      '#ca5f53',
      '#ba7881',
    ],
  },
  {
    name: 'Sakura',
    colors: [
      '#f7b7c8',
      '#ef8fa8',
      '#e06c8a',
      '#c94f6d',
      '#a83a52',
      '#b8d8a8',
      '#8fbf7f',
      '#6a9f5b',
      '#4f8a5b',
      '#3b6e47',
    ],
  },
  {
    name: 'Sunset',
    colors: [
      '#5b2a86',
      '#8a3b8f',
      '#b84a8c',
      '#e0607e',
      '#f07f6a',
      '#f59e5b',
      '#f7b84b',
      '#e86a3a',
      '#c94b3a',
      '#9c3a4f',
    ],
  },
  {
    name: 'Pastel',
    colors: [
      '#f6c1c1',
      '#f8d9a8',
      '#f5eba3',
      '#c7e8b0',
      '#a8dcd1',
      '#a9cdeb',
      '#c3b8ec',
      '#e2b8e6',
      '#f2c4dc',
      '#d6d2c4',
    ],
  },
  {
    name: 'Bow Wow Wow',
    colors: [
      '#7fa9d9',
      '#5d90cc',
      '#3f78bd',
      '#286dc0',
      '#1f5ca8',
      '#174b8f',
      '#0f4079',
      '#00356b',
      '#002d5c',
      '#00264d',
    ],
  },
  {
    name: 'Greyscale',
    colors: [
      '#a3a3a3',
      '#989898',
      '#8c8c8c',
      '#808080',
      '#747474',
      '#686868',
      '#5d5d5d',
      '#525252',
      '#474747',
      '#3d3d3d',
    ],
  },
];

/**
 * Gives a user the default themes the first time they need them, and marks
 * which of their existing course colors came from Classic (the only palette
 * before themes existed).
 */
export async function ensureColorThemesSeeded(netId: string): Promise<void> {
  const settings = await db.query.studentBluebookSettings.findFirst({
    where: eq(studentBluebookSettings.netId, netId),
    columns: { colorThemesSeeded: true },
  });
  if (!settings || settings.colorThemesSeeded) return;

  const [classic, ...rest] = defaultColorThemes;
  await db.transaction(async (tx) => {
    // Claim the seed. A concurrent seed (e.g. worksheets and themes loading at
    // once) waits on this row, then matches nothing and skips.
    const [claimed] = await tx
      .update(studentBluebookSettings)
      .set({ colorThemesSeeded: true })
      .where(
        and(
          eq(studentBluebookSettings.netId, netId),
          eq(studentBluebookSettings.colorThemesSeeded, false),
        ),
      )
      .returning({ netId: studentBluebookSettings.netId });
    if (!claimed) return;

    await tx
      .insert(colorThemes)
      .values([
        { netId, ...classic!, isDefault: true },
        ...rest.map((theme) => ({ netId, ...theme })),
      ]);

    const classicColors = sql`ARRAY[${sql.join(
      classic!.colors.map((c) => sql`${c}`),
      sql`, `,
    )}]::text[]`;
    // Array_position is 1-based and null when not found (a custom color)
    await tx
      .update(worksheetCourses)
      .set({
        colorIndex: sql`array_position(${classicColors}, lower(${worksheetCourses.color})) - 1`,
      })
      .where(
        inArray(
          worksheetCourses.worksheetId,
          tx
            .select({ id: worksheets.id })
            .from(worksheets)
            .where(eq(worksheets.netId, netId)),
        ),
      );
  });
}
