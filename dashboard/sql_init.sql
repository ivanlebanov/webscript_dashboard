create database if not exists uboard;

create table if not exists uboard.user (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `gtoken` mediumtext,
  `gid` mediumtext,
  `photo` varchar(200) DEFAULT NULL,
  `gittoken` varchar(120) DEFAULT NULL,
  `userNews` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`id`)
) charset 'utf8mb4';

create table if not exists uboard.dashboard (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gid` mediumtext,
  `title` varchar(100) DEFAULT NULL,
  `userNews` varchar(400) DEFAULT NULL,
  `showIssues` varchar(100) DEFAULT NULL,
  `showJoke` varchar(100) DEFAULT NULL,
  `showNews` varchar(100) DEFAULT NULL,
  `finishedSetup` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) charset 'utf8mb4';
