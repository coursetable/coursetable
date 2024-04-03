-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `StudentBluebookSettings` (
	`netId` char(8) NOT NULL,
	`evaluationsEnabled` tinyint NOT NULL,
	`firstName` varchar(256) DEFAULT 'NULL',
	`lastName` varchar(256) DEFAULT 'NULL',
	`email` varchar(256) DEFAULT 'NULL',
	`upi` int(11) DEFAULT 'NULL',
	`school` varchar(256) DEFAULT 'NULL',
	`year` int(11) DEFAULT 'NULL',
	`college` varchar(256) DEFAULT 'NULL',
	`major` varchar(256) DEFAULT 'NULL',
	`curriculum` varchar(256) DEFAULT 'NULL',
	`challengeTries` int(11) NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `StudentFriendRequests` (
	`id` bigint(20) unsigned AUTO_INCREMENT NOT NULL,
	`netId` char(8) NOT NULL,
	`friendNetId` char(8) NOT NULL,
	CONSTRAINT `netId_friendNetId` UNIQUE(`netId`,`friendNetId`)
);
--> statement-breakpoint
CREATE TABLE `StudentFriends` (
	`id` bigint(20) unsigned AUTO_INCREMENT NOT NULL,
	`netId` char(8) NOT NULL,
	`friendNetId` char(8) NOT NULL,
	CONSTRAINT `netId_friendNetId` UNIQUE(`netId`,`friendNetId`)
);
--> statement-breakpoint
CREATE TABLE `WorksheetCourses` (
	`id` mediumint(8) unsigned AUTO_INCREMENT NOT NULL,
	`netId` char(8) NOT NULL,
	`crn` mediumint(8) unsigned NOT NULL,
	`season` mediumint(8) unsigned NOT NULL,
	`worksheetNumber` mediumint(8) unsigned DEFAULT 0,
	`color` varchar(32) NOT NULL,
	CONSTRAINT `netId_crn_season_worksheetNumber` UNIQUE(`netId`,`crn`,`season`,`worksheetNumber`)
);
--> statement-breakpoint
CREATE INDEX `netId` ON `StudentFriendRequests` (`netId`);--> statement-breakpoint
CREATE INDEX `netId` ON `StudentFriends` (`netId`);--> statement-breakpoint
CREATE INDEX `netId` ON `WorksheetCourses` (`netId`);
*/