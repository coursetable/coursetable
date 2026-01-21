import { parseArgs } from 'node:util';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { studentBluebookSettings, studentFriendRequests } from './schema.js';

const { values } = parseArgs({
  options: {
    count: { type: 'string', default: '5' },
    requests: { type: 'string', default: '0' },
    prefix: { type: 'string', default: 'test' },
    clean: { type: 'boolean', default: false },
  },
});

const count = Number(values.count);
const requests = Number(values.requests);
const prefix = values.prefix.trim();
const NETID_MAX_LEN = 8;

if (!Number.isFinite(count) || count < 0)
  throw new Error('count must be a non-negative number');
if (!Number.isFinite(requests) || requests < 0)
  throw new Error('requests must be a non-negative number');
if (prefix.length === 0 || prefix.length >= NETID_MAX_LEN)
  throw new Error('prefix must be 1-7 characters');

const dbUrl = process.env.DB_URL;
if (!dbUrl) throw new Error('DB_URL is required');

const firstNames = ['John', 'Jane', 'Baby', 'Mary', 'Richard'];
const lastNames = ['Doe', 'Doe', 'Doe', 'Roe', 'Roe'];
const majors = ['CS', 'Math', 'Econ', 'History', 'Physics'];
const colleges = [
  'Trumbull',
  'Saybrook',
  'Branford',
  'Jonathan Edwards',
  'Morse',
];

const suffixLength = Math.max(1, NETID_MAX_LEN - prefix.length);
const makeNetId = (i: number) =>
  `${prefix}${String(i).padStart(suffixLength, '0')}`.slice(0, NETID_MAX_LEN);

const users = Array.from({ length: count }, (_, i) => {
  const netId = makeNetId(i + 1);
  const firstName = firstNames[i % firstNames.length]!;
  const lastName = lastNames[i % lastNames.length]!;
  return {
    netId,
    evaluationsEnabled: true,
    firstName,
    lastName,
    email: `${netId}@example.com`,
    year: 2025 + (i % 4),
    school: 'YC',
    major: majors[i % majors.length]!,
    college: colleges[i % colleges.length]!,
  };
});

const pool = postgres(dbUrl);
const db = drizzle(pool);
const prefixLike = `${prefix}%`;

await db.transaction(async (tx) => {
  if (values.clean) {
    await tx.execute(
      sql`DELETE FROM "studentFriendRequests" WHERE "netId" LIKE ${prefixLike} OR "friendNetId" LIKE ${prefixLike}`,
    );
    await tx.execute(
      sql`DELETE FROM "studentFriends" WHERE "netId" LIKE ${prefixLike} OR "friendNetId" LIKE ${prefixLike}`,
    );
    await tx.execute(
      sql`DELETE FROM "studentBluebookSettings" WHERE "netId" LIKE ${prefixLike}`,
    );
  }

  if (users.length) {
    await tx
      .insert(studentBluebookSettings)
      .values(users)
      .onConflictDoUpdate({
        target: studentBluebookSettings.netId,
        set: {
          evaluationsEnabled: sql`excluded."evaluationsEnabled"`,
          firstName: sql`excluded."firstName"`,
          lastName: sql`excluded."lastName"`,
          email: sql`excluded."email"`,
          year: sql`excluded."year"`,
          school: sql`excluded."school"`,
          major: sql`excluded."major"`,
          college: sql`excluded."college"`,
        },
      });
  }

  if (requests > 0 && users.length > 1) {
    const pairs = new Set<string>();
    const requestRows: { netId: string; friendNetId: string }[] = [];

    while (requestRows.length < requests && pairs.size < users.length ** 2) {
      const fromIdx = Math.floor(Math.random() * users.length);
      const toIdx = Math.floor(Math.random() * users.length);
      if (fromIdx === toIdx) continue;
      const from = users[fromIdx]!.netId;
      const to = users[toIdx]!.netId;
      const key = `${from}|${to}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      requestRows.push({ netId: from, friendNetId: to });
    }

    if (requestRows.length) {
      await tx
        .insert(studentFriendRequests)
        .values(requestRows)
        .onConflictDoNothing();
    }
  }
});

await pool.end();

console.log(
  `Seeded ${users.length} users${requests ? ` and ${requests} friend requests` : ''}.`,
);
