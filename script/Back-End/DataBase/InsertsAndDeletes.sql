INSERT INTO Cities 
(cityName)
VALUES
("Ramat Gan");

INSERT INTO workers
            (
                        id ,
                        isapproved,
                        firstname,
                        lastname,
                        school,
                        job
            )
            VALUES
            (
                        "342665978",
                        true,
                        "Avi",
                        "Yaakovi",
                        "Amit Bar Ilan",
                        "Teacher"
            );
           
           
INSERT INTO students
            (
                        id,
                        firstname,  
                        lastname,
                        age,
                        school,
                        gender,
                        tutorgender,
                        grade,
                        cityid,
                        phone,
                        email,
                        pswd,
                        isaccelerated bool,
                        isspecialedu bool,
                        classnum tinyint,
            )
            VALUES
            (
                        "123456789",
                        "Ori",
                        "Granevich",
                        16,
                        "Amit",
                        "F",
                        "F",
                        10,
                        1,
                        "0542316577",
                        "John@gmail.com", "1234", True, False, 2);
                        
INSERT INTO tutors
            (
                        ,
                        isapproved,
                        rate,
                        hobby,
                        teachsubject,
                        pupilgender,
                        isSEQ
            )
            VALUES
            (
                        "123456789",
                        true,
                        4,
                        "Basketball",
                        "English",
                        "F",
                        false
            );
   
  
DELETE FROM cities
WHERE  cityname = "ramat gan";
DELETE FROM students
WHERE  firstname = "ilay"; 
DELETE FROM tutors
WHERE  isapproved = true; 
DELETE FROM workers
WHERE  isapproved = true; 
DELETE FROM languages
WHERE  studentid = 278917655
       AND langname = "english"; 
DELETE FROM schools
WHERE  schoolname = "amit bar ilan"; 
DELETE FROM subjects
WHERE  subjectname = "math"; 
DELETE FROM calendar
WHERE  studentid = 328456722; 
DELETE FROM lessons
WHERE  tookplace = true; 
DELETE FROM rates
WHERE  studentid = 328456722; 
