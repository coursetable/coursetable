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
import { sql } from 'drizzle-orm';

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
    netId: varchar('netId', { length: 8 }).notNull(),
    crn: integer('crn').notNull(),
    season: integer('season').notNull(),
    worksheetNumber: integer('worksheetNumber').notNull(),
    color: varchar('color', { length: 32 }).notNull(),
  },
  (table) => ({
    worksheetNetidIdx: index('worksheet_netid_idx').on(table.netId),
    worksheetUniqueIdx: uniqueIndex('worksheet_unique_idx').on(
      table.netId,
      table.crn,
      table.season,
      table.worksheetNumber,
    ),
  }),
);
