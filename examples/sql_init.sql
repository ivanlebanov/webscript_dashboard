create database if not exists pictures;

create table if not exists pictures.picture (
  id int primary key auto_increment,
  title varchar(100),
  filename varchar(60)
) charset 'utf8mb4';

insert ignore into pictures.picture values (1, 'I caught a little fish...', '1.png');
insert ignore into pictures.picture values (2, 'The fish I caught was this big.', '2.png');
insert ignore into pictures.picture values (3, 'The fish I caught was quite big.', '3.png');
insert ignore into pictures.picture values (4, "I caught the biggest fish you've ever seen.", '4.png');

create database if not exists uboard;

create table if not exists uboard.user (
  id int primary key auto_increment,
  firstname varchar(100),
  lastname varchar(100),
  gtoken varchar(100)
) charset 'utf8mb4';
