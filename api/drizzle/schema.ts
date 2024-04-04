import {
  pgTable,
  char,
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

export const studentbluebooksettings = pgTable('studentbluebooksettings', {
  netid: char('netid', { length: 8 }).primaryKey().notNull(),
  evaluationsenabled: boolean('evaluationsenabled').notNull(),
  firstname: varchar('firstname', { length: 256 }).default(sql`NULL`),
  lastname: varchar('lastname', { length: 256 }).default(sql`NULL`),
  email: varchar('email', { length: 256 }).default(sql`NULL`),
  // You can use { mode: "bigint" }
  // if numbers are exceeding js number limitations
  upi: bigint('upi', { mode: 'number' }),
  school: varchar('school', { length: 256 }).default(sql`NULL`),
  year: bigint('year', { mode: 'number' }),
  college: varchar('college', { length: 256 }).default(sql`NULL`),
  major: varchar('major', { length: 256 }).default(sql`NULL`),
  curriculum: varchar('curriculum', { length: 256 }).default(sql`NULL`),
  challengetries: bigint('challengetries', { mode: 'number' })
    .default(0)
    .notNull(),
});

export const studentfriendrequests = pgTable(
  'studentfriendrequests',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey().notNull(),
    netid: char('netid', { length: 8 }).notNull(),
    friendnetid: char('friendnetid', { length: 8 }).notNull(),
  },
  (table) => ({
    friendRequestsUniqueIndex: uniqueIndex('friend_requests_unique_idx').on(
      table.netid,
      table.friendnetid,
    ),
    friendRequestsNetidIndex: index('friend_requests_netid_idx').on(
      table.netid,
    ),
  }),
);

export const studentfriends = pgTable(
  'studentfriends',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey().notNull(),
    netid: char('netid', { length: 8 }).notNull(),
    friendnetid: char('friendnetid', { length: 8 }).notNull(),
  },
  (table) => ({
    friendsUniqueIndex: uniqueIndex('friends_unique_idx').on(
      table.netid,
      table.friendnetid,
    ),
    friendsNetidIndex: index('friends_netid_idx').on(table.netid),
  }),
);

export const worksheetcourses = pgTable(
  'worksheetcourses',
  {
    id: serial('id').primaryKey().notNull(),
    netid: char('netid', { length: 8 }).notNull(),
    crn: integer('crn').notNull(),
    season: integer('season').notNull(),
    worksheetnumber: integer('worksheetnumber').default(0),
    color: varchar('color', { length: 32 }).notNull(),
  },
  (table) => ({
    worksheetNetidIndex: index('worksheet_netid_idx').on(table.netid),
    worksheetUniqueIndex: uniqueIndex('worksheet_unique_idx').on(
      table.netid,
      table.crn,
      table.season,
      table.worksheetnumber,
    ),
  }),
);
