\set ON_ERROR_STOP on

BEGIN;

-- Temporary tables shadow any real tables, keeping this test isolated.
CREATE TEMP TABLE "worksheets" (
  "id" integer PRIMARY KEY,
  "netId" text NOT NULL,
  "season" integer NOT NULL,
  "worksheetNumber" integer NOT NULL,
  "name" text NOT NULL,
  "private" boolean NOT NULL DEFAULT false
);
CREATE TEMP TABLE "worksheetCourses" (
  "worksheetId" integer REFERENCES "worksheets" ("id"),
  "crn" integer NOT NULL
);
CREATE TEMP TABLE "savedSearches" (
  "id" integer PRIMARY KEY,
  "name" text NOT NULL
);

INSERT INTO "worksheets" VALUES (1, 'test', 202603, 0, 'Main Worksheet', false);
INSERT INTO "worksheetCourses" VALUES (1, 12345);
INSERT INTO "savedSearches" VALUES (1, 'Existing search');

-- The migration must preserve existing data and tolerate being run again.
\ir personal-blocks.sql
\ir personal-blocks.sql

INSERT INTO "worksheets" ("id", "netId", "season", "worksheetNumber", "name")
VALUES (2, 'test', 202603, 1, 'New worksheet');

DO $$
BEGIN
  IF (SELECT count(*) FROM "worksheets" WHERE "personalBlocks" = '[]'::jsonb) <> 2 THEN
    RAISE EXCEPTION 'Existing and new worksheets must default to empty personal blocks';
  END IF;
  IF NOT EXISTS (
    SELECT FROM "worksheets"
    WHERE "id" = 1 AND "netId" = 'test' AND "season" = 202603
      AND "worksheetNumber" = 0 AND "name" = 'Main Worksheet' AND NOT "private"
  ) OR NOT EXISTS (
    SELECT FROM "worksheetCourses" WHERE "worksheetId" = 1 AND "crn" = 12345
  ) THEN
    RAISE EXCEPTION 'Existing worksheets and courses must be preserved';
  END IF;
  IF NOT EXISTS (
    SELECT FROM pg_attribute
    WHERE attrelid = 'pg_temp.worksheets'::regclass
      AND attname = 'personalBlocks' AND attnotnull
      AND atttypid = 'jsonb'::regtype
  ) THEN
    RAISE EXCEPTION 'Personal blocks must use a non-null JSONB column';
  END IF;
  IF EXISTS (
    SELECT FROM pg_attribute
    WHERE attrelid = 'pg_temp."savedSearches"'::regclass
      AND attname = 'personalBlocks' AND NOT attisdropped
  ) OR NOT EXISTS (
    SELECT FROM "savedSearches" WHERE "id" = 1 AND "name" = 'Existing search'
  ) THEN
    RAISE EXCEPTION 'Saved searches must remain unchanged';
  END IF;
END;
$$;

ROLLBACK;
