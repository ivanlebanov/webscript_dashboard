create database if not exists uboard;

create table if not exists uboard.user (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `gtoken` mediumtext,
  `gid` mediumtext,
  `photo` varchar(200) DEFAULT NULL,
  `gittoken` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`)
) charset 'utf8mb4';
