import { relations, sql } from 'drizzle-orm';
import {
  pgTable,
  boolean,
  varchar,
  bigint,
  uniqueIndex,
  index,
  bigserial,
  serial,
  integer,
} from 'drizzle-orm/pg-core';

export const studentBluebookSettings = pgTable('studentBluebookSettings', {
  netId: varchar('netId', { length: 8 }).primaryKey().notNull(),
  evaluationsEnabled: boolean('evaluationsEnabled').notNull(),
  firstName: varchar('firstName', { length: 256 }).default(sql`NULL`),
  lastName: varchar('lastName', { length: 256 }).default(sql`NULL`),
  email: varchar('email', { length: 256 }).default(sql`NULL`),
  upi: bigint('upi', { mode: 'number' }),
  school: varchar('school', { length: 256 }).default(sql`NULL`),
  year: bigint('year', { mode: 'number' }),
  college: varchar('college', { length: 256 }).default(sql`NULL`),
  major: varchar('major', { length: 256 }).default(sql`NULL`),
  curriculum: varchar('curriculum', { length: 256 }).default(sql`NULL`),
  // You can use { mode: "bigint" }
  // if numbers are exceeding js number limitations
  challengeTries: bigint('challengeTries', { mode: 'number' })
    .default(0)
    .notNull(),
});

export const studentFriendRequests = pgTable(
  'studentFriendRequests',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey().notNull(),
    netId: varchar('netId', { length: 8 }).notNull(),
    friendNetId: varchar('friendNetId', { length: 8 }).notNull(),
  },
  (table) => ({
    friendRequestsUniqueIdx: uniqueIndex('friend_requests_unique_idx').on(
      table.netId,
      table.friendNetId,
    ),
    friendRequestsNetidIdx: index('friend_requests_netid_idx').on(table.netId),
  }),
);

export const studentFriends = pgTable(
  'studentFriends',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey().notNull(),
    netId: varchar('netId', { length: 8 }).notNull(),
    friendNetId: varchar('friendNetId', { length: 8 }).notNull(),
  },
  (table) => ({
    friendsUniqueIdx: uniqueIndex('friends_unique_idx').on(
      table.netId,
      table.friendNetId,
    ),
    friendsNetidIdx: index('friends_netid_idx').on(table.netId),
  }),
);

export const worksheetCourses = pgTable(
  'worksheetCourses',
  {
    id: serial('id').primaryKey().notNull(),
    worksheetId: integer('worksheetId')
      .notNull()
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .references(() => worksheets.id),
    crn: integer('crn').notNull(),
    color: varchar('color', { length: 32 }).notNull(),
    // Hidden can be null, which means the hidden status is unknown.
    // In the past hidden status was stored in client side, so unless
    // the user has synced hidden state with the server, it will be null.
    hidden: boolean('hidden'),
  },
  (table) => ({
    worksheetIdIdx: index('worksheet_id_idx').on(table.worksheetId),
    worksheetCoursesUniqueIdx: uniqueIndex('worksheet_courses_unique_idx').on(
      table.worksheetId,
      table.crn,
    ),
  }),
);

export const worksheets = pgTable(
  'worksheets',
  {
    id: serial('id').primaryKey().notNull(),
    netId: varchar('netId', { length: 8 }).notNull(),
    season: integer('season').notNull(),
    worksheetNumber: integer('worksheetNumber').notNull(),
    name: varchar('name', { length: 64 }).notNull(),
  },
  (table) => ({
    worksheetsUniqueIdx: uniqueIndex('worksheets_unique_idx').on(
      table.netId,
      table.season,
      table.worksheetNumber,
    ),
  }),
);

export const worksheetToCourses = relations(worksheets, ({ many }) => ({
  courses: many(worksheetCourses),
}));

export const coursesToWorksheet = relations(worksheetCourses, ({ one }) => ({
  worksheet: one(worksheets, {
    fields: [worksheetCourses.worksheetId],
    references: [worksheets.id],
  }),
}));

export const wishlistCourses = pgTable(
  'wishlistCourses',
  {
    id: serial('id').primaryKey().notNull(),
    netId: varchar('netId', { length: 8 }).notNull(),
    courseCode: varchar('courseCode', { length: 16 }).notNull(),
  },
  (table) => ({
    wishlistNetidIdx: index('wishlist_netid_idx').on(table.netId),
    wishlistUniqueIdx: uniqueIndex('wishlist_unique_idx').on(
      table.netId,
      table.courseCode,
    ),
  }),
);
