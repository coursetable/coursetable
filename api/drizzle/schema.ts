import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  char,
  tinyint,
  varchar,
  int,
  index,
  unique,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const studentBluebookSettings = mysqlTable('StudentBluebookSettings', {
  netId: char('netId', { length: 8 }).notNull(),
  evaluationsEnabled: tinyint('evaluationsEnabled').notNull(),
  firstName: varchar('firstName', { length: 256 }).default('NULL'),
  lastName: varchar('lastName', { length: 256 }).default('NULL'),
  email: varchar('email', { length: 256 }).default('NULL'),
  upi: int('upi').default('NULL'),
  school: varchar('school', { length: 256 }).default('NULL'),
  year: int('year').default('NULL'),
  college: varchar('college', { length: 256 }).default('NULL'),
  major: varchar('major', { length: 256 }).default('NULL'),
  curriculum: varchar('curriculum', { length: 256 }).default('NULL'),
  challengeTries: int('challengeTries').default(0).notNull(),
});

export const studentFriendRequests = mysqlTable(
  'StudentFriendRequests',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().notNull(),
    netId: char('netId', { length: 8 }).notNull(),
    friendNetId: char('friendNetId', { length: 8 }).notNull(),
  },
  (table) => ({
      netId: index('netId').on(table.netId),
      netIdFriendNetId: unique('netId_friendNetId').on(
        table.netId,
        table.friendNetId,
      ),
    }),
);

export const studentFriends = mysqlTable(
  'StudentFriends',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().notNull(),
    netId: char('netId', { length: 8 }).notNull(),
    friendNetId: char('friendNetId', { length: 8 }).notNull(),
  },
  (table) => ({
      netId: index('netId').on(table.netId),
      netIdFriendNetId: unique('netId_friendNetId').on(
        table.netId,
        table.friendNetId,
      ),
    }),
);

export const worksheetCourses = mysqlTable(
  'WorksheetCourses',
  {
    id: mediumint('id').autoincrement().notNull(),
    netId: char('netId', { length: 8 }).notNull(),
    crn: mediumint('crn').notNull(),
    season: mediumint('season').notNull(),
    worksheetNumber: mediumint('worksheetNumber'),
    color: varchar('color', { length: 32 }).notNull(),
  },
  (table) => ({
      netId: index('netId').on(table.netId),
      netIdCrnSeasonWorksheetNumber: unique(
        'netId_crn_season_worksheetNumber',
      ).on(table.netId, table.crn, table.season, table.worksheetNumber),
    }),
);
