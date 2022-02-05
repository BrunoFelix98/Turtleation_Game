DROP DATABASE Turtleation;
CREATE DATABASE Turtleation;

use Turtleation;

CREATE TABLE Player(
	Player_id int primary key not null AUTO_INCREMENT,
	Player_name VARCHAR(255),
	Player_password VARCHAR(255),
	Player_email VARCHAR(255) unique ,
	Player_score int,
	Last_login_time DATETIME,
	Last_logout_time DATETIME
    );

CREATE TABLE Map_tile_type(
	Map_tile_type_id int primary key,
    Map_tile_type_description VARCHAR(255)
	);
    
    #Map_tile_x int, constraint Map_tile_x foreign key(Map_tile_x, Map_tile_y) references Map_tile(Map_tile_x, Map_tile_y) on delete no action on update no action,
    #Map_tile_y int,
    
CREATE TABLE Map_humans_tile_type(
	Map_humans_tile_has_humans int primary key,
    Map_humans_tile_type_description VARCHAR(255)
	);
    
CREATE TABLE Map_tile(
    Map_tile_x int not null,
    Map_tile_y int not null,
    Map_tile_type_id int, foreign key(Map_tile_type_id) references Map_tile_type(Map_tile_type_id),
    Map_tile_has_food boolean,
    Map_tile_has_plastic boolean,
    Map_humans_tile_has_humans int, foreign key(Map_humans_tile_has_humans) references Map_humans_tile_type(Map_humans_tile_has_humans),
    Map_tile_has_nest boolean default false,
    primary key (Map_tile_x, Map_tile_y)
	);
    
CREATE TABLE Turtle_group(
	Turtle_group_id int primary key not null AUTO_INCREMENT,
	Map_tile_x int, constraint Map_tile_x foreign key(Map_tile_x, Map_tile_y) references Map_tile(Map_tile_x, Map_tile_y) on delete no action on update no action,
    Map_tile_y int,
    Turtle_group_amount int,
    Player_id int, foreign key(Player_id) references Player(Player_id)
    );

CREATE TABLE Turtles(
	Turtle_id int primary key AUTO_INCREMENT,
    Turtle_group_id int, foreign key(Turtle_group_id) references Turtle_group(Turtle_group_id),
    Turtle_health int,
    Turtle_lifespan int,
    Turtle_birth_date DATETIME,
    Turtle_last_eaten DATETIME
    );
    
CREATE TABLE Nest_tile(
	Nest_id int primary key auto_increment,
    Turtle_group_id int, foreign key(Turtle_group_id) references Turtle_group(Turtle_group_id),
    Map_tile_x int, foreign key(Map_tile_x, Map_tile_y) references Map_tile(Map_tile_x, Map_tile_y) on delete no action on update no action,
    Map_tile_y int,
    Nest_eggs int,
    Nesting_date DATETIME
	);
    
#------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#Alters
ALTER TABLE Turtle_group AUTO_INCREMENT = 500;

ALTER TABLE Turtles AUTO_INCREMENT = 1;

ALTER TABLE Player AUTO_INCREMENT = 1;
    
#---------------------------------------------------------------------------------------------------------------------------------------------------------
    
#Inserts
insert into Player(Player_id, Player_name, Player_password, Player_email, Player_score, Last_login_time, Last_logout_time) VALUES (1, 'Player', 1234321, "Player@email.com", 1234, '2019-03-22 14:00:00', '2019-03-22 14:00:00');

insert into Map_tile_type(Map_tile_type_id, Map_tile_type_description) VALUES (1, "Water");
insert into Map_tile_type(Map_tile_type_id, Map_tile_type_description) VALUES (2, "Beach");
insert into Map_tile_type(Map_tile_type_id, Map_tile_type_description) VALUES (3, "Land");

insert into Map_humans_tile_type(Map_humans_tile_has_humans, Map_humans_tile_type_description) VALUES (0, "No Humans");
insert into Map_humans_tile_type(Map_humans_tile_has_humans, Map_humans_tile_type_description) VALUES (1, "Good Humans");
insert into Map_humans_tile_type(Map_humans_tile_has_humans, Map_humans_tile_type_description) VALUES (2, "Bad Humans");



