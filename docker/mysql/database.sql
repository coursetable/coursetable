-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Mar 27, 2021 at 04:43 PM
-- Server version: 10.5.9-MariaDB-1:10.5.9+maria~focal
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yaleplus`
--
CREATE DATABASE IF NOT EXISTS `yaleplus` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `yaleplus`;

-- --------------------------------------------------------

--
-- Table structure for table `BluebookEvents`
--

CREATE TABLE `BluebookEvents` (
  `netId` char(8) NOT NULL,
  `time` int(10) UNSIGNED NOT NULL,
  `event` varchar(32) NOT NULL,
  `data` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `StudentBluebookSettings`
--

CREATE TABLE `StudentBluebookSettings` (
  `netId` char(8) NOT NULL,
  `shareCoursesEnabled` tinyint(1) NOT NULL DEFAULT 1,
  `facebookLastUpdated` int(10) UNSIGNED NOT NULL COMMENT 'Last time at which the student''s Facebook friends were fetched',
  `seenDisclaimer` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether the student has seen the disclaimer saying to not shop classes based on purely evaluations',
  `noticeLastSeen` int(10) UNSIGNED NOT NULL COMMENT 'Timestamp of when the notice was last seen',
  `timesNoticeSeen` tinyint(3) UNSIGNED NOT NULL,
  `viewException` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Whether to allow the particular NetID to access CourseTable even if they''re not a Yale College student',
  `challengeTries` smallint(5) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'How many times the student has tried to get access to a Bluebook data file',
  `evaluationsEnabled` tinyint(1) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `StudentCoursesTaken`
--

CREATE TABLE `StudentCoursesTaken` (
  `id` int(10) UNSIGNED NOT NULL,
  `netId` char(8) NOT NULL DEFAULT '0',
  `subject` char(4) NOT NULL DEFAULT '0',
  `number` char(6) NOT NULL DEFAULT '0',
  `season` mediumint(8) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `StudentFacebookFriends`
--

CREATE TABLE `StudentFacebookFriends` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `netId` char(8) NOT NULL,
  `name` varchar(255) NOT NULL,
  `facebookId` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `StudentPetitions`
--

CREATE TABLE `StudentPetitions` (
  `netId` char(8) NOT NULL,
  `name` varchar(30) NOT NULL COMMENT 'User-inputted name',
  `comment` varchar(4095) NOT NULL,
  `public` tinyint(1) UNSIGNED NOT NULL,
  `time` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Students`
--

CREATE TABLE `Students` (
  `netId` char(8) NOT NULL DEFAULT '',
  `facebookId` bigint(20) UNSIGNED NOT NULL,
  `facebookDataJson` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `WorksheetCourses`
--

CREATE TABLE `WorksheetCourses` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `net_id` char(8) NOT NULL,
  `oci_id` mediumint(8) UNSIGNED NOT NULL,
  `season` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `BluebookEvents`
--
ALTER TABLE `BluebookEvents`
  ADD PRIMARY KEY (`netId`,`time`);

--
-- Indexes for table `StudentBluebookSettings`
--
ALTER TABLE `StudentBluebookSettings`
  ADD PRIMARY KEY (`netId`);

--
-- Indexes for table `StudentCoursesTaken`
--
ALTER TABLE `StudentCoursesTaken`
  ADD PRIMARY KEY (`id`),
  ADD KEY `netId` (`netId`) USING HASH;

--
-- Indexes for table `StudentFacebookFriends`
--
ALTER TABLE `StudentFacebookFriends`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `netId_friendFacebookId` (`netId`,`facebookId`),
  ADD KEY `netId` (`netId`);

--
-- Indexes for table `StudentPetitions`
--
ALTER TABLE `StudentPetitions`
  ADD PRIMARY KEY (`netId`);

--
-- Indexes for table `Students`
--
ALTER TABLE `Students`
  ADD PRIMARY KEY (`netId`),
  ADD KEY `facebookId` (`facebookId`);

--
-- Indexes for table `WorksheetCourses`
--
ALTER TABLE `WorksheetCourses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `net_id_oci_id_season` (`net_id`,`oci_id`,`season`),
  ADD KEY `net_id` (`net_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `StudentCoursesTaken`
--
ALTER TABLE `StudentCoursesTaken`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17412;

--
-- AUTO_INCREMENT for table `StudentFacebookFriends`
--
ALTER TABLE `StudentFacebookFriends`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59251421;

--
-- AUTO_INCREMENT for table `WorksheetCourses`
--
ALTER TABLE `WorksheetCourses`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1213985;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
