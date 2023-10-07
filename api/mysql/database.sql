-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Aug 28, 2021 at 12:38 AM
-- Server version: 10.6.4-MariaDB-1:10.6.4+maria~focal
-- PHP Version: 7.4.20

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
CREATE DATABASE IF NOT EXISTS `yaleplus` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `yaleplus`;

-- --------------------------------------------------------

--
-- Table structure for table `StudentBluebookSettings`
--

CREATE TABLE `StudentBluebookSettings` (
  `netId` char(8) NOT NULL,
  `evaluationsEnabled` tinyint(1) UNSIGNED NOT NULL,
  `first_name` varchar(256) DEFAULT NULL COMMENT 'User''s first name',
  `last_name` varchar(256) DEFAULT NULL COMMENT 'User''s last name',
  `email` varchar(256) DEFAULT NULL COMMENT 'User''s email address',
  `upi` int(11) DEFAULT NULL COMMENT 'Universal Personal Identifier used by Yale Directory',
  `school` varchar(256) DEFAULT NULL COMMENT 'User''s school',
  `year` int(11) DEFAULT NULL COMMENT 'User''s year of graduation',
  `college` varchar(256) DEFAULT NULL COMMENT 'User''s residential college',
  `major` varchar(256) DEFAULT NULL COMMENT ' User''s major',
  `curriculum` varchar(256) DEFAULT NULL COMMENT 'User''s curriculum (for grad students)',
  `challengeTries` int(11) NOT NULL DEFAULT 0 COMMENT 'Number of attempts at challenge'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `StudentFacebookFriends`
--

CREATE TABLE `StudentFacebookFriends` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `netId` char(8) NOT NULL,
  `name` varchar(255) NOT NULL,
  `facebookId` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `Students`
--

CREATE TABLE `Students` (
  `netId` char(8) NOT NULL DEFAULT '',
  `facebookId` bigint(20) UNSIGNED NOT NULL,
  `facebookDataJson` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `WorksheetCourses`
--

CREATE TABLE `WorksheetCourses` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `net_id` char(8) NOT NULL,
  `oci_id` mediumint(8) UNSIGNED NOT NULL,
  `season` mediumint(8) UNSIGNED NOT NULL,
  `worksheet_number` mediumint(8) UNSIGNED DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Table structure for table `SavedCourses`

CREATE TABLE `SavedCourses` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `net_id` char(8) NOT NULL,
  `oci_id` mediumint(8) UNSIGNED NOT NULL,
  `season` mediumint(8) UNSIGNED NOT NULL,
  `course_code` char(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `StudentBluebookSettings`
--
ALTER TABLE `StudentBluebookSettings`
  ADD PRIMARY KEY (`netId`);

--
-- Indexes for table `StudentFacebookFriends`
--
ALTER TABLE `StudentFacebookFriends`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `netId_friendFacebookId` (`netId`,`facebookId`),
  ADD KEY `netId` (`netId`);

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
  ADD UNIQUE KEY `net_id_oci_id_season_worksheet_number` (`net_id`,`oci_id`,`season`, `worksheet_number`),
  ADD KEY `net_id` (`net_id`);

  --
-- Indexes for table `SavedCourses`
--
ALTER TABLE `SavedCourses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `net_id_oci_id_season_course_code` (`net_id`, `course_code`),
  ADD KEY `net_id` (`net_id`);


--
-- AUTO_INCREMENT for dumped tables
--

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

--
-- AUTO_INCREMENT for table `SavedCourses`
--
ALTER TABLE `SavedCourses`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1213985;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
