CREATE DATABASE lets_study_users;
USE lets_study_users;

CREATE TABLE cities
  (
     id       TINYINT auto_increment NOT NULL PRIMARY KEY,
     cityname VARCHAR(255)
  );

CREATE TABLE schools
  (
     schoolid         CHAR(6) NOT NULL UNIQUE PRIMARY KEY,
     schoolname       VARCHAR(255) NOT NULL,
     cityid           TINYINT NOT NULL,
     FOREIGN KEY (cityid) REFERENCES cities(id),
     subsleft 		  INT NOT NULL
  );
  
CREATE TABLE students
  (
     StudentCode   VARCHAR(255) NOT NULL UNIQUE,
     id            VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
<<<<<<< HEAD
     userType		   CHAR(1), /* P - pupil or T - tutor */
	 profile_img  MEDIUMBLOB, 
=======
     bio		   VARCHAR(255),
>>>>>>> deb8acd5f816875114b04b24e6dcee5cc36eb24f
     fullname     VARCHAR(255),
     username      VARCHAR(255),
     school        VARCHAR(255) NOT NULL,
     FOREIGN KEY (school) REFERENCES schools(schoolid),
<<<<<<< HEAD
     gender        CHAR(1), /* M - male or F - female */
=======
     gender        CHAR(1),
>>>>>>> deb8acd5f816875114b04b24e6dcee5cc36eb24f
     grade         TINYINT NOT NULL,
     phone         VARCHAR(15),
     email         VARCHAR(255),
     pswd          VARCHAR(255),
     classnum      TINYINT NOT NULL,
     token VARCHAR(255), 
     expiration datetime
  );

CREATE TABLE tutors
  (
     studentid VARCHAR(255) NOT NULL,
     FOREIGN KEY (studentid) REFERENCES students(id),
<<<<<<< HEAD
     bio varchar(255) NOT NULL,
=======
     photo         MEDIUMBLOB, 
>>>>>>> deb8acd5f816875114b04b24e6dcee5cc36eb24f
     isapproved   BOOL NOT NULL,
     rate         FLOAT NOT NULL,
     tutoringHours INT NOT NULL,
     pupilGender  CHAR(1)
  );
 
CREATE TABLE admins
  (
     id         VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
<<<<<<< HEAD
     firstname     VARCHAR(255) NOT NULL,
     lastname      VARCHAR(255) NOT NULL,
     pswd 		VARCHAR(255) NOT NULL,	
     school     VARCHAR(255) NOT NULL,
     phone  	VARCHAR(15) NOT NULL,
     email 		VARCHAR(255) NOT NULL,
=======
     firstname     VARCHAR(255),
     lastname      VARCHAR(255),
     pswd 		VARCHAR(255) NOT NULL,	
     school     VARCHAR(255) NOT NULL,
>>>>>>> deb8acd5f816875114b04b24e6dcee5cc36eb24f
     FOREIGN KEY (school) REFERENCES schools(schoolid)
  );

CREATE TABLE languages
  (
     PRIMARY KEY(studentid, langname),
          studentid VARCHAR(255) NOT NULL,
          FOREIGN KEY (studentid) REFERENCES students(id),
     langname  VARCHAR(255) NOT NULL
  );



CREATE TABLE subjects
  (
     studentid     VARCHAR(255) NOT NULL,
	 FOREIGN KEY (studentid) REFERENCES students(id),
     subjectname VARCHAR(255) NOT NULL,
     points      INT,
     grade       INT NOT NULL
  );

CREATE TABLE calendar
  (
	 id            INT auto_increment NOT NULL PRIMARY KEY,
	 studentid     VARCHAR(255) NOT NULL,
	 FOREIGN KEY (studentid) REFERENCES students(id),
	 availabledate DATE NOT NULL,
	 starttime TIME NOT NULL,
	 endtime TIME NOT NULL
  );

CREATE TABLE lessons
  (
     id         INT auto_increment NOT NULL PRIMARY KEY,
     pupilid    VARCHAR(255) NOT NULL,
     tutorid    VARCHAR(255) NOT NULL,
     tutorcalid INT NOT NULL,
     subjectName VARCHAR(255) NOT NULL,
          FOREIGN KEY (pupilid) REFERENCES students(id),
          FOREIGN KEY (tutorid) REFERENCES students(id),
          FOREIGN KEY (tutorcalid) REFERENCES calendar(id),
     points      INT,
     grade       INT NOT NULL,
     tookplace  BOOL NOT NULL,
     room VARCHAR(255) NOT NULL
  );

CREATE TABLE rates
  (
		  tutorid VARCHAR(255) NOT NULL,
		  FOREIGN KEY (tutorid) REFERENCES students(id),
		  lessonid  INT NOT NULL PRIMARY KEY,
          FOREIGN KEY (lessonid) REFERENCES lessons(id),
          rate      INT NOT NULL
          
  );  