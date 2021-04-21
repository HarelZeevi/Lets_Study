CREATE TABLE Cities(id TINYINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
					   cityName VARCHAR(255)

);

CREATE TABLE Students(id VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY, 
					  firstName	VARCHAR(255) NOT NULL,
					  lastName	VARCHAR(255) NOT NULL,
					  age TINYINT NOT NULL,
					  school VARCHAR(255) NOT NULL, 
					  gender CHAR(1) NOT NULL,
					  tutorGender CHAR(1) NOT NULL, 
					  grade	TINYINT NOT NULL,
                      cityId TINYINT NOT NULL,
					  phone	VARCHAR(15),
					  email	VARCHAR(255) NOT NULL,
					  pswd	VARCHAR(255) NOT NULL, 
					  isAccelerated	BOOL,
					  isSpecialEdu 	BOOL,
					  classNum	TINYINT,
					  FOREIGN KEY (cityId) REFERENCES cities(id)
);

CREATE TABLE Tutors(id VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY, 
					isApproved	BOOL NOT NULL,
					rate TINYINT,        
					hobby TEXT,
					TeachSubject TINYINT NOT NULL,
					pupilGender	CHAR(1) NOT NULL,
					isSEQ BOOL NOT NULL
);

CREATE TABLE Workers(id	VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
					 isApproved	BOOL NOT NULL,
					 firstName VARCHAR(255) NOT NULL,
					 lastName VARCHAR(255) NOT NULL,
					 school	VARCHAR(255) NOT NULL,
					 job VARCHAR(255) NOT NULL
);

CREATE TABLE Languages(PRIMARY KEY(studentId, langName),
					   studentId VARCHAR(255) NOT NULL,
					   FOREIGN KEY (studentId) REFERENCES Students(id),
					   langName	VARCHAR(255) NOT NULL
                       
);

CREATE TABLE Schools(id CHAR(6) NOT NULL UNIQUE PRIMARY KEY,
					 SchoolName	VARCHAR(255) NOT NULL,
                     cityId TINYINT NOT NULL,
					 FOREIGN KEY (cityId) REFERENCES cities(id)
);

CREATE TABLE Subjects(id TINYINT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
					  subjectName VARCHAR(255) NOT NULL,
					  points INT,
					  grade INT NOT NULL
);

CREATE TABLE Calendar(id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
					  studentId VARCHAR(255) NOT NULL,
                      FOREIGN KEY (studentId) REFERENCES Students(id),  
				      availableDate	DATE NOT NULL,
					  availableTime	TIME NOT NULL,
                      subjectId TINYINT NOT NULL, 
					  FOREIGN KEY (subjectId) REFERENCES Subjects(id)
);

CREATE TABLE Lessons(id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
					 pupilId VARCHAR(255) NOT NULL,
                     tutorId VARCHAR(255) NOT NULL,
                     pupilCalId INT NOT NULL,
                     tutorCalId INT NOT NULL,
                     subjectId TINYINT NOT NULL,
					 FOREIGN KEY (pupilId) REFERENCES Students(id),
					 FOREIGN KEY (tutorId) REFERENCES Students(id), 
					 FOREIGN KEY (pupilCalId) REFERENCES Calendar(id),
					 FOREIGN KEY (tutorCalId) REFERENCES Calendar(id),
                     FOREIGN KEY (subjectId) REFERENCES Subjects(id),
					 tookPlace BOOL NOT NULL
);

CREATE TABLE Rates(lessonId INT NOT NULL PRIMARY KEY,
				   FOREIGN KEY (lessonId) REFERENCES Lessons(id),
				   rate INT NOT NULL,
                   studentId VARCHAR(255) NOT NULL,
                   workerId VARCHAR(255) NOT NULL,
				   FOREIGN KEY (studentId) REFERENCES Students(id), 
				   FOREIGN KEY (workerId) REFERENCES Workers(id)
);		