#Map creation needs to be made in this exact order: uncomment button on the bottom of the index.html file, run the game on the browser, click the button to create the map, comment the button and run again......
#the line below is an example of how to insert into the map table.
#insert into Map_tile(Map_tile_x, Map_tile_y, Map_tile_type_id, Map_tile_has_food, Map_tile_has_plastic, Map_tile_has_humans, Map_humans_tile_has_bad_humans, Map_tile_has_nest) VALUES (1, 1, 2, true, false, false, false , false);


insert into Turtle_group(Map_tile_x, Map_tile_y, Turtle_group_amount, Player_id) VALUES (10, 10, 1, 1);
insert into Turtle_group(Map_tile_x, Map_tile_y, Turtle_group_amount, Player_id) VALUES (5, 15, 1, 1);

insert into Turtles(Turtle_group_id, Turtle_health, Turtle_lifespan, Turtle_birth_date, Turtle_last_eaten) VALUES (1, 100, 100, '2019-03-22 14:00:00', '2019-03-22 14:00:00');
insert into Turtles(Turtle_group_id, Turtle_health, Turtle_lifespan, Turtle_birth_date, Turtle_last_eaten) VALUES (1, 100, 100, '2019-03-22 14:00:00', '2019-03-22 14:00:00');
insert into Turtles(Turtle_group_id, Turtle_health, Turtle_lifespan, Turtle_birth_date, Turtle_last_eaten) VALUES (2, 100, 100, '2019-03-22 14:00:00', '2019-03-22 14:00:00');
insert into Turtles(Turtle_group_id, Turtle_health, Turtle_lifespan, Turtle_birth_date, Turtle_last_eaten) VALUES (2, 100, 100, '2019-03-22 14:00:00', '2019-03-22 14:00:00');

#insert into Nest_tile(Nest_id, Turtle_group_id, Map_tile_x, Map_tile_y, Nesting_date) VALUES (1, 1, 1, 1, '2019-03-22 14:00:00');

#INSERT INTO Turtle_group (Map_tile_x, Map_tile_y, Turtle_group_amount, Player_id) VALUES (3, 5, 1, 10);

#---------------------------------------------------------------------------------------------------------------------------------------------------------

#Selects
SELECT *from Turtle_group WHERE 1;

SELECT *from Turtles WHERE 1;

SELECT *from Player WHERE 1;

SELECT Player_name, Player_score FROM Player ORDER BY Player_score DESC;

SELECT *from Map_tile WHERE 1;
SELECT COUNT(Map_tile_type_id) from Map_tile;

SELECT *from Map_tile_type WHERE 1;

SELECT *from Map_humans_tile_type WHERE 1;

SELECT *from Nest_tile WHERE 1;

SELECT *from sessions where 1;

SELECT Turtle_group_id  FROM Turtle_group where  Map_tile_x = 18 AND Map_tile_y = 3 AND Turtle_group_id < 500 ;

SELECT * FROM Map_tile where Map_tile_has_nest = 1;

SELECT Map_tile_x, Map_tile_y  FROM Turtle_group where Turtle_group_id >= 500 AND Player_id <> 2;


#---------------------------------------------------------------------------------------------------------------------------------------------------------

#Deletes
DELETE from Turtle_group;

DELETE from Turtles;

DELETE from Player;

DELETE from Map_tile;

DELETE from Map_tile_type;

DELETE from Map_humans_tile_type;

DELETE from Nest_tile;

#---------------------------------------------------------------------------------------------------------------------------------------------------------

#Drops
DROP TABLE Turtles;

DROP TABLE Turtle_group;

DROP TABLE Nest_tile;

DROP TABLE Map_humans_tile_type;

DROP TABLE Map_tile_type;

DROP TABLE Player;

DROP TABLE Map_tile;

#---------------------------------------------------------------------------------------------------------------------------------------------------------

#Updates
UPDATE Turtle_group SET Turtle_group_id = 1;

UPDATE Player SET Player_id = 1;

UPDATE Map_tile_type SET Map_tile_type_id = 1;

UPDATE Map_humans_tile_type SET Map_humans_tile_type_id = 1;

UPDATE Nest_tile SET Nest_tile_id = 1;

UPDATE Turtles SET Turtles_id = 1;

UPDATE Map_tile SET Map_tile_type_id = FLOOR(RAND()*(5));

UPDATE Turtle_group SET Map_tile_x = 1 AND Map_tile_y = 2 WHERE Player_id = 1 and Turtle_group_id = 2 ;