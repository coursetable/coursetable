DO $$ BEGIN
 CREATE TYPE "profile_visibility" AS ENUM('self', 'friends', 'public');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "savedSearches" (
	"id" serial PRIMARY KEY NOT NULL,
	"netId" varchar(8) NOT NULL,
	"name" varchar(64) NOT NULL,
	"queryString" varchar(2048) NOT NULL,
	"createdAt" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "studentBluebookSettings" (
	"netId" varchar(8) PRIMARY KEY NOT NULL,
	"evaluationsEnabled" boolean NOT NULL,
	"evaluationsRevoked" boolean DEFAULT false NOT NULL,
	"firstName" varchar(256) DEFAULT NULL,
	"lastName" varchar(256) DEFAULT NULL,
	"preferredFirstName" varchar(256) DEFAULT NULL,
	"preferredLastName" varchar(256) DEFAULT NULL,
	"nameVisibility" "profile_visibility" DEFAULT 'public' NOT NULL,
	"emailVisibility" "profile_visibility" DEFAULT 'self' NOT NULL,
	"yearVisibility" "profile_visibility" DEFAULT 'friends' NOT NULL,
	"schoolVisibility" "profile_visibility" DEFAULT 'friends' NOT NULL,
	"majorVisibility" "profile_visibility" DEFAULT 'friends' NOT NULL,
	"profilePageEnabled" boolean DEFAULT true NOT NULL,
	"allowAnonymousProfileView" boolean DEFAULT false NOT NULL,
	"email" varchar(256) DEFAULT NULL,
	"upi" bigint,
	"school" varchar(256) DEFAULT NULL,
	"year" bigint,
	"college" varchar(256) DEFAULT NULL,
	"major" varchar(256) DEFAULT NULL,
	"curriculum" varchar(256) DEFAULT NULL,
	"challengeTries" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "studentFriendRequests" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"netId" varchar(8) NOT NULL,
	"friendNetId" varchar(8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "studentFriends" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"netId" varchar(8) NOT NULL,
	"friendNetId" varchar(8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlistCourses" (
	"id" serial PRIMARY KEY NOT NULL,
	"netId" varchar(8) NOT NULL,
	"season" integer NOT NULL,
	"crn" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "worksheetCourses" (
	"id" serial PRIMARY KEY NOT NULL,
	"worksheetId" integer NOT NULL,
	"crn" integer NOT NULL,
	"color" varchar(32) NOT NULL,
	"hidden" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "worksheets" (
	"id" serial PRIMARY KEY NOT NULL,
	"netId" varchar(8) NOT NULL,
	"season" integer NOT NULL,
	"worksheetNumber" integer NOT NULL,
	"name" varchar(64) NOT NULL,
	"private" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "saved_searches_netid_idx" ON "savedSearches" ("netId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "saved_searches_name_unique_idx" ON "savedSearches" ("netId","name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "friend_requests_unique_idx" ON "studentFriendRequests" ("netId","friendNetId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friend_requests_netid_idx" ON "studentFriendRequests" ("netId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "friends_unique_idx" ON "studentFriends" ("netId","friendNetId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "friends_netid_idx" ON "studentFriends" ("netId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_netid_idx" ON "wishlistCourses" ("netId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "wishlist_unique_idx" ON "wishlistCourses" ("netId","season","crn");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "worksheet_id_idx" ON "worksheetCourses" ("worksheetId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "worksheet_courses_unique_idx" ON "worksheetCourses" ("worksheetId","crn");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "worksheets_unique_idx" ON "worksheets" ("netId","season","worksheetNumber");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "worksheetCourses" ADD CONSTRAINT "worksheetCourses_worksheetId_worksheets_id_fk" FOREIGN KEY ("worksheetId") REFERENCES "worksheets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
