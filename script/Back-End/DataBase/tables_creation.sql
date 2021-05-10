 CREATE TABLE cities
  (
     id       TINYINT auto_increment NOT NULL PRIMARY KEY,
     cityname VARCHAR(255)
  );

CREATE TABLE students
  (
     id            VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
     firstname     VARCHAR(255) NOT NULL,
     lastname      VARCHAR(255) NOT NULL,
     age           TINYINT NOT NULL,
     school        VARCHAR(255) NOT NULL,
     gender        CHAR(1) NOT NULL,
     partnergender CHAR(1) NOT NULL,
     grade         TINYINT NOT NULL,
     cityid        TINYINT NOT NULL,
     phone         VARCHAR(15),
     email         VARCHAR(255) NOT NULL,
     pswd          VARCHAR(255) NOT NULL,
     isaccelerated BOOL,
     isspecialedu  BOOL,
     classnum      TINYINT,
     FOREIGN KEY (cityid) REFERENCES cities(id)
  );

CREATE TABLE tutors
  (
     studentid VARCHAR(255) NOT NULL,
     FOREIGN KEY (studentid) REFERENCES students(id),
     isapproved   BOOL NOT NULL,
     rate         TINYINT,
     hobby        TEXT,
     teachsubject TINYINT NOT NULL,
     pupilgender  CHAR(1) NOT NULL,
     isseq        BOOL NOT NULL
  );

CREATE TABLE workers
  (
     id         VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
     isapproved BOOL NOT NULL,
     firstname  VARCHAR(255) NOT NULL,
     lastname   VARCHAR(255) NOT NULL,
     school     VARCHAR(255) NOT NULL,
     job        VARCHAR(255) NOT NULL
  );

CREATE TABLE languages
  (
     PRIMARY KEY(studentid, langname),
          studentid VARCHAR(255) NOT NULL,
          FOREIGN KEY (studentid) REFERENCES students(id),
     langname  VARCHAR(255) NOT NULL
  );

CREATE TABLE schools
  (
     schoolid         CHAR(6) NOT NULL UNIQUE PRIMARY KEY,
     schoolname VARCHAR(255) NOT NULL,
     cityid     TINYINT NOT NULL,
     FOREIGN KEY (cityid) REFERENCES cities(id)
  );

CREATE TABLE subjects
  (
     id          TINYINT auto_increment NOT NULL PRIMARY KEY,
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
          availabletime TIME NOT NULL,
          subjectid     TINYINT NOT NULL,
     FOREIGN KEY (subjectid) REFERENCES subjects(id)
  );

CREATE TABLE lessons
  (
     id         INT auto_increment NOT NULL PRIMARY KEY,
     pupilid    VARCHAR(255) NOT NULL,
     tutorid    VARCHAR(255) NOT NULL,
     pupilcalid INT NOT NULL,
     tutorcalid INT NOT NULL,
     subjectid  TINYINT NOT NULL,
          FOREIGN KEY (pupilid) REFERENCES students(id),
          FOREIGN KEY (tutorid) REFERENCES students(id),
          FOREIGN KEY (pupilcalid) REFERENCES calendar(id),
          FOREIGN KEY (tutorcalid) REFERENCES calendar(id),
          FOREIGN KEY (subjectid) REFERENCES subjects(id),
     tookplace  BOOL NOT NULL
  );

CREATE TABLE rates
  (
     lessonid  INT NOT NULL PRIMARY KEY,
          FOREIGN KEY (lessonid) REFERENCES lessons(id),
          rate      INT NOT NULL,
          studentid VARCHAR(255) NOT NULL,
          workerid  VARCHAR(255) NOT NULL,
     FOREIGN KEY (studentid) REFERENCES students(id),
     FOREIGN KEY (workerid) REFERENCES workers(id)
  );  
