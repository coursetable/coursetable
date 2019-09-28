CREATE TABLE `evaluation_comments` (
  `id` integer  NOT NULL PRIMARY KEY AUTOINCREMENT
,  `course_id` integer  NOT NULL
,  `question_id` char(10) NOT NULL
,  `comment` varchar(4095) NOT NULL
,  `comment_length` integer  NOT NULL
);
CREATE TABLE `evaluation_course_names` (
  `id` integer  NOT NULL PRIMARY KEY AUTOINCREMENT
,  `course_id` integer  NOT NULL
,  `subject` char(4) NOT NULL
,  `number` char(6) NOT NULL
,  `section` integer  NOT NULL
,  `season` integer  NOT NULL
,  `crn` integer  NOT NULL
,  UNIQUE (`subject`,`number`,`section`,`season`)
,  UNIQUE (`crn`,`season`)
);
CREATE TABLE `evaluation_courses` (
  `id` integer  NOT NULL PRIMARY KEY AUTOINCREMENT
,  `season` integer  NOT NULL
,  `title` varchar(255) NOT NULL
,  `enrollment` integer  DEFAULT NULL
);
CREATE TABLE `evaluation_questions` (
  `id` char(10) NOT NULL
,  `text` varchar(255) NOT NULL
,  `options` varchar(255) DEFAULT NULL
,  PRIMARY KEY (`id`)
);
CREATE TABLE `evaluation_ratings` (
  `id` integer  NOT NULL PRIMARY KEY AUTOINCREMENT
,  `course_id` integer  NOT NULL
,  `question_id` char(10) NOT NULL
,  `counts` varchar(255) NOT NULL
);
CREATE INDEX "idx_evaluation_courses_season" ON "evaluation_courses" (`season`);
CREATE INDEX "idx_evaluation_comments_course_id" ON "evaluation_comments" (`course_id`);
CREATE INDEX "idx_evaluation_course_names_course_id" ON "evaluation_course_names" (`course_id`);
