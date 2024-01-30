-- This SQL file is only used in development. If you want to make changes to the
-- production database, you have to do it manually through PMA at the moment.

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
  `firstName` varchar(256) DEFAULT NULL COMMENT 'User''s first name',
  `lastName` varchar(256) DEFAULT NULL COMMENT 'User''s last name',
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
-- Table structure for table `StudentFriends`
--

CREATE TABLE `StudentFriends` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `netId` char(8) NOT NULL,
  `friendNetId` char(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `StudentFriendRequests`
--

CREATE TABLE `StudentFriendRequests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `netId` char(8) NOT NULL,
  `friendNetId` char(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `WorksheetCourses`
--

CREATE TABLE `WorksheetCourses` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `netId` char(8) NOT NULL,
  `crn` mediumint(8) UNSIGNED NOT NULL,
  `season` mediumint(8) UNSIGNED NOT NULL,
  `worksheetNumber` mediumint(8) UNSIGNED DEFAULT 0 COMMENT 'Multiple worksheets!',
  `color` varchar(32) NOT NULL COMMENT 'Color of course on worksheet'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Indexes for table `StudentBluebookSettings`
--
ALTER TABLE `StudentBluebookSettings`
  ADD PRIMARY KEY (`netId`);

--
-- Indexes for table `StudentFriends`
--
ALTER TABLE `StudentFriendRequests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `netId_friendNetId` (`netId`, `friendNetId`),
  ADD KEY `netId` (`netId`);

--
-- Indexes for table `StudentFriendRequests`
--
ALTER TABLE `StudentFriends`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `netId_friendNetId` (`netId`, `friendNetId`),
  ADD KEY `netId` (`netId`);

--
-- Indexes for table `WorksheetCourses`
--
ALTER TABLE `WorksheetCourses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `netId_crn_season_worksheetNumber` (`netId`, `crn`, `season`, `worksheetNumber`),
  ADD KEY `netId` (`netId`);

--
-- AUTO_INCREMENT for table `StudentFriends`
--
ALTER TABLE `StudentFriends`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59251421;

--
-- AUTO_INCREMENT for table `StudentFriendRequests`
--
ALTER TABLE `StudentFriendRequests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59251421;

--
-- AUTO_INCREMENT for table `WorksheetCourses`
--
ALTER TABLE `WorksheetCourses`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1213985;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
