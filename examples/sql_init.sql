

create database if not exists uboard;

create table if not exists uboard.user (
  id int primary key auto_increment,
  firstname varchar(100),
  lastname varchar(100),
  gtoken varchar(100)
) charset 'utf8mb4';
